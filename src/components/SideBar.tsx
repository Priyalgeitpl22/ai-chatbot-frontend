import {
  HomeIcon,
  Sliders,
  Users,
  MessageSquare,
  Building,
  LayoutList,
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
      <nav>
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
          to="/settings/configuration"
          className={
            location.pathname === "/settings/configuration" ? "active" : ""
          }
        >
          <Sliders size={18} />
          Configuration
        </NavItem>
        <NavItem
          to="/settings/agents"
          className={location.pathname === "/settings/agents" ? "active" : ""}
        >
          <Users size={18} />
          Agents
        </NavItem>
        <NavItem
          to="/tasks"
          className={location.pathname === "/tasks" ? "active" : ""}
        >
          <LayoutList size={18} />
          Tasks
        </NavItem>
        {/* <SettingsWrapper>
          <div onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
            <NavItem
              to="#"
              className={
                location.pathname.includes("/settings") ? "active" : ""
              }
            >
              <Settings />
              Settings
              {isSettingsOpen ? (
                <ChevronUp style={{ marginLeft: "auto" }} />
              ) : (
                <ChevronDown style={{ marginLeft: "auto" }} />
              )}
            </NavItem>
          </div>

          {isSettingsOpen && (
            <SubmenuWrapper>
              <SubNavItem
                to="/settings/configuration"
                className={
                  location.pathname === "/settings/configuration"
                    ? "active"
                    : ""
                }
              >
                <Sliders size={18} />
                Configuration
              </SubNavItem>
              <SubNavItem
                to="/settings/agents"
                className={
                  location.pathname === "/settings/agents" ? "active" : ""
                }
              >
                <Users size={18} />
                Agents
              </SubNavItem>
            </SubmenuWrapper>
          )}
        </SettingsWrapper> */}
      </nav>
    </SidebarContainer>
  );
};

export default Sidebar;
