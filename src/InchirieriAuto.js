import React, { useEffect, useState } from 'react';
import styles from './inchirieriauto.module.css';
import Meniusus from './Meniusus';
import Meniujos from './Meniujos';
import imagineMare from './poze/imagineMare.png';
import ChatGpt from './ChatGpt';
import CardMasina from './carduri/Cardmasina';
import supabase from './supabaseClient';

const InchirieriAuto = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [seatsFilter, setSeatsFilter] = useState('');
  const [fuelTypeFilter, setFuelTypeFilter] = useState('');
  const [transmissionFilter, setTransmissionFilter] = useState('');
  const [priceSortOrder, setPriceSortOrder] = useState('');
  const [cars, setCars] = useState([]);
  const [searchClicked, setSearchClicked] = useState(false);

  useEffect(() => {
    if (searchClicked) {
      fetchCars();
    }
  }, [searchClicked, pickupLocation, seatsFilter, fuelTypeFilter, transmissionFilter, priceSortOrder]);

  const fetchCars = async () => {
    try {
      let { data, error } = await supabase.from('masini').select('*');
      if (error) throw error;


      let filteredCars = data.filter((car) => {
       
        if (pickupLocation && car.car_location.toLowerCase().indexOf(pickupLocation.toLowerCase()) === -1) {
          return false;
        }

    
        if (seatsFilter && car.number_of_seats < parseInt(seatsFilter)) {
          return false;
        }

    
        if (fuelTypeFilter && car.fuel_type !== fuelTypeFilter) {
          return false;
        }

    
        if (transmissionFilter && car.transmission_type !== transmissionFilter) {
          return false;
        }

        return true;
      });

  
      if (priceSortOrder === 'asc') {
        filteredCars.sort((a, b) => a.price_per_day - b.price_per_day);
      } else if (priceSortOrder === 'desc') {
        filteredCars.sort((a, b) => b.price_per_day - a.price_per_day);
      }

      setCars(filteredCars);
    } catch (error) {
      console.error('Error fetching cars:', error.message);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchClicked(true);
  };

  const handlePickupLocationChange = (event) => {
    setPickupLocation(event.target.value);
  };

  const handleSeatsFilterChange = (event) => {
    setSeatsFilter(event.target.value);
  };

  const handleFuelTypeFilterChange = (event) => {
    setFuelTypeFilter(event.target.value);
  };

  const handleTransmissionFilterChange = (event) => {
    setTransmissionFilter(event.target.value);
  };

  const handlePriceSortChange = (event) => {
    setPriceSortOrder(event.target.value);
  };

  return (
    <div className={styles.pageContainer}>
     
      <Meniusus />
      <div className={styles.contentContainer}>
        <div className={styles.imageContainer}>
          <img src={imagineMare} alt="Big Image" className={styles.bigImage} />
          <div className={styles.formOverlay}>
            <form className={styles.form} onSubmit={handleSearch}>
              <div className={styles.formRow}>
                <div className={styles.section}>
                  <label htmlFor="pickupLocation">Locație preluare</label>
                  <input
                    type="text"
                    id="pickupLocation"
                    placeholder="Locație preluare"
                    value={pickupLocation}
                    onChange={handlePickupLocationChange}
                  />
                </div>
                <div className={styles.section}>
                  <label htmlFor="numarLocuri">Număr locuri</label>
                  <input
                    type="number"
                    id="numarLocuri"
                    placeholder="Număr locuri"
                    min="1"
                    value={seatsFilter}
                    onChange={handleSeatsFilterChange}
                  />
                </div>
                <div className={styles.section}>
                  <label htmlFor="tipCombustibil">Tip combustibil</label>
                  <select
                    id="tipCombustibil"
                    value={fuelTypeFilter}
                    onChange={handleFuelTypeFilterChange}
                    className={styles.selectInput}
                  >
                    <option value="">Toate</option>
                    <option value="motorina">Motorină</option>
                    <option value="benzina">Benzină</option>
                    <option value="hibrid">Hibrid</option>
                    <option value="electric">Electric</option>
                  </select>
                </div>
              </div>
              <div className={styles.buttonContainer}>
                <button type="submit">CAUTA</button>
              </div>
            </form>
          </div>
        </div>
        <div className={styles.mainContent}>
          <div className={styles.filterSection}>
            <div className={styles.priceFilter}>
              <label htmlFor="priceSortOrder">Sortare preț:</label>
              <select
                id="priceSortOrder"
                value={priceSortOrder}
                onChange={handlePriceSortChange}
                className={styles.selectInput}
              >
                <option value="">Cel mai relevant</option>
                <option value="asc">Crescător</option>
                <option value="desc">Descrescător</option>
              </select>
            </div>
            <div className={styles.transmissionFilter}>
              <label htmlFor="transmissionFilter">Filtrare după cutie de viteze:</label>
              <select
                id="transmissionFilter"
                value={transmissionFilter}
                onChange={handleTransmissionFilterChange}
                className={styles.selectInput}
              >
                <option value="">Toate</option>
                <option value="manuala">Cutie manuală</option>
                <option value="automata">Cutie automată</option>
              </select>
            </div>
          </div>
          <div className={styles.cardContainer}>
            {cars.length === 0 && searchClicked && (
              <p>Nu s-au găsit mașini care să corespundă criteriilor.</p>
            )}
            {cars.map((car) => (
              <CardMasina key={car.id} masina={car} />
            ))}
          </div>
        </div>
      </div>
      <Meniujos />
    </div>
  );
};

export default InchirieriAuto;
