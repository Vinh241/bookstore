import React, { useState, useEffect } from "react";
import {
  fetchAdminSalesByDate,
  fetchAdminSalesByCategory,
  fetchAdminBestsellingProducts,
} from "@/lib/api";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

// Thêm import cho ảnh mặc định và URL backend
import defaultBookImage from "@/assets/images/books.avif";
import { BACKEND_URL } from "@/constants";

interface SalesData {
  date: string;
  total_amount: string;
  order_count: string;
}

interface ChartData {
  date: string;
  amount: number;
  orders: number;
}

interface CategorySales {
  name: string;
  amount: string;
  percentage: number;
}

interface BestsellingProduct {
  id: number;
  name: string;
  price: string;
  quantity_sold: number;
  image_url?: string;
  category_name?: string;
  images?: Array<{
    image_url: string;
    is_primary: boolean;
  }>;
}

// Custom tooltip for the charts
const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded">
        <p className="font-medium text-sm">{`${label}`}</p>
        <p className="text-blue-600 text-sm">
          {`Doanh thu: ${Number(payload[0].value).toLocaleString("vi-VN")} ₫`}
        </p>
        {payload[1] && (
          <p className="text-green-600 text-sm">
            {`Đơn hàng: ${payload[1].value}`}
          </p>
        )}
      </div>
    );
  }

  return null;
};

const AdminSales: React.FC = () => {
  const [dateRange, setDateRange] = useState("month");
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [topCategories, setTopCategories] = useState<CategorySales[]>([]);
  const [bestsellingProducts, setBestsellingProducts] = useState<
    BestsellingProduct[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [salesSummary, setSalesSummary] = useState({
    total: 0,
    orders: 0,
    average: 0,
    increase: 0,
  });

  // Function to get product image
  const getProductImage = (product: BestsellingProduct) => {
    // Nếu sản phẩm có mảng images, ưu tiên dùng ảnh có is_primary = true
    if (product.images && product.images.length > 0) {
      const imageUrl =
        product.images.find((img) => img.is_primary)?.image_url ||
        product.images[0].image_url;

      // Thêm baseURL nếu đường dẫn là tương đối
      if (imageUrl && imageUrl.startsWith("/")) {
        return `${BACKEND_URL}${imageUrl}`;
      }
      return imageUrl;
    }

    // Nếu không có mảng images, dùng image_url
    if (product.image_url) {
      if (product.image_url.startsWith("/")) {
        return `${BACKEND_URL}${product.image_url}`;
      }
      return product.image_url;
    }

    // Trả về ảnh mặc định nếu không có ảnh
    return defaultBookImage;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // Calculate date range based on selection
      const endDate = new Date();
      let startDate = new Date();

      if (dateRange === "week") {
        startDate.setDate(endDate.getDate() - 7);
      } else if (dateRange === "month") {
        startDate.setMonth(endDate.getMonth() - 1);
      } else if (dateRange === "year") {
        startDate.setFullYear(endDate.getFullYear() - 1);
      }

      const formatDateStr = (date: Date) => {
        return date.toISOString().split("T")[0];
      };

      try {
        // Fetch sales data by date
        const salesByDate = await fetchAdminSalesByDate(
          formatDateStr(startDate),
          formatDateStr(endDate)
        );

        // Fetch top selling categories
        const categorySales = await fetchAdminSalesByCategory(
          formatDateStr(startDate),
          formatDateStr(endDate)
        );

        // Fetch bestselling products
        const bestProducts = await fetchAdminBestsellingProducts(3);

        setSalesData(salesByDate);

        // Transform sales data for chart
        const transformedData = salesByDate.map((item: SalesData) => ({
          date: formatChartDate(item.date),
          amount: parseFloat(item.total_amount),
          orders: parseInt(item.order_count),
        }));

        setChartData(transformedData);
        setTopCategories(categorySales);
        setBestsellingProducts(bestProducts);

        // Calculate sales summary
        if (salesByDate.length > 0) {
          const totalSales = salesByDate.reduce(
            (sum: number, day: SalesData) => sum + parseFloat(day.total_amount),
            0
          );

          const totalOrders = salesByDate.reduce(
            (sum: number, day: SalesData) => sum + parseInt(day.order_count),
            0
          );

          const averageOrderValue =
            totalOrders > 0 ? totalSales / totalOrders : 0;

          // Calculate previous period for comparison
          const previousEndDate = new Date(startDate);
          const previousStartDate = new Date(startDate);

          if (dateRange === "week") {
            previousStartDate.setDate(previousStartDate.getDate() - 7);
          } else if (dateRange === "month") {
            previousStartDate.setMonth(previousStartDate.getMonth() - 1);
          } else if (dateRange === "year") {
            previousStartDate.setFullYear(previousStartDate.getFullYear() - 1);
          }

          const previousSalesData = await fetchAdminSalesByDate(
            formatDateStr(previousStartDate),
            formatDateStr(previousEndDate)
          );

          const previousTotal = previousSalesData.reduce(
            (sum: number, day: SalesData) => sum + parseFloat(day.total_amount),
            0
          );

          // Calculate percentage increase
          const percentIncrease =
            previousTotal > 0
              ? Math.round(((totalSales - previousTotal) / previousTotal) * 100)
              : 0;

          setSalesSummary({
            total: totalSales,
            orders: totalOrders,
            average: averageOrderValue,
            increase: percentIncrease,
          });
        }
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("vi-VN");
  };

  const formatChartDate = (dateStr: string) => {
    try {
      // Input date is in format 'YYYY-MM-DD'
      const date = new Date(dateStr);
      return format(date, "dd/MM", { locale: vi });
    } catch (error) {
      return dateStr;
    }
  };

  // Format number for Y axis
  const formatYAxis = (value: number) => {
    if (value === 0) return "0";
    if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Báo cáo doanh số</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Tổng doanh thu
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {formatCurrency(salesSummary.total)} ₫
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Đơn hàng</h3>
          <p className="text-3xl font-bold text-blue-600">
            {salesSummary.orders}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Giá trị trung bình
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {formatCurrency(salesSummary.average)} ₫
          </p>
          <p className="text-sm text-gray-500 mt-2">Trên mỗi đơn hàng</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Doanh thu theo thời gian
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setDateRange("week")}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  dateRange === "week"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tuần
              </button>
              <button
                onClick={() => setDateRange("month")}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  dateRange === "month"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tháng
              </button>
              <button
                onClick={() => setDateRange("year")}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  dateRange === "year"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Năm
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center">
              <p>Không có dữ liệu cho khoảng thời gian này</p>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#3b82f6"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Doanh thu theo danh mục
          </h3>

          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : topCategories.length === 0 ? (
            <div className="flex items-center justify-center h-48">
              <p>Không có dữ liệu cho khoảng thời gian này</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topCategories.map((category, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {category.name}
                    </span>
                    <span className="text-sm text-gray-700">
                      {category.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatCurrency(parseFloat(category.amount))} ₫
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Sản phẩm bán chạy
          </h3>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : bestsellingProducts.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p>Không có dữ liệu sản phẩm</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Sản phẩm
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Danh mục
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Đã bán
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Doanh thu
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bestsellingProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded">
                            <img
                              src={getProductImage(product)}
                              alt={product.name}
                              className="h-10 w-10 rounded object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.category_name || "Chưa phân loại"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.quantity_sold}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(
                          product.quantity_sold * parseFloat(product.price)
                        )}{" "}
                        ₫
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSales;
