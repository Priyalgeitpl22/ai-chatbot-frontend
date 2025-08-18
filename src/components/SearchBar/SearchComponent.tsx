import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { SearchBar } from './search.styled';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store/store';
import { searchThreads, getAllThreads } from '../../redux/slice/threadSlice';

// Custom hook to debounce a value
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const SearchComponent: React.FC = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  
  const debouncedQuery = useDebounce(query, 1000);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      dispatch(searchThreads(debouncedQuery));
    } else {
      dispatch(getAllThreads({page:1}));
    }
  }, [debouncedQuery, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <SearchBar>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <Search size={20} color="#64748b" fontFamily='var(--custom-font-family)' />
        <input
          type="text"
          placeholder="Search conversations..."
          value={query}
          onChange={handleChange}
          style={{ flex: 1, marginLeft: '8px', fontFamily: 'var(--custom-font-family)' }}
        />
      </div>
    </SearchBar>
  );
};

export default SearchComponent;
