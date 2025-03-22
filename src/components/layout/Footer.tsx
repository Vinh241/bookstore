import { Link } from "react-router-dom";
import {
  Mail,
  MapPin,
  Phone,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 pt-10 pb-5">
      <div className="container mx-auto">
        {/* Top footer with links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-lg mb-4">DỊCH VỤ</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/dieu-khoan"
                  className="text-gray-600 hover:text-red-500"
                >
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link
                  to="/chinh-sach"
                  className="text-gray-600 hover:text-red-500"
                >
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link
                  to="/gioi-thieu"
                  className="text-gray-600 hover:text-red-500"
                >
                  Giới thiệu Bookstore
                </Link>
              </li>
              <li>
                <Link
                  to="/he-thong-cua-hang"
                  className="text-gray-600 hover:text-red-500"
                >
                  Hệ thống cửa hàng
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">HỖ TRỢ</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/chinh-sach-doi-tra"
                  className="text-gray-600 hover:text-red-500"
                >
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link
                  to="/chinh-sach-khach-si"
                  className="text-gray-600 hover:text-red-500"
                >
                  Chính sách khách sỉ
                </Link>
              </li>
              <li>
                <Link
                  to="/phuong-thuc-van-chuyen"
                  className="text-gray-600 hover:text-red-500"
                >
                  Phương thức vận chuyển
                </Link>
              </li>
              <li>
                <Link
                  to="/phuong-thuc-thanh-toan"
                  className="text-gray-600 hover:text-red-500"
                >
                  Phương thức thanh toán
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">TÀI KHOẢN CỦA TÔI</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/dang-nhap"
                  className="text-gray-600 hover:text-red-500"
                >
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link
                  to="/dang-ky"
                  className="text-gray-600 hover:text-red-500"
                >
                  Đăng ký
                </Link>
              </li>
              <li>
                <Link
                  to="/thong-tin-ca-nhan"
                  className="text-gray-600 hover:text-red-500"
                >
                  Thông tin cá nhân
                </Link>
              </li>
              <li>
                <Link
                  to="/lich-su-don-hang"
                  className="text-gray-600 hover:text-red-500"
                >
                  Lịch sử đơn hàng
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">LIÊN HỆ</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <MapPin size={18} className="text-red-500" />
                <span className="text-gray-600">
                  60-62 Lê Lợi, Q.1, TP. HCM
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} className="text-red-500" />
                <span className="text-gray-600">1900 63 64 67</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} className="text-red-500" />
                <span className="text-gray-600">info@bookstore.com</span>
              </li>
            </ul>

            <div className="mt-4">
              <h5 className="font-medium mb-2">KẾT NỐI VỚI CHÚNG TÔI</h5>
              <div className="flex gap-3">
                <a
                  href="https://facebook.com"
                  className="bg-blue-600 text-white p-2 rounded-full hover:opacity-80"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="https://instagram.com"
                  className="bg-pink-600 text-white p-2 rounded-full hover:opacity-80"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="https://youtube.com"
                  className="bg-red-600 text-white p-2 rounded-full hover:opacity-80"
                >
                  <Youtube size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div className="mt-8 border-t border-gray-300 pt-4">
          <h5 className="font-medium mb-2">CHẤP NHẬN THANH TOÁN</h5>
          <div className="flex gap-2 flex-wrap">
            <div className="bg-white border rounded p-2 w-14 h-10 flex items-center justify-center">
              <span className="text-xs font-medium">VISA</span>
            </div>
            <div className="bg-white border rounded p-2 w-14 h-10 flex items-center justify-center">
              <span className="text-xs font-medium">Master</span>
            </div>
            <div className="bg-white border rounded p-2 w-14 h-10 flex items-center justify-center">
              <span className="text-xs font-medium">JCB</span>
            </div>
            <div className="bg-white border rounded p-2 w-14 h-10 flex items-center justify-center">
              <span className="text-xs font-medium">ATM</span>
            </div>
            <div className="bg-white border rounded p-2 w-14 h-10 flex items-center justify-center">
              <span className="text-xs font-medium">COD</span>
            </div>
            <div className="bg-white border rounded p-2 w-14 h-10 flex items-center justify-center">
              <span className="text-xs font-medium">Momo</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center border-t border-gray-300 pt-6">
          <p className="text-sm text-gray-600">
            © 2024 Bookstore. Tất cả các quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
