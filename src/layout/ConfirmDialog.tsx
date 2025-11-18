import React from "react";
import { Dialog, Typography } from "@mui/material";
import { ButtonsRow, IconCircle, Title } from "./confirmDialog.styled";
import { Button } from "../styles/layout.styled";


interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  onClose: () => void;
  onConfirm: (id?: string) => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = "Are you sure?",
  description = "Do you really want to perform this action?",
  icon,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "var(--error-color)",
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: "18px",
          padding: "20px 0px",
          textAlign: "center",
        },
      }}
    >
      {/* Icon (Optional) */}
      {icon && <IconCircle>{icon}</IconCircle>}

      {/* Title */}
      <Title>{title}</Title>

      {/* Description */}
      <Typography
        sx={{
          mt: 1,
          color: "#6e6e6e",
          fontSize: "15px",
          fontFamily: 'var(--custom-font-family)',
          lineHeight: 1.5,
        }}
      >
        {description}
      </Typography>

      {/* Buttons */}
      <ButtonsRow>
        <Button
          style={{
            width: "38%",
            backgroundColor: "#ffffff",
            border: "1px solid #cbd5e1",
            color: "#334155",
            fontWeight: 600,
          }}
          onClick={onClose}
        >
          {cancelText}
        </Button>

        <Button
          style={{
            width: "38%",
            backgroundColor: confirmColor,
            color: "white",
          }}
          onClick={()=> onConfirm()}
        >
          {confirmText}
        </Button>
      </ButtonsRow>
    </Dialog>
  );
};

export default ConfirmDialog;
