import { Link } from "react-router-dom";

import { getBookDetailUrl } from "@/constants";

import BookPlaceholder from "@/assets/images/books.avif";
interface BookCardProps {
  id: number;
  title: string;
  coverImage?: string;
  price: number;
  originalPrice: number;
  author?: string;
}

const BookCard = ({
  id,
  title,
  author,
  coverImage,
  price,
  originalPrice,
}: BookCardProps) => {
  return (
    <Link
      to={getBookDetailUrl(id)}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full relative"
    >
      {/* Discount badge */}
      <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg z-10">
        -{(((originalPrice - price) / originalPrice) * 100).toFixed(0)}%
      </div>

      {/* Book cover */}
      <div className="relative pt-[150%]">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        ) : (
          <img
            src={BookPlaceholder}
            alt={title}
            className="absolute top-0 left-0 w-full h-full object-cover "
          />
        )}
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
