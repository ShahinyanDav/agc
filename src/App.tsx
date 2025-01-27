import React, { useState, useEffect } from 'react';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';
import { BiReset } from 'react-icons/bi';

interface PriceOption {
  label: string;
  value: string;
  isBlue?: boolean;
}

interface Section {
  name: string;
  textColor?: string;
  options: PriceOption[];
}

const sections: Section[] = [
  {
    name: 'AGC',
    options: [
      { label: '$50', value: '50' },
      { label: '$40', value: '40' },
      { label: '$36', value: '36' },
      { label: '$26', value: '26' },
      { label: '$20', value: '20' },
      { label: '$12', value: '12' },
      { label: '$10', value: '10' },
      { label: '$6', value: '6' },
      { label: '$2', value: '2' },
      { label: 'Double', value: 'double' },
      { label: 'Half', value: 'half' },
    ]
  },
  {
    name: 'Busy',
    textColor: 'text-red-600',
    options: [
      { label: '$40', value: '40' },
      { label: '$32', value: '32' },
      { label: '$30', value: '30' },
      { label: '$22', value: '22' },
      { label: '$18', value: '18' },
      { label: '$12', value: '12' },
      { label: '$10', value: '10' },
      { label: '$4', value: '4' },
      { label: 'Double', value: 'double' },
      { label: 'Delete', value: 'delete' },
    ]
  },
  {
    name: 'Pepsi',
    textColor: 'text-blue-600',
    options: [
      { label: '$70', value: '70', isBlue: true },
      { label: '$40', value: '40' },
      { label: '$30', value: '30' },
      { label: '$20', value: '20' },
      { label: '$14', value: '14' },
      { label: '$10', value: '10' },
      { label: '$2', value: '2' },
      { label: 'Double', value: 'double' },
      { label: 'Half', value: 'half' },
    ]
  },
  {
    name: 'ElitShin',
    options: [
      { label: '$40', value: '40', isBlue: true },
      { label: '$30', value: '30' },
      { label: '$20', value: '20', isBlue: true },
      { label: '$20', value: '20-2' },
      { label: '$10', value: '10' },
      { label: '$1', value: '1' },
    ]
  }
];

function App() {
  const [muted, setMuted] = useState(() => {
    const savedMuted = localStorage.getItem('muted');
    return savedMuted ? JSON.parse(savedMuted) : false;
  });

  const [selectedValues, setSelectedValues] = useState<Record<string, Set<string>>>(() => {
    const savedValues = localStorage.getItem('selectedValues');
    if (savedValues) {
      const parsed = JSON.parse(savedValues);
      // Convert the arrays back to Sets
      return Object.fromEntries(
        Object.entries(parsed).map(([key, value]) => [key, new Set(value as string[])])
      );
    }
    return {};
  });

  // Save to localStorage whenever values change
  useEffect(() => {
    localStorage.setItem('muted', JSON.stringify(muted));
  }, [muted]);

  useEffect(() => {
    // Convert Sets to arrays for JSON serialization
    const serializable = Object.fromEntries(
      Object.entries(selectedValues).map(([key, value]) => [key, Array.from(value)])
    );
    localStorage.setItem('selectedValues', JSON.stringify(serializable));
  }, [selectedValues]);

  const handleReset = () => {
    setSelectedValues({});
  };

  const handleResetGreen = () => {
    setSelectedValues(prev => {
      const newValues = { ...prev };
      sections.forEach(section => {
        const sectionSet = new Set(newValues[section.name] || []);
        section.options.forEach(option => {
          if (!option.isBlue && sectionSet.has(option.value)) {
            sectionSet.delete(option.value);
          }
        });
        if (sectionSet.size > 0) {
          newValues[section.name] = sectionSet;
        } else {
          delete newValues[section.name];
        }
      });
      return newValues;
    });
  };

  const handleResetBlue = () => {
    setSelectedValues(prev => {
      const newValues = { ...prev };
      sections.forEach(section => {
        const sectionSet = new Set(newValues[section.name] || []);
        section.options.forEach(option => {
          if (option.isBlue && sectionSet.has(option.value)) {
            sectionSet.delete(option.value);
          }
        });
        if (sectionSet.size > 0) {
          newValues[section.name] = sectionSet;
        } else {
          delete newValues[section.name];
        }
      });
      return newValues;
    });
  };

  const toggleOption = (sectionName: string, value: string) => {
    setSelectedValues(prev => {
      const newValues = { ...prev };
      if (!newValues[sectionName]) {
        newValues[sectionName] = new Set();
      }
      
      const sectionSet = new Set(newValues[sectionName]);
      if (sectionSet.has(value)) {
        sectionSet.delete(value);
      } else {
        sectionSet.add(value);
      }
      
      if (sectionSet.size > 0) {
        newValues[sectionName] = sectionSet;
      } else {
        delete newValues[section.name];
      }
      return newValues;
    });
  };

  const renderLabel = (option: PriceOption) => {
    if (!option.label.startsWith('$')) {
      return <span className="text-gray-700">{option.label}</span>;
    }

    return option.isBlue ? (
      <span className="text-blue-600">{option.label}</span>
    ) : (
      <span className="text-green-800">{option.label}</span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">AGC</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setMuted(!muted)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              {muted ? <FiVolumeX size={24} /> : <FiVolume2 size={24} />}
              <span className="ml-2">{muted ? 'Unmute' : 'Mute'}</span>
            </button>
            <button
              onClick={handleResetGreen}
              className="p-2 rounded-md hover:bg-gray-100 text-green-800"
            >
              <BiReset size={24} />
              <span className="ml-2">Reset Green</span>
            </button>
            <button
              onClick={handleResetBlue}
              className="p-2 rounded-md hover:bg-gray-100 text-blue-600"
            >
              <BiReset size={24} />
              <span className="ml-2">Reset Blue</span>
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <BiReset size={24} />
              <span className="ml-2">Reset All</span>
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.name} className="border-b pb-6 last:border-b-0">
              <h2 className={`text-xl font-semibold mb-4 ${section.textColor || ''}`}>
                {section.name}
              </h2>
              <div className="flex flex-wrap gap-3">
                {section.options.map((option) => (
                  <label
                    key={`${section.name}-${option.value}`}
                    className="inline-flex items-center"
                  >
                    <input
                      type="checkbox"
                      className={`form-checkbox h-5 w-5 rounded border-green-500 ${
                        option.isBlue ? 'text-blue-600' : 'text-green-600'
                      }`}
                      checked={selectedValues[section.name]?.has(option.value) || false}
                      onChange={() => toggleOption(section.name, option.value)}
                    />
                    <span className="ml-2">
                      {renderLabel(option)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;