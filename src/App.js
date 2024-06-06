import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import Acasa from './Acasa';
import Hoteluri from './Hoteluri';
import Zboruri from './Zboruri';
import InchirieriAuto from './InchirieriAuto';
import Oferte from './Oferte';
import Contact from './Contact';
import Meniusus from './Meniusus';


const supabaseUrl = "https://knqwydabuhbuhyalanms.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Contact />} />
        <Route path="/Acasa" element={<Acasa />} />
        <Route path="/Hoteluri" element={<Hoteluri />} />
        <Route path="/Zboruri" element={<Zboruri />} />
        <Route path="/InchirieriAuto" element={<InchirieriAuto />} />
        <Route path="/Oferte" element={<Oferte />} />
        <Route path="/Contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}
export default App;
