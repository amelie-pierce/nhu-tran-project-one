import MainLayout from "./components/layout/MainLayout/MainLayout"
import { Routes, Route } from "react-router"
import AuthRoute from "./components/auth/AuthRoute"
import GuestRoute from "./components/auth/GuestRoute"
import Product from "./pages/product"
import ProductDetail from "./pages/product-detail"
import Login from "./pages/login"

import "./index.css"
import "./styles/global.css"
import "./styles/typography.css"

function App() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Product />} />
                <Route path="/product/:id" element={<ProductDetail />} />
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
                            <Product />
                        </AuthRoute>
                    }
                />
            </Route>
        </Routes>
    )
}

export default App
