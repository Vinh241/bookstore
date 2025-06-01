import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { getOrderDetailUrl } from "@/constants";
import { formatCurrency } from "@/lib/utils";
import { fetchUserOrders } from "@/lib/api";
import { Order } from "@/types";

export default function MyOrdersPage() {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true);
        const ordersData = await fetchUserOrders();
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Có lỗi xảy ra khi tải đơn hàng. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      getOrders();
    }
  }, [isAuthenticated]);

  // Format status for display
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "Chờ xử lý",
      processing: "Đang xử lý",
      shipped: "Đang giao hàng",
      delivered: "Đã giao hàng",
      cancelled: "Đã hủy",
    };
    return statusMap[status] || status;
  };

  // Format payment status for display
  const getPaymentStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "Chờ thanh toán",
      completed: "Đã thanh toán",
      failed: "Thanh toán thất bại",
      refunded: "Đã hoàn tiền",
    };
    return statusMap[status] || status;
  };

  // Format payment method for display
  const getPaymentMethodText = (method: string) => {
    const methodMap: Record<string, string> = {
      credit_card: "Thẻ tín dụng",
      paypal: "PayPal",
      bank_transfer: "Chuyển khoản",
      cash_on_delivery: "Thanh toán khi nhận hàng",
      momo: "Ví MoMo",
      vnpay: "VNPay",
    };
    return methodMap[method] || method;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>
        <div className="bg-red-50 p-4 rounded border border-red-200 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>

      {orders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">Bạn chưa có đơn hàng nào</p>
          <Link to="/">
            <Button>Mua sắm ngay</Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn hàng</TableHead>
                <TableHead>Ngày đặt</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thanh toán</TableHead>
                <TableHead>Phương thức</TableHead>
                <TableHead className="text-right">Chi tiết</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{formatDate(order.created_at)}</TableCell>
                  <TableCell>{formatCurrency(order.total_amount)} đ</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        order.payment_status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.payment_status === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {getPaymentStatusText(order.payment_status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {getPaymentMethodText(order.payment_method)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link to={getOrderDetailUrl(order.id)}>
                      <Button variant="ghost" size="sm">
                        Xem chi tiết
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
