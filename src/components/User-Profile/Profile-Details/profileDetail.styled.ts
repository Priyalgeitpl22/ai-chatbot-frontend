import { styled } from "@mui/material/styles";
import style from "styled-components";
import {Box, Typography, DialogContent, DialogActions,Paper } from "@mui/material";

export const DialogHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2),
  marginTop:'-60px',
}));

export const StyledTitle = styled(Typography)(() => ({
  fontWeight: 600,
  margin:0,
  fontFamily: 'var(--custom-font-family)',
}));
export const StyledEmail = styled(Typography)(() => ({
    fontWeight: 600,
    fontSize:'14px',
    color:'#444444',
    fontFamily: 'var(--custom-font-family)',
    margin:0
  }));

export const DialogBody = styled(DialogContent)(() => ({
  border:'none !important'
}));

export const DialogFooter = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2),
}));

export const FieldWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const ProfileImage = styled("img")({
  width: "90px",
  height: "90px",
  borderRadius: "50%",
  objectFit: "cover",
});

export const CardWrapper = styled(Paper)(() => ({
  padding: "20px",
  borderRadius: "10px",
  border: "1px solid #11182733",
  background: "#fafafa",
  display: "flex",
  gap: "16px",
  alignItems: "center",
}));

export const IconBox = styled(Box)(() => ({
  width: 46,
  height: 46,
  borderRadius: "12px",
  background: "#e8f0fe",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#1e3a8a",
}));

export const TitleText = styled(Typography)(() => ({
  fontSize: "1rem",
  fontWeight: 600,
  color: "#111827",
  marginBottom: "4px",
}));

export const SubText = styled(Typography)(() => ({
  fontSize: "0.84rem",
  color: "#6b7280",
  marginBottom: "8px",
}));

export const StatusBadge = styled(Box)<{ enabled: boolean }>(({ enabled }) => ({
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 10px",
  borderRadius: "8px",
  fontSize: "0.75rem",
  fontWeight: 600,
  background: enabled ? "#ecfdf5" : "#fef2f2",
  color: enabled ? "#059669" : "#dc2626",
}));

export const StyledButton = style.button`
  width: auto;
  padding: 8px 16px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  border:1px solid var(--theme-color);
  color: #1e293b;
  font-size: 16px;
  font-family: var(--custom-font-family);
  transition: all 0.25s ease;

  &:hover {
    opacity: 0.85;
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.98);
  }
`;

