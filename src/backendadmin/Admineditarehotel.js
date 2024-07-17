import React, { useEffect, useState } from 'react';
import { Link, Redirect, useNavigate } from 'react-router-dom';
import Meniusus from '../Meniusus';
import Meniujos from '../Meniujos';
import styles from './admineditarehotel.module.css';
import supabase from '../supabaseClient';

const Admineditarehotel = () => {
  const [hotels, setHotels] = useState([]);
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  const [userEmail, setUserEmail] = useState('');
  const [authenticated, setAuthenticated] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication(); 
    fetchHotels(); 
  }, []);

  const checkAuthentication = () => {
    const session = localStorage.getItem('session');
    if (session) {
      try {
        const parsedSession = JSON.parse(session);
        const userEmail = parsedSession.user?.email;
        if (userEmail === 'traveladdictionsuport@gmail.com') {
          setUserEmail(userEmail);
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

  const fetchHotels = async () => {
    try {
      const { data, error } = await supabase.from('hotels').select('*');
      if (error) throw error;
      setHotels(data.map(hotel => ({ ...hotel, editing: false }))); 
      const indexes = {};
      data.forEach(hotel => {
        indexes[hotel.id] = 0; 
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
      alert('Hotel actualizat cu succes!');
      setHotels(prevHotels =>
        prevHotels.map(h =>
          h.id === hotelId ? { ...h, editing: false } : h
        )
      );
    } catch (error) {
      console.error('Error updating hotel:', error.message);
      alert('Eroare la actualizarea hotelului');
    }
  };

  const handleDeleteHotel = async (hotel) => {
    if (window.confirm(`Are you sure you want to delete hotel "${hotel.name}"?`)) {
      try {
        const { error } = await supabase.from('hotels').delete().eq('id', hotel.id);
        if (error) throw error;
        alert('Hotel șters cu succes!');
        setHotels(prevHotels => prevHotels.filter(h => h.id !== hotel.id)); 
      } catch (error) {
        console.error('Error deleting hotel:', error.message);
        alert('Eroare la ștergerea hotelului');
      }
    }
  };

  const handleInputChange = (hotelId, field, value) => {
    
    if (field === 'stars' && !['1', '2', '3', '4', '5'].includes(value)) {
      alert('Numărul de stele trebuie să fie între 1 și 5');
      return;
    }

    setHotels(prevHotels =>
      prevHotels.map(hotel =>
        hotel.id === hotelId ? { ...hotel, [field]: value } : hotel
      )
    );
  };

  if (!authenticated) {
    return <redirect to="/Login" />;
  }

  return (
    <div className={styles.adminContainer}>
      <Meniusus />

      <div className={styles.mainArea}>
        <div className={styles.leftSidebar}>
          <div className={styles.menu}>
            <div className={styles.menuHeader}>Panou Admin</div>
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
                      <p>Descriere: {hotel.description}</p>
                      <p>Număr de stele: {hotel.stars}</p>
                      <p>Adresă: {hotel.address}</p>
                      <p>Valid de la: {hotel.valid_from}</p>
                      <p>Până la: {hotel.valid_to}</p>
                      <p>Preț pe persoană: {hotel.price_per_adult}</p>
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
                        <label>Preț pe persoană</label>
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

export default Admineditarehotel;
