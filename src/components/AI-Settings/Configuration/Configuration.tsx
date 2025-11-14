import { useEffect, useRef, useState } from "react";
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
  CustomColorPicker,
  ColorPicker,
  PreviewContainer,
  PreviewImage,
  UploadBtn,
  CustomFormControlLabel,
  SubTabContainer,
} from "./configuration.styled";
import {
  FormControl,
  RadioGroup,
  Radio,
  Typography,
  Checkbox,
  Box,
  IconButton,
  TextField,
  MenuItem,
  Select,
  Tabs,
  Tab,
} from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import ChatBot from "../../../components/ChatBot/ChatBot";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store/store";
import { getChatConfig, getScript, saveConfigurations } from "../../../redux/slice/chatSlice";
import { ContentContainer } from "./configuration.styled";
import Loader from "../../Loader";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "../../../styles/layout.styled";
import EmailConfiguration from "../EmailConfiguration/EmailConfiguration";
import AiChatBotSettings from "../AI-ChatBot-Settings/AiChatBotSettings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FAQConfiguration from "../FAQ-and-Pricing/FAQConfiguration";
import Pricing from "../pricing/pricing";


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
export interface ChatBotSettings {
  addInitialPopupText?: string;
  iconColor: string;
  chatWindowColor: string;
  fontColor: string;
  position: "bottom-left" | "bottom-right";
  allowEmojis: boolean;
  allowFileUpload: boolean;
  allowNameEmail: boolean;
  allowCustomGreeting: boolean;
  customGreetingMessage: string;
  availability: boolean;
  allowFontFamily: boolean;
  customFontFamily: string;
  addChatBotName: string;
  ChatBotLogoImage: File | null;
  orgId?: string;
  aiOrgId?: string;
  allowCustomRecycleClear:boolean,
  CustomRecycleClear?:number
  customPersonalDetails?:string
}


