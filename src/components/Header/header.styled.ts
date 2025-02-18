import styled from '@emotion/styled';

export const SearchBar = styled.div`
  display: flex;
  height: 27px;
  width: 100%;
  align-items: center;
  background-color: #f1f5f9;
  border-radius: 0.5rem;
  padding: 0.7rem 1rem;
  border: 1px solid var(--theme-color);
  
  input {
    background: none;
    border: none;
    outline: none;
    color: #64748b;
    width: 100%;

    &::placeholder {
      color: #94a3b8;
    }
  }
`;
export const NotificationBell = styled.button`
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
  margin-right: 0.5rem;

  &:hover {
    background-color: #f1f5f9;
    color: #1e293b;
  }
`;
export const ProfileIcon = styled.button`
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px; 
  height: 50px; 
  opacity: 1;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  &:hover {
    background-color: #f1f5f9;
    color: #1e293b;
    opacity: 0.8;
  }
`;
export const UIContainer = styled.div`
  display: flex;
  width: fit-content;
  align-items: center;
  background-color: #f1f5f9;
  border-radius: 0.5rem;
  flex: none;
`;

export const LogoContainer = styled.div`
  display: flex;
  width: 30%;
  gap: 10px;
`;

export const AppTitle = styled.p`
  margin: 0 !important;
  font-size: 26px;
  font-weight: 600;
  align-self: end;

`
export const AppSubtitle = styled.p`
  margin: 0 !important;
  font-size: 12px;
  align-self: start;
`

export const TitleContainer = styled.div`
  display: grid;
  align-items: center;
  justify-content: center;
  text-align: left;
`