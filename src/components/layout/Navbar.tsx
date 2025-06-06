import { Link } from "react-router-dom";
import { Search, ShoppingCart, Menu, Phone, ChevronDown } from "lucide-react";
import { ROUTES } from "@/constants";
import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import UserMenu from "./UserMenu";

interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
}

const Navbar = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategories, setShowCategories] = useState(false);

  const { itemCount } = useCart();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/categories");
        const data = await response.json();

        if (data.status === "success" && data.data.categories) {
          // Sort by ID and get first 5
          const sortedCategories = [...data.data.categories]
            .sort((a, b) => Number(a.id) - Number(b.id))
            .slice(0, 5);

          setCategories(sortedCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  return (
    <div className="w-full bg-white">
      {/* Top banner - contact info */}
      <div className="bg-gray-100 py-1">
        <div className="container mx-auto flex justify-between items-center text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Phone size={14} />
              <span>Hotline: 1900 63 64 67</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="border-b">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to={ROUTES.HOME} className="font-bold text-2xl text-red-600">
              BOOKSTORE
            </Link>

            {/* Search bar */}
            {/* <div className="relative w-1/3">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <Button className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-1.5 h-auto">
                <Search size={18} />
              </Button>
            </div> */}

            {/* Right section - Search, Cart, Account */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <button className="p-2 text-gray-700 hover:text-red-600 md:hidden">
                <Search size={20} />
              </button>

              {/* Cart Button */}
              <Link
                to={ROUTES.CART}
                className="relative p-2 text-gray-700 hover:text-red-600"
              >
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              <UserMenu />
            </div>
          </div>
        </div>
      </div>

      {/* Categories menu */}
      <div className="bg-red-600 text-white">
        <div className="container mx-auto">
          <div className="flex items-center">
            <div
              className="py-3 px-4 flex items-center gap-2 font-medium cursor-pointer hover:bg-red-700 relative"
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
            >
              <Menu size={20} />
              <span>Danh mục sản phẩm</span>
              <ChevronDown size={16} />

              {/* Categories dropdown */}
              {showCategories && categories.length > 0 && (
                <div className="absolute top-full left-0 bg-white text-gray-800 w-64 shadow-lg z-50">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.id}`}
                      className="block px-4 py-2 hover:bg-gray-100 border-b border-gray-200"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="flex">
              <Link to={ROUTES.ABOUT_US} className="py-3 px-4 hover:bg-red-700">
                Về chúng tôi
              </Link>
              <Link to={ROUTES.POLICY} className="py-3 px-4 hover:bg-red-700">
                Chính sách
              </Link>
              <Link to={ROUTES.CONTACT} className="py-3 px-4 hover:bg-red-700">
                Liên hệ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
