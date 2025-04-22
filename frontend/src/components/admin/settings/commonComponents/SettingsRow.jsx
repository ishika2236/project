import React from "react";
import { useTheme } from "../../../../context/ThemeProvider";
export default function SettingsRow({ title, description, children, colors }) {
    return (
      <div className="pb-6 border-b border-opacity-10 border-gray-500 last:border-0">
        <div className="flex flex-col md:flex-row md:gap-10">
          <div className="md:w-1/3 mb-3 md:mb-0">
            <h3 className={`text-base font-medium ${colors.text}`}>{title}</h3>
            <p className={`text-sm ${colors.secondaryText} mt-1`}>{description}</p>
          </div>
          <div className="md:w-2/3">
            {children}
          </div>
        </div>
      </div>
    );
  }