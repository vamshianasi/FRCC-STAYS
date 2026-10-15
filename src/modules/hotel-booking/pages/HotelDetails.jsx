import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Hero from '../components/common/Hero';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { routes } from '../config/routes';
import './HotelDetails.css';

export default function HotelDetails() {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect old hotel details page to the new stay location page
  // or to the main hotel booking page since all hotels have been removed
  useEffect(() => {
    // hotelId format used to be like "hyd-01", "vij-01", etc.
    // These are now replaced by location IDs: "hyderabad", "vijayawada"
    // Redirect to the main stay page
    navigate(routes.stay, { replace: true });
  }, [hotelId, navigate]);

  return null;
}