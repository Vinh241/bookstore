import React, { useEffect, useState } from "react";
import {
  fetchAdminDashboardStats,
  fetchAdminRecentOrders,
  fetchAdminBestsellingProducts,
  fetchAdminSlowSellingProducts,
  fetchAdminSalesByDate,
  fetchAdminSalesByCategory,
} from "@/lib/api";
import { BACKEND_URL } from "@/constants";
import defaultBookImage from "@/assets/images/books.avif";
import { format, subMonths } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
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

interface DashboardStats {
  orderCount: number;
  totalRevenue: number;
  productCount: number;
  lowStockCount: number;
}

interface Order {
  id: number;
  full_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  quantity_sold: number;
  stock_quantity?: number;
  image_url: string | null;
  category_name?: string;
  images?: { image_url: string; is_primary: boolean }[];
}

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

const AdminStatistics: React.FC = () => {
  // Dashboard stats
  const [stats, setStats] = useState<DashboardStats>({
    orderCount: 0,
    totalRevenue: 0,
    productCount: 0,
    lowStockCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [bestsellingProducts, setBestsellingProducts] = useState<Product[]>([]);
  const [slowSellingProducts, setSlowSellingProducts] = useState<Product[]>([]);

  // Sales report stats
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [topCategories, setTopCategories] = useState<CategorySales[]>([]);
  const [salesSummary, setSalesSummary] = useState({
    total: 0,
    orders: 0,
    average: 0,
    increase: 0,
  });

  const [loading, setLoading] = useState(true);

  // Function to get product image
  const getProductImage = (product: Product) => {
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
      try {
        setLoading(true);

        // Calculate date range based on custom dates
        const endDate = customEndDate || new Date();
        const startDate = customStartDate || subMonths(endDate, 1); // Default to last month if no dates selected

        const formatDateStr = (date: Date) => {
          return date.toISOString().split("T")[0];
        };

        // Fetch all data in parallel
        const [
          statsData,
          ordersData,
          bestProductsData,
          slowProductsData,
          salesByDate,
          categorySales,
        ] = await Promise.all([
          fetchAdminDashboardStats(),
          fetchAdminRecentOrders(3), // Limit to 3 orders for display
          fetchAdminBestsellingProducts(3), // Limit to 3 products for display
          fetchAdminSlowSellingProducts(3), // Limit to 3 products for display
          fetchAdminSalesByDate(
            formatDateStr(startDate),
            formatDateStr(endDate)
          ),
          fetchAdminSalesByCategory(
            formatDateStr(startDate),
            formatDateStr(endDate)
          ),
        ]);

        setStats(statsData);
        setRecentOrders(ordersData);
        setBestsellingProducts(bestProductsData);
        setSlowSellingProducts(slowProductsData);
        setTopCategories(categorySales);

        // Transform sales data for chart
        const transformedData = salesByDate.map((item: SalesData) => ({
          date: formatChartDate(item.date),
          amount: parseFloat(item.total_amount),
          orders: parseInt(item.order_count),
        }));

        setChartData(transformedData);

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
          const periodDays = Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          previousStartDate.setDate(previousStartDate.getDate() - periodDays);
          previousEndDate.setDate(previousEndDate.getDate() - periodDays);

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
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customStartDate, customEndDate]);

  // Function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Function to get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to get translated status
  const getTranslatedStatus = (status: string) => {
    switch (status) {
      case "delivered":
        return "Đã giao";
      case "processing":
        return "Đang xử lý";
      case "shipped":
        return "Đang vận chuyển";
      case "cancelled":
        return "Đã hủy";
      case "pending":
        return "Chờ xử lý";
      default:
        return status;
    }
  };

  const formatChartDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, "dd/MM", { locale: vi });
    } catch {
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
      <h1 className="text-2xl font-bold mb-6">Thống kê</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Đang tải dữ liệu...</div>
        </div>
      ) : (
        <>
          {/* Thống kê tổng quan */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tổng đơn hàng
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {stats.orderCount}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Doanh thu
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sản phẩm
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {stats.productCount}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {stats.lowStockCount} sản phẩm sắp hết hàng
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Giá trị trung bình
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {formatCurrency(salesSummary.average)}
              </p>
              <p className="text-sm text-gray-500 mt-2">Trên mỗi đơn hàng</p>
            </div>
          </div>

          {/* Biểu đồ doanh thu */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Doanh thu theo thời gian
              </h3>
              <div className="flex items-center space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-[140px] justify-start text-left font-normal ${
                        !customStartDate && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customStartDate ? (
                        format(customStartDate, "dd/MM/yyyy", { locale: vi })
                      ) : (
                        <span>Từ ngày</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={customStartDate || undefined}
                      onSelect={(date) => {
                        if (date) {
                          setCustomStartDate(date);
                        }
                      }}
                      initialFocus
                      locale={vi}
                      disabled={(date) =>
                        date > new Date() ||
                        (customEndDate ? date > customEndDate : false)
                      }
                    />
                  </PopoverContent>
                </Popover>
                <span className="text-gray-500">-</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-[140px] justify-start text-left font-normal ${
                        !customEndDate && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customEndDate ? (
                        format(customEndDate, "dd/MM/yyyy", { locale: vi })
                      ) : (
                        <span>Đến ngày</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={customEndDate || undefined}
                      onSelect={(date) => {
                        if (date) {
                          setCustomEndDate(date);
                        }
                      }}
                      initialFocus
                      locale={vi}
                      disabled={(date) =>
                        date > new Date() ||
                        (customStartDate ? date < customStartDate : false)
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {chartData.length === 0 ? (
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
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis
                      tickFormatter={formatYAxis}
                      tick={{ fontSize: 12 }}
                    />
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

          {/* Thông tin chi tiết */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Đơn hàng gần đây */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Đơn hàng gần đây
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Khách hàng
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tổng tiền
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            #{order.id}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {order.full_name}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(order.total_amount)}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                                order.status
                              )}`}
                            >
                              {getTranslatedStatus(order.status)}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-3 py-4 text-center text-sm text-gray-500"
                        >
                          Không có đơn hàng nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sản phẩm bán chạy */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Sản phẩm bán chạy
              </h3>
              <div className="space-y-4">
                {bestsellingProducts.length > 0 ? (
                  bestsellingProducts.map((product) => (
                    <div key={product.id} className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded">
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="h-12 w-12 rounded object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {product.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Đã bán: {product.quantity_sold} cuốn
                        </p>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(product.price)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-gray-500 py-4">
                    Không có sản phẩm nào
                  </div>
                )}
              </div>
            </div>

            {/* Doanh thu theo danh mục */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Doanh thu theo danh mục
              </h3>
              <div className="space-y-4">
                {topCategories.length > 0 ? (
                  topCategories.map((category, index) => (
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
                        {formatCurrency(parseFloat(category.amount))}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-gray-500 py-4">
                    Không có dữ liệu cho khoảng thời gian này
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hàng thứ hai */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Sản phẩm bán chậm */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Sản phẩm bán chậm
              </h3>
              <div className="space-y-4">
                {slowSellingProducts.length > 0 ? (
                  slowSellingProducts.map((product) => (
                    <div key={product.id} className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded">
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="h-12 w-12 rounded object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {product.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Còn lại:{" "}
                          <span
                            className={
                              product.stock_quantity &&
                              product.stock_quantity < 10
                                ? "text-red-600 font-medium"
                                : ""
                            }
                          >
                            {product.stock_quantity} cuốn
                          </span>
                        </p>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(product.price)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-gray-500 py-4">
                    Không có sản phẩm nào
                  </div>
                )}
              </div>
            </div>

            {/* Sản phẩm bán chạy chi tiết */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Chi tiết sản phẩm bán chạy
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Sản phẩm
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Danh mục
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Đã bán
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Doanh thu
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bestsellingProducts.length > 0 ? (
                      bestsellingProducts.map((product) => (
                        <tr key={product.id}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded">
                                <img
                                  src={getProductImage(product)}
                                  alt={product.name}
                                  className="h-8 w-8 rounded object-cover"
                                />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {product.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {product.category_name || "Chưa phân loại"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {product.quantity_sold}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(
                              product.quantity_sold * product.price
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-4 text-center text-sm text-gray-500"
                        >
                          Không có dữ liệu sản phẩm
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminStatistics;
