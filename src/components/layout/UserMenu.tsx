import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/constants";
import { User, LayoutDashboard } from "lucide-react";

const UserMenu: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2">
        <Link to={ROUTES.LOGIN}>
          <Button variant="outline" size="sm">
            Đăng nhập
          </Button>
        </Link>
        <Link to={ROUTES.REGISTER}>
          <Button size="sm">Đăng ký</Button>
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="hidden md:inline">{user.full_name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {user.is_admin && (
          <>
            <DropdownMenuItem>
              <Link
                to={ROUTES.ADMIN}
                className="w-full flex items-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Quản trị hệ thống</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem>
          <Link to={ROUTES.ACCOUNT} className="w-full">
            Tài khoản
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to={ROUTES.WISHLIST} className="w-full">
            Sản phẩm yêu thích
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to={ROUTES.MY_ORDERS} className="w-full">
            Đơn hàng của tôi
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Đăng xuất</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
