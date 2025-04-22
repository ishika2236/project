import React from "react";
import { useState } from "react";
import { useTheme } from "../../../context/ThemeProvider";
import SettingsRow from "./commonComponents/SettingsRow";
export default function AccountSettings({ colors }) {
    const [admins] = useState([
      { id: 1, name: 'Admin User', email: 'admin@techedu.com', role: 'Super Admin', lastActive: '1 hour ago' },
      { id: 2, name: 'John Smith', email: 'john.smith@techedu.com', role: 'Course Admin', lastActive: '2 days ago' },
      { id: 3, name: 'Sarah Johnson', email: 'sarah@techedu.com', role: 'Department Admin', lastActive: '5 hours ago' },
    ]);
    const { themeConfig, theme, toggleTheme } = useTheme();
    return (
      <div className={`${colors.card} rounded-lg p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-semibold ${colors.text}`}>Admin Accounts</h2>
          <button className={colors.button.primary + " px-4 py-2 rounded-md text-sm"}>
            Add New Admin
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`text-left ${colors.secondaryText} border-b ${theme === 'dark' ? 'border-[#1E2733]' : 'border-gray-200'}`}>
              <tr>
                <th className="py-3 px-2">Name</th>
                <th className="py-3 px-2">Email</th>
                <th className="py-3 px-2">Role</th>
                <th className="py-3 px-2">Last Active</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody className={colors.text}>
              {admins.map(admin => (
                <tr key={admin.id} className={`border-b ${theme === 'dark' ? 'border-[#1E2733]' : 'border-gray-100'}`}>
                  <td className="py-3 px-2">{admin.name}</td>
                  <td className="py-3 px-2">{admin.email}</td>
                  <td className="py-3 px-2">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      admin.role === 'Super Admin' 
                        ? theme === 'dark' ? 'bg-[#251A1A]/50 text-[#F2683C]' : 'bg-orange-100 text-orange-700'
                        : theme === 'dark' ? 'bg-[#1A2520]/50 text-[#2F955A]' : 'bg-green-100 text-green-700'
                    }`}>
                      {admin.role}
                    </span>
                  </td>
                  <td className="py-3 px-2">{admin.lastActive}</td>
                  <td className="py-3 px-2">
                    <div className="flex space-x-2">
                      <button className={`text-sm ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} hover:underline`}>Edit</button>
                      <button className={`text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-600'} hover:underline`}>Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8">
          <h3 className={`text-lg font-medium ${colors.text} mb-4`}>Permissions</h3>
          <div className="space-y-4">
            <SettingsRow
              title="Course Creation"
              description="Define who can create new courses"
              colors={colors}
            >
              <select className={`w-full max-w-md p-2 rounded-md border ${
                theme === 'dark' ? 'border-[#1E2733] bg-[#0A0E13]/80' : 'border-gray-300 bg-white'
              } ${colors.text}`}>
                <option>Super Admin Only</option>
                <option>All Admin Levels</option>
                <option>Department Admins and Above</option>
              </select>
            </SettingsRow>
            
            <SettingsRow
              title="User Management"
              description="Define who can manage student accounts"
              colors={colors}
            >
              <select className={`w-full max-w-md p-2 rounded-md border ${
                theme === 'dark' ? 'border-[#1E2733] bg-[#0A0E13]/80' : 'border-gray-300 bg-white'
              } ${colors.text}`}>
                <option>All Admin Levels</option>
                <option>Super Admin Only</option>
                <option>Department Admins and Above</option>
              </select>
            </SettingsRow>
          </div>
        </div>
      </div>
    );
  }
  