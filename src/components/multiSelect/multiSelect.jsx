import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

const MultiSelect = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [options, setOptions] = useState([
    'React', 'Vue', 'Angular', 'Svelte', 'Node.js', 'TypeScript'
  ]);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'a' && isOpen) {
        e.preventDefault();
        const unselectedOptions = options.filter(opt => !selectedItems.includes(opt));
        setSelectedItems([...selectedItems, ...unselectedOptions]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, options, selectedItems]);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    if (!selectedItems.includes(option)) {
      setSelectedItems([...selectedItems, option]);
    }
    setSearchTerm('');
  };

  const handleRemove = (option) => {
    setSelectedItems(selectedItems.filter(item => item !== option));
  };

  const handleAddNew = () => {
    if (searchTerm && !options.includes(searchTerm)) {
      setOptions([...options, searchTerm]);
      handleSelect(searchTerm);
    }
  };

  const highlightMatch = (text) => {
    if (!searchTerm) return text;

    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return (
      <>
        {parts.map((part, index) => 
          part.toLowerCase() === searchTerm.toLowerCase() ? (
            <span key={index} className="underline">{part}</span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className="w-full max-w-md" ref={dropdownRef}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Chart type
    </label>
    <div className="relative">
      <div 
         className="min-h-[42px] p-2 border-2 border-blue-500 rounded-md bg-white cursor-pointer flex flex-wrap gap-2"
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
      >
        {selectedItems.map((item) => (
          <span
            key={item}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center gap-1 text-sm"
          >
            {item}
            <X
              size={14}
              className="cursor-pointer hover:text-blue-600"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(item);
              }}
            />
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          className="outline-none flex-1 min-w-[60px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && (
        <div className="absolute w-full mt-1 bg-white border rounded-md shadow-lg z-10">
          <div className="p-2">
            {filteredOptions.map((option) => (
              <div
                key={option}
                className={`p-2 cursor-pointer rounded ${
                  selectedItems.includes(option)
                    ? 'bg-blue-50 text-blue-800'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => handleSelect(option)}
              >
                {highlightMatch(option)}
              </div>
            ))}
            {searchTerm && !filteredOptions.length && (
              <div
                className="p-2 cursor-pointer text-gray-600 hover:bg-gray-100 flex justify-between items-center"
                onClick={handleAddNew}
              >
                {searchTerm}
                <span className="text-gray-400">(New Value)</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="absolute right-3 top-3">
        {isOpen ? (
          <ChevronUp className="text-gray-400" size={20} />
        ) : (
          <ChevronDown className="text-gray-400" size={20} />
        )}
      </div>
    </div>
  </div>
  );
};

export default MultiSelect;