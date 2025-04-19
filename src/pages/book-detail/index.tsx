import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Truck, ShieldCheck, RotateCcw, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookCard from "@/components/BookCard";
import { ROUTES } from "@/constants";
import { fetchProductDetails, fetchProductReviews } from "@/lib/api";
import { Product, Review } from "@/types";

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

  useEffect(() => {
    const loadProductData = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        // Fetch product details
        const productData = await fetchProductDetails(id);
        console.log(productData);
        setBook(productData);

        // Fetch product reviews
        const reviewsData = await fetchProductReviews(id);
        setReviews(reviewsData.reviews || []);
        setAverageRating(reviewsData.average_rating || 0);
        setReviewCount(reviewsData.review_count || 0);
      } catch (err) {
        setError("Không thể tải thông tin sách");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProductData();
  }, [id]);

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

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
                src={book.image_url || "/placeholder-book.jpg"}
                alt={book.name}
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
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button className="bg-red-600 hover:bg-red-700 px-8 py-6">
                  Mua ngay
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600 px-8 py-6">
                  Thêm vào giỏ hàng
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-100 px-4 py-6"
                >
                  <Heart className="mr-2" size={20} />
                  Thêm vào yêu thích
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

          <div className="flex items-center mb-6">
            <div className="mr-4">
              <span className="text-4xl font-bold">
                {averageRating.toFixed(1)}
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

          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-4">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {review.user_id}
                    </div>
                    <div>
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
            <div className="text-gray-500 text-center py-8">
              Chưa có đánh giá nào cho sản phẩm này
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
