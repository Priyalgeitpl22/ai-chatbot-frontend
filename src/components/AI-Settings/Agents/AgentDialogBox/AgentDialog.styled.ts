import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { Paper, Box } from "@mui/material";

export const DialogContainer = styled(Paper)`
  min-height: 500px;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
`;

export const TabPanel = styled(motion.div)`
  padding: 16px;
  background: #ffffff;
  border-radius: 16px;
`;

export const FormGroup = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 24px;
`;

export const AvatarWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  position: relative;

  .MuiAvatar-root {
    width: 80px;
    height: 80px;
    border: 3px solid var(--theme-color);
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
    }
  }

  .MuiIconButton-root {
    position: absolute;
    bottom: 0;
    right: calc(50% - 80px);
    background: var(--theme-color);
    color: white;
    padding: 8px;
    
    &:hover {
      background: var(--theme-color);
    }
  }
`;

export const AvailabilityContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 24px;

  .availability-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr auto;
    gap: 16px;
    align-items: center;
    padding: 16px;
    background: #f8fafc;
    border-radius: 12px;
    transition: all 0.2s ease;

    &:hover {
      background: #f1f5f9;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .MuiIconButton-root {
      color: #ef4444;
      
      &:hover {
        background: rgba(239, 68, 68, 0.1);
      }
    }
  }
`;