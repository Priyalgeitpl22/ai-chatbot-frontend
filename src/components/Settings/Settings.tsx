import { useState } from "react";
import { SettingsContainer } from "./settings.styled";
import SettingsList from "./SettingsList/SettingsList";
import NotificationSettings from "./NotificationSettings/NotificationSettings";
import SecuritySettings from "../Settings/SecuritySetting/securitySetting";
import Cookies from "js-cookie"; 

const Settings = () => {
  const [selectedTab, setSelectedTab] = useState<string>("Notifications");

  const token = Cookies.get("access_token") || "";

  return (
    <SettingsContainer>
      <SettingsList
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />

      {selectedTab === "Notifications" && <NotificationSettings />}
      {selectedTab === "Security" && <SecuritySettings token={token} />}
    </SettingsContainer>
  );
};

export default Settings;
