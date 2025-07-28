import React, { useState, useMemo } from 'react';
import {
  Popover,
  Box,
  Avatar,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {
  StatusBadge,
  SearchTextField,
  SectionTitle,
  StyledAssignedItem,
  AgentStatusText,
  AgentName,
  StyledListItemButton,
  ScrollableAgentList,
  NoAgentsFoundText,
} from './assignedDropDown.styled';

interface Agent {
  id: string;
  fullName: string;
  profilePicture?: File | string | null;
  online?: boolean;
}

interface AssignAgentPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  agents: Agent[];
  assignedTo?: string;
  onAssign: (agentId: string) => void;
}

const AssignedDropDown: React.FC<AssignAgentPopoverProps> = ({
  open,
  anchorEl,
  onClose,
  agents,
  assignedTo,
  onAssign,
}) => {
  const [search, setSearch] = useState('');

  const assignedAgent = useMemo(
    () => agents.find((a) => a.id === assignedTo),
    [agents, assignedTo]
  );

  const filteredAgents = useMemo(() => {
    return agents
      .filter((agent) => agent.id !== assignedTo)
      .filter((agent) =>
        agent.fullName.toLowerCase().includes(search.toLowerCase())
      );
  }, [search, agents, assignedTo]);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      PaperProps={{
        sx: { width: 340, p: 2, borderRadius: 3, boxShadow: 3 , marginTop: 1},
      }}
    >
      <SearchTextField
        fullWidth
        size="small"
        placeholder="Search for a specific user"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {assignedAgent && (
        <>
          <SectionTitle variant="subtitle2">Currently assigned to</SectionTitle>
          <StyledAssignedItem
            secondaryAction={
              <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />
            }
          >
            <ListItemAvatar>
              <StatusBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                online={assignedAgent.online ?? false}
              >
                <Avatar
                  src={
                    typeof assignedAgent.profilePicture === 'string'
                      ? assignedAgent.profilePicture
                      : undefined
                  }
                >
                  {!assignedAgent.profilePicture && <AccountCircleIcon />}
                </Avatar>
              </StatusBadge>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" gap={1}>
                  <AgentName>{assignedAgent.fullName}</AgentName>
                </Box>
              }
              secondary={
                <AgentStatusText>
                  {assignedAgent.online ? 'Available' : 'Not Available'}
                </AgentStatusText>
              }
            />
          </StyledAssignedItem>
        </>
      )}

      <SectionTitle variant="subtitle2">
        Assign to another user
      </SectionTitle>

      <ScrollableAgentList>
        {filteredAgents.length === 0 && (
          <NoAgentsFoundText>No agents found</NoAgentsFoundText>
        )}
        {filteredAgents.map((agent) => {
          const isOnline = agent.online ?? false;
          return (
            <StyledListItemButton
              key={agent.id}
              onClick={() => isOnline && onAssign(agent.id)}
              disabled={!isOnline}
              isOnline={isOnline}
            >
              <ListItemAvatar>
                <StatusBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  online={isOnline}
                >
                  <Avatar
                    src={
                      typeof agent.profilePicture === 'string'
                        ? agent.profilePicture
                        : undefined
                    }
                  >
                    {!agent.profilePicture && <AccountCircleIcon />}
                  </Avatar>
                </StatusBadge>
              </ListItemAvatar>
              <ListItemText
                primary={<AgentName>{agent.fullName}</AgentName>}
                secondary={
                  <AgentStatusText>
                    {isOnline ? 'Available' : 'Not Available'}
                  </AgentStatusText>
                }
              />
            </StyledListItemButton>
          );
        })}
      </ScrollableAgentList>
    </Popover>
  );
};

export default AssignedDropDown;
