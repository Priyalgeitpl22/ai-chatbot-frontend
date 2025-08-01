import React, { useState, useEffect } from "react";
import {
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Tabs, Tab } from "@mui/material"
import { FormContainer } from "./aiChatBotSettings.styled";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store/store";
import {
  getAIChatbotSettingsData,
  createAiChatBotSettings,
  updateOrganization,
} from "../../../redux/slice/organizationSlice";
import FAQConfiguration from "../FAQ-and-Pricing/FAQConfiguration";
import PricingConfiguration from "../pricing/pricing";

export interface AiSettings {
  isAiEnabled?: boolean;
  companyInfo: string;
  serviceOrProductInfo: string;
  contactDetails: string;
  buzznexxAddress: string;
  googlePageUrl: string;
  linkedinPageUrl: string;
  facebookPageUrl: string;
  ConpanyWebsiteUrl: string;
}

type AiFieldKey = Exclude<keyof AiSettings, "isAiEnabled">;

// eslint-disable-next-line react-refresh/only-export-components
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
  {
    label: "Website page Url (Optional)",
    key: "ConpanyWebsiteUrl",
    xs: 12,
    sm: 6,
    required: true,
  },
];

interface AiChatbotFormProps {
  orgId: string;
}

const AiChatBotSettings: React.FC<AiChatbotFormProps> = ({ orgId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isAiEnabled, setIsAiEnabled] = useState<boolean>(false);

  const [aiSettings, setAiSettings] = useState<AiSettings>({
    companyInfo: "",
    serviceOrProductInfo: "",
    contactDetails: "",
    buzznexxAddress: "",
    googlePageUrl: "",
    linkedinPageUrl: "",
    facebookPageUrl: "",
    ConpanyWebsiteUrl: "",
  });

  const [isExisting, setIsExisting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [companyInfoError, setCompanyInfoError] = useState<string>("");
  const { user } = useSelector((state: RootState) => state.user);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    if (orgId) {
      setLoading(true);
      dispatch(getAIChatbotSettingsData(orgId))
        .unwrap()
        .then((settings) => {
          console.log(settings, "Settings");
          setIsAiEnabled(settings?.data?.aiEnabled || false);

          if (settings?.data?.aiChatBotSettings) {
            setAiSettings({
              companyInfo: settings?.data?.aiChatBotSettings?.companyInfo,
              serviceOrProductInfo:
                settings?.data?.aiChatBotSettings?.serviceOrProductInfo,
              contactDetails: settings?.data?.aiChatBotSettings?.contactDetails,
              buzznexxAddress:
                settings?.data?.aiChatBotSettings?.buzznexxAddress,
              googlePageUrl:
                settings?.data?.aiChatBotSettings?.googlePageUrl || "",
              linkedinPageUrl:
                settings?.data?.aiChatBotSettings?.linkedinPageUrl || "",
              facebookPageUrl:
                settings?.data?.aiChatBotSettings?.facebookPageUrl || "",
              ConpanyWebsiteUrl:
                settings?.data?.aiChatBotSettings?.ConpanyWebsiteUrl,
            });
            setIsExisting(true);
          }
        })
        .catch((err) => {
          toast.error(err.message || "Failed to fetch AI chatbot settings");
        })
        .finally(() => setLoading(false));
    }
  }, [orgId, dispatch]);

  const COMPANY_INFO_MAX_LENGTH = 500;

  const handleAiChange = (field: AiFieldKey, value: string) => {
    setAiSettings((prev) => ({ ...prev, [field]: value }));
    if (field === "companyInfo" && value.length < 500) {
      setCompanyInfoError(
        "Company Information must be at least 500 characters long."
      );
    } else {
      setCompanyInfoError("");
    }
  };

  const handleToggleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    setIsAiEnabled(newValue);
    setAiSettings((prev) => ({ ...prev, isAiEnabled: newValue }));
    setLoading(true);

    try {
      await dispatch(
        updateOrganization({
          orgId: user?.orgId || "",
          data: {
            aiEnabled: newValue,
          },
        })
      ).unwrap();

      toast.success("AI chatbot status updated successfully!");
      window.location.reload();
    } catch (error: unknown) {
      setAiSettings((prev) => ({ ...prev, isAiEnabled: !newValue }));
      setIsAiEnabled(!newValue);
      const errorMessage =
        typeof error === "string"
          ? error
          : "Failed to update AI chatbot status";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aiSettings.companyInfo.length < 500) {
      setCompanyInfoError(
        "Company Information must be at least 500 characters long."
      );
      return;
    }
    setLoading(true);
    dispatch(
      createAiChatBotSettings({
        orgId,
        data: { aiChatBotSettings: aiSettings },
      })
    )
      .unwrap()
      .then(() => {
        toast.success("AI Settings updated successfully!");
        setIsExisting(true);
      })
      .catch((err) => toast.error(err.message || "Failed to update settings"))
      .finally(() => setLoading(false));
  };

  const handleTabChange = (_: any, newValue: number) => {
  setSelectedTab(newValue);
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit} >
        <Box sx={{ display: "flex", justifyContent: "flex-start", p: 1 }}>
          <FormControlLabel
            sx={{ color: "#35495c", marginBottom: "10px" }}
            control={
              loading ? (
                <CircularProgress size={24} sx={{ marginRight: "10px" }} />
              ) : (
                <Switch
                  checked={isAiEnabled}
                  onChange={handleToggleChange}
                  disabled={loading}
                />
              )
            }
            label="Enable AI Chatbot"
          />
        </Box>

        {isAiEnabled ? (
          <>
            <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 2 }}>
              <Tab label="Agency Info" sx={{ fontWeight: 'bold' }} />
              <Tab label="FAQ" sx={{ fontWeight: 'bold' }}/>
              <Tab label="Pricing" sx={{ fontWeight: 'bold' }}/>
            </Tabs>

            {selectedTab === 0 && (
              <Grid container spacing={1.5}>
                {aiChatbotFields.map((field) => (
                  <Grid key={field.key} size={field.sm}>
                    <TextField
                      label={field.label}
                      value={aiSettings[field.key]}
                      onChange={(e) => handleAiChange(field.key, e.target.value)}
                      fullWidth
                      multiline={field.multiline || false}
                      rows={field.rows || 1}
                      required={field.required}
                      InputProps={{
                        endAdornment:
                          field.key === "companyInfo" &&
                          aiSettings.companyInfo.length <
                            COMPANY_INFO_MAX_LENGTH ? (
                          <Typography
                            variant="caption"
                            sx={{
                              position: "absolute",
                              bottom: 0,
                              right: 10,
                              color: "rgba(0, 0, 0, 0.6)",
                              fontSize: "0.75rem",
                            }}
                          >
                            {aiSettings.companyInfo.length} /{" "}
                            {COMPANY_INFO_MAX_LENGTH}
                          </Typography>
                        ) : null,
                      }}
                      error={
                        field.key === "companyInfo" && Boolean(companyInfoError)
                      }
                    />
                  </Grid>
                ))}
                <Grid size={12}>
                  <Button
                    sx={{
                      float: "right",
                      color: "#1e293b",
                      marginTop: "5px",
                      backgroundColor: "var(--theme-color)",
                    }}
                    type="submit"
                    variant="contained"
                    disabled={!isAiEnabled || loading}
                  >
                    {loading
                      ? "Saving..."
                      : isExisting
                      ? "Edit AI Settings"
                      : "Save AI Settings"}
                  </Button>
                </Grid>
              </Grid>
            )}

            {selectedTab === 1 && <FAQConfiguration />}
            {selectedTab === 2 && <PricingConfiguration />}
          </>
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
