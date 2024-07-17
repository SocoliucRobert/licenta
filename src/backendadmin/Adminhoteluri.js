import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Meniusus from '../Meniusus';
import Meniujos from '../Meniujos';
import styles from './adminhoteluri.module.css';
import supabase from '../supabaseClient'; 
import { Link } from 'react-router-dom';

const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

const Adminhoteluri = () => {
  const [hotel, setHotel] = useState({
    name: '',
    description: '',
    stars: '',
    address: '',
    validFrom: '',
    validTo: '',
    pricePerAdult: '',
    images: [],
    imagePreviews: []
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

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === 'stars') {
      const intValue = parseInt(value, 10);
      if (intValue >= 1 && intValue <= 5) {
        setHotel({ ...hotel, [name]: value });
      }
    } else if (name === 'image') {
      const selectedImages = Array.from(e.target.files);
      const previews = [];
      const base64Images = [];

      for (const image of selectedImages) {
        const base64 = await toBase64(image);
        base64Images.push(base64);
        previews.push(URL.createObjectURL(image));
      }

      setHotel({
        ...hotel,
        images: [...hotel.images, ...selectedImages],
        imagePreviews: [...hotel.imagePreviews, ...previews]
      });
    } else {
      setHotel({ ...hotel, [name]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const imageUrls = await Promise.all(hotel.images.map(async (image) => {
      const base64 = await toBase64(image);
      return base64;
    }));

    const hotelData = {
      name: hotel.name,
      description: hotel.description,
      stars: parseInt(hotel.stars, 10),
      address: hotel.address,
      valid_from: hotel.validFrom,
      valid_to: hotel.validTo,
      price_per_adult: parseFloat(hotel.pricePerAdult),
      image_urls: imageUrls
    };

    try {
      const { data, error } = await supabase.from('hotels').insert([hotelData]);
      if (error) throw error;
      alert('Hotel adăugat cu succes!');
      console.log('Saved data:', data);
      setHotel({
        name: '',
        description: '',
        stars: '',
        address: '',
        validFrom: '',
        validTo: '',
        pricePerAdult: '',
        images: [],
        imagePreviews: []
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add hotel. Please try again.');
    }
  };

  if (!authenticated) {
    return null; // or return a loading spinner, or a "not authorized" message
  }


  return (
    <div className={styles.adminContainer}>
      <Meniusus />

      <div className={styles.mainArea}>
        <div className={styles.leftSidebar}>
          <div className={styles.menu}>
            <div className={styles.menuHeader}>Panou Admin</div>
            <ul>
              <li><Link to="/Adminhoteluri">ADAUGARE HOTEL</Link></li>
              <li><Link to="/Adminzboruri">ADAUGARE ZBOR</Link></li>
              <li><Link to="/Adminmasini">ADAUGARE MASINA</Link></li>
              <li><Link to="/Adminoferte">ADAUGARE OFERTA</Link></li>
              <li><Link to="/Admineditarehotel">EDITARE HOTEL</Link></li>
              <li><Link to="/Admineditarezbor">EDITARE ZBOR</Link></li>
              <li><Link to="/Admineditaremasini">EDITARE MASINA</Link></li>
              <li><Link to="/Admineditareoferte">EDITARE OFERTA</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.content}>
          <h2>Adăugare Hotel</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Nume Hotel</label>
              <input type="text" name="name" value={hotel.name} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Descriere</label>
              <textarea name="description" value={hotel.description} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Număr de stele</label>
              <input
                type="number"
                name="stars"
                value={hotel.stars}
                onChange={handleChange}
                min="1"
                max="5"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Adresă</label>
              <input type="text" name="address" value={hotel.address} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Valabilitate de la</label>
              <input type="date" name="validFrom" value={hotel.validFrom} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Valabilitate până la</label>
              <input type="date" name="validTo" value={hotel.validTo} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Preț pe adult</label>
              <input
                type="number"
                name="pricePerAdult"
                value={hotel.pricePerAdult}
                onChange={handleChange}
                step="0.01"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Imagini</label>
              <input type="file" name="image" onChange={handleChange} multiple />
              <div>
                {hotel.imagePreviews.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    style={{ maxWidth: '300px', height: 'auto', marginTop: '10px' }}
                  />
                ))}
              </div>
            </div>
            <button type="submit">Salvează Hotel</button>
          </form>
        </div>
      </div>

      <Meniujos />
    </div>
  );
};

export default Adminhoteluri;
