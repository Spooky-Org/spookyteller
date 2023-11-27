// components/Layout.js
import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface StoryTellerLayoutProps {
    children: React.ReactNode;
  }

const Layout: React.FC<StoryTellerLayoutProps> = ({ children } ) => {

  const contentStyle = {
    flex: 1,
    padding: '20px'
  };

  return (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
      <Header />
        <div style={contentStyle}>{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
