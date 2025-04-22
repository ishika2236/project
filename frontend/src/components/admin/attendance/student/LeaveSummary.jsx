import React from 'react';
import { useTheme } from '../../../../context/ThemeProvider';

const LeaveSummary = ({ attendance }) => {
  const { themeConfig, theme, isDark } = useTheme();
  const currentTheme = themeConfig[theme];
  
  const medicalLeaves = attendance.filter(a => a.status === 'medical');
  const dutyLeaves = attendance.filter(a => a.status === 'duty');
  
  const pendingMedical = medicalLeaves.filter(a => !a.approved).length;
  const pendingDuty = dutyLeaves.filter(a => !a.approved).length;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Leave Summary</h3>
      <div className={`${currentTheme.card} rounded-xl p-6`}>
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${isDark ? 'bg-orange-900/20' : 'bg-orange-50'} border ${isDark ? 'border-orange-700/30' : 'border-orange-200'}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-orange-500">Medical Leaves</span>
              <span className={`text-xl font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                {medicalLeaves.length}
              </span>
            </div>
            <div className="mt-2 text-xs text-orange-500/80">
              {pendingMedical} pending approval
            </div>
          </div>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'} border ${isDark ? 'border-blue-700/30' : 'border-blue-200'}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-500">Duty Leaves</span>
              <span className={`text-xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                {dutyLeaves.length}
              </span>
            </div>
            <div className="mt-2 text-xs text-blue-500/80">
              {pendingDuty} pending approval
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveSummary;