import React from 'react';

/**
 * InsightsList: component AI insights yg diberikan oleh what-if analysis.
 * Props:
 *   - insights: Array of insight objects { icon, title, message, action, type }
 */
export default function InsightsList({ insights = [] }) {
  if (!insights.length) return null;
  return (
    <section className="mt-6">
      <h3 className="font-semibold mb-2" style={{ color: 'var(--text)' }}>AI Insights</h3>
      <ul className="space-y-2">
        {insights.map((ins, idx) => (
          <li key={idx} className="flex items-start gap-2" style={{ color: 'var(--text-muted)' }}>
            <span>{ins.icon}</span>
            <div>
              <strong style={{ color: 'var(--text)' }}>{ins.title}</strong>
              <p className="text-xs">{ins.message}</p>
              {ins.action && <p className="text-xs italic">{ins.action}</p>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
