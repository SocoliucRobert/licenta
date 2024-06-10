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
import Resetareparola from './Resetareparola';
import supabase from './supabaseClient';


const supabaseUrl = "https://knqwydabuhbuhyalanms.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;

function App() {
  return (
    <Router>
      
      <Routes>
      <Route path="/" element={<Acasa />} />
        <Route path="/Acasa" element={<Acasa />} />
        <Route path="/Hoteluri" element={<Hoteluri />} />
        <Route path="/Zboruri" element={<Zboruri />} />
        <Route path="/InchirieriAuto" element={<InchirieriAuto />} />
        <Route path="/Oferte" element={<Oferte />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Inregistrare" element={<Inregistrare />} />
        <Route path="/Resetareparola" element={<Resetareparola />} />
        <Route path="/supabaseClient" element={<supabase />} />

      
      </Routes>
     
    </Router>
    
    
  );
}
export default App;
