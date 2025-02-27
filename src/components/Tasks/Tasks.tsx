import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import TaskList from "./TaskList/TaskList";
import { TaskContainer } from "./tasks.styled";
import { getAllTasks } from "../../redux/slice/taskSlice";
import { CircularProgress, Box, Typography } from "@mui/material";
import ChatArea from "../Chats/ChatArea/ChatArea";
import AssignedDropDown from "./AssignedDropDown/AssignedDropDown";

export default function Tasks() {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getAllTasks());
  }, [dispatch]);

  const { tasks, loading, error } = useSelector((state: RootState) => state.task);

  const handleSelectTask = (taskId: string) => {
    setSelectedTaskId(taskId); 
  };

  const selectedTask = tasks.find((task) => task.id === selectedTaskId); 

  return (
    <TaskContainer>
      {loading ? (
        <Box sx={{ width:'100%', display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : tasks.length > 0 ? (
        <>
          <TaskList
            tasks={tasks}
            onSelectTask={handleSelectTask}
            selectedTaskId={selectedTaskId}
          />
          
          {selectedTask && (
            <ChatArea onClose={() => setSelectedTaskId(null)} selectedThreadId={selectedTask.threadId} assignedDropdown={
              <AssignedDropDown
                taskId={selectedTask.id}
                assignedTo={selectedTask.assignedTo} 
              />
            }/>
          )}
        </>
      ) : (
        <Box sx={{width:'100%',display:'flex', alignItems:'center', justifyContent:'center'}}>No tasks available</Box>
      )}
    </TaskContainer>
  );
}
