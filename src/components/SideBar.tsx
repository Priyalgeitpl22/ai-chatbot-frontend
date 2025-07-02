import {
  HomeIcon,
  Sliders,
  Users,
  MessageSquare,
  Building,
  Settings,
  Tickets,
} from "lucide-react";
import {
  SidebarContainer,
  NavItem,
} from "../styles/layout.styled";
import { useLocation } from "react-router-dom";

const sidebarAnimation = {
  initial: { x: -260 },
  animate: { x: 0 },
  transition: { type: "spring", stiffness: 100 },
};

const Sidebar = () => {
  const location = useLocation();

  return (
    <SidebarContainer
      initial={sidebarAnimation.initial}
      animate={sidebarAnimation.animate}
      transition={sidebarAnimation.transition}
    >
      <nav style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <NavItem to="/" className={location.pathname === "/" ? "active" : ""}>
          <HomeIcon size={20} />
          Home
        </NavItem>
        <NavItem
          to="/chats"
          className={location.pathname.startsWith("/chats") ? "active" : ""}
        >
          <MessageSquare size={20} />
          Chats
        </NavItem>

        <NavItem
          to="/organization"
          className={location.pathname === "/organization" ? "active" : ""}
        >
          <Building/>
          Organization
        </NavItem>
        <NavItem
          to="/configuration"
          className={
            location.pathname === "/configuration" ? "active" : ""
          }
        >
          <Sliders size={18} />
          Configuration
        </NavItem>
        <NavItem
          to="/agents"
          className={location.pathname === "/agents" ? "active" : ""}
        >
          <Users size={18} />
          Agents
        </NavItem>
        <NavItem
          to="/tasks"
          className={location.pathname === "/tasks" ? "active" : ""}
        >
          <Tickets size={18} />
          Tickets
        </NavItem>
        <div style={{ flexGrow: 1 }}></div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <NavItem
            to="/settings"
            className={location.pathname === "/settings" ? "active" : ""}
          >
            <Settings size={18} />
            Settings
          </NavItem>
        </div>
      </nav>
    </SidebarContainer>
  );
};

export default Sidebar;
