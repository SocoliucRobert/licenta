
import styles from './redbox.module.css';
import blueStyles from './bluebox.module.css';


function App() {
  return (
    <div className="App">
      
    
      <div className={styles["red-box"]}></div>
      <div className={blueStyles["red-box"]}></div>
       
     
    </div>
  );
}

export default App;
