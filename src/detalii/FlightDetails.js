import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../supabaseClient';
import styles from './flightDetails.module.css';

const FlightDetails = () => {
  const { id } = useParams();
  const [flight, setFlight] = useState(null);
  const [numberOfPersons, setNumberOfPersons] = useState(1);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const { data, error } = await supabase
          .from('flights')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        setFlight(data);
      } catch (error) {
        console.error('Error fetching flight:', error.message);
      }
    };

    fetchFlight();
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

  const handleReserve = async () => {
    if (!userEmail) {
      alert('You need to be logged in to make a reservation.');
      return;
    }

    if (!flight || !numberOfPersons) {
      alert('Please select a valid number of persons.');
      return;
    }

    const totalPrice = numberOfPersons * flight.price_per_person;
    const updatedAvailableSeats = flight.available_seats - numberOfPersons;

    try {
      // Update available seats in the database
      await supabase
        .from('flights')
        .update({ available_seats: updatedAvailableSeats })
        .eq('id', id);

      // Make reservation
      const reservationDetails = {
        flight_id: flight.id,
        departure_location: flight.departure_location,
        arrival_location: flight.arrival_location,
        departure_date: flight.departure_date,
        price_per_person: flight.price_per_person,
        number_of_persons: numberOfPersons,
        total_price: totalPrice.toFixed(2),
      };

      const { error: reservationError } = await supabase.from('reservations').insert([
        {
          user_email: userEmail,
          reservation_type: 'flight',
          reservation_id: flight.id,
          reservation_details: reservationDetails,
        },
      ]);

      if (reservationError) {
        throw reservationError;
      }

      alert(`Reservation successful!\nTotal Price: $${totalPrice.toFixed(2)}`);

    } catch (error) {
      console.error('Error making reservation:', error.message);
      alert('Failed to make reservation. Please try again.');
    }
  };

  const handleNumberOfPersonsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setNumberOfPersons(value);
  };

  if (!flight) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.flightDetailsContainer}>
      <img src={flight.airline_logo_url} alt="Airline Logo" className={styles.airlineLogo} />
      <div className={styles.flightContent}>
        <h1 className={styles.flightTitle}>Zbor de la {flight.departure_location} la {flight.arrival_location}</h1>
        <p className={styles.flightDetailItem}><strong>Data plecării:</strong> {new Date(flight.departure_date).toLocaleDateString()}</p>
        <p className={styles.flightDetailItem}><strong>Preț per persoană:</strong> ${flight.price_per_person}</p>
        <p className={styles.flightDetailItem}><strong>Locuri disponibile:</strong> {flight.available_seats}</p>
      </div>
      <div className={styles.reservationControls}>
        <label>
          Număr de persoane:
          <input
            type="number"
            value={numberOfPersons}
            min="1"
            onChange={handleNumberOfPersonsChange}
          />
        </label>
        <button onClick={handleReserve} className={styles.reserveButton}>
          Rezerva
        </button>
      </div>
    </div>
  );
};

export default FlightDetails;
