import { List, ListItemIcon, ListItemText, Typography } from "@mui/material";
import SecurityIcon from '@mui/icons-material/Security';

import {
  SettingsListContainer,
  SettingsListHeader,
  StyledIconBox,
  StyledListItemButton
} from "./settingsList.styled";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";

interface SettingsListProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const SettingsList = ({ selectedTab, setSelectedTab }: SettingsListProps) => {
  const { user, loading } = useSelector((state: RootState) => state.user);

  if (loading || user === null) {
    return (
      <SettingsListContainer>
        <SettingsListHeader>
          <Typography fontFamily="var(--custom-font-family)" variant="h6" sx={{ fontWeight: 500, color: "#1e293b" }}>
            Settings
          </Typography>
        </SettingsListHeader>
      </SettingsListContainer>
    );
  }

  const isSecurityAllowed = ["Admin", "Agent"].includes(user.role);

  const settingsItems = [
    { icon: <NotificationsNoneIcon />, label: "Notifications" },
    { icon: <SecurityIcon />, label: "Security", disabled:!isSecurityAllowed},
  ];
  
  return (
    <SettingsListContainer>
      <SettingsListHeader>
        <Typography fontFamily="var(--custom-font-family)" variant="h6" sx={{ fontWeight: 500, color: "#1e293b" }}>
          Settings
        </Typography>
      </SettingsListHeader>
      <List>
        {settingsItems.map((item) => (
          <StyledListItemButton
            key={item.label}
            selected={selectedTab === item.label}
            onClick={() => !item.disabled && setSelectedTab(item.label)}
            disabled={item.disabled}
          >
            <ListItemIcon>
              <StyledIconBox>{item.icon}</StyledIconBox>
            </ListItemIcon>
            <ListItemText primary={item.label} />
            <StyledIconBox>
              <ChevronRightIcon />
            </StyledIconBox>
          </StyledListItemButton>
        ))}
      </List>
    </SettingsListContainer>
  );
};


export default SettingsList;
