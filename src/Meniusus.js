import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './meniusus.module.css';
import baraImage from './poze/bara.png';
import imagelogo from './poze/imagineLogo.png';
import { motion } from 'framer-motion';

const Meniusus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const session = localStorage.getItem('session');
    if (session) {
      try {
        const parsedSession = JSON.parse(session);
        setIsLoggedIn(true);
        setUserEmail(parsedSession.user?.email || '');
        console.log('Session Data:', parsedSession);
      } catch (error) {
        console.error('Error parsing session JSON:', error);
      }
    } else {
      setIsLoggedIn(false);
      setUserEmail('');
    }

    const currentPath = window.location.pathname;
    if ((session && currentPath === '/Login') || (session && currentPath === '/Inregistrare') || (session && currentPath === '/Resetareparola')) {
      navigate('/Acasa');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('session');
    setIsLoggedIn(false);
    setUserEmail('');
    navigate('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
    >
      <div className={styles.topBar}>
        <div className={styles.logoContainer}>
          <img src={imagelogo} alt="Imagine Logo" className={styles.logo} />
          <span className={styles.brand}>TRAVEL ADDICTION</span>
        </div>
        <div className={styles.loginButton}>
          {isLoggedIn ? (
            <div className={styles.loggedInUser}>
              <span className={styles.loggedInText}>Logged in as: {userEmail}</span>
              <button
                type="button"
                onClick={handleLogout}
                className={`${styles.buttonStyle} ${styles.animateButton}`}
              >
                <span className={styles.buttonText}>DELOGARE</span>
              </button>
            </div>
          ) : (
            <Link to="/Login" className={`${styles.buttonStyle} ${styles.animateButton}`}>
              <span className={styles.buttonText}>LOGARE</span>
            </Link>
          )}
        </div>
      </div>
      <div className={styles.header}>
        <img src={baraImage} alt="Travel" className={styles.image} />
        <motion.div className={styles.wordsContainer}>
          <Link to="/Acasa" className={styles.link}><motion.span className={styles.word}>ACASA</motion.span></Link>
          <Link to="/Hoteluri" className={styles.link}><motion.span className={styles.word}>HOTELURI</motion.span></Link>
          <Link to="/Zboruri" className={styles.link}><motion.span className={styles.word}>ZBORURI</motion.span></Link>
          <Link to="/InchirieriAuto" className={styles.link}><motion.span className={styles.word}>INCHIRIERI AUTO</motion.span></Link>
          <Link to="/Oferte" className={styles.link}><motion.span className={styles.word}>OFERTE</motion.span></Link>
          <Link to="/Contact" className={styles.link}><motion.span className={styles.word}>CONTACT</motion.span></Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Meniusus;
