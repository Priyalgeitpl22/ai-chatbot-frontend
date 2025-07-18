import { HeaderContainer } from "../../styles/layout.styled";
import {
  AppSubtitle,
  AppTitle,
  LogoContainer,
  TitleContainer,
} from "../Header/header.styled";
import UserProfileMenu from "../User-Profile/UserProfile";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import { useState, useCallback, useEffect } from "react";
import { StatusIndicator } from "../Chats/ChatSideBar/chatSidebar.styled";
import { Switch, Typography } from "@mui/material";
import { useSocket } from "../../context/SocketContext";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import NotificationComponent from "../Notification/NotificationComponent";
import logo from "../../../public/logo3.png";
import { HeaderOptions } from "../../pages/Home/home.styled";
import {Toaster} from "react-hot-toast";
import {updateStatus}  from "../../redux/slice/agentsSlice"

const Header = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const { socket } = useSocket();
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleStatusChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const online = event.target.checked;
      setIsOnline(online);
      if (socket && user?.id) {
        socket.emit("agentOnline", {
          id: user.id,
          online: online,
          name: user.fullName,
          orgId:user.orgId
        });
      }
      if(online){

        dispatch(updateStatus({online:online,userId:user?.id||""}))
      }else{
        dispatch(updateStatus({online:online,userId:user?.id||""}))
      }
     
    },
    [socket, user?.id]
  );

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (!token) {
      navigate("/login");
    }
  }, [user, dispatch, navigate]);

  useEffect(() => {
    if (!socket || !user?.id) return;

    setIsOnline(user.online);

    if (user.online) {
      socket.emit("agentOnline", {
        id: user.id,
        online: user.online,
        name: user.fullName,
      });
    }

    const handleAgentStatusUpdate = ({
      userId,
      online,
    }: {
      userId: string;
      online: boolean;
    }) => {
      setOnlineUsers((prev) => ({ ...prev, [userId]: online }));
    };
    console.log("onlineUsers", onlineUsers);

    socket.on("agentStatusUpdate", handleAgentStatusUpdate);
        if(!socket)return;
        socket.on("onlineStatus",({userId,online})=>{
         dispatch(updateStatus({online:online,userId:userId}))
        })
   
    return () => {
      socket.off("agentStatusUpdate", handleAgentStatusUpdate);
    };
  }, [socket, user?.id,user?.online, dispatch]);

  return (
    <HeaderContainer>
      <LogoContainer>
        <img src={logo} style={{ width: "55px", height: "55px", cursor:'pointer' }} onClick={() => navigate("/")}></img>
        <TitleContainer>
          <AppTitle>Golden Bot</AppTitle>
          <AppSubtitle>Automate, Assist, Accelerate</AppSubtitle>
        </TitleContainer>
      </LogoContainer>
      <HeaderOptions>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            padding: '0px 8px'
          }}
        >
          <Switch
            size="small"
            checked={isOnline}
            onChange={handleStatusChange}
            inputProps={{ "aria-label": "controlled" }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "2px",
            }}
          >
            <Typography variant="subtitle2" fontFamily={'var(--custom-font-family)'} sx={{ fontSize: 10, color: '#696969' }}>
              {isOnline ? "Online" : "Offline"}
            </Typography>
            <StatusIndicator online={isOnline} />
          </div>
        </div>
        <NotificationComponent />
        {user && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <UserProfileMenu />
          </div>
        )}
      </HeaderOptions>
      <Toaster />
    </HeaderContainer>
  );
};

export default Header;
