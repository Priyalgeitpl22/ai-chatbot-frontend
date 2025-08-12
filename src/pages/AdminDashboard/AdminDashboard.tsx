
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
