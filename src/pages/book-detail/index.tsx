import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Truck, ShieldCheck, RotateCcw, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookCard from "@/components/BookCard";
import { books } from "@/lib/data";
import { ROUTES, getCategoryUrl } from "@/constants";

const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);

  // Find the current book
  const book = books.find((b) => b.id === id);

  // Find related books from the same category
  const relatedBooks = books
    .filter((b) => b.category === book?.category && b.id !== id)
    .slice(0, 5);

  if (!book) {
    return (
      <div className="container mx-auto py-10 text-center">
        Không tìm thấy sách
      </div>
    );
  }

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

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
              to={getCategoryUrl(book.category)}
              className="hover:text-red-500"
            >
              {book.category.charAt(0).toUpperCase() +
                book.category.slice(1).replace("-", " ")}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">{book.title}</span>
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Product Image */}
            <div className="border rounded-lg overflow-hidden">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="lg:col-span-2">
              <h1 className="text-2xl font-bold mb-2">{book.title}</h1>

              <div className="flex items-center mb-4">
                <div className="flex mr-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.floor(book.reviews.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-blue-600">
                  {book.reviews.count} đánh giá
                </span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-sm text-green-600">Đã bán 200+</span>
              </div>

              {/* Price */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center mb-2">
                  <span className="text-3xl font-bold text-red-600 mr-3">
                    {book.price.toLocaleString()}đ
                  </span>
                  {book.discount > 0 && (
                    <>
                      <span className="text-gray-500 line-through mr-2">
                        {book.originalPrice.toLocaleString()}đ
                      </span>
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                        -{book.discount}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Book Info */}
              <div className="grid grid-cols-2 gap-y-2 mb-6">
                <div className="text-gray-500">Tác giả:</div>
                <div className="font-medium">{book.author}</div>

                <div className="text-gray-500">Nhà xuất bản:</div>
                <div className="font-medium">{book.publisher}</div>

                <div className="text-gray-500">Ngày phát hành:</div>
                <div className="font-medium">{book.publishDate}</div>

                <div className="text-gray-500">Số trang:</div>
                <div className="font-medium">{book.pages}</div>

                <div className="text-gray-500">Ngôn ngữ:</div>
                <div className="font-medium">{book.language}</div>
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
            <p className="mb-4">{book.description}</p>
          </div>
        </div>

        {/* Related Products */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {relatedBooks.map((relatedBook) => (
              <BookCard
                key={relatedBook.id}
                id={relatedBook.id}
                title={relatedBook.title}
                author={relatedBook.author}
                coverImage={relatedBook.coverImage}
                price={relatedBook.price}
                originalPrice={relatedBook.originalPrice}
                discount={relatedBook.discount}
                isNew={relatedBook.isNew}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
