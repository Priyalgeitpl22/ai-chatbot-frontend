import React, { useEffect, useState } from "react";
import { Avatar, Table, TableBody, TableRow } from "@mui/material";
import {
  AgentsContainer,
  AgentHeader,
  SectionTitle,
  StyledTableContainer,
  StyledTableCell,
  StyledTableHead,
  AvailabilityChip,
  AvailabilityList,
  UserInfoContainer,
  UserName,
  ActionButton,
} from "./Agents.styled";
import { Edit, Trash2 } from "lucide-react";
import AgentDialog from "./AgentDialogBox/AgentDialog";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store/store";
import { fetchAgents } from "../../../redux/slice/agentsSlice";
import Loader from "../../../components/Loader";
import toast, { Toaster } from "react-hot-toast";
import dayjs, { Dayjs } from "dayjs";
import { Button } from "../../../styles/layout.styled";

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

interface ScheduleSlot {
  day: string;
  hours: { startTime: Dayjs; endTime: Dayjs }[];
}

interface AgentAvatarProps {
  profilePicture: File | string | null;
  fullName: string;
}

const AgentAvatar: React.FC<AgentAvatarProps> = ({ profilePicture, fullName }) => {
  const [url, setUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!profilePicture) {
      setUrl(undefined);
      return;
    }
    if (typeof profilePicture === "string") {
      setUrl(profilePicture);
      return;
    }
    const objectUrl = URL.createObjectURL(profilePicture);
    setUrl(objectUrl);
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [profilePicture]);

  return (
    <Avatar
      src={url || ""}
      alt={fullName}
      style={{ marginRight: 8, width: 32, height: 32 }}
    />
  );
};

const Agents: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useSelector((state: RootState) => state.user);
  const { data } = useSelector((state: RootState) => state.agents);

  useEffect(() => {
    if (data) {
      setAgents(data);
    }
  }, [data]);

  useEffect(() => {
    setLoading(true);
    if (user) {
      dispatch(fetchAgents(user.orgId))
        .unwrap()
        .then(() => {
          setLoading(false);
          toast.success("Agents fetched successfully");
        })
        .catch((error) => {
          console.error("Failed to fetch agents:", error);
          toast.error("Failed to fetch agents");
        });
    }
  }, [dispatch, user]);

  const handleOpenDialog = () => {
    setEditingAgent(null);
    setIsDialogOpen(true);
  };

  const handleEditAgent = (agent: Agent) => {
    setEditingAgent(agent);
    setIsDialogOpen(true);
  };

  const handleSaveAgent = (newAgent: Omit<Agent, "id">) => {
    const agentWithId: Agent = {
      ...newAgent,
      id: editingAgent ? editingAgent.id : (agents.length + 1).toString(),
    };

    if (editingAgent) {
      setAgents(
        agents.map((agent) =>
          agent.id === editingAgent.id ? { ...editingAgent, ...newAgent } : agent
        )
      );
      setIsDialogOpen(false);
    } else {
      setAgents([...agents, agentWithId]);
      setIsDialogOpen(false);
    }
  };

  const formatTime = (time: Dayjs | string | undefined) => {
    if (!time) return "N/A";
    const t = dayjs(time);
    return t.isValid() ? t.format("hh:mm A") : "N/A";
  };

  const handleDeleteAgent = (id: string) => {
    setAgents(agents.filter((agent) => agent.id !== id));
  };

  return (
    <AgentsContainer>
      {loading && <Loader />}
      <AgentHeader>
        <SectionTitle>Agents</SectionTitle>
        <AgentDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSaveAgent}
          agent={editingAgent}
        />
        <Button onClick={handleOpenDialog}>Add User</Button>
      </AgentHeader>
      <StyledTableContainer>
        <Table>
          <StyledTableHead>
            <TableRow>
              <StyledTableCell>S.No.</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Phone</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Availability</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody style={{ background: "#ffff" }}>
            {agents.length > 0 ? (
              agents.map((agent, index) => (
                <TableRow key={agent.id}>
                  <StyledTableCell sx={{ textAlign: "center" }}>
                    {index + 1}
                  </StyledTableCell>
                  <StyledTableCell>
                    <UserInfoContainer>
                      <AgentAvatar
                        profilePicture={agent.profilePicture}
                        fullName={agent.fullName}
                      />
                      <UserName variant="body1">{agent.fullName}</UserName>
                    </UserInfoContainer>
                  </StyledTableCell>
                  <StyledTableCell>
                    {agent.phone || "N/A"}
                  </StyledTableCell>
                  <StyledTableCell>{agent.email}</StyledTableCell>
                  <StyledTableCell>
                    {agent?.schedule?.schedule?.length > 0 ? (
                      <AvailabilityList>
                        {agent.schedule.schedule.map((slot, idx) => {
                          const start =
                            slot.hours?.[0]?.startTime || slot.startTime;
                          const end =
                            slot.hours?.[0]?.endTime || slot.endTime;
                          return (
                            <AvailabilityChip
                              key={idx}
                              label={`${slot.day}: ${formatTime(start)} - ${formatTime(end)}`}
                            />
                          );
                        })}
                      </AvailabilityList>
                    ) : (
                      <div>offline</div>
                    )}
                  </StyledTableCell>
                  <StyledTableCell>
                    <ActionButton
                      color="primary"
                      size="small"
                      onClick={() => handleEditAgent(agent)}
                    >
                      <Edit size={18} />
                    </ActionButton>
                    <ActionButton
                      color="error"
                      size="small"
                      onClick={() => handleDeleteAgent(agent.id)}
                    >
                      <Trash2 size={18} />
                    </ActionButton>
                  </StyledTableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <StyledTableCell colSpan={5} sx={{ textAlign: "center" }}>
                  No agents found
                </StyledTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>
      <Toaster />
    </AgentsContainer>
  );
};

export default Agents;
