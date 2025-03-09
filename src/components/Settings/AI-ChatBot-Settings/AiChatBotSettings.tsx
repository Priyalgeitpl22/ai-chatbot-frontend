import React, { useState, useEffect } from "react";
import { TextField, Switch, FormControlLabel, Button, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { FormContainer } from "./aiChatBotSettings.styled";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store/store"; 
import { getAIChatbotSettingsData, createAiChatBotSettings } from "../../../redux/slice/organizationSlice"; 

export interface AiSettings {
  isAiEnabled: boolean;
  companyInfo: string;
  serviceOrProductInfo: string;
  contactDetails: string;
  buzznexxAddress: string;
  googlePageUrl: string;
  linkedinPageUrl: string;
  facebookPageUrl: string;
}

type AiFieldKey = Exclude<keyof AiSettings, "isAiEnabled">;

export const aiChatbotFields: {
  label: string;
  key: AiFieldKey;
  xs: number;
  sm: number;
  multiline?: boolean;
  rows?: number;
  required: boolean;
}[] = [
  {
    label: "Company Information",
    key: "companyInfo",
    xs: 12,
    sm: 12,
    multiline: true,
    rows: 3,
    required: true,
  },
  {
    label: "Service/Product Information",
    key: "serviceOrProductInfo",
    xs: 12,
    sm: 12,
    multiline: true,
    rows: 2,
    required: true,
  },
  {
    label: "Buzznexx Address",
    key: "buzznexxAddress",
    xs: 12,
    sm: 12,
    required: true,
  },
  {
    label: "Contact Details",
    key: "contactDetails",
    xs: 12,
    sm: 6,
    required: true,
  },
  {
    label: "Google Business Page URL (Optional)",
    key: "googlePageUrl",
    xs: 12,
    sm: 6,
    required: false,
  },
  {
    label: "LinkedIn Page URL (Optional)",
    key: "linkedinPageUrl",
    xs: 12,
    sm: 6,
    required: false,
  },
  {
    label: "Facebook Page URL (Optional)",
    key: "facebookPageUrl",
    xs: 12,
    sm: 6,
    required: false,
  },
];

interface AiChatbotFormProps {
  onSubmit: (data: AiSettings) => void;
  orgId: string; 
}

const AiChatBotSettings: React.FC<AiChatbotFormProps> = ({ onSubmit, orgId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const organizationState = useSelector((state: RootState) => state.organization);

  const [aiSettings, setAiSettings] = useState<AiSettings>({
    isAiEnabled: false,
    companyInfo: "",
    serviceOrProductInfo: "",
    contactDetails: "",
    buzznexxAddress: "",
    googlePageUrl: "",
    linkedinPageUrl: "",
    facebookPageUrl: "",
  });

  const [isExisting, setIsExisting] = useState(false);

  useEffect(() => {
    const storedSettings = localStorage.getItem("aiChatbotSettings");
    if (storedSettings) {
      setAiSettings(JSON.parse(storedSettings));
    }
  }, []);

  useEffect(() => {
    if (orgId) {
      dispatch(getAIChatbotSettingsData(orgId));
    }
  }, [orgId, dispatch]);

  useEffect(() => {
    if (organizationState.data && organizationState.data.aiChatBotSettings) {
      const settings = organizationState.data.aiChatBotSettings;
      setAiSettings({
        isAiEnabled: settings.isAiEnabled,
        companyInfo: settings.companyInfo,
        serviceOrProductInfo: settings.serviceOrProductInfo,
        contactDetails: settings.contactDetails,
        buzznexxAddress: settings.buzznexxAddress,
        googlePageUrl: settings.googlePageUrl || "",
        linkedinPageUrl: settings.linkedinPageUrl || "",
        facebookPageUrl: settings.facebookPageUrl || "",
      });
      setIsExisting(true);
    }
  }, [organizationState.data]);

  useEffect(() => {
    localStorage.setItem("aiChatbotSettings", JSON.stringify(aiSettings));
  }, [aiSettings]);

  const handleAiChange = (field: AiFieldKey, value: string) => {
    setAiSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    setAiSettings((prev) => ({ ...prev, isAiEnabled: newValue }));
    toast.success(newValue ? "AI Chatbot Enabled" : "AI Chatbot Disabled");
  };

  const handleSubmit = (e: React.FormEvent) => {
    debugger
    e.preventDefault();
    for (let field of aiChatbotFields) {
      if (field.required && !aiSettings[field.key].trim()) {
        return;
      }
    }
    // if (isExisting) {
      dispatch(createAiChatBotSettings({ orgId, data: {aiChatBotSettings: aiSettings} }))
        .unwrap()
        .then(() => {
          toast.success("AI Settings updated successfully!");
        })
        .catch((err) => {
          toast.error(err.message);
        });
    // } else {
    //   onSubmit(aiSettings);
    //   toast.success("AI Settings saved successfully!");
    // }
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", justifyContent: "flex-start", p: 1 }}>
          <FormControlLabel
            sx={{ color: "#35495c", marginBottom: "10px" }}
            control={
              <Switch
                checked={aiSettings.isAiEnabled}
                onChange={handleToggleChange}
              />
            }
            label="Enable AI Chatbot"
          />
        </Box>
        {aiSettings.isAiEnabled ? (
          <Grid container spacing={1.5}>
            {aiChatbotFields.map((field) => (
              <Grid key={field.key} size={field.sm}>
                <TextField
                  label={field.label}
                  value={aiSettings[field.key]}
                  onChange={(e) => handleAiChange(field.key, e.target.value)}
                  fullWidth
                  disabled={!aiSettings.isAiEnabled}
                  multiline={field.multiline || false}
                  rows={field.rows || 1}
                  required={field.required}
                />
              </Grid>
            ))}
            <Grid size={12}>
              <Button
                sx={{
                  color: "#1e293b",
                  marginTop: "5px",
                  backgroundColor: "var(--theme-color)",
                }}
                type="submit"
                variant="contained"
                disabled={!aiSettings.isAiEnabled}
              >
                {isExisting ? "Edit AI Settings" : "Save AI Settings"}
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={1.5}>
            <Grid size={12}>
              <Button
                sx={{
                  color: "#1e293b",
                  marginTop: "5px",
                  backgroundColor: "var(--theme-color)",
                }}
                type="submit"
                variant="contained"
                disabled
              >
                AI Chatbot Not Enabled
              </Button>
            </Grid>
          </Grid>
        )}
      </form>
    </FormContainer>
  );
};

export default AiChatBotSettings;
