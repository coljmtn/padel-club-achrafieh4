import React, { useState, useMemo } from 'react';
import { Court, Booking } from '../types';

interface BookingFlowProps {
  court: Court;
  bookings: Booking[];
  onClose: () => void;
  onConfirm: (booking: any) => void;
}

interface Package {
  id: string;
  name: string;
  dayName: string;
  timeRange: string;
  maxPlayers: number;
  description: string;
  pricePerPerson: number;
  targetDay: number; // 4 pour Jeudi, 6 pour Samedi
}

const PACKAGES_CONFIG: Package[] = [
  {
    id: 'thursday-morning',
    name: 'Cours Collectif Jeudi',
    dayName: 'Jeudi',
    timeRange: '10:00 - 11:00',
    maxPlayers: 4,
    description: 'Une session technique limitée à 4 joueurs.',
    pricePerPerson: 7.5,
    targetDay: 4
  },
  {
    id: 'saturday-morning-8p',
    name: 'Match Coaching Samedi',
    dayName: 'Samedi',
    timeRange: '10:30 - 12:00',
    maxPlayers: 8,
    description: 'Session avec tournoi interne et conseils tactiques.',
    pricePerPerson: 12,
    targetDay: 6
  }
];

export const BookingFlow: React.FC<BookingFlowProps> = ({ court, bookings, onClose, onConfirm }) => {
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [userData, setUserData] = useState({ name: '', phone: '' });

  const sessions = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDay(); // 0: Dimanche, 4: Jeudi, 5: Vendredi, 6: Samedi
    const currentHour = now.getHours();

    return PACKAGES_CONFIG.map(pkg => {
      // Calcul du nombre de jours avant la prochaine session
      let daysUntil = (pkg.targetDay - currentDay + 7) % 7;
      
      // LOGIQUE DE CLÔTURE DYNAMIQUE
      // Si la session est AUJOURD'HUI et qu'il est plus de 12h
      // OU si c'est pour Samedi et qu'on est déjà Vendredi après 12h
      let forceNextWeek = false;
      
      if (pkg.targetDay === 6) { // Cas du Samedi
        // Si on est Vendredi après 12h (daysUntil=1) ou Samedi (daysUntil=0)
        if ((currentDay === 5 && currentHour >= 12) || (currentDay === 6)) {
          forceNextWeek = true;
        }
      } else if (daysUntil === 0 && currentHour >= 12) { // Autres jours
        forceNextWeek = true;
      }

      if (forceNextWeek) {
        daysUntil += 7;
      }

      const sessionDate = new Date(now);
      sessionDate.setDate(now.getDate() + daysUntil);
      
      const dateDisplay = sessionDate.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      });

      return { ...pkg, dateDisplay };
    });
  }, []);

  const getRemainingSpots = (dateStr: string, max: number) => {
    // On compare avec les bookings existants en base
    const taken = bookings.filter(b => b.date === dateStr).length;
    return Math.max(0, max - taken);
  };

  const handleConfirm = () => {
    if (!selectedPackage || !userData.name || !userData.phone) return;
    
    const newBooking = {
      court_id: court.id,
      court_name: court.name,
      user_name: userData.name,
      user_phone: userData.phone,
      date: selectedPackage.dateDisplay,
      time: selectedPackage.timeRange,
      total_price: selectedPackage.pricePerPerson,
      status: 'confirmed'
    };
    
    onConfirm(newBooking);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp">
        <div className="p-8 border-b flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-2xl font-black text-gray-800 tracking-tight">{step === 1 ? 'Planning Hebdomadaire' : 'Vos Coordonnées'}</h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Étape {step} sur 2</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors font-bold text-gray-500">✕</button>
        </div>

        <div className="p-8 overflow-y-auto max-h-[70vh]">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="bg-green-50 border-2 border-green-100 p-4 rounded-2xl flex items-center gap-4">
                <span className="text-2xl">📅</span>
                <p className="text-xs text-green-800 font-black uppercase leading-tight">
                  Les réservations pour le samedi ferment chaque vendredi à midi. Les sessions affichées sont les prochaines disponibles.
                </p>
              </div>

              <div className="space-y-4">
                {sessions.map((pkg) => {
                  const spots = getRemainingSpots(pkg.dateDisplay, pkg.maxPlayers);
                  const isFull = spots <= 0;
                  const isSelected = selectedPackage?.id === pkg.id && selectedPackage?.dateDisplay === pkg.dateDisplay;
                  
                  return (
                    <button
                      key={`${pkg.id}-${pkg.dateDisplay}`}
                      disabled={isFull}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`w-full text-left p-6 rounded-3xl border-2 transition-all flex justify-between gap-4 group ${
                        isFull
                        ? 'opacity-40 bg-gray-50 border-gray-100 cursor-not-allowed'
                        : isSelected 
                          ? 'border-green-500 bg-green-50 ring-8 ring-green-500/5 shadow-lg' 
                          : 'border-gray-100 hover:border-gray-300 bg-white hover:shadow-md'
                      }`}
                    >
                      <div className="flex-1">
                        <p className={`text-[10px] font-black uppercase mb-1 ${isSelected ? 'text-green-600' : 'text-gray-400'}`}>
                          {pkg.dateDisplay}
                        </p>
                        <h4 className="text-lg font-bold text-gray-800 group-hover:text-green-600 transition-colors">{pkg.name}</h4>
                        <p className="text-xs text-gray-400 mt-2 font-medium">{pkg.description}</p>
                      </div>
                      <div className="text-right flex flex-col justify-center items-end shrink-0">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full mb-3 tracking-widest ${isFull ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-700'}`}>
                          {isFull ? 'COMPLET' : `${spots} PLACES`}
                        </span>
                        <div className="flex items-baseline gap-0.5">
                           <span className="text-2xl font-black">{pkg.pricePerPerson}</span>
                           <span className="text-xs font-bold">$</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                disabled={!selectedPackage}
                onClick={() => setStep(2)}
                className={`w-full py-5 rounded-3xl font-black text-lg transition-all transform active:scale-95 shadow-xl ${
                  selectedPackage ? 'bg-gray-900 text-white shadow-gray-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Suivant
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-900 text-white p-6 rounded-3xl shadow-2xl mb-8 relative overflow-hidden">
                <div className="relative z-10">
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Résumé de la Session</p>
                   <h4 className="text-xl font-black mb-1">{selectedPackage?.name}</h4>
                   <p className="text-sm font-medium text-green-400 uppercase tracking-tighter">{selectedPackage?.dateDisplay} • {selectedPackage?.timeRange}</p>
                </div>
                <div className="absolute top-0 right-0 p-6 text-4xl opacity-20">🎾</div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-4">Votre Nom</label>
                  <input 
                    type="text" placeholder="Prénom Nom" value={userData.name}
                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white outline-none font-bold transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-4">WhatsApp</label>
                  <input 
                    type="tel" placeholder="+961 XX XXX XXX" value={userData.phone}
                    onChange={(e) => setUserData({...userData, phone: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white outline-none font-bold transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button
                  disabled={!userData.name || !userData.phone}
                  onClick={handleConfirm}
                  className="w-full py-5 rounded-3xl font-black text-lg bg-green-600 text-white shadow-2xl shadow-green-200 transition-all transform active:scale-95"
                >
                  Confirmer ma place ({selectedPackage?.pricePerPerson}$)
                </button>
                <button onClick={() => setStep(1)} className="w-full py-3 font-bold text-gray-400 hover:text-gray-800 transition-colors text-sm uppercase tracking-widest">Modifier la date</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};