import { Link } from "react-router-dom";
import Carousel from "@/components/Carousel";
import BookCard from "@/components/BookCard";
import {
  banners,
  categories,
  newBooks,
  discountBooks,
  bestSellerBooks,
} from "@/lib/data";
import { ROUTES, getCategoryUrl } from "@/constants";

const HomePage = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Banner Carousel */}
      <section className="container mx-auto py-6">
        <Carousel banners={banners} />
      </section>

      {/* Categories */}
      <section className="container mx-auto py-8">
        <h2 className="text-2xl font-bold mb-6">Danh Mục Sản Phẩm</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={getCategoryUrl(category.id)}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col items-center justify-center text-center"
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-red-500 font-bold">
                  {category.name.charAt(0)}
                </span>
              </div>
              <span className="text-sm font-medium">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Flash Sale */}
      <section className="bg-red-50 py-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <span className="text-red-500 mr-2">FLASH SALE</span>
            </h2>
            <Link
              to={ROUTES.FLASH_SALE}
              className="text-red-500 font-medium hover:underline"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {discountBooks.slice(0, 5).map((book) => (
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
      </section>

      {/* New Books */}
      <section className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Sách Mới</h2>
          <Link
            to={ROUTES.NEW_BOOKS}
            className="text-red-500 font-medium hover:underline"
          >
            Xem tất cả
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {newBooks.map((book) => (
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
      </section>

      {/* Best Sellers */}
      <section className="bg-gray-100 py-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Sách Bán Chạy</h2>
            <Link
              to={ROUTES.BEST_SELLERS}
              className="text-red-500 font-medium hover:underline"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {bestSellerBooks.map((book) => (
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
      </section>

      {/* Features */}
      <section className="container mx-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold mb-1">Giao Hàng Nhanh</h3>
              <p className="text-gray-600 text-sm">Chỉ từ 2-3 ngày</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
            <div className="bg-green-100 rounded-full p-3 mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold mb-1">Sản Phẩm Chính Hãng</h3>
              <p className="text-gray-600 text-sm">100% sách chính hãng</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
            <div className="bg-orange-100 rounded-full p-3 mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold mb-1">Thanh Toán An Toàn</h3>
              <p className="text-gray-600 text-sm">Nhiều phương thức</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
            <div className="bg-purple-100 rounded-full p-3 mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold mb-1">Hỗ Trợ 24/7</h3>
              <p className="text-gray-600 text-sm">Luôn sẵn sàng hỗ trợ</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
