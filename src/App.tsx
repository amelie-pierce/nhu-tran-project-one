import React, { Suspense } from "react"
import { MainLayout } from "@/components"
import { Routes, Route, Navigate } from "react-router"
import AuthRoute from "@/routes/AuthRoute"
import GuestRoute from "@/routes/GuestRoute"
import Product from "@/pages/product/Product"
import Login from "@/pages/login/Login"
import Signup from "@/pages/signup/SignUp"
import AboutMe from "@/pages/about/About"

import "./index.css"
import "@/styles/global.css"
import "@/styles/typography.css"

const Checkout = React.lazy(() => import("@/pages/checkout/Checkout"))
const Cart = React.lazy(() => import("@/pages/cart/Cart"))
const Payment = React.lazy(() => import("@/pages/payment/Payment"))
const ProductDetail = React.lazy(
    () => import("@/pages/product-detail/ProductDetail")
)
const Compare = React.lazy(() => import("@/pages/compare/Compare"))

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
                            <Suspense fallback={<div>Loading...</div>}>
                                <Checkout />
                            </Suspense>
                        </AuthRoute>
                    }
                />
            </Route>
        </Routes>
    )
}

export default App
