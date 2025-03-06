import React from "react";
import { CardContent } from "@mui/material";
import { Grid } from "@mui/material";
import { AnalyticsCard, CardHeader, AnalyticsValue, ContentContainer } from "./home.styled"; // Assuming you are importing styled components

// Sample data from the JSON object
const data = {
  totalConversations: {
    value: 1323,
    background: "#e0f7fa"
  },
  activeThreads: {
    value: 34,
    background: "linear-gradient(45deg, #6e7f80, #b0c9c0)"
  },
  userMessages: {
    value: 2456,
    background: "#f4f4f9"
  },
  totalAgents: {
    value: 1974,
    background: "#ffe0e0"
  },
};

const Dashboard: React.FC = () => {
  return (
    <ContentContainer>
      {/* <Typography variant="h4" gutterBottom>
        Chatbot Analytics Dashboard
      </Typography> */}
      <Grid container spacing={2} direction="row" justifyContent="space-between" wrap="wrap">
        {Object.entries(data).map(([key, { value, background }]) => (
          <Grid item key={key}>
            <AnalyticsCard background={background}>
              <CardContent>
                <CardHeader>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</CardHeader>
                <AnalyticsValue>{value}</AnalyticsValue>
              </CardContent>
            </AnalyticsCard>
          </Grid>
        ))}
      </Grid>
    </ContentContainer>
  );
};

export default Dashboard;
