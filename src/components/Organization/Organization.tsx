import React, { useEffect, useState } from 'react';
import { Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrganization, updateOrganization } from '../../redux/slice/organizationSlice';
import { FormContainer, FormTitle, StyledTextField } from './organization.styled';
import { AppDispatch, RootState } from '../../redux/store/store';
import industriesData from './Industry.json';
import { SelectChangeEvent } from '@mui/material/Select';
import Loader from '../Loader';
import { Button } from '../../styles/layout.styled';
import toast, { Toaster } from 'react-hot-toast';
import fieldValidation, { FieldValidationRule } from '../../validations/FieldValidation';

interface Field {
  label: string;
  key: string;
  xs: number;
  sm: number;
  multiline?: boolean;
  rows?: number;
}

const fields: Field[] = [
  { label: 'Name', key: 'name', xs: 12, sm: 6 },
  { label: 'Phone', key: 'phone', xs: 12, sm: 6 },
  { label: 'Address', key: 'address', xs: 12, sm: 8 },
  { label: 'Zip', key: 'zip', xs: 12, sm: 4 },
  { label: 'City', key: 'city', xs: 12, sm: 4 },
  { label: 'State', key: 'state', xs: 12, sm: 4 },
  { label: 'Country', key: 'country', xs: 12, sm: 4 },
  { label: 'Company (Description)', key: 'description', xs: 12, sm: 12, multiline: true, rows: 4 },
  { label: 'Industry', key: 'industry', xs: 12, sm: 6 },
];

interface OrganizationData {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: number | null;
  description: string;
  industry: string;
}

const getOrgValidationError = (field: keyof OrganizationData, value: string): string => {
  const validationMapping: Partial<Record<keyof OrganizationData, FieldValidationRule>> = {
    name: fieldValidation.orgName,
    phone: fieldValidation.phone,
    country: fieldValidation.country,
    industry: fieldValidation.industry,
  };

  if (validationMapping[field]) {
    const rules = validationMapping[field]!;
    // If blank, return the required error.
    if (!value || value.trim() === "") {
      return rules.required?.message || `${field} is required`;
    }
    // Check minimum length.
    if (rules.minLength && value.length < rules.minLength.value) {
      return rules.minLength.message;
    }
    // Check pattern.
    if (rules.pattern) {
      const regex = new RegExp(rules.pattern.value);
      if (!regex.test(value)) {
        return rules.pattern.message;
      }
    }
    return "";
  } else {
    if (field === "zip" || field === "description") return "";
    if (!value || value.trim() === "") {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    return "";
  }
};

const OrganizationForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { data } = useSelector((state: RootState) => state.organization);
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState<OrganizationData>({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zip: null,
    description: '',
    industry: '',
  });

  const [errors, setErrors] = useState<{ [key in keyof OrganizationData]?: string }>({});

  useEffect(() => {
    if (user) {
      dispatch(fetchOrganization(user.orgId));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (data) {
      setValues({
        name: data.name || '',
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        country: data.country || '',
        zip: data.zip || null,
        description: data.description || '',
        industry: data.industry || '',
      });
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setValues(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateAllFields = (): boolean => {
    let isValid = true;
    const newErrors: { [key in keyof OrganizationData]?: string } = {};

    (Object.keys(values) as (keyof OrganizationData)[]).forEach(field => {
      if (field === "zip" || field === "description") return;
      const fieldValue = typeof values[field] === "number" ? String(values[field]) : values[field];
      const error = getOrgValidationError(field, fieldValue);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    if (!validateAllFields()) {
      return;
    }

    setLoading(true);
    setTimeout(async () => {
      const response = await dispatch(
        updateOrganization({ orgId: user.orgId, data: { ...values, aiOrgId: user.aiOrgId, emailConfig: data?.emailConfig || {
          host: "",
          port: "",
          secure: "",
          user: "",
          pass: ""
        } } })
      );
      setLoading(false);
      if (updateOrganization.fulfilled.match(response)) {
        toast.success("Organization updated successfully!");
      } else {
        toast.error(`Update failed: ${response.payload}`);
      }
    }, 1000);
  };

  return (
    <FormContainer>
      {loading && <Loader />}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <FormTitle>Organization Form</FormTitle>
        <Button type="submit" form="org-form">Update</Button>
      </Box>
      <Box component="form" id="org-form" noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {fields.map((field, index) => (
            <Grid size={field.sm} key={index}>
              {field.key === "industry" ? (
                <FormControl fullWidth sx={{ backgroundColor: 'white' }}>
                  <InputLabel>Industry</InputLabel>
                  <Select
                    name="industry"
                    value={values.industry}
                    onChange={handleSelectChange}
                    label="Industry"
                    MenuProps={{
                      PaperProps: { style: { maxHeight: 250 } },
                    }}
                  >
                    {industriesData.industries.map((industry: string, idx: number) => (
                      <MenuItem key={idx} value={industry}>
                        {industry}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <StyledTextField
                  fullWidth
                  name={field.key}
                  label={field.label}
                  variant="outlined"
                  value={
                    field.key === "zip"
                      ? values.zip === null
                        ? ""
                        : values.zip.toString()
                      : values[field.key as keyof OrganizationData]
                  }
                  onChange={handleChange}
                  error={!!errors[field.key as keyof OrganizationData]}
                  helperText={errors[field.key as keyof OrganizationData] || ""}
                  {...(field.multiline ? { multiline: true, rows: field.rows } : {})}
                />
              )}
            </Grid>
          ))}
        </Grid>
      </Box>
      <Toaster />
    </FormContainer>
  );
};

export default OrganizationForm;
