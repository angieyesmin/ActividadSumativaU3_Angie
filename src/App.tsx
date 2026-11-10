import { Header } from './components/Header';
import { AppointmentsPage } from './pages/AppointmentPage';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <AppointmentsPage />
    </div>
  );
}
