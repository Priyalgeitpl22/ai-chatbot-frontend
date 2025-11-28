import React, { useEffect, useRef, useState } from "react";
import { Dialog, TextField, Button, Box } from "@mui/material";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import {
  DialogHeader,
  StyledTitle,
  StyledEmail,
  DialogBody,
  DialogFooter,
  FieldWrapper,
  ProfileImage,
  StyledButton,
  CardWrapper,
  IconBox,
  TitleText,
  SubText,
  StatusBadge,
} from "./profileDetail.styled";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import { updateUserDetails } from "../../../redux/slice/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store/store";
import toast, {Toaster} from 'react-hot-toast';
import Loader from "../../Loader";
import { useNavigate } from "react-router-dom";

interface ProfileDetailProps {
  open: boolean;
  onClose: () => void;
  userData: any
}

const ProfileDetail: React.FC<ProfileDetailProps> = ({ open, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const org = useSelector((state: RootState) => state.organization.data);
  const userData = useSelector((state: RootState) => state.user.user);
  
  const [formData, setFormData] = useState({
    name: userData?.fullName || "",
    email: userData?.email || "",
    role: userData?.role || "",
  });

  const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(userData?.profilePicture || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const TwoStepVerificaton = org?.enable_totp_auth && userData?.twoFactorAuth?.isEnabled; 

  useEffect(() => {
    setFormData({
      name: userData?.fullName || "",
      email: userData?.email || "",
      role: userData?.role || "",
    });
    setPreview(userData?.profilePicture || null);
  }, [userData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setNewProfilePicture(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("id", userData?.id || "");
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("role", formData.role);

    if (newProfilePicture) {
      formDataToSend.append("profilePicture", newProfilePicture);
    }

    try {
      await dispatch(updateUserDetails({ userData: formDataToSend })).unwrap();
      toast.success("User details updated successfully!");
      onClose();
      window.location.reload();
      setLoading(false);
    } catch (error) {
      toast.error("Failed to update user details!");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: userData?.fullName || "",
      email: userData?.email || "",
      role: userData?.role || "",
    });
    setNewProfilePicture(null);
    setPreview(userData?.profilePicture || null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box sx={{ width: "100%", height: "80px", backgroundColor: "#dddddd" }}></Box>
      <DialogHeader>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" }}>
          <Box sx={{ position: "relative", display: "inline-block" }}>
            {preview ? (
              <ProfileImage src={preview} alt="User profile" />
            ) : (
              <AccountCircleIcon sx={{ fontSize: 80 }} />
            )}
            <EditIcon
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "white",
                borderRadius: "50%",
                cursor: "pointer",
                padding: "2px",
              }}
              onClick={() => fileInputRef.current?.click()}
            />
            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </Box>
          <StyledTitle  variant="h6">{formData.name || "User"}</StyledTitle>
          <StyledEmail>{formData.email}</StyledEmail>
        </Box>
      </DialogHeader>

      <DialogBody dividers>
        <FieldWrapper>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            name="name"
            autoComplete="off"
            value={formData.name}
            onChange={handleInputChange}
            InputProps={{style: {fontFamily: 'var(--custom-font-family)'}}}
          />
        </FieldWrapper>

        <FieldWrapper>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            name="email"
            autoComplete="off"
            value={formData.email}
            onChange={handleInputChange}
            InputProps={{style: {fontFamily: 'var(--custom-font-family)'}}}
          />
        </FieldWrapper>

        <FieldWrapper>
          <TextField
            label="Role"
            variant="outlined"
            fullWidth
            name="role"
            value={formData.role}
            InputProps={{style: {fontFamily: 'var(--custom-font-family)'}}}
            disabled
          />
        </FieldWrapper>

        {/* 2FA Section */}
        <FieldWrapper>
          <CardWrapper elevation={0}>
            <IconBox>
              <SecurityOutlinedIcon sx={{ fontSize: 24 }} />
            </IconBox>

            <Box sx={{ flex: 1 }}>
              <TitleText>Two-Step Verification</TitleText>

              <SubText>
                Keep your account safe by enabling additional protection.
              </SubText>

              <StatusBadge enabled={!!TwoStepVerificaton}>
                {TwoStepVerificaton ? "Enabled" : "Disabled"}
              </StatusBadge>
            </Box>

            <StyledButton
              onClick={() => {
                onClose();
                navigate("/settings?tab=security");
              }}
            >
              {TwoStepVerificaton ? "Manage" : "Enable"}
            </StyledButton>
          </CardWrapper>
        </FieldWrapper>
      </DialogBody>

      <DialogFooter>
        <Button variant="outlined" onClick={handleCancel} sx={{ mr: 1, fontFamily:'var(--custom-font-family)' }}>
          Cancel
        </Button>
        <Button variant="contained" sx={{ backgroundColor: `var(--theme-color)`, color:'#333333', fontWeight: 600,fontFamily:'var(--custom-font-family)' }} onClick={handleSave}>
          Save changes
        </Button>
      </DialogFooter>
      {loading && <Loader />}
      <Toaster />
    </Dialog>
  );
};

export default ProfileDetail;
