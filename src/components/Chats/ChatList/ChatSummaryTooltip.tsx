import React, { useEffect } from "react";
import { CircularProgress, Typography, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { chatSummaryData } from "../../../redux/slice/threadSlice";
import { RootState, AppDispatch } from "../../../redux/store/store";

interface ChatSummaryTooltipProps {
  threadId: string;
  hoverMode?: boolean;
}

function getSatisfactionEmoji(score?: number) {
  switch (score) {
    case 5: return "😍"; 
    case 4: return "😊"; 
    case 3: return "😐"; 
    case 2: return "😕"; 
    case 1: return "😡"; 
    default: return "❓";
  }
}
const ChatSummaryTooltip: React.FC<ChatSummaryTooltipProps> = ({ threadId, hoverMode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const summary = useSelector((state: RootState) => state.thread.summaryData[threadId]);
  const loading = useSelector((state: RootState) => state.thread.loading);
  const error = useSelector((state: RootState) => state.thread.error);

  useEffect(() => {
    if (hoverMode && !summary) {
      dispatch(chatSummaryData(threadId));
    }
  }, [hoverMode, summary, dispatch, threadId]);



  if (hoverMode) {
    if (loading) return <CircularProgress size={16} />;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!summary?.data[0]) return <Typography>No summary available.</Typography>;
    const data = summary?.data?.[0] || {};
    return (
      <Box
        sx={{
          borderRadius: 2,
          p: 2,
          minWidth: 320,
          maxWidth: 400,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <span>📝 </span>
          <Typography variant="subtitle1" fontWeight={700}>
            Chat Summary
          </Typography>
        </Box>
        <Box sx={{ borderBottom: "1px solid #eee", mb: 1 }} />

        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
          <span>🔍 </span>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              Summary:
            </Typography>
            <Typography variant="body2" sx={{ ml: 2 }}>
              {data.summary}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <span>🧠 </span>
          <Typography variant="body2" fontWeight={600}>
            Intent:
          </Typography>
          <Typography variant="body2" sx={{ ml: 1 }}>
            {data.intent}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <span>😊 </span>
          <Typography variant="body2" fontWeight={600}>
            Satisfaction:
          </Typography>
          <Typography variant="body2" sx={{ ml: 1 }}>
            {getSatisfactionEmoji(data.satisfactionScore)}{` Score (${data.satisfactionScore})`}
          </Typography>
        </Box>
      </Box>
    );
  }
};

export default ChatSummaryTooltip;
