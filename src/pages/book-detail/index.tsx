import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Truck, ShieldCheck, RotateCcw, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookCard from "@/components/BookCard";
import { ROUTES, BACKEND_URL } from "@/constants";
import {
  fetchProductDetails,
  fetchProductReviews,
  createProductReview,
  getUserProductReview,
} from "@/lib/api";
import { Product, Review } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import defaultBookImage from "@/assets/images/books.avif";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [book, setBook] = useState<Product | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const loadProductData = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        // Fetch product details
        const productData = await fetchProductDetails(id);
        setBook(productData);

        // Fetch product reviews
        const reviewsData = await fetchProductReviews(id);
        setReviews(reviewsData.reviews || []);
        setAverageRating(reviewsData.average_rating || 0);
        setReviewCount(reviewsData.review_count || 0);

        // Fetch user's review if logged in
        if (isAuthenticated) {
          loadUserReview();
        }
      } catch (err) {
        setError("Không thể tải thông tin sách");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProductData();
  }, [id, isAuthenticated]);

  // Load user's review
  const loadUserReview = async () => {
    if (!id || !isAuthenticated) return;

    try {
      const userReviewData = await getUserProductReview(id);

      if (userReviewData.review) {
        setHasReviewed(true);

        // Set form values from existing review
        setSelectedRating(userReviewData.review.rating);
        setReviewComment(userReviewData.review.comment || "");
      } else {
        setHasReviewed(false);
      }
    } catch (err) {
      console.error("Error loading user review:", err);
    }
  };

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    if (!book) return;
    addToCart(book, quantity);
  };

  // Submit review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !isAuthenticated) {
      toast.error("Bạn cần đăng nhập để đánh giá");
      return;
    }

    // Validate form
    if (selectedRating < 1 || selectedRating > 5) {
      toast.error("Vui lòng chọn số sao đánh giá (1-5)");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createProductReview(
        id,
        selectedRating,
        reviewComment
      );

      // Update reviews data
      setReviews((prevReviews) => {
        // If this is an update, remove the old review
        const filteredReviews = hasReviewed
          ? prevReviews.filter((r) => !(user && r.user_id === user.id))
          : prevReviews;

        // Add the new review at the top
        return [result.review, ...filteredReviews];
      });

      // Update average rating and review count
      setAverageRating(result.average_rating);
      setReviewCount(result.review_count);

      // Mark as reviewed
      setHasReviewed(true);

      toast.success(
        hasReviewed
          ? "Đánh giá đã được cập nhật thành công"
          : "Cảm ơn bạn đã đánh giá sản phẩm"
      );
    } catch (err) {
      console.error("Error submitting review:", err);
      toast.error("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hàm helper để tạo URL hình ảnh đầy đủ
  const getFullImageUrl = (url?: string) => {
    if (!url) return "/placeholder-book.jpg";
    if (url.startsWith("/")) {
      return `${BACKEND_URL}${url}`;
    }
    return url;
  };

  // Hàm xử lý khi người dùng chọn số sao để đánh giá
  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
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

  if (error || !book) {
    return (
      <div className="container mx-auto py-10 text-center">
        <div className="text-red-500 mb-4">
          {error || "Không tìm thấy sách"}
        </div>
        <Link
          to={ROUTES.HOME}
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded"
        >
          Quay về trang chủ
        </Link>
      </div>
    );
  }

  // Calculate discount percentage if sale_price exists
  const discount = book.sale_price
    ? Math.round(((book.price - book.sale_price) / book.price) * 100)
    : 0;

  // Use sale_price if available, otherwise use regular price
  const finalPrice = book.sale_price || book.price;

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
            <Link
              to={`${ROUTES.CATEGORY}/${book.category_id}`}
              className="hover:text-red-500"
            >
              {book.category_name || "Danh mục"}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">{book.name}</span>
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Product Image */}
            <div className="border rounded-lg overflow-hidden">
              <img
                src={
                  book.images && book.images.length > 0
                    ? getFullImageUrl(
                        book.images.find((img) => img.is_primary)?.image_url ||
                          book.images[0].image_url
                      )
                    : getFullImageUrl(book.image_url)
                }
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = defaultBookImage;
                }}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="lg:col-span-2">
              <h1 className="text-2xl font-bold mb-2">{book.name}</h1>

              <div className="flex items-center mb-4">
                <div className="flex mr-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.floor(averageRating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-blue-600">
                  {reviewCount} đánh giá
                </span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-sm text-green-600">
                  Đã bán {book.quantity_sold || 0}+
                </span>
              </div>

              {/* Price */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center mb-2">
                  <span className="text-3xl font-bold text-red-600 mr-3">
                    {finalPrice.toLocaleString()}đ
                  </span>
                  {discount > 0 && (
                    <>
                      <span className="text-gray-500 line-through mr-2">
                        {book.price.toLocaleString()}đ
                      </span>
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                        -{discount}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Book Info */}
              <div className="grid grid-cols-2 gap-y-2 mb-6">
                <div className="text-gray-500">Tác giả:</div>
                <div className="font-medium">
                  {book.author_name || "Không có thông tin"}
                </div>

                <div className="text-gray-500">Nhà xuất bản:</div>
                <div className="font-medium">
                  {book.publisher_name || "Không có thông tin"}
                </div>

                <div className="text-gray-500">Ngày phát hành:</div>
                <div className="font-medium">
                  {book.publication_date
                    ? new Date(book.publication_date).toLocaleDateString(
                        "vi-VN"
                      )
                    : "Không có thông tin"}
                </div>

                <div className="text-gray-500">ISBN:</div>
                <div className="font-medium">
                  {book.isbn || "Không có thông tin"}
                </div>

                <div className="text-gray-500">Tồn kho:</div>
                <div className="font-medium">
                  {book.stock_quantity} sản phẩm
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center mb-6">
                <span className="text-gray-500 mr-4">Số lượng:</span>
                {book.stock_quantity > 0 ? (
                  <div className="flex border rounded">
                    <button
                      onClick={decrementQuantity}
                      className="px-3 py-1 border-r hover:bg-gray-100"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={book.stock_quantity}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-12 text-center py-1 focus:outline-none"
                    />
                    <button
                      onClick={incrementQuantity}
                      className="px-3 py-1 border-l hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <span className="text-red-500 font-medium">Hết hàng</span>
                )}
              </div>

              {/* Add to Cart Button */}
              <div className="flex space-x-4 mb-6">
                <Button
                  onClick={handleAddToCart}
                  disabled={book.stock_quantity <= 0}
                  className={`w-full md:w-auto px-8 ${
                    book.stock_quantity <= 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {book.stock_quantity > 0 ? "Thêm vào giỏ hàng" : "Hết hàng"}
                </Button>
                <Button
                  variant="outline"
                  className="p-2 border-gray-300 hover:bg-gray-50"
                >
                  <Heart size={20} className="text-red-500" />
                </Button>
              </div>

              {/* Shipping Info */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <Truck className="text-blue-500 mr-2" size={20} />
                  <span className="text-sm">Giao hàng miễn phí toàn quốc</span>
                </div>
                <div className="flex items-center">
                  <ShieldCheck className="text-green-500 mr-2" size={20} />
                  <span className="text-sm">Đảm bảo chính hãng 100%</span>
                </div>
                <div className="flex items-center">
                  <RotateCcw className="text-orange-500 mr-2" size={20} />
                  <span className="text-sm">7 ngày đổi trả dễ dàng</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Mô tả sản phẩm</h2>
          <div className="prose max-w-none">
            <p className="mb-4">
              {book.description || "Không có mô tả cho sản phẩm này."}
            </p>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Đánh giá từ khách hàng</h2>

          <div className="flex flex-col md:flex-row md:items-start gap-8 mb-8">
            {/* Rating Summary */}
            <div className="flex items-center md:w-1/3">
              <div className="mr-4">
                <span className="text-4xl font-bold">
                  {Number(averageRating).toFixed(1)}
                </span>
                <span className="text-gray-500">/5</span>
              </div>
              <div>
                <div className="flex mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={24}
                      className={
                        i < Math.floor(averageRating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  {reviewCount} đánh giá
                </div>
              </div>
            </div>

            {/* Review Form */}
            <div className="md:w-2/3 border rounded-lg p-4">
              {isAuthenticated ? (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <h3 className="text-lg font-medium mb-2">
                    {hasReviewed
                      ? "Cập nhật đánh giá của bạn"
                      : "Gửi đánh giá của bạn"}
                  </h3>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Đánh giá của bạn
                    </label>
                    <div className="flex space-x-1 mt-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Star
                          key={rating}
                          size={30}
                          onClick={() => handleRatingClick(rating)}
                          className={`cursor-pointer ${
                            rating <= selectedRating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <input type="hidden" name="rating" value={selectedRating} />
                  </div>

                  <div>
                    <label
                      htmlFor="comment"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nhận xét
                    </label>
                    <Textarea
                      id="comment"
                      placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                      className="resize-none"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full md:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Đang gửi..."
                      : hasReviewed
                      ? "Cập nhật đánh giá"
                      : "Gửi đánh giá"}
                  </Button>
                </form>
              ) : (
                <div className="text-center py-4">
                  <p className="mb-4">Bạn cần đăng nhập để đánh giá sản phẩm</p>
                  <Link
                    to={`${ROUTES.LOGIN}?redirect=${encodeURIComponent(
                      window.location.pathname
                    )}`}
                    className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Đăng nhập
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Review List */}
          {reviews.length > 0 ? (
            <div className="space-y-6">
              <h3 className="font-medium text-lg border-b pb-2">
                Tất cả đánh giá ({reviewCount})
              </h3>
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-4">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {review.user_name
                        ? review.user_name.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                    <div>
                      <div className="font-medium">
                        {review.user_name || `Người dùng ${review.user_id}`}
                      </div>
                      <div className="flex mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(review.created_at).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment || ""}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8 border-t mt-4">
              Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên đánh
              giá!
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedBooks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {relatedBooks.map((relatedBook) => (
                <BookCard
                  key={relatedBook.id}
                  id={relatedBook.id}
                  title={relatedBook.name}
                  author={relatedBook.author_name}
                  coverImage={relatedBook.image_url}
                  price={relatedBook.sale_price || relatedBook.price}
                  originalPrice={relatedBook.price}
                  images={relatedBook.images}
                  stockQuantity={relatedBook.stock_quantity}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetailPage;
