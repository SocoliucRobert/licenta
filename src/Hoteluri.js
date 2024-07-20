import React, { useState, useEffect } from 'react';
import styles from './hoteluri.module.css';
import Meniusus from './Meniusus';
import Meniujos from './Meniujos';
import imagineMare from './poze/imagineMare.png';
import ChatGpt from './ChatGpt';
import CardHotel from './carduri/Cardhotel';
import supabase from './supabaseClient';

const Hoteluri = () => {
  const [address, setAddress] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [starsFilter, setStarsFilter] = useState('');
  const [priceSortOrder, setPriceSortOrder] = useState(null); 
  const [hotels, setHotels] = useState([]);
  const [starRating, setStarRating] = useState('');
  const [searchClicked, setSearchClicked] = useState(false);

  useEffect(() => {
    if (searchClicked) {
      fetchHotels();
    }
  }, [searchClicked, address, checkInDate, checkOutDate, starRating, priceSortOrder]);

  const fetchHotels = async () => {
    try {
      let { data, error } = await supabase.from('hotels').select('*');
      if (error) throw error;

     
      let filteredHotels = data.filter((hotel) => {
       
        if (address && hotel.address.toLowerCase().indexOf(address.toLowerCase()) === -1) {
          return false;
        }

  
        if (checkInDate && checkOutDate) {
          const searchCheckIn = new Date(checkInDate);
          const searchCheckOut = new Date(checkOutDate);
          const hotelValidFrom = new Date(hotel.valid_from);
          const hotelValidTo = new Date(hotel.valid_to);

          if (
            searchCheckIn > hotelValidTo ||
            searchCheckOut < hotelValidFrom
          ) {
            return false;
          }
        }

  
        if (starRating && hotel.stars !== parseInt(starRating)) {
          return false;
        }

        return true;
      });

    
      if (priceSortOrder !== null) {
        filteredHotels.sort((a, b) => {
          if (priceSortOrder === 'asc') {
            return a.price_per_adult - b.price_per_adult;
          } else {
            return b.price_per_adult - a.price_per_adult;
          }
        });
      }

      setHotels(filteredHotels);
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

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleCheckInDateChange = (event) => {
    setCheckInDate(event.target.value);
  };

  const handleCheckOutDateChange = (event) => {
    setCheckOutDate(event.target.value);
  };

  const handleStarRatingChange = (event) => {
    setStarRating(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchClicked(true);
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
                  <label htmlFor="address">Adresă</label>
                  <input
                    type="text"
                    id="address"
                    placeholder="Adresă"
                    value={address}
                    onChange={handleAddressChange}
                  />
                </div>
                <div className={styles.section}>
                  <label htmlFor="checkInDate">Perioada</label>
                  <div className={styles.dateInputs}>
                    <input
                      type="date"
                      id="checkInDate"
                      value={checkInDate}
                      onChange={handleCheckInDateChange}
                    />
                    <input
                      type="date"
                      id="checkOutDate"
                      value={checkOutDate}
                      onChange={handleCheckOutDateChange}
                    />
                  </div>
                </div>
                <div className={styles.section}>
                  <label htmlFor="starRating">Număr stele</label>
                  <select
                    id="starRating"
                    value={starRating}
                    onChange={handleStarRatingChange}
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
                value={priceSortOrder || ''}
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
            {hotels.length === 0 && searchClicked && (
              <p>Nu s-au găsit hoteluri !</p>
            )}
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
