import { List, ListItemIcon, ListItemText, Typography } from "@mui/material";
import {
  SettingsListContainer,
  SettingsListHeader,
  StyledIconBox,
  StyledListItemButton
} from "./settingsList.styled";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const settingsItems = [
  { icon: <NotificationsNoneIcon />, label: "Notifications" },
];

interface SettingsListProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const SettingsList = ({ selectedTab, setSelectedTab }: SettingsListProps) => {
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
            onClick={() => setSelectedTab(item.label)}
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
