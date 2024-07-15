import React, { useEffect, useState } from 'react';
import Meniusus from '../Meniusus';
import Meniujos from '../Meniujos';
import styles from './admineditaremasini.module.css';
import supabase from '../supabaseClient';

const Admineditaremasini = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetchCars(); // Fetch cars data when component mounts
  }, []);

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase.from('masini').select('*');
      if (error) throw error;
      setCars(data.map(car => ({ ...car, editing: false }))); // Add editing state to each car
    } catch (error) {
      console.error('Error fetching cars:', error.message);
    }
  };

  const handleEditToggle = (carId) => {
    setCars(prevCars =>
      prevCars.map(car =>
        car.id === carId ? { ...car, editing: !car.editing } : car
      )
    );
  };

  const handleSaveCar = async (carId) => {
    const car = cars.find(c => c.id === carId);
    const updatedCar = { ...car };
    delete updatedCar.editing;

    try {
      const { data, error } = await supabase.from('masini').update(updatedCar).eq('id', car.id);
      if (error) throw error;
      alert('Car updated successfully!');
      setCars(prevCars =>
        prevCars.map(c =>
          c.id === carId ? { ...c, editing: false } : c
        )
      );
    } catch (error) {
      console.error('Error updating car:', error.message);
      alert('Failed to update car. Please try again.');
    }
  };

  const handleDeleteCar = async (car) => {
    if (window.confirm(`Are you sure you want to delete car "${car.car_name}"?`)) {
      try {
        const { error } = await supabase.from('masini').delete().eq('id', car.id);
        if (error) throw error;
        alert('Car deleted successfully!');
        setCars(prevCars => prevCars.filter(c => c.id !== car.id)); // Remove deleted car from state
      } catch (error) {
        console.error('Error deleting car:', error.message);
        alert('Failed to delete car. Please try again.');
      }
    }
  };

  const handleInputChange = (carId, field, value) => {
    setCars(prevCars =>
      prevCars.map(car =>
        car.id === carId ? { ...car, [field]: value } : car
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
              <li><a href="#">ADAUGARE MASINA</a></li>
              <li><a href="#">EDITARE MASINA</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.content}>
          <h2>Lista Mașini</h2>
          <div className={styles.carList}>
            {cars.map((car) => (
              <div key={car.id} className={styles.carItem}>
                <div className={styles.carDetails}>
                  {!car.editing && (
                    <>
                      <h3>{car.car_name}</h3>
                      <p>Locație: {car.car_location}</p>
                      <p>Kilometraj: {car.mileage}</p>
                      <p>Tip transmisie: {car.transmission_type}</p>
                      <p>Tip combustibil: {car.fuel_type}</p>
                      <p>Număr de locuri: {car.number_of_seats}</p>
                      <p>Preț pe zi: {car.price_per_day}</p>
                      <p>Data ridicării: {car.pickup_date}</p>
                      <p>Data returnării: {car.return_date}</p>
                    </>
                  )}
                  {car.editing && (
                    <>
                      <div className={styles.formGroup}>
                        <label>Nume Mașină</label>
                        <input type="text" value={car.car_name} onChange={(e) => handleInputChange(car.id, 'car_name', e.target.value)} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Locație</label>
                        <input type="text" value={car.car_location} onChange={(e) => handleInputChange(car.id, 'car_location', e.target.value)} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Kilometraj</label>
                        <input type="number" value={car.mileage} onChange={(e) => handleInputChange(car.id, 'mileage', e.target.value)} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Tip transmisie</label>
                        <input type="text" value={car.transmission_type} onChange={(e) => handleInputChange(car.id, 'transmission_type', e.target.value)} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Tip combustibil</label>
                        <input type="text" value={car.fuel_type} onChange={(e) => handleInputChange(car.id, 'fuel_type', e.target.value)} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Număr de locuri</label>
                        <input type="number" value={car.number_of_seats} onChange={(e) => handleInputChange(car.id, 'number_of_seats', e.target.value)} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Preț pe zi</label>
                        <input type="number" value={car.price_per_day} onChange={(e) => handleInputChange(car.id, 'price_per_day', e.target.value)} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Data ridicării</label>
                        <input type="date" value={car.pickup_date} onChange={(e) => handleInputChange(car.id, 'pickup_date', e.target.value)} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Data returnării</label>
                        <input type="date" value={car.return_date} onChange={(e) => handleInputChange(car.id, 'return_date', e.target.value)} />
                      </div>
                    </>
                  )}
                  <div className={styles.buttonContainer}>
                    {!car.editing && (
                      <button className={styles.editButton} onClick={() => handleEditToggle(car.id)}>Edit</button>
                    )}
                    {car.editing && (
                      <button className={styles.saveButton} onClick={() => handleSaveCar(car.id)}>Save</button>
                    )}
                    <button className={styles.deleteButton} onClick={() => handleDeleteCar(car)}>Delete</button>
                  </div>
                </div>
                <div className={styles.imageContainer}>
                  <img src={car.photo_url} alt={`Photo of ${car.car_name}`} className={styles.carPhoto} />
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

export default Admineditaremasini;
