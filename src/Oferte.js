import React, { useState, useEffect } from 'react';
import styles from './oferte.module.css';
import Meniusus from './Meniusus';
import Meniujos from './Meniujos';
import imagineMare from './poze/imagineMare.png';
import ChatGpt from './ChatGpt';
import CardOferta from './carduri/Cardoferta';
import supabase from './supabaseClient';

const Oferte = () => {
  const [offers, setOffers] = useState([]);
  const [priceSortOrder, setPriceSortOrder] = useState('');
  const [destinatie, setDestinatie] = useState('');
  const [startPeriod, setStartPeriod] = useState('');
  const [endPeriod, setEndPeriod] = useState('');
  const [numarPersoane, setNumarPersoane] = useState('');
  const [searchClicked, setSearchClicked] = useState(false);

  const fetchOffers = async () => {
    try {
      let { data, error } = await supabase.from('oferta').select('*');
      if (error) throw error;

    
      let filteredOffers = data.filter((oferta) => {
       
        if (destinatie && oferta.destination.toLowerCase().indexOf(destinatie.toLowerCase()) === -1) {
          return false;
        }

     
        if (startPeriod && endPeriod) {
          const ofertaStart = new Date(oferta.start_period);
          const ofertaEnd = new Date(oferta.end_period);
          const searchStart = new Date(startPeriod);
          const searchEnd = new Date(endPeriod);

          if (!(searchStart.getTime() === ofertaStart.getTime() && searchEnd.getTime() === ofertaEnd.getTime())) {
            return false;
          }
        }

   
        if (numarPersoane && oferta.number_of_persons !== parseInt(numarPersoane)) {
          return false;
        }

        return true;
      });

      // Sorting based on priceSortOrder
      if (priceSortOrder === 'asc') {
        filteredOffers.sort((a, b) => a.price - b.price);
      } else if (priceSortOrder === 'desc') {
        filteredOffers.sort((a, b) => b.price - a.price);
      }

      setOffers(filteredOffers);
    } catch (error) {
      console.error('Error fetching offers:', error.message);
    }
  };

  const handlePriceSortChange = (event) => {
    setPriceSortOrder(event.target.value);
  };

  const handleDestinatieChange = (event) => {
    setDestinatie(event.target.value);
  };

  const handleStartPeriodChange = (event) => {
    setStartPeriod(event.target.value);
  };

  const handleEndPeriodChange = (event) => {
    setEndPeriod(event.target.value);
  };

  const handleNumarPersoaneChange = (event) => {
    setNumarPersoane(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchClicked(true);
    fetchOffers(); 
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
                  <label htmlFor="destination">Destinație</label>
                  <input
                    type="text"
                    id="destination"
                    placeholder="Destinație"
                    value={destinatie}
                    onChange={handleDestinatieChange}
                  />
                </div>
                <div className={styles.section}>
                  <label htmlFor="checkInDate">Perioada</label>
                  <div className={styles.dateInputs}>
                    <input
                      type="date"
                      id="checkInDate"
                      value={startPeriod}
                      onChange={handleStartPeriodChange}
                    />
                    <input
                      type="date"
                      id="checkOutDate"
                      value={endPeriod}
                      onChange={handleEndPeriodChange}
                    />
                  </div>
                </div>
                <div className={styles.section}>
                  <label htmlFor="numarPersoane">Număr persoane</label>
                  <input
                    type="number"
                    id="numarPersoane"
                    placeholder="Număr persoane"
                    min="1"
                    value={numarPersoane}
                    onChange={handleNumarPersoaneChange}
                  />
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
                value={priceSortOrder}
                onChange={handlePriceSortChange}
                className={styles.selectInput}
              >
                <option value="">Cel mai relevant</option>
                <option value="asc">Crescător</option>
                <option value="desc">Descrescător</option>
              </select>
            </div>
          </div>
          <div className={styles.cardContainer}>
            {searchClicked && offers.length === 0 && (
              <p>Nu sunt oferte disponibile.</p>
            )}
            {offers.map((oferta) => (
              <CardOferta key={oferta.id} oferta={oferta} />
            ))}
          </div>
        </div>
      </div>
      <Meniujos />
    </div>
  );
};

export default Oferte;
