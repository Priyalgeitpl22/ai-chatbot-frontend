import { styled } from "@mui/material/styles";

export const IconCircle = styled("div")({
  width: 65,
  height: 65,
  borderRadius: "50%",
  background: "#fef2f2",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "0 auto 10px",
});

export const Title = styled("h2")({
  fontWeight: 700,
  fontSize: "22px",
  color: "#0b0c0f",
  margin: 0,
});

export const ButtonsRow = styled("div")({
  display: "flex",
  justifyContent:"center",
   gap: "12px",
  marginTop: "20px",
});
