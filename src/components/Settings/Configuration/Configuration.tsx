import { SetStateAction, useState } from "react";
import { motion } from "framer-motion";
import {
  SettingsContainer,
  Section,
  SectionTitle,
  ColorGrid,
  ColorOption,
  SaveButton,
  CustomTabs,
  CustomTab,
  TrackingCode,
  CodeInput,
  CustomMuiColorInput,
} from "./configuration.styled";
import {
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
  Checkbox,
  Box,
  IconButton,
} from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import ChatBot from "../../../components/ChatBot/ChatBot";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store/store";
import { getScript, saveConfigurations } from "../../../redux/slice/chatSlice";
import { ContentContainer } from "./configuration.styled";
import Loader from "../../Loader";
import toast, {Toaster} from "react-hot-toast";

const Configuration = () => {
  const [settings, setSettings] = useState({
    iconColor: "#c0dbf9",
    chatWindowColor: "#ffffff",
    fontColor: "#333333",
    position: "bottom-right",
    allowEmojis: false,
    allowFileUpload: false,
    availability: true,
  });
  const [activeTab, setActiveTab] = useState("configure");
  const [embedCode, setEmbedCode] = useState("");
  const colors = ["#45607c", "#c0dbf9", "#b15194", "#f8b771", "#546db9"];
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const fetchScript = async () => {
    try {
      const response = await dispatch(getScript()).unwrap();
      if(response){
        toast.success("Script fetched successfully");
      }
      setEmbedCode(response);
    } catch (error) {
      console.error("Error fetching script:", error);
      toast.error("Error fetching script");
      setEmbedCode("// Error loading script");
    }
  };
  
  const handleSave = async () => {
    setLoading(true);
    try {
      await dispatch(
        saveConfigurations({ ...settings, orgId: user?.orgId, aiOrgId: user?.aiOrgId })
      ).unwrap();
  
      await fetchScript();
      setTimeout(() => {
        setLoading(false);
        setActiveTab("tracking_code");
      }, 1000); 
    } catch (error) {
      console.error("Error saving settings:", error);
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode).then(() => alert("Embed code copied!"));
  };

  const handleTabChange = (_: any, newValue: SetStateAction<string>) => {
    setActiveTab(newValue);
    if (newValue === "tracking_code") fetchScript();
  };

  return (
    <ContentContainer>
      <CustomTabs value={activeTab} onChange={handleTabChange}>
        <CustomTab label="Configure" value="configure" />
        <CustomTab label="Tracking code" value="tracking_code" />
      </CustomTabs>

      {activeTab === "configure" && (
        <SettingsContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SectionTitle>Display</SectionTitle>
            <Section>
              <Typography variant="h6" fontSize={16} fontWeight={600} sx={{ color: "#35495c" }}>
                Color
              </Typography>
              <Typography sx={{ color: "#3e5164", mb: 2 }}>
                Choose an accent color
              </Typography>
              <ColorGrid>
                {colors.map((color) => (
                  <ColorOption
                    key={color}
                    color={color}
                    isSelected={settings.iconColor === color}
                    onClick={() => handleChange("iconColor", color)}
                  />
                ))}
              </ColorGrid>
            </Section>

            <Section style={{ marginTop: '1.2rem' }}>
              <Typography variant="h6" fontSize={16} fontWeight={600} sx={{ color: "#35495c", mt: 1 }}>
                Chat widget placement
              </Typography>
              <Typography sx={{ color: "#3e5164", fontSize: "14px", mb: 1 }}>
                Choose where to display your chat widget.
              </Typography>
              <FormControl>
                <RadioGroup
                  row
                  value={settings.position}
                  onChange={(e) => handleChange("position", e.target.value)}
                >
                  <FormControlLabel value="bottom-left" control={<Radio />} label="Bottom-Left" />
                  <FormControlLabel value="bottom-right" control={<Radio />} label="Bottom-Right" />
                </RadioGroup>
              </FormControl>
            </Section>

            {/* Additional settings */}
            <Section style={{ marginTop: '1rem' }}>
              <Typography variant="h6" fontSize={16} fontWeight={600} sx={{ color: "#35495c" }}>
                Additional Settings
              </Typography>
              <FormControl sx={{ display: 'flex', flexDirection: 'row' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={settings.allowEmojis}
                      onChange={(e) => handleChange("allowEmojis", e.target.checked)}
                    />
                  }
                  label="Allow Emoji"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={settings.allowFileUpload}
                      onChange={(e) => handleChange("allowFileUpload", e.target.checked)}
                    />
                  }
                  label="Allow File Upload"
                />
              </FormControl>
            </Section>

            {/* New Chat Window Customization settings */}
            <Section style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
              <Typography variant="h6" fontSize={16} fontWeight={600} sx={{ color: "#35495c" }}>
                Chat Window Color
              </Typography>
              <CustomMuiColorInput format="hex" value={settings.chatWindowColor} onChange={(newValue: string) => handleChange("chatWindowColor", newValue)} />
            </Section>

            <Section style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
              <Typography variant="h6" fontSize={16} fontWeight={600} sx={{ color: "#35495c" }}>
                Font Color
              </Typography>
              <CustomMuiColorInput format="hex" value={settings.fontColor} onChange={(newValue: string) => handleChange("fontColor", newValue)} />
            </Section>

            <Section style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={settings.availability}
                    onChange={(e) => handleChange("availability", e.target.checked)}
                  />
                }
                label="Available"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    color: "#35495c",
                    fontSize: "16px",
                    fontWeight: 600,
                  },
                }}
              />
            <SaveButton color="var(--theme-color)" onClick={handleSave}>
              Save
            </SaveButton>
            </Section>
          </motion.div>
          <ChatBot settings={settings} />
        </SettingsContainer>
      )}

      {activeTab === "tracking_code" && (
        <SettingsContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Section>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="h6" fontSize={14} fontWeight={500} sx={{ color: "#35495c" }}>
                  Place the code before the end of the &lt;body&gt; tag.
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="h6" fontSize={14} fontWeight={600} sx={{ color: "#35495c" }}>
                    Copy Code
                  </Typography>
                  <IconButton onClick={copyToClipboard}>
                    <ContentCopy />
                  </IconButton>
                </Box>
              </Box>
              <TrackingCode>
                <CodeInput value={embedCode} readOnly />
              </TrackingCode>
            </Section>
          </motion.div>
        </SettingsContainer>
      )}
      {loading && (
        <Loader />
      )}
      <Toaster />
    </ContentContainer>
  );
};

export default Configuration;
