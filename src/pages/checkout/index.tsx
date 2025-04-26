import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, CreditCard, Truck, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ROUTES } from "@/constants";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { createMomoPayment, createOrder } from "@/lib/api";

type PaymentMethod = "cod" | "momo";
type ShippingMethod = "standard" | "express";

interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  notes: string;
  saveInfo: boolean;
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    cartItems,
    subtotal,
    discountAmount,
    shippingCost,
    total,
    couponApplied,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    notes: "",
    saveInfo: false,
    paymentMethod: "cod",
    shippingMethod: "standard",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mb-4">
              <CheckCircle size={64} className="mx-auto text-gray-400" />
            </div>
            <h2 className="text-xl font-medium mb-2">
              Giỏ hàng của bạn đang trống
            </h2>
            <p className="text-gray-500 mb-6">
              Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán
            </p>
            <Link to={ROUTES.CART}>
              <Button className="bg-red-600 hover:bg-red-700">
                Quay lại giỏ hàng
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      saveInfo: checked,
    });
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setFormData({
      ...formData,
      paymentMethod: method,
    });
  };

  const handleShippingMethodChange = (method: ShippingMethod) => {
    setFormData({
      ...formData,
      shippingMethod: method,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin thanh toán");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        user_id: user?.id,
        customer_name: formData.fullName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address: `${formData.address}, ${formData.ward}, ${formData.district}, ${formData.city}`,
        notes: formData.notes,
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
          name: item.name,
        })),
        total_amount: total,
        shipping_method: formData.shippingMethod,
        payment_method: formData.paymentMethod,
      };

      if (formData.paymentMethod === "momo") {
        // Gọi API thanh toán MoMo
        const response = await createMomoPayment({
          amount: total,
          orderInfo: `Thanh toán đơn hàng của ${formData.fullName}`,
          orderData: orderData,
        });

        if (response.success) {
          // Lưu thông tin đơn hàng vào localStorage để có thể truy xuất sau khi thanh toán
          localStorage.setItem(
            "pendingOrder",
            JSON.stringify({
              orderId: response.data.orderId,
              orderData: orderData,
            })
          );

          // Chuyển hướng người dùng đến trang thanh toán MoMo
          window.location.href = response.data.payUrl;
        } else {
          toast.error(response.message || "Không thể tạo thanh toán MoMo");
        }
      } else {
        // Thanh toán COD - gửi đơn hàng đến API
        const response = await createOrder(orderData);

        if (response.success) {
          // Xử lý đơn hàng thành công
          clearCart();
          toast.success("Đặt hàng thành công! Cảm ơn bạn đã mua sắm.");
          navigate("/checkout/success", {
            state: { orderId: response.data.orderId },
          });
        } else {
          toast.error(response.message || "Đã có lỗi xảy ra khi đặt hàng");
        }
      }
    } catch (error: any) {
      console.error("Error submitting order:", error);
      toast.error(
        error.response?.data?.message ||
          "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 py-8">
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
            <span className="text-gray-700">Thanh toán</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Truck size={20} className="mr-2" />
                  Thông tin giao hàng
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Họ tên <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Địa chỉ <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      required
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Tỉnh/Thành phố <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Chọn tỉnh/thành phố</option>
                      <option value="hanoi">Hà Nội</option>
                      <option value="hcm">TP. Hồ Chí Minh</option>
                      <option value="danang">Đà Nẵng</option>
                      <option value="other">Tỉnh/TP khác</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="district"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Quận/Huyện
                    </label>
                    <Input
                      id="district"
                      name="district"
                      type="text"
                      value={formData.district}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="ward"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phường/Xã
                    </label>
                    <Input
                      id="ward"
                      name="ward"
                      type="text"
                      value={formData.ward}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Ghi chú
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                  ></textarea>
                </div>

                <div className="flex items-center">
                  <Checkbox
                    id="saveInfo"
                    checked={formData.saveInfo}
                    onCheckedChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <label
                    htmlFor="saveInfo"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    Lưu thông tin này cho lần sau
                  </label>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">
                  Phương thức vận chuyển
                </h2>

                <div className="space-y-3">
                  <div
                    className={`p-4 border rounded-md cursor-pointer ${
                      formData.shippingMethod === "standard"
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200"
                    }`}
                    onClick={() => handleShippingMethodChange("standard")}
                  >
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full border-2 flex items-center justify-center mr-2">
                        {formData.shippingMethod === "standard" && (
                          <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">Giao hàng tiêu chuẩn</div>
                        <div className="text-sm text-gray-500">
                          Nhận hàng trong 3-5 ngày
                        </div>
                      </div>
                      <div className="ml-auto font-semibold">
                        {subtotal > 300000 ? (
                          <span className="text-green-600">Miễn phí</span>
                        ) : (
                          <span>30.000đ</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 border rounded-md cursor-pointer ${
                      formData.shippingMethod === "express"
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200"
                    }`}
                    onClick={() => handleShippingMethodChange("express")}
                  >
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full border-2 flex items-center justify-center mr-2">
                        {formData.shippingMethod === "express" && (
                          <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">Giao hàng nhanh</div>
                        <div className="text-sm text-gray-500">
                          Nhận hàng trong 1-2 ngày
                        </div>
                      </div>
                      <div className="ml-auto font-semibold">50.000đ</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <CreditCard size={20} className="mr-2" />
                  Phương thức thanh toán
                </h2>

                <div className="space-y-3">
                  <div
                    className={`p-4 border rounded-md cursor-pointer ${
                      formData.paymentMethod === "cod"
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200"
                    }`}
                    onClick={() => handlePaymentMethodChange("cod")}
                  >
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full border-2 flex items-center justify-center mr-2">
                        {formData.paymentMethod === "cod" && (
                          <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        )}
                      </div>
                      <div className="font-medium">
                        Thanh toán khi nhận hàng (COD)
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 border rounded-md cursor-pointer ${
                      formData.paymentMethod === "momo"
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200"
                    }`}
                    onClick={() => handlePaymentMethodChange("momo")}
                  >
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full border-2 flex items-center justify-center mr-2">
                        {formData.paymentMethod === "momo" && (
                          <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        )}
                      </div>
                      <div className="flex items-center">
                        <img
                          src="/images/momo-logo.png"
                          alt="MoMo"
                          className="h-6 w-6 mr-2"
                        />
                        <div className="font-medium">
                          Thanh toán qua Ví MoMo
                        </div>
                      </div>
                    </div>
                    {formData.paymentMethod === "momo" && (
                      <div className="mt-2 p-3 bg-pink-50 rounded-md text-sm">
                        <p className="text-center mb-3">
                          Quét mã QR bên dưới để thanh toán qua MoMo
                        </p>
                        <div className="flex justify-center">
                          <div className="p-2 bg-white rounded-md inline-block">
                            <img
                              src="/images/momo-qr.png"
                              alt="MoMo QR Code"
                              className="h-48 w-48"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null; // Prevent infinite loop
                                target.src =
                                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2FlMjA3MCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0id2hpdGUiPk1vTW8gUVI8L3RleHQ+PC9zdmc+";
                              }}
                            />
                          </div>
                        </div>
                        <p className="text-center mt-3 text-xs text-gray-500">
                          Sau khi thanh toán thành công, đơn hàng của bạn sẽ
                          được xử lý trong vòng 24 giờ
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Continue Shopping */}
              <div className="flex items-center justify-between mb-6">
                <Link
                  to={ROUTES.CART}
                  className="text-blue-600 hover:underline flex items-center"
                >
                  <ChevronRight size={16} className="rotate-180 mr-1" />
                  Quay lại giỏ hàng
                </Link>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-bold mb-4">Tổng đơn hàng</h2>

              {/* Products */}
              <div className="border-b pb-4 mb-4">
                <h3 className="font-medium mb-2">Sản phẩm</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex">
                      <div className="w-10 h-14 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={item.image_url || "/placeholder-book.jpg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="text-sm font-medium line-clamp-1">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          SL: {item.quantity}
                        </div>
                        <div className="text-sm font-semibold">
                          {(item.price * item.quantity).toLocaleString()}đ
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Items */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính</span>
                  <span>{subtotal.toLocaleString()}đ</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  {shippingCost > 0 ? (
                    <span>{shippingCost.toLocaleString()}đ</span>
                  ) : (
                    <span className="text-green-600">Miễn phí</span>
                  )}
                </div>

                {couponApplied && (
                  <div className="flex justify-between text-red-500">
                    <span>Giảm giá (10%)</span>
                    <span>-{discountAmount.toLocaleString()}đ</span>
                  </div>
                )}

                <div className="border-t pt-3 font-bold text-lg flex justify-between">
                  <span>Tổng cộng</span>
                  <span className="text-red-600">
                    {total.toLocaleString()}đ
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 py-6"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
              </Button>

              <div className="mt-4 text-xs text-gray-500 text-center">
                Bằng cách đặt hàng, bạn đồng ý với{" "}
                <Link
                  to={ROUTES.POLICY}
                  className="text-blue-600 hover:underline"
                >
                  Điều khoản sử dụng
                </Link>{" "}
                của chúng tôi
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
