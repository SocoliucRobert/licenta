import React, { useState } from 'react';
import Meniusus from '../Meniusus';
import Meniujos from '../Meniujos';
import styles from './adminhoteluri.module.css';
import supabase from '../supabaseClient'; // Adjust this path based on your Supabase client configuration
import { Link } from 'react-router-dom';

// Function to convert image file to base64 format
const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
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
    pickup_date: '',
    return_date: '',
    photo: null,
    photoPreview: ''
  });

  // Handles changes in form inputs
  const handleChange = async (e) => {
    if (e.target.name === 'photo') {
      const selectedPhoto = e.target.files[0];
      const base64Photo = await toBase64(selectedPhoto);
      setCar({
        ...car,
        photo: selectedPhoto,
        photoPreview: URL.createObjectURL(selectedPhoto)
      });
    } else {
      setCar({ ...car, [e.target.name]: e.target.value });
    }
  };

  // Handles form submission
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
        pickup_date: car.pickup_date,
        return_date: car.return_date,
        photo_url: photoBase64
      };

      const { data, error } = await supabase.from('masini').insert([carData]);
      if (error) throw error;

      alert('Car added successfully!');
      console.log('Saved data:', data);

      // Reset form fields and state after successful submission
      setCar({
        car_name: '',
        car_location: '',
        mileage: '',
        transmission_type: '',
        fuel_type: '',
        number_of_seats: '',
        price_per_day: '',
        pickup_date: '',
        return_date: '',
        photo: null,
        photoPreview: ''
      });
    } catch (error) {
      console.error('Error:', error.message);
      alert('Failed to add car. Please try again.');
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
          <h2>Adăugare mașină</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Marcă</label>
              <input type="text" name="car_name" value={car.car_name} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Locatia</label>
              <input type="text" name="car_location" value={car.car_location} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Kilometraj</label>
              <input type="number" name="mileage" value={car.mileage} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Tipul cutiei de viteze</label>
              <input type="text" name="transmission_type" value={car.transmission_type} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label>Tipul de combustibil</label>
              <input type="text" name="fuel_type" value={car.fuel_type} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label>Numărul de locuri</label>
              <input type="number" name="number_of_seats" value={car.number_of_seats} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Preț pe zi</label>
              <input type="number" name="price_per_day" value={car.price_per_day} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Data de incepere a închirierii</label>
              <input type="date" name="pickup_date" value={car.pickup_date} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Data de returnare</label>
              <input type="date" name="return_date" value={car.return_date} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Poza pentru mașină</label>
              <input type="file" name="photo" onChange={handleChange} />
              {car.photoPreview && (
                <img
                  src={car.photoPreview}
                  alt="Preview"
                  style={{ maxWidth: '300px', height: 'auto', marginTop: '10px' }}
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