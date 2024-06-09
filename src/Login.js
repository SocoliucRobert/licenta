import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './login.module.css';
import Meniusus from './Meniusus';
import Meniujos from './Meniujos';
import imagineMare from './poze/imagineMare.png';
import facebookIcon from './poze/facebooklogin.png';
import googleIcon from './poze/googlelogin.png';
import supabase from './supabaseClient';
import { useState } from 'react';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loginMessage, setLoginMessage] = useState('');

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

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the form from submitting normally
  
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      console.log('Login Response:', { data, error });
  
      if (error) {
        throw error;
      }
  
      if (data ) {
        console.log('User and session data:', { data});
        console.log('Navigating to /Acasa');
        navigate('/Acasa');
        console.log(data)
      } else {
        console.error('Login failed: User or session data missing.');
        setError('Login failed. Please check your credentials and try again.');
        setLoginMessage('Logare eșuată. Verifică datele de autentificare și încearcă din nou.');
        console.log(data)
      }
    } catch (error) {
      console.error('Login error:', error.message);
      setError(error.message);
      setLoginMessage('Nume sau parolă greșită');
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
          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Adresă de e-mail</label>
              <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Parolă</label>
              <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <button type="submit5">Logare</button>
            </div>
            {loginMessage && <div className={styles.loginMessage}>{loginMessage}</div>}
          </form>
          <div className={styles.socialLogin}>
            <div className={styles.socialLoginText}>sau folositi una dintre opțiunile:</div>
            <div className={styles.loginIcons}>
              <img src={googleIcon} alt="Google" className={styles.loginIcon} onClick={handleGoogleLogin} />
              <img src={facebookIcon} alt="Facebook" className={styles.loginIcon} onClick={handleFacebookLogin} />
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
