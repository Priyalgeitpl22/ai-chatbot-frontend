import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { StatsCard, CardHeader, CardsContainer, CardValue } from "./styled";
import { AppDispatch } from "../../redux/store/store";
import { fetchDashboardStats } from "../../redux/slice/analyticsSlice";

interface StatItem {
  label: string;
  value: string;
  trend?: string;
  background: string;
}

const StatsOverview: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

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
    },
  ];

  return (
    <CardsContainer>
      {statsData.map((item) => (
        <StatsCard background={item.background} >
          <CardHeader>{item.label}</CardHeader>
          <CardValue>{item.value}</CardValue>
        </StatsCard>
      ))}
    </CardsContainer>
  );
};

export default StatsOverview;
