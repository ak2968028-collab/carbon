'use client';
import { useState } from 'react';

interface SeqBefore {
  Source: string;
  'Area (ha)': string;
  'Annual CO2 Sequestered (kg)': string;
}
interface SeqAfter {
  Type: string;
  Intervention: string;
  'Area Added (ha)': string;
  'Sequestration Factor': string;
  'Annual CO2 Sequestration (kg)': string;
}

interface Props {
  before: SeqBefore[];
  after: SeqAfter[];
}

const TYPE_ICONS: Record<string, string> = {
  Forestry: '🌲', Agroforestry: '🌳', 'Soil Carbon': '🌱', 'Green Belt': '🌿',
};

export default function SequestrationCard({ before, after }: Props) {
  const [tab, setTab] = useState<'before' | 'after'>('before');
  const afterFiltered = after.filter(r => r.Type && r.Type !== 'Type' && !r.Type.includes('Total'));
  const totalAfterSeq = afterFiltered.reduce((s, r) => s + parseFloat(r['Annual CO2 Sequestration (kg)'] || '0'), 0);
  const beforeSeq = parseFloat(before[0]?.['Annual CO2 Sequestered (kg)'] || '0');

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-bold text-lg flex items-center gap-2">
          <span className="text-2xl">🌲</span> Carbon Sequestration
        </h2>
        <div className="flex bg-gray-800 rounded-lg p-1 gap-1">
          {(['before', 'after'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1 rounded text-xs font-semibold capitalize transition-all ${tab === t ? (t === 'before' ? 'bg-yellow-600 text-white' : 'bg-green-600 text-white') : 'text-gray-400 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {tab === 'before' ? (
        <div>
          <div className="bg-yellow-950/40 border border-yellow-800 rounded-xl p-5 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🌲</span>
              <div>
                <div className="text-yellow-300 text-xs uppercase tracking-wide">Forest Cover</div>
                <div className="text-white text-2xl font-bold">{before[0]?.['Area (ha)']} ha</div>
                <div className="text-yellow-400 text-sm mt-1">{(beforeSeq / 1000).toFixed(1)}t CO₂ / year</div>
              </div>
            </div>
          </div>
          <div className="text-gray-400 text-xs text-center">Only existing forest sequestration before any intervention</div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-green-950/40 border border-green-800 rounded-xl p-4 text-center mb-2">
            <div className="text-green-300 text-xs">Additional Sequestration Added</div>
            <div className="text-green-400 text-3xl font-bold">{(totalAfterSeq / 1000).toFixed(1)}t</div>
            <div className="text-green-300 text-xs">CO₂ / year</div>
          </div>
          {afterFiltered.map((r, i) => {
            const val = parseFloat(r['Annual CO2 Sequestration (kg)'] || '0');
            const pct = (val / totalAfterSeq) * 100;
            return (
              <div key={i} className="bg-gray-800 rounded-xl p-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span>{TYPE_ICONS[r.Type] || '🌿'}</span>
                      <span className="text-white text-sm font-semibold">{r.Intervention}</span>
                    </div>
                    <div className="text-gray-400 text-xs mt-1">Area: {r['Area Added (ha)']} ha • Factor: {r['Sequestration Factor']} kg/ha</div>
                  </div>
                  <span className="text-green-400 text-sm font-bold">{(val / 1000).toFixed(1)}t</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
