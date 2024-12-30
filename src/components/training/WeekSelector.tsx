import React from 'react';

interface WeekSelectorProps {
  totalWeeks: number;
  selectedWeek?: number;
  onWeekChange: (week?: number) => void;
}

export default function WeekSelector({ totalWeeks, selectedWeek, onWeekChange }: WeekSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <select
        value={selectedWeek || ''}
        onChange={(e) => onWeekChange(e.target.value ? Number(e.target.value) : undefined)}
        className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">All Weeks</option>
        {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((week) => (
          <option key={week} value={week}>Week {week}</option>
        ))}
      </select>
    </div>
  );
}