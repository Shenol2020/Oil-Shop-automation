import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  // Load initial cart from localStorage so items don't disappear on refresh
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Helper function to safely get the unique ID regardless of property name
  const getItemId = (item) => item?.pID || item?.product_id || item?.productId || item?.id || item?.p_id;

  // Save to localStorage whenever cart items change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart (or update quantity if it's already there)
  const addToCart = (product, quantity) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => getItemId(item) === getItemId(product));
      
      if (existingItemIndex > -1) {
        // If it exists, update the quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Otherwise, add new item
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  // Remove item (fixed to accept single targetId)
  const removeFromCart = (targetId) => {
    setCartItems(prevItems => prevItems.filter(item => getItemId(item) !== targetId));
  };

  // Update item quantity directly
  const updateQuantity = (targetId, quantity) => {
    if (quantity < 1) return;
    setCartItems(prevItems => 
      prevItems.map(item => getItemId(item) === targetId ? { ...item, quantity } : item)
    );
  };

  // Clear cart after checkout
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}