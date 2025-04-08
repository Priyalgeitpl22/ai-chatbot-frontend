import { useState } from "react";
import { SettingsContainer } from "./settings.styled";
import SettingsList from "./SettingsList/SettingsList";
import NotificationSettings from "./NotificationSettings/NotificationSettings";

const Settings = () => {
  const [selectedTab, setSelectedTab] = useState<string>("Notifications");

  return (
    <SettingsContainer>
      <SettingsList
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      {selectedTab === "Notifications" && (<NotificationSettings />)}
    </SettingsContainer>
  );
};

export default Settings;
