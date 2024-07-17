import React from 'react';
import { Link } from 'react-router-dom';
import styles from './inregistrare.module.css';
import Meniusus from './Meniusus';
import Meniujos from './Meniujos';

import imagineMare from './poze/imagineMare.png';
import facebookIcon from './poze/facebooklogin.png'; 
import googleIcon from './poze/googlelogin.png'; 
import { useNavigate } from 'react-router-dom';
import supabase from './supabaseClient';
import { useState } from 'react';

const Inregistrare = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google'
      });
  
      if (error) {
        console.error('Google Login Error:', error);
        throw error;
      }
  
      if (data) {
        console.log('Google Login Session:', data.session);
        navigate('/Acasa');
        localStorage.setItem('session', JSON.stringify(data.session));
      } else {
        console.log('Google Login Failed: No valid session data received');
      }
    } catch (error) {
      console.error('Exception in Google Login:', error.message);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const {data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook'
      });

      if (error) {
        throw error;
      }

      if (data) {
        navigate('/Acasa');
        localStorage.setItem('session', JSON.stringify(data.session)); 
        
      }
    } catch (error) {
      console.error('Error logging in with Facebook:', error.message);
    }
  };


  const handleSignUp = async (event) => {
    event.preventDefault();
    try {
      const {error } = await supabase.auth.signUp({
        email: email,
        password: password
      });

      if (error) {
        throw error;
      }

      setConfirmationMessage('A fost trimis un email de confirmare la adresa data');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Error during signup:', error.message);
      setConfirmationMessage('A fost trimis un email de confirmare la adresa data');
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div>
      <Meniusus />
     
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSignUp}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Adresă de e-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Parolă</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <button type="submit6">Inregistrare</button>
          </div>
          {confirmationMessage && (
            <div className={styles.confirmationMessage}>
              {confirmationMessage}
            </div>
          )}
          <div className={styles.socialLogin}>
            
          </div>
        </form>
        <div className={styles.footer}>
          <span><Link to="/Login">Ai deja cont? Intră in cont</Link></span>
        </div>
      </div>
      <Meniujos />
    </div>
  );
};

export default Inregistrare;