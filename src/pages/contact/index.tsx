import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone } from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1000);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Liên hệ với chúng tôi</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
          <div className="bg-red-100 p-3 rounded-full mb-4">
            <Phone className="text-red-600" size={24} />
          </div>
          <h2 className="text-xl font-semibold mb-2">Điện thoại</h2>
          <p className="text-gray-600 mb-2">Hotline: 1900 63 64 67</p>
          <p className="text-gray-600">CSKH: 0987 654 321</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
          <div className="bg-red-100 p-3 rounded-full mb-4">
            <Mail className="text-red-600" size={24} />
          </div>
          <h2 className="text-xl font-semibold mb-2">Email</h2>
          <p className="text-gray-600 mb-2">info@bookstore.com</p>
          <p className="text-gray-600">support@bookstore.com</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
          <div className="bg-red-100 p-3 rounded-full mb-4">
            <MapPin className="text-red-600" size={24} />
          </div>
          <h2 className="text-xl font-semibold mb-2">Địa chỉ</h2>
          <p className="text-gray-600">
            291 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">
            Gửi tin nhắn cho chúng tôi
          </h2>

          {submitSuccess ? (
            <div className="bg-green-100 text-green-700 p-4 rounded-md mb-4">
              Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm
              nhất.
            </div>
          ) : null}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Chủ đề <span className="text-red-500">*</span>
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Chọn chủ đề</option>
                  <option value="order">Đơn hàng</option>
                  <option value="product">Sản phẩm</option>
                  <option value="delivery">Vận chuyển</option>
                  <option value="return">Đổi trả</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nội dung <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              ></textarea>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md"
            >
              {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
            </Button>
          </form>
        </div>

        <div>
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-4">Giờ làm việc</h2>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="font-medium">Thứ Hai - Thứ Sáu:</span>
                <span>8:00 - 21:00</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium">Thứ Bảy:</span>
                <span>8:00 - 22:00</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium">Chủ Nhật:</span>
                <span>9:00 - 21:00</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Bản đồ</h2>
            <div className="aspect-video bg-gray-200 flex items-center justify-center">
              <p className="text-gray-600">Nhúng bản đồ Google Maps tại đây</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
