import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// GET CURRENT CART
export const getCartAPI = async () => {
  const response = await api.get("/cart");
  return response.data;
};

export const addToCartAPI = async (productId) => {
  try {
    const response = await api.post("/cart/add", {
      productId,
      quantity: 1, // required
    });

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to add item to cart";

    throw message;
  }
};

// DECREMENT ITEM QUANTITY
export const decrementCartItemAPI = async (productId) => {
  try {
    const response = await api.put("/cart/decrement", { productId });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to decrement item";
    throw message;
  }
};

// REMOVE ITEM FROM CART
export const removeFromCartAPI = async (productId) => {
  try {
    const response = await api.delete(`/cart/remove/${productId}`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to remove item";
    throw message; // ✅ throw string only
  }
};

// CLEAR CART / CHECKOUT
export const clearCartAPI = async () => {
  const response = await api.delete("/cart/clear");
  return response.data;
};

// PLACE ORDER
export const placeOrderAPI = async (orderData) => {
  const response = await api.post("/orders/place-order", orderData);
  return response.data;
};

export default api; // ✅ THIS IS REQUIRED
