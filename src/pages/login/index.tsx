import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { ROUTES } from "@/constants";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Basic validation
    if (!email || !password) {
      setFormError("Vui lòng nhập đầy đủ thông tin đăng nhập");
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
      navigate(ROUTES.HOME);
    } catch (err) {
      console.error("Login error:", err);
      // Auth context already handles setting the error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-12 max-w-md">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Đăng nhập</h1>
          <p className="text-muted-foreground mt-2">
            Đăng nhập để tiếp tục mua sắm
          </p>
        </div>

        {(error || formError) && (
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertDescription>Sai tên đăng nhập hoặc mật khẩu</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password">Mật khẩu</Label>
              {/* TODO: Add Forgot Password feature */}
              <Link to="#" className="text-sm text-primary hover:underline">
                Quên mật khẩu?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
          </Button>
        </form>

        <div className="text-center text-sm">
          Chưa có tài khoản?{" "}
          <Link to={ROUTES.REGISTER} className="text-primary hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
