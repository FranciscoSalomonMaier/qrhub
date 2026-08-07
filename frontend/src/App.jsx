import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QrCodeLayout } from './components/qr-codes/QrCodeLayout';
import { PublicOnlyRoute } from './components/routing/PublicOnlyRoute';
import { SubscriptionRoute } from './components/routing/SubscriptionRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { PlansPage } from './pages/PlansPage';
import { CreateQrCodePage } from './pages/qr-codes/CreateQrCodePage';
import { EditQrCodePage } from './pages/qr-codes/EditQrCodePage';
import { QrCodeDetailPage } from './pages/qr-codes/QrCodeDetailPage';
import { QrCodeListPage } from './pages/qr-codes/QrCodeListPage';

export default function App() {
  return <BrowserRouter><Routes><Route element={<PublicOnlyRoute />}><Route path="/login" element={<LoginPage />} /></Route><Route element={<QrCodeLayout />}><Route path="/" element={<HomePage />} /><Route path="/plans" element={<PlansPage />} /><Route element={<SubscriptionRoute />}><Route path="/qr-codes" element={<QrCodeListPage />} /><Route path="/qr-codes/create" element={<CreateQrCodePage />} /><Route path="/qr-codes/:uuid" element={<QrCodeDetailPage />} /><Route path="/qr-codes/:uuid/edit" element={<EditQrCodePage />} /></Route></Route></Routes></BrowserRouter>;
}
