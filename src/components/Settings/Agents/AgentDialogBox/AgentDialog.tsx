import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
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
} from "@mui/material";
import { AddAPhoto } from "@mui/icons-material";
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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface ScheduleSlot {
  day: string;
  // Internally, we store times as Dayjs objects for the TimePicker
  hours: { startTime: Dayjs; endTime: Dayjs }[];
}

export interface Agent {
  id: string;
  fullName: string;
  email: string;
  role: string;
  orgId: string;
  profilePicture: string;
  phone?: string;
  schedule: {
    timeZone: string;
    schedule: (ScheduleSlot & {
      starttime?: string; // flat keys from payload
      endTime?: string;   // flat keys from payload
    })[];
  };
}

interface AgentDialogProps {
  open: boolean;
  onClose: () => void;
  agent?: Agent | null;
}

// Default times for new agent: 9:00 AM and 5:00 PM
const defaultStartTime: Dayjs = dayjs("09:00", "HH:mm");
const defaultEndTime: Dayjs = dayjs("17:00", "HH:mm");

// Default agent in internal format (with valid Dayjs objects)
const defaultAgent: Agent = {
  fullName: "",
  email: "",
  phone: "",
  profilePicture: "",
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

const AgentDialog: React.FC<AgentDialogProps> = ({ open, onClose, agent }) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [formData, setFormData] = useState<Agent>(defaultAgent);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  // -------------------------------
  // Effect: Convert schedule on open
  // -------------------------------
  useEffect(() => {
    // Only run conversion when the dialog opens
    if (!open) return;

    if (agent) {
      // If editing, parse the agent’s schedule
      const timeZoneValue = agent.schedule.timeZone || defaultAgent.schedule.timeZone;

      const convertedSchedule = {
        timeZone: timeZoneValue,
        schedule: agent.schedule.schedule.map((slot) => {
          // Attempt to extract start/end from either flat keys or nested hours
          let startVal: string | Dayjs | undefined;
          let endVal: string | Dayjs | undefined;

          // If the API uses "starttime"/"endTime" fields:
          if (slot.starttime) {
            startVal = slot.starttime;
            endVal = slot.endTime;
          }
          // Otherwise, if we have an hours array:
          else if (slot.hours?.[0]) {
            startVal = slot.hours[0].startTime;
            endVal = slot.hours[0].endTime;
          }

          // Convert or fallback to default
          let parsedStart = dayjs(startVal, ["h:mmA", "h:mm A", "HH:mm"], true);

          console.log(parsedStart.isValid(),"parsedStart")
          if (!parsedStart.isValid() && dayjs.isDayjs(startVal)) {
            // If it's already a Dayjs object, keep it
            parsedStart = startVal as Dayjs;
            // console.log(parsedStart,"parsedStartDate")
          } else if (!parsedStart.isValid()) {
            // fallback
            parsedStart = defaultStartTime;
            console.log(parsedStart,"parsedStartDate")
          }

          let parsedEnd = dayjs(endVal, ["h:mmA", "HH:mm"]);
          if (!parsedEnd.isValid() && dayjs.isDayjs(endVal)) {
            parsedEnd = endVal as Dayjs;
            console.log(parsedEnd,"parsedEndDate")
          } else if (!parsedEnd.isValid()) {
            parsedEnd = defaultEndTime;
            console.log(parsedEnd,"parsedEndDate")
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
        schedule: convertedSchedule,
      });
    } else {
      // If creating a new agent, use the default agent
      setFormData(defaultAgent);
    }
  }, [open, agent]);

  console.log("formData",formData)

  // ------------------------------------------------------
  // Input handlers (personal details & schedule day/times)
  // ------------------------------------------------------
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        profilePicture: URL.createObjectURL(file),
      }));
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

  // ---------------------
  // Navigation (Stepper)
  // ---------------------
  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  // ---------------------
  // Save & Payload
  // ---------------------
  const handleSave = () => {
    const payload = {
      email: formData.email,
      fullName: formData.fullName,
      phone: formData.phone || "",
      role: formData.role,
      orgId: user!.orgId,
      aiOrgId: user?.aiOrgId,
      profilePicture: selectedFile || undefined,
      schedule: {
        timeZone: formData.schedule.timeZone,
        schedule: formData.schedule.schedule.map((slot) => ({
          day: slot.day,
          starttime: slot.hours[0].startTime.format("h:mmA"),
          endTime: slot.hours[0].endTime.format("h:mmA"),
        })),
      },
    };

    if (agent) {
      dispatch(updateAgent({ agentId: agent.id ?? "", data: payload }) as any)
        .unwrap()
        .then(() => {
          console.log("Agent updated successfully");
          window.location.reload();
        })
        .catch((error: any) => {
          console.error("Error updating agent:", error);
        });
    } else {
      dispatch(createAgent(payload) as any)
        .unwrap()
        .then(() => {
          console.log("Agent created successfully");
          window.location.reload();
        })
        .catch((error: any) => {
          console.error("Error creating agent:", error);
        });
    }
    setFormData(defaultAgent);
    setActiveStep(0);
    onClose();
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
          <TabPanel key={activeStep}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <AvatarWrapper>
                <Avatar
                  src={formData.profilePicture}
                  sx={{ width: 80, height: 80, border: "2px solid #6fc8c7" }}
                />
                <IconButton component="label" sx={{ color: "#6fc8c7" }}>
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <AddAPhoto />
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
                />
                <TextField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
                <FormControl fullWidth variant="outlined">
                  <InputLabel>User Role</InputLabel>
                  <Select
                    label="User Role"
                    name="role"
                    value={formData.role}
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Agent">Agent</MenuItem>
                  </Select>
                </FormControl>
              </FormGroup>
            </motion.div>
          </TabPanel>
        )}
        {activeStep === 1 && (
          <TabPanel key={activeStep}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel>Time Zone</InputLabel>
                <Select
                  label="Time Zone"
                  name="timezone"
                  value={formData.schedule.timeZone}
                  onChange={handleSelectChange}
                >
                  <MenuItem value="UTC -05:00 Eastern Time">
                    UTC -05:00 Eastern Time
                  </MenuItem>
                  <MenuItem value="UTC -08:00 Pacific Time">
                    UTC -08:00 Pacific Time
                  </MenuItem>
                </Select>
              </FormControl>
              <AvailabilityContainer>
                <InputLabel>Availability</InputLabel>
                {formData.schedule.schedule.map((slot, index) => (
                  <div
                    key={index}
                    className="availability-row"
                    style={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <Select
                      value={slot.day}
                      onChange={(e) =>
                        handleScheduleChange(index, "day", e.target.value)
                      }
                      variant="outlined"
                      sx={{ minWidth: "140px" }}
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
                        onChange={(newValue) =>
                          handleHoursChange(index, 0, "startTime", newValue)
                        }
                        ampm
                        slots={{ textField: TextField }}
                        slotProps={{ textField: { variant: "outlined" } }}
                      />
                      <TimePicker
                        label="End Time"
                        value={slot.hours[0].endTime}
                        onChange={(newValue) =>
                          handleHoursChange(index, 0, "endTime", newValue)
                        }
                        ampm
                        slots={{ textField: TextField }}
                        slotProps={{ textField: { variant: "outlined" } }}
                      />
                    </LocalizationProvider>
                  </div>
                ))}
                <Button
                  onClick={handleAddSchedule}
                  variant="outlined"
                  sx={{ width: "150px" }}
                >
                  + Add Hours
                </Button>
              </AvailabilityContainer>
            </motion.div>
          </TabPanel>
        )}
      </DialogContent>
      <DialogActions>
        {activeStep === 0 ? (
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{ backgroundColor: "#6fc8c7", textTransform: "none" }}
          >
            Next
          </Button>
        ) : (
          <>
            <Button
              variant="outlined"
              onClick={handleBack}
              sx={{ textTransform: "none" }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{ textTransform: "none", backgroundColor: "#6fc8c7" }}
            >
              Save
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AgentDialog;
