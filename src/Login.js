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
import { useEffect } from 'react';


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const session = localStorage.getItem('session');
    const email = localStorage.getItem('userEmail');
    if (session && email) {
      setUserEmail(email);
      navigate('/Acasa');
    }
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/Acasa' },
      });

      if (error) {
        console.error('Google Login Error:', error);
        throw error;
      }

      if (data) {
        console.log('Google Login Success:', data.user.email);
        navigate('/Acasa');
      } else {
        console.error('Google Login Failed: No valid session data received');
      }
    } catch (error) {
      console.error('Exception in Google Login:', error.message);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: { redirectTo: window.location.origin + '/Acasa' },
      });

      if (error) {
        console.error('Facebook Login Error:', error);
        throw error;
      }

      if (data) {
        console.log('Facebook Login Success:', data.user.email);
        navigate('/Acasa');
      } else {
        console.error('Facebook Login Failed: No valid session data received');
      }
    } catch (error) {
      console.error('Exception in Facebook Login:', error.message);
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
        localStorage.setItem('session', JSON.stringify(data.session));
        localStorage.setItem('userEmail', email);
        setUserEmail(email);
        navigate('/Acasa');
      } else {
        console.error('Login failed: User or session data missing.');
        setLoginMessage('Logare eșuată. Verifică datele de autentificare și încearcă din nou.');
      }
    } catch (error) {
      console.error('Login error:', error.message);
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
