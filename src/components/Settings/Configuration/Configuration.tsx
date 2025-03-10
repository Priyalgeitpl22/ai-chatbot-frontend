import { SetStateAction, useState } from "react";
import { motion } from "framer-motion";
import {
  SettingsContainer,
  Section,
  SectionTitle,
  ColorGrid,
  ColorOption,
  CustomTabs,
  CustomTab,
  TrackingCode,
  CodeInput,
  CustomMuiColorInput,
  ScrollableDiv,
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
import { Button } from "../../../styles/layout.styled";
import EmailConfiguration from "../EmailConfiguration/EmailConfiguration";
import AiChatBotSettings from "../AI-ChatBot-Settings/AiChatBotSettings";

export interface EmailConfigData {
  host: string;
  port: string;
  secure: string;
  user: string;
  pass: string;
}
export interface AIchatBotSettingsData {
  companyInfo: string;
  serviceOrProductInfo: string;
  contactDetails: string;
  buzznexxAddress: string;
  isAiEnabled: boolean;
}

const Configuration = () => {
  const [settings, setSettings] = useState({
    iconColor: "#c0dbf9",
    chatWindowColor: "#ffffff",
    fontColor: "#333333",
    position: "bottom-right",
    allowEmojis: false,
    allowFileUpload: false,
    allowNameEmail: false,
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

  // const copyToClipboard = () => {
  //   navigator.clipboard.writeText(embedCode).then(() => toast.success("Code copied to clipboard"));
  // };
  const copyToClipboard = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(embedCode)
        .then(() => toast.success("Code copied to clipboard"))
        .catch(err => {
          console.error("Clipboard API error:", err);
          toast.error("Failed to copy code");
        });
    } else {
      // Fallback method for unsupported browsers or insecure context
      const textarea = document.createElement('textarea');
      textarea.value = embedCode;
      textarea.style.position = 'fixed';  // Prevent scrolling to bottom of page in MS Edge.
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
        toast.success("Code copied to clipboard");
      } catch (err) {
        console.error("Fallback copy method error:", err);
        toast.error("Failed to copy code");
      }
      document.body.removeChild(textarea);
    }
  };
  

  const handleTabChange = (_: any, newValue: SetStateAction<string>) => {
    setActiveTab(newValue);
    if (newValue === "tracking_code") fetchScript();
  };

  const handleEmailConfigSubmit = (emailConfigData: EmailConfigData) => {
    console.log("Email configuration submitted:", emailConfigData);
  };


  return (
    <ContentContainer>
      <CustomTabs value={activeTab} onChange={handleTabChange}>
        <CustomTab label="Configure" value="configure" />
        <CustomTab label="Tracking Code" value="tracking_code" />
        <CustomTab label="Email Configuration" value="email configuration" />
        <CustomTab label="Ai Chatbot Setiings" value="ai chatbot settings" />
      </CustomTabs>

      {activeTab === "configure" && (
        <SettingsContainer >
          <ScrollableDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{border:'1px solid #e0e0e0',width:'50%',height:'500px', borderRadius:'8px', padding:'1rem', overflowY:'auto'}}
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

            <Section style={{ marginTop: '1.2rem' }}>
              <FormControl>
              <FormControlLabel
                  control={
                    <Checkbox
                      checked={settings.allowNameEmail}
                      onChange={(e) => handleChange("allowNameEmail", e.target.checked)}
                    />
                  }
                  label="Allow bot to ask name and email"
                />
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
            <Button onClick={handleSave}>
              Save
            </Button>
            </Section>
          </ScrollableDiv>
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

      {activeTab === "email configuration" && (
        <SettingsContainer >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Section style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingBlock: "1rem" }}>
              <EmailConfiguration onSubmit={handleEmailConfigSubmit} />
            </Section>
          </motion.div>
        </SettingsContainer>
      )}
      {activeTab === "ai chatbot settings" && (
        <SettingsContainer >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Section style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingBlock: "1rem" }}>
              {user?.orgId && <AiChatBotSettings  orgId={user?.orgId} />}
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
