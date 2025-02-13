import { styled } from "@mui/material/styles";
import { Box, Typography, DialogContent, DialogActions } from "@mui/material";

export const DialogHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2),
  marginTop:'-60px',
}));

export const StyledTitle = styled(Typography)(() => ({
  fontWeight: 600,
  margin:0
}));
export const StyledEmail = styled(Typography)(() => ({
    fontWeight: 600,
    fontFamily: 'sans-serif',
    fontSize:'14px',
    color:'#444444',
    margin:0
  }));

export const DialogBody = styled(DialogContent)(() => ({
  // Add custom styles if needed
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
