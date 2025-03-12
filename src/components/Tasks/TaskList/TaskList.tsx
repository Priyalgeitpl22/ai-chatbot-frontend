import React, { useEffect, useState } from 'react';
import { ListItemAvatar, Avatar, ListItemText, Box, Typography, Chip } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import {
  TaskListContainer,
  TaskListHeader,
  TaskListItem,
  TaskListWrapper,
  TimeStamp,
  TaskPreview,
} from './taskList.styled';
import { useSocket } from '../../../context/SocketContext';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store/store';
import { formatTimestamp } from '../../../utils/utils';
import { getAllTasks, Task } from '../../../redux/slice/taskSlice';
import { Priority } from '../../../enums';
import FilterComponent from '../Filters/FilterComponent';

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

interface TaskListProps {
  tasks: Task[];
  onSelectTask: (taskId: string) => void;
  selectedTaskId: string | null;
}

const MotionTaskListItem = motion(TaskListItem);

const TaskList: React.FC<TaskListProps> = ({ tasks, onSelectTask, selectedTaskId }) => {
  const { socket } = useSocket();
  const dispatch = useDispatch<AppDispatch>();
  const [activeFilter, setActiveFilter] = useState<string>('filter');

  const { user } = useSelector((state: RootState) => state.user); 

  useEffect(() => {
    if (!socket) return;

    const handleNewTask = (data: { taskId: string }) => {
      console.log("New task created with ID:", data.taskId);
      dispatch(getAllTasks());
      onSelectTask(data.taskId);
    };

    socket.on("taskCreated", handleNewTask);
    return () => {
      socket.off("taskCreated", handleNewTask);
    };
  }, [socket, dispatch, onSelectTask]);

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case Priority.HIGH:
        return "error";
      case Priority.MEDIUM:
        return "warning";
      case Priority.LOW:
        return "info";
      default:
        return "success";
    }
  };

  // Filter tasks based on the active filter
  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'unassigned') {
      return task.assignedTo === null;
    }
    if (activeFilter === 'assigned') {
      return task.assignedTo && task.assignedTo === user?.id;
    }
    return true;
  });

  return (
    <TaskListContainer>
      <TaskListHeader>
        <Typography variant="h6" sx={{ fontFamily: 'cursive', fontWeight: 500, color:'#35495c' }}>
          Tickets 
        </Typography>
      </TaskListHeader>
      <FilterComponent activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
      <Box sx={{ overflowY: 'auto', flex: 1 }}>
        <AnimatePresence>
          <TaskListWrapper>
            {filteredTasks && filteredTasks.length > 0 ? (
              filteredTasks.map((task, index) => {
                const isActive = task.id === selectedTaskId; 

                return (
                  <MotionTaskListItem
                    key={task.id}
                    data-active={isActive ? "true" : "false"}
                    onClick={() => onSelectTask(task.id)}
                    variants={listItemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                    whileTap={{ scale: 0.98 }}
                    sx={{ cursor: 'pointer', gap: '3px', padding: '10px', borderRadius: '5px' }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'var(--theme-color)', width: 32, height: 32 }}>
                        {task.name[0]?.toUpperCase() || "?"}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={task.name}
                      secondary={
                        <TaskPreview>
                          {task.query}
                        </TaskPreview>
                      }
                      primaryTypographyProps={{ variant: 'body1', fontSize: '0.9rem' }}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column-reverse', width: '100%', alignItems: 'flex-end', gap: '5px', height: '100%' }}>
                      <Chip
                        label={task.priority}
                        color={getPriorityColor(task.priority)}
                        size="small"
                        sx={{ fontSize: "0.75rem", fontWeight: 500, marginRight: '5px', borderRadius: '5px' }}
                      />
                      <TimeStamp>{formatTimestamp(task.createdAt)}</TimeStamp>
                    </Box>
                  </MotionTaskListItem>
                );
              })
            ) : (
              <MotionTaskListItem
                key="empty"
                variants={listItemVariants}
                initial="hidden"
                animate="visible"
                sx={{ cursor: 'default', justifyContent: 'center', padding: '10px' }}
              >
                <Typography variant="body1">
                  {activeFilter === 'assigned'
                    ? 'No Task is assigned to you'
                    : 'No tasks available'}
                </Typography>
              </MotionTaskListItem>
            )}
          </TaskListWrapper>
        </AnimatePresence>
      </Box>
    </TaskListContainer>
  );
};

export default TaskList;
