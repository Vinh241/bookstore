import React, { useEffect, useState } from "react";
import {
  fetchAdminDashboardStats,
  fetchAdminRecentOrders,
  fetchAdminBestsellingProducts,
  fetchAdminSlowSellingProducts,
} from "@/lib/api";
import { BACKEND_URL } from "@/constants";
import defaultBookImage from "@/assets/images/books.avif";

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
  images?: { image_url: string; is_primary: boolean }[];
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    orderCount: 0,
    totalRevenue: 0,
    productCount: 0,
    lowStockCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [bestsellingProducts, setBestsellingProducts] = useState<Product[]>([]);
  const [slowSellingProducts, setSlowSellingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [statsData, ordersData, bestProductsData, slowProductsData] =
          await Promise.all([
            fetchAdminDashboardStats(),
            fetchAdminRecentOrders(3), // Limit to 3 orders for display
            fetchAdminBestsellingProducts(3), // Limit to 3 products for display
            fetchAdminSlowSellingProducts(3), // Limit to 3 products for display
          ]);

        setStats(statsData);
        setRecentOrders(ordersData);
        setBestsellingProducts(bestProductsData);
        setSlowSellingProducts(slowProductsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tổng quan hệ thống</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Đang tải dữ liệu...</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
