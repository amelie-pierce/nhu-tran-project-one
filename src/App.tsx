import MainLayout from "./components/layout/MainLayout/MainLayout"
import { Routes, Route } from "react-router"
import Product from "./pages/product"
import Login from "./pages/login"

import "./index.css"
import "./styles/global.css"
import "./styles/typography.css"

function App() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Product />} />
                <Route path="/login" element={<Login />} />
            </Route>
        </Routes>
    )
}

export default App
