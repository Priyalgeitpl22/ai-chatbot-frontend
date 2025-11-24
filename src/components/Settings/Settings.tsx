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
  const user = useSelector((state: RootState) => state?.user?.user);
  const orgId = user?.orgId || org?.id;
  const location = useLocation();
  const navigate = useNavigate();
  const token = Cookies.get("access_token") || "";

  
  const getInitialTab = () => {
    const params = new URLSearchParams(location.search);
    const tabFromUrl = params.get("tab")?.toLowerCase(); 
    const tabFromStorage = localStorage.getItem("activeTab")?.toLowerCase(); 
    return tabFromUrl || tabFromStorage || "notifications";
  };
  
  const [selectedTab, setSelectedTabState] = useState(getInitialTab);

  const setSelectedTab = (tab: string) => {
    const tabLowercase = tab.toLowerCase();
    setSelectedTabState(tabLowercase);
    localStorage.setItem("activeTab", tabLowercase);
    navigate(`/settings?tab=${tabLowercase}`, { replace: true });
};

const tabComponents: Record<string, JSX.Element> = {
  notifications: <NotificationSettings />,
  security: <TwoFactorSettings token={token || ""} />,
};

  useEffect(() => {
    localStorage.setItem("activeTab", selectedTab);
  }, [selectedTab]);

  useEffect(() => {
  const params = new URLSearchParams(location.search);
  const tab = params.get("tab")?.toLowerCase();

  if (tab) setSelectedTab(tab);
}, [location.search]);

useEffect(() => {
    if (orgId) {
      dispatch(fetchOrganization(orgId));
    }
  }, [dispatch, orgId]);


  return (
    <SettingsContainer>
  <SettingsList
    selectedTab={selectedTab}
    setSelectedTab={setSelectedTab}
  />
  {tabComponents[selectedTab]}
</SettingsContainer>
  );
};

export default Settings;
