import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
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
    console.log("StatsOverview: Dispatching fetchDashboardStats");
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
      value: dashboardStats.totalChats.value.toString(),
      trend: dashboardStats.totalChats.trend,
      background: "#f3f6ff",
    },
    {
      label: "CHATS WITH AGENT",
      value: dashboardStats.agentChats.value.toString(),
      trend: dashboardStats.agentChats.trend,
      background: "#fff5f5",
    },
    {
      label: "AI CHATS",
      value: dashboardStats.aiChats.value.toString(),
      trend: dashboardStats.aiChats.trend,
      background: "#fff8f0",
    },
    {
      label: "COMPLETED CHATS",
      value: dashboardStats.completedChats.value.toString(),
      trend: dashboardStats.completedChats.trend,
      background: "#f0fff4",
    }
  ];

  return (
    <>
      <Grid container spacing={3}>
        {statsData.map((item, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <StatsCard background={item.background}>
                <CardHeader>{item.label}</CardHeader>
                <CardValue>
                  <span>{item.value}</span>
                  {item.trend && (
                    <span
                      style={{
                        marginLeft: "8px",
                        fontSize: "0.8rem",
                        color: item.trend.startsWith("+") ? "green" : "red",
                      }}
                    >
                      {item.trend}
                    </span>
                  )}
                </CardValue>



              </StatsCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default StatsOverview;
