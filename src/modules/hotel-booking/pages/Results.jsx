import { useLocation, useSearchParams, Navigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { routes } from '../config/routes';
import './Results.css';

export default function Results() {
  // Redirect old results page to the main hotel booking page
  // since all hotels have been removed and replaced with 2 stay locations
  const navigate = useNavigate();
  const location = useLocation();
  const search = location.state || {};
  const hasDates = !!(search.checkIn && search.checkOut);

  // If this was a fresh load (no search state), just navigate home
  if (!hasDates) {
    navigate(routes.stay, { replace: true });
    return null;
  }

  // If there was a search state, redirect to the location page
  // with the dates and guests carried forward
  const area = search.area || '';
  navigate(`/book/hotel/stay/${area}`, { replace: true });
  return null;
}