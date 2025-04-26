import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { ROUTES } from "@/constants";

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    phone_number: "",
  });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Basic validation
    if (!formData.email || !formData.password || !formData.full_name) {
      setFormError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (formData.password.length < 6) {
      setFormError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      setIsSubmitting(true);
      await register(
        formData.email,
        formData.password,
        formData.full_name,
        formData.phone_number
      );
      navigate(ROUTES.HOME);
    } catch (err) {
      console.error("Registration error:", err);
      // Auth context already handles setting the error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-12 max-w-md">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Đăng ký tài khoản</h1>
          <p className="text-muted-foreground mt-2">
            Tạo tài khoản để tiếp tục mua sắm
          </p>
        </div>

        {(error || formError) && (
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertDescription>{formError || error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Họ và tên</Label>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              placeholder="Nguyễn Văn A"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number">Số điện thoại</Label>
            <Input
              id="phone_number"
              name="phone_number"
              type="tel"
              placeholder="0901234567"
              value={formData.phone_number}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
          </Button>
        </form>

        <div className="text-center text-sm">
          Đã có tài khoản?{" "}
          <Link to={ROUTES.LOGIN} className="text-primary hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
