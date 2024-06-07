import React from 'react';
import styles from './acasa.module.css';
import Meniusus from './Meniusus';
import Meniujos from './Meniujos';
import ChatGpt from './ChatGpt';
const Acasa = () => {
  return (
    <div>
      <Meniusus />
     <ChatGpt></ChatGpt>
      <Meniujos/>
    </div>
  );
};

export default Acasa;
