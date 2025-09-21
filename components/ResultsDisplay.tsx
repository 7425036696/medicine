import React from 'react';
import type { GeminiApiResponse } from '../types';
import { MedicineCard } from './MedicineCard';

interface ResultsDisplayProps {
  results: GeminiApiResponse;
  searchQuery: string;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, searchQuery }) => {
  const { searchedMedicine, categories } = results;
  const hasAlternatives = categories.some(cat => cat.medicines.length > 0);

  if (!searchedMedicine) {
    return (
      <div className="text-center mt-12 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Medicine Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300">
          We couldn't identify a medicine matching "{searchQuery}". Please check the spelling and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mt-8">
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 pb-2 border-b-2 border-primary-500">You Searched For</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
             <div className="rounded-lg shadow-lg border-2 border-primary-500 p-1 bg-gradient-to-br from-primary-100 to-blue-100 dark:from-primary-900 dark:to-blue-900">
                <MedicineCard medicine={searchedMedicine} />
            </div>
        </div>
      </section>

      {hasAlternatives ? (
        categories.map((category, index) => (
          category.medicines.length > 0 && (
            <section key={index} className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 pb-2 border-b-2 border-primary-500">{category.title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {category.medicines.map((medicine, medIndex) => (
                  <MedicineCard key={medIndex} medicine={medicine} />
                ))}
              </div>
            </section>
          )
        ))
      ) : (
        <div className="text-center mt-12 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No Alternatives Found</h2>
          <p className="text-gray-600 dark:text-gray-300">
            While we found information for "{searchedMedicine.brandName}", we couldn't find any alternative medicines at this time.
          </p>
        </div>
      )}
    </div>
  );
};
