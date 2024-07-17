import React, { useState } from 'react';
import styles from './cardmasina.module.css';
import supabase from '../supabaseClient'; // Import your Supabase client or backend API client

const Cardmasina = ({ masina }) => {
  const [reservationLoading, setReservationLoading] = useState(false);
  const [reservationError, setReservationError] = useState(null);

  const handleReservation = async () => {
    const confirmed = window.confirm(`Confirmați rezervarea autovehiculului ${masina.car_name}?`);

    if (confirmed) {
      try {
        setReservationLoading(true);

        const session = localStorage.getItem('session');
        if (session) {
          const parsedSession = JSON.parse(session);
          const userEmail = parsedSession.user?.email;

          if (userEmail) {
            // Prepare reservation data
            const reservationData = {
              user_email: userEmail,
              reservation_type: 'car',
              reservation_id: masina.id,
              reservation_details: {
                car_name: masina.car_name,
                car_location: masina.car_location,
                mileage: masina.mileage,
                transmission_type: masina.transmission_type,
                fuel_type: masina.fuel_type,
                number_of_seats: masina.number_of_seats,
                price_per_day: masina.price_per_day,
                photo_url: masina.photo_url
              }
            };

            // Send reservation request to backend
            const { data, error } = await supabase.from('reservations').insert([reservationData]);
            if (error) throw error;

            // Handle success scenario (e.g., show success message)
            alert('Rezervarea a fost efectuată cu succes!');
          }
        } else {
          alert('Trebuie să fiți autentificat pentru a rezerva.');
        }
      } catch (error) {
        console.error('Error making reservation:', error.message);
        setReservationError('A apărut o eroare. Vă rugăm să încercați din nou mai târziu.');
      } finally {
        setReservationLoading(false);
      }
    }
  };

  return (
    <div className={styles.card}>
      <img src={masina.photo_url} alt={`Photo of ${masina.car_name}`} className={styles.cardImage} />
      <div className={styles.cardContent}>
        <h3>{masina.car_name}</h3>
        <p>Locație: {masina.car_location}</p>
        <p>Kilometraj: {masina.mileage}</p>
        <p>Tip transmisie: {masina.transmission_type}</p>
        <p>Tip combustibil: {masina.fuel_type}</p>
        <p>Număr de locuri: {masina.number_of_seats}</p>
        <p>Preț pe zi: ${masina.price_per_day}</p>
        {reservationLoading ? (
          <p>Se încarcă...</p>
        ) : (
          <button className={styles.detailsButton} onClick={handleReservation} disabled={reservationLoading}>
            Rezerva
          </button>
        )}
        {reservationError && <p className={styles.errorText}>{reservationError}</p>}
      </div>
    </div>
  );
};

export default Cardmasina;
