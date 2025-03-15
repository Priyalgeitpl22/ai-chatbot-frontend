import styled from '@emotion/styled';

export const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem; 
  margin-top: 10px;
  width: 300px;
  overflow-x: auto;
  padding: 0.5rem;
  white-space: nowrap;
  
  &::-webkit-scrollbar {
    display: none;
  }
  ms-overflow-style: none;
  scrollbar-width: none;
  scroll-behavior: smooth;
`;

interface FilterButtonProps {
  active?: boolean;
}

export const FilterButton = styled.button<FilterButtonProps>`
  display: inline-flex;
  align-items: center;
  border-radius: 16px;
  padding: 6px 10px;
  font-size: 0.9rem;
  gap: 0.5rem;
  cursor: pointer;
  outline: none;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
  box-shadow:  1px 2px 4px rgba(0, 0, 0, 0.1);
  font-family: 'Times New Roman';
  
  border: 2px solid ${({ active }) => (active ? '#8bc34a' : '#ddd')};
  background-color: ${({ active }) => (active ? '#8bc34a' : '#fff')};
  color: ${({ active }) => (active ? '#fff' : '#000')};

  &:hover {
    border-color: #8bc34a;
    background-color: #8bc34a;
    color: #fff;
  }
`;
