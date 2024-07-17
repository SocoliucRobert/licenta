import React, { useEffect, useState } from 'react';
import { Link, Redirect, useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import Meniusus from '../Meniusus';
import Meniujos from '../Meniujos';
import styles from './userhotel.module.css';

const Userhotel = () => {
  const [hotels, setHotels] = useState([]);
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  const [userReservations, setUserReservations] = useState([]);
  const [authenticated, setAuthenticated] = useState(false); // State to track authentication
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication(); // Check authentication status when component mounts
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchHotels();
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

  const fetchHotels = async () => {
    try {
      const { data, error } = await supabase.from('hotels').select('*');
      if (error) throw error;
      setHotels(data.map(hotel => ({ ...hotel, editing: false }))); // Add editing state to each hotel
      const indexes = {};
      data.forEach(hotel => {
        indexes[hotel.id] = 0; // Initialize current image index for each hotel
      });
      setCurrentImageIndexes(indexes);
    } catch (error) {
      console.error('Error fetching hotels:', error.message);
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
            .eq('reservation_type', 'hotel');
          if (error) throw error;
          setUserReservations(data);
        }
      }
    } catch (error) {
      console.error('Error fetching user reservations:', error.message);
    }
  };

  const nextImage = (hotelId) => {
    setCurrentImageIndexes(prevIndexes => ({
      ...prevIndexes,
      [hotelId]: (prevIndexes[hotelId] + 1) % hotels.find(hotel => hotel.id === hotelId).image_urls.length
    }));
  };

  const prevImage = (hotelId) => {
    setCurrentImageIndexes(prevIndexes => ({
      ...prevIndexes,
      [hotelId]: (prevIndexes[hotelId] - 1 + hotels.find(hotel => hotel.id === hotelId).image_urls.length) % hotels.find(hotel => hotel.id === hotelId).image_urls.length
    }));
  };

  // Filter hotels that the user has reservations for
  const filteredHotels = hotels.filter(hotel =>
    userReservations.some(reservation => reservation.reservation_id === hotel.id)
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
          <h2>Lista Hoteluri</h2>
          <div className={styles.hotelList}>
            {filteredHotels.map((hotel) => {
              const userReservation = userReservations.find(reservation => reservation.reservation_id === hotel.id);
              return (
                <div key={hotel.id} className={styles.hotelItem}>
                  <div className={styles.imageContainer}>
                    {hotel.image_urls.length > 0 && (
                      <div className={styles.carousel}>
                        <button className={styles.prevButton} onClick={() => prevImage(hotel.id)}>&#8249;</button>
                        <img
                          src={hotel.image_urls[currentImageIndexes[hotel.id]]}
                          alt={`Image ${currentImageIndexes[hotel.id] + 1}`}
                          className={styles.hotelImage}
                        />
                        <button className={styles.nextButton} onClick={() => nextImage(hotel.id)}>&#8250;</button>
                      </div>
                    )}
                  </div>
                  <div className={styles.hotelDetails}>
                    <h3>{hotel.name}</h3>
                    <p>Description: {hotel.description}</p>
                    <p>Stars: {hotel.stars}</p>
                    <p>Address: {hotel.address}</p>
                    <p>Valid from: {hotel.valid_from}</p>
                    <p>Valid to: {hotel.valid_to}</p>
                    {userReservation ? (
                      <>
                        <p>Total Price: {userReservation.reservation_details.total_price}</p>
                        <p>Status: Reserved</p>
                      </>
                    ) : (
                      <p>Total Price: {hotel.price_per_adult}</p>
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

export default Userhotel;
