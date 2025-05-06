import React from 'react';
import DepartmentCard from '../department/DepartmentCard';

const OverviewView = ({ departments, handleDepartmentSelect }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Departments</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map(department => (
          <DepartmentCard 
            key={department.id}
            department={department}
            onClick={handleDepartmentSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default OverviewView;