import React, { useEffect, useState } from "react";
import { InputLabel, SelectChangeEvent } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { assignTask } from "../../../redux/slice/taskSlice";
import { AppDispatch, RootState } from "../../../redux/store/store";
import toast from "react-hot-toast";
import {
  StyledFormControl,
  StyledSelect,
  StyledMenuItem,
} from "./assignedDropDown.styled";

interface AssignedDropDownProps {
  taskId: string;
  assignedTo?: string;
}

const AssignedDropDown: React.FC<AssignedDropDownProps> = ({ taskId, assignedTo }) => {
  console.log("AssignedDropDownProps:", taskId, assignedTo);
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((state: RootState) => state.agents);
  const [assignedValue, setAssignedValue] = useState<string>(assignedTo || "");

  useEffect(() => {
    setAssignedValue(assignedTo || "");
  }, [assignedTo]);

  const handleChange = async (event: SelectChangeEvent<unknown>) => {
    const newValue = event.target.value as string;
    setAssignedValue(newValue);
    try {
      await dispatch(assignTask({ id: taskId, assignedTo: newValue })).unwrap().then((res) => {
        if (res) {
          toast.success("Task assigned successfully");
        }
      });
    } catch (error: any) {
      console.error("Error assigning task:", error);
      toast.error(error || "Failed to assign task");
    }
  };

  return (
    <StyledFormControl variant="outlined" size="small">
      {!assignedValue && <InputLabel id="assigned-label">Assigned</InputLabel>}
      <StyledSelect
        labelId="assigned-label"
        id="assigned-select"
        value={assignedValue}
        onChange={handleChange}
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
            </StyledMenuItem>
          ))}
      </StyledSelect>


    </StyledFormControl>
  );
};

export default AssignedDropDown;
