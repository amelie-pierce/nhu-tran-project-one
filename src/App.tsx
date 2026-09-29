import MainLayout from './components/layout/MainLayout'
import { Routes, Route } from "react-router";
import Product from './pages/product';

import "./styles/global.css"

function App() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Product />} />
            </Route>
        </Routes>
    );
}

export default App;
