import React, { useEffect, useState } from 'react';
import { Link, Redirect, useNavigate } from 'react-router-dom';
import Meniusus from '../Meniusus';
import Meniujos from '../Meniujos';
import styles from './admineditarecontact.module.css';
import supabase from '../supabaseClient';

const Admineditarecontact = () => {
  const [contacts, setContacts] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication();
    fetchContacts();
  }, []);

  const checkAuthentication = async () => {
    const session = localStorage.getItem('session');
    if (session) {
      try {
        const parsedSession = JSON.parse(session);
        const userEmail = parsedSession.user?.email;
        if (userEmail === 'traveladdictionsuport@gmail.com') {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
          navigate('/Login');
        }
      } catch (error) {
        console.error('Error parsing session JSON:', error);
        setAuthenticated(false);
        navigate('/Login');
      }
    } else {
      setAuthenticated(false);
      navigate('/Login');
    }
  };

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase.from('contactform').select('*');
      if (error) throw error;
      setContacts(data.map((contact) => ({ ...contact, editing: false })));
    } catch (error) {
      console.error('Error fetching contacts:', error.message);
    }
  };

  const handleEditToggle = (contactId) => {
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === contactId ? { ...contact, editing: !contact.editing } : contact
      )
    );
  };

  const handleSaveContact = async (contactId) => {
    const contact = contacts.find((c) => c.id === contactId);
    const updatedContact = { ...contact };
    delete updatedContact.editing;

    try {
      const { data, error } = await supabase
        .from('ContactForm')
        .update(updatedContact)
        .eq('id', contact.id);
      if (error) throw error;
      alert('Contact șters cu succes !');
      setContacts((prevContacts) =>
        prevContacts.map((c) => (c.id === contactId ? { ...c, editing: false } : c))
      );
    } catch (error) {
      console.error('Error updating contact:', error.message);
      alert('Eroare la actualizarea contactului !');
    }
  };

  const handleDeleteContact = async (contact) => {
    if (window.confirm(`Sigur vrei să ștergi mesajul de la? "${contact.first_name} ${contact.last_name}"?`)) {
      try {
        const { error } = await supabase.from('ContactForm').delete().eq('id', contact.id);
        if (error) throw error;
        alert('Contact șters cu succes!');
        setContacts((prevContacts) => prevContacts.filter((c) => c.id !== contact.id));
      } catch (error) {
        console.error('Error deleting contact:', error.message);
        alert('Nu s-a putut sterge contactul');
      }
    }
  };

  const handleInputChange = (contactId, field, value) => {
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === contactId ? { ...contact, [field]: value } : contact
      )
    );
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
            <div className={styles.menuHeader}>Panou Admin</div>
            <ul>
              <li><Link to="/Adminhoteluri">ADĂUGARE HOTEL</Link></li>
              <li><Link to="/Adminzboruri">ADĂUGARE ZBOR</Link></li>
              <li><Link to="/Adminmasini">ADĂUGARE MAȘINĂ</Link></li>
              <li><Link to="/Adminoferte">ADĂUGARE OFERTĂ</Link></li>
              <li><Link to="/Admineditarehotel">EDITARE HOTEL</Link></li>
              <li><Link to="/Admineditarezbor">EDITARE ZBOR</Link></li>
              <li><Link to="/Admineditaremasini">EDITARE MAȘINĂ</Link></li>
              <li><Link to="/Admineditareoferte">EDITARE OFERTĂ</Link></li>
              <li><Link to="/Admineditarecontact">VIZUALIZARE CONTACT</Link></li>
              <li><Link to="/Admineditarerecenzii">VIZUALIZARE RECENZII</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.content}>
          <h2>Lista Contacte</h2>
          <div className={styles.contactList}>
            {contacts.map((contact) => (
              <div key={contact.id} className={styles.contactItem}>
                <div className={styles.contactDetails}>
                  {!contact.editing && (
                    <>
                      <h3>{contact.first_name} {contact.last_name}</h3>
                      <p>Email: {contact.email}</p>
                      <p>Phone Number: {contact.phone_number}</p>
                      <p>Message: {contact.message}</p>
                    </>
                  )}
                  {contact.editing && (
                    <>
                      <div className={styles.formGroup}>
                        <label>First Name</label>
                        <input
                          type="text"
                          value={contact.first_name}
                          onChange={(e) =>
                            handleInputChange(contact.id, 'first_name', e.target.value)
                          }
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Last Name</label>
                        <input
                          type="text"
                          value={contact.last_name}
                          onChange={(e) =>
                            handleInputChange(contact.id, 'last_name', e.target.value)
                          }
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Email</label>
                        <input
                          type="email"
                          value={contact.email}
                          onChange={(e) =>
                            handleInputChange(contact.id, 'email', e.target.value)
                          }
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Phone Number</label>
                        <input
                          type="text"
                          value={contact.phone_number}
                          onChange={(e) =>
                            handleInputChange(contact.id, 'phone_number', e.target.value)
                          }
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Message</label>
                        <textarea
                          value={contact.message}
                          onChange={(e) =>
                            handleInputChange(contact.id, 'message', e.target.value)
                          }
                        />
                      </div>
                    </>
                  )}
                  <div className={styles.buttonContainer}>
                  
                    {contact.editing && (
                      <button
                        className={styles.saveButton}
                        onClick={() => handleSaveContact(contact.id)}
                      >
                        Save
                      </button>
                    )}
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteContact(contact)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Meniujos />
    </div>
  );
};

export default Admineditarecontact;
