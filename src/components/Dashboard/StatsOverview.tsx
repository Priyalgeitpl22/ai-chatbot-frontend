import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  StatsCard,
  CardHeader,
  CardValue,
} from "./styled"
import { AppDispatch, RootState } from "../../redux/store/store";
import { fetchDashboardStats } from "../../redux/slice/analyticsSlice";

interface StatItem {
  label: string;
  value: string;
  trend?: string;
  background: string;
}

const StatsOverview: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dashboardStats, dashboardStatsLoading, dashboardStatsError } = useSelector(
    (state: RootState) => state.analytics
  );

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (dashboardStatsLoading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((idx) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <StatsCard background="#f3f6ff">
                <CardHeader>Loading...</CardHeader>
                <CardValue>—</CardValue>
              </StatsCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (dashboardStatsError || !dashboardStats) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((idx) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <StatsCard background="#f3f6ff">
                <CardHeader>Error</CardHeader>
                <CardValue>—</CardValue>
              </StatsCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    );
  }

  const statsData: StatItem[] = [
    {
      label: "TOTAL CHATS",
      value: "2,540",
      trend: "+15.8%",
      background: "#f3f6ff",
    },
    {
      label: "CHATS WITH AGENT",
      value: "1,420",
      trend: "+4.3%",
      background: "#fff5f5",
    },
    {
      label: "AI CHATS",
      value: "1,120",
      trend: "+32.5%",
      background: "#fff8f0",
    },
    {
      label: "COMPLETED CHATS",
      value: "1,042",
      trend: "+2%",
      background: "#f0fff4",
    }
  ];

  return (
    <Box sx={{ height: '100%' }}>
      <Grid container spacing={3} sx={{ height: '100%' }}>
        {statsData.map((item, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              style={{ height: '100%' }}
            >
              <StatsCard background={item.background} style={{ height: '100%' }}>
                <CardHeader>{item.label}</CardHeader>
                <CardValue>
                  {item.value}
                  {item.trend && (
                    <Box component="span" sx={{ 
                      fontSize: '14px',
                      color: '#28a745',
                      marginLeft: '8px'
                    }}>
                      {item.trend}
                    </Box>
                  )}
                </CardValue>
              </StatsCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StatsOverview;
