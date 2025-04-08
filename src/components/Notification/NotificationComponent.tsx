import React, { useState, useEffect } from "react";
import {
  Badge,
  IconButton,
  Menu,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useSocket } from "../../context/SocketContext";
import { NotificationContainer } from "./notification.styled";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";

const NotificationComponent: React.FC = () => {
  const [notifications, setNotifications] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const settings = useSelector((state: RootState) => state.settings.settings);
  const selectedSound = settings?.notification?.selectedSound || "chime.mp3";
  const isSoundOn = settings?.notification?.isSoundOn ?? true;
  
  const open = Boolean(anchorEl);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.off("notification");
    const playNotificationSound = () => {
      if (!isSoundOn) return;
    
      const audio = new Audio(`/sounds/${selectedSound}`);
      audio.play().catch((err) => console.error("🔊 Error playing sound:", err));
    };

    const handleNotification = (data: { message: string }) => {
      console.log("📩 Notification received:", data.message);
      toast.success("📩 New Notification received:");
      setNotifications((prev) => [...prev, data.message]);
      playNotificationSound();
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket,selectedSound, isSoundOn]);

  

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        sx={{
          padding: "5px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "10px"
        }}
        onClick={handleClick}
      >
        <Badge
          badgeContent={notifications.length}
          style={{
            fontSize: "10px",
            minWidth: "14px",
            lineHeight: 1,
            padding: "0 4px",
            height: "14px",
          }}
          color="error"
        >
          <NotificationsIcon
            sx={{ fontSize: 25, color: "var(--theme-color-dark)" }}
          />
        </Badge>
        <Typography variant="subtitle2" sx={{ fontSize: 10, color: "#696969" }}>
          Notifications
        </Typography>
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <NotificationContainer>
          <Typography variant="h6" sx={{ px: 2, py: 1 }}>
            Notifications
          </Typography>
          <List>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <ListItem key={index} divider>
                  <ListItemText primary={notification} />
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" sx={{ px: 2, py: 1 }}>
                No new notifications
              </Typography>
            )}
          </List>
        </NotificationContainer>
      </Menu>
    </>
  );
};

export default NotificationComponent;
