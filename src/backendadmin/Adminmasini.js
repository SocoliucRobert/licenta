import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Meniusus from '../Meniusus';
import Meniujos from '../Meniujos';
import styles from './adminhoteluri.module.css'; 
import supabase from '../supabaseClient'; 
import { Link } from 'react-router-dom';


const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const Adminmasini = () => {
  const [car, setCar] = useState({
    car_name: '',
    car_location: '',
    mileage: '',
    transmission_type: '',
    fuel_type: '',
    number_of_seats: '',
    price_per_day: '',
    photo: null,
    photoPreview: '',
  });

  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
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
    if (e.target.name === 'photo') {
      const selectedPhoto = e.target.files[0];
      const base64Photo = await toBase64(selectedPhoto);
      setCar({
        ...car,
        photo: selectedPhoto,
        photoPreview: URL.createObjectURL(selectedPhoto),
      });
    } else {
      setCar({ ...car, [e.target.name]: e.target.value });
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let photoBase64 = '';
      if (car.photo) {
        photoBase64 = await toBase64(car.photo);
      }

      const carData = {
        car_name: car.car_name,
        car_location: car.car_location,
        mileage: parseInt(car.mileage, 10),
        transmission_type: car.transmission_type,
        fuel_type: car.fuel_type,
        number_of_seats: parseInt(car.number_of_seats, 10),
        price_per_day: parseFloat(car.price_per_day),
        photo_url: photoBase64,
      };

      const { data, error } = await supabase.from('masini').insert([carData]);
      if (error) throw error;

      alert('Mașină adaugată cu succes !');
      console.log('Saved data:', data);

 
      setCar({
        car_name: '',
        car_location: '',
        mileage: '',
        transmission_type: '',
        fuel_type: '',
        number_of_seats: '',
        price_per_day: '',
        photo: null,
        photoPreview: '',
      });
    } catch (error) {
      console.error('Error:', error.message);
      alert('Eroare la adăugarea mașinii !');
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
            <div className={styles.menuHeader}>Panou Admin</div>
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
          <h2>Adăugare mașină</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Marcă</label>
              <input
                type="text"
                name="car_name"
                value={car.car_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Locația preluării</label>
              <input
                type="text"
                name="car_location"
                value={car.car_location}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Kilometraj</label>
              <input
                type="number"
                name="mileage"
                value={car.mileage}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Tipul cutiei de viteze</label>
              <select
                name="transmission_type"
                value={car.transmission_type}
                onChange={handleChange}
              >
                <option value="">Selectează...</option>
                <option value="manuala">Manuală</option>
                <option value="automata">Automată</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Tipul de combustibil</label>
              <select
                name="fuel_type"
                value={car.fuel_type}
                onChange={handleChange}
              >
                <option value="">Selectează...</option>
                <option value="benzina">Benzină</option>
                <option value="motorina">Motorină</option>
                <option value="electric">Electric</option>
                <option value="hibrid">Hibrid</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Numărul de locuri</label>
              <select
                name="number_of_seats"
                value={car.number_of_seats}
                onChange={handleChange}
              >
                <option value="">Selectează...</option>
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="7">7</option>
                <option value="9">9</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Preț pe zi</label>
              <input
                type="number"
                name="price_per_day"
                value={car.price_per_day}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Poză pentru mașină</label>
              <input type="file" name="photo" onChange={handleChange} />
              {car.photoPreview && (
                <img
                  src={car.photoPreview}
                  alt="Preview"
                  style={{
                    maxWidth: '300px',
                    height: 'auto',
                    marginTop: '10px',
                  }}
                />
              )}
            </div>
            <button type="submit">Adaugă mașina</button>
          </form>
        </div>
      </div>

      <Meniujos />
    </div>
  );
};

export default Adminmasini;
