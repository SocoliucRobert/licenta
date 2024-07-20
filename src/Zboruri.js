import React, { useState, useEffect } from "react";
import styles from "./zboruri.module.css";
import Meniusus from "./Meniusus";
import Meniujos from "./Meniujos";
import imagineMare from "./poze/imagineMare.png";
import ChatGpt from "./ChatGpt";
import CardZbor from "./carduri/Cardzbor";
import supabase from "./supabaseClient";

const Zboruri = () => {
  const [departureCity, setDepartureCity] = useState("");
  const [arrivalCity, setArrivalCity] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [flights, setFlights] = useState([]);
  const [priceSortOrder, setPriceSortOrder] = useState(""); 

  const fetchFlights = async () => {
    try {
      let query = supabase.from("flights").select("*");

      if (departureCity) {
        query = query.ilike("departure_location", `%${departureCity}%`);
      }

      if (arrivalCity) {
        query = query.ilike("arrival_location", `%${arrivalCity}%`);
      }

      if (departureDate) {
        query = query.eq("departure_date", departureDate);
      }

      let { data, error } = await query;

      if (error) throw error;

      
      if (priceSortOrder === "asc") {
        data.sort((a, b) => a.price_per_person - b.price_per_person);
      } else if (priceSortOrder === "desc") {
        data.sort((a, b) => b.price_per_person - a.price_per_person);
      }

      setFlights(data);
    } catch (error) {
      console.error("Error fetching flights:", error.message);
    }
  };

  const handlePriceSortChange = (event) => {
    setPriceSortOrder(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchFlights();
  };

  return (
    <div className={styles.pageContainer}>
     
      <Meniusus />
      <div className={styles.contentContainer}>
        <div className={styles.imageContainer}>
          <img
            src={imagineMare}
            alt="Big Image"
            className={styles.bigImage}
          />
          <div className={styles.formOverlay}>
            <form className={styles.form} onSubmit={handleSearch}>
              <div className={styles.formRow}>
                <div className={styles.section}>
                  <label htmlFor="departureCity">Oras de plecare</label>
                  <input
                    type="text"
                    id="departureCity"
                    placeholder="Oras de plecare"
                    value={departureCity}
                    onChange={(e) => setDepartureCity(e.target.value)}
                  />
                </div>
                <div className={styles.section}>
                  <label htmlFor="arrivalCity">Destinație</label>
                  <input
                    type="text"
                    id="arrivalCity"
                    placeholder="Destinație"
                    value={arrivalCity}
                    onChange={(e) => setArrivalCity(e.target.value)}
                  />
                </div>
                <div className={styles.section}>
                  <label htmlFor="departureDate">Data plecarii</label>
                  <input
                    type="date"
                    id="departureDate"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
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
            {flights.length === 0 && (
              <p>Nu s-au gasit zboruri.</p>
            )}
            {flights.map((flight) => (
              <CardZbor key={flight.id} flight={flight} />
            ))}
          </div>
        </div>
      </div>
      <Meniujos />
    </div>
  );
};

export default Zboruri;
