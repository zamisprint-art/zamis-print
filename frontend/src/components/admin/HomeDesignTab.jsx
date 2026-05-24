import { useState } from 'react';
import SliderTab from './SliderTab';
import SectionsTab from './SectionsTab';
import CategoryLinksTab from './CategoryLinksTab';

const HomeDesignTab = () => {
  const [activeSubTab, setActiveSubTab] = useState('slider');

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-neutral-900">Diseño y Apariencia del Home</h2>
      
      {/* Sub tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-neutral-200 pb-2">
        <button 
          onClick={() => setActiveSubTab('slider')}
          className={`px-4 py-2 rounded-lg font-bold transition-colors ${activeSubTab === 'slider' ? 'bg-brand-50 text-brand-600' : 'text-neutral-500 hover:bg-neutral-100'}`}
        >
          Banner Principal (Slider)
        </button>
        <button 
          onClick={() => setActiveSubTab('quicklinks')}
          className={`px-4 py-2 rounded-lg font-bold transition-colors ${activeSubTab === 'quicklinks' ? 'bg-brand-50 text-brand-600' : 'text-neutral-500 hover:bg-neutral-100'}`}
        >
          Accesos Rápidos (Categorías)
        </button>
        <button 
          onClick={() => setActiveSubTab('sections')}
          className={`px-4 py-2 rounded-lg font-bold transition-colors ${activeSubTab === 'sections' ? 'bg-brand-50 text-brand-600' : 'text-neutral-500 hover:bg-neutral-100'}`}
        >
          Secciones Dinámicas
        </button>
      </div>

      {activeSubTab === 'slider' && <SliderTab />}
      {activeSubTab === 'quicklinks' && <CategoryLinksTab />}
      {activeSubTab === 'sections' && <SectionsTab />}
    </div>
  );
};

export default HomeDesignTab;
