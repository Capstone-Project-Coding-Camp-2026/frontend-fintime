import React from 'react';

/**
 * ScoreCards: component yg menampilkan skor budgeting, investment, dan planning.
 * Props:
 *   - scores: { budgeting: number, investment: number, planning: number }
 */
export default function ScoreCards({ scores = {} }) {
  const { budgeting = 0, investment = 0, planning = 0 } = scores;
  const cardStyle = {
    background: 'rgba(0,245,255,0.04)',
    border: '1px solid rgba(0,245,255,0.12)'
  };
  const titleStyle = { color: 'var(--text)' };
  const valueStyle = { color: '#4ade80' };
  return (
    <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 bg-gray-50 rounded" style={cardStyle}>
        <h4 className="text-sm font-medium" style={titleStyle}>Budget Score</h4>
        <p className="text-lg font-bold" style={valueStyle}>{budgeting}%</p>
      </div>
      <div className="p-4 bg-gray-50 rounded" style={cardStyle}>
        <h4 className="text-sm font-medium" style={titleStyle}>Investment Score</h4>
        <p className="text-lg font-bold" style={valueStyle}>{investment}%</p>
      </div>
      <div className="p-4 bg-gray-50 rounded" style={cardStyle}>
        <h4 className="text-sm font-medium" style={titleStyle}>Planning Score</h4>
        <p className="text-lg font-bold" style={valueStyle}>{planning}%</p>
      </div>
    </section>
  );
}
