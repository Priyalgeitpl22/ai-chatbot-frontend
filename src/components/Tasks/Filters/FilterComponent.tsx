import React from 'react';
import { FilterContainer, FilterButton } from './filterComponent.styled';
import { SlidersHorizontal, X } from 'lucide-react';

interface FilterComponentProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

interface FilterItem {
  type: string;
  label: string;
  alwaysActive?: boolean;
}

const FilterComponent: React.FC<FilterComponentProps> = ({ activeFilter, setActiveFilter }) => {
  const filters: FilterItem[] = [
    { type: 'filter', label: 'Filter', alwaysActive: true },
    { type: 'new', label: 'New' },
    { type: 'unassigned', label: 'Unassigned' },
    { type: 'assigned', label: 'Assigned' },
  ];

  const handleActivate = (filterType: string) => {
    if (filterType !== 'filter' && activeFilter !== filterType) {
      setActiveFilter(filterType);
    }
  };

  return (
    <FilterContainer>
      {filters.map((filter) => (
        <FilterButton
          key={filter.type}
          active={filter.alwaysActive || activeFilter === filter.type}
          onClick={() => handleActivate(filter.type)}
        >
          {filter.type === 'filter' && <SlidersHorizontal size={16} />}
          {filter.label}
          {filter.type !== 'filter' && activeFilter === filter.type && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                setActiveFilter('');
              }}
            >
              <X size={16} />
            </span>
          )}
        </FilterButton>
      ))}
    </FilterContainer>
  );
};

export default FilterComponent;
