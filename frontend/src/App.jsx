import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Shipments from './components/Shipments';
import Market from './components/Market';
import ChatBox from './components/ChatBox';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inventoryData, setInventoryData] = useState([]);
  const [shipmentsData, setShipmentsData] = useState([]);
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [invRes, shpRes, mktRes] = await Promise.all([
        fetch('/api/inventory'),
        fetch('/api/shipments'),
        fetch('/api/market')
      ]);
      
      const inv = await invRes.json();
      const shp = await shpRes.json();
      const mkt = await mktRes.json();

      setInventoryData(inv);
      setShipmentsData(shp);
      setMarketData(mkt);
      setLoading(false);
    } catch(e) {
      console.error("Error loading data:", e);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="app-container">
      <Header />
      
      <nav className="app-tabs">
        <button className={`tab-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
        <button className={`tab-link ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>Inventory</button>
        <button className={`tab-link ${activeTab === 'shipments' ? 'active' : ''}`} onClick={() => setActiveTab('shipments')}>Shipments</button>
        <button className={`tab-link ${activeTab === 'market' ? 'active' : ''}`} onClick={() => setActiveTab('market')}>Market Intel</button>
        <button className={`tab-link ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>AI Chat</button>
      </nav>

      <main className="app-main">
        {loading ? (
          <div style={{ color: "var(--text-muted)", padding: "24px" }}>Loading Supply Chain Data...</div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              {activeTab === 'dashboard' && (
                <div className="tab-content active">
                  <Dashboard inventoryData={inventoryData} shipmentsData={shipmentsData} marketData={marketData} />
                </div>
              )}

              {activeTab === 'inventory' && (
                <div className="tab-content active">
                  <Inventory inventoryData={inventoryData} updateInventory={(newData) => { setInventoryData(newData); }} />
                </div>
              )}

              {activeTab === 'shipments' && (
                <div className="tab-content active">
                  <Shipments shipmentsData={shipmentsData} />
                </div>
              )}

              {activeTab === 'market' && (
                <div className="tab-content active">
                  <Market marketData={marketData} />
                </div>
              )}

              {activeTab === 'chat' && (
                <div className="tab-content active">
                  <ChatBox />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}

export default App;
