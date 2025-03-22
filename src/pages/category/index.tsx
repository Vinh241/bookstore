import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import BookCard from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { books, categories } from "@/lib/data";
import { ROUTES, CATEGORIES } from "@/constants";

const sortOptions = [
  { value: "popular", label: "Phổ biến nhất" },
  { value: "newest", label: "Mới nhất" },
  { value: "priceAsc", label: "Giá: Thấp đến cao" },
  { value: "priceDesc", label: "Giá: Cao đến thấp" },
  { value: "discountDesc", label: "Giảm giá nhiều nhất" },
];

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [sortBy, setSortBy] = useState("popular");
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedPublishers, setSelectedPublishers] = useState<string[]>([]);

  // Get the category display name from the categoryId
  const getCategoryName = () => {
    if (!categoryId) return "Tất cả sách";
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "Danh mục không tồn tại";
  };

  // Get the books for the current category
  const getCategoryBooks = () => {
    let filteredBooks = books;

    // Filter by category if specified
    if (categoryId && categoryId !== "all") {
      // Special categories
      if (categoryId === CATEGORIES.FLASH_SALE) {
        filteredBooks = books.filter((book) => book.discount >= 20);
      } else if (categoryId === CATEGORIES.NEW_BOOKS) {
        filteredBooks = books.filter((book) => book.isNew);
      } else if (categoryId === CATEGORIES.BEST_SELLERS) {
        filteredBooks = books
          .sort((a, b) => b.reviews.count - a.reviews.count)
          .slice(0, 20);
      } else {
        filteredBooks = books.filter((book) => book.category === categoryId);
      }
    }

    // Apply price filter
    filteredBooks = filteredBooks.filter(
      (book) => book.price >= priceRange[0] && book.price <= priceRange[1]
    );

    // Apply publisher filter
    if (selectedPublishers.length > 0) {
      filteredBooks = filteredBooks.filter((book) =>
        selectedPublishers.includes(book.publisher)
      );
    }

    // Apply sorting
    if (sortBy === "newest") {
      return [...filteredBooks].sort(
        (a, b) =>
          new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      );
    } else if (sortBy === "priceAsc") {
      return [...filteredBooks].sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceDesc") {
      return [...filteredBooks].sort((a, b) => b.price - a.price);
    } else if (sortBy === "discountDesc") {
      return [...filteredBooks].sort((a, b) => b.discount - a.discount);
    }

    // Default sort by popularity
    return [...filteredBooks].sort((a, b) => b.reviews.count - a.reviews.count);
  };

  const categoryBooks = getCategoryBooks();

  // Get unique publishers from the filtered books
  const publishers = Array.from(
    new Set(books.map((book) => book.publisher))
  ).sort();

  // Toggle publisher selection
  const togglePublisher = (publisher: string) => {
    setSelectedPublishers((prev) =>
      prev.includes(publisher)
        ? prev.filter((p) => p !== publisher)
        : [...prev, publisher]
    );
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
            <span className="text-gray-700">{getCategoryName()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filter sidebar - mobile toggle */}
          <div className="md:hidden mb-4">
            <Button
              variant="outline"
              className="w-full flex justify-between items-center"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <div className="flex items-center">
                <SlidersHorizontal size={18} className="mr-2" />
                Lọc sản phẩm
              </div>
              <ChevronDown
                size={18}
                className={`transition-transform ${
                  filterOpen ? "rotate-180" : ""
                }`}
              />
            </Button>
          </div>

          {/* Filter sidebar - desktop & mobile expanded */}
          <div
            className={`md:block ${
              filterOpen ? "block" : "hidden"
            } bg-white rounded-lg shadow-sm p-4 md:sticky md:top-4 h-fit`}
          >
            <h2 className="font-bold text-lg mb-4">Lọc sản phẩm</h2>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Khoảng giá</h3>
              <div className="mx-2">
                <Slider
                  defaultValue={[0, 500000]}
                  max={500000}
                  step={50000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-4"
                />
                <div className="flex justify-between text-sm">
                  <span>{priceRange[0].toLocaleString()}đ</span>
                  <span>{priceRange[1].toLocaleString()}đ</span>
                </div>
              </div>
            </div>

            {/* Publishers */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Nhà xuất bản</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {publishers.map((publisher) => (
                  <div key={publisher} className="flex items-center">
                    <Checkbox
                      id={`publisher-${publisher}`}
                      checked={selectedPublishers.includes(publisher)}
                      onCheckedChange={() => togglePublisher(publisher)}
                      className="mr-2"
                    />
                    <label
                      htmlFor={`publisher-${publisher}`}
                      className="text-sm cursor-pointer"
                    >
                      {publisher}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Apply Filters (Mobile) */}
            <div className="md:hidden">
              <Button className="w-full">Áp dụng</Button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="md:col-span-3">
            {/* Category Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h1 className="text-xl font-bold mb-1">{getCategoryName()}</h1>
              <p className="text-gray-500 text-sm mb-4">
                {categoryBooks.length} sản phẩm
              </p>

              {/* Sort Options */}
              <div className="flex flex-wrap items-center border-t pt-4">
                <span className="text-gray-500 mr-3">Sắp xếp theo:</span>
                <div className="flex flex-wrap gap-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`px-3 py-1 text-sm rounded-full ${
                        sortBy === option.value
                          ? "bg-red-500 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                      onClick={() => setSortBy(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Products */}
            {categoryBooks.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categoryBooks.map((book) => (
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
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h2 className="text-xl font-medium mb-2">
                  Không tìm thấy sản phẩm
                </h2>
                <p className="text-gray-500 mb-4">
                  Vui lòng thử lại với bộ lọc khác
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setPriceRange([0, 500000]);
                    setSelectedPublishers([]);
                  }}
                >
                  Xóa bộ lọc
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
