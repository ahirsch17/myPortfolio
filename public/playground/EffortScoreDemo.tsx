import React, { Fragment, useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';

type FocusMode = 'mixed' | 'cardio' | 'strength';

type Sample = {
  ts: number;
  hr: number;
  acc: number;
  zone: 1 | 2 | 3 | 4 | 5;
  zoneWeight: number;
  effortInstant: number;
  effortEma: number;
  kcalTotal: number;
};

export const zoneWeights = [0.2, 0.4, 0.7, 1.0, 1.3];

export const EffortScoreDemo: React.FC<{
  samples: Sample[];
  metrics: { effortScore: number; calories: number; durationMs: number };
  focus: FocusMode;
  setFocus: (mode: FocusMode) => void;
  playing: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  onRandomize: () => void;
  onCopyTimeline: () => void;
  onTriggerHr: (value: number) => void;
  onTriggerAcc: (value: number) => void;
  setSpeed: (speed: number) => void;
  speed: number;
  helperVisible: boolean;
}> = ({
  samples,
  metrics,
  focus,
  setFocus,
  playing,
  onTogglePlay,
  onReset,
  onRandomize,
  onCopyTimeline,
  onTriggerHr,
  onTriggerAcc,
  setSpeed,
  speed,
  helperVisible,
}) => {
  const [cursorTs, setCursorTs] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'live' | 'last5' | 'summary'>('live');

  const liveSamples = useMemo(() => samples.slice(-160), [samples]);
  const lastFive = useMemo(() => samples.slice(-600), [samples]);

  const sparklineData = useMemo(
    () =>
      samples.slice(-80).map((sample) => ({
        ts: sample.ts,
        effort: sample.effortInstant,
      })),
    [samples],
  );

  const summaryZones = useMemo(() => {
    const totals = [0, 0, 0, 0, 0];
    for (const sample of lastFive) {
      totals[sample.zone - 1] += 1;
    }
    const overall = totals.reduce((sum, value) => sum + value, 0);
    return totals.map((count, index) => ({
      zone: `Zone ${index + 1}`,
      minutes: overall ? (count / 2 / 60).toFixed(2) : 0,
      value: overall ? (count / overall) * 100 : 0,
    }));
  }, [lastFive]);

  const intensityRadar = useMemo(() => {
    if (!lastFive.length) {
      return [
        { metric: 'Cardio load', value: 0 },
        { metric: 'Strength load', value: 0 },
        { metric: 'Consistency', value: 0 },
        { metric: 'Recovery', value: 0 },
      ];
    }
    const averageHr = lastFive.reduce((sum, sample) => sum + sample.hr, 0) / lastFive.length;
    const averageAcc = lastFive.reduce((sum, sample) => sum + sample.acc, 0) / lastFive.length;
    const highEffort = lastFive.filter((sample) => sample.effortInstant > 70).length / lastFive.length;
    const lowEffort = lastFive.filter((sample) => sample.zone <= 2).length / lastFive.length;
    return [
      { metric: 'Cardio load', value: Math.min(100, Math.max(0, (averageHr / 170) * 100)) },
      { metric: 'Strength load', value: Math.min(100, Math.max(0, (averageAcc / 3.5) * 100)) },
      { metric: 'Consistency', value: Math.min(100, Math.max(0, (1 - Math.abs(0.5 - highEffort)) * 100)) },
      { metric: 'Recovery', value: Math.min(100, Math.max(0, (1 - highEffort + lowEffort) * 50)) },
    ];
  }, [lastFive]);

  const durationFormatted = new Date(metrics.durationMs).toISOString().substring(11, 19);
  const effortHighlight = metrics.effortScore >= 80;

  const zoneBands = [
    { min: 0, max: 100, color: 'rgba(56, 189, 248, 0.08)' },
    { min: 100, max: 119, color: 'rgba(34, 197, 94, 0.10)' },
    { min: 120, max: 139, color: 'rgba(250, 204, 21, 0.12)' },
    { min: 140, max: 159, color: 'rgba(249, 115, 22, 0.14)' },
    { min: 160, max: 190, color: 'rgba(239, 68, 68, 0.16)' },
  ];

  return (
    <Fragment>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div
              className={`rounded-2xl bg-slate-900/60 border border-slate-700/60 p-4 transition ${
                effortHighlight ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-900' : ''
              }`}
            >
              <p className="text-xs uppercase tracking-wide text-slate-400">Effort Score</p>
              <div className="flex items-end gap-2 mt-1">
                <span className="text-3xl font-semibold text-white">{metrics.effortScore.toFixed(1)}</span>
                <div className="flex gap-1">
                  <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full">Cardio load</span>
                  <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full">Strength load</span>
                </div>
              </div>
              <div className="mt-3 h-12">
                <ResponsiveContainer>
                  <AreaChart data={sparklineData}>
                    <defs>
                      <linearGradient id="effortSpark" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.7} />
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="effort" stroke="#38bdf8" fill="url(#effortSpark)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-2xl bg-slate-900/60 border border-slate-700/60 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Calories</p>
              <p className="text-3xl font-semibold text-white mt-2">{metrics.calories.toFixed(1)}</p>
              <p className="text-xs text-slate-400 mt-1">Estimated total</p>
            </div>
            <div className="rounded-2xl bg-slate-900/60 border border-slate-700/60 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Duration</p>
              <p className="text-3xl font-semibold text-white mt-2">{durationFormatted}</p>
              <p className="text-xs text-slate-400 mt-1">Session timer</p>
            </div>
          </div>
          <div className="glass rounded-3xl border border-slate-700/60 p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Try it</h3>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <span>Status:</span>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${
                    playing ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-200'
                  }`}
                >
                  {playing ? 'Streaming' : 'Paused'}
                </span>
              </div>
            </div>
            <label className="block">
              <span className="flex justify-between text-sm text-slate-300 mb-1">
                <span>Heart rate override</span>
                <span className="text-slate-400">60–190 bpm</span>
              </span>
              <input
                type="range"
                min={60}
                max={190}
                onChange={(event) => onTriggerHr(Number(event.target.value))}
                className="w-full accent-sky-400"
              />
            </label>
            <label className="block">
              <span className="flex justify-between text-sm text-slate-300 mb-1">
                <span>Movement (g-force)</span>
                <span className="text-slate-400">0–4 g</span>
              </span>
              <input
                type="range"
                min={0}
                max={4}
                step={0.05}
                onChange={(event) => onTriggerAcc(Number(event.target.value))}
                className="w-full accent-sky-400"
              />
            </label>
            <label className="block text-sm text-slate-300">
              Focus mode
              <select
                value={focus}
                onChange={(event) => setFocus(event.target.value as FocusMode)}
                className="mt-1 w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
              >
                <option value="mixed">Mixed</option>
                <option value="cardio">Cardio bias</option>
                <option value="strength">Strength bias</option>
              </select>
            </label>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={onTogglePlay}
                  className={`flex-1 rounded-full px-4 py-2 font-semibold ${
                    playing ? 'bg-slate-800 hover:bg-slate-700' : 'bg-emerald-400 text-slate-900 hover:bg-emerald-300'
                  }`}
                >
                  {playing ? 'Pause' : 'Play'}
                </button>
                <button onClick={onReset} className="rounded-full px-4 py-2 bg-slate-800 hover:bg-slate-700">
                  Reset
                </button>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={speed}
                  onChange={(event) => setSpeed(Number(event.target.value))}
                  className="flex-1 rounded-full bg-slate-900 border border-slate-700 px-3 py-2"
                >
                  <option value={0.5}>0.5x speed</option>
                  <option value={1}>1x speed</option>
                  <option value={2}>2x speed</option>
                </select>
                <button onClick={onRandomize} className="rounded-full px-4 py-2 bg-slate-800 hover:bg-slate-700">
                  Randomize
                </button>
              </div>
            </div>
            <button
              onClick={onCopyTimeline}
              className="rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700"
            >
              Copy Effort Timeline
            </button>
            {helperVisible && (
              <div className="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-slate-300">
                Press Play or drag a slider to start the stream.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-3xl border border-slate-700/60 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Visuals</h3>
              <div className="flex items-center gap-2 rounded-full bg-slate-900/60 p-1">
                {(['live', 'last5', 'summary'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                      activeTab === tab ? 'bg-sky-500 text-slate-900' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {tab === 'live' ? 'Live' : tab === 'last5' ? 'Last 5 min' : 'Summary'}
                  </button>
                ))}
              </div>
            </div>
            {activeTab !== 'summary' && (
              <div className="space-y-5">
                <div className="h-40 md:h-48 rounded-2xl bg-slate-900/60 border border-slate-800 px-3 py-2">
                  <ResponsiveContainer>
                    <LineChart
                      data={activeTab === 'live' ? liveSamples : lastFive}
                      onMouseMove={(state) => {
                        if (state && state.activeLabel) {
                          setCursorTs(state.activeLabel as number);
                        }
                      }}
                      onMouseLeave={() => setCursorTs(null)}
                    >
                      <CartesianGrid stroke="rgba(148, 163, 184, 0.18)" vertical={false} />
                      <XAxis dataKey="ts" stroke="#94a3b8" />
                      <YAxis domain={[60, 190]} stroke="#94a3b8" />
                      <Tooltip />
                      {zoneBands.map((band, idx) => (
                        <ReferenceLine key={idx} y={band.max} stroke="transparent" fill={band.color} ifOverflow="extendDomain" />
                      ))}
                      <Line type="monotone" dataKey="hr" stroke="#38bdf8" strokeWidth={2} dot={false} />
                      {cursorTs && <ReferenceLine x={cursorTs} stroke="#facc15" strokeDasharray="3 3" />}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-36 md:h-40 rounded-2xl bg-slate-900/60 border border-slate-800 px-3 py-2">
                  <ResponsiveContainer>
                    <AreaChart
                      data={activeTab === 'live' ? liveSamples : lastFive}
                      onMouseMove={(state) => {
                        if (state && state.activeLabel) {
                          setCursorTs(state.activeLabel as number);
                        }
                      }}
                      onMouseLeave={() => setCursorTs(null)}
                    >
                      <CartesianGrid stroke="rgba(148, 163, 184, 0.16)" vertical={false} />
                      <XAxis dataKey="ts" stroke="#94a3b8" />
                      <YAxis domain={[0, 4.5]} stroke="#94a3b8" />
                      <Tooltip />
                      <defs>
                        <linearGradient id="accGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.6} />
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="acc" stroke="#f97316" fill="url(#accGradient)" strokeWidth={2} />
                      {cursorTs && <ReferenceLine x={cursorTs} stroke="#facc15" strokeDasharray="3 3" />}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
            {activeTab === 'summary' && (
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="h-56 rounded-2xl bg-slate-900/60 border border-slate-800 px-3 py-2">
                  <ResponsiveContainer>
                    <BarChart data={summaryZones}>
                      <CartesianGrid stroke="rgba(148, 163, 184, 0.16)" vertical={false} />
                      <XAxis dataKey="zone" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" unit="%" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#38bdf8" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-56 rounded-2xl bg-slate-900/60 border border-slate-800 px-3 py-2">
                  <ResponsiveContainer>
                    <RadarChart data={intensityRadar}>
                      <PolarGrid stroke="rgba(148, 163, 184, 0.2)" />
                      <PolarAngleAxis dataKey="metric" stroke="#94a3b8" />
                      <PolarRadiusAxis angle={45} domain={[0, 100]} stroke="#94a3b8" />
                      <Radar dataKey="value" stroke="#f472b6" fill="#f472b6" fillOpacity={0.35} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EffortScoreDemo;

