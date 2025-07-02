import { Box, Button } from "@mui/material";
import { styled } from "@mui/system";

export const Container = styled(Box)({
  maxWidth: "700px",
  paddingBlock: "8px",
  width: "100%",
  display: "flex",
  flexDirection: "column",
});

export const TitleWrapper = styled(Box)`
    padding: 16px;
    font-weight: bold;
    border-bottom: 1px solid #ddd;
`;
  
export const Title = styled("h6")({
    fontFamily: "var(--custom-font-family)",
    fontWeight: 500,
    color: "#1e293b",
    fontSize: "1.25rem",
    margin: 0,
    paddingLeft: '10px',
});

export const CustomWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
    padding: "16px",
});

export const Label = styled("p")({
  fontFamily: "var(--custom-font-family)",
  fontWeight: 500,
  color: "#64748b",
  marginBottom: "16px",
  marginTop: 0,
});

export const SaveButtonWrapper = styled(Box)({
  display: "flex",
  justifyContent: "flex-start",
  paddingTop: "24px",
  marginBottom: "16px",
});

export const CustomButton = styled(Button)({
  borderRadius: 4,
  fontSize: "1rem",
  fontWeight: 600,
  padding: "0.4rem 1.5rem",
  textTransform: "none",
  fontFamily: "var(--custom-font-family)",
  color: "#000000",
  backgroundColor: "var(--theme-color)",
});
