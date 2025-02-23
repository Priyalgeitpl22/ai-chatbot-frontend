import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  SelectChangeEvent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { AddAPhoto, Delete, Schedule } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { createAgent, updateAgent } from "../../../../redux/slice/agentsSlice";
import {
  TabPanel,
  FormGroup,
  AvatarWrapper,
  AvailabilityContainer,
} from "./AgentDialog.styled";
import { AppDispatch, RootState } from "../../../../redux/store/store";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "../../../../styles/layout.styled";
import Loader from "../../../Loader";
import fieldValidation from "../../../../validations/FieldValidation";

interface ScheduleSlot {
  day: string;
  hours: { startTime: Dayjs; endTime: Dayjs }[];
}

export interface Agent {
  id: string;
  fullName: string;
  email: string;
  role: string;
  orgId: string;
  profilePicture: File | null;
  phone?: string;
  schedule: {
    timeZone: string;
    schedule: (ScheduleSlot & { startTime?: string; endTime?: string })[];
  };
}

interface AgentDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (newAgent: Omit<Agent, "id">) => void;
  agent?: Agent | null;
}

const defaultStartTime: Dayjs = dayjs("09:00AM", "hh:mmA");
const defaultEndTime: Dayjs = dayjs("05:00PM", "hh:mmA");

const defaultAgent: Agent = {
  fullName: "",
  email: "",
  phone: "",
  profilePicture: null,
  role: "Agent",
  schedule: {
    timeZone: "UTC -05:00 Eastern Time",
    schedule: [
      {
        day: "Monday",
        hours: [{ startTime: defaultStartTime, endTime: defaultEndTime }],
      },
    ],
  },
  id: "",
  orgId: "",
};

const steps = ["Personal Details", "Schedule"];

const getAgentValidationError = (
  field: "fullName" | "email" | "phone",
  value: string
): string => {
  const rules = fieldValidation[field];
  if (!value || value.trim() === "") {
    return rules?.required?.message || `${field} is required`;
  }
  if (rules?.minLength && value.length < rules.minLength.value) {
    return rules.minLength.message;
  }
  if (rules?.pattern) {
    const patternRegex = new RegExp(rules.pattern.value);
    if (!patternRegex.test(value)) {
      return rules.pattern.message;
    }
  }
  return "";
};

