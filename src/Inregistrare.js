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
      const { user, session, error } = await supabase.auth.signInWithOAuth({
        provider: 'google'
      });

      if (error) {
        throw error;
      }

      if (user && session) {
        navigate('/Acasa');
      }
    } catch (error) {
      console.error('Error logging in with Google:', error.message);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const { user, session, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook'
      });

      if (error) {
        throw error;
      }

      if (user && session) {
        navigate('/Acasa');
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
      <div className={styles.imageContainer}>
        <img src={imagineMare} alt="Big Image" className={styles.bigImage} />
        <div className={styles.inregistrareText}>ÎNREGISTRARE</div>
      </div>
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
            <div className={styles.socialLoginText}>sau folositi una dintre opțiunile:</div>
            <div className={styles.loginIcons}>
              <img src={googleIcon} alt="Google" className={styles.loginIcon} onClick={handleGoogleLogin} />
              <img src={facebookIcon} alt="Facebook" className={styles.loginIcon} onClick={handleFacebookLogin} />
            </div>
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