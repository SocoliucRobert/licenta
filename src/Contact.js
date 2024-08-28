import React, { useState } from 'react';
import supabase from './supabaseClient'; // Import your Supabase client
import styles from './contact.module.css';
import Meniusus from './Meniusus';
import imagineMare from './poze/imagineMare.png';  
import Meniujos from './Meniujos';
import numeIcon from './poze/nume.png';
import emailIcon from './poze/email.png';
import telefonIcon from './poze/telefon.png';
import mesajIcon from './poze/mesaj.png';
import ChatGpt from './ChatGpt';

const Contact = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    message: ''
  });

  const [submissionMessage, setSubmissionMessage] = useState('');
  const [invalidFields, setInvalidFields] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   
    const sanitizeInput = (input) => {
      return input.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
        switch (char) {
          case "\0":
            return "\\0";
          case "\x08":
            return "\\b";
          case "\x09":
            return "\\t";
          case "\x1a":
            return "\\z";
          case "\n":
            return "\\n";
          case "\r":
            return "\\r";
          case "\"":
          case "'":
          case "\\":
          case "%":
            return "\\" + char; 
        }
      });
    };

    const sanitizedFormData = {
      first_name: sanitizeInput(formData.first_name),
      last_name: sanitizeInput(formData.last_name),
      email: sanitizeInput(formData.email),
      phone_number: sanitizeInput(formData.phone_number),
      message: sanitizeInput(formData.message)
    };

    const invalid = [];
    if (!sanitizedFormData.first_name.trim()) invalid.push('first_name');
    if (!sanitizedFormData.last_name.trim()) invalid.push('last_name');
    if (!sanitizedFormData.email.includes('@')) invalid.push('email');
    if (sanitizedFormData.phone_number.replace(/\D/g, '').length !== 10) invalid.push('phone_number');
    if (!sanitizedFormData.message.trim()) invalid.push('message');

    if (invalid.length > 0) {
      setInvalidFields(invalid);
      setSubmissionMessage('Completează toate spațiile corect');
      return;
    }

    const { data, error } = await supabase
      .from('contactform')
      .insert([
        {
          first_name: sanitizedFormData.first_name,
          last_name: sanitizedFormData.last_name,
          email: sanitizedFormData.email,
          phone_number: sanitizedFormData.phone_number,
          message: sanitizedFormData.message
        }
      ]);

    if (error) {
      setSubmissionMessage('A apărut o eroare. Vă rugăm să încercați din nou.');
      console.error('Error:', error);
    } else {
      setSubmissionMessage('Mesajul a fost trimis cu succes');
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        message: ''
      });
      setInvalidFields([]);
    }
  };
  return (
    <div>
      <Meniusus />
      <ChatGpt/>
      <div className={styles.contactTextBottom}>Contactează-ne</div>
      <div className={styles.formContainer}>
        <form className={styles.contactForm} onSubmit={handleSubmit}>
          <div className={`${styles.formGroup} ${invalidFields.includes('first_name') && styles.invalid}`}>
            <label htmlFor="first_name">Nume</label>
            <div className={styles.inputWithIcon}>
              <img src={numeIcon} alt="Nume Icon" className={styles.inputIcon} />
              <input 
                type="text1" 
                id="first_name" 
                name="first_name" 
                placeholder="Nume" 
                value={formData.first_name} 
                onChange={handleChange} 
              />
            </div>
          </div>
          <div className={`${styles.formGroup} ${invalidFields.includes('last_name') && styles.invalid}`}>
            <label htmlFor="last_name">Prenume</label>
            <div className={styles.inputWithIcon}>
              <img src={numeIcon} alt="Prenume Icon" className={styles.inputIcon} />
              <input 
                type="text1" 
                id="last_name" 
                name="last_name" 
                placeholder="Prenume" 
                value={formData.last_name} 
                onChange={handleChange} 
              />
            </div>
          </div>
          <div className={`${styles.formGroup} ${invalidFields.includes('email') && styles.invalid}`}>
            <label htmlFor="email">Email</label>
            <div className={styles.inputWithIcon}>
              <img src={emailIcon} alt="Email Icon" className={styles.inputIcon} />
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="Email" 
                value={formData.email} 
                onChange={handleChange} 
              />
            </div>
          </div>
          <div className={`${styles.formGroup} ${invalidFields.includes('phone_number') && styles.invalid}`}>
            <label htmlFor="phone_number">Număr de telefon</label>
            <div className={styles.inputWithIcon}>
              <img src={telefonIcon} alt="Telefon Icon" className={styles.inputIcon} />
              <input 
                type="tel" 
                id="phone_number" 
                name="phone_number" 
                placeholder="Numar de telefon" 
                value={formData.phone_number} 
                onChange={handleChange} 
              />
            </div>
          </div>
          <div className={`${styles.formGroup} ${invalidFields.includes('message') && styles.invalid}`}>
            <label htmlFor="message">Mesaj</label>
            <div className={styles.inputWithIcon}>
              <img src={mesajIcon} alt="Email Icon" className={styles.inputIcon} />
              <textarea 
                id="message" 
                name="message" 
                rows="4" 
                placeholder="Mesaj" 
                value={formData.message} 
                onChange={handleChange} 
              />
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.submitButton1}>Trimite</button>
          </div>
         
          {submissionMessage && <div className={styles.trimiteMesaj}>{submissionMessage}</div>}
        </form>
      </div>
      <Meniujos/>
    </div>
  );
};

export default Contact;