const AgentDialog: React.FC<AgentDialogProps> = ({ open, onClose, onSave, agent }) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [formData, setFormData] = useState<Agent>(defaultAgent);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; phone?: string }>({});

  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!open) return;
    if (agent) {
      const timeZoneValue = agent.schedule.timeZone || defaultAgent.schedule.timeZone;
      const convertedSchedule = {
        timeZone: timeZoneValue,
        schedule: agent.schedule.schedule.map((slot) => {
          let startVal: string | Dayjs | undefined;
          let endVal: string | Dayjs | undefined;
          if (slot.startTime) {
            startVal = slot.startTime;
            endVal = slot.endTime;
          } else if (slot.hours?.[0]) {
            startVal = slot.hours[0].startTime;
            endVal = slot.hours[0].endTime;
          }
          let parsedStart = dayjs(startVal, ["h:mmA", "h:mm A", "HH:mm"], true);
          if (!parsedStart.isValid() && dayjs.isDayjs(startVal)) {
            parsedStart = startVal as Dayjs;
          } else if (!parsedStart.isValid()) {
            parsedStart = defaultStartTime;
          }
          let parsedEnd = dayjs(endVal, ["h:mmA", "HH:mm"]);
          if (!parsedEnd.isValid() && dayjs.isDayjs(endVal)) {
            parsedEnd = endVal as Dayjs;
          } else if (!parsedEnd.isValid()) {
            parsedEnd = defaultEndTime;
          }
          return {
            day: slot.day,
            hours: [
              {
                startTime: parsedStart,
                endTime: parsedEnd,
              },
            ],
          };
        }),
      };
      setFormData({
        ...agent,
        profilePicture: null,
        schedule: convertedSchedule,
      });
      setSelectedFile(null);
      setPreviewUrl(undefined);
    } else {
      setFormData(defaultAgent);
      setSelectedFile(null);
      setPreviewUrl(undefined);
    }
  }, [open, agent]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "fullName" || name === "email" || name === "phone") {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    if (name === "timezone") {
      setFormData((prev) => ({
        ...prev,
        schedule: { ...prev.schedule, timeZone: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFormData((prev) => ({
        ...prev,
        profilePicture: file,
      }));
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const newUrl = URL.createObjectURL(file);
      setPreviewUrl(newUrl);
    }
  };

  const handleAddSchedule = () => {
    setFormData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        schedule: [
          ...prev.schedule.schedule,
          {
            day: "Monday",
            hours: [{ startTime: defaultStartTime, endTime: defaultEndTime }],
          },
        ],
      },
    }));
  };

  const handleDeleteSchedule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        schedule: prev.schedule.schedule.filter((_, i) => i !== index),
      },
    }));
  };

  const handleScheduleChange = (
    index: number,
    field: keyof ScheduleSlot,
    value: string
  ) => {
    setFormData((prev) => {
      const updatedSchedule = prev.schedule.schedule.map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot
      );
      return {
        ...prev,
        schedule: { ...prev.schedule, schedule: updatedSchedule },
      };
    });
  };

  const handleHoursChange = (
    index: number,
    hourIndex: number,
    field: "startTime" | "endTime",
    newValue: Dayjs | null
  ) => {
    if (!newValue) return;
    setFormData((prev) => {
      const updatedSchedule = prev.schedule.schedule.map((slot, i) => {
        if (i === index) {
          const updatedHours = slot.hours.map((hour, hIndex) =>
            hIndex === hourIndex ? { ...hour, [field]: newValue } : hour
          );
          return { ...slot, hours: updatedHours };
        }
        return slot;
      });
      return {
        ...prev,
        schedule: { ...prev.schedule, schedule: updatedSchedule },
      };
    });
  };

  // Validate personal details fields ("fullName", "email", "phone")
  const validateAgentDetails = (): boolean => {
    let valid = true;
    const newErrors: { fullName?: string; email?: string; phone?: string } = {};
    const fullNameError = getAgentValidationError("fullName", formData.fullName);
    if (fullNameError) {
      newErrors.fullName = fullNameError;
      valid = false;
    }
    const emailError = getAgentValidationError("email", formData.email);
    if (emailError) {
      newErrors.email = emailError;
      valid = false;
    }
    const phoneError = getAgentValidationError("phone", formData.phone || "");
    if (phoneError) {
      newErrors.phone = phoneError;
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleNext = () => {
    if (!validateAgentDetails()) {
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSave = async () => {
    setLoading(true);
    const payload = {
      email: formData.email,
      fullName: formData.fullName,
      phone: formData.phone || "",
      role: formData.role,
      orgId: user!.orgId,
      aiOrgId: user?.aiOrgId,
      profilePicture: selectedFile,
      schedule: {
        timeZone: formData.schedule.timeZone,
        schedule: formData.schedule.schedule.map((slot) => ({
          day: slot.day,
          hours: [
            {
              startTime: slot.hours[0].startTime,
              endTime: slot.hours[0].endTime,
            },
          ],
        })),
      },
    };

    try {
      if (agent) {
        await dispatch(updateAgent({ agentId: agent.id ?? "", data: payload }) as any).unwrap();
        toast.success("Agent updated successfully");
        onSave(payload);
      } else {
        await dispatch(createAgent(payload) as any).unwrap();
        toast.success("Agent created successfully");
        onSave(payload);
      }
    } catch (error: any) {
      console.error("Error updating/creating agent:", error);
      toast.error(agent ? "Failed to update agent" : "Failed to create agent");
    } finally {
      setLoading(false);
      setFormData(defaultAgent);
      setActiveStep(0);
      window.location.reload();
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, idx) => (
            <Step key={idx}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>
      <DialogContent>
        {activeStep === 0 && (
          <TabPanel
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AvatarWrapper>
              <Avatar
                src={previewUrl || (typeof agent?.profilePicture === "string" ? agent.profilePicture : "")}
                alt={formData.fullName}
              />
              <IconButton component="label">
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <AddAPhoto fontSize="small" />
              </IconButton>
            </AvatarWrapper>
            <FormGroup>
              <TextField
                label="Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                error={!!errors.fullName}
                helperText={errors.fullName}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: "var(--theme-color)" },
                    "&.Mui-focused fieldset": { borderColor: "var(--theme-color)" },
                  },
                }}
              />
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: "var(--theme-color)" },
                    "&.Mui-focused fieldset": { borderColor: "var(--theme-color)" },
                  },
                }}
              />
              <TextField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                error={!!errors.phone}
                helperText={errors.phone}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: "var(--theme-color)" },
                    "&.Mui-focused fieldset": { borderColor: "var(--theme-color)" },
                  },
                }}
              />
              <FormControl fullWidth variant="outlined">
                <InputLabel>User Role</InputLabel>
                <Select
                  label="User Role"
                  name="role"
                  value={formData.role}
                  onChange={handleSelectChange}
                  sx={{
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "var(--theme-color)" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "var(--theme-color)" },
                  }}
                >
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Agent">Agent</MenuItem>
                </Select>
              </FormControl>
            </FormGroup>
          </TabPanel>
        )}
        {activeStep === 1 && (
          <TabPanel
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FormControl fullWidth variant="outlined">
              <InputLabel>Time Zone</InputLabel>
              <Select
                label="Time Zone"
                name="timezone"
                value={formData.schedule.timeZone}
                onChange={handleSelectChange}
                sx={{
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "var(--theme-color)" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "var(--theme-color)" },
                }}
              >
                <MenuItem value="UTC -05:00 Eastern Time">UTC -05:00 Eastern Time</MenuItem>
                <MenuItem value="UTC -08:00 Pacific Time">UTC -08:00 Pacific Time</MenuItem>
              </Select>
            </FormControl>
            <AvailabilityContainer>
              <Typography
                variant="h6"
                sx={{ color: "#1e293b", display: "flex", alignItems: "center", gap: 1 }}
              >
                <Schedule /> Availability
              </Typography>
              {formData.schedule.schedule.map((slot, index) => (
                <motion.div
                  key={index}
                  className="availability-row"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ padding: "10px 10px" }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Select
                    value={slot.day}
                    onChange={(e) => handleScheduleChange(index, "day", e.target.value)}
                    variant="outlined"
                    sx={{
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "var(--theme-color)" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "var(--theme-color)" },
                    }}
                  >
                    <MenuItem value="WeekEnds">WeekEnds</MenuItem>
                    <MenuItem value="WeekDays">WeekDays</MenuItem>
                    <MenuItem value="Monday">Monday</MenuItem>
                    <MenuItem value="Tuesday">Tuesday</MenuItem>
                    <MenuItem value="Wednesday">Wednesday</MenuItem>
                    <MenuItem value="Thursday">Thursday</MenuItem>
                    <MenuItem value="Friday">Friday</MenuItem>
                    <MenuItem value="Saturday">Saturday</MenuItem>
                    <MenuItem value="Sunday">Sunday</MenuItem>
                  </Select>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      label="Start Time"
                      value={slot.hours[0].startTime}
                      onChange={(newValue) => handleHoursChange(index, 0, "startTime", newValue)}
                      ampm
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": { borderColor: "var(--theme-color)" },
                          "&.Mui-focused fieldset": { borderColor: "var(--theme-color)" },
                        },
                      }}
                    />
                    <TimePicker
                      label="End Time"
                      value={slot.hours[0].endTime}
                      onChange={(newValue) => handleHoursChange(index, 0, "endTime", newValue)}
                      ampm
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": { borderColor: "var(--theme-color)" },
                          "&.Mui-focused fieldset": { borderColor: "var(--theme-color)" },
                        },
                      }}
                    />
                  </LocalizationProvider>
                  <IconButton onClick={() => handleDeleteSchedule(index)} size="small">
                    <Delete />
                  </IconButton>
                </motion.div>
              ))}
              <Button
                onClick={handleAddSchedule}
                style={{
                  width: "fit-content",
                  background: "#fff",
                  fontWeight: 400,
                  border: "1px solid var(--theme-color)",
                }}
              >
                + Add Hours
              </Button>
            </AvailabilityContainer>
          </TabPanel>
        )}
      </DialogContent>
      <DialogActions sx={{ padding: 3, gap: 2 }}>
        {activeStep === 0 ? (
          <Button onClick={handleNext}>Next</Button>
        ) : (
          <>
            <Button
              onClick={handleBack}
              style={{ border: "1px solid var(--theme-color)", background: "#fff" }}
            >
              Back
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </>
        )}
      </DialogActions>
      {loading && <Loader />}
      <Toaster />
    </Dialog>
  );
};

export default AgentDialog;
