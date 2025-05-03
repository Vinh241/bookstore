import { useState, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import BookCard from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { categories } from "@/lib/data";
import { ROUTES, CATEGORIES } from "@/constants";
import {
  fetchCategoryProducts,
  fetchPublishers,
  fetchCategoryDetails,
} from "@/lib/api";
import { Product } from "@/types";

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

  const [searchParams, setSearchParams] = useSearchParams();

  // State for filters
  const [sortBy, setSortBy] = useState("quantity_sold");
  const [sortOrder, setSortOrder] = useState("desc");
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedPublishers, setSelectedPublishers] = useState<number[]>([]);

  // Products state
  const [books, setBooks] = useState<Product[]>([]);
  const [publishers, setPublishers] = useState<{ id: number; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [limit] = useState(12);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [categoryName, setCategoryName] = useState("Tất cả sách");

  // Get the sorting option
  const getSortOption = () => {
    if (sortBy === "price") {
      return sortOrder === "asc" ? "price-asc" : "price-desc";
    }
    if (sortBy === "created_at") return "newest";
    if (sortBy === "quantity_sold") return "bestselling";
    return "popular";
  };

  // Set the sort option
  const handleSortChange = (option: string) => {
    switch (option) {
      case "price-asc":
        setSortBy("price");
        setSortOrder("asc");
        break;
      case "price-desc":
        setSortBy("price");
        setSortOrder("desc");
        break;
      case "newest":
        setSortBy("created_at");
        setSortOrder("desc");
        break;
      case "bestselling":
        setSortBy("quantity_sold");
        setSortOrder("desc");
        break;
      default:
        setSortBy("quantity_sold");
        setSortOrder("desc");
        break;
    }
  };

  // Load publishers and set initial selected publishers
  useEffect(() => {
    const loadPublishers = async () => {
      try {
        const publishersData = await fetchPublishers();
        setPublishers(publishersData);
        // Select all publishers initially
        setSelectedPublishers(publishersData.map((p) => p.id));
      } catch (err) {
        console.error("Error loading publishers:", err);
      }
    };

    loadPublishers();
  }, []);

  // Fetch products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit,
          sortBy,
          sortOrder,
          categoryId: categoryId ? parseInt(categoryId) : undefined,
          publisherIds:
            selectedPublishers.length > 0 ? selectedPublishers : undefined,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
        };

        const result = await fetchCategoryProducts(params);
        setBooks(result.products || []);
        setTotalProducts(result.total || 0);
        setTotalPages(result.totalPages || 0);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Không thể tải danh sách sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    categoryId,
    page,
    limit,
    sortBy,
    sortOrder,
    priceRange,
    selectedPublishers,
  ]);

  // Get the category display name from the categoryId
  useEffect(() => {
    const getCategoryName = async () => {
      try {
        if (categoryId) {
          const category = await fetchCategoryDetails(categoryId);
          console.log("cata", category);
          setCategoryName(
            (category as any)?.category?.name || "Danh mục không tồn tại"
          );
        }
      } catch (error) {
        console.error("Error fetching category details:", error);
        setCategoryName("Danh mục không tồn tại");
      }
    };

    getCategoryName();
  }, [categoryId]);

  // Toggle publisher selection
  const togglePublisher = (publisherId: number) => {
    setSelectedPublishers((prev) =>
      prev.includes(publisherId)
        ? prev.filter((p) => p !== publisherId)
        : [...prev, publisherId]
    );
  };

  // Reset filters
  const resetFilters = () => {
    setPriceRange([0, 500000]);
    setSelectedPublishers([]);
    setSortBy("quantity_sold");
    setSortOrder("desc");
    setPage(1);
  };

  // Handle pagination
  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
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
            <span className="text-gray-700">{categoryName}</span>
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
              {publishers.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {publishers.map((publisher) => (
                    <div key={publisher.id} className="flex items-center">
                      <Checkbox
                        id={`publisher-${publisher.id}`}
                        checked={selectedPublishers.includes(publisher.id)}
                        onCheckedChange={() => togglePublisher(publisher.id)}
                        className="mr-2"
                      />
                      <label
                        htmlFor={`publisher-${publisher.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {publisher.name}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Đang tải...</p>
              )}
            </div>

            {/* Apply Filters (Mobile) */}
            <div className="md:hidden">
              <Button className="w-full" onClick={() => setFilterOpen(false)}>
                Áp dụng
              </Button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="md:col-span-3">
            {/* Category Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <h1 className="text-xl font-bold mb-1">{categoryName}</h1>
                  <p className="text-gray-500 text-sm">
                    {totalProducts} sản phẩm
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <select
                    className="border rounded-md px-3 py-2 text-sm"
                    value={getSortOption()}
                    onChange={(e) => handleSortChange(e.target.value)}
                  >
                    <option value="bestselling">Bán chạy nhất</option>
                    <option value="price-asc">Giá: Thấp đến cao</option>
                    <option value="price-desc">Giá: Cao đến thấp</option>
                    <option value="newest">Mới nhất</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Loading state */}
            {loading && (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500">Đang tải sản phẩm...</p>
              </div>
            )}

            {/* Error state */}
            {error && !loading && (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h2 className="text-xl font-medium mb-2 text-red-500">
                  Có lỗi xảy ra
                </h2>
                <p className="text-gray-500 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Thử lại
                </Button>
              </div>
            )}

            {/* Products */}
            {!loading && !error && (
              <>
                {books.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {books.map((book) => (
                        <BookCard
                          key={book.id}
                          id={book.id}
                          title={book.name}
                          author={book.author_name || ""}
                          coverImage={book.image_url || ""}
                          price={book.sale_price || book.price}
                          originalPrice={book.price}
                          images={book.images}
                          stockQuantity={book.stock_quantity}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center mt-8 space-x-2">
                        <Button
                          variant="outline"
                          onClick={handlePreviousPage}
                          disabled={page === 1}
                        >
                          Trang trước
                        </Button>
                        <span className="text-sm">
                          Trang {page} / {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          onClick={handleNextPage}
                          disabled={page === totalPages}
                        >
                          Trang tiếp
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <h2 className="text-xl font-medium mb-2">
                      Không tìm thấy sản phẩm
                    </h2>
                    <p className="text-gray-500 mb-4">
                      Vui lòng thử lại với bộ lọc khác
                    </p>
                    <Button variant="outline" onClick={resetFilters}>
                      Xóa bộ lọc
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
