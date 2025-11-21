import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SettingsContainer } from "./settings.styled";
import SettingsList from "./SettingsList/SettingsList";
import NotificationSettings from "./NotificationSettings/NotificationSettings";
import TwoFactorSettings from "./SecuritySetting/TwoFactorSettings";
import Cookies from "js-cookie";
import { fetchOrganization } from "../../redux/slice/organizationSlice";
import { AppDispatch, RootState } from "../../redux/store/store"; 
import { useLocation,useNavigate } from "react-router-dom";


const Settings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const org = useSelector((state: RootState) => state.organization.data);
  const user = useSelector((state: RootState) => state.user.user);
  const orgId = user?.orgId || org?.id;
  const location = useLocation();
  const navigate = useNavigate();
  
  const getInitialTab = () => {
    const params = new URLSearchParams(location.search);
    const tabFromUrl = params.get("tab"); 
    const tabFromStorage = localStorage.getItem("activeTab"); 
    return tabFromUrl || tabFromStorage || "Notifications";
  };
  
  const [selectedTab, setSelectedTabState] = useState(getInitialTab);

  const setSelectedTab = (tab: string) => {
    setSelectedTabState(tab);
    localStorage.setItem("activeTab", tab);
    navigate(`/settings?tab=${tab}`, { replace: true });
  };



  useEffect(() => {
    localStorage.setItem("activeTab", selectedTab);
  }, [selectedTab]);

  useEffect(() => {
  const params = new URLSearchParams(location.search);
  const tab = params.get("tab");

  if (tab) setSelectedTab(tab);
}, [location.search]);

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
      {selectedTab === "Security" && <TwoFactorSettings token={token || ""} />}
    </SettingsContainer>
  );
};

export default Settings;
