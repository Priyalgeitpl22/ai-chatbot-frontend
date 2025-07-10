import styled from "@emotion/styled";
import { Box, Button } from "@mui/material";

export const SecurityContainer = styled(Box)`
  max-width: 700px;
  padding: 24px;
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  background: #fff;
  margin: 32px auto 0 auto;
  min-height: 500px;
  overflow-y: auto;
`;

export const Title = styled("h2")({
  fontFamily: "var(--custom-font-family)",
  fontWeight: 600,
  color: "#1e293b",
  fontSize: "1.5rem",
  margin: 0,
  marginBottom: "18px",
});

export const Label = styled("span")({
  fontFamily: "var(--custom-font-family)",
  fontWeight: 500,
  color: "#64748b",
  fontSize: "1rem",
});

export const Message = styled("p")<{ success?: boolean }>(props => ({
  fontFamily: "var(--custom-font-family)",
  fontWeight: 400,
  fontSize: "0.95rem",
  marginBottom: "12px",
  color: props.success ? "#059669" : "#dc2626",
}));

export const SwitchRow = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "8px",
});

export const StyledButton = styled(Button)({
  borderRadius: 4,
  fontSize: "1rem",
  fontWeight: 600,
  padding: "0.4rem 1.5rem",
  textTransform: "none",
  fontFamily: "var(--custom-font-family)",
  color: "#000000",
  backgroundColor: "var(--theme-color)",
  "&:hover": {
    opacity: 0.9,
    backgroundColor: "var(--theme-color)",
  },
});

export const QRSection = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 32px;
  width: 100%;
`;

export const QRImage = styled("img")`
  width: 200px;
  height: 200px;
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`;

export const OTPInput = styled("input")`
  font-size: 1.2rem;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  margin-bottom: 20px;
  width: 100%;
  max-width: 250px;
  font-family: var(--custom-font-family);
`;

export const VerifyButton = styled(Button)`
  margin-top: 8px;
  margin-bottom: 16px;
  font-family: var(--custom-font-family);
  font-weight: 600;
  font-size: 1rem;
  background: var(--theme-color);
  color: #fff;
  border-radius: 4px;
  padding: 0.5rem 2rem;
  &:hover {
    opacity: 0.9;
    background: var(--theme-color);
  }
`;
