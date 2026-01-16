
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*');

      if (error) {
        // Si Supabase renvoie une erreur, on extrait le message textuel
        console.error("Erreur Supabase détaillée:", error);
        throw new Error(error.message || "Erreur de base de données inconnue");
      }
      
      setBookings(data || []);
      setErrorMsg(null);
    } catch (err: any) {
      // On s'assure que errorMsg est TOUJOURS une chaîne de caractères
      const message = err instanceof Error ? err.message : JSON.stringify(err);
      console.error("Erreur attrapée:", message);
      setErrorMsg(message);
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
        alert(`Erreur Supabase : ${error.message}`);
        return;
      }
      setView('my-bookings');
      setSelectedCourt(null);
      fetchBookings();
    } catch (err: any) {
      alert("Erreur de réseau lors de l'enregistrement.");
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm("Voulez-vous vraiment annuler votre place ?")) {
      try {
        const { error } = await supabase.from('bookings').delete().eq('id', bookingId);
        if (error) throw error;
        fetchBookings();
      } catch (err: any) {
        alert(`Erreur d'annulation : ${err.message || JSON.stringify(err)}`);
      }
    }
  };

  const totalRevenue = bookings.reduce((acc, curr) => acc + (curr.total_price || curr.totalPrice || 0), 0);

  return (
    <Layout currentView={view} setView={setView}>
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          <p className="text-gray-500 animate-pulse">Connexion au club...</p>
        </div>
      ) : errorMsg ? (
        <div className="bg-red-50 border border-red-100 p-8 rounded-3xl text-center max-w-xl mx-auto animate-fadeIn">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-800 mb-2">Problème de connexion détecté</h2>
          <p className="text-red-600 mb-6 font-mono text-sm bg-white p-4 rounded-xl border border-red-100 break-all">
            {errorMsg}
          </p>
          <div className="text-left bg-white p-4 rounded-xl text-xs text-gray-600 mb-6 border border-gray-100">
            <p className="font-bold mb-2 text-gray-800">Comment régler ça :</p>
            <ul className="list-disc ml-4 space-y-1">
              <li>Si vous voyez <b>"relation 'bookings' does not exist"</b> : créez la table dans Supabase via SQL Editor.</li>
              <li>Si vous voyez <b>"JWSError"</b> : votre clé API est mal copiée ou expirée.</li>
              <li>Si vous voyez <b>"Policy violations"</b> : activez l'accès public (RLS) dans Supabase.</li>
            </ul>
          </div>
          <button 
            onClick={() => { setLoading(true); setErrorMsg(null); fetchBookings(); }}
            className="bg-red-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-red-200 transition-transform active:scale-95"
          >
            Réessayer la connexion
          </button>
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
                    <span className="text-xs font-bold uppercase tracking-widest">Live Club Feed</span>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Sessions Disponibles</h2>
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
                <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                  <div className="text-5xl mb-4">🎾</div>
                  <h3 className="text-xl font-semibold text-gray-700">Aucune session enregistrée</h3>
                  <button onClick={() => setView('home')} className="mt-6 bg-green-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-green-100">Réserver maintenant</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map(booking => (
                    <div key={booking.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner">👤</div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-lg">{booking.user_name || booking.userName}</h4>
                          <p className="text-gray-500 font-medium">{booking.date}</p>
                          <p className="text-gray-400 text-sm">{booking.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Montant</p>
                          <p className="font-black text-2xl text-green-600">{booking.total_price || booking.totalPrice}$</p>
                        </div>
                        <button 
                          onClick={() => handleCancelBooking(booking.id)} 
                          className="bg-red-50 text-red-500 hover:bg-red-100 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                        >
                          Annuler
                        </button>
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
                <h2 className="text-3xl font-bold text-gray-800">Console d'Administration</h2>
                <div className="bg-gray-900 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-6">
                  <div>
                    <p className="text-[10px] uppercase opacity-60 font-black tracking-widest">Revenus Totaux</p>
                    <p className="text-3xl font-black text-green-400">{totalRevenue}$</p>
                  </div>
                  <div className="w-px h-10 bg-white/10"></div>
                  <div>
                    <p className="text-[10px] uppercase opacity-60 font-black tracking-widest">Inscriptions</p>
                    <p className="text-3xl font-black">{bookings.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-black tracking-widest">
                    <tr>
                      <th className="px-8 py-5">Client / Contact</th>
                      <th className="px-8 py-5">Session & Date</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-5">
                           <p className="font-bold text-gray-800">{b.user_name || b.userName}</p>
                           <p className="text-xs text-gray-400 font-mono">{b.user_phone || b.userPhone}</p>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-sm font-bold text-gray-700">{b.date}</p>
                          <p className="text-xs text-gray-400 uppercase tracking-tighter">{b.time}</p>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button 
                            onClick={() => handleCancelBooking(b.id)} 
                            className="text-red-400 hover:text-red-600 font-bold text-xs uppercase tracking-widest"
                          >
                            Révoquer
                          </button>
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
