import React, { useEffect, useState } from 'react';
import Meniusus from '../Meniusus';
import Meniujos from '../Meniujos';
import styles from './userzbor.module.css'; // Assuming you have a separate CSS module for this component
import supabase from '../supabaseClient';
import { Link } from 'react-router-dom';

const Userzbor = () => {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    fetchFlights(); // Fetch flight data when component mounts
  }, []);

  const fetchFlights = async () => {
    try {
      const { data, error } = await supabase.from('flights').select('*');
      if (error) throw error;
      setFlights(data.map(flight => ({ ...flight, editing: false }))); // Add editing state to each flight
    } catch (error) {
      console.error('Error fetching flights:', error.message);
    }
  };

  const handleEditToggle = (flightId) => {
    setFlights(prevFlights =>
      prevFlights.map(flight =>
        flight.id === flightId ? { ...flight, editing: !flight.editing } : flight
      )
    );
  };

  const handleSaveFlight = async (flightId) => {
    const flight = flights.find(f => f.id === flightId);
    const updatedFlight = { ...flight };
    delete updatedFlight.editing;

    try {
      const { data, error } = await supabase.from('flights').update(updatedFlight).eq('id', flight.id);
      if (error) throw error;
      alert('Flight updated successfully!');
      setFlights(prevFlights =>
        prevFlights.map(f =>
          f.id === flightId ? { ...f, editing: false } : f
        )
      );
    } catch (error) {
      console.error('Error updating flight:', error.message);
      alert('Failed to update flight. Please try again.');
    }
  };

  const handleDeleteFlight = async (flight) => {
    if (window.confirm(`Are you sure you want to delete flight "${flight.departure_location} to ${flight.arrival_location}"?`)) {
      try {
        const { error } = await supabase.from('flights').delete().eq('id', flight.id);
        if (error) throw error;
        alert('Flight deleted successfully!');
        setFlights(prevFlights => prevFlights.filter(f => f.id !== flight.id)); // Remove deleted flight from state
      } catch (error) {
        console.error('Error deleting flight:', error.message);
        alert('Failed to delete flight. Please try again.');
      }
    }
  };

  const handleInputChange = (flightId, field, value) => {
    setFlights(prevFlights =>
      prevFlights.map(flight =>
        flight.id === flightId ? { ...flight, [field]: value } : flight
      )
    );
  };

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
          <h2>Lista Zboruri</h2>
          <div className={styles.flightList}>
            {flights.map((flight) => (
              <div key={flight.id} className={styles.flightItem}>
                <div className={styles.flightDetails}>
                  {!flight.editing && (
                    <>
                      <h3>{flight.departure_location} to {flight.arrival_location}</h3>
                      <p>Departure Date: {flight.departure_date}</p>
                      <p>Arrival Date: {flight.arrival_date}</p>
                      <p>Price per person: {flight.price_per_person}</p>
                      <p>Available seats: {flight.available_seats}</p>
                      {flight.airline_logo_url && (
                        <img src={flight.airline_logo_url} alt="Airline Logo" className={styles.airlineLogo} />
                      )}
                    </>
                  )}
                  {flight.editing && (
                    <>
                      <div className={styles.formGroup}>
                        <label>Plecare</label>
                        <input type="text" value={flight.departure_location} onChange={(e) => handleInputChange(flight.id, 'departure_location', e.target.value)} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Destinație</label>
                        <input type="text" value={flight.arrival_location} onChange={(e) => handleInputChange(flight.id, 'arrival_location', e.target.value)} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Data plecării</label>
                        <input type="date" value={flight.departure_date} onChange={(e) => handleInputChange(flight.id, 'departure_date', e.target.value)} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Data sosirii</label>
                        <input type="date" value={flight.arrival_date} onChange={(e) => handleInputChange(flight.id, 'arrival_date', e.target.value)} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Preț pe persoană</label>
                        <input type="number" value={flight.price_per_person} onChange={(e) => handleInputChange(flight.id, 'price_per_person', e.target.value)} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Locuri disponibile</label>
                        <input type="number" value={flight.available_seats} onChange={(e) => handleInputChange(flight.id, 'available_seats', e.target.value)} />
                      </div>
                      
                    </>
                  )}

                  <div className={styles.buttonContainer}>
                    {!flight.editing && (
                      <button className={styles.editButton} onClick={() => handleEditToggle(flight.id)}>Edit</button>
                    )}
                    {flight.editing && (
                      <button className={styles.saveButton} onClick={() => handleSaveFlight(flight.id)}>Save</button>
                    )}
                    <button className={styles.deleteButton} onClick={() => handleDeleteFlight(flight)}>Delete</button>
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

export default Userzbor;
