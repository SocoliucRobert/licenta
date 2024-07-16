import React, { useState, useEffect } from 'react';
import styles from './hoteluri.module.css';
import Meniusus from './Meniusus';
import Meniujos from './Meniujos';
import imagineMare from './poze/imagineMare.png';
import ChatGpt from './ChatGpt';
import CardHotel from './carduri/Cardhotel';
import supabase from './supabaseClient';

const Hoteluri = () => {
  const [starsFilter, setStarsFilter] = useState('');
  const [priceSortOrder, setPriceSortOrder] = useState(null); // Default: null means not sorted by price
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    fetchHotels();
  }, [starsFilter, priceSortOrder]);

  const fetchHotels = async () => {
    try {
      let { data, error } = await supabase.from('hotels').select('*');
      if (error) throw error;

      // Apply stars filter if selected
      if (starsFilter) {
        data = data.filter((hotel) => hotel.stars === parseInt(starsFilter));
      }

      // Apply sorting based on priceSortOrder if it's not null
      if (priceSortOrder !== null) {
        data.sort((a, b) => {
          if (priceSortOrder === 'asc') {
            return a.price_per_adult - b.price_per_adult;
          } else {
            return b.price_per_adult - a.price_per_adult;
          }
        });
      }

      setHotels(data);
    } catch (error) {
      console.error('Error fetching hotels:', error.message);
    }
  };

  const handleStarsChange = (event) => {
    setStarsFilter(event.target.value);
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
                  <label htmlFor="city">Hotel</label>
                  <input type="text" id="city" placeholder="Oras" />
                </div>
                <div className={styles.section}>
                  <label htmlFor="checkInDate">Perioada</label>
                  <div className={styles.dateInputs}>
                    <input type="date" id="checkInDate" />
                    <input type="date" id="checkOutDate" />
                  </div>
                </div>
                <div className={styles.section}>
                  <label htmlFor="adults">Număr persoane</label>
                  <div className={styles.peopleInputs}>
                    <input type="number" id="adults" placeholder="Număr persoane" min="1" />
                    
                  </div>
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
            <div className={styles.sortOrder}>
              <label htmlFor="priceSortOrder">Sortare preț:</label>
              <select
                id="priceSortOrder"
                value={priceSortOrder || ''} // Default is null, so set empty string if null to avoid controlled/uncontrolled warning
                onChange={handlePriceSortChange}
                className={styles.selectInput}
              >
                <option value="">Cel mai relevant</option>
                <option value="asc">Crescător</option>
                <option value="desc">Descrescător</option>
              </select>
            </div>
            <div className={styles.starsFilter}>
              <label htmlFor="starsFilter">Filtrare după stele:</label>
              <select
                id="starsFilter"
                value={starsFilter}
                onChange={handleStarsChange}
                className={styles.selectInput}
              >
                <option value="">Toate</option>
                <option value="1">1 stea</option>
                <option value="2">2 stele</option>
                <option value="3">3 stele</option>
                <option value="4">4 stele</option>
                <option value="5">5 stele</option>
              </select>
            </div>
          </div>
          <div className={styles.cardContainer}>
            {hotels.map((hotel) => (
              <CardHotel key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </div>
      </div>
      <Meniujos />
    </div>
  );
};

export default Hoteluri;
