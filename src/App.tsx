import { MainLayout } from "@/components"
import { Routes, Route, Navigate } from "react-router"
import AuthRoute from "@/routes/AuthRoute"
import GuestRoute from "@/routes/GuestRoute"
import Product from "@/pages/product/Product"
import ProductDetail from "@/pages/product-detail/ProductDetail"
import Login from "@/pages/login/Login"
import Signup from "@/pages/signup/SignUp"
import Checkout from "@/pages/checkout/Checkout"
import Cart from "@/pages/cart/Cart"
import Payment from "@/pages/payment/Payment"
import Compare from "@/pages/compare/Compare"
import AboutMe from "@/pages/about/About"

import "./index.css"
import "@/styles/global.css"
import "@/styles/typography.css"

function App() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Navigate to="/product" replace />} />
                <Route path="/product" element={<Product />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/compare-product" element={<Compare />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/about-me" element={<AboutMe />} />
                <Route
                    path="/signup"
                    element={
                        <GuestRoute>
                            <Signup />
                        </GuestRoute>
                    }
                />
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
