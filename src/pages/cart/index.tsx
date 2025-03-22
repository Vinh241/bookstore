import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, BadgePercent, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BookCard from "@/components/BookCard";
import { ROUTES, getBookDetailUrl } from "@/constants";

// Import demo data - in a real app, this would come from a cart context/redux store
import { books } from "@/lib/data";

// Sample cart items for demonstration
const initialCartItems = [
  {
    id: books[0].id,
    title: books[0].title,
    author: books[0].author,
    coverImage: books[0].coverImage,
    price: books[0].price,
    originalPrice: books[0].originalPrice,
    discount: books[0].discount,
    quantity: 1,
  },
  {
    id: books[1].id,
    title: books[1].title,
    author: books[1].author,
    coverImage: books[1].coverImage,
    price: books[1].price,
    originalPrice: books[1].originalPrice,
    discount: books[1].discount,
    quantity: 2,
  },
];

// Get recommended books based on cart items
const getRecommendedBooks = (cartItems: typeof initialCartItems) => {
  // In a real app, this would be a more sophisticated recommendation algorithm
  // For demo, just get books not in cart
  const cartBookIds = cartItems.map((item) => item.id);
  return books.filter((book) => !cartBookIds.includes(book.id)).slice(0, 5);
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Calculate discount amount (for demo: 10% if coupon applied)
  const discountAmount = couponApplied ? subtotal * 0.1 : 0;

  // Fixed shipping cost (free if subtotal > 300,000₫)
  const shippingCost = subtotal > 300000 ? 0 : 30000;

  // Calculate total
  const total = subtotal - discountAmount + shippingCost;

  // Update quantity of an item
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove an item from cart
  const removeItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Apply coupon code
  const applyCoupon = () => {
    // In a real app, this would validate the coupon code against a backend service
    if (couponCode.toUpperCase() === "DISCOUNT10") {
      setCouponApplied(true);
    } else {
      alert("Mã giảm giá không hợp lệ");
      setCouponApplied(false);
    }
  };

  // Get recommended books
  const recommendedBooks = getRecommendedBooks(cartItems);

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
                                src={item.coverImage}
                                alt={item.title}
                                className="w-16 h-24 object-cover rounded mr-4"
                              />
                            </Link>
                            <div>
                              <Link
                                to={getBookDetailUrl(item.id)}
                                className="font-medium hover:text-red-500 line-clamp-2"
                              >
                                {item.title}
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
                          {item.discount > 0 && (
                            <div className="text-gray-500 line-through text-xs">
                              {item.originalPrice.toLocaleString()}đ
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

              {/* Recommended Products */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-bold mb-4">
                  Có thể bạn cũng thích
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {recommendedBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      id={book.id}
                      title={book.title}
                      author={book.author}
                      coverImage={book.coverImage}
                      price={book.price}
                      originalPrice={book.originalPrice}
                      discount={book.discount}
                      isNew={book.isNew}
                    />
                  ))}
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
                <Button className="w-full bg-red-600 hover:bg-red-700 py-6">
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
