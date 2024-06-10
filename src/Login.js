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

  const handleLogin = async (e) => {
    e.preventDefault(); 
  
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        throw error;
      }
  
      if (data) {
        
        console.log('User and session data:', { data });
        navigate('/Acasa');
       
        localStorage.setItem('session', JSON.stringify(data.session)); // pentru tinere minte login
      } else {
        console.error('Login failed: User or session data missing.');
        setError('Login failed. Please check your credentials and try again.');
        setLoginMessage('Logare eșuată. Verifică datele de autentificare și încearcă din nou.');
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
