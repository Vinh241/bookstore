import { Link, useLocation } from "react-router-dom";
import { CheckCircle, ChevronRight, Package, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";

interface LocationState {
  orderId?: string;
}

const CheckoutSuccessPage = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  const orderId = state?.orderId || `ORD${Math.floor(Math.random() * 1000000)}`;

  return (
    <div className="bg-gray-50 py-8 min-h-[80vh]">
      <div className="container mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-500">
            <Link to={ROUTES.HOME} className="hover:text-red-500">
              Trang chủ
            </Link>
            <span className="mx-2">/</span>
            <Link to={ROUTES.CART} className="hover:text-red-500">
              Giỏ hàng
            </Link>
            <span className="mx-2">/</span>
            <Link to={ROUTES.CHECKOUT} className="hover:text-red-500">
              Thanh toán
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">Đặt hàng thành công</span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center mb-6">
            <div className="mb-4">
              <CheckCircle size={64} className="mx-auto text-green-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Đặt hàng thành công!</h1>
            <p className="text-gray-600 mb-6">
              Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận.
            </p>

            <div className="border border-gray-200 rounded-md p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500">Mã đơn hàng:</span>
                <span className="font-semibold">{orderId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Ngày đặt hàng:</span>
                <span>{new Date().toLocaleDateString("vi-VN")}</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-center mb-2">
                <Package className="text-blue-500 mr-2" size={20} />
                <span className="font-medium">Trạng thái đơn hàng</span>
              </div>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-1/4"></div>
                  </div>
                </div>
                <div className="flex text-xs justify-between">
                  <span className="text-green-500 font-medium">
                    Đã xác nhận
                  </span>
                  <span className="text-gray-400">Đang xử lý</span>
                  <span className="text-gray-400">Đang giao hàng</span>
                  <span className="text-gray-400">Hoàn thành</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                className="flex items-center"
                onClick={() => window.print()}
              >
                <Printer size={16} className="mr-2" />
                In đơn hàng
              </Button>
              <Link to={ROUTES.MY_ORDERS}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Kiểm tra đơn hàng
                </Button>
              </Link>
            </div>
          </div>

          <div className="text-center">
            <Link
              to={ROUTES.HOME}
              className="inline-flex items-center text-blue-600 hover:underline"
            >
              <ChevronRight size={16} className="rotate-180 mr-1" />
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
