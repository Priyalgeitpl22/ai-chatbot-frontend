import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Chip, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import { motion } from 'framer-motion';

const LiveAgentsCard = styled(Box)`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  height: 100%;
`;

const AgentItem = styled(Box)`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  background: #f8f9fa;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e9ecef;
  }
`;

interface Agent {
  id: string;
  name: string;
  avatar?: string;
  activeChats: number;
  status: 'online' | 'busy' | 'away';
  lastSeen?: string;
}

const LiveAgents: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching live agents data
    const fetchLiveAgents = async () => {
      try {
        const mockAgents: Agent[] = [
          {
            id: '1',
            name: 'Sarah Johnson',
            activeChats: 3,
            status: 'online',
            lastSeen: '2 min ago'
          },
          {
            id: '2',
            name: 'Mike Chen',
            activeChats: 1,
            status: 'busy',
            lastSeen: '1 min ago'
          },
          {
            id: '3',
            name: 'Emma Davis',
            activeChats: 0,
            status: 'away',
            lastSeen: '5 min ago'
          }
        ];
        
        setAgents(mockAgents);
      } catch (error) {
        console.error('Error fetching live agents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveAgents();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchLiveAgents, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#10B981';
      case 'busy': return '#F59E0B';
      case 'away': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'busy': return 'Busy';
      case 'away': return 'Away';
      default: return 'Unknown';
    }
  };

  const onlineAgents = agents.filter(agent => agent.status === 'online').length;
  const totalActiveChats = agents.reduce((sum, agent) => sum + agent.activeChats, 0);

  if (loading) {
    return (
      <LiveAgentsCard>
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
          <CircularProgress size={40} />
        </Box>
      </LiveAgentsCard>
    );
  }

  return (
    <LiveAgentsCard>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={600}>
          Live Agents
        </Typography>
        <Chip 
          label={`${onlineAgents} Online`} 
          color="success" 
          size="small"
          variant="outlined"
        />
      </Box>

      <Box mb={2}>
        <Typography variant="body2" color="text.secondary" mb={1}>
          Total Active Chats: {totalActiveChats}
        </Typography>
      </Box>

      <Box>
        {agents.length > 0 ? (
          agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <AgentItem>
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    mr: 1.5,
                    bgcolor: getStatusColor(agent.status)
                  }}
                >
                  {agent.avatar ? (
                    <img src={agent.avatar} alt={agent.name} />
                  ) : (
                    <PersonIcon fontSize="small" />
                  )}
                </Avatar>
                
                <Box flex={1}>
                  <Typography variant="body2" fontWeight={500}>
                    {agent.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {agent.activeChats} active chats
                  </Typography>
                </Box>
                
                <Box display="flex" flexDirection="column" alignItems="flex-end">
                  <Chip
                    label={getStatusLabel(agent.status)}
                    size="small"
                    sx={{
                      bgcolor: getStatusColor(agent.status),
                      color: 'white',
                      fontSize: '0.7rem',
                      height: 20
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" mt={0.5}>
                    {agent.lastSeen}
                  </Typography>
                </Box>
              </AgentItem>
            </motion.div>
          ))
        ) : (
          <Box textAlign="center" py={3}>
            <Typography variant="body2" color="text.secondary">
              No agents currently online
            </Typography>
          </Box>
        )}
      </Box>
    </LiveAgentsCard>
  );
};

export default LiveAgents;




