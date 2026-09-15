import React from 'react';
import { Users, Check } from 'lucide-react';

interface SeatSelectorProps {
  availableSeats: number;
  selectedCount: number;
  onChangeCount: (count: number) => void;
  selectedSeats: string[];
  onToggleSeat: (seatId: string) => void;
}

// Fixed 4 rows x 8 columns layout for visual grid demo
const ROWS = ['A', 'B', 'C', 'D'];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8];

// Deterministic reserved seats for visual realism
const DEFAULT_RESERVED = new Set(['A-3', 'A-4', 'B-1', 'B-7', 'C-4', 'C-5', 'D-2', 'D-8']);

export const SeatSelector: React.FC<SeatSelectorProps> = ({
  availableSeats,
  selectedCount,
  onChangeCount,
  selectedSeats,
  onToggleSeat,
}) => {
  const maxAllowed = Math.min(6, availableSeats);

  return (
    <div className="space-y-6">
      {/* Quick Quantity Counter */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Users className="w-4 h-4 text-indigo-500" />
            <span>Select Number of Tickets</span>
          </label>
          <span className="text-xs text-slate-500 dark:text-slate-400">Max 6 per booking</span>
        </div>

        <div className="grid grid-cols-6 gap-2">
          {[1, 2, 3, 4, 5, 6].map((num) => {
            const isDisabled = num > availableSeats;
            const isSelected = selectedCount === num;

            return (
              <button
                key={num}
                type="button"
                id={`seat-qty-btn-${num}`}
                disabled={isDisabled}
                onClick={() => onChangeCount(num)}
                className={`h-11 rounded-xl font-bold text-sm flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isDisabled
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-transparent'
                    : isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-600 dark:ring-indigo-400'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                }`}
              >
                <span>{num}</span>
                <span className="text-[9px] font-normal opacity-80">{num === 1 ? 'ticket' : 'tickets'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Seating Layout Preview */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Auditorium Seating Plan</span>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">Click seats to choose</span>
        </div>

        {/* Stage Curved Indicator */}
        <div className="relative flex flex-col items-center">
          <div className="w-4/5 h-2 rounded-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-80"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1">
            STAGE / SCREEN
          </span>
        </div>

        {/* Seat Grid */}
        <div className="space-y-2 max-w-sm mx-auto pt-2">
          {ROWS.map((row) => (
            <div key={row} className="flex items-center justify-center gap-1.5 sm:gap-2">
              <span className="w-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 text-center">{row}</span>
              <div className="flex gap-1.5 sm:gap-2">
                {COLS.map((col) => {
                  const seatId = `${row}-${col}`;
                  const isReserved = DEFAULT_RESERVED.has(seatId);
                  const isSelected = selectedSeats.includes(seatId);

                  return (
                    <button
                      key={seatId}
                      type="button"
                      id={`seat-${seatId}`}
                      disabled={isReserved}
                      onClick={() => onToggleSeat(seatId)}
                      title={isReserved ? `Seat ${seatId} (Reserved)` : `Seat ${seatId} (Available)`}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[10px] font-bold flex items-center justify-center transition-all ${
                        isReserved
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                          : isSelected
                          ? 'bg-indigo-600 text-white ring-2 ring-indigo-500 scale-105 shadow-sm'
                          : 'bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-600 cursor-pointer'
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5" /> : col}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600"></span>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-indigo-600"></span>
            <span className="font-medium text-indigo-600 dark:text-indigo-400">Selected ({selectedSeats.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-800"></span>
            <span>Reserved</span>
          </div>
        </div>
      </div>
    </div>
  );
};
