import React, { useEffect, useState } from 'react';
import { Link, Redirect, useNavigate } from 'react-router-dom';
import Meniusus from '../Meniusus';
import Meniujos from '../Meniujos';
import styles from './user.module.css'; 
import supabase from '../supabaseClient';

const User = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    id: null,
    nume: '',
    adresa_email: '',
    numar_telefon: '',
    data_nasterii: '',
    nationalitate: '',
    adresa: '',
    cnp: ''
  });
  const [authenticated, setAuthenticated] = useState(false);
  const [editing, setEditing] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchUserData();
    }
  }, [authenticated]);

  const checkAuthentication = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      setAuthenticated(false);
      navigate('/Login');
      return;
    }
    
    const user = session.user;
    const userEmail = user?.email;

    if (userEmail) {
      setUserEmail(userEmail);
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
      navigate('/Login');
    }
  };

  

  const fetchUserData = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();

    const user = session.user;
    const userEmail = user?.email;

    const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('adresa_email', user.email)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error fetching user from database:', fetchError.message);
    throw fetchError;
  }

  // If the user does not exist, insert the user email into the users table
  if (!existingUser) {
    const { error: insertError } = await supabase
      .from('users')
      .insert({ adresa_email: user.email });

    if (insertError) {
      console.error('Error inserting user into database:', insertError.message);
    }
  }
  
    
      try {
        
        if (userEmail) {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('adresa_email', userEmail)
            .single();

          if (error) throw error;

          if (data) {
            setUserData(data);
          } else {
            console.error('User data not found');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    
  };

  const handleEditToggle = () => {
    setEditing((prevEditing) => !prevEditing);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          nume: userData.nume,
          numar_telefon: userData.numar_telefon,
          data_nasterii: userData.data_nasterii,
          nationalitate: userData.nationalitate,
          adresa: userData.adresa,
          cnp: userData.cnp
        })
        .eq('id', userData.id);

      if (error) throw error;

      console.log('User data updated successfully:', data);
      setEditing(false); 
    } catch (error) {
      console.error('Error updating user data:', error.message);
    }
  };

  if (!authenticated) {
    return <redirect to="/Login" />;
  }

  return (
    <div className={styles.adminContainer}>
      <Meniusus />

      <div className={styles.mainArea}>
        <div className={styles.leftSidebar}>
          <div className={styles.menu}>
            <div className={styles.menuHeader}>Panou utilizator</div>
            <ul>
            <li><Link to="/User">PROFIL</Link></li>
              <li><Link to="/Userhotel">USER HOTELURI</Link></li>
              <li><Link to="/Userzbor">USER ZBORURI</Link></li>
              <li><Link to="/Usermasina">USER MAȘINI</Link></li>
              <li><Link to="/Useroferte">USER OFERTE</Link></li>
            
            </ul>
          </div>
        </div>

        <div className={styles.content}>
          <h2>Profilul utilizatorului</h2>
          {!editing && (
            <div className={styles.userData}>
              <p><strong>Nume:</strong> {userData.nume}</p>
              <p><strong>Adresă email:</strong> {userData.adresa_email}</p>
              <p><strong>Număr de telefon:</strong> {userData.numar_telefon}</p>
              <p><strong>Data nașterii:</strong> {userData.data_nasterii}</p>
              <p><strong>Naționalitate:</strong> {userData.nationalitate}</p>
              <p><strong>Adresă:</strong> {userData.adresa}</p>
              <p><strong>CNP:</strong> {userData.cnp}</p>
              <button className={styles.editButton} onClick={handleEditToggle}>Editare</button>
            </div>
          )}
          {editing && (
            <form className={styles.userForm} onSubmit={handleFormSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="nume">Nume:</label>
                <input type="text" id="nume" name="nume" value={userData.nume} onChange={handleFormChange} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="numar_telefon">Număr de telefon:</label>
                <input type="text" id="numar_telefon" name="numar_telefon" value={userData.numar_telefon} onChange={handleFormChange} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="data_nasterii">Data nașterii:</label>
                <input type="date" id="data_nasterii" name="data_nasterii" value={userData.data_nasterii} onChange={handleFormChange} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="nationalitate">Naționalitate:</label>
                <input type="text" id="nationalitate" name="nationalitate" value={userData.nationalitate} onChange={handleFormChange} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="adresa">Adresă:</label>
                <input type="text" id="adresa" name="adresa" value={userData.adresa} onChange={handleFormChange} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="cnp">CNP:</label>
                <input type="text" id="cnp" name="cnp" value={userData.cnp} onChange={handleFormChange} />
              </div>
              <div className={styles.formGroup}>
                <button type="submit">Actualizează profilul</button>
              </div>
              <button className={styles.cancelButton} type="button" onClick={handleEditToggle}>Anulează</button>
            </form>
          )}
        </div>
      </div>

      <Meniujos />
    </div>
  );
};

export default User;
