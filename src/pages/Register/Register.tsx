import React, { useRef, useState, useCallback } from "react";
import {
  Typography,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  FormHelperText,
  SelectChangeEvent,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useDispatch } from "react-redux";
import { registerUser } from "../../redux/slice/authSlice";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { AppDispatch } from "../../redux/store/store";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import industriesData from "../../components/Organization/Industry.json";

import {
  PageContainer,
  RegisterCard,
  IllustrationSection,
  FormSection,
  StyledTextField,
  StyledButton,
  PreviewContainer,
  PreviewImage,
} from "./register.styled";
import Loader from "../../components/Loader";
import toast, { Toaster } from "react-hot-toast";
import fieldValidation from "../../validations/FieldValidation";
import PasswordInput from "../../utils/PasswordInput";
import PhoneNumberInput from "../../utils/CountryPhone";
import parsePhoneNumberFromString, { CountryCode } from "libphonenumber-js";

interface RegisterFormData {
  profilePicture: File | null;
  fullName: string;
  email: string;
  orgName: string;
  industry: string;
  country: string;
  phone: string;
  password: string;
}

interface Field {
  label: string;
  key: keyof Omit<RegisterFormData, "profilePicture">;
  type?: string;
  xs: number;
  sm: number;
  multiline?: boolean;
  rows?: number;
}

const fields: Field[] = [
  { label: "Full Name *", key: "fullName", xs: 12, sm: 6, type: "text" },
  { label: "Email Address *", key: "email", xs: 12, sm: 6, type: "email" },
  { label: "Organization Name *", key: "orgName", xs: 12, sm: 6, type: "text" },
  { label: "Password ", key: "password", xs: 12, sm: 6, type: "password" },
  { label: "Industry *", key: "industry", xs: 12, sm: 6, type: "text" },
  { label: "Phone Number *", key: "phone", xs: 12, sm: 6, type: "text" },
];