const Configuration = () => {
  const [personalDetails,setPersonalDetails]= useState({name:false,email:false,phone:false})
  const [settings, setSettings] = useState<ChatBotSettings>({
    addInitialPopupText: "",
    iconColor: "#c0dbf9",
    chatWindowColor: "#ffffff",
    fontColor: "#333333",
    position: "bottom-right",
    allowEmojis: false,
    allowFileUpload: false,
    allowNameEmail: false,
    allowCustomGreeting: false,
    customGreetingMessage: "",
    availability: true,
    allowFontFamily: false,
    customFontFamily: '',
    addChatBotName: '',
    ChatBotLogoImage: null,
    allowCustomRecycleClear:false,
    CustomRecycleClear:30,
    customPersonalDetails:JSON.stringify(personalDetails)?JSON.stringify(personalDetails):JSON.stringify({name:false,email:false,phone:false})
  });
  const [activeTab, setActiveTab] = useState("configure");
  const [embedCode, setEmbedCode] = useState("");
  const colors = ["#45607c", "#c0dbf9", "#b15194", "#f8b771", "#546db9", "custom"];
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState<boolean>(false);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [logoPriviewURL, setLogoPriviewURL] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [subTab, setSubTab]= useState("basic");
  

  useEffect(() => {
    if(user?.orgId){
    const run = async () => {
      await fetchScript();
    };
    run();

    const savedTab = localStorage.getItem("activeConfigTab");
    if (savedTab) setActiveTab(savedTab);
  }
  }, [user]);

  const loadFont = (font: string) => {
    const fontUrl = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}&display=swap`;
    const link = document.createElement("link");
    link.href = fontUrl;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  };
  useEffect(() => {
    if (user?.orgId) {
      dispatch(getChatConfig(user.orgId))
        .unwrap()
        .then((chatConfig) => {
    if (chatConfig && Object.keys(chatConfig).length > 0) {
      let details = { name: false, email: false, phone: false };

      if (chatConfig.customPersonalDetails) {
        try {
          if (typeof chatConfig.customPersonalDetails === "string") {
            details = JSON.parse(chatConfig.customPersonalDetails);
          } 
          else if (typeof chatConfig.customPersonalDetails === "object") {
            details = chatConfig.customPersonalDetails;
          }
        } catch (e) {
          console.error("Failed to parse customPersonalDetails:", e);
        }
      }
      setPersonalDetails(details);
            setLogoPriviewURL(chatConfig.ChatBotLogoImage);
            
            setSettings((prev) => ({
              ...prev,
              ...chatConfig,
              addInitialPopupText: chatConfig?.addInitialPopupText ?? prev.addInitialPopupText,
              iconColor: chatConfig?.iconColor ?? prev.iconColor,
              chatWindowColor: chatConfig?.chatWindowColor ?? prev.chatWindowColor,
              fontColor: chatConfig?.fontColor ?? prev.fontColor,
              position: chatConfig?.position ?? prev.position,
              allowEmojis: chatConfig?.allowEmojis ?? prev.allowEmojis,
              allowFileUpload: chatConfig?.allowFileUpload ?? prev.allowFileUpload,
              allowNameEmail: chatConfig?.allowNameEmail ?? prev.allowNameEmail,
              allowCustomGreeting: chatConfig?.allowCustomGreeting ?? prev.allowCustomGreeting,
              customGreetingMessage: chatConfig?.customGreetingMessage ?? prev.customGreetingMessage,
              availability: chatConfig?.availability ?? prev.availability,
              allowFontFamily: chatConfig?.allowFontFamily ?? prev.allowFontFamily,
              customFontFamily: chatConfig?.customFontFamily ?? prev.customFontFamily,
              addChatBotName: chatConfig?.addChatBotName ?? prev.addChatBotName,
              ChatBotLogoImage: chatConfig?.ChatBotLogoImage ?? prev.ChatBotLogoImage,
            }));
          }
        })
        ;
    }
  }, [user?.orgId]);


  const fontFamilies = [
    "Arial", "Verdana", "Tahoma", "Trebuchet MS", "Times New Roman", "Georgia",
    "Garamond", "Courier New", "Brush Script MT", "Comic Sans MS", "Impact",
    "Palatino Linotype", "Segoe UI", "Lucida Sans Unicode", "Century Gothic",
    "Franklin Gothic Medium", "Arial Black", "Cambria", "Consolas", "Helvetica"
  ];

  const customDays = [{value:3,name:"3 Days"},{value:7,name:"7 Days"},{value:15,name:"15 Days"},
    {value:30,name:"30 Days"},{value:60,name:"60 Days"},{value:90,name:"90 Days"}
  ]



  const handleChange = (field: string, value: string | boolean|number) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const fetchScript = async () => {
    try {
      const orgId= user?.orgId
      const response = await dispatch(getScript(orgId)).unwrap();
      if (response) {
        setEmbedCode(response);
      }
    } catch (error) {
      console.error("Error fetching script:", error);
      toast.error("Error fetching script");
      setEmbedCode("Please configure the chatbot first.");
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
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(embedCode)
        .then(() => toast.success("Code copied to clipboard"))
        .catch(err => {
          console.error("Clipboard API error:", err);
          toast.error("Failed to copy code");
        });
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = embedCode;
      textarea.style.position = 'fixed';
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


  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem("activeConfigTab", tab);
  };

  const handleEmailConfigSubmit = (emailConfigData: EmailConfigData) => {
    console.log("Email configuration submitted:", emailConfigData);
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setSettings((prev) => ({ ...prev, ChatBotLogoImage: file }));
      const imageUrl = URL.createObjectURL(file);
      setLogoPriviewURL(imageUrl);
    }
  };
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <ContentContainer>
      <CustomTabs value={activeTab} onChange={(_, newValue) => handleTabChange(newValue)}>
        <CustomTab label="Configure" value="configure" />
        <CustomTab label="Tracking Code" value="tracking_code" />
        <CustomTab label="Email Configuration" value="email configuration" />
        <CustomTab label="Ai Chatbot" value="ai chatbot" />
      </CustomTabs>

      {activeTab === "configure" && (
        <SettingsContainer >
          <ScrollableDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SubTabContainer>
                <Tabs
                  value={subTab}
                  onChange={(_, newValue) => setSubTab(newValue)}
                  variant="fullWidth"
                  TabIndicatorProps={{
                    style: {
                      height: '3px',
                      backgroundColor: '#33465b',     
                      borderRadius: '2px',
                    },
                  }}
                  sx={{
                    minHeight: '40px',
                  }}
                >
                  {['basic', 'styling', 'chat'].map((tabKey) => (
                    <Tab
                      key={tabKey}
                      value={tabKey}
                      label={tabKey.charAt(0).toUpperCase() + tabKey.slice(1)}
                      sx={{
                        textTransform: 'none',
                        fontWeight: subTab === tabKey ? 600 : 500,
                        fontSize: '15px',
                        color: subTab === tabKey ? '#33465b !important' : '#5f6b7a',
                        padding: '12px 20px',
                        minHeight: '40px',
                      }}
                    />
                  ))}
                </Tabs>
            </SubTabContainer>
            
            {subTab === 'chat' && (
              <Section>
              <Typography variant="h6" fontFamily={'var(--custom-font-family)'} fontSize={16} fontWeight={600} sx={{ color: "#35495c", mt: 1 }}>
                Add your Initial Popup Text
              </Typography>
              <TextField
                fullWidth
                label="Enter initial popup text"
                variant="outlined"
                size="small"
                value={settings.addInitialPopupText || ""}
                onChange={(e) => handleChange("addInitialPopupText", e.target.value)}
                InputLabelProps={{ style: { fontFamily: 'var(--custom-font-family)' } }}
                InputProps={{ style: { fontFamily: 'var(--custom-font-family)' } }}
                sx={{ width: '50%', mt: 2, mb: 2 }}
              />
              <PreviewContainer style={{ display: 'flex', gap: '1em', alignItems: 'center' }}>
                {logoPriviewURL ? (
                  <PreviewImage
                    src={logoPriviewURL}
                    alt="Profile preview"
                  />
                ) : (
                  <AccountCircleIcon
                    style={{
                      fontSize: "50px",
                      color: "var(--theme-color-dark)",
                      marginBottom: "8px",
                    }}
                  />
                )}
                <Box sx={{ display: 'flex', gap: '1em' }}>
                  <input
                    id="upload-logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    ref={fileInputRef}
                    style={{ display: "none" }}
                  />
                  <UploadBtn onClick={handleUploadClick}>Upload Logo</UploadBtn>
                </Box>
              </PreviewContainer>
              <Typography variant="h6" fontFamily={'var(--custom-font-family)'} fontSize={16} fontWeight={600} sx={{ color: "#35495c", mt: 1 }}>
                Add your ChatBot name
              </Typography>
              <TextField
                fullWidth
                label="Enter Your Bot Name"
                variant="outlined"
                size="small"
                value={settings.addChatBotName || ""}
                onChange={(e) => handleChange("addChatBotName", e.target.value)}
                InputLabelProps={{ style: { fontFamily: 'var(--custom-font-family)' } }}
                InputProps={{ style: { fontFamily: 'var(--custom-font-family)' } }}
                sx={{ width: '50%', mt: 2, mb: 2 }}
              />
            </Section>
            )}
            {subTab === 'styling' && (
              <>
              <SectionTitle>Display</SectionTitle>
              <Section>
                <Typography variant="h6" fontFamily={'var(--custom-font-family)'} fontSize={16} fontWeight={600} sx={{ color: "#35495c" }}>
                  Color
                </Typography>
                <Typography fontFamily={'var(--custom-font-family)'} sx={{ color: "#3e5164", mb: 2 }}>
                  Choose an accent color
                </Typography>
                <ColorGrid>
                  {colors.map((color) =>
                    color === "custom" ? (
                      null
                    ) : (
                      <ColorOption
                        key={color}
                        color={color}
                        isSelected={settings.iconColor === color}
                        onClick={() => handleChange("iconColor", color)}
                      />
                    )
                  )}
                </ColorGrid>
                {colors.includes("custom") && (
                  <CustomColorPicker>
                    <Typography fontFamily={'var(--custom-font-family)'} sx={{ color: "#3e5164" }}>
                      Custom Color Picker
                    </Typography>
                    <ColorPicker
                      type="color"
                    value={settings.iconColor || "#c0dbf9"}
                      onChange={(e) => {
                        handleChange("iconColor", e.target.value);
                      }}
                    />
                  </CustomColorPicker>
                )}
            </Section>
            <Section style={{ marginTop: '1.2rem' }}>
              <Typography variant="h6" fontFamily={'var(--custom-font-family)'} fontSize={16} fontWeight={600} sx={{ color: "#35495c", mt: 1 }}>
                Chat widget placement
              </Typography>
              <Typography fontFamily={'var(--custom-font-family)'} sx={{ color: "#3e5164", fontSize: "14px", mb: 1 }}>
                Choose where to display your chat widget.
              </Typography>
              <FormControl>
                <RadioGroup
                  row
                  value={settings.position}
                  onChange={(e) => handleChange("position", e.target.value)}
                >
                  <CustomFormControlLabel value="bottom-left" control={<Radio />} label="Bottom-Left" />
                  <CustomFormControlLabel value="bottom-right" control={<Radio />} label="Bottom-Right" />
                </RadioGroup>
              </FormControl>
            </Section>
            <Section style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
              <Typography fontFamily={'var(--custom-font-family)'} variant="h6" fontSize={16} fontWeight={600} sx={{ color: "#35495c" }}>
                Chat Window Color
              </Typography>
              <CustomMuiColorInput format="hex" value={settings.chatWindowColor || '#FFFFFF'} onChange={(newValue: string) => handleChange("chatWindowColor", newValue)} />
            </Section>

            <Section style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
              <Typography fontFamily={'var(--custom-font-family)'} variant="h6" fontSize={16} fontWeight={600} sx={{ color: "#35495c" }}>
                Font Color
              </Typography>
              <CustomMuiColorInput format="hex" value={settings.fontColor || '#333333'} onChange={(newValue: string) => handleChange("fontColor", newValue)} />
            </Section>
            </>
            )}
            {subTab === 'basic' && (
              <Section style={{ marginTop: '1rem' }}>
              <Typography variant="h6" fontFamily={'var(--custom-font-family)'} fontSize={16} fontWeight={600} sx={{ color: "#35495c" }}>
                Additional Settings
              </Typography>
              <FormControl sx={{ display: 'flex', flexDirection: 'row' }}>
                <CustomFormControlLabel
                  control={
                    <Checkbox
                      checked={settings.allowEmojis}
                      onChange={(e) => handleChange("allowEmojis", e.target.checked)}
                    />
                  }
                  label="Allow Emoji"
                />
                <CustomFormControlLabel
                  control={
                    <Checkbox
                      checked={settings.allowFileUpload}
                      onChange={(e) => handleChange("allowFileUpload", e.target.checked)}
                    />
                  }
                  label="Allow File Upload"
                />
              </FormControl>
              <FormControl>
                <CustomFormControlLabel
                  control={
                    <Checkbox
                      checked={settings.allowNameEmail}
                      onChange={(e) => {handleChange("allowNameEmail", e.target.checked) 
                      }}
                    />
                  }
                  label="Allow Bot to ask for Personal Details"
                />
                {settings.allowNameEmail && (
                  < >
                  <CustomFormControlLabel
                  sx={{marginLeft:2}}
                  control={
                    <Checkbox
                      checked={personalDetails.name}
                      onChange={() => {setPersonalDetails({...personalDetails,name:!personalDetails?.name})
                      setSettings({...settings,customPersonalDetails:JSON.stringify({...personalDetails,name:!personalDetails?.name})})
                    }}
                    />
                  }
                  label="Allow Bot to ask Name"
                />
                 <CustomFormControlLabel
                 sx={{marginLeft:2}}
                  control={
                    <Checkbox
                      checked={personalDetails.email}
                      onChange={() =>{ setPersonalDetails({...personalDetails,email:!personalDetails?.email})
                        setSettings({...settings,customPersonalDetails:JSON.stringify({...personalDetails,email:!personalDetails?.email})})
                      }}
                    />
                  }
                  label="Allow Bot to ask Email"
                />
                <CustomFormControlLabel
                 sx={{marginLeft:2}}
                  control={
                    <Checkbox
                      checked={personalDetails.phone}
                      onChange={() =>{ setPersonalDetails({...personalDetails,phone:!personalDetails?.phone})
                        setSettings({...settings,customPersonalDetails:JSON.stringify({...personalDetails,phone:!personalDetails?.phone})})
                      }}
                    />
                  }
                  label="Allow Bot to ask Phone"
                />
                </ >
                )}
                <CustomFormControlLabel
                  control={
                    <Checkbox
                      checked={settings.allowCustomGreeting}
                      onChange={(e) => handleChange("allowCustomGreeting", e.target.checked)}
                    />
                  }
                  label="Allow Custom Greeting Message"
                />
                {settings.allowCustomGreeting && (
                  <TextField
                    fullWidth
                    label="Enter Custom Greeting"
                    variant="outlined"
                    size="small"
                    value={settings.customGreetingMessage || ""}
                    onChange={(e) => handleChange("customGreetingMessage", e.target.value)}
                    sx={{ mt: 1 }}
                    InputLabelProps={{ style: { fontFamily: 'var(--custom-font-family)' } }}
                    inputProps={{ style: { fontFamily: 'var(--custom-font-family)' } }}
                  />
                )}
                <CustomFormControlLabel
                  control={
                    <Checkbox
                      checked={settings.allowFontFamily}
                      onChange={(e) => handleChange("allowFontFamily", e.target.checked)}
                    />
                  }
                  label="Allow Custom Font-Family"
                />
                {settings.allowFontFamily && (
                  <Select
                    value={settings.customFontFamily || fontFamily}
                    onChange={(e) => {
                      const selectedFont = e.target.value;
                      setFontFamily(selectedFont);
                      handleChange("customFontFamily", selectedFont);
                      loadFont(selectedFont);
                    }}
                    displayEmpty
                    size="small"
                    fullWidth
                    sx={{ mt: 1, fontFamily: `${settings.customFontFamily}` || fontFamily }}
                  >
                    {fontFamilies.map((font) => (
                      <MenuItem key={font} value={font} style={{ fontFamily: font }}>
                        {font}
                      </MenuItem>
                    ))}
                  </Select>

                )}
                <CustomFormControlLabel
                  control={
                    <Checkbox
                      checked={settings.allowCustomRecycleClear}
                      onChange={(e) => handleChange("allowCustomRecycleClear", e.target.checked)}
                    />
                  }
                  label="Allow Custom Deleted Chat Clear"
                />
                {settings.allowCustomRecycleClear && 
                (
                  <Select
                    value={settings.CustomRecycleClear }
                    defaultValue={settings.CustomRecycleClear}
                    onChange={(e) => {
                      const selectedDays = e.target.value;
                      handleChange("CustomRecycleClear", Number(selectedDays));
                    }}
                    displayEmpty
                    size="small"
                    fullWidth
                    sx={{ mt: 1, fontFamily: `${settings.customFontFamily}` || fontFamily }}
                  >
                    {customDays.map((days) => (
                      <MenuItem key={days.value} value={days.value} >
                        {days.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}

              </FormControl>
            </Section>
            )}
            
            <Section style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <Button onClick={handleSave}>
                Save
              </Button>
            </Section>
          </ScrollableDiv>
          <ChatBot settings={settings} LogoImage={logoPriviewURL} />
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
                <Typography fontFamily={'var(--custom-font-family)'} variant="h6" fontSize={14} fontWeight={500} sx={{ color: "#35495c" }}>
                  Place the code before the end of the &lt;body&gt; tag.
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography fontFamily={'var(--custom-font-family)'} variant="h6" fontSize={14} fontWeight={600} sx={{ color: "#35495c" }}>
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
      {activeTab === "ai chatbot" && (
        <SettingsContainer >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ width: '95%' }}
          >
            <Section style={{ width: "100%", paddingBlock: "1rem" }}>
              {user?.orgId && <AiChatBotSettings orgId={user?.orgId} />}
            </Section>
          </motion.div>
        </SettingsContainer>
      )}
 {activeTab === "FAQ" && (
  <SettingsContainer >
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
<Section style={{ width: "150%", paddingBlock: "1rem" }}>
        {user?.orgId && <FAQConfiguration />} {/* FAQ upload + list */}
      </Section>
    </motion.div>
  </SettingsContainer>
)}

{activeTab === "Pricing" && (
  <SettingsContainer>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Section style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingBlock: "1rem" }}>
        <Pricing /> {/* Pricing component */}
      </Section>
    </motion.div>
  </SettingsContainer>
)}

{loading && <Loader />}


      {loading && (
        <Loader />
      )}
      <Toaster />
    </ContentContainer>
  );
};

export default Configuration;
