import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants";
import { formatCurrency } from "@/lib/utils";
import { fetchOrderDetails } from "@/lib/api";
import { OrderWithItems } from "@/types";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        setLoading(true);
        if (!id) return;

        const orderData = await fetchOrderDetails(id);
        setOrder(orderData);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError(
          "Có lỗi xảy ra khi tải thông tin đơn hàng. Vui lòng thử lại sau."
        );
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && id) {
      getOrderDetails();
    }
  }, [isAuthenticated, id]);

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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="mb-4">
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <div className="mt-6">
          <Skeleton className="h-60 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Chi tiết đơn hàng</h1>
        <div className="bg-red-50 p-4 rounded border border-red-200 text-red-600">
          {error}
        </div>
        <div className="mt-4">
          <Link to={ROUTES.MY_ORDERS}>
            <Button variant="outline">Quay lại danh sách đơn hàng</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Chi tiết đơn hàng</h1>
        <div className="bg-yellow-50 p-4 rounded border border-yellow-200 text-yellow-600">
          Không tìm thấy thông tin đơn hàng
        </div>
        <div className="mt-4">
          <Link to={ROUTES.MY_ORDERS}>
            <Button variant="outline">Quay lại danh sách đơn hàng</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chi tiết đơn hàng #{order.id}</h1>
        <Link to={ROUTES.MY_ORDERS}>
          <Button variant="outline">Quay lại danh sách đơn hàng</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Mã đơn hàng:</span> #{order.id}
              </p>
              <p>
                <span className="font-medium">Ngày đặt hàng:</span>{" "}
                {formatDate(order.created_at)}
              </p>
              <p>
                <span className="font-medium">Trạng thái:</span>{" "}
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
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thanh toán</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Phương thức:</span>{" "}
                {getPaymentMethodText(order.payment_method)}
              </p>
              <p>
                <span className="font-medium">Trạng thái:</span>{" "}
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
              </p>
              <p>
                <span className="font-medium">Tổng tiền:</span>{" "}
                {formatCurrency(order.total_amount)} đ
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin giao hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Địa chỉ giao hàng:</span>
              </p>
              <p className="text-gray-600">{order.shipping_address}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chi tiết sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sản phẩm</TableHead>
                <TableHead className="text-right">Đơn giá</TableHead>
                <TableHead className="text-right">Số lượng</TableHead>
                <TableHead className="text-right">Thành tiền</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <Link
                        to={`${ROUTES.BOOK_DETAIL}/${item.slug}`}
                        className="font-medium hover:underline"
                      >
                        {item.name}
                      </Link>
                      {item.isbn && (
                        <p className="text-sm text-gray-500">
                          ISBN: {item.isbn}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.unit_price)} đ
                  </TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.unit_price * item.quantity)} đ
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-end">
          <div className="text-right">
            <div className="space-y-1 mb-4">
              <p className="text-sm text-gray-500">
                Tổng tiền hàng:{" "}
                {formatCurrency(
                  order.items.reduce(
                    (sum, item) => sum + item.unit_price * item.quantity,
                    0
                  )
                )}{" "}
                đ
              </p>
              <p className="text-sm text-gray-500">Phí vận chuyển: 0 đ</p>
            </div>
            <p className="font-bold text-lg">
              Tổng thanh toán: {formatCurrency(order.total_amount)} đ
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
