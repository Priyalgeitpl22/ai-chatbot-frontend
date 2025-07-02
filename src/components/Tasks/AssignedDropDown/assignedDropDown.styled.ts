import { FormControl, Select, MenuItem, SelectProps } from "@mui/material";
import styled from "@emotion/styled";

export const StyledFormControl = styled(FormControl)({
  minWidth: 150,
  margin: "0.5rem 0",
});

export type CustomSelectProps = SelectProps<string> & {
    hasValue?: boolean;
  };
  

export const StyledSelect = styled(Select)<CustomSelectProps>(({ hasValue }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 8,
    backgroundColor: "#fff",
    transition: "box-shadow 0.2s, border-color 0.2s",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#ccc",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#999",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#555",
    boxShadow: "0 0 0 2px rgba(85, 85, 85, 0.2)",
  },
  "& .MuiSvgIcon-root": {
    color: "#555",
  },

  ...(hasValue && {

    backgroundColor: 'var(--theme-color)',
    color: '#000',
    fontWeight: "bold",

  }),
}));

export const StyledMenuItem = styled(MenuItem)({
  "&.Mui-selected": {
    backgroundColor: "#f5f5f5",
  },
  "&.Mui-selected:hover": {
    backgroundColor: "#e0e0e0",
  },
});
