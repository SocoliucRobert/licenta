import React, { useEffect, useState } from 'react';
import { Link, Redirect, useNavigate } from 'react-router-dom';
import Meniusus from '../Meniusus';
import Meniujos from '../Meniujos';
import styles from './admineditaremasini.module.css'; // Update this path based on your CSS module file
import supabase from '../supabaseClient'; // Adjust this path based on your Supabase client configuration

const Admineditaremasini = () => {
  const [cars, setCars] = useState([]);
  const [authenticated, setAuthenticated] = useState(false); // State to track authentication
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication(); // Check authentication status when component mounts
    fetchCars(); // Fetch cars data when component mounts
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
          navigate('/Login'); // Redirect to login if user is not authorized
        }
      } catch (error) {
        console.error('Error parsing session JSON:', error);
        setAuthenticated(false);
        navigate('/Login'); // Redirect to login if error parsing session
      }
    } else {
      setAuthenticated(false);
      navigate('/Login'); // Redirect to login if no session found
    }
  };

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase.from('masini').select('*');
      if (error) throw error;
      setCars(data.map((car) => ({ ...car, editing: false }))); // Add editing state to each car
    } catch (error) {
      console.error('Error fetching cars:', error.message);
    }
  };

  const handleEditToggle = (carId) => {
    setCars((prevCars) =>
      prevCars.map((car) =>
        car.id === carId ? { ...car, editing: !car.editing } : car
      )
    );
  };

  const handleSaveCar = async (carId) => {
    const car = cars.find((c) => c.id === carId);
    const updatedCar = { ...car };
    delete updatedCar.editing;

    try {
      const { data, error } = await supabase
        .from('masini')
        .update(updatedCar)
        .eq('id', car.id);
      if (error) throw error;
      alert('Car updated successfully!');
      setCars((prevCars) =>
        prevCars.map((c) => (c.id === carId ? { ...c, editing: false } : c))
      );
    } catch (error) {
      console.error('Error updating car:', error.message);
      alert('Failed to update car. Please try again.');
    }
  };

  const handleDeleteCar = async (car) => {
    if (
      window.confirm(`Are you sure you want to delete car "${car.car_name}"?`)
    ) {
      try {
        const { error } = await supabase.from('masini').delete().eq('id', car.id);
        if (error) throw error;
        alert('Car deleted successfully!');
        setCars((prevCars) => prevCars.filter((c) => c.id !== car.id)); // Remove deleted car from state
      } catch (error) {
        console.error('Error deleting car:', error.message);
        alert('Failed to delete car. Please try again.');
      }
    }
  };

  const handleInputChange = (carId, field, value) => {
    setCars((prevCars) =>
      prevCars.map((car) =>
        car.id === carId ? { ...car, [field]: value } : car
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
              <li>
                <Link to="/Adminhoteluri">ADAUGARE HOTEL</Link>
              </li>
              <li>
                <Link to="/Adminzboruri">ADAUGARE ZBOR</Link>
              </li>
              <li>
                <Link to="/Adminmasini">ADAUGARE MASINA</Link>
              </li>
              <li>
                <Link to="/Adminoferte">ADAUGARE OFERTA</Link>
              </li>
              <li>
                <Link to="/Admineditarehotel">EDITARE HOTEL</Link>
              </li>
              <li>
                <Link to="/Admineditarezbor">EDITARE ZBOR</Link>
              </li>
              <li>
                <Link to="/Admineditaremasini">EDITARE MASINA</Link>
              </li>
              <li>
                <Link to="/Admineditareoferte">EDITARE OFERTA</Link>
              </li>
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
                    </>
                  )}
                  {car.editing && (
                    <>
                      <div className={styles.formGroup}>
                        <label>Nume Mașină</label>
                        <input
                          type="text"
                          value={car.car_name}
                          onChange={(e) =>
                            handleInputChange(car.id, 'car_name', e.target.value)
                          }
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Locație</label>
                        <input
                          type="text"
                          value={car.car_location}
                          onChange={(e) =>
                            handleInputChange(car.id, 'car_location', e.target.value)
                          }
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Kilometraj</label>
                        <input
                          type="number"
                          value={car.mileage}
                          onChange={(e) =>
                            handleInputChange(car.id, 'mileage', e.target.value)
                          }
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Tip transmisie</label>
                        <select
                          value={car.transmission_type}
                          onChange={(e) =>
                            handleInputChange(car.id, 'transmission_type', e.target.value)
                          }
                        >
                          <option value="">Selectează...</option>
                          <option value="manuala">Manuală</option>
                          <option value="automata">Automată</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Tip combustibil</label>
                        <select
                          value={car.fuel_type}
                          onChange={(e) =>
                            handleInputChange(car.id, 'fuel_type', e.target.value)
                          }
                        >
                          <option value="">Selectează...</option>
                          <option value="benzina">Benzină</option>
                          <option value="motorina">Motorină</option>
                          <option value="electric">Electric</option>
                          <option value="hibrid">Hibrid</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Număr de locuri</label>
                        <select
                          value={car.number_of_seats}
                          onChange={(e) =>
                            handleInputChange(car.id, 'number_of_seats', e.target.value)
                          }
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
                          value={car.price_per_day}
                          onChange={(e) =>
                            handleInputChange(car.id, 'price_per_day', e.target.value)
                          }
                        />
                      </div>
                    </>
                  )}
                  <div className={styles.buttonContainer}>
                    {!car.editing && (
                      <button
                        className={styles.editButton}
                        onClick={() => handleEditToggle(car.id)}
                      >
                        Edit
                      </button>
                    )}
                    {car.editing && (
                      <button
                        className={styles.saveButton}
                        onClick={() => handleSaveCar(car.id)}
                      >
                        Save
                      </button>
                    )}
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteCar(car)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className={styles.imageContainer}>
                  <img
                    src={car.photo_url}
                    alt={`Photo of ${car.car_name}`}
                    className={styles.carPhoto}
                  />
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