const getValidationError = (
  field: Exclude<keyof RegisterFormData, "profilePicture">,
  value: string
): string => {
  const rules = fieldValidation[field];
  let errors: string[] = [];

  if (!value.trim()) {
    errors.push(rules?.required?.message || `${field} is required`);
  }
  if (rules?.minLength && value.length < rules.minLength.value) {
    errors.push(rules.minLength.message);
  }
  if (rules?.pattern && !new RegExp(rules.pattern.value).test(value)) {
    errors.push(rules.pattern.message);
  }
  // if (field === "phone" && isValid) {
  //   errors.push("Phone number must be at least 10 digits.");
  // }

  return errors.join(". "); 
};

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<RegisterFormData>({
    profilePicture: null,
    fullName: "",
    email: "",
    orgName: "",
    industry: "",
    country: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "phone" ? { phone: value } : {}),
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setFormData((prev) => ({ ...prev, profilePicture: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const validateFormData = (): boolean => {
    let isValid = true;
    const newErrors: Partial<Record<keyof RegisterFormData, string>> = {};
    (Object.keys(fieldValidation) as (keyof RegisterFormData)[]).forEach((field) => {
      if (field === "profilePicture") return;
      const value = formData[field] as string;
      const error = getValidationError(field, value);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    const phoneNumber = parsePhoneNumberFromString(formData.phone, formData.country as CountryCode);
    console.log('phoneNumber', phoneNumber);
    if (!phoneNumber || !phoneNumber.isValid()) {
      newErrors.phone = "Invalid phone number format.";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };


  const handlePhoneChange = (phone: string, countryCode: string) => {
    setFormData((prev) => ({ 
      ...prev, 
      phone, 
      country: countryCode 
    }));
    setErrors((prev) => ({
      ...prev,
      phone: "",
    }));
    console.log("phone", phone, "countryCode", countryCode);
  };
  
  const handleSubmit = async () => {
    if (!validateFormData()) return;
    setIsLoading(true);
    const payload = new FormData();
    (["fullName", "email", "orgName", "industry", "country", "phone", "password"] as const).forEach(
      (field) => payload.append(field, formData[field])
    );
    if (formData.profilePicture) {
      payload.append("profilePicture", formData.profilePicture);
    }
    console.log('formData', formData);
    try {
      const res = await dispatch(registerUser(payload)).unwrap();
      const message = typeof res === "string" ? res : res.message || "Registration successful!";
      toast.success(message);
      const otpExpireTime = Math.floor(new Date(res.otpExpireTime).getTime() / 1000);
      console.log('otpExpireTime', res.otpExpireTime, otpExpireTime);
      navigate("/verify-otp", { state: { email: formData.email, otpExpireTime } });
    } catch (err: any) {
      toast.error(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleIconClick = () => fileInputRef.current?.click();
  const isFormValid = ["fullName", "email", "orgName", "industry", "country", "password"].every(
    (key) => {
      const value = formData[key as keyof RegisterFormData];
      return typeof value === "string" && value.trim() !== "";
    }
  ) && Object.values(errors).every((error) => !error);

  return (
    <PageContainer>
      <RegisterCard>
        <IllustrationSection>
          <img
            src="https://cdn.dribbble.com/users/2058540/screenshots/8225403/media/bc617eec455a72c77feab587e09daa96.gif"
            alt="Auth illustration"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </IllustrationSection>

        <FormSection>
          <Typography variant="h4" fontFamily={"var(--custom-font-family)"} fontWeight="bold" mb={1}>
            Create an Account
          </Typography>
          <Typography variant="body1" fontFamily={"var(--custom-font-family)"} color="black" mb={2}>
            Register with your details
          </Typography>

          <PreviewContainer>
            {previewImage ? (
              <PreviewImage
                src={previewImage}
                alt="Profile preview"
                onClick={handleIconClick}
                style={{ cursor: "pointer" }}
              />
            ) : (
              <AccountCircleIcon
                style={{
                  fontSize: "50px",
                  color: "var(--theme-color-dark)",
                  marginBottom: "8px",
                  cursor: "pointer",
                }}
                onClick={handleIconClick}
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
          </PreviewContainer>

          <Grid container spacing={2}>
            {fields.map((field) => {
              if (field.key === "industry") {
                return (
                  <Grid size={field.sm} key={field.key}>
                    <FormControl variant="outlined" fullWidth error={!!errors.industry}>
                      <InputLabel sx={{ fontFamily: "var(--custom-font-family)" }} id="industry-label">{field.label}</InputLabel>
                      <Select
                        labelId="industry-label"
                        id="industry"
                        name="industry"
                        value={formData.industry}
                        onChange={handleSelectChange}
                        label={field.label}
                        sx={{
                          borderRadius: "10px",
                          "& .MuiOutlinedInput-input": { padding: "12px 10px !important", fontFamily: "var(--custom-font-family)" },
                        }}
                      >
                        <MenuItem value="">
                          <em>Select Industry</em>
                        </MenuItem>
                        {industriesData.industries.map((industry, index) => (
                          <MenuItem key={index} value={industry}>
                            {industry}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.industry && <FormHelperText>{errors.industry}</FormHelperText>}
                    </FormControl>
                  </Grid>
                );
              }
              if (field.key === "password") {
                return (
                  <Grid size={field.sm} key={field.key}>
                    <PasswordInput
                      name="password"
                      onkeydown={()=>""}
                      label={field.label}
                      value={formData.password}
                      onChange={handleChange}
                      error={!!errors.password}
                      helperText={errors.password || ""} // Shows all errors at once
                      autoComplete="new-password"
                    />
                  </Grid>
                );
              }
              if (field.key === "phone") {
                return (
                  <Grid size={field.sm} key={field.key}>
                    <PhoneNumberInput
                      value={formData.phone}
                      onChange={handlePhoneChange}
                    />
                    {errors.phone && <FormHelperText error>{errors.phone}</FormHelperText>}
                  </Grid>
                );
              }
              return (
                <Grid size={field.sm} key={field.key}>
                  <StyledTextField
                    name={field.key}
                    label={field.label}
                    type={field.type || "text"}
                    variant="outlined"
                    value={formData[field.key]}
                    onChange={handleChange}
                    error={!!errors[field.key]}
                    helperText={errors[field.key] || ""}
                    autoComplete="off"
                    multiline={field.multiline}
                    rows={field.rows}
                    fullWidth
                    InputLabelProps={{ style: { fontFamily: 'var(--custom-font-family)' } }}
                  />
                </Grid>
              );
            })}
          </Grid>

          <StyledButton variant="contained" fullWidth onClick={handleSubmit} disabled={!isFormValid}>
            REGISTER
          </StyledButton>

          <Typography variant="body2" color="black" fontFamily={"var(--custom-font-family)"} align="center" sx={{ my: 1 }}>
            Already have an account?{" "}
            <RouterLink
              to="/login"
              style={{ textDecoration: "none", color: "var(--theme-color-dark)" }}
            >
              Login
            </RouterLink>
          </Typography>
        </FormSection>
      </RegisterCard>

      {isLoading && <Loader />}
      <Toaster />
    </PageContainer>
  );
};

export default Register;
