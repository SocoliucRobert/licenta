import React, { useEffect, useState } from 'react';
import styles from './inchirieriauto.module.css';
import Meniusus from './Meniusus';
import Meniujos from './Meniujos';
import imagineMare from './poze/imagineMare.png';
import ChatGpt from './ChatGpt';
import CardMasina from './carduri/Cardmasina'; 
import supabase from './supabaseClient';

const InchirieriAuto = () => {
  const [fuelTypeFilter, setFuelTypeFilter] = useState('');
  const [seatsFilter, setSeatsFilter] = useState('');
  const [transmissionFilter, setTransmissionFilter] = useState('');
  const [priceSortOrder, setPriceSortOrder] = useState('');
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetchCars();
  }, [fuelTypeFilter, seatsFilter, transmissionFilter, priceSortOrder]);

  const fetchCars = async () => {
    try {
      let { data, error } = await supabase.from('masini').select('*');
      if (error) throw error;

      if (fuelTypeFilter) {
        data = data.filter((car) => car.fuel_type === fuelTypeFilter);
      }

      if (seatsFilter) {
        data = data.filter((car) => car.number_of_seats === parseInt(seatsFilter));
      }

      if (transmissionFilter) {
        data = data.filter((car) => car.transmission_type === transmissionFilter);
      }

      if (priceSortOrder) {
        data.sort((a, b) => {
          if (priceSortOrder === 'asc') {
            return a.price_per_day - b.price_per_day;
          } else if (priceSortOrder === 'desc') {
            return b.price_per_day - a.price_per_day;
          } else {
            return 0;
          }
        });
      }

      setCars(data);
    } catch (error) {
      console.error('Error fetching cars:', error.message);
    }
  };

  const handleFuelTypeChange = (event) => {
    setFuelTypeFilter(event.target.value);
  };

  const handleSeatsChange = (event) => {
    setSeatsFilter(event.target.value);
  };

  const handleTransmissionChange = (event) => {
    setTransmissionFilter(event.target.value);
  };

  const handlePriceSortChange = (event) => {
    setPriceSortOrder(event.target.value);
  };

  return (
    <div className={styles.pageContainer}>
      <ChatGpt />
      <Meniusus />
      <div className={styles.contentContainer}>
        <div className={styles.imageContainer}>
          <img src={imagineMare} alt="Big Image" className={styles.bigImage} />
          <div className={styles.formOverlay}>
            <form className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.section}>
                  <label htmlFor="pickupLocation">Locație preluare</label>
                  <input type="text" id="pickupLocation" placeholder="Locație preluare" />
                </div>
                <div className={styles.section}>
                  <label htmlFor="numarLocuri">Număr locuri</label>
                  <input type="number" id="numarLocuri" placeholder="Număr locuri" min="1" />
                </div>
                <div className={styles.section}>
                  <label htmlFor="tipCombustibil">Tip combustibil</label>
                  <input type="number" id="numarPersoane" placeholder="Tip combustibil" min="1" />
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
            <div className={styles.fuelTypeFilter}>
              <label htmlFor="fuelType">Filtrare după tip combustibil:</label>
              <select
                id="fuelType"
                value={fuelTypeFilter}
                onChange={handleFuelTypeChange}
                className={styles.selectInput}
              >
                <option value="">Toate</option>
                <option value="motorina">Motorină</option>
                <option value="benzina">Benzină</option>
                <option value="electric">Electric</option>
                <option value="hibrid">Hibrid</option>
              </select>
            </div>
            <div className={styles.seatsFilter}>
              <label htmlFor="seatsFilter">Filtrare după număr de locuri:</label>
              <select
                id="seatsFilter"
                value={seatsFilter}
                onChange={handleSeatsChange}
                className={styles.selectInput}
              >
                <option value="">Toate</option>
                <option value="2">2 locuri</option>
                <option value="4">4 locuri</option>
                <option value="5">5 locuri</option>
                <option value="7">7 locuri</option>
                <option value="9">9 locuri</option>
              </select>
            </div>
            <div className={styles.transmissionFilter}>
              <label htmlFor="transmissionFilter">Filtrare după cutie de viteze:</label>
              <select
                id="transmissionFilter"
                value={transmissionFilter}
                onChange={handleTransmissionChange}
                className={styles.selectInput}
              >
                <option value="">Toate</option>
                <option value="manuala">Cutie manuală</option>
                <option value="automata">Cutie automată</option>
              </select>
            </div>
          </div>
          <div className={styles.cardContainer}>
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
