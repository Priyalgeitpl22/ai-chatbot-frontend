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
  Button,
  Paper,
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
    createdAt: string;
  };
}
interface GroupedNotification {
  messages: string[];
  count: number;
  latestMessage: string;
  thread?: NotificationData["thread"];
  read?: boolean;
}

const NotificationComponent: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [groupedNotifications, setGroupedNotifications] = useState<Record<string, GroupedNotification>>({});
  const [menuAnchor, setMenuAnchor] = useState<{ [key: number]: HTMLElement | null }>({});
  const settings = useSelector((state: RootState) => state.settings.settings);
  const { user } = useSelector((state: RootState) => state.user);
  // const [threadId,setThreadId] = useState("")
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
      const threadId = data.thread?.id;
      if (!threadId) return;
      // setThreadId(threadId)
      setGroupedNotifications((prev) => {
        const existing = prev[threadId];
        const newCount = existing ? existing.count + 1 : 1;
        return {
          [threadId]: {
            messages: [...(existing?.messages || []), data.message],
            count: newCount,
            latestMessage: data.message,
            thread: data.thread,
            read: false,
          },
          ...prev,
        };
      });
      // toast.success(`📩 Message from ${data.thread?.name || "Unknown Visitor"}: ${data.message}`);
toast.custom(() => (
  <Paper
    elevation={6}
    sx={{
      display: 'flex',
      alignItems: 'flex-start',
      backgroundColor: 'var(--theme-color-light)',
      color: 'black',
      borderRadius: 2,
      p: 2,
      minWidth: 300,
    }}
  >
    <div style={{ flex: 1 }}>
      <Typography variant="subtitle1" fontWeight={600}>
        📩 Message from {data.thread?.name || 'Unknown Visitor'}
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.5 }}>
        {data.message}
      </Typography>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginLeft: 16 }}>
      <Button
        variant="contained"
        size="small"
        color="success"
        sx={{ mb: 1, textTransform: 'none', borderRadius: 2 }}
        onClick={() => {
          handleNotificationClick(threadId)
        }}
      >
        Reply
      </Button>
    </div>
  </Paper>
));


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

  const handleMarkAsRead = (threadId: string) => {
    setGroupedNotifications((prev) => ({
      ...prev,
      [threadId]: {
        ...prev[threadId],
        read: true,
        count: 0,
      },
    }));
    toast("✅ Marked as read");
  };

  const handleDelete = (threadId: string) => {
    setGroupedNotifications((prev) => {
      const { [threadId]: _, ...rest } = prev;
      return rest;
    });
    toast("🗑️ Deleted notification");
  };

  const handleNotificationClick = (threadId?: string) => {

    if (!threadId) return;
    setGroupedNotifications((prev) => ({
      ...prev,
      [threadId]: {
        ...prev[threadId],
        read: true,
        count: 0,
      },
    }));
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
        <Badge badgeContent={Object.values(groupedNotifications).reduce((sum, n) => sum + n.count, 0)} color="error">
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
              setGroupedNotifications({});
              handleClose();
            }}>
              Clear all
            </ClearAllBtn>
          </NotificationHeader>
          <List sx={{ padding: "0 !important" }}>
            {Object.entries(groupedNotifications).length > 0 ? (
              Object.entries(groupedNotifications).map(([threadId, notification], index) => (
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
                          handleMarkAsRead(threadId);
                          handleMenuClose(index)();
                        }}>
                          <CheckSharp fontSize="small" sx={{ mr: 1 }} /> Mark as read
                        </MenuItem>}
                        <MenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(threadId);
                          handleMenuClose(index)();
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
                          {notification.thread?.name || "User"}{" "}
                          {notification.count > 1 && (
                            <Badge badgeContent={notification.count} color="primary" sx={{
                              ml: 1, "& .MuiBadge-badge": {
                                fontSize: "10px",
                                height: "16px",
                                minWidth: "16px",
                                padding: "0 4px",
                              },
                            }} />
                          )}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: "#64748b",fontSize: "12px" }}>
                          {notification.latestMessage.length > 50
                            ? `${notification.latestMessage.slice(0, 50)}...`
                            : notification.latestMessage}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748b",fontSize: "10px" }}>
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
