import React, { useEffect, useState } from 'react';
import { Link, Redirect, useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import Meniusus from '../Meniusus';
import Meniujos from '../Meniujos';
import styles from './useroferte.module.css';

const Useroferte = () => {
  const [offers, setOffers] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [authenticated, setAuthenticated] = useState(false); // State to track authentication
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication(); // Check authentication status when component mounts
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchUser();
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
          setUserEmail(userEmail);
        } else {
          setAuthenticated(false);
          navigate('/Login'); // Redirect to login if no user email found
        }
      } catch (error) {
        console.error('Error parsing session JSON:', error);
        setAuthenticated(false);
        navigate('/Login'); // Redirect to login if error parsing session
      }
    } else {
      setAuthenticated(false);
      navigate('/Login'); // Redirect to login if no session found
    }
  };

  const fetchUser = async () => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('reservation_details')
        .eq('user_email', userEmail)
        .eq('reservation_type', 'oferta');
      if (error) throw error;
      const offersData = data.map(reservation => reservation.reservation_details);
      setOffers(offersData);
    } catch (error) {
      console.error('Error fetching offers:', error.message);
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
          <div className={styles.menuHeader}>Panou utilizator</div>
          <ul>
            <li><Link to="/User">PROFIL</Link></li>
              <li><Link to="/Userhotel">USER HOTELURI</Link></li>
              <li><Link to="/Userzbor">USER ZBORURI</Link></li>
              <li><Link to="/Usermasina">USER MAȘINI</Link></li>
              <li><Link to="/Useroferte">USER OFERTE</Link></li>
            
            </ul>
          </div>
        </div>

        <div className={styles.content}>
          <h2>Rezervările utilizatorului pentru oferte</h2>
          <div className={styles.offerList}>
            {offers.map((offer, index) => (
              <div key={index} className={styles.offerItem}>
                <div className={styles.offerDetails}>
                  <h3>{offer.destination}</h3>
                  <p>Număr de persoane: {offer.number_of_persons}</p>
                  <p>Perioada de început: {new Date(offer.start_period).toLocaleDateString()}</p>
                  <p>Perioada de sfârșit: {new Date(offer.end_period).toLocaleDateString()}</p>
                  <p>Preț: {offer.price} lei</p>
                  <p>Descriere: {offer.description}</p>
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

export default Useroferte;
