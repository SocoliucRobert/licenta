import React, { useState } from 'react';
import Meniusus from '../Meniusus';
import Meniujos from '../Meniujos';
import styles from './adminhoteluri.module.css';
import supabase from '../supabaseClient'; 

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
    pricePerChild: '',
    images: [],
    imagePreviews: []
  });

  const handleChange = async (e) => {
    if (e.target.name === 'image') {
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
      setHotel({ ...hotel, [e.target.name]: e.target.value });
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
      price_per_child: parseFloat(hotel.pricePerChild),
      image_urls: imageUrls
    };

    try {
      const { data, error } = await supabase.from('hotels').insert([hotelData]);
      if (error) throw error;
      alert('Hotel adaugat cu succes!');
      console.log('Saved data:', data);
      setHotel({
        name: '',
        description: '',
        stars: '',
        address: '',
        validFrom: '',
        validTo: '',
        pricePerAdult: '',
        pricePerChild: '',
        images: [],
        imagePreviews: []
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add hotel. Please try again.');
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
              <input type="number" name="stars" value={hotel.stars} onChange={handleChange} required />
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
              <input type="number" name="pricePerAdult" value={hotel.pricePerAdult} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Preț pe copil</label>
              <input type="number" name="pricePerChild" value={hotel.pricePerChild} onChange={handleChange} required />
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
