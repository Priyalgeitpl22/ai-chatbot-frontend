import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store/store";
import { fetchAnalyticsAll } from "../../redux/slice/analyticsSlice";
import {
  StatsOverview,
  ChatVolumeChart,
  EmailTranscripts,
  TopIntentsList,
  SatisfactionSummary,
  AIEffectivenessChart,
  ChatStatusChart,
} from "../../components/Dashboard";
import {
  BottomSection,
  ChartsSection,
  DashboardContent,
  StatsSection,
} from "./adminStyled";


export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
    dispatch(fetchAnalyticsAll());
  }, [dispatch]);

  return (
    <DashboardContent container>

      <StatsSection>
        <StatsOverview />
      </StatsSection>

      <ChartsSection>
        <ChatVolumeChart />
        <AIEffectivenessChart />
      </ChartsSection>

      <BottomSection>
        <ChatStatusChart />
        <TopIntentsList />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%'}}>
          <SatisfactionSummary />
          <EmailTranscripts />
        </div>
      </BottomSection>
    </DashboardContent>
  );
}
