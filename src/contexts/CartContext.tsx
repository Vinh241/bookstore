import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { getProductsByIds } from "@/lib/api";
import { Product } from "@/types";

// Định nghĩa cấu trúc của CartItem
export interface CartItem {
  id: number;
  name: string;
  image_url: string;
  price: number;
  original_price: number;
  author: string;
  quantity: number;
  category_id: string;
  category_name: string;
  images?: Array<{ image_url: string; is_primary: boolean }>;
}

// Định nghĩa context type
interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  subtotal: number;
  discountAmount: number;
  cartTotal: number;
  itemCount: number;
  couponCode: string;
  couponApplied: boolean;
  setCouponCode: (code: string) => void;
  applyCoupon: () => void;
  addToCart: (product: Product, quantity: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
}

// Tạo context
export const CartContext = createContext<CartContextType>({
  cartItems: [],
  isLoading: true,
  subtotal: 0,
  discountAmount: 0,
  cartTotal: 0,
  itemCount: 0,
  couponCode: "",
  couponApplied: false,
  setCouponCode: () => {},
  applyCoupon: () => {},
  addToCart: () => {},
  updateQuantity: () => {},
  removeItem: () => {},
  clearCart: () => {},
});

// Provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  // Tính toán các giá trị liên quan đến giỏ hàng
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const discountAmount = couponApplied ? subtotal * 0.1 : 0;
  // Không tính phí vận chuyển trong giỏ hàng, chỉ tính trong checkout
  const cartTotal = subtotal - discountAmount;
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  // Load cart from localStorage khi component mount
  useEffect(() => {
    const loadCartItems = async () => {
      setIsLoading(true);
      try {
        // Get cart items from localStorage
        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");

        if (storedCart.length > 0) {
          // If we have products in localStorage, set them directly first for faster UI rendering
          setCartItems(storedCart);

          // Then get fresh product details from API
          const productIds = storedCart.map((item: CartItem) => item.id);

          // Call API to get latest product details
          const productDetails = await getProductsByIds(productIds);

          // Update cart with fresh product details while keeping quantities
          if (productDetails && productDetails.length > 0) {
            const updatedCart = storedCart.map((cartItem: CartItem) => {
              const freshProduct = productDetails.find(
                (p: Product) => p.id === cartItem.id
              );
              if (freshProduct) {
                // Update product info but keep the quantity
                return {
                  ...freshProduct,
                  quantity: cartItem.quantity,
                  price: freshProduct.sale_price || freshProduct.price,
                  original_price: freshProduct.price,
                  images: freshProduct.images,
                };
              }
              return cartItem;
            });

            setCartItems(updatedCart);
            // Save updated cart back to localStorage
            localStorage.setItem("cart", JSON.stringify(updatedCart));
          }
        } else {
          setCartItems([]);
        }

        // Check if there's a saved coupon
        const savedCoupon = localStorage.getItem("coupon");
        if (savedCoupon) {
          setCouponCode(savedCoupon);
          setCouponApplied(true);
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        toast.error("Không thể tải thông tin giỏ hàng");
      } finally {
        setIsLoading(false);
      }
    };

    loadCartItems();
  }, []);

  // Add to cart function
  const addToCart = (product: Product, quantity: number) => {
    if (!product) return;

    try {
      // Check if product is in stock
      if (!product.stock_quantity || product.stock_quantity <= 0) {
        toast.error("Sản phẩm đã hết hàng");
        return;
      }

      // Check if there's enough stock for the requested quantity
      if (product.stock_quantity < quantity) {
        toast.error(`Chỉ còn ${product.stock_quantity} sản phẩm trong kho`);
        return;
      }

      // Calculate the final price
      const productPrice = product.sale_price || product.price;

      // Check if item already exists in cart
      const existingItemIndex = cartItems.findIndex(
        (item) => item.id === product.id
      );

      let updatedItems;
      if (existingItemIndex >= 0) {
        // Check if the new total quantity exceeds stock
        const newQuantity = cartItems[existingItemIndex].quantity + quantity;
        if (newQuantity > product.stock_quantity) {
          toast.error(
            `Không thể thêm. Chỉ còn ${product.stock_quantity} sản phẩm trong kho`
          );
          return;
        }

        // Update quantity if item exists
        updatedItems = [...cartItems];
        updatedItems[existingItemIndex].quantity += quantity;
      } else {
        // Add new item with full product information
        const newItem: CartItem = {
          id: product.id,
          name: product.name || "",
          image_url: product.image_url || "",
          price: productPrice,
          original_price: product.price,
          author: product.author_name || "",
          quantity: quantity,
          category_id: product.category_id?.toString() || "",
          category_name: product.category_name || "",
          images: product.images,
        };
        updatedItems = [...cartItems, newItem];
      }

      setCartItems(updatedItems);
      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(updatedItems));

      toast.success("Đã thêm vào giỏ hàng");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
    }
  };

  // Update quantity function
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedItems);
    // Update localStorage
    localStorage.setItem("cart", JSON.stringify(updatedItems));
  };

  // Remove item function
  const removeItem = (id: number) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
    // Update localStorage
    localStorage.setItem("cart", JSON.stringify(updatedItems));
    toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
  };

  // Clear cart function
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
    toast.success("Đã xóa toàn bộ giỏ hàng");
  };

  // Apply coupon function
  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "DISCOUNT10") {
      setCouponApplied(true);
      localStorage.setItem("coupon", couponCode);
      toast.success("Áp dụng mã giảm giá thành công");
    } else {
      setCouponApplied(false);
      localStorage.removeItem("coupon");
      toast.error("Mã giảm giá không hợp lệ");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        subtotal,
        discountAmount,
        cartTotal,
        itemCount,
        couponCode,
        couponApplied,
        setCouponCode,
        applyCoupon,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => useContext(CartContext);
