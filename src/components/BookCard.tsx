import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBookDetailUrl } from "@/constants";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  price: number;
  originalPrice: number;
  discount: number;
  isNew?: boolean;
}

const BookCard = ({
  id,
  title,
  author,
  coverImage,
  price,
  originalPrice,
  discount,
  isNew,
}: BookCardProps) => {
  return (
    <Link
      to={getBookDetailUrl(id)}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full"
    >
      {/* Discount badge */}
      {discount > 0 && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
          -{discount}%
        </div>
      )}

      {/* New badge */}
      {isNew && (
        <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-br-lg">
          Mới
        </div>
      )}

      {/* Book cover */}
      <div className="relative pt-[150%]">
        <img
          src={coverImage}
          alt={title}
          className="absolute top-0 left-0 w-full h-full object-cover"
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
          {discount > 0 && (
            <div className="text-gray-500 text-xs line-through">
              {originalPrice.toLocaleString()}đ
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
