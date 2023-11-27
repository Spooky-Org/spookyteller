// components/Header.js
import React from 'react';
import { FaVolumeUp } from 'react-icons/fa'; 

const Header = () => {
  return (
    <header>
        <div style={{display: 'flex', justifyContent: 'flex-end', padding: '10px'}}>
        <FaVolumeUp />
        </div>
    </header>
  );
};

export default Header;
