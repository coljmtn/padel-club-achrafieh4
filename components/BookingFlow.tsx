
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

  // Calcul dynamique des dates de la semaine en cours
  const sessions = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDay(); // 0: Dimanche, 5: Vendredi
    const currentHour = now.getHours();

    return PACKAGES_CONFIG.map(pkg => {
      // Calcul du jour de la semaine cible (Jeudi ou Samedi)
      let daysUntil = (pkg.targetDay - currentDay + 7) % 7;
      
      // Si la session d'aujourd'hui est passée, on passe à la semaine prochaine
      if (daysUntil === 0 && currentHour >= 12) {
        daysUntil = 7;
      }

      const sessionDate = new Date(now);
      sessionDate.setDate(now.getDate() + daysUntil);
      
      const dateDisplay = sessionDate.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      });

      // RÈGLE VENDREDI MIDI : Blocage pour le samedi
      let isBlockedByDeadline = false;
      if (pkg.targetDay === 6) {
        // Bloquer si on est Vendredi après 12h ET que le samedi visé est celui de cette semaine
        if ((currentDay === 5 && currentHour >= 12 && daysUntil === 1) || (currentDay === 6 && daysUntil === 0)) {
           isBlockedByDeadline = true;
        }
      }

      return { ...pkg, dateDisplay, isBlockedByDeadline };
    });
  }, []);

  const getRemainingSpots = (dateStr: string, max: number) => {
    const taken = bookings.filter(b => b.date === dateStr).length;
    return max - taken;
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
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
        <div className="p-6 border-b flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{step === 1 ? 'Calendrier de la Semaine' : 'Validation'}</h3>
            <p className="text-sm text-gray-500">Une seule réservation autorisée par semaine.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full">✕</button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {step === 1 ? (
            <div className="space-y-4">
              {/* Alerte Vendredi Midi */}
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-xl flex items-start gap-3">
                <span className="text-xl">⏳</span>
                <p className="text-xs text-amber-800 font-bold uppercase tracking-tighter">
                  Clôture Samedi : Les inscriptions se terminent chaque Vendredi à 12h00 précises.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {sessions.map((pkg) => {
                  const spots = getRemainingSpots(pkg.dateDisplay, pkg.maxPlayers);
                  const isFull = spots <= 0;
                  const isClosed = pkg.isBlockedByDeadline;
                  
                  return (
                    <button
                      key={pkg.id}
                      disabled={isFull || isClosed}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`text-left p-6 rounded-2xl border-2 transition-all flex justify-between gap-4 ${
                        isFull || isClosed
                        ? 'opacity-60 bg-gray-50 border-gray-100 cursor-not-allowed'
                        : selectedPackage?.id === pkg.id 
                          ? 'border-green-500 bg-green-50 ring-4 ring-green-100' 
                          : 'border-gray-100 hover:border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex-1">
                        <p className="text-[10px] font-black uppercase text-green-600 mb-1">{pkg.dateDisplay}</p>
                        <h4 className="text-lg font-bold text-gray-800">{pkg.name}</h4>
                        <p className="text-xs text-gray-400 mt-2 italic">{pkg.description}</p>
                      </div>
                      <div className="text-right flex flex-col justify-center">
                        <span className={`text-xs font-bold px-2 py-1 rounded mb-2 ${isClosed ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                          {isClosed ? 'CLÔTURÉ' : `${spots} places`}
                        </span>
                        <span className="text-xl font-black">{pkg.pricePerPerson}$</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Alerte Quorum / Garantie */}
              <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3">
                <span className="text-xl">📣</span>
                <p className="text-[10px] text-red-700 font-black uppercase leading-tight">
                  IMPORTANT : Si le quorum (4 pour Jeudi / 8 pour Samedi) n'est pas atteint, la session pourra être annulée. Places non garanties.
                </p>
              </div>

              <button
                disabled={!selectedPackage}
                onClick={() => setStep(2)}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                  selectedPackage ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Passer aux coordonnées
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <input 
                  type="text" placeholder="Nom Complet" value={userData.name}
                  onChange={(e) => setUserData({...userData, name: e.target.value})}
                  className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none font-bold"
                />
                <input 
                  type="tel" placeholder="Téléphone (WhatsApp)" value={userData.phone}
                  onChange={(e) => setUserData({...userData, phone: e.target.value})}
                  className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none font-bold"
                />
              </div>

              <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-green-800">{selectedPackage?.name}</span>
                  <span className="font-black text-green-600">{selectedPackage?.pricePerPerson}$</span>
                </div>
                <p className="text-xs text-green-700 uppercase font-bold">{selectedPackage?.dateDisplay} à {selectedPackage?.timeRange}</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-4 font-bold text-gray-400">Retour</button>
                <button
                  disabled={!userData.name || !userData.phone}
                  onClick={handleConfirm}
                  className="flex-[2] py-4 rounded-2xl font-bold text-lg bg-green-600 text-white shadow-xl"
                >
                  Confirmer ma place
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
