import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchPage from './pages/SearchPage';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gradient-to-br from-gray-50 to-blue-50/30">
        <SearchPage />
      </main>
      <Footer />
    </div>
  );
}

export default App;

