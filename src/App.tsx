import MainLayout from './components/layout/MainLayout'
import { Routes, Route } from "react-router";

import "./styles/global.css"

function App() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<></>} />
            </Route>
        </Routes>
    );
}

export default App;
