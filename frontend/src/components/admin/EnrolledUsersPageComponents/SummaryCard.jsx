// SummaryCard.jsx
import React from 'react';

const SummaryCard = ({ teachers, theme, currentTheme }) => {
  return (
    <div className={`${currentTheme.card} rounded-xl p-4 mt-6`}>
      <div className="flex justify-between">
        <div>
          <p className={currentTheme.secondaryText}>Total Teachers</p>
          <p className={`text-2xl font-bold ${currentTheme.text}`}>{teachers.length}</p>
        </div>
        <div>
          <p className={currentTheme.secondaryText}>Active Teachers</p>
          <p className={`text-2xl font-bold ${currentTheme.text}`}>
            {teachers.filter(t => t.status === 'Active').length}
          </p>
        </div>
        <div>
          <p className={currentTheme.secondaryText}>Departments</p>
          <p className={`text-2xl font-bold ${currentTheme.text}`}>
            {new Set(teachers.map(t => t.department)).size}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;