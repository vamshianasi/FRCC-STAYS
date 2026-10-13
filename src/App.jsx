import { Routes, Route, Navigate } from 'react-router-dom';
import HotelBooking from './modules/hotel-booking/pages/HotelBooking';
import Results from './modules/hotel-booking/pages/Results';
import HotelDetails from './modules/hotel-booking/pages/HotelDetails';
import GuestDetails from './modules/hotel-booking/pages/GuestDetails';
import Payment from './modules/hotel-booking/pages/Payment';
import Confirmation from './modules/hotel-booking/pages/Confirmation';
import MyBookings from './modules/hotel-booking/pages/MyBookings';
import { routes } from './modules/hotel-booking/config/routes';

export default function App() {
  return (
    <Routes>
      <Route path={routes.home} element={<Navigate to={routes.hotelBooking} replace />} />
      <Route path={routes.hotelBooking} element={<HotelBooking />} />
      <Route path={routes.results} element={<Results />} />
      <Route path={routes.hotelDetails} element={<HotelDetails />} />
      <Route path={routes.guestDetails} element={<GuestDetails />} />
      <Route path={routes.payment} element={<Payment />} />
      <Route path={routes.confirmation} element={<Confirmation />} />
      <Route path={routes.myBookings} element={<MyBookings />} />
      <Route path="*" element={<Navigate to={routes.hotelBooking} replace />} />
    </Routes>
  );
}
