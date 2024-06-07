import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Use useNavigate for React Router v6
import styles from './login.module.css';
import Meniusus from './Meniusus';
import Meniujos from './Meniujos';
import imagineMare from './poze/imagineMare.png';
import facebookIcon from './poze/facebooklogin.png'; 
import googleIcon from './poze/googlelogin.png'; 
import supabase from './supabaseClient'; // Ensure this path is correct

const Login = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleGoogleLogin = async () => {
    try {
      const { user, session, error } = await supabase.auth.signInWithOAuth({
        provider: 'google'
      });

      if (error) {
        throw error;
      }

      // Redirect to the Acasa page upon successful sign-in
      if (user && session) {
        navigate('/Acasa'); // Use useNavigate to redirect
      }
    } catch (error) {
      console.error('Error logging in with Google:', error.message);
    }
  };

  return (
    <div>
      <Meniusus />
      <div className={styles.imageContainer}>
        <img src={imagineMare} alt="Big Image" className={styles.bigImage} />
        <div className={styles.logareText}>LOGARE</div>
      </div>
      <div className={styles.container}>
        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Adresă de e-mail</label>
            <input type="email" id="email" name="email" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Parolă</label>
            <input type="password" id="password" name="password" />
          </div>
          <div className={styles.formGroup}>
            <button type="submit">Logare</button>
          </div>
         
          <div className={styles.socialLogin}>
            <div className={styles.socialLoginText}>sau folositi una dintre opțiunile:</div>
            <div className={styles.loginIcons}>
              <img src={googleIcon} alt="Google" className={styles.loginIcon} onClick={handleGoogleLogin} />
              <img src={facebookIcon} alt="Facebook" className={styles.loginIcon} />
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <span><Link to="/Resetareparola">Ți-ai uitat parola?</Link></span>
          <span><Link to="/Inregistrare">Nu ai cont? Înregistrează-te</Link></span>
        </div>
      </div>
      <Meniujos />
    </div>
  );
};

export default Login;
