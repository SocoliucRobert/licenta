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
import AdminZboruri from './backendadmin/Adminzboruri';
import Adminmasini from './backendadmin/Adminmasini';
import Adminoferte from './backendadmin/Adminoferte';
import Admineditarehotel from './backendadmin/Admineditarehotel';
import Admineditarezbor from './backendadmin/Admineditarezbor';
import Admineditaremasini from './backendadmin/Admineditaremasini';
import Admineditareoferte from './backendadmin/Admineditareoferte';

import supabase from './supabaseClient';


const supabaseUrl = "https://knqwydabuhbuhyalanms.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;



function App() {
  return (
    <Router>
      
      <Routes>
        
      <Route path="/" element={<Admineditarehotel/>} />
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
        <Route path="/Adminzboruri" element={<AdminZboruri />} />
        <Route path="/Admineditarehotel" element={<Admineditarehotel />} />
        <Route path="/Admineditarezbor" element={<Admineditarezbor />} />
        <Route path="/Admineditaremasini" element={<Admineditaremasini />} />
        <Route path="/Admineditareoferte" element={<Admineditareoferte />} />
        

      
        <Route path="/supabaseClient" element={<supabase />} />
     
      
      </Routes>
     
    </Router>
    
    
  );
}
export default App;
