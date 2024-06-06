import React from 'react';
import styles from './contact.module.css';
import Meniusus from './Meniusus';
import imagineMare from './poze/imagineMare.png';  
import Meniujos from './Meniujos';
import numeIcon from './poze/nume.png';
import emailIcon from './poze/email.png';
import telefonIcon from './poze/telefon.png';
import mesajIcon from './poze/mesaj.png';

const Contact = () => {
  return (
    <div>
      <Meniusus />
      <div className={styles.imageContainer}>
        <img src={imagineMare} alt="Big Image" className={styles.bigImage} />
        <div className={styles.contactText}>CONTACT</div>
      </div>
      <div className={styles.contactTextBottom}>Contactează-ne</div>
      <div className={styles.formContainer}>
        <form className={styles.contactForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nume</label>
            <div className={styles.inputWithIcon}>
              <img src={numeIcon} alt="Nume Icon" className={styles.inputIcon} />
              <input type="text" id="name" name="name" placeholder="Nume" />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="surname">Prenume</label>
            <div className={styles.inputWithIcon}>
              <img src={numeIcon} alt="Prenume Icon" className={styles.inputIcon} />
              <input type="text" id="surname" name="surname" placeholder="Prenume" />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <div className={styles.inputWithIcon}>
              <img src={emailIcon} alt="Email Icon" className={styles.inputIcon} />
              <input type="email" id="email" name="email" placeholder="Email" />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phoneNumber">Numar de telefon</label>
            <div className={styles.inputWithIcon}>
              <img src={telefonIcon} alt="Telefon Icon" className={styles.inputIcon} />
              <input type="tel" id="phoneNumber" name="phoneNumber" placeholder="Numar de telefon" />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="message">Mesaj</label>
            <div className={styles.inputWithIcon}>
              <img src={mesajIcon} alt="Email Icon" className={styles.inputIcon} />
              <textarea id="message" name="message" rows="4" placeholder="Mesaj" />
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.submitButton}>Trimite</button>
          </div>
        </form>
      </div>
      <Meniujos/>
    </div>
  );
};

export default Contact;
