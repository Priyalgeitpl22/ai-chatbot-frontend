import { useState } from "react";
import { motion } from "framer-motion";
import {
  SettingsContainer,
  Section,
  SectionTitle,
  ColorGrid,
  ColorOption,
  ColorInput,
  CheckAccessibility,
  SaveButton,
  CustomTabs,
  CustomTab,
  TrackingCode,
  CodeInput,
} from "./configuration.styled";
import {
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
  Checkbox,
  Box,
} from "@mui/material";
import ChatBot from "../../../components/ChatBot/ChatBot";

const Configuration = () => {
  const [settings, setSettings] = useState({
    selectedColor: "#7ed8d7",
    chatbotPosition: "bottom-right",
    allowEmoji: false,
    allowFileUpload: false,
  });
  const [activeTab, setActiveTab] = useState("configure");
  const colors = ["#45607c", "#7ed8d7", "#b15194", "#f8b771", "#546db9"];

  const handleChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    console.log("Settings:", settings);
  };

  return (
    <Box sx={{ width: "auto" }}>
      {/* Tabs for switching between Configure & Availability */}
      <CustomTabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
      >
        <CustomTab label="Configure" value="configure" />
        <CustomTab label="Tracking code" value="tracking_code" />
      </CustomTabs>
      {activeTab === "configure" && (
        <SettingsContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <SectionTitle>Display</SectionTitle>
            <Section>
              <div>
                <Typography
                  variant="h6"
                  fontSize={16}
                  fontWeight={600}
                  sx={{ color: "#35495c" }}
                >
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
                      isSelected={settings.selectedColor === color}
                      onClick={() => handleChange("selectedColor", color)}
                    />
                  ))}
                  <CheckAccessibility>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Typography sx={{ fontWeight: "bold" }}>#</Typography>
                      <ColorInput
                        type="text"
                        value={settings.selectedColor.replace("#", "")}
                        onChange={(e) =>
                          handleChange("selectedColor", `#${e.target.value}`)
                        }
                      />
                    </div>
                    Check accessibility
                  </CheckAccessibility>
                </ColorGrid>
              </div>
            </Section>

            {/* Chatbot Position Section */}
            <Section>
              <Typography
                variant="h6"
                fontSize={16}
                fontWeight={600}
                sx={{ color: "#35495c" }}
              >
                Chat widget placement
              </Typography>
              <div
                style={{
                  color: "#3e5164",
                  fontSize: "14px",
                  marginBottom: "5px",
                }}
              >
                Determine what side of your website you would like your chat
                widget to <br /> appear on.
              </div>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="chatbot-position"
                  value={settings.chatbotPosition}
                  onChange={(e) =>
                    handleChange("chatbotPosition", e.target.value)
                  }
                  row
                >
                  <FormControlLabel
                    value="bottom-left"
                    control={<Radio color="primary" />}
                    label="Bottom-Left"
                    sx={{ color: "#3e5164" }}
                  />
                  <FormControlLabel
                    value="bottom-right"
                    control={<Radio color="primary" />}
                    label="Bottom-Right"
                    sx={{ color: "#3e5164" }}
                  />
                </RadioGroup>
              </FormControl>
            </Section>

            {/* Additional Settings */}
            <Section>
              <Typography
                variant="h6"
                fontSize={16}
                fontWeight={600}
                sx={{ color: "#35495c" }}
              >
                Additional Settings
              </Typography>
              <FormControl component="fieldset">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={settings.allowEmoji}
                      onChange={(e) =>
                        handleChange("allowEmoji", e.target.checked)
                      }
                      color="primary"
                    />
                  }
                  label="Allow Emoji"
                  sx={{ color: "#3e5164" }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={settings.allowFileUpload}
                      onChange={(e) =>
                        handleChange("allowFileUpload", e.target.checked)
                      }
                      color="primary"
                    />
                  }
                  label="Allow File Upload"
                  sx={{ color: "#3e5164" }}
                />
              </FormControl>
            </Section>

            {/* Save Button */}
            <Section>
              <SaveButton color="#7ed8d7" onClick={handleSave}>
                Save
              </SaveButton>
            </Section>
          </motion.div>

          {/* Chatbot Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <ChatBot settings={settings} />
          </motion.div>
        </SettingsContainer>
      )}

      {/* Tracking code*/}
      {activeTab === "tracking_code" && (
        <SettingsContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <SectionTitle>
              Install the tracking code on your website
            </SectionTitle>
            <Section>
              <div>
                <Typography
                  variant="h6"
                  fontSize={14}
                  fontWeight={500}
                  sx={{ color: "#35495c", marginBottom: "12px" }}
                >
                  {`Place the code right before the end of the <body> tag on any page that you want to enable GoldenBot on.`}
                </Typography>
                <TrackingCode>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <CodeInput
                      value={`<!-- Start of HubSpot Embed Code -->
<script type="text/javascript" id="hs-script-loader" async defer 
src="//js-na1.hs-scripts.com/48728892.js"></script>
<!-- End of HubSpot Embed Code -->`}
                      readOnly
                    />
                  </div>
                </TrackingCode>
                <SaveButton color="#7ed8d7">Copy</SaveButton>
              </div>
            </Section>
          </motion.div>
        </SettingsContainer>
      )}
    </Box>
  );
};

export default Configuration;
