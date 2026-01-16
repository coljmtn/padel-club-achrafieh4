
import React from 'react';
import { Court } from '../types';

interface CourtCardProps {
  court: Court;
  onSelect: () => void;
}

export const CourtCard: React.FC<CourtCardProps> = ({ court, onSelect }) => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col border border-gray-100">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={court.image} 
          alt={court.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            {court.type}
          </span>
        </div>
        <div className="absolute bottom-4 right-4 bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
          7.5-12$ / Pers
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-gray-800 text-lg leading-tight">{court.name}</h3>
          <div className="flex items-center gap-1 text-yellow-500">
            <span className="text-sm font-bold">{court.rating}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
            </svg>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1.5 mb-6">
          {court.features.slice(0, 2).map((feat, i) => (
            <span key={i} className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 border border-gray-100 px-2 py-0.5 rounded">
              {feat}
            </span>
          ))}
        </div>

        <button 
          onClick={onSelect}
          className="w-full bg-gray-900 hover:bg-green-600 text-white py-3 rounded-2xl font-bold transition-all transform active:scale-95 mt-auto"
        >
          Réserver maintenant
        </button>
      </div>
    </div>
  );
};
