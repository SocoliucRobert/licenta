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
    const checkAuthentication = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error fetching session:', error.message);
          return;
        }

        if (session) {
          setUserEmail(session.user?.email || '');
        } else {
          setUserEmail('');
        }
      } catch (error) {
        console.error('Error checking authentication:', error.message);
      }
    };

    checkAuthentication();
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
      alert('Trebuie să fii conectat pentru a rezerva o ofertă !');
      return;
    }

    if (!oferta) {
      console.error('No oferta data available.');
      return;
    }

    if (hasReserved) {
      alert('Ai cumpărat deja această ofertă');
      return;
    }

    try {
      
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

      setHasReserved(true); 
      alert('Oferta a fost rezervata cu success !');
    } catch (error) {
      console.error('Error making reservation:', error.message);
      alert('Eroare la rezervarea ofertei ');
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
        <p><strong>Preț:</strong> {oferta.price} lei</p>
        <p><strong>Descriere:</strong> {oferta.description}</p>
        <p><strong>Valabil de la data:</strong> {new Date(oferta.start_period).toLocaleDateString()}</p>
        <p><strong>Până la data:</strong> {new Date(oferta.end_period).toLocaleDateString()}</p>
        <p><strong>Număr de persoane:</strong> {oferta.number_of_persons}</p>
        

        {hasReserved ? (
          <p>Ai rezervat deja această ofertă.</p>
        ) : (
          <button className={styles.reserveButton} onClick={handleReserve}>Rezervă</button>
        )}
      </div>
    </div>
    <Meniujos/>
    </div>
  );
};

export default DetaliiOferta;
