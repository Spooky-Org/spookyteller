import React from 'react';
import { FaHome, FaSearch, FaHeart, FaUser } from 'react-icons/fa'; // Import icons from a library like Font Awesome
import './Footer.css'; // Import your custom styles

interface FooterProps {
  //
}

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer>
      <nav>
        <button>
          <FaHome />
          <span>Home</span>
        </button>
        <button>
          <FaSearch />
          <span>Search</span>
        </button>
        <button>
          <FaHeart />
          <span>Favorites</span>
        </button>
        <button>
          <FaUser />
          <span>Profile</span>
        </button>
      </nav>
    </footer>
  );
};

export default Footer;
