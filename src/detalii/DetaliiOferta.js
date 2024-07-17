import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../supabaseClient'; // Ensure supabaseClient is correctly imported
import styles from './detaliiOferta.module.css';
import Meniusus from '../Meniusus';
import Meniujos from '../Meniujos';

const DetaliiOferta = () => {
  const { id } = useParams();
  const [oferta, setOferta] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [hasReserved, setHasReserved] = useState(false);

  useEffect(() => {
    const fetchOferta = async () => {
      try {
        const { data, error } = await supabase
          .from('oferta')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        setOferta(data);
      } catch (error) {
        console.error('Error fetching oferta:', error.message);
      }
    };

    fetchOferta();
  }, [id]);

  useEffect(() => {
    const session = localStorage.getItem('session');
    if (session) {
      try {
        const parsedSession = JSON.parse(session);
        setUserEmail(parsedSession.user?.email || '');
      } catch (error) {
        console.error('Error parsing session JSON:', error);
      }
    }
  }, []);

  useEffect(() => {
    const checkReservation = async () => {
      if (!userEmail || !oferta) {
        return;
      }

      try {
        const { data: reservations, error } = await supabase
          .from('reservations')
          .select('*')
          .eq('user_email', userEmail)
          .eq('reservation_type', 'oferta')
          .eq('reservation_id', oferta.id);

        if (error) {
          throw error;
        }

        if (reservations.length > 0) {
          setHasReserved(true);
        } else {
          setHasReserved(false);
        }
      } catch (error) {
        console.error('Error checking reservation:', error.message);
      }
    };

    checkReservation();
  }, [userEmail, oferta]);

  const handleReserve = async () => {
    if (!userEmail) {
      alert('You need to be logged in to make a reservation.');
      return;
    }

    if (!oferta) {
      console.error('No oferta data available.');
      return;
    }

    if (hasReserved) {
      alert('You have already reserved this offer.');
      return;
    }

    try {
      // Insert reservation data into the database
      const reservationDetails = {
        destination: oferta.destination,
        number_of_persons: oferta.number_of_persons,
        start_period: oferta.start_period,
        end_period: oferta.end_period,
        price: oferta.price,
        description: oferta.description,
      
      };

      const { error: reservationError } = await supabase.from('reservations').insert([
        {
          user_email: userEmail,
          reservation_type: 'oferta',
          reservation_id: oferta.id,
          reservation_details: reservationDetails,
        },
      ]);

      if (reservationError) {
        throw reservationError;
      }

      setHasReserved(true); // Update state to reflect reservation status
      alert('Reservation successful!');
    } catch (error) {
      console.error('Error making reservation:', error.message);
      alert('Failed to make reservation. Please try again.');
    }
  };

  if (!oferta) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div>
      <Meniusus/>
    <div className={styles.detaliiContainer}>
     
      <div className={styles.detailsContainer}>
      <img src={oferta.offer_image_url} alt="Airline Logo" className={styles.offerImage} />
        <h1>{oferta.destination}</h1>
        <p><strong>Price:</strong> ${oferta.price}</p>
        <p><strong>Description:</strong> {oferta.description}</p>
        <p><strong>Valid from:</strong> {new Date(oferta.start_period).toLocaleDateString()}</p>
        <p><strong>Valid to:</strong> {new Date(oferta.end_period).toLocaleDateString()}</p>
        <p><strong>Number of persons:</strong> {oferta.number_of_persons}</p>
        

        {hasReserved ? (
          <p>You have already reserved this offer.</p>
        ) : (
          <button className={styles.reserveButton} onClick={handleReserve}>Rezerva</button>
        )}
      </div>
    </div>
    <Meniujos/>
    </div>
  );
};

export default DetaliiOferta;
