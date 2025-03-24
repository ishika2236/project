import React from 'react';
import { Check, X } from 'lucide-react';

const ValidationIcon = ({ isValid }) => {
  if (isValid === null) return null;
  
  return isValid ? (
    <Check size={16} className="text-green-500" />
  ) : (
    <X size={16} className="text-red-500" />
  );
};

export default ValidationIcon;