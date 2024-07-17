import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Meniusus from '../Meniusus';
import Meniujos from '../Meniujos';
import styles from './useroferte.module.css';
import supabase from '../supabaseClient';

const Useroferte = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    fetchOffers(); // Fetch offers data when component mounts
  }, []);

  const fetchOffers = async () => {
    try {
      const { data, error } = await supabase.from('oferta').select('*');
      if (error) throw error;
      setOffers(data.map(offer => ({ ...offer, editing: false }))); // Add editing state to each offer
    } catch (error) {
      console.error('Error fetching offers:', error.message);
    }
  };

  const handleEditToggle = (offerId) => {
    setOffers(prevOffers =>
      prevOffers.map(offer =>
        offer.id === offerId ? { ...offer, editing: !offer.editing } : offer
      )
    );
  };

  const handleSaveOffer = async (offerId) => {
    const offer = offers.find(o => o.id === offerId);
    const updatedOffer = { ...offer };
    delete updatedOffer.editing;

    try {
      const { data, error } = await supabase.from('oferta').update(updatedOffer).eq('id', offer.id);
      if (error) throw error;
      alert('Offer updated successfully!');
      setOffers(prevOffers =>
        prevOffers.map(o =>
          o.id === offerId ? { ...o, editing: false } : o
        )
      );
    } catch (error) {
      console.error('Error updating offer:', error.message);
      alert('Failed to update offer. Please try again.');
    }
  };

  const handleDeleteOffer = async (offer) => {
    if (window.confirm(`Are you sure you want to delete offer "${offer.destination}"?`)) {
      try {
        const { error } = await supabase.from('oferta').delete().eq('id', offer.id);
        if (error) throw error;
        alert('Offer deleted successfully!');
        setOffers(prevOffers => prevOffers.filter(o => o.id !== offer.id)); // Remove deleted offer from state
      } catch (error) {
        console.error('Error deleting offer:', error.message);
        alert('Failed to delete offer. Please try again.');
      }
    }
  };

  const handleInputChange = (offerId, field, value) => {
    setOffers(prevOffers =>
      prevOffers.map(offer =>
        offer.id === offerId ? { ...offer, [field]: value } : offer
      )
    );
  };

  return (
    <div className={styles.adminContainer}>
      <Meniusus />

      <div className={styles.mainArea}>
        <div className={styles.leftSidebar}>
          <div className={styles.menu}>
            <div className={styles.menuHeader}>Panou Admin</div>
            <ul>
              <li><Link to="/Userhotel">USER HOTELURI</Link></li>
              <li><Link to="/Userzbor">USER ZBORURI</Link></li>
              <li><Link to="/Usermasina">USER MASINI</Link></li>
              <li><Link to="/Useroferte">USER OFERTE</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.content}>
          <h2>Listă Oferte</h2>
          <div className={styles.offerList}>
            {offers.map((offer) => (
              <div key={offer.id} className={styles.offerItem}>
                <div className={styles.offerDetails}>
                  {!offer.editing && (
                    <>
                      <h3>{offer.destination}</h3>
                      <p>Număr de persoane: {offer.number_of_persons}</p>
                      <p>Perioada de început: {offer.start_period}</p>
                      <p>Perioada de sfârșit: {offer.end_period}</p>
                      <p>Preț: {offer.price}</p>
                      <p>Descriere: {offer.description}</p> {/* Display description */}
                    </>
                  )}
                  {offer.editing && (
                    <>
                      <div className={styles.formGroup}>
                        <label>Destinație</label>
                        <input type="text" value={offer.destination} onChange={(e) => handleInputChange(offer.id, 'destination', e.target.value)} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Număr de persoane</label>
                        <input type="number" value={offer.number_of_persons} onChange={(e) => handleInputChange(offer.id, 'number_of_persons', e.target.value)} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Perioada de început</label>
                        <input type="date" value={offer.start_period} onChange={(e) => handleInputChange(offer.id, 'start_period', e.target.value)} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Perioada de sfârșit</label>
                        <input type="date" value={offer.end_period} onChange={(e) => handleInputChange(offer.id, 'end_period', e.target.value)} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Preț</label>
                        <input type="number" value={offer.price} onChange={(e) => handleInputChange(offer.id, 'price', e.target.value)} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Descriere</label>
                        <textarea value={offer.description} onChange={(e) => handleInputChange(offer.id, 'description', e.target.value)} rows="4"></textarea>
                      </div>
                    </>
                  )}
                  <div className={styles.buttonContainer}>
                    {!offer.editing && (
                      <button className={styles.editButton} onClick={() => handleEditToggle(offer.id)}>Edit</button>
                    )}
                    {offer.editing && (
                      <button className={styles.saveButton} onClick={() => handleSaveOffer(offer.id)}>Save</button>
                    )}
                    <button className={styles.deleteButton} onClick={() => handleDeleteOffer(offer)}>Delete</button>
                  </div>
                </div>
                <div className={styles.imageContainer}>
                  <img src={offer.offer_image_url} alt={`Offer for ${offer.destination}`} className={styles.offerPhoto} />
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

export default Useroferte;
