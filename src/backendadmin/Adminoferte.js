import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Meniusus from '../Meniusus';
import Meniujos from '../Meniujos';
import styles from './adminhoteluri.module.css';
import supabase from '../supabaseClient';

// Function to convert image file to base64 format
const toBase64 = file =>
  new Promise((resolve, reject) => {
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
    description: '', // New field for description
    offerImage: null,
    offerImagePreview: ''
  });
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    const session = localStorage.getItem('session');
    if (session) {
      try {
        const parsedSession = JSON.parse(session);
        const userEmail = parsedSession.user?.email;
        if (userEmail === 'traveladdictionsuport@gmail.com') {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
          navigate('/Login');
        }
      } catch (error) {
        console.error('Error parsing session JSON:', error);
        setAuthenticated(false);
        navigate('/Login');
      }
    } else {
      setAuthenticated(false);
      navigate('/Login');
    }
  };

  // Handles changes in form inputs
  const handleChange = async e => {
    if (e.target.name === 'offerImage') {
      const selectedImage = e.target.files[0];

      if (selectedImage) {
       
        const base64Image = await toBase64(selectedImage);
        setOferta({
          ...oferta,
          offerImage: selectedImage,
          offerImagePreview: URL.createObjectURL(selectedImage)
        });
      } else {
       
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

  
  const handleSubmit = async event => {
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
        description: oferta.description, 
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
        description: '', 
        offerImage: null,
        offerImagePreview: ''
      });
    } catch (error) {
      console.error('Error:', error.message);
      alert('Eroare la adăugarea ofertei');
    }
  };

  if (!authenticated) {
    return null; 
  }
  return (
    <div className={styles.adminContainer}>
      <Meniusus />

      <div className={styles.mainArea}>
        <div className={styles.leftSidebar}>
          <div className={styles.menu}>
          <div className={styles.menuHeader}>Panou admin</div>
            <ul>
              <li><Link to="/Adminhoteluri">ADĂUGARE HOTEL</Link></li>
              <li><Link to="/Adminzboruri">ADĂUGARE ZBOR</Link></li>
              <li><Link to="/Adminmasini">ADĂUGARE MAȘINĂ</Link></li>
              <li><Link to="/Adminoferte">ADĂUGARE OFERTĂ</Link></li>
              <li><Link to="/Admineditarehotel">EDITARE HOTEL</Link></li>
              <li><Link to="/Admineditarezbor">EDITARE ZBOR</Link></li>
              <li><Link to="/Admineditaremasini">EDITARE MAȘINĂ</Link></li>
              <li><Link to="/Admineditareoferte">EDITARE OFERTĂ</Link></li>
              <li><Link to="/Admineditarecontact">VIZUALIZARE CONTACT</Link></li>
              <li><Link to="/Admineditarerecenzii">VIZUALIZARE RECENZII</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.content}>
          <h2>Adăugare Ofertă</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Destinație</label>
              <input
                type="text"
                name="destination"
                value={oferta.destination}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Număr de persoane</label>
              <input
                type="number"
                name="number_of_persons"
                value={oferta.number_of_persons}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Perioada începere ofertă</label>
              <input
                type="date"
                name="start_period"
                value={oferta.start_period}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Perioada sfârșire</label>
              <input
                type="date"
                name="end_period"
                value={oferta.end_period}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Preț</label>
              <input
                type="number"
                name="price"
                value={oferta.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Descriere</label>
              <textarea
                name="description"
                value={oferta.description}
                onChange={handleChange}
                rows="4"
                required
              ></textarea>
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
