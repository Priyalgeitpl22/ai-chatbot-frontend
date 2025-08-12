import styled from '@emotion/styled';

export const StatsCard = styled.div<{ background: string }>`
  padding: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  width: 100%;
  height: 100%;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 8px;
  // background-color: #fff;
  background-color: ${({ background }) => background};
`;

export const CardHeader = styled.h3`
  font-size: 12px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
`;

export const CardValue = styled.div`

  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  font-weight: bold;
  color: #111;
  color: getTrendColor(item.trend)
`;

export const CardTrend = styled.div`
  font-size: 1rem;
  color: #111;
`;

export const CardsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  background-color: transparent;
  box-sizing: border-box;
  gap: 12px;
`;
