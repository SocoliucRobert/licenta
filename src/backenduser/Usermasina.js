import React, { useEffect, useState } from 'react';
import { Link, Redirect, useNavigate } from 'react-router-dom';
import Meniusus from '../Meniusus';
import Meniujos from '../Meniujos';
import styles from './usermasina.module.css';
import supabase from '../supabaseClient';

const Usermasina = () => {
  const [userReservations, setUserReservations] = useState([]);
  const [authenticated, setAuthenticated] = useState(false); // State to track authentication
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication(); // Check authentication status when component mounts
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchUserReservations(); // Fetch user reservations when authenticated
    }
  }, [authenticated]);

  const checkAuthentication = () => {
    const session = localStorage.getItem('session');
    if (session) {
      try {
        const parsedSession = JSON.parse(session);
        const userEmail = parsedSession.user?.email;
        if (userEmail) {
          setAuthenticated(true);
        }
      } catch (error) {
        console.error('Error parsing session JSON:', error);
        setAuthenticated(false);
      }
    } else {
      setAuthenticated(false);
      navigate('/Login'); // Redirect to login if not authenticated
    }
  };

  const fetchUserReservations = async () => {
    try {
      const session = localStorage.getItem('session');
      if (session) {
        const parsedSession = JSON.parse(session);
        const userEmail = parsedSession.user?.email;

        if (userEmail) {
          const { data, error } = await supabase
            .from('reservations')
            .select('*')
            .eq('user_email', userEmail)
            .eq('reservation_type', 'car');
          if (error) throw error;
          setUserReservations(data);
        }
      }
    } catch (error) {
      console.error('Error fetching user reservations:', error.message);
    }
  };

  if (!authenticated) {
    return <redirect to="/Login" />;
  }

  return (
    <div className={styles.adminContainer}>
      <Meniusus />

      <div className={styles.mainArea}>
        <div className={styles.leftSidebar}>
          <div className={styles.menu}>
            <div className={styles.menuHeader}>Panou Admin</div>
            <ul>
              <li><Link to="/Userhotel">USER HOTELURI</Link></li>
              <li><Link to="/Userzbor">USER ZBORURI</Link></li>
              <li><Link to="/Usermasina">USER MASINI</Link></li>
              <li><Link to="/Useroferte">USER OFERTE</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.content}>
          <h2>Rezervările Utilizatorului pentru Mașini</h2>
          <div className={styles.hotelList}>
            {userReservations.map((reservation) => (
              <div key={reservation.id} className={styles.hotelItem}>
                <div className={styles.imageContainer}>
                  {/* Display car details */}
                  <div className={styles.hotelDetails}>
                    <h3>{reservation.reservation_details.car_name}</h3>
                    <p>Locație: {reservation.reservation_details.car_location}</p>
                    <p>Kilometraj: {reservation.reservation_details.mileage}</p>
                    <p>Tip transmisie: {reservation.reservation_details.transmission_type}</p>
                    <p>Tip combustibil: {reservation.reservation_details.fuel_type}</p>
                    <p>Număr de locuri: {reservation.reservation_details.number_of_seats}</p>
                    <p>Total preț: ${reservation.reservation_details.total_price}</p> {/* Display total price here */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Meniujos />
    </div>
  );
};

export default Usermasina;
