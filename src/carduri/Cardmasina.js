import React, { useState } from 'react';
import styles from './cardmasina.module.css';
import supabase from '../supabaseClient'; 

const Cardmasina = ({ masina }) => {
  const [reservationLoading, setReservationLoading] = useState(false);
  const [reservationError, setReservationError] = useState(null);
  const [numberOfDays, setNumberOfDays] = useState(1); 
  const [isClicked, setIsClicked] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const handleReservation = async () => {
    const confirmed = window.confirm(`Confirmați rezervarea autovehiculului ${masina.car_name} pentru ${numberOfDays} zile?`);

    if (confirmed) {
      try {
        setReservationLoading(true);

        const { data: { session }, error } = await supabase.auth.getSession();
        if (session) {
          setUserEmail(session.user?.email || '');
          

          if (userEmail) {
     
            const { data: existingReservations, error: existingError } = await supabase
              .from('reservations')
              .select('*')
              .eq('user_email', userEmail)
              .eq('reservation_type', 'car')
              .eq('reservation_id', masina.id);

            if (existingError) throw existingError;

            if (existingReservations.length > 0) {
              alert(`Ați rezervat deja autovehiculul ${masina.car_name}. Puteți face o singură rezervare.`);
              return;
            }
            const total_price = numberOfDays * masina.price_per_day;
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
                photo_url: masina.photo_url,
                number_of_days: numberOfDays,
                total_price: total_price
              }
            };

            const { data, error } = await supabase.from('reservations').insert([reservationData]);
            if (error) throw error;

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

  const handleDaysChange = (e) => {
    const days = parseInt(e.target.value, 10);
    setNumberOfDays(days);
  };

  const handlePromptNumberOfDays = () => {
    const confirmedNumberOfDays = prompt('Introduceți numărul de zile pentru rezervare:', numberOfDays);
    if (confirmedNumberOfDays !== null) {
      setNumberOfDays(parseInt(confirmedNumberOfDays, 10));
    }
  };

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300); // Reset the click effect after 300ms
  };

  return (
    <div className={`${styles.card} ${isClicked ? styles.clicked : ''}`} onClick={handleClick}>
      <img src={masina.photo_url} alt={`Photo of ${masina.car_name}`} className={styles.cardImage} />
      <div className={styles.cardContent}>
        <h3>{masina.car_name}</h3>
        <p>Locație: {masina.car_location}</p>
        <p>Kilometraj: {masina.mileage}</p>
        <p>Tip transmisie: {masina.transmission_type}</p>
        <p>Tip combustibil: {masina.fuel_type}</p>
        <p>Număr de locuri: {masina.number_of_seats}</p>
        <p>Preț pe zi: {masina.price_per_day} lei</p>
        <div className={styles.reservationSection}>
          <button
            className={styles.detailsButton}
            onClick={handlePromptNumberOfDays}
            disabled={reservationLoading}
          >
            Modifică numărul de zile: {numberOfDays}
          </button>
          <button
            className={styles.detailsButton}
            onClick={handleReservation}
            disabled={reservationLoading}
          >
            Rezervă pentru {numberOfDays} zile
          </button>
        </div>
        {reservationLoading && <p>Se încarcă...</p>}
        {reservationError && <p className={styles.errorText}>{reservationError}</p>}
      </div>
    </div>
  );
};

export default Cardmasina;
