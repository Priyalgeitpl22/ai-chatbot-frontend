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
import Badge from "@mui/material/Badge";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUnreadTaskCount } from "../redux/slice/taskSlice";
import { RootState, AppDispatch } from "../redux/store/store";

const sidebarAnimation = {
  initial: { x: -260 },
  animate: { x: 0 },
  transition: { type: "spring", stiffness: 100 },
};

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const unreadCount = useSelector((state: RootState) => state.task.unreadCount);

  useEffect(() => {
    if (user?.orgId) {
      dispatch(fetchUnreadTaskCount(user.orgId));
    }
  }, [dispatch, user?.orgId]);

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
          <Badge badgeContent={unreadCount} color="error" sx={{ mr: 1 }}>
            <Tickets size={18} />
          </Badge>
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
