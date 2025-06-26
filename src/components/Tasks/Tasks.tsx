import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import TaskList from "./TaskList/TaskList";
import { TaskContainer } from "./tasks.styled";
import { getAllTasks } from "../../redux/slice/taskSlice";
import { CircularProgress, Box, Typography } from "@mui/material";
import ChatArea from "../Chats/ChatArea/ChatArea";
import AssignedDropDown from "./AssignedDropDown/AssignedDropDown";
import { fetchAgents } from "../../redux/slice/agentsSlice";
import { DropDownPurpose } from "../../enums";

export default function Tasks() {
  const dispatch = useDispatch<AppDispatch>();
  const {user} = useSelector((state: RootState) => state.user);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isUpdated,setIsUpdated] = useState<boolean>(false)

  useEffect(() => {
    if (!user) return;
  
    (async () => {
      const { payload: tasks = [] } = await dispatch(getAllTasks());
  
      if (Array.isArray(tasks) && tasks.length > 0) {
        dispatch(fetchAgents(user.orgId));
      }
    })();
  }, [dispatch, user,isUpdated]);
  

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
          
          {(
            <ChatArea 
            onClose={() => setSelectedTaskId(null)} 
            selectedThreadId={selectedTask?.threadId || ""} 
            tasks={tasks.filter((task) => task.id === selectedTaskId)} 
            assignedDropdown={
              <AssignedDropDown
                taskId={selectedTask?.id||""}
                assignedTo={selectedTask?.assignedTo || ""}
                purpose={DropDownPurpose.Task}
                setIsUpdated={setIsUpdated}
              />
            }/>
          )}
        </>
      ) : (
        <Box sx={{width:'100%', fontFamily:'var(--custom-font-family)', display:'flex', alignItems:'center', justifyContent:'center'}}>No tasks available</Box>
      )}
    </TaskContainer>
  );
}
