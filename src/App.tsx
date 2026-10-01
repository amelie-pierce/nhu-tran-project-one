import MainLayout from "./components/layout/MainLayout/MainLayout"
import { Routes, Route, Navigate } from "react-router"
import AuthRoute from "./components/auth/AuthRoute"
import GuestRoute from "./components/auth/GuestRoute"
import Product from "./pages/product"
import ProductDetail from "./pages/product-detail"
import Login from "./pages/login"
import Checkout from "./pages/checkout"
import Cart from "./pages/cart"
import Payment from "./pages/payment"
import Error from "./pages/error"

import "./index.css"
import "./styles/global.css"
import "./styles/typography.css"

function App() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Navigate to="/product" replace />} />
                <Route path="/product" element={<Product />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/error" element={<Error />} />
                <Route
                    path="/login"
                    element={
                        <GuestRoute>
                            <Login />
                        </GuestRoute>
                    }
                />
                <Route
                    path="/checkout"
                    element={
                        <AuthRoute>
                            <Checkout />
                        </AuthRoute>
                    }
                />
            </Route>
        </Routes>
    )
}

export default App
