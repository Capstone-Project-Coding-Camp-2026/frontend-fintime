import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, ChevronDown, ExternalLink } from 'lucide-react';
import api from '../../lib/api';

export default function FinancialLearning({ condition = 'normal' }) {
  const [learnings, setLearnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    // Fetch learning recommendations based on current financial condition
    api.get('/learning/recommendations', { params: { condition, limit: 3 } })
      .then(res => {
        console.log('API RESPONSE:', res.data);
        if (isMounted && res.data?.success) {
          setLearnings(res.data.data || []);
        }
      })
      .catch(err => {
        console.error('Failed to fetch learning recommendations:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [condition]);

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'investasi': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
      case 'budgeting': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'utang': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      case 'tabungan': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'pensiun': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  if (loading) {
    return (
      <div className="w-full rounded-2xl border border-gray-800 bg-gray-900/50 p-6 animate-pulse">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-gray-800"></div>
          <div className="h-6 w-48 bg-gray-800 rounded"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 w-full bg-gray-800 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (learnings.length === 0) {
    return null; // Don't show the section if there's no learning content available
  }

  return (
    <div className="w-full rounded-2xl border border-cyan-900/30 bg-gray-900/40 backdrop-blur-md overflow-hidden relative">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/4 w-1/2 h-32 bg-cyan-500/10 blur-[80px] pointer-events-none rounded-full"></div>

      <div className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
              <BookOpen className="text-cyan-400 w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                Financial Learning <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              </h2>
              <p className="text-sm text-gray-400">Personalized from your financial forecast</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {learnings.map((item, idx) => {
            const isExpanded = expandedId === item.id;
            // Generate a short excerpt if content is long and not expanded
            const excerpt = item.content?.length > 100
              ? item.content.substring(0, 100) + '...'
              : item.content;

            return (
              <motion.div
                key={item.id || idx}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                onClick={() => toggleExpand(item.id)}
                className={`
                  group cursor-pointer rounded-xl border transition-all duration-300
                  ${isExpanded
                    ? 'border-cyan-500/50 bg-gray-800/80 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'border-gray-800 bg-gray-800/30 hover:border-cyan-500/30 hover:bg-gray-800/50'}
                `}
              >
                <div className="p-4 flex gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getCategoryColor(item.category)}`}>
                        {item.category?.toUpperCase() || 'FINANCE'}
                      </span>
                      <span className="text-xs text-gray-500">5 min read</span>
                    </div>

                    <h3 className={`text-base font-medium mb-1 transition-colors ${isExpanded ? 'text-cyan-100' : 'text-gray-200 group-hover:text-cyan-300'}`}>
                      {item.title}
                    </h3>

                    <AnimatePresence mode="wait">
                      {!isExpanded ? (
                        <motion.p
                          key="excerpt"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-sm text-gray-400 line-clamp-2"
                        >
                          {excerpt}
                        </motion.p>
                      ) : (
                        <motion.div
                          key="full-content"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="pt-3 border-t border-gray-700/50 mt-3">
                            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                              {item.content}
                            </p>
                          </div>

                          <div className="mt-4 flex justify-end">
                            <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
                              <button className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors">
                                Baca selengkapnya <ExternalLink className="w-3 h-3" />
                              </button>
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex items-start pt-1">
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-gray-500 group-hover:text-cyan-400"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
