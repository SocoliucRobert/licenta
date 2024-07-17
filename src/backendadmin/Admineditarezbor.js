import React, { useEffect, useState } from 'react';
import { Link, Redirect, useNavigate } from 'react-router-dom';
import Meniusus from '../Meniusus';
import Meniujos from '../Meniujos';
import styles from './admineditarezbor.module.css'; 
import supabase from '../supabaseClient';

const Admineditarezbor = () => {
  const [flights, setFlights] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication();
    fetchFlights(); 
  }, []);

  const checkAuthentication = async () => {
    const session = localStorage.getItem('session');
    if (session) {
      try {
        const parsedSession = JSON.parse(session);
        const userEmail = parsedSession.user?.email;
        if (userEmail === 'traveladdictionsuport@gmail.com') {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
          navigate('/Login');
        }
      } catch (error) {
        console.error('Error parsing session JSON:', error);
        setAuthenticated(false);
        navigate('/Login');
      }
    } else {
      setAuthenticated(false);
      navigate('/Login');
    }
  };

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
      alert('Zbor actualizat cu succes !');
      setFlights(prevFlights =>
        prevFlights.map(f =>
          f.id === flightId ? { ...f, editing: false } : f
        )
      );
    } catch (error) {
      console.error('Error updating flight:', error.message);
      alert('Eroare la actualizarea zborului !');
    }
  };

  const handleDeleteFlight = async (flight) => {
    if (window.confirm(`Sigur vrei să ștergi zborul de la "${flight.departure_location} la ${flight.arrival_location}"?`)) {
      try {
        const { error } = await supabase.from('flights').delete().eq('id', flight.id);
        if (error) throw error;
        alert('Zbor șters cu succes !');
        setFlights(prevFlights => prevFlights.filter(f => f.id !== flight.id)); // Remove deleted flight from state
      } catch (error) {
        console.error('Error deleting flight:', error.message);
        alert('Eroare la ștergerea zborului');
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
            <li><Link to="/Adminhoteluri">ADĂUGARE HOTEL</Link></li>
                <li><Link to="/Adminzboruri">ADĂUGARE ZBOR</Link></li>
                <li><Link to="/Adminmasini">ADĂUGARE MAȘINĂ</Link></li>
                <li><Link to="/Adminoferte">ADĂUGARE OFERTĂ</Link></li>
                <li><Link to="/Admineditarehotel">EDITARE HOTEL</Link></li>
                <li><Link to="/Admineditarezbor">EDITARE ZBOR</Link></li>
                <li><Link to="/Admineditaremasini">EDITARE MAȘINĂ</Link></li>
                <li><Link to="/Admineditareoferte">EDITARE OFERTă</Link></li>
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
                      <p>Dată plecării: {flight.departure_date}</p>
          
                      <p>Preț pe persoană: {flight.price_per_person}</p>
                      <p>Locuri disponibile: {flight.available_seats}</p>
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

export default Admineditarezbor;
