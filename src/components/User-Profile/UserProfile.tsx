import React, { useState } from "react";
import { Menu, Typography } from "@mui/material";
import {
  ProfileIcon,
  ProfileNameContainer,
  StyledMenuItem,
  UserProfileContainer,
} from "./UserProfile.styled";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slice/authSlice";
import { AppDispatch, RootState } from "../../redux/store/store";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ProfileDetail from "./Profile-Details/ProfileDetail";
import { useSocket } from "../../context/SocketContext";
import { Logout } from "@mui/icons-material";
import ConfirmDialog from "../../layout/ConfirmDialog";
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  orgId: string;
  aiOrgId: number;
  profilePicture: string;
}

const UserProfileMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [openLogout, setOpenLogout] = useState<boolean>(false);
  const { socket } = useSocket()
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.user);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (action: () => void) => {
    handleMenuClose();
    action();
  };

  const handleLogout = async () => {
    await dispatch(logoutUser({ userId: user?.id || "" }));
    if (socket && user?.id) {
      socket.emit("agentOnline", {
        id: user.id,
        online: false,
        name: user.fullName,
        orgId: user.orgId
      });
    }
    handleMenuClose();
    navigate("/login");
  };

  const isMenuOpen = Boolean(anchorEl);

  return (
    <UserProfileContainer>
      <ProfileNameContainer>
        <Typography variant="subtitle2" fontFamily={"var(--custom-font-family)"} sx={{ fontWeight: 500, fontSize: 14 }}>
          {user?.fullName || "Unknown User"}
        </Typography>
        <Typography
          variant="body2"
          fontFamily={"var(--custom-font-family)"}
          sx={{ fontWeight: 500, fontSize: 12 }}
          color="textSecondary"
        >
          {user?.role || "N/A"}
        </Typography>
      </ProfileNameContainer>

      <ProfileIcon onClick={handleMenuOpen}>
        {user?.profilePicture ? (
          <img
            src={user.profilePicture}
            alt="Profile"
            style={{ width: "35px", height: "35px"}}
          />
        ) : (
          <AccountCircleIcon style={{ width: "35px", height: "35px" }} />
        )}
      </ProfileIcon>

      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        MenuListProps={{ "aria-labelledby": "profile-menu-button" }}
        sx={{
          "& .MuiMenu-paper": {
            minWidth: "200px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <StyledMenuItem
          onClick={() => handleMenuItemClick(() => setIsProfileOpen(true))}
        >
          <Typography variant="body2" fontFamily={"var(--custom-font-family)"} color="textSecondary">
            Profile
          </Typography>
        </StyledMenuItem>

        <StyledMenuItem onClick={handleMenuClose}>
          <Link
            to="/change-password"
            state={{ email: user?.email }}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography variant="body2" fontFamily={"var(--custom-font-family)"} color="textSecondary">
              Change Password
            </Typography>
          </Link>
        </StyledMenuItem>

        <StyledMenuItem onClick={() => { handleMenuClose(); setOpenLogout(true) }}>
          <Typography variant="body2" fontFamily={"var(--custom-font-family)"} color="textSecondary">
            Logout
          </Typography>
        </StyledMenuItem>
      </Menu>
      <ConfirmDialog
        open={openLogout}
        onClose={() => setOpenLogout(false)}
        onConfirm={handleLogout}
        title="Log Out?"
        description="Are you sure you want to log out from your account?"
        icon={<Logout sx={{ fontSize: 38, color: "var(--error-color)" }} />}
        confirmText="Log Out"
      />
      <ProfileDetail
        open={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userData={user as User | null}
      />
    </UserProfileContainer>
  );
};

export default UserProfileMenu;
