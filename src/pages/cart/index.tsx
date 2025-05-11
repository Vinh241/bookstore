import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, BadgePercent, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES, getBookDetailUrl, BACKEND_URL } from "@/constants";
import { useCart } from "@/contexts/CartContext";
import { CartItem } from "@/contexts/CartContext";
import defaultBookImage from "@/assets/images/books.avif";
import { getProductsByIds } from "@/lib/api";
import { toast } from "sonner";

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    isLoading,
    subtotal,
    discountAmount,
    shippingCost,
    total,
    couponCode,
    couponApplied,
    setCouponCode,
    applyCoupon,
    updateQuantity,
    removeItem,
  } = useCart();

  // Hàm helper để lấy URL hình ảnh sản phẩm
  const getProductImage = (item: CartItem) => {
    // Nếu sản phẩm có mảng images, ưu tiên dùng ảnh có is_primary = true
    if (item.images && item.images.length > 0) {
      const imageUrl =
        item.images.find((img) => img.is_primary)?.image_url ||
        item.images[0].image_url;

      // Thêm baseURL nếu đường dẫn là tương đối
      if (imageUrl && imageUrl.startsWith("/")) {
        return `${BACKEND_URL}${imageUrl}`;
      }
      return imageUrl;
    }

    // Nếu không có mảng images, dùng image_url
    if (item.image_url) {
      if (item.image_url.startsWith("/")) {
        return `${BACKEND_URL}${item.image_url}`;
      }
      return item.image_url;
    }

    // Trả về ảnh mặc định nếu không có ảnh
    return defaultBookImage;
  };

  // Hàm kiểm tra hàng tồn kho trước khi checkout
  const validateCartBeforeCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Giỏ hàng của bạn đang trống");
      return false;
    }

    try {
      // Lấy thông tin sản phẩm mới nhất từ API
      const productIds = cartItems.map((item) => item.id);
      const latestProducts = await getProductsByIds(productIds);

      // Kiểm tra tồn kho cho mỗi sản phẩm
      let hasStockError = false;
      const errorMessages: string[] = [];

      cartItems.forEach((cartItem) => {
        const product = latestProducts.find((p) => p.id === cartItem.id);

        if (!product) {
          errorMessages.push(`Sản phẩm "${cartItem.name}" không còn tồn tại`);
          hasStockError = true;
          return;
        }

        if (!product.stock_quantity || product.stock_quantity <= 0) {
          errorMessages.push(`Sản phẩm "${product.name}" đã hết hàng`);
          hasStockError = true;
        } else if (cartItem.quantity > product.stock_quantity) {
          errorMessages.push(
            `Sản phẩm "${product.name}" chỉ còn ${product.stock_quantity} trong kho (bạn đang đặt ${cartItem.quantity})`
          );
          hasStockError = true;
        }
      });

      if (hasStockError) {
        // Hiển thị tất cả các lỗi
        errorMessages.forEach((msg) => toast.error(msg));
        return false;
      }

      return true;
    } catch (error) {
      console.error("Lỗi khi kiểm tra tồn kho:", error);
      toast.error("Không thể kiểm tra tồn kho. Vui lòng thử lại sau.");
      return false;
    }
  };

  // Xử lý sự kiện khi nhấn nút tiến hành đặt hàng
  const handleProceedToCheckout = async () => {
    const isValid = await validateCartBeforeCheckout();
    if (isValid) {
      navigate(ROUTES.CHECKOUT);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

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
            <span className="text-gray-700">Giỏ hàng</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-6">Giỏ hàng của tôi</h1>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm mb-6">
                {/* Cart Header */}
                <div className="px-6 py-4 border-b">
                  <div className="grid grid-cols-12 text-gray-500 text-sm">
                    <div className="col-span-6">Sản phẩm</div>
                    <div className="col-span-2 text-center">Đơn giá</div>
                    <div className="col-span-2 text-center">Số lượng</div>
                    <div className="col-span-2 text-center">Thành tiền</div>
                  </div>
                </div>

                {/* Cart Items */}
                <div className="divide-y">
                  {cartItems.map((item) => (
                    <div key={item.id} className="px-6 py-4">
                      <div className="grid grid-cols-12 items-center">
                        {/* Product Info */}
                        <div className="col-span-6">
                          <div className="flex items-center">
                            <Link to={getBookDetailUrl(item.id)}>
                              <img
                                src={getProductImage(item) ?? defaultBookImage}
                                alt={item.name}
                                className="w-16 h-24 object-cover rounded mr-4"
                              />
                            </Link>
                            <div>
                              <Link
                                to={getBookDetailUrl(item.id)}
                                className="font-medium hover:text-red-500 line-clamp-2"
                              >
                                {item.name}
                              </Link>
                              <div className="text-sm text-gray-500 mt-1">
                                {item.author}
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 text-sm flex items-center mt-2 hover:underline"
                              >
                                <Trash2 size={14} className="mr-1" />
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="col-span-2 text-center">
                          <div className="font-medium">
                            {item.price.toLocaleString()}đ
                          </div>
                          {item.price < item.original_price && (
                            <div className="text-gray-500 line-through text-xs">
                              {item.original_price.toLocaleString()}đ
                            </div>
                          )}
                        </div>

                        {/* Quantity */}
                        <div className="col-span-2 flex justify-center">
                          <div className="flex border rounded-md">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="px-2 py-1 border-r"
                            >
                              <Minus size={16} />
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(
                                  item.id,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="w-10 text-center focus:outline-none"
                            />
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="px-2 py-1 border-l"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Subtotal */}
                        <div className="col-span-2 text-center font-bold">
                          {(item.price * item.quantity).toLocaleString()}đ
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping */}
                <div className="px-6 py-4 border-t flex justify-between items-center">
                  <Link
                    to={ROUTES.HOME}
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ChevronRight size={16} className="rotate-180 mr-1" />
                    Tiếp tục mua sắm
                  </Link>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-lg font-bold mb-4">Tổng đơn hàng</h2>

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

                {/* Coupon Code */}
                <div className="mb-6">
                  <div className="flex items-center">
                    <Input
                      type="text"
                      placeholder="Nhập mã giảm giá"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="rounded-r-none"
                    />
                    <Button
                      onClick={applyCoupon}
                      className="rounded-l-none bg-blue-600 hover:bg-blue-700"
                    >
                      Áp dụng
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500 mt-2 flex items-center">
                    <BadgePercent size={14} className="mr-1" />
                    Thử mã "DISCOUNT10" để được giảm 10%
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-red-600 hover:bg-red-700 py-6"
                >
                  Tiến hành đặt hàng
                </Button>

                <div className="mt-4 text-xs text-gray-500 text-center">
                  Bằng cách đặt hàng, bạn đồng ý với Điều khoản sử dụng của
                  chúng tôi
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mb-4">
              <img
                src="/images/empty-cart.svg"
                alt="Empty Cart"
                className="w-32 h-32 mx-auto"
              />
            </div>
            <h2 className="text-xl font-medium mb-2">
              Giỏ hàng của bạn đang trống
            </h2>
            <p className="text-gray-500 mb-6">
              Hãy thêm một vài sản phẩm vào giỏ hàng của bạn và quay lại đây
              nhé!
            </p>
            <Link to={ROUTES.HOME}>
              <Button className="bg-red-600 hover:bg-red-700">
                Khám phá ngay
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
