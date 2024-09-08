import React, { useState } from "react";
import styles from "./resetareparola.module.css";
import Meniusus from "./Meniusus";
import Meniujos from "./Meniujos";
import supabase from './supabaseClient'; 

const ResetareParola = () => {
  const [email, setEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [error, setError] = useState('');

  const handleResetRequest = async (event) => {
    event.preventDefault();
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://traveladdiction.go.ro:3000/Updateparola' 
      });

      if (error) {
        throw error;
      }

      setResetMessage('A fost trimis un email de resetare a parolei la adresa data.');
      setEmail(''); 
    } catch (err) {
      console.error('Error during password reset:', err);
      setError(err.message);
      setResetMessage('');
    }
  };

  return (
    <div>
      <Meniusus />
      <div className={styles.container}>
        <div className={styles.form}>
          <form onSubmit={handleResetRequest}>
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
              <button type="submit3">Resetează parola</button>
            </div>
            {resetMessage && <div className={styles.resetMessage}>{resetMessage}</div>}
            {error && <div className={styles.errorMessage}>{error}</div>}
          </form>
        </div>
        <div className={styles.footer}></div>
      </div>
      <Meniujos />
    </div>
  );
};

export default ResetareParola;
