import  { useState } from 'react';

interface SearchProps {
  onSearch: (term: string) => void;
}

function Search( { onSearch }: SearchProps  ) {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleButtonClick = () => {
    setSearchVisible(!searchVisible);
  };

  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleButtonClick}
        className="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </button>
      {searchVisible && (
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          className="ml-2 p-2 border rounded-lg"
          placeholder="Search messages"
        />
      )}
    </div>
  );
}

export default Search;
