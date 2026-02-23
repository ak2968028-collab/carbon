'use client';
import { useState } from 'react';

interface BudgetBefore {
  Parameter: string;
  Value: string;
  Unit: string;
}
interface BudgetAfter {
  Parameter: string;
  Value: string;
}

interface Props {
  before: BudgetBefore[];
  after: BudgetAfter[];
}

export default function CarbonBudgetCard({ before, after }: Props) {
  const [view, setView] = useState<'before' | 'after'>('before');

  const getVal = (arr: { Parameter: string; Value: string }[], param: string) =>
    arr.find(r => r.Parameter.includes(param))?.Value || '0';

  const netBefore = parseFloat(getVal(before, 'Net Emission'));
  const netAfter = parseFloat(getVal(after, 'New Net Emission'));
  const reduction = parseFloat(getVal(after, 'Percentage Reduction'));
  const totalEmission = parseFloat(getVal(before, 'Total Emission'));
  const totalSeq = parseFloat(getVal(before, 'Total Sequestration'));
  const perCapita = parseFloat(getVal(before, 'Per Capita'));

  const progress = (totalSeq / totalEmission) * 100;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-white font-bold text-lg flex items-center gap-2">
          <span className="text-2xl">💰</span> Carbon Budget
        </h2>
        <div className="flex bg-gray-800 rounded-lg p-1 gap-1">
          <button
            onClick={() => setView('before')}
            className={`px-3 py-1 rounded text-xs font-semibold transition-all ${view === 'before' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >Before</button>
          <button
            onClick={() => setView('after')}
            className={`px-3 py-1 rounded text-xs font-semibold transition-all ${view === 'after' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >After</button>
        </div>
      </div>

      {view === 'before' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-red-950/50 border border-red-800 rounded-xl p-4">
              <div className="text-red-400 text-xs uppercase tracking-wide mb-1">Total Emissions</div>
              <div className="text-white text-xl font-bold">{(totalEmission / 1000).toFixed(0)}t</div>
              <div className="text-red-400 text-xs">CO₂e / year</div>
            </div>
            <div className="bg-green-950/50 border border-green-800 rounded-xl p-4">
              <div className="text-green-400 text-xs uppercase tracking-wide mb-1">Sequestration</div>
              <div className="text-white text-xl font-bold">{(totalSeq / 1000).toFixed(1)}t</div>
              <div className="text-green-400 text-xs">CO₂e / year</div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-xs">Sequestration Coverage</span>
              <span className="text-white text-xs font-semibold">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-3 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-orange-950/40 border border-orange-800 rounded-xl p-4">
              <div className="text-orange-400 text-xs">Net Emission</div>
              <div className="text-white text-lg font-bold">{(netBefore / 1000).toFixed(1)}t</div>
            </div>
            <div className="bg-blue-950/40 border border-blue-800 rounded-xl p-4">
              <div className="text-blue-400 text-xs">Per Capita</div>
              <div className="text-white text-lg font-bold">{perCapita.toFixed(0)} kg</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-900 to-emerald-900 border border-green-700 rounded-xl p-5 text-center">
            <div className="text-green-300 text-sm mb-1">Reduction Achieved</div>
            <div className="text-5xl font-black text-green-400">{reduction.toFixed(1)}%</div>
            <div className="text-green-300 text-xs mt-1">through interventions</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="text-gray-400 text-xs">Previous Net</div>
              <div className="text-red-400 text-lg font-bold line-through">{(netBefore / 1000).toFixed(1)}t</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="text-gray-400 text-xs">New Net</div>
              <div className="text-green-400 text-lg font-bold">{(netAfter / 1000).toFixed(1)}t</div>
            </div>
          </div>
          {after.filter(r => r.Parameter && r.Parameter !== 'Parameter' && !r.Parameter.includes('Previous') && !r.Parameter.includes('New') && !r.Parameter.includes('Percentage')).map((row) => (
            <div key={row.Parameter} className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400 text-xs">{row.Parameter}</span>
              <span className="text-white text-xs font-semibold">{parseFloat(row.Value).toLocaleString()} kg</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
