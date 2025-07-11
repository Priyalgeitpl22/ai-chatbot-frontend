import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SettingsContainer } from "./settings.styled";
import SettingsList from "./SettingsList/SettingsList";
import NotificationSettings from "./NotificationSettings/NotificationSettings";
import SecuritySettings from "../Settings/SecuritySetting/securitySetting";
import Cookies from "js-cookie";
import { fetchOrganization } from "../../redux/slice/organizationSlice";
import { AppDispatch, RootState } from "../../redux/store/store"; 

const Settings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const org = useSelector((state: RootState) => state.organization.data);
  const user = useSelector((state: RootState) => state.user.user);
  const orgId = user?.orgId || org?.id;

  const [selectedTab, setSelectedTab] = useState<string>(() => {
    const savedTab = localStorage.getItem("settingsSelectedTab");
    return savedTab || "Notifications";
  });

  useEffect(() => {
    localStorage.setItem("settingsSelectedTab", selectedTab);
  }, [selectedTab]);

  useEffect(() => {
    if (orgId) {
      dispatch(fetchOrganization(orgId));
    }
  }, [dispatch, orgId]);
  
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
