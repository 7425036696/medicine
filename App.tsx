import React, { useState, useCallback } from 'react';
import { SearchBar } from './components/SearchBar';
import { ResultsDisplay } from './components/ResultsDisplay';
import { findAlternatives } from './services/geminiService';
import type { GeminiApiResponse } from './types';

const App: React.FC = () => {
  const [results, setResults] = useState<GeminiApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');


  const handleSearch = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setSearchQuery(query);
    try {
      const data = await findAlternatives(query);
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center mt-12 flex flex-col items-center">
            <svg className="animate-spin h-10 w-10 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
           <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Finding alternatives...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center mt-12 p-8 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong.</h2>
            <p>{error}</p>
        </div>
      );
    }
    
    if (hasSearched && results) {
        return <ResultsDisplay results={results} searchQuery={searchQuery} />;
    }

    return (
        <div className="text-center mt-12">
            <img src="https://storage.googleapis.com/aistudio-programmable-ui-project-assets/medicine-finder-hero.png" alt="Pharmacy" className="mx-auto rounded-lg shadow-lg mb-6 w-full max-w-md"/>
            <p className="text-lg text-gray-600 dark:text-gray-300">
                Enter a medicine name above to find alternatives with similar compositions.
            </p>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-teal-400">
                    Medicine Finder
                </span>
            </h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Discover alternative medicines with the same active ingredients.
          </p>
        </header>
        
        <div className="sticky top-4 z-10 p-2 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        <div className="mt-6">
            {renderContent()}
        </div>
      </main>
      <footer className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
        <p>Disclaimer: This tool is for informational purposes only. Always consult a healthcare professional before making any medical decisions.</p>
      </footer>
    </div>
  );
};

export default App;
