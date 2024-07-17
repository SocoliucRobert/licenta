import React, { useEffect, useState } from 'react';
import Meniusus from '../Meniusus';
import Meniujos from '../Meniujos';
import styles from './userhotel.module.css';
import supabase from '../supabaseClient';
import { Link } from 'react-router-dom';

const Userhotel = () => {
  const [hotels, setHotels] = useState([]);
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});

  useEffect(() => {
    fetchHotels(); // Fetch hotels data when component mounts
  }, []);

  const fetchHotels = async () => {
    try {
      const { data, error } = await supabase.from('hotels').select('*');
      if (error) throw error;
      setHotels(data.map(hotel => ({ ...hotel, editing: false }))); // Add editing state to each hotel
      const indexes = {};
      data.forEach(hotel => {
        indexes[hotel.id] = 0; // Initialize current image index for each hotel
      });
      setCurrentImageIndexes(indexes);
    } catch (error) {
      console.error('Error fetching hotels:', error.message);
    }
  };

  const nextImage = (hotelId) => {
    setCurrentImageIndexes(prevIndexes => ({
      ...prevIndexes,
      [hotelId]: (prevIndexes[hotelId] + 1) % hotels.find(hotel => hotel.id === hotelId).image_urls.length
    }));
  };

  const prevImage = (hotelId) => {
    setCurrentImageIndexes(prevIndexes => ({
      ...prevIndexes,
      [hotelId]: (prevIndexes[hotelId] - 1 + hotels.find(hotel => hotel.id === hotelId).image_urls.length) % hotels.find(hotel => hotel.id === hotelId).image_urls.length
    }));
  };

  const handleEditToggle = (hotelId) => {
    setHotels(prevHotels =>
      prevHotels.map(hotel =>
        hotel.id === hotelId ? { ...hotel, editing: !hotel.editing } : hotel
      )
    );
  };

  const handleSaveHotel = async (hotelId) => {
    const hotel = hotels.find(h => h.id === hotelId);
    const updatedHotel = { ...hotel };
    delete updatedHotel.editing;

    try {
      const { data, error } = await supabase.from('hotels').update(updatedHotel).eq('id', hotel.id);
      if (error) throw error;
      alert('Hotel updated successfully!');
      setHotels(prevHotels =>
        prevHotels.map(h =>
          h.id === hotelId ? { ...h, editing: false } : h
        )
      );
    } catch (error) {
      console.error('Error updating hotel:', error.message);
      alert('Failed to update hotel. Please try again.');
    }
  };

  const handleDeleteHotel = async (hotel) => {
    if (window.confirm(`Are you sure you want to delete hotel "${hotel.name}"?`)) {
      try {
        const { error } = await supabase.from('hotels').delete().eq('id', hotel.id);
        if (error) throw error;
        alert('Hotel deleted successfully!');
        setHotels(prevHotels => prevHotels.filter(h => h.id !== hotel.id)); // Remove deleted hotel from state
      } catch (error) {
        console.error('Error deleting hotel:', error.message);
        alert('Failed to delete hotel. Please try again.');
      }
    }
  };

  const handleInputChange = (hotelId, field, value) => {
    // Validate input for stars field to accept only 1, 2, 3, 4, or 5
    if (field === 'stars' && !['1', '2', '3', '4', '5'].includes(value)) {
      alert('Stars should be between 1 and 5.');
      return;
    }

    setHotels(prevHotels =>
      prevHotels.map(hotel =>
        hotel.id === hotelId ? { ...hotel, [field]: value } : hotel
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
          <h2>Lista Hoteluri</h2>
          <div className={styles.hotelList}>
            {hotels.map((hotel) => (
              <div key={hotel.id} className={styles.hotelItem}>
                <div className={styles.imageContainer}>
                  <div className={styles.imageButtons}>
                    {!hotel.editing && (
                      <button className={styles.editButton} onClick={() => handleEditToggle(hotel.id)}>Edit</button>
                    )}
                    {hotel.editing && (
                      <button className={styles.saveButton} onClick={() => handleSaveHotel(hotel.id)}>Save</button>
                    )}
                    <button className={styles.deleteButton} onClick={() => handleDeleteHotel(hotel)}>Delete</button>
                  </div>
                  {hotel.image_urls.length > 0 && (
                    <div className={styles.carousel}>
                      <button className={styles.prevButton} onClick={() => prevImage(hotel.id)}>&#8249;</button>
                      <img
                        src={hotel.image_urls[currentImageIndexes[hotel.id]]}
                        alt={`Image ${currentImageIndexes[hotel.id] + 1}`}
                        className={styles.hotelImage}
                      />
                      <button className={styles.nextButton} onClick={() => nextImage(hotel.id)}>&#8250;</button>
                    </div>
                  )}
                </div>
                <div className={styles.hotelDetails}>
                  {!hotel.editing && (
                    <>
                      <h3>{hotel.name}</h3>
                      <p>Description: {hotel.description}</p>
                      <p>Stars: {hotel.stars}</p>
                      <p>Address: {hotel.address}</p>
                      <p>Valid from: {hotel.valid_from}</p>
                      <p>Valid to: {hotel.valid_to}</p>
                      <p>Price per adult: {hotel.price_per_adult}</p>
                    </>
                  )}
                  {hotel.editing && (
                    <>
                      <div className={styles.formGroup}>
                        <label>Nume Hotel</label>
                        <input type="text" value={hotel.name} onChange={(e) => handleInputChange(hotel.id, 'name', e.target.value)} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Descriere</label>
                        <textarea value={hotel.description} onChange={(e) => handleInputChange(hotel.id, 'description', e.target.value)} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Număr de stele</label>
                        <input type="number" value={hotel.stars} onChange={(e) => handleInputChange(hotel.id, 'stars', e.target.value)} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Adresă</label>
                        <input type="text" value={hotel.address} onChange={(e) => handleInputChange(hotel.id, 'address', e.target.value)} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Valabilitate de la</label>
                        <input type="date" value={hotel.valid_from} onChange={(e) => handleInputChange(hotel.id, 'valid_from', e.target.value)} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Valabilitate până la</label>
                        <input type="date" value={hotel.valid_to} onChange={(e) => handleInputChange(hotel.id, 'valid_to', e.target.value)} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Preț pe adult</label>
                        <input type="number" value={hotel.price_per_adult} onChange={(e) => handleInputChange(hotel.id, 'price_per_adult', e.target.value)} />
                      </div>
                    </>
                  )}
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

export default Userhotel;
