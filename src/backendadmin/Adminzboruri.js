import React, { useState } from 'react';
import Meniusus from '../Meniusus';
import Meniujos from '../Meniujos';
import styles from './adminhoteluri.module.css';
import supabase from '../supabaseClient'; // Adjust this path based on your Supabase client configuration
import { Link } from 'react-router-dom';

const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

const Adminzboruri = () => {
  const [flight, setFlight] = useState({
    pricePerPerson: '',
    departureDate: '',
    departureDestination: '',
    arrivalDestination: '',
    airlineImage: null,
    airlineImagePreview: '',
    availableSeats: ''
  });

  const handleChange = async (e) => {
    if (e.target.name === 'airlineImage') {
      const selectedImage = e.target.files[0];
      const base64Image = await toBase64(selectedImage);
      setFlight({
        ...flight,
        airlineImage: selectedImage,
        airlineImagePreview: URL.createObjectURL(selectedImage)
      });
    } else {
      setFlight({ ...flight, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let airlineImageBase64 = '';
      if (flight.airlineImage) {
        airlineImageBase64 = await toBase64(flight.airlineImage);
      }

      const flightData = {
        price_per_person: parseFloat(flight.pricePerPerson),
        departure_date: flight.departureDate,
        departure_location: flight.departureDestination,
        arrival_location: flight.arrivalDestination,
        airline_logo_url: airlineImageBase64,
        available_seats: parseInt(flight.availableSeats, 10)
      };

      const { data, error } = await supabase.from('flights').insert([flightData]);
      if (error) throw error;

      alert('Flight added successfully!');
      console.log('Saved data:', data);

      setFlight({
        pricePerPerson: '',
        departureDate: '',
        departureDestination: '',
        arrivalDestination: '',
        airlineImage: null,
        airlineImagePreview: '',
        availableSeats: ''
      });
    } catch (error) {
      console.error('Error:', error.message);
      alert('Failed to add flight. Please try again.');
    }
  };

  return (
    <div className={styles.adminContainer}>
      <Meniusus />

      <div className={styles.mainArea}>
        <div className={styles.leftSidebar}>
          <div className={styles.menu}>
            <div className={styles.menuHeader}>Panou Admin</div>
            <ul>
            <li><Link to="/Adminhoteluri">ADAUGARE HOTEL</Link></li>
                <li><Link to="/Adminzboruri">ADAUGARE ZBOR</Link></li>
                <li><Link to="/Adminmasini">ADAUGARE MASINA</Link></li>
                <li><Link to="/Adminoferte">ADAUGARE OFERTA</Link></li>
                <li><Link to="/Admineditarehotel">EDITARE HOTEL</Link></li>
                <li><Link to="/Admineditarezbor">EDITARE ZBOR</Link></li>
                <li><Link to="/Admineditaremasini">EDITARE MASINA</Link></li>
                <li><Link to="/Admineditareoferte">EDITARE OFERTA</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.content}>
          <h2>Adăugare Zbor</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Preț pe persoană</label>
              <input type="number" name="pricePerPerson" value={flight.pricePerPerson} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Data plecării</label>
              <input type="date" name="departureDate" value={flight.departureDate} onChange={handleChange} required />
            </div>
        
            <div className={styles.formGroup}>
              <label>Destinație plecare</label>
              <input type="text" name="departureDestination" value={flight.departureDestination} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Destinație ajungere</label>
              <input type="text" name="arrivalDestination" value={flight.arrivalDestination} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Imagine companie aeriană</label>
              <input type="file" name="airlineImage" onChange={handleChange} />
              {flight.airlineImagePreview && (
                <img
                  src={flight.airlineImagePreview}
                  alt="Preview"
                  style={{ maxWidth: '300px', height: 'auto', marginTop: '10px' }}
                />
              )}
            </div>
            <div className={styles.formGroup}>
              <label>Locuri disponibile</label>
              <input type="number" name="availableSeats" value={flight.availableSeats} onChange={handleChange} required />
            </div>
            <button type="submit">Salvează Zbor</button>
          </form>
        </div>
      </div>

      <Meniujos />
    </div>
  );
};

export default Adminzboruri;
