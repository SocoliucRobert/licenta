import React, { useEffect, useState } from 'react';
import { Link, Redirect, useNavigate } from 'react-router-dom';
import Meniusus from '../Meniusus';
import Meniujos from '../Meniujos';
import styles from './admineditarerecenzii.module.css';
import supabase from '../supabaseClient';

const Admineditarerecenzii = () => {
  const [reviews, setReviews] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication();
    fetchReviews();
  }, []);

  const checkAuthentication = async () => {
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

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase.from('reviews').select('*');
      if (error) throw error;
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error.message);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Sigur vrei să ștergi această recenzie?')) {
      try {
        const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
        if (error) throw error;
        alert('Recenzie ștearsă cu succes !');
        setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));
      } catch (error) {
        console.error('Error deleting review:', error.message);
        alert('Eroare la ștergerea recenziei');
      }
    }
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
              <li><Link to="/Admineditarerecenzii">VIZUALIZARE RECENZII</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.content}>
          <h2>Lista Recenzii</h2>
          <div className={styles.reviewList}>
            {reviews.map((review) => (
              <div key={review.id} className={styles.reviewItem}>
                <div className={styles.reviewDetails}>
                  <h3>{review.user_name}</h3>
                  <p>Hotel ID: {review.hotel_id}</p>
                  <p>Notă: {review.rating}</p>
                  <p>Recenzie: {review.review_text}</p>
                  <p>Data: {new Date(review.created_at).toLocaleDateString()}</p>

                  <div className={styles.buttonContainer}>
                    <button className={styles.deleteButton} onClick={() => handleDeleteReview(review.id)}>Delete</button>
                  </div>
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

export default Admineditarerecenzii;
