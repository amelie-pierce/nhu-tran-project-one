import React from "react"
import { MainLayout } from "@/components"
import { Routes, Route, Navigate } from "react-router"
import Product from "@/pages/product/Product"
import Login from "@/pages/login/Login"
import Signup from "@/pages/signup/SignUp"
import AboutMe from "@/pages/about/About"

import "./index.css"
import "@/styles/global.css"
import "@/styles/typography.css"
import { Loader } from "./components/ui"

const Checkout = React.lazy(() => import("@/pages/checkout/Checkout"))
const Cart = React.lazy(() => import("@/pages/cart/Cart"))
const Payment = React.lazy(() => import("@/pages/payment/Payment"))
const ProductDetail = React.lazy(
    () => import("@/pages/product-detail/ProductDetail")
)
const Compare = React.lazy(() => import("@/pages/compare/Compare"))

const SnakeGame = React.lazy(() => import("@/pages/snake-game/SnakeGame"))

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
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/about-me" element={<AboutMe />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
            </Route>
            <Route
                path="/snake-game"
                element={
                    <React.Suspense
                        fallback={
                            <div
                                style={{
                                    height: "100vh",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Loader />
                            </div>
                        }
                    >
                        <SnakeGame />
                    </React.Suspense>
                }
            />
        </Routes>
    )
}

export default App
