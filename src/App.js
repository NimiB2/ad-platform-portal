import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import AdForm from './components/AdForm';
import AdStats from './components/AdStats';
import { getCurrentUser, logoutUser, isDeveloper } from './api';
import AllAdStats from './components/AllAdStats';
import AdminView from './components/AdminView';


function App() {
  // Main state to control which view is displayed
  const [view, setView] = useState('auth'); // auth, dashboard, adForm, adStats
  const [user, setUser] = useState(null);
  const [currentAd, setCurrentAd] = useState(null);
  const [currentAdId, setCurrentAdId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleViewAllStats = () => {
    setView('allAdStats');
  };

  // Check if user is already logged in
  useEffect(() => {
    const savedUser = getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
      // Check if user is a developer
      const developerStatus = localStorage.getItem('isDeveloper') === 'true';
      setIsAdmin(developerStatus);
      setView('dashboard');
    }
  }, []);

  // Handle login
  const handleLogin = (email) => {
    setUser(email);
    // Check if user is a developer
    const developerStatus = localStorage.getItem('isDeveloper') === 'true';
    setIsAdmin(developerStatus);
    setView('dashboard');
  };

  // Handle logout
  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setIsAdmin(false);
    setView('auth');
  };

  // Handle edit ad
  const handleEditAd = (ad) => {
    setCurrentAd(ad);
    setView('adForm');
  };

  // Handle new ad
  const handleNewAd = () => {
    setCurrentAd(null);
    setView('adForm');
  };

  // Handle ad save
  const handleAdSave = () => {
    setView('dashboard');
  };

  // Handle view stats
  const handleViewStats = (adId) => {
    setCurrentAdId(adId);
    setView('adStats');
  };

  return (
    <div className="App">
      <header style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '15px 20px', 
        borderBottom: '1px solid #dee2e6',
        marginBottom: '20px'
      }}>
        <h1 style={{ margin: 0 }}>AdSDK Portal</h1>
        {user && (
          <div style={{ fontSize: '14px', color: '#6c757d', marginTop: '5px' }}>
            Logged in as: {user} {isAdmin ? '(Developer)' : ''}
          </div>
        )}
      </header>

      <main>
        {view === 'auth' && <Auth onLogin={handleLogin} />}
        
        {view === 'dashboard' && (
          <Dashboard 
            onLogout={handleLogout} 
            onEditAd={handleEditAd} 
            onViewStats={handleViewStats}
            onNewAd={handleNewAd}
            onViewAllStats={handleViewAllStats}
            isAdmin={isAdmin}  {/* Pass isAdmin prop explicitly */}
          />
        )}

        {view === 'dashboard' && isAdmin && (
          <AdminView />
        )}     
           
        {view === 'adForm' && (
          <AdForm 
            ad={currentAd} 
            onCancel={() => setView('dashboard')} 
            onSave={handleAdSave} 
          />
        )}
        
        {view === 'adStats' && (
          <AdStats 
            adId={currentAdId} 
            onBack={() => setView('dashboard')} 
          />
        )}

        {view === 'allAdStats' && (
          <AllAdStats 
            onBack={() => setView('dashboard')} 
          />
        )}
      </main>
    </div>
  );
}

export default App;