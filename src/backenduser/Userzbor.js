import React, { useEffect, useState } from 'react';
import { Link, Redirect, useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import Meniusus from '../Meniusus';
import Meniujos from '../Meniujos';
import styles from './userzbor.module.css';

const Userzbor = () => {
  const [flights, setFlights] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [authenticated, setAuthenticated] = useState(false); // State to track authentication
  const [userReservations, setUserReservations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication(); // Check authentication status when component mounts
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchFlights();
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
          setUserEmail(userEmail);
          setAuthenticated(true);
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

  const fetchFlights = async () => {
    try {
      const { data, error } = await supabase.from('flights').select('*');
      if (error) throw error;
      setFlights(data); // Set flights data from Supabase into state
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
              <li><Link to="/Userhotel">USER HOTELURI</Link></li>
              <li><Link to="/Userzbor">USER ZBORURI</Link></li>
              <li><Link to="/Usermasina">USER MAȘINI</Link></li>
              <li><Link to="/Useroferte">USER OFERTE</Link></li>
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
                    <p>Data plecăriii: {flight.departure_date}</p>
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
