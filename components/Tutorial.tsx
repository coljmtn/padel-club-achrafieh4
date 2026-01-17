
import React from 'react';

interface TutorialProps {
  onBack: () => void;
}

export const Tutorial: React.FC<TutorialProps> = ({ onBack }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">Didactiel Utilisateur</h2>
          <p className="text-gray-500">Apprenez à réserver votre place en 60 secondes.</p>
        </div>
        <button onClick={onBack} className="bg-gray-100 hover:bg-gray-200 px-6 py-2 rounded-2xl font-bold transition-colors">
          Retour à l'accueil
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne Gauche : Vidéo Simulée */}
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video bg-black rounded-[2.5rem] shadow-2xl relative overflow-hidden group cursor-pointer border-8 border-white">
            <img 
              src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=1200" 
              alt="Video Thumbnail" 
              className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 group-hover:scale-125 transition-transform">
                <div className="w-0 h-0 border-y-[15px] border-y-transparent border-l-[25px] border-l-white ml-2"></div>
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
              <span className="text-xs font-black uppercase tracking-widest bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">Guide Interactif</span>
              <span className="text-xs font-mono">01:00</span>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-4">Transcription du Guide</h3>
            <p className="text-gray-600 leading-relaxed italic">
              "Bienvenue sur PadelPlus ! Pour réserver, commencez par choisir un terrain. Sélectionnez votre session : Jeudi pour un cours technique, ou Samedi pour nos nouveaux créneaux de coaching sur le Court N°1 ou N°2. Notez que pour le samedi, les réservations basculent sur la semaine suivante dès le jeudi soir. Entrez votre nom et votre WhatsApp, confirmez, et retrouvez votre reçu dans l'onglet 'Réservations'. À bientôt sur le court !"
            </p>
          </div>
        </div>

        {/* Colonne Droite : Étapes Clés */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 ml-2">Les 4 Étapes</h3>
          
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black shrink-0">1</div>
            <div>
              <p className="font-bold text-gray-800">Choix du Terrain</p>
              <p className="text-xs text-gray-500">Sélectionnez 'The Padelist Achrafieh'.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center font-black shrink-0">2</div>
            <div>
              <p className="font-bold text-gray-800">Session & Court</p>
              <p className="text-xs text-gray-500">Choisissez entre le Court N°1 ou N°2 avec ou sans Coaching.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center font-black shrink-0">3</div>
            <div>
              <p className="font-bold text-gray-800">WhatsApp</p>
              <p className="text-xs text-gray-500">Indispensable pour recevoir les infos du match.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center font-black shrink-0">4</div>
            <div>
              <p className="font-bold text-gray-800">Confirmation</p>
              <p className="text-xs text-gray-500">Annulation possible via votre compte.</p>
            </div>
          </div>
          
          <div className="mt-8 bg-gray-900 p-8 rounded-3xl text-white">
            <p className="text-xs font-black uppercase tracking-widest text-orange-400 mb-2">Règle d'or ⚠️</p>
            <p className="text-sm leading-relaxed">
              Pour les sessions du samedi, toute inscription après le <strong>Jeudi soir (20h00)</strong> est automatiquement reportée au samedi de la semaine suivante.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
