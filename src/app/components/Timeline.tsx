
import React from 'react';
import { motion } from 'motion/react';
import { Milestone } from '../types';
import { format, differenceInDays, addDays } from 'date-fns';
import { cn } from '../../lib/utils';

interface TimelineProps {
  milestones: Milestone[];
  prospectName: string;
  startDate: Date;
}

export const Timeline: React.FC<TimelineProps> = ({ milestones, prospectName, startDate }) => {
  const DURATION_DAYS = 45;

  const getPosition = (date: Date) => {
    const days = differenceInDays(date, startDate);
    // Clamp between 0 and 100
    return Math.max(0, Math.min(100, (days / DURATION_DAYS) * 100));
  };

  const tracks = [
    { id: 'protopia', label: 'Protopia', color: 'blue' },
    { id: 'prospect', label: prospectName, color: 'green' },
  ];

  return (
    <div className="w-full py-12 overflow-x-auto pb-24">
      {/* Container with ample left padding for track labels */}
      <div className="min-w-[800px] relative pl-32 pr-12">
        
        {/* Time Axis Markers - Background */}
        <div className="absolute top-0 bottom-0 left-32 right-12 pointer-events-none">
             {[0, 15, 30, 45].map((day) => {
                const pos = (day / DURATION_DAYS) * 100;
                return (
                    <div key={day} className="absolute h-full border-l border-dashed border-gray-200" style={{ left: `${pos}%` }}>
                        <span className="absolute -top-8 -translate-x-1/2 text-xs font-semibold text-gray-400 bg-white px-1">Day {day}</span>
                    </div>
                )
             })}
        </div>

        <div className="space-y-20 relative z-10 py-4">
          {tracks.map((track) => (
            <div key={track.id} className="relative h-12 flex items-center">
              {/* Track Label - Positioned in the left padding area */}
              <div className={cn(
                  "absolute -left-28 w-24 text-right font-bold text-sm truncate",
                  track.id === 'protopia' ? "text-[#3D3DF5]" : "text-[#26D980]"
              )} title={track.label}>
                {track.label}
              </div>

              {/* Track Line */}
              <div className={cn(
                  "w-full h-2 rounded-full relative",
                  track.id === 'protopia' ? "bg-indigo-50" : "bg-emerald-50"
              )} style={{ backgroundColor: track.id === 'protopia' ? 'rgba(61, 61, 245, 0.1)' : 'rgba(38, 217, 128, 0.1)' }}>
              </div>

              {/* Milestones for this track */}
              {milestones
                .filter(m => m.owner === track.id)
                .map((milestone, index) => {
                  const left = getPosition(milestone.date);

                  return (
                    <motion.div
                      key={milestone.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + (index * 0.1) }}
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center group z-10"
                      style={{ left: `${left}%` }}
                    >
                      {/* Node */}
                      <div 
                        className={cn(
                          "w-8 h-8 rounded-full border-[3px] flex items-center justify-center transition-all duration-300 shadow-sm bg-white cursor-pointer relative z-20",
                          "group-hover:scale-110 group-hover:shadow-md"
                        )}
                        style={{ 
                          borderColor: track.id === 'protopia' ? '#3D3DF5' : '#26D980'
                        }}
                      >
                        <div 
                            className="w-2.5 h-2.5 rounded-full" 
                            style={{ backgroundColor: track.id === 'protopia' ? '#3D3DF5' : '#26D980' }}
                        />
                      </div>

                      {/* Static Label (Always visible) */}
                      <div className="absolute top-10 w-32 text-center pointer-events-none">
                         <div className="text-xs font-bold text-gray-900 leading-tight">{milestone.title}</div>
                         <div className="text-[10px] text-gray-500 font-mono mt-0.5">{format(milestone.date, 'MMM d')}</div>
                      </div>

                      {/* Detailed Description Hover Card */}
                      <div className={cn(
                          "absolute top-16 w-48 p-3 bg-white rounded-lg shadow-xl border border-gray-100 text-left opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50",
                          // Adjust position if it's near the right edge
                          left > 80 ? "-translate-x-3/4" : "-translate-x-1/2"
                      )}>
                        <h4 className="font-bold text-gray-900 text-xs mb-1">{milestone.title}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            {milestone.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
