"use client";

import { createContext, useContext, useState } from "react";

type Item = {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  personalizacion: {
    ocasion: string;
    tamaño: string;
    cantidad: number;
  };
};

type CartContextType = {
  cart: Item[];
  addToCart: (item: Item) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Item[]>([]);
  const addToCart = (item: Item) => {
    setCart((prev) => [...prev, item]);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
};
