import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import Acasa from './Acasa';
import Hoteluri from './Hoteluri';
import Zboruri from './Zboruri';
import InchirieriAuto from './InchirieriAuto';
import Oferte from './Oferte';
import Contact from './Contact';
import Meniusus from './Meniusus';
import Login from './Login';
import Inregistrare from './Inregistrare';
import ResetareParola from './ResetareParola';
import Updateparola from './Updateparola';
import Adminhoteluri from './backendadmin/Adminhoteluri';
import Adminzboruri from './backendadmin/Adminzboruri';
import Adminmasini from './backendadmin/Adminmasini';
import Adminoferte from './backendadmin/Adminoferte';
import Admineditarehotel from './backendadmin/Admineditarehotel';
import Admineditarezbor from './backendadmin/Admineditarezbor';
import Admineditaremasini from './backendadmin/Admineditaremasini';
import Admineditareoferte from './backendadmin/Admineditareoferte';
import Admineditarecontact from './backendadmin/Admineditarecontact';
import Usermasina from './backenduser/Usermasina';
import Userhotel from './backenduser/Userhotel';
import Userzbor from './backenduser/Userzbor';
import Useroferte from './backenduser/Useroferte';
import HotelDetails from './detalii/HotelDetails';
import FlightDetails from './detalii/FlightDetails';
import DetaliiOferta from './detalii/DetaliiOferta';
import supabase from './supabaseClient';
import Admineditarerecenzii from './backendadmin/Admineditarerecenzii';



const supabaseUrl = "https://knqwydabuhbuhyalanms.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;



function App() {
  return (
    <Router>
      
      <Routes>
        
      <Route path="/" element={<Acasa/>} />
        <Route path="/Acasa" element={<Acasa />} />
        <Route path="/Hoteluri" element={<Hoteluri />} />
        <Route path="/Zboruri" element={<Zboruri />} />
        <Route path="/InchirieriAuto" element={<InchirieriAuto />} />
        <Route path="/Oferte" element={<Oferte />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Inregistrare" element={<Inregistrare />} />
        <Route path="/ResetareParola" element={<ResetareParola />} />
        <Route path="/Updateparola" element={<Updateparola />} />
        <Route path="/Adminhoteluri" element={<Adminhoteluri />} />
        <Route path="/Adminmasini" element={<Adminmasini />} />
        <Route path="/Adminoferte" element={<Adminoferte />} />
        <Route path="/Adminzboruri" element={<Adminzboruri />} />
        <Route path="/Admineditarehotel" element={<Admineditarehotel />} />
        <Route path="/Admineditarezbor" element={<Admineditarezbor />} />
        <Route path="/Admineditaremasini" element={<Admineditaremasini />} />
        <Route path="/Admineditareoferte" element={<Admineditareoferte />} />
        <Route path="/Admineditarecontact" element={<Admineditarecontact />} />
        <Route path="/Admineditarerecenzii" element={<Admineditarerecenzii />} />
        <Route path="/Useroferte" element={<Useroferte />} />
        <Route path="/Usermasina" element={<Usermasina />} />
        <Route path="/Userzbor" element={<Userzbor/>} />
        <Route path="/Userhotel" element={<Userhotel/>} />
        <Route path="/hotel/:id" element={<HotelDetails />} />
        <Route path="/flight/:id" element={<FlightDetails />} />
        <Route path="/oferta/:id" element={<DetaliiOferta />} />

      
        <Route path="/supabaseClient" element={<supabase />} />
     
      
      </Routes>
     
    </Router>
    
    
  );
}
export default App;
