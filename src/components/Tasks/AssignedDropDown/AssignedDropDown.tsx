import React, { useEffect, useState } from "react";
import { Button, InputLabel, SelectChangeEvent } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { assignTask } from "../../../redux/slice/taskSlice";
import { assignThread } from "../../../redux/slice/threadSlice";
import { AppDispatch, RootState } from "../../../redux/store/store";
import toast from "react-hot-toast";
import {
  StyledFormControl,
  StyledSelect,
  StyledMenuItem,
} from "./assignedDropDown.styled";
import { unassignThread } from "../../../redux/slice/threadSlice";
import { unassignTask } from "../../../redux/slice/taskSlice";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { DropDownPurpose, ThreadType } from "../../../enums";

interface AssignedDropDownProps {
  taskId: string;
  assignedTo?: string;
  purpose:DropDownPurpose;
  setIsUpdated:React.Dispatch<React.SetStateAction<boolean>>;
}

const AssignedDropDown: React.FC<AssignedDropDownProps> = ({ taskId, assignedTo ,purpose ,setIsUpdated}) => {
  console.log("AssignedDropDownProps:", taskId, assignedTo,purpose);
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((state: RootState) => state.agents);
  const [assignedValue, setAssignedValue] = useState<string>(assignedTo || "");
 
  useEffect(() => {
    setAssignedValue(assignedTo || "");
  }, [assignedTo]);

  const handleChangeTask = async (event: SelectChangeEvent<unknown>) => {
    const newValue = event.target.value as string;
    setAssignedValue(newValue);
    try {
      await dispatch(assignTask({ id: taskId, assignedTo: newValue })).unwrap().then((res) => {
        if (res) {
          toast.success("Task assigned successfully");
          setIsUpdated((data)=>data=!data)
        }
      });
    } catch (error: any) {
      console.error("Error assigning task:", error);
      toast.error(error || "Failed to assign task");
    }
  };
  const handleChangeThread = async (event: SelectChangeEvent<unknown>) => {
    const newValue = event.target.value as string;
    setAssignedValue(newValue);
    try {
      await dispatch(assignThread({ id: taskId, assignedTo: newValue })).unwrap().then((res) => {
        if (res) {
          toast.success("Thread assigned successfully");
          setIsUpdated((data)=>data=!data)
          
        }
      });
      
    } catch (error: any) {
      console.error("Error assigning Thread:", error);
      toast.error(error || "Failed to assign Thread");
    }
  };

  const handleUnassignThread = async()=>{
    setAssignedValue(assignedTo||"")
    try{

      await dispatch(unassignThread({id:taskId})).unwrap().then((res)=>{
        if(res){
          toast.success("Thread unassigned successfully");
          setIsUpdated((data)=>data=!data)
        }
      });

    }catch(error:any){
      console.error("Error unassigning Thread:", error);
      toast.error(error || "Failed to unassign Thread");
    }

  }
  const handleUnassignTask = async()=>{
    setAssignedValue("Assigned")
    try{

      await dispatch(unassignTask({id:taskId})).unwrap().then((res)=>{
        if(res){
          toast.success("Task unassigned successfully");
          setIsUpdated((data)=>data=!data)
        }
      });

    }catch(error:any){
      console.error("Error unassigning Task:", error);
      toast.error(error || "Failed to unassign Task");
    }

  }

  return (
    <StyledFormControl variant="outlined" size="small" >
      {!assignedValue && <InputLabel id="assigned-label">Assigned</InputLabel>}
      <StyledSelect
        labelId="assigned-label"
        id="assigned-select"
        value={assignedValue}
        onChange={purpose===DropDownPurpose.Thread?handleChangeThread:handleChangeTask}
        label={assignedValue ? "" : "Assigned"}
        hasValue={Boolean(assignedValue)}
        renderValue={(selected) => {
          const selectedStr = typeof selected === "string" ? selected : String(selected);
          if (!selectedStr) {
            return <em>Assigned</em>;
          }
          const selectedAgent = data?.find((agent) => agent.id === selectedStr);
          return <span>{selectedAgent ? selectedAgent.fullName : selectedStr}</span>;
        }}
      > 
       {data &&
  data.map((agent) => (
    <StyledMenuItem key={agent.id} value={agent.id}>
      {agent.fullName}
      {assignedValue === agent.id && purpose === DropDownPurpose.Thread && (
        <Button color="error" onClick={(e: React.MouseEvent<HTMLButtonElement>)=>{
          e.stopPropagation()
          handleUnassignThread()}}>
          <CancelOutlinedIcon fontSize="small" />
        </Button> 
      )}
      {assignedValue === agent.id && purpose === DropDownPurpose.Task && (
        <Button color="error" onClick={(e: React.MouseEvent<HTMLButtonElement>)=>{
          e.stopPropagation()
          handleUnassignTask()}}>
          <CancelOutlinedIcon fontSize="small" />
        </Button> 
      )}
    </StyledMenuItem>
  ))}   
      </StyledSelect>
      
    </StyledFormControl>
  );
};

export default AssignedDropDown;
