import React, { useState, useEffect } from "react";
import styles from "./zboruri.module.css";
import Meniusus from "./Meniusus";
import Meniujos from "./Meniujos";
import imagineMare from "./poze/imagineMare.png";
import ChatGpt from "./ChatGpt";
import CardZbor from "./carduri/Cardzbor";
import supabase from "./supabaseClient";

const Zboruri = () => {
  const [flights, setFlights] = useState([]);
  const [priceSortOrder, setPriceSortOrder] = useState(""); // State for sorting order

  useEffect(() => {
    fetchFlights();
  }, [priceSortOrder]); // Trigger fetch on priceSortOrder change

  const fetchFlights = async () => {
    try {
      let { data, error } = await supabase.from("flights").select("*");
      if (error) throw error;

      // Sorting based on priceSortOrder
      if (priceSortOrder === "asc") {
        data.sort((a, b) => a.price - b.price);
      } else if (priceSortOrder === "desc") {
        data.sort((a, b) => b.price - a.price);
      }

      setFlights(data);
    } catch (error) {
      console.error("Error fetching flights:", error.message);
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
                  <label htmlFor="departureCity">Plecare</label>
                  <input
                    type="text"
                    id="departureCity"
                    placeholder="Oras de plecare"
                  />
                </div>
                <div className={styles.section}>
                  <label htmlFor="arrivalCity">Destinație</label>
                  <input
                    type="text"
                    id="arrivalCity"
                    placeholder="Oras de destinație"
                  />
                </div>
                <div className={styles.section}>
                  <label htmlFor="departureDate">Data Plecării</label>
                  <input type="date" id="departureDate" />
                </div>
                <div className={styles.section}>
                  <label htmlFor="returnDate">Data Întoarcerii</label>
                  <input type="date" id="returnDate" />
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
