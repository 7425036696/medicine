import React from 'react';
import type { Medicine } from '../types';

interface MedicineCardProps {
  medicine: Medicine;
}

const PillIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
    </svg>
);

const BeakerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 003.86.517l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 01-.517-3.86l2.387-.477a2 2 0 001.022-.547z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 012 2v2a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h4z" />
    </svg>
);

const BuildingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 11h16v2H2z" />
        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v5H3V3zm2-1a1 1 0 00-1 1v2h14V3a1 1 0 00-1-1H5z" clipRule="evenodd" />
        <path d="M4 15h4v2H4zM12 15h4v2h-4z" />
    </svg>
);


export const MedicineCard: React.FC<MedicineCardProps> = ({ medicine }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 transform hover:scale-105 hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full">
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{medicine.brandName}</h3>
         <div className="flex items-center text-gray-500 dark:text-gray-400 mb-3 text-sm">
            <BuildingIcon />
            <span>{medicine.company}</span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
            <BeakerIcon />
            <p className="text-sm"><span className="font-semibold">Salt:</span> {medicine.salt}</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center">
        <PillIcon />
        <p className="text-gray-700 dark:text-gray-200 font-medium">
          Dosage: <span className="text-primary-600 dark:text-primary-400">{medicine.dosage}</span>
        </p>
      </div>
    </div>
  );
};
