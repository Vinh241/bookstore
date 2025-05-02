import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import { Product, Category } from "@/types";
import { BACKEND_URL } from "@/constants";
import defaultBookImage from "@/assets/images/books.avif";

// Hàm tạo slug từ text
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD") // Phân tách các ký tự có dấu thành ký tự + dấu
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các dấu
    .replace(/[đĐ]/g, "d") // Thay đổi đ/Đ thành d
    .replace(/[^a-z0-9\s]/g, "") // Chỉ giữ lại chữ cái, số và khoảng trắng
    .trim()
    .replace(/\s+/g, "-"); // Thay thế khoảng trắng bằng dấu gạch ngang
};

const AdminProducts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [publishers, setPublishers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("name_asc");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const [productImages, setProductImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state for add/edit product
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    stock_quantity: "",
    category_id: "none",
    publisher_id: "none",
    isbn: "",
  });

  // Load products, categories, and publishers on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchProducts(),
          fetchCategories(),
          fetchPublishers(),
        ]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, sortBy, categoryFilter]);

  // Fetch products with pagination and filters
  const fetchProducts = async () => {
    try {
      let params: any = {
        page: currentPage,
        limit: itemsPerPage,
      };

      // Add sort parameters
      if (sortBy) {
        const [field, order] = sortBy.split("_");
        params.sortBy = field;
        params.sortOrder = order;
      }

      // Add category filter if selected
      if (categoryFilter && categoryFilter !== "all") {
        params.categoryId = categoryFilter;
      }

      // Add search term if present
      if (searchTerm.trim()) {
        params.search = searchTerm;
      }

      const response = await axiosInstance.get("/products", { params });

      // Cập nhật lại cách lấy dữ liệu từ response
      if (response.data) {
        setProducts(response.data.data || []);

        // Lấy thông tin phân trang từ response
        if (response.data.pagination) {
          setTotalItems(response.data.pagination.total || 0);
          setTotalPages(response.data.pagination.totalPages || 1);
        } else {
          setTotalItems(0);
          setTotalPages(1);
        }
      } else {
        setProducts([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Không thể tải danh sách sản phẩm");
      setProducts([]);
      setTotalItems(0);
      setTotalPages(1);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/categories");
      setCategories(response.data?.data?.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch publishers
  const fetchPublishers = async () => {
    try {
      const response = await axiosInstance.get("/publishers");
      setPublishers(response.data || []);
    } catch (error) {
      console.error("Error fetching publishers:", error);
    }
  };

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on new search
    fetchProducts();
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Nếu thay đổi name, tự động tạo slug
    if (name === "name") {
      const newSlug = generateSlug(value);
      setFormData({
        ...formData,
        [name]: value,
        slug: newSlug,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Thêm hàm để lấy ảnh sản phẩm
  const getProductImage = (product: Product) => {
    // Nếu sản phẩm có mảng images, ưu tiên dùng ảnh có is_primary = true
    if (product.images && product.images.length > 0) {
      const imageUrl =
        product.images.find((img) => img.is_primary)?.image_url ||
        product.images[0].image_url;

      // Thêm baseURL nếu đường dẫn là tương đối
      if (imageUrl && imageUrl.startsWith("/")) {
        return `${BACKEND_URL}${imageUrl}`;
      }
      return imageUrl;
    }

    // Nếu không có mảng images, dùng image_url
    if (product.image_url) {
      if (product.image_url.startsWith("/")) {
        return `${BACKEND_URL}${product.image_url}`;
      }
      return product.image_url;
    }

    // Trả về ảnh mặc định nếu không có ảnh
    return defaultBookImage;
  };

  // Thêm hàm xử lý upload ảnh
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const previewArray = filesArray.map((file) => URL.createObjectURL(file));

      setProductImages((prev) => [...prev, ...filesArray]);
      setImagePreview((prev) => [...prev, ...previewArray]);
    }
  };

  // Xóa một ảnh khỏi danh sách
  const handleRemoveImage = (index: number) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreview((prev) => {
      // Revoke object URL to free memory
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Reset ảnh khi đóng form
  const handleCloseProductDialog = () => {
    // Revoke all object URLs
    imagePreview.forEach((url) => URL.revokeObjectURL(url));
    setProductImages([]);
    setImagePreview([]);
    setIsProductDialogOpen(false);
  };

  // Open product dialog for adding a new product
  const handleAddProduct = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      price: "",
      stock_quantity: "",
      category_id: "none",
      publisher_id: "none",
      isbn: "",
    });
    setSelectedProduct(null);
    // Clear images
    imagePreview.forEach((url) => URL.revokeObjectURL(url));
    setProductImages([]);
    setImagePreview([]);
    setIsProductDialogOpen(true);
  };

  // Open product dialog for editing an existing product
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      price: product.price.toString(),
      stock_quantity: product.stock_quantity.toString(),
      category_id: product.category_id?.toString() || "none",
      publisher_id: product.publisher_id?.toString() || "none",
      isbn: product.isbn || "",
    });

    // Clear any existing image previews
    imagePreview.forEach((url) => URL.revokeObjectURL(url));
    setProductImages([]);
    setImagePreview([]);

    setIsProductDialogOpen(true);
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  // Submit product form (create or update)
  const handleSubmitProduct = async () => {
    try {
      // Basic validation
      if (!formData.name || !formData.price || !formData.slug) {
        toast.error("Tên sản phẩm, slug và giá là bắt buộc");
        return;
      }

      // First: Upload images if any
      let uploadedImageUrls: { image_url: string; is_primary: boolean }[] = [];

      if (productImages.length > 0) {
        // Chuẩn bị FormData để upload ảnh
        const imageFormData = new FormData();

        // Thêm tất cả các file vào FormData
        productImages.forEach((file) => {
          imageFormData.append("images", file);
        });

        // Upload ảnh
        try {
          const imageResponse = await axiosInstance.post(
            "/upload/images",
            imageFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          // Lấy danh sách URLs ảnh đã upload
          if (imageResponse.data && imageResponse.data.imageUrls) {
            uploadedImageUrls = imageResponse.data.imageUrls.map(
              (url: string, index: number) => ({
                image_url: url,
                is_primary: index === 0, // Ảnh đầu tiên là ảnh chính
              })
            );
          }

          toast.success("Tải lên ảnh thành công");
        } catch (error) {
          console.error("Error uploading images:", error);
          toast.error("Không thể tải lên ảnh. Vui lòng thử lại.");
          return; // Dừng luồng nếu không upload được ảnh
        }
      }

      // Second: Create or update product with image URLs
      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
        category_id:
          formData.category_id && formData.category_id !== "none"
            ? parseInt(formData.category_id)
            : null,
        publisher_id:
          formData.publisher_id && formData.publisher_id !== "none"
            ? parseInt(formData.publisher_id)
            : null,
        isbn: formData.isbn || null,
        // Thêm thông tin ảnh vào dữ liệu sản phẩm nếu có
        product_images:
          uploadedImageUrls.length > 0 ? uploadedImageUrls : undefined,
      };

      if (selectedProduct) {
        // Update existing product
        await axiosInstance.put(`/products/${selectedProduct.id}`, productData);
        toast.success("Cập nhật sản phẩm thành công");
      } else {
        // Create new product
        await axiosInstance.post("/products", productData);
        toast.success("Thêm sản phẩm thành công");
      }

      handleCloseProductDialog();
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Không thể lưu sản phẩm. Vui lòng thử lại.");
    }
  };

  // Delete product
  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;

    try {
      await axiosInstance.delete(`/products/${selectedProduct.id}`);
      toast.success("Xóa sản phẩm thành công");
      setIsDeleteDialogOpen(false);

      // Refresh products list
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Không thể xóa sản phẩm. Vui lòng thử lại.");
    }
  };

  // Change page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  // Handle category filter change
  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value === "all" ? "" : value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
        <Button onClick={handleAddProduct}>+ Thêm sản phẩm mới</Button>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between">
            <div className="relative w-64">
              <Input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <div className="flex space-x-2">
              <Select
                value={categoryFilter}
                onValueChange={handleCategoryFilterChange}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Tất cả danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name_asc">Tên A-Z</SelectItem>
                  <SelectItem value="name_desc">Tên Z-A</SelectItem>
                  <SelectItem value="price_asc">Giá thấp - cao</SelectItem>
                  <SelectItem value="price_desc">Giá cao - thấp</SelectItem>
                  <SelectItem value="stock_quantity_asc">
                    Tồn kho thấp - cao
                  </SelectItem>
                  <SelectItem value="stock_quantity_desc">
                    Tồn kho cao - thấp
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center">Đang tải dữ liệu...</div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center">
              Không có sản phẩm nào phù hợp với tìm kiếm
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Sản phẩm
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Danh mục
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Giá
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tồn kho
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{product.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded">
                          <img
                            src={getProductImage(product)}
                            alt={product.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category_name || "Chưa phân loại"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.price.toLocaleString("vi-VN")} ₫
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.stock_quantity < 20 ? (
                        <span className="text-red-600 font-medium">
                          {product.stock_quantity}
                        </span>
                      ) : (
                        product.stock_quantity
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => handleEditProduct(product)}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="ghost"
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteClick(product)}
                        >
                          Xóa
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                {totalItems > 0 ? (
                  <>
                    Hiển thị{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * itemsPerPage + 1}
                    </span>{" "}
                    đến{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, totalItems)}
                    </span>{" "}
                    của <span className="font-medium">{totalItems}</span> kết
                    quả
                  </>
                ) : (
                  <>
                    <span className="font-medium">0</span> kết quả
                  </>
                )}
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <Button
                  variant="outline"
                  disabled={currentPage === 1 || totalItems === 0}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Trước</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>

                {totalItems > 0 &&
                  Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Calculate which page numbers to show
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={i}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}

                <Button
                  variant="outline"
                  disabled={currentPage === totalPages || totalItems === 0}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Sau</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Product Form Dialog */}
      <Dialog
        open={isProductDialogOpen}
        onOpenChange={handleCloseProductDialog}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name">Tên sản phẩm *</label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nhập tên sản phẩm"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="slug">Slug *</label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="vd: sach-dac-nhan-tam"
              />
              <p className="text-xs text-gray-500">
                Slug sẽ tự động tạo từ tên sản phẩm. Bạn có thể chỉnh sửa nếu
                cần.
              </p>
            </div>

            <div className="grid gap-2">
              <label htmlFor="description">Mô tả</label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Nhập mô tả sản phẩm"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="price">Giá *</label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Nhập giá sản phẩm"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="stock_quantity">Số lượng tồn kho</label>
                <Input
                  id="stock_quantity"
                  name="stock_quantity"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={handleInputChange}
                  placeholder="Nhập số lượng"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="category_id">Danh mục</label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) =>
                    handleSelectChange("category_id", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Không có danh mục</SelectItem>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <label htmlFor="publisher_id">Nhà xuất bản</label>
                <Select
                  value={formData.publisher_id}
                  onValueChange={(value) =>
                    handleSelectChange("publisher_id", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn nhà xuất bản" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Không có nhà xuất bản</SelectItem>
                    {publishers.map((publisher) => (
                      <SelectItem
                        key={publisher.id}
                        value={publisher.id.toString()}
                      >
                        {publisher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="isbn">ISBN</label>
              <Input
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleInputChange}
                placeholder="Nhập mã ISBN"
              />
            </div>

            {/* Thêm phần upload ảnh */}
            <div className="grid gap-2">
              <label htmlFor="images">Ảnh sản phẩm</label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Chọn ảnh
                </Button>
                <input
                  type="file"
                  id="images"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />
                <span className="text-sm text-gray-500">
                  {productImages.length > 0
                    ? `Đã chọn ${productImages.length} ảnh`
                    : "Chưa có ảnh nào được chọn"}
                </span>
              </div>

              {/* Hiển thị preview ảnh */}
              {imagePreview.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {imagePreview.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className="h-20 w-full object-cover rounded border border-gray-200"
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white text-xs text-center py-0.5">
                          Ảnh chính
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Hiển thị ảnh hiện tại của sản phẩm nếu đang chỉnh sửa */}
              {selectedProduct &&
                selectedProduct.images &&
                selectedProduct.images.length > 0 &&
                imagePreview.length === 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">Ảnh hiện tại:</p>
                    <div className="grid grid-cols-4 gap-2">
                      {selectedProduct.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={
                              image.image_url.startsWith("/")
                                ? `${BACKEND_URL}${image.image_url}`
                                : image.image_url
                            }
                            alt={`Product image ${index}`}
                            className="h-20 w-full object-cover rounded border border-gray-200"
                          />
                          {image.is_primary && (
                            <div className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white text-xs text-center py-0.5">
                              Ảnh chính
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
          <DialogFooter className="  bg-white pt-2 pb-0 border-t">
            <Button variant="outline" onClick={handleCloseProductDialog}>
              Hủy
            </Button>
            <Button onClick={handleSubmitProduct}>
              {selectedProduct ? "Cập nhật" : "Thêm sản phẩm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Bạn có chắc chắn muốn xóa sản phẩm{" "}
              <span className="font-medium">{selectedProduct?.name}</span>?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Hành động này không thể hoàn tác.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
