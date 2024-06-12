import React, { useState } from "react";
import styles from "./resetareparola.module.css";
import Meniusus from "./Meniusus";
import Meniujos from "./Meniujos";
import supabase from './supabaseClient'; 

const Updateparola = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setMessage(`A intervenit o eroare la schimbarea parolei: ${error.message}`);
    } else {
      setMessage("Parola schimbata cu succes!");
    }
  };

  return (
    <div>
      <Meniusus />
      <div className={styles.container}>
        <div className={styles.form}>
        
          <form onSubmit={handlePasswordUpdate}>
            <label htmlFor="newPassword">Introduceti parola noua:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit7">Schimba parola</button>
          </form>
          {message && <p>{message}</p>}
        </div>
        <div className={styles.footer}></div>
      </div>
      <Meniujos />
    </div>
  );
};

export default Updateparola;
