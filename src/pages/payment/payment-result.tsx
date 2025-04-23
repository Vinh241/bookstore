import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  Home,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { getPaymentStatus } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";

interface PaymentStatusData {
  orderId?: string;
  status: "success" | "failed" | "pending" | "loading";
  message?: string;
  orderStatus?: string;
  paymentStatus?: string;
}

const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusData>({
    status: "loading",
    orderId: searchParams.get("orderId") || undefined,
    message: searchParams.get("message") || undefined,
  });

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Lấy thông tin trạng thái từ query params
        // const status = searchParams.get("status");
        const orderId = searchParams.get("orderId");
        const message = searchParams.get("message");

        if (!orderId) {
          setPaymentStatus({
            status: "failed",
            message: "Không tìm thấy thông tin đơn hàng",
          });
          return;
        }

        // Kiểm tra status từ MoMo trả về
        // if (status === "success") {
        // MoMo trả về thành công, kiểm tra với backend để đảm bảo
        const response = await getPaymentStatus(orderId);

        if (response.success && response.data.paymentStatus === "completed") {
          // Thanh toán thành công
          setPaymentStatus({
            status: "success",
            orderId,
            message: "Thanh toán thành công!",
            orderStatus: response.data.orderStatus,
            paymentStatus: response.data.paymentStatus,
          });

          // Xóa giỏ hàng vì đã thanh toán thành công
          clearCart();

          // Xóa thông tin đơn hàng đang xử lý
          localStorage.removeItem("pendingOrder");
        } else {
          // Backend xác nhận thanh toán thất bại hoặc đang xử lý
          setPaymentStatus({
            status:
              response.data.paymentStatus === "pending" ? "pending" : "failed",
            orderId,
            message: response.message || "Đơn hàng đang được xử lý",
            orderStatus: response.data.orderStatus,
            paymentStatus: response.data.paymentStatus,
          });
        }
        // } else {
        //   // MoMo trả về thất bại
        //   setPaymentStatus({
        //     status: "failed",
        //     orderId,
        //     message: message || "Thanh toán không thành công",
        //   });
        // }
      } catch (error) {
        console.error("Error checking payment status:", error);
        setPaymentStatus({
          status: "failed",
          message: "Đã có lỗi xảy ra khi kiểm tra trạng thái thanh toán",
        });
      }
    };

    checkPaymentStatus();
  }, [searchParams]);

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto max-w-3xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {paymentStatus.status === "loading" ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-medium">
                Đang kiểm tra trạng thái thanh toán...
              </h2>
            </div>
          ) : paymentStatus.status === "success" ? (
            <div className="text-center">
              <div className="mb-6">
                <CheckCircle size={72} className="mx-auto text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Thanh toán thành công!
              </h2>
              <p className="text-gray-600 mb-6">
                Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đã được xác nhận.
              </p>
              {paymentStatus.orderId && (
                <div className="bg-gray-50 rounded-md p-4 mb-6 text-center">
                  <p className="text-gray-500 text-sm">Mã đơn hàng</p>
                  <p className="text-lg font-semibold">
                    {paymentStatus.orderId}
                  </p>
                </div>
              )}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                <Link to={ROUTES.HOME}>
                  <Button variant="outline" className="w-full">
                    <Home size={18} className="mr-2" />
                    Trang chủ
                  </Button>
                </Link>
                <Link to={`/account/orders`}>
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    Xem đơn hàng
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : paymentStatus.status === "pending" ? (
            <div className="text-center">
              <div className="mb-6">
                <div className="mx-auto h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-yellow-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Đơn hàng đang xử lý</h2>
              <p className="text-gray-600 mb-6">
                Chúng tôi đang xác nhận thanh toán của bạn. Vui lòng chờ trong
                giây lát.
              </p>
              {paymentStatus.orderId && (
                <div className="bg-gray-50 rounded-md p-4 mb-6 text-center">
                  <p className="text-gray-500 text-sm">Mã đơn hàng</p>
                  <p className="text-lg font-semibold">
                    {paymentStatus.orderId}
                  </p>
                </div>
              )}
              <div className="flex justify-center gap-4 mt-6">
                <Link to={ROUTES.HOME}>
                  <Button variant="outline">
                    <Home size={18} className="mr-2" />
                    Trang chủ
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-6">
                <XCircle size={72} className="mx-auto text-red-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Thanh toán không thành công
              </h2>
              <p className="text-gray-600 mb-6">
                {paymentStatus.message ||
                  "Đã có lỗi xảy ra trong quá trình thanh toán"}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                <Link to={ROUTES.HOME}>
                  <Button variant="outline" className="w-full">
                    <Home size={18} className="mr-2" />
                    Trang chủ
                  </Button>
                </Link>
                <Link to={ROUTES.CART}>
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    <ShoppingCart size={18} className="mr-2" />
                    Giỏ hàng
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentResultPage;
