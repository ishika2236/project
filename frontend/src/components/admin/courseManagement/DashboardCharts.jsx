// DashboardCharts.js
import React from 'react';
import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { getGradeDistribution, getDepartmentDistribution, getEnrollmentTrend } from './chartUtils';

// Color palette for charts
const CHART_COLORS = ['#2E67FF', '#2F955A', '#F2683C', '#E9446A', '#8A2BE2', '#FFD700'];

const GradeDistributionChart = ({ course, colors }) => {
  return (
    <div className={`p-4 rounded-lg ${colors.card}`}>
      <h3 className={`text-lg font-medium mb-2 ${colors.text}`}>Grade Distribution</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={getGradeDistribution(course)}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {getGradeDistribution(course).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const DepartmentDistributionChart = ({ courses, colors }) => {
  return (
    <div className={`p-4 rounded-lg ${colors.card}`}>
      <h3 className={`text-lg font-medium mb-2 ${colors.text}`}>Department Distribution</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={getDepartmentDistribution(courses)}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#2E67FF" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const EnrollmentTrendChart = ({ colors }) => {
  return (
    <div className={`p-4 rounded-lg ${colors.card}`}>
      <h3 className={`text-lg font-medium mb-2 ${colors.text}`}>Enrollment Trend</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={getEnrollmentTrend()}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#2F955A" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const DashboardCharts = ({ courses, colors }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* <GradeDistributionChart course={courses[0]} colors={colors} /> */}
      <DepartmentDistributionChart courses={courses} colors={colors} />
      <EnrollmentTrendChart colors={colors} />
    </div>
  );
};

export default DashboardCharts;