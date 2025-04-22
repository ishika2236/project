import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeProvider';
import { Users, ArrowUpRight, ChevronRight } from 'lucide-react';
import StatCard from './commonComponents/StatCard';
import SectionHeader from './commonComponents/SectionHeader';

export default function StudentEnrollmentSection({ studentData }) {
  const { themeConfig, theme } = useTheme();
  const colors = themeConfig[theme];
  
  // For section stat cards animation on hover
  const [hoveredCard, setHoveredCard] = useState(null);
  
  const handleNavigateToStudentPage = () => {
    console.log("Navigating to student details page");
    // Implement your navigation logic here
  };

  return (
    <div className="mb-10">
      <SectionHeader 
        title="Student Enrollment" 
        subtitle="Overview of students enrolled across different sections"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          id="total-students"
          title="Total Students"
          value={studentData.total}
          icon={<Users size={24} className={colors.icon} />}
          subtext="Across all sections"
          hoveredCard={hoveredCard}
          setHoveredCard={setHoveredCard}
        />
        
        {studentData.sections.map((section, index) => (
          <StatCard
            key={index}
            id={`section-${index}`}
            title={section.name}
            value={section.students}
            icon={<Users size={24} style={{ color: section.color }} />}
            trend={index === 0 ? 8.2 : (index === 1 ? 12.5 : (index === 2 ? 5.3 : 3.8))}
            hoveredCard={hoveredCard}
            setHoveredCard={setHoveredCard}
          />
        ))}
      </div>
      
      <div className="flex justify-end">
        <button 
          onClick={handleNavigateToStudentPage} 
          className={`flex items-center gap-2 ${colors.button.primary} py-2 px-4 rounded-lg text-sm font-medium`}
        >
          View Student Details
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}   