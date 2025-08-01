// components/Dashboard/styled.ts
import styled from "styled-components";

export const StatsCard = styled.div<{ background: string }>`
  background-color: ${({ background }) => background};
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

export const CardHeader = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
`;

export const CardValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #111;
`;
