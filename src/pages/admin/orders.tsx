import React, { useEffect, useState } from "react";
import {
  fetchAdminOrders,
  updateOrderStatus,
  fetchAdminOrderDetails,
} from "@/lib/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OrderItem {
  id: number;
  product_id: number;
  order_id: number;
  quantity: number;
  unit_price: number;
  name: string;
  slug: string;
  isbn?: string;
}

interface OrderDetail {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  phone_number?: string;
  status: string;
  total_amount: number;
  shipping_address: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  payment_details?: {
    id: number;
    order_id: number;
    provider: string;
    transaction_id: string;
    amount: number;
    payment_data?: any;
  } | null;
}

interface Order {
  id: number;
  customer: string;
  email: string;
  date: string;
  amount: number;
  status: string;
  items: number;
}

const AdminOrders: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [orderIdForStatusUpdate, setOrderIdForStatusUpdate] = useState<
    number | null
  >(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [loadingOrderDetail, setLoadingOrderDetail] = useState(false);
  const [showOrderDetailDialog, setShowOrderDetailDialog] = useState(false);

  // Function to fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params: {
        status?: string;
        page: number;
        limit: number;
        search?: string;
      } = {
        page: currentPage,
        limit: 10,
      };

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await fetchAdminOrders(params);
      setOrders(response.orders);
      setTotalOrders(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders on mount and when filters change
  useEffect(() => {
    fetchOrders();
  }, [statusFilter, currentPage]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchOrders();
  };

  // Format date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // Handle status update
  const handleStatusUpdate = async (status: string) => {
    if (!orderIdForStatusUpdate) return;

    try {
      await updateOrderStatus(orderIdForStatusUpdate, status);

      // Update local state to avoid refetching
      setOrders(
        orders.map((order) =>
          order.id === orderIdForStatusUpdate ? { ...order, status } : order
        )
      );

      toast.success("Cập nhật trạng thái đơn hàng thành công");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Không thể cập nhật trạng thái đơn hàng");
    } finally {
      // Reset state
      setOrderIdForStatusUpdate(null);
      setShowStatusDropdown(false);
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    let color = "";
    let text = "";

    switch (status) {
      case "pending":
        color = "bg-yellow-100 text-yellow-800";
        text = "Chờ xử lý";
        break;
      case "processing":
        color = "bg-blue-100 text-blue-800";
        text = "Đang xử lý";
        break;
      case "shipped":
        color = "bg-indigo-100 text-indigo-800";
        text = "Đang vận chuyển";
        break;
      case "delivered":
        color = "bg-green-100 text-green-800";
        text = "Đã giao";
        break;
      case "cancelled":
        color = "bg-red-100 text-red-800";
        text = "Đã hủy";
        break;
      default:
        color = "bg-gray-100 text-gray-800";
        text = status;
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}
      >
        {text}
      </span>
    );
  };

  // Function to fetch order details
  const handleViewOrderDetail = async (orderId: number) => {
    setLoadingOrderDetail(true);
    try {
      const data = await fetchAdminOrderDetails(orderId);
      setOrderDetail(data);
      setShowOrderDetailDialog(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Không thể tải chi tiết đơn hàng. Vui lòng thử lại sau.");
    } finally {
      setLoadingOrderDetail(false);
    }
  };

  // Function to close order detail dialog
  const handleCloseOrderDetail = () => {
    setShowOrderDetailDialog(false);
    setOrderDetail(null);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex space-x-2 mb-2 sm:mb-0 overflow-x-auto">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  statusFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setStatusFilter("pending")}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  statusFilter === "pending"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Chờ xử lý
              </button>
              <button
                onClick={() => setStatusFilter("processing")}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  statusFilter === "processing"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Đang xử lý
              </button>
              <button
                onClick={() => setStatusFilter("shipped")}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  statusFilter === "shipped"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Đang vận chuyển
              </button>
              <button
                onClick={() => setStatusFilter("delivered")}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  statusFilter === "delivered"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Đã giao
              </button>
              <button
                onClick={() => setStatusFilter("cancelled")}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  statusFilter === "cancelled"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Đã hủy
              </button>
            </div>

            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm đơn hàng..."
                className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              Không tìm thấy đơn hàng nào
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Mã đơn hàng
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Khách hàng
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ngày đặt
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tổng tiền
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Trạng thái
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.customer}
                      </div>
                      <div className="text-sm text-gray-500">{order.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.amount.toLocaleString("vi-VN")} ₫
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => handleViewOrderDetail(order.id)}
                        >
                          Chi tiết
                        </button>
                        <div className="relative">
                          <button
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={() => {
                              setOrderIdForStatusUpdate(order.id);
                              setShowStatusDropdown((prevState) =>
                                orderIdForStatusUpdate === order.id
                                  ? !prevState
                                  : true
                              );
                            }}
                          >
                            Cập nhật
                          </button>

                          {showStatusDropdown &&
                            orderIdForStatusUpdate === order.id && (
                              <div
                                className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
                                style={{ right: 0 }}
                              >
                                <button
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  onClick={() => handleStatusUpdate("pending")}
                                >
                                  Chờ xử lý
                                </button>
                                <button
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  onClick={() =>
                                    handleStatusUpdate("processing")
                                  }
                                >
                                  Đang xử lý
                                </button>
                                <button
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  onClick={() => handleStatusUpdate("shipped")}
                                >
                                  Đang vận chuyển
                                </button>
                                <button
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  onClick={() =>
                                    handleStatusUpdate("delivered")
                                  }
                                >
                                  Đã giao
                                </button>
                                <button
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  onClick={() =>
                                    handleStatusUpdate("cancelled")
                                  }
                                >
                                  Đã hủy
                                </button>
                              </div>
                            )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "text-gray-700 bg-white hover:bg-gray-50"
                }`}
              >
                Trước
              </button>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "text-gray-700 bg-white hover:bg-gray-50"
                }`}
              >
                Sau
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * 10 + 1}
                  </span>{" "}
                  đến{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * 10, totalOrders)}
                  </span>{" "}
                  của <span className="font-medium">{totalOrders}</span> kết quả
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Trước</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Generate page buttons */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // For simplicity, show up to 5 pages
                    // In a real app, you might want to implement a more sophisticated algorithm
                    // to show pages around current page
                    let pageNum = i + 1;
                    if (totalPages > 5 && currentPage > 3) {
                      pageNum = currentPage - 3 + i;
                      if (pageNum > totalPages) {
                        pageNum = totalPages - (4 - i);
                      }
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        aria-current={
                          currentPage === pageNum ? "page" : undefined
                        }
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Sau</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Dialog */}
      <Dialog
        open={showOrderDetailDialog}
        onOpenChange={handleCloseOrderDetail}
      >
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng #{orderDetail?.id}</DialogTitle>
          </DialogHeader>

          {loadingOrderDetail ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : orderDetail ? (
            <div className="space-y-6">
              {/* Order Information */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-lg mb-2">Thông tin đơn hàng</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Trạng thái</p>
                    <p className="font-medium">
                      <StatusBadge status={orderDetail.status} />
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Ngày đặt</p>
                    <p className="font-medium">
                      {formatDate(orderDetail.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">
                      Phương thức thanh toán
                    </p>
                    <p className="font-medium">
                      {orderDetail.payment_method === "credit_card"
                        ? "Thẻ tín dụng/ghi nợ"
                        : orderDetail.payment_method === "paypal"
                        ? "PayPal"
                        : orderDetail.payment_method === "bank_transfer"
                        ? "Chuyển khoản ngân hàng"
                        : orderDetail.payment_method === "cash_on_delivery"
                        ? "Thanh toán khi nhận hàng (COD)"
                        : orderDetail.payment_method === "momo"
                        ? "Ví MoMo"
                        : orderDetail.payment_method}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">
                      Trạng thái thanh toán
                    </p>
                    <p className="font-medium">
                      {orderDetail.payment_status === "pending"
                        ? "Chờ thanh toán"
                        : orderDetail.payment_status === "completed"
                        ? "Đã thanh toán"
                        : orderDetail.payment_status === "failed"
                        ? "Thanh toán thất bại"
                        : orderDetail.payment_status === "refunded"
                        ? "Đã hoàn tiền"
                        : orderDetail.payment_status}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-gray-500 text-sm">Địa chỉ giao hàng</p>
                    <p className="font-medium">
                      {orderDetail.shipping_address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-lg mb-2">
                  Thông tin khách hàng
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Tên khách hàng</p>
                    <p className="font-medium">{orderDetail.full_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Email</p>
                    <p className="font-medium">{orderDetail.email}</p>
                  </div>
                  {orderDetail.phone_number && (
                    <div>
                      <p className="text-gray-500 text-sm">Số điện thoại</p>
                      <p className="font-medium">{orderDetail.phone_number}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-lg mb-2">Sản phẩm</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Sản phẩm
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Đơn giá
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Số lượng
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Thành tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orderDetail.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {item.name}
                            </div>
                            {item.isbn && (
                              <div className="text-sm text-gray-500">
                                ISBN: {item.isbn}
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.unit_price.toLocaleString("vi-VN")} ₫
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                            {(item.unit_price * item.quantity).toLocaleString(
                              "vi-VN"
                            )}{" "}
                            ₫
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 text-right border-t pt-4">
                  <div className="text-gray-500">Tổng tiền:</div>
                  <div className="text-xl font-bold text-gray-900">
                    {orderDetail.total_amount.toLocaleString("vi-VN")} ₫
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              {orderDetail.payment_details && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-2">
                    Chi tiết thanh toán
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-sm">Nhà cung cấp</p>
                      <p className="font-medium">
                        {orderDetail.payment_details.provider}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Mã giao dịch</p>
                      <p className="font-medium">
                        {orderDetail.payment_details.transaction_id}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Số tiền</p>
                      <p className="font-medium">
                        {orderDetail.payment_details.amount.toLocaleString(
                          "vi-VN"
                        )}{" "}
                        ₫
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              Không tìm thấy thông tin đơn hàng
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
