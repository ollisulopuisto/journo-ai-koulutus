import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Plus, Trash2, GraduationCap, Award, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Objective {
  id: string;
  text: string;
  completed: boolean;
}

export default function App() {
  const [objectives, setObjectives] = useState<Objective[]>([
    { id: '1', text: 'Ymmärrän tämän kerran pääkäsitteet', completed: false },
    { id: '2', text: 'Osaan soveltaa oppimaani käytännön työssä', completed: false },
    { id: '3', text: 'Tiedän, mistä löydän lisämateriaalia aiheesta', completed: false },
    { id: '4', text: 'Olen valmis siirtymään seuraavaan aiheeseen', completed: false },
  ]);
  const [newObjective, setNewObjective] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);

  const completedCount = objectives.filter((o) => o.completed).length;
  const totalCount = objectives.length;
  const progressPercentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  useEffect(() => {
    if (progressPercentage === 100 && totalCount > 0) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [progressPercentage, totalCount]);

  const toggleObjective = (id: string) => {
    setObjectives(
      objectives.map((obj) =>
        obj.id === id ? { ...obj, completed: !obj.completed } : obj
      )
    );
  };

  const addObjective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObjective.trim()) return;
    
    const newObj: Objective = {
      id: Date.now().toString(),
      text: newObjective.trim(),
      completed: false,
    };
    
    setObjectives([...objectives, newObj]);
    setNewObjective('');
  };

  const deleteObjective = (id: string) => {
    setObjectives(objectives.filter((obj) => obj.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100"
      >
        {/* Header Section */}
        <div className="bg-indigo-600 px-8 py-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-indigo-400 opacity-20 rounded-full blur-xl"></div>
          
          <div className="relative z-10 flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Webinaarin Tavoitteet</h1>
              <p className="text-indigo-100 mt-1 font-medium">Tarkistuslista osallistujille</p>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="px-8 pt-8 pb-4">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Edistyminen</span>
            <span className="text-2xl font-bold text-indigo-600">{progressPercentage}%</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Checklist Section */}
        <div className="px-8 py-4">
          <ul className="space-y-3">
            <AnimatePresence mode="popLayout">
              {objectives.map((objective) => (
                <motion.li
                  key={objective.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    objective.completed 
                      ? 'bg-indigo-50/50 border-indigo-100' 
                      : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-100/50'
                  }`}
                  onClick={() => toggleObjective(objective.id)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <button 
                      className={`flex-shrink-0 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-full ${
                        objective.completed ? 'text-indigo-600' : 'text-slate-300 group-hover:text-indigo-400'
                      }`}
                    >
                      {objective.completed ? (
                        <CheckCircle2 className="w-7 h-7" />
                      ) : (
                        <Circle className="w-7 h-7" />
                      )}
                    </button>
                    <span className={`text-base sm:text-lg transition-all duration-200 ${
                      objective.completed ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-700 font-medium'
                    }`}>
                      {objective.text}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteObjective(objective.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-red-500"
                    aria-label="Poista tavoite"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {objectives.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <p>Ei tavoitteita asetettu. Lisää uusi tavoite alta!</p>
            </div>
          )}
        </div>

        {/* Add New Objective Section */}
        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100">
          <form onSubmit={addObjective} className="flex gap-3">
            <input
              type="text"
              value={newObjective}
              onChange={(e) => setNewObjective(e.target.value)}
              placeholder="Lisää uusi osatavoite..."
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
            />
            <button
              type="submit"
              disabled={!newObjective.trim()}
              className="bg-indigo-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm shadow-indigo-200"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Lisää</span>
            </button>
          </form>
        </div>
      </motion.div>

      {/* Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
          >
            <div className="bg-white/90 backdrop-blur-md px-8 py-6 rounded-3xl shadow-2xl flex items-center gap-4 border border-indigo-100">
              <Award className="w-12 h-12 text-yellow-500" />
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Mahtavaa!</h2>
                <p className="text-slate-600 font-medium">Kaikki tavoitteet saavutettu.</p>
              </div>
              <Sparkles className="w-8 h-8 text-indigo-500 animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
