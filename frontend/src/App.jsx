import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/routing/ProtectedRoute";
import { PublicOnlyRoute } from "./components/routing/PublicOnlyRoute";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { QrCodeLayout } from "./components/qr-codes/QrCodeLayout";
import { QrCodeListPage } from "./pages/qr-codes/QrCodeListPage";
import { CreateQrCodePage } from "./pages/qr-codes/CreateQrCodePage";
import { EditQrCodePage } from "./pages/qr-codes/EditQrCodePage";
import { QrCodeDetailPage } from "./pages/qr-codes/QrCodeDetailPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PublicOnlyRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                </Route>
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<HomePage />} />
                    <Route element={<QrCodeLayout />}>
                        <Route path="/qr-codes" element={<QrCodeListPage />} />
                        <Route path="/qr-codes/create" element={<CreateQrCodePage />} />
                        <Route path="/qr-codes/:uuid" element={<QrCodeDetailPage />} />
                        <Route path="/qr-codes/:uuid/edit" element={<EditQrCodePage />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
