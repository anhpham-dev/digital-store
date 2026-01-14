import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
    return useContext(CartContext);
}

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('digitalStoreCart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('digitalStoreCart', JSON.stringify(cartItems));
    }, [cartItems]);

    function addToCart(product, customizations = {}) {
        const cartItem = {
            id: `${product.id}_${Date.now()}`,
            productId: product.id,
            title: product.title,
            price: product.price,
            imageUrl: product.imageUrl,
            customizations,
            quantity: 1
        };
        setCartItems(prev => [...prev, cartItem]);
    }

    function removeFromCart(cartItemId) {
        setCartItems(prev => prev.filter(item => item.id !== cartItemId));
    }

    function updateQuantity(cartItemId, quantity) {
        if (quantity < 1) {
            removeFromCart(cartItemId);
            return;
        }
        setCartItems(prev =>
            prev.map(item =>
                item.id === cartItemId ? { ...item, quantity } : item
            )
        );
    }

    function clearCart() {
        setCartItems([]);
    }

    function getCartTotal() {
        return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    function getCartCount() {
        return cartItems.reduce((sum, item) => sum + item.quantity, 0);
    }

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}
