import React, { useState } from 'react';
import Meniusus from '../Meniusus';
import Meniujos from '../Meniujos';
import styles from './adminhoteluri.module.css';
import supabase from '../supabaseClient'; // Adjust this path based on your Supabase client configuration

// Function to convert image file to base64 format
const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

const Adminoferte = () => {
  const [oferta, setOferta] = useState({
    destination: '',
    number_of_persons: '',
    start_period: '',
    end_period: '',
    price: '',
    offerImage: null,
    offerImagePreview: ''
  });

  // Handles changes in form inputs
  const handleChange = async (e) => {
    if (e.target.name === 'offerImage') {
      const selectedImage = e.target.files[0];

      if (selectedImage) {
        // Only proceed if a file is actually selected
        const base64Image = await toBase64(selectedImage);
        setOferta({
          ...oferta,
          offerImage: selectedImage,
          offerImagePreview: URL.createObjectURL(selectedImage)
        });
      } else {
        // Clear the image data if no file is selected
        setOferta({
          ...oferta,
          offerImage: null,
          offerImagePreview: ''
        });
      }
    } else {
      setOferta({ ...oferta, [e.target.name]: e.target.value });
    }
  };

  // Handles form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let offerImageUrl = '';
      if (oferta.offerImage) {
        offerImageUrl = await toBase64(oferta.offerImage).catch(error => {
          console.error('Error converting image:', error);
          throw new Error('Failed to convert image.');
        });
      }

      const ofertaData = {
        destination: oferta.destination,
        number_of_persons: parseInt(oferta.number_of_persons, 10),
        start_period: oferta.start_period,
        end_period: oferta.end_period,
        price: parseFloat(oferta.price),
        offer_image_url: offerImageUrl
      };

      const { data, error } = await supabase.from('oferta').insert([ofertaData]);
      if (error) throw error;

      alert('Ofertă adăugată cu succes!');
      console.log('Saved data:', data);

      setOferta({
        destination: '',
        number_of_persons: '',
        start_period: '',
        end_period: '',
        price: '',
        offerImage: null,
        offerImagePreview: ''
      });
    } catch (error) {
      console.error('Error:', error.message);
      alert('Failed to add offer. Please try again.');
    }
  };

  return (
    <div className={styles.adminContainer}>
      <Meniusus />

      <div className={styles.mainArea}>
        <div className={styles.leftSidebar}>
          <div className={styles.menu}>
            <div className={styles.menuHeader}>Panou Admin</div>
            <ul>
              <li><a href="#">ADAUGARE HOTEL</a></li>
              <li><a href="#">ADAUGARE ZBOR</a></li>
              <li><a href="#">ADAUGARE MASINA</a></li>
              <li><a href="#">ADAUGARE OFERTA</a></li>
              <li><a href="#">EDITARE HOTEL</a></li>
              <li><a href="#">EDITARE ZBOR</a></li>
              <li><a href="#">EDITARE MASINA</a></li>
              <li><a href="#">EDITARE OFERTA</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.content}>
          <h2>Adăugare Ofertă</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Destinație</label>
              <input type="text" name="destination" value={oferta.destination} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Număr de persoane</label>
              <input type="number" name="number_of_persons" value={oferta.number_of_persons} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Perioada începere ofertă</label>
              <input type="date" name="start_period" value={oferta.start_period} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Perioada sfârșire</label>
              <input type="date" name="end_period" value={oferta.end_period} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Preț</label>
              <input type="number" name="price" value={oferta.price} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Imagine ofertă</label>
              <input type="file" name="offerImage" onChange={handleChange} />
              {oferta.offerImagePreview && (
                <img
                  src={oferta.offerImagePreview}
                  alt="Preview"
                  style={{ maxWidth: '300px', height: 'auto', marginTop: '10px' }}
                />
              )}
            </div>
            <button type="submit">Salvează Ofertă</button>
          </form>
        </div>
      </div>

      <Meniujos />
    </div>
  );
};

export default Adminoferte;
