import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Meniusus from '../Meniusus';
import Meniujos from '../Meniujos';
import styles from './adminhoteluri.module.css';
import supabase from '../supabaseClient';

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

  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication();
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

      alert('Zbor adăugat cu succes !');
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
      alert('Eroare la adăugarea zborului !');
    }
  };

  if (!authenticated) {
    return null; 
  }

  return (
    <div className={styles.adminContainer}>
      <Meniusus />

      <div className={styles.mainArea}>
        <div className={styles.leftSidebar}>
          <div className={styles.menu}>
          <div className={styles.menuHeader}>Panou admin</div>
            <ul>
              <li><Link to="/Adminhoteluri">ADĂUGARE HOTEL</Link></li>
              <li><Link to="/Adminzboruri">ADĂUGARE ZBOR</Link></li>
              <li><Link to="/Adminmasini">ADĂUGARE MAȘINĂ</Link></li>
              <li><Link to="/Adminoferte">ADĂUGARE OFERTĂ</Link></li>
              <li><Link to="/Admineditarehotel">EDITARE HOTEL</Link></li>
              <li><Link to="/Admineditarezbor">EDITARE ZBOR</Link></li>
              <li><Link to="/Admineditaremasini">EDITARE MAȘINĂ</Link></li>
              <li><Link to="/Admineditareoferte">EDITARE OFERTĂ</Link></li>
              <li><Link to="/Admineditarecontact">VIZUALIZARE CONTACT</Link></li>
              <li><Link to="/Admineditarerecenzii">VIZUALIZARE RECENZII</Link></li>
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
