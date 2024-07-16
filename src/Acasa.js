import React from 'react';
import styles from './acasa.module.css';
import Meniusus from './Meniusus';
import Meniujos from './Meniujos';
import imagineMare from './poze/imagineMare.png';  
import ChatGpt from './ChatGpt';
import Chat from './Chat';
import CardHotel from './carduri/Cardhotel';
import supabase from './supabaseClient';
import { useState } from 'react';
import { useEffect } from 'react';
import CardZbor from './carduri/Cardzbor';
import CardOferta from './carduri/Cardoferta';
const Acasa = () => {
  const [hotels, setHotels] = useState([]);
  const [flights, setFlights] = useState([]);
  const [oferte, setOferte] = useState([]);

  useEffect(() => {
    fetchLatestItems();
  }, []);

  const fetchLatestItems = async () => {
    try {
      const { data: hotelsData, error: hotelsError } = await supabase
        .from('hotels')
        .select('*')
        .order('id', { ascending: false })
        .limit(4);

      const { data: flightsData, error: flightsError } = await supabase
        .from('flights')
        .select('*')
        .order('id', { ascending: false })
        .limit(4);

      const { data: oferteData, error: oferteError } = await supabase
        .from('oferta')
        .select('*')
        .order('id', { ascending: false })
        .limit(4);

      if (hotelsError || flightsError || oferteError) {
        throw new Error('Error fetching data');
      }

      setHotels(hotelsData || []);
      setFlights(flightsData || []);
      setOferte(oferteData || []);
    } catch (error) {
      console.error('Error fetching latest items:', error.message);
    }
  };
  return (
    <div>
      <ChatGpt />
      <Meniusus />
      
      
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
                <label htmlFor="adults">Număr persoane</label>
                <input type="number" id="adults" placeholder="Numar persoane" min="1" />
              </div>
            </div>
            <div className={styles.buttonContainer}>
              <button type="submit">CAUTA</button>
            </div>
          </form>
          
        </div>
      </div>
      
      <h2 className={styles.sectionHeader}>Cele mai noi hoteluri</h2>
      
      <div className={styles.cardContainer}>
        {hotels.map((hotel) => (
          <CardHotel key={hotel.id} hotel={hotel} />
        ))}
      </div>

      <h2 className={styles.sectionHeader}>Oferte speciale</h2>
      <div className={styles.cardContainer}>
        {oferte.map((oferta) => (
          <CardOferta key={oferta.id} oferta={oferta} />
        ))}
      </div>
      <h2 className={styles.sectionHeader}>Zboruri disponibile</h2>
      <div className={styles.cardContainer}>
        {flights.map((flight) => (
          <CardZbor key={flight.id} flight={flight} />
        ))}
      </div>
    
      
      <Meniujos />
    </div>
  );
};

export default Acasa;
