
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { CourtCard } from './components/CourtCard';
import { BookingFlow } from './components/BookingFlow';
import { Court, CourtType, Booking } from './types';
import { supabase } from './lib/supabase';

const COURTS: Court[] = [
  {
    id: 'achrafieh-1',
    name: 'The Padelist Achrafieh',
    type: CourtType.PANORAMIC,
    pricePerHour: 7.5,
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800',
    rating: 5.0,
    features: ['Achrafieh High-End', 'Tapis WPT', 'Éclairage Premium', 'Zone Lounge']
  }
];

const App: React.FC = () => {
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [view, setView] = useState<'home' | 'my-bookings' | 'admin'>('home');
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.message.includes('apiKey')) {
          console.error("Clé API Supabase invalide ou manquante.");
        }
        throw error;
      }
      setBookings(data || []);
    } catch (err) {
      console.error("Erreur de chargement:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        fetchBookings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleBookingComplete = async (booking: any) => {
    try {
      const { error } = await supabase.from('bookings').insert([booking]);
      if (error) {
        console.error("Détails de l'erreur Supabase:", error);
        alert(`Erreur : ${error.message}. Vérifiez que votre clé API dans lib/supabase.ts est la bonne (elle doit commencer par eyJ).`);
        return;
      }
      setView('my-bookings');
      setSelectedCourt(null);
    } catch (err: any) {
      alert("Erreur de connexion à la base de données.");
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm("Voulez-vous vraiment annuler votre place ? Elle sera remise à disposition immédiatement.")) {
      try {
        const { error } = await supabase.from('bookings').delete().eq('id', bookingId);
        if (error) throw error;
      } catch (err) {
        alert("Erreur lors de l'annulation.");
      }
    }
  };

  const totalRevenue = bookings.reduce((acc, curr) => acc + (curr.total_price || curr.totalPrice || 0), 0);

  return (
    <Layout currentView={view} setView={setView}>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <>
          {view === 'home' && (
            <div className="space-y-8 animate-fadeIn">
              <section className="relative h-64 md:h-96 rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1543731068-7e0f5beff43a?auto=format&fit=crop&q=80&w=1200" 
                  alt="Zaitunay Bay Beirut" 
                  className="w-full h-full object-cover brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col items-center justify-center text-white p-6 text-center">
                  <div className="mb-4 flex items-center gap-3">
                     <span className="text-4xl">🇱🇧</span>
                     <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">The Padelist</h1>
                  </div>
                  <p className="text-xl md:text-2xl font-light text-green-400 mb-4 tracking-[0.2em] uppercase">Achrafieh Courts</p>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-widest">Connecté au Club en direct</span>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Votre Club</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {COURTS.map(court => (
                    <CourtCard 
                      key={court.id} 
                      court={court} 
                      onSelect={() => setSelectedCourt(court)} 
                    />
                  ))}
                </div>
              </section>
            </div>
          )}

          {view === 'my-bookings' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Mes Réservations</h2>
              {bookings.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                  <div className="text-5xl mb-4">🎾</div>
                  <h3 className="text-xl font-semibold text-gray-700">Aucune session enregistrée</h3>
                  <button onClick={() => setView('home')} className="mt-6 bg-green-600 text-white px-6 py-2 rounded-xl font-medium">Réserver</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map(booking => (
                    <div key={booking.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl">👤</div>
                        <div>
                          <h4 className="font-bold text-gray-800">{booking.user_name || booking.userName}</h4>
                          <p className="text-gray-600 text-sm">{booking.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-green-600">{booking.total_price || booking.totalPrice}$</span>
                        <button onClick={() => handleCancelBooking(booking.id)} className="text-red-500 text-sm font-bold">Se désister</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {view === 'admin' && (
            <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Console Centrale</h2>
                <div className="bg-green-600 text-white px-6 py-3 rounded-2xl shadow-lg">
                  <p className="text-xs uppercase opacity-80 font-bold">Total Encaissé</p>
                  <p className="text-2xl font-black">{totalRevenue}$</p>
                </div>
              </div>
              <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                    <tr>
                      <th className="px-6 py-4">Client</th>
                      <th className="px-6 py-4">Session</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bookings.map((b) => (
                      <tr key={b.id}>
                        <td className="px-6 py-4">
                           <p className="font-bold text-gray-800">{b.user_name || b.userName}</p>
                           <p className="text-xs text-gray-400">{b.user_phone || b.userPhone}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold">{b.date}</p>
                          <p className="text-xs text-gray-400">{b.time}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleCancelBooking(b.id)} className="text-red-400 hover:text-red-600">Supprimer</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedCourt && (
            <BookingFlow 
              court={selectedCourt} 
              bookings={bookings}
              onClose={() => setSelectedCourt(null)} 
              onConfirm={handleBookingComplete}
            />
          )}
        </>
      )}
    </Layout>
  );
};

export default App;
