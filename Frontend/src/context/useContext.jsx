import toast from "react-hot-toast";
import api from "../api/axios";
import {
  getCartAPI,
  addToCartAPI,
  decrementCartItemAPI,
  removeFromCartAPI,
  clearCartAPI,
} from "../api/axios";

import { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext(null);

// ✅ Custom Hook
export const useUser = () => {
  return useContext(UserContext);
};

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [cart, setCart] = useState([]);

  // ✅ CHECK AUTH
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setReady(true);
      }
    };

    checkAuth();
  }, []);

  // ✅ REGISTER
  const register = async (name, email, password) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });

    setUser(response.data.user);
    return response.data;
  };

  // ✅ LOGIN
  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    setUser(response.data.user);
    return response.data;
  };

  // ✅ LOGOUT
  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    setCart([]);
  };

  // ✅ UPDATE PROFILE
  const updateProfile = async (name, phone, profilePic) => {
    const response = await api.put(`/auth/users/${user.id}`, {
      name,
    });

    setUser(response.data.user);
    return response.data;
  };

  // =========================
  // 🛒 CART FUNCTIONS
  // =========================

  const fetchCart = async () => {
    try {
      const data = await getCartAPI();
      setCart(data.cart?.items || []);
    } catch (error) {
      setCart([]);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user]);

  const addToCart = async (foodId) => {
    await addToCartAPI(foodId);
    await fetchCart();
    toast.success("Item added to cart ✅");
  };

  const decrementQty = async (productId) => {
    await decrementCartItemAPI(productId);
    await fetchCart();
  };

  const removeFromCart = async (productId) => {
    await removeFromCartAPI(productId);
    await fetchCart();
    toast.success("Item removed ❌");
  };

  const clearCart = async () => {
    await clearCartAPI();
    setCart([]);
    toast.success("Cart cleared 🗑️");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        ready,
        register,
        login,
        logout,
        updateProfile,
        cart,
        addToCart,
        decrementQty,
        removeFromCart,
        clearCart,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
