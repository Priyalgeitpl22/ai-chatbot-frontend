import React, { useState, useEffect } from "react";
import {
  Badge,
  IconButton,
  Menu,
  List,
  ListItem,
  ListItemText,
  Typography,
  MenuItem,
  Box,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useSocket } from "../../context/SocketContext";
import { ClearAllBtn, CustomListItemAvatar, NotificationContainer, NotificationHeader, NotificationTitle } from "./notification.styled";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { CheckSharp, Delete } from "@mui/icons-material";
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';

interface NotificationData {
  message: string;
  thread?: {
    id: string;
    name?: string;
    avatarUrl?: string;
    createdAt?: string;
  };
  read?: boolean;
}

const NotificationComponent: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuAnchor, setMenuAnchor] = useState<{ [key: number]: HTMLElement | null }>({});
  const settings = useSelector((state: RootState) => state.settings.settings);
  const { user } = useSelector((state: RootState) => state.user);
  const selectedSound =
    settings?.notification?.selectedSound ||
    user?.userSettings?.settings?.notification?.selectedSound;

  const isSoundOn =
    settings?.notification?.isSoundOn ??
    user?.userSettings?.settings?.notification?.isSoundOn;
  const navigate = useNavigate();

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

    const handleNotification = (data: NotificationData) => {
      toast.success(`📩 Message from ${data.thread?.name || "Unknown Visitor"}: ${data.message}`);
      setNotifications((prev) => [...prev, data]);
      playNotificationSound();
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket, selectedSound, isSoundOn]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (index: number) => (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchor((prev) => ({ ...prev, [index]: event.currentTarget }));
  };

  const handleMenuClose = (index: number) => () => {
    setMenuAnchor((prev) => ({ ...prev, [index]: null }));
  };

  const handleMarkAsRead = (index: number) => {
    setNotifications((prev) =>
      prev.map((n, i) => (i === index ? { ...n, read: true } : n))
    );
    toast("✅ Marked as read");
    handleMenuClose(index)();
  };

  const handleDelete = (index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
    toast("🗑️ Deleted notification");
    handleMenuClose(index)();
  };

  const handleNotificationClick = (threadId?: string) => {
    // setNotifications((prev) =>
    //   prev.filter((notification) => notification.thread?.id !== threadId)
    // );
    console.info("Thread ID:", threadId);
    navigate("/chats", { state: { threadId, timestamp: Date.now() } });
    handleClose();
  }

  return (
    <>
      <IconButton
        sx={{
          padding: "5px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
        onClick={handleClick}
      >
        <Badge
          badgeContent={notifications.length}
          color="error"
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "10px",
              width: "14px",
              height: "14px",
            },
          }}
        >
          <NotificationsIcon sx={{ fontSize: 25, color: "var(--theme-color-dark)" }} />
        </Badge>
        <Typography variant="subtitle2" sx={{ fontSize: 10, color: "#696969" }}>
          Notifications
        </Typography>
      </IconButton>

      <Menu sx={{
        "& .MuiMenu-paper": {
          outline: "1px solid #ccc",
        }
      }} anchorEl={anchorEl} open={open} onClose={handleClose}>
        <NotificationContainer>
          <NotificationHeader >
            <NotificationTitle>
              Notifications
            </NotificationTitle>
            <ClearAllBtn onClick={() => {
              setNotifications([]);
              handleClose();
            }}>
              Clear all
            </ClearAllBtn>
          </NotificationHeader>
          <List sx={{ padding: "0 !important" }}>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <ListItem onClick={() => handleNotificationClick(notification.thread?.id)}
                  sx={{
                    backgroundColor: notification.read ? "#fff" : "#e8f4ff", 
                    transition: "background-color 0.3s",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: notification.read ? "#fff" : "#e8f4ff", 
                    },
                    "&.MuiList-root": {
                      padding: "0px",
                      margin: "0px",
                    },
                    "&.MuiListItem-root": {
                      paddingBlock: "0px !important",
                    }
                  }}
                  key={index} divider alignItems="flex-start" secondaryAction={
                    <>
                      <IconButton edge="end" onClick={(e) => {
                        e.stopPropagation();
                        handleMenuClick(index)(e);
                      }}>
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                      <Menu
                        sx={{
                          "& .MuiMenu-paper": {
                            outline: "1px solid #ccc",
                          },
                          "& .MuiMenu-list": {
                            padding: "5px 8px",
                            borderRadius: "5px",
                            fontSize: "14px !important",
                            backgroundColor: "#fff",
                          },
                        }}
                        anchorEl={menuAnchor[index]}
                        open={Boolean(menuAnchor[index])}
                        onClose={handleMenuClose(index)}
                      >
                        {!notification.read && <MenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(index);
                        }}>
                          <CheckSharp fontSize="small" sx={{ mr: 1 }} /> Mark as read
                        </MenuItem>}
                        <MenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(index);
                        }}>
                          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
                        </MenuItem>
                      </Menu>
                    </>
                  }>
                  <CustomListItemAvatar>
                    <Person2OutlinedIcon />
                  </CustomListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" flexDirection="column">
                        <Typography variant="body2" fontWeight="bold">
                          {notification.thread?.name || "User"}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: "#64748b" }}>
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {dayjs(notification.thread?.createdAt || new Date()).format("hh:mm A")}
                        </Typography>
                      </Box>
                    }
                  />
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
