import { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    InputLabel,
    MenuItem,
    Switch,
    FormControlLabel,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { StyledSelect, StyledSelectContainer, StyledTextField, StyledButton, FormTitle } from "./webhook.styled";




export default function Webhook() {
    const [provider, setProvider] = useState("");
    const [webhookUrl, setWebhookUrl] = useState("");
    const [enabled, setEnabled] = useState(false);

    const handleSubmit = () => {
        if (!webhookUrl) {
            alert("Please enter webhook URL");
            return;
        }
        const payload = {
            provider,
            webhookUrl,
        };
        console.log("Webhook Saved: ", payload);
        alert("Webhook saved successfully!");
    };
    return (
        <Card style={{ width: "100%", boxShadow: "none" }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={enabled}
                                onChange={(e) => setEnabled(e.target.checked)}
                                color="primary"
                                inputProps={{ 'aria-label': 'enable-webhook' }}
                            />
                        }
                        label="Enable Webhook"
                    />
                </Box>

                {enabled ? (
                    <>
                        <FormTitle>WebHooks</FormTitle>
                        <StyledTextField
                            fullWidth
                            label="Webhook URL"
                            placeholder="https://example.com"
                            value={webhookUrl}
                            onChange={(e) => setWebhookUrl(e.target.value)}
                            sx={{ mb: 3 }}
                        />

                        <Typography sx={{ pb: 2 }}>Push webhook To</Typography>
                        {/* Provider Select Dropdown */}
                        <StyledSelectContainer fullWidth>
                            <InputLabel htmlFor="webhook-provider-select">Webhook Provider</InputLabel>

                            <StyledSelect
                                id="webhook-provider-select"
                                value={provider}
                                label="Webhook Provider"
                                onChange={(e) => setProvider(e.target.value as string)}
                            >
                                <MenuItem value="">Choose a provider</MenuItem>  {/* Better placeholder */}
                                <MenuItem value="WebSpot">WebSpot</MenuItem>
                                <MenuItem value="PipeDrive">PipeDrive</MenuItem>
                                <MenuItem value="Zoho">Zoho</MenuItem>
                                <MenuItem value="GoHighLevel">Go High Level</MenuItem>
                            </StyledSelect>
                        </StyledSelectContainer>

                        {/* Submit Button */}
                        <Box display="flex" justifyContent="flex-end" alignItems={"center"} mt={2}>
                            <StyledButton type="button" onClick={handleSubmit}>Save</StyledButton>
                        </Box>
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
                                Webhook Not Enabled
                            </Button>
                        </Grid>
                    </Grid>
                )}


            </CardContent>
        </Card>

    );
}

