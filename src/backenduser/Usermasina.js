import React, { useEffect, useState } from 'react';
import { Link, Redirect, useNavigate } from 'react-router-dom';
import Meniusus from '../Meniusus';
import Meniujos from '../Meniujos';
import styles from './usermasina.module.css';
import supabase from '../supabaseClient';

const Usermasina = () => {
  const [userReservations, setUserReservations] = useState([]);
  const [authenticated, setAuthenticated] = useState(false); 
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  useEffect(() => {
    checkAuthentication(); 
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchUserReservations(); 
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


  const fetchUserReservations = async () => {
    try {
     

        if (userEmail) {
          const { data, error } = await supabase
            .from('reservations')
            .select('*')
            .eq('user_email', userEmail)
            .eq('reservation_type', 'car');
          if (error) throw error;
          setUserReservations(data);
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
          <h2>Rezervările utilizatorului pentru mașini</h2>
          <div className={styles.hotelList}>
            {userReservations.map((reservation) => (
              <div key={reservation.id} className={styles.hotelItem}>
                <div className={styles.imageContainer}>
                
                  <div className={styles.hotelDetails}>
                    <h3>{reservation.reservation_details.car_name}</h3>
                    <p>Locație: {reservation.reservation_details.car_location}</p>
                    <p>Kilometraj: {reservation.reservation_details.mileage}</p>
                    <p>Tip transmisie: {reservation.reservation_details.transmission_type}</p>
                    <p>Tip combustibil: {reservation.reservation_details.fuel_type}</p>
                    <p>Număr de locuri: {reservation.reservation_details.number_of_seats}</p>
                    <p>Total preț: {reservation.reservation_details.total_price} lei</p> 
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
