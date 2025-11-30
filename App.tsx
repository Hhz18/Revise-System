import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { AddSystemModal } from './components/AddSystemModal';
import { VocabularySystem } from './pages/VocabularySystem';
import { AlgorithmSystem } from './pages/AlgorithmSystem';
import { GenericSystem } from './pages/GenericSystem';
import { AppState, SystemType, SystemConfig, GenericItem } from './types';
import { SYSTEM_CONFIG } from './constants';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  // UI State
  const [activeSystemId, setActiveSystemId] = useState<string>(SystemType.VOCABULARY);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddSystemModalOpen, setAddSystemModalOpen] = useState(false);

  // Data State
  const [vocabulary, setVocabulary] = useState<AppState['vocabulary']>([]);
  const [algorithms, setAlgorithms] = useState<AppState['algorithms']>([]);
  const [daily, setDaily] = useState<AppState['daily']>([]);
  const [reading, setReading] = useState<AppState['reading']>([]);
  const [mindset, setMindset] = useState<AppState['mindset']>([]);
  
  // Custom Systems State
  const [customSystemsConfig, setCustomSystemsConfig] = useState<SystemConfig[]>([]);
  const [customData, setCustomData] = useState<Record<string, GenericItem[]>>({});

  // Combine Default and Custom Systems for Sidebar
  const allSystems = useMemo(() => {
    const defaultSystems = Object.values(SYSTEM_CONFIG);
    return [...defaultSystems, ...customSystemsConfig];
  }, [customSystemsConfig]);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('correction-loop-data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.vocabulary) setVocabulary(data.vocabulary);
        if (data.algorithms) setAlgorithms(data.algorithms);
        if (data.daily) setDaily(data.daily);
        if (data.reading) setReading(data.reading);
        if (data.mindset) setMindset(data.mindset);
        if (data.customSystemsConfig) setCustomSystemsConfig(data.customSystemsConfig);
        if (data.customData) setCustomData(data.customData);
      } catch (e) {
        console.error("Failed to load saved data");
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    const data = { 
      vocabulary, algorithms, daily, reading, mindset, 
      customSystemsConfig, customData 
    };
    localStorage.setItem('correction-loop-data', JSON.stringify(data));
  }, [vocabulary, algorithms, daily, reading, mindset, customSystemsConfig, customData]);

  // Add Custom System Logic
  const handleAddSystem = (config: Omit<SystemConfig, 'id'>) => {
    const newId = `CUSTOM_${Date.now()}`;
    const newSystem: SystemConfig = { ...config, id: newId };
    
    setCustomSystemsConfig(prev => [...prev, newSystem]);
    setCustomData(prev => ({ ...prev, [newId]: [] }));
    setActiveSystemId(newId);
  };

  // Delete Custom System Logic
  const handleDeleteSystem = (id: string) => {
    setCustomSystemsConfig(prev => prev.filter(sys => sys.id !== id));
    setCustomData(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    // If the deleted system was active, switch back to default
    if (activeSystemId === id) {
      setActiveSystemId(SystemType.VOCABULARY);
    }
  };

  // Helper to update custom data
  const updateCustomData = (id: string, items: GenericItem[]) => {
    setCustomData(prev => ({ ...prev, [id]: items }));
  };

  const renderContent = () => {
    // 1. Check Default Systems
    switch (activeSystemId) {
      case SystemType.VOCABULARY:
        return <VocabularySystem items={vocabulary} setItems={setVocabulary} />;
      case SystemType.ALGORITHM:
        return <AlgorithmSystem items={algorithms} setItems={setAlgorithms} />;
      case SystemType.DAILY:
        return <GenericSystem config={SYSTEM_CONFIG[SystemType.DAILY]} items={daily} setItems={setDaily} />;
      case SystemType.READING:
        return <GenericSystem config={SYSTEM_CONFIG[SystemType.READING]} items={reading} setItems={setReading} />;
      case SystemType.MINDSET:
        return <GenericSystem config={SYSTEM_CONFIG[SystemType.MINDSET]} items={mindset} setItems={setMindset} />;
    }

    // 2. Check Custom Systems
    const customConfig = customSystemsConfig.find(sys => sys.id === activeSystemId);
    if (customConfig) {
      return (
        <GenericSystem 
          key={customConfig.id} // Re-mount when switching systems
          config={customConfig} 
          items={customData[customConfig.id] || []} 
          setItems={(items) => updateCustomData(customConfig.id, items)}
          onDeleteSystem={() => handleDeleteSystem(customConfig.id)}
        />
      );
    }

    return <div>Select a system</div>;
  };

  return (
    <div className="flex h-screen bg-[#f8f9fa] overflow-hidden text-slate-800">
      <Sidebar 
        systems={allSystems}
        activeSystem={activeSystemId} 
        onSelect={setActiveSystemId} 
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onAddSystem={() => setAddSystemModalOpen(true)}
        onDeleteSystem={handleDeleteSystem}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center p-4 bg-white border-b-2 border-black z-10">
          <button onClick={() => setSidebarOpen(true)} className="p-2">
            <Menu size={24} />
          </button>
          <span className="ml-4 font-hand font-bold text-xl">Correction Loop</span>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-20">
          <div className="max-w-6xl mx-auto animate-fade-in">
            {renderContent()}
          </div>
        </div>
      </main>

      <AddSystemModal 
        isOpen={isAddSystemModalOpen}
        onClose={() => setAddSystemModalOpen(false)}
        onAdd={handleAddSystem}
      />
    </div>
  );
};

export default App;