import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import {
  TaskListContainer,
  TaskListHeader,
  TaskListItem,
  TaskListWrapper,
} from './taskList.styled';
import { useSocket } from '../../../context/SocketContext';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store/store';
import { getAllTasks, Task } from '../../../redux/slice/taskSlice';
import FilterComponent from '../Filters/FilterComponent';
import TaskItems from './TaskItems';

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
        <Typography fontFamily={'var(--custom-font-family)'} variant="h6" sx={{fontWeight: 500, color:'#35495c' }}>
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
                  <TaskItems
      key={task.id}
      task={task}
      index={index}
      isActive={isActive}
      onSelectTask={onSelectTask}
    />
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
