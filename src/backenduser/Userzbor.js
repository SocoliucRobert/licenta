import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import Meniusus from '../Meniusus';
import Meniujos from '../Meniujos';
import styles from './userzbor.module.css';

const Userzbor = () => {
  const [flights, setFlights] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [userReservations, setUserReservations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchFlights();
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

  const fetchFlights = async () => {
    try {
      const { data, error } = await supabase.from('flights').select('*');
      if (error) throw error;
      setFlights(data);
    } catch (error) {
      console.error('Error fetching flights:', error.message);
    }
  };

  const fetchUserReservations = async () => {
    try {
      if (userEmail) {
        const { data, error } = await supabase
          .from('reservations')
          .select('*')
          .eq('user_email', userEmail)
          .eq('reservation_type', 'flight');
        if (error) throw error;
        setUserReservations(data);
      }
    } catch (error) {
      console.error('Error fetching user reservations:', error.message);
    }
  };

  const filteredFlights = flights.filter(flight =>
    userReservations.some(reservation => reservation.reservation_id === flight.id)
  );

 
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
          <h2>Rezervările utilizatorului pentru zboruri</h2>
          <div className={styles.flightList}>
            {filteredFlights.map((flight) => {
              const userReservation = userReservations.find(reservation => reservation.reservation_id === flight.id);
              return (
                <div key={flight.id} className={styles.flightItem}>
                  <div className={styles.flightDetails}>
                    <h3>{flight.departure_location} to {flight.arrival_location}</h3>
                    <p>Data plecării: {flight.departure_date}</p>
                    {userReservation ? (
                      <>
                        <p>Preț total: {userReservation.reservation_details.total_price}</p>
                        <p>Status: Rezervat</p>
                      </>
                    ) : (
                      <p>Total Price: {flight.price_per_person}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Meniujos />
    </div>
  );
};

export default Userzbor;
