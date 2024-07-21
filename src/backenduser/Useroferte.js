import React, { useEffect, useState } from 'react';
import { Link, Redirect, useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import Meniusus from '../Meniusus';
import Meniujos from '../Meniujos';
import styles from './useroferte.module.css';

const Useroferte = () => {
  const [offers, setOffers] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [authenticated, setAuthenticated] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication(); 
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchUser();
    }
  }, [authenticated]);

  const checkAuthentication = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      setAuthenticated(false);
      navigate('/Login');
      return;
    }
    
    const user = session.user;
    const userEmail = user?.email;

    if (userEmail) {
      setUserEmail(userEmail);
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
      navigate('/Login');
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
              <li><Link to="/Userhotel">HOTELURI REZERVATE</Link></li>
              <li><Link to="/Userzbor">ZBORURI REZERVATE</Link></li>
              <li><Link to="/Usermasina">MAȘINI ÎNCHIRIATE</Link></li>
              <li><Link to="/Useroferte">OFERTE REZERVATE</Link></li>
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
