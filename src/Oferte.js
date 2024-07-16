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
  const [priceSortOrder, setPriceSortOrder] = useState(''); // State for sorting order

  useEffect(() => {
    fetchOffers();
  }, [priceSortOrder]); // Trigger fetch on priceSortOrder change

  const fetchOffers = async () => {
    try {
      let { data, error } = await supabase.from('oferta').select('*');
      if (error) throw error;

      // Sorting based on priceSortOrder
      if (priceSortOrder === 'asc') {
        data.sort((a, b) => a.price - b.price);
      } else if (priceSortOrder === 'desc') {
        data.sort((a, b) => b.price - a.price);
      }

      setOffers(data);
    } catch (error) {
      console.error('Error fetching offers:', error.message);
    }
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
                  <label htmlFor="destination">Destinație</label>
                  <input type="text" id="destination" placeholder="Destinație" />
                </div>
                <div className={styles.section}>
                  <label htmlFor="checkInDate">Perioada</label>
                  <div className={styles.dateInputs}>
                    <input type="date" id="checkInDate" />
                    <input type="date" id="checkOutDate" />
                  </div>
                </div>
                <div className={styles.section}>
                  <label htmlFor="numarPersoane">Număr persoane</label>
                  <input
                    type="number"
                    id="numarPersoane"
                    placeholder="Număr persoane"
                    min="1"
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
