import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { Link} from "react-router-dom";

export const SidebarContainer = styled(motion.aside)`
  padding: 20px;
  background-color: #ffffff;
  border-right: 1px solid #e2e8f0;
  margin-top: 6px;
  border-radius: 10px;
  min-width: 200px;
`;

export const HeaderContainer = styled.header`
  height: 64px;
  display: flex;
  align-items: center;
  padding: 10px;
  background: var(--white-fade-gradient);
  justify-content: space-between;
`;

export const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #64748b;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.2s;
  cursor: pointer;
  margin-bottom: 0.5rem;
  background-color: transparent;
  border: 1px solid #ddd;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  &:hover {
    background-color: var(--theme-color);
    color: #1e293b;
    border:none;
  }

  &.active {
    background-color: var(--theme-color) ;
    color: #1e293b;
  }
`;

export const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background: var(theme-color-light);
`;

export const MainContainer = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  overflow: hidden;
`;

export const Sidebar = styled.div`
  width: 250px;
  height: 100%;
  background-color: #fff;
  border-right: 1px solid #ddd;
`;

export const ContentArea = styled.div`
  flex-grow: 1;
  padding: 5px 10px;
  background-color: var(--theme-color-light);
`;

export const Button = styled.button`
font-weight: semibold;
width:100px;
padding: 8px 12px;
border: none;
border-radius: 6px;
color: #1e293b;
background-color:var(--theme-color);
cursor: pointer;
font-size: 16px;  
font-weight: 600;
font-family:var(--custom-font-family);

:hover {
  background-color: var(--theme-color);
  opacity: 0.8;
}
`;