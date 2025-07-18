// TaskItem.tsx
import React from "react";
import { Tooltip, Avatar, ListItemAvatar, ListItemText, Box, Typography, Chip } from "@mui/material";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { TaskListItem, TimeStamp, TaskPreview } from './taskList.styled';
import { formatTimestamp } from '../../../utils/utils';
import { Task } from "../../../redux/slice/taskSlice";

const MotionTaskListItem = motion(TaskListItem);

interface TaskItemProps {
  task: Task;
  index: number;
  isActive: boolean;
  onSelectTask: (taskId: string) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "high":
      return "error";
    case "medium":
      return "warning";
    case "low":
      return "info";
    default:
      return "success";
  }
};

const TaskItem: React.FC<TaskItemProps> = ({ task, index, isActive, onSelectTask }) => {
  return (
    <Tooltip
      title={
        <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Info size={18} color="#1976d2" />
          <Typography variant="body2" sx={{ fontFamily: "var(--custom-font-family)" }}>
            {task.query}
          </Typography>
        </Box>
      }
      placement="right"
      arrow
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: "#fff",
            color: "#000",
            boxShadow: 2,
            border: "1px solid #e0e0e0",
            fontSize: "0.85rem",
            padding: "8px 12px",
            borderRadius: "6px",
          },
        },
        arrow: { sx: { color: "#fff" } },
      }}
    >
      <MotionTaskListItem
        data-active={isActive ? "true" : "false"}
        onClick={() => onSelectTask(task.id)}
        initial="hidden"
        animate="visible"
        variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
        transition={{ delay: index * 0.1 }}
        whileTap={{ scale: 0.98 }}
        sx={{
          cursor: "pointer",
          gap: "3px",
          padding: "10px",
          borderRadius: "5px",
          bgcolor: `${!task.readed ? "var(--theme-color)" : ""}`,
        }}
      >
        <ListItemAvatar>
          <Avatar
            sx={{
              bgcolor: `${!task.readed ? "var(--theme-color-dark)" : "var(--theme-color"}`,
              width: 32,
              height: 32,
            }}
          >
            {task.name[0]?.toUpperCase() || "?"}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={task.name}
          secondary={<TaskPreview>{task.query}</TaskPreview>}
          primaryTypographyProps={{
            variant: "body1",
            fontFamily: "var(--custom-font-family)",
            fontSize: "0.9rem",
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column-reverse",
            width: "100%",
            alignItems: "flex-end",
            gap: "5px",
            height: "100%",
          }}
        >
          <Chip
            label={task.priority}
            color={getPriorityColor(task.priority)}
            size="small"
            sx={{ fontSize: "0.75rem", fontWeight: 500, marginRight: "5px", borderRadius: "5px" }}
          />
          <TimeStamp>{formatTimestamp(task.createdAt)}</TimeStamp>
        </Box>
      </MotionTaskListItem>
    </Tooltip>
  );
};

// ✅ Wrap with React.memo for performance
export default React.memo(TaskItem);
