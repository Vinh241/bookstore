import { Link } from "react-router-dom";

import { getBookDetailUrl, BACKEND_URL } from "@/constants";

import BookPlaceholder from "@/assets/images/books.avif";
interface BookCardProps {
  id: number;
  title: string;
  coverImage?: string;
  price: number;
  originalPrice: number;
  author?: string;
  images?: Array<{ image_url: string; is_primary: boolean }>;
  stockQuantity?: number;
}

const BookCard = ({
  id,
  title,
  author,
  coverImage,
  price,
  originalPrice,
  images,
  stockQuantity,
}: BookCardProps) => {
  // Get primary image from images array, or fallback to coverImage
  const getImageSrc = () => {
    if (images && images.length > 0) {
      // Tìm ảnh chính (is_primary = true) hoặc lấy ảnh đầu tiên
      const imageUrl =
        images.find((img) => img.is_primary)?.image_url || images[0].image_url;

      // Thêm baseURL nếu đường dẫn là tương đối
      if (imageUrl && imageUrl.startsWith("/")) {
        return `${BACKEND_URL}${imageUrl}`;
      }
      return imageUrl;
    }
    // Fallback to coverImage
    if (coverImage) {
      if (coverImage.startsWith("/")) {
        return `${BACKEND_URL}${coverImage}`;
      }
      return coverImage;
    }
    // Fallback to placeholder
    return BookPlaceholder;
  };

  const imageSrc = getImageSrc();
  const isOutOfStock = typeof stockQuantity === "number" && stockQuantity <= 0;

  return (
    <Link
      to={getBookDetailUrl(id)}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full relative"
    >
      {/* Discount badge */}
      {!isOutOfStock && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg z-10">
          -{(((originalPrice - price) / originalPrice) * 100).toFixed(0)}%
        </div>
      )}

      {/* Out of stock badge */}
      {isOutOfStock && (
        <div className="absolute top-0 right-0 bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg z-10">
          Hết hàng
        </div>
      )}

      {/* Book cover */}
      <div className="relative pt-[150%]">
        <img
          src={imageSrc}
          alt={title}
          className={`absolute top-0 left-0 w-full h-full object-cover ${
            isOutOfStock ? "opacity-60" : ""
          }`}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = BookPlaceholder;
          }}
        />
      </div>

      {/* Book info */}
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="font-medium text-sm line-clamp-2 mb-1">{title}</h3>
        <p className="text-gray-500 text-xs mb-2">{author}</p>
        <div className="mt-auto">
          <div className="font-bold text-red-600">
            {price.toLocaleString()}đ
          </div>

          <div className="text-gray-500 text-xs line-through">
            {originalPrice.toLocaleString()}đ
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
