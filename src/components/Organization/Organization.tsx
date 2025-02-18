import React, { useEffect, useState } from 'react';
import { Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrganization, updateOrganization } from '../../redux/slice/organizationSlice';
import {
  FormContainer,
  FormTitle,
  StyledTextField} from './organization.styled';
import { AppDispatch, RootState } from '../../redux/store/store';
import industriesData from './Industry.json';
import { SelectChangeEvent } from '@mui/material/Select';
import Loader from '../Loader';
import { Button } from '../../styles/layout.styled';

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
  { label: 'Domain', key: 'domain', xs: 12, sm: 6 }
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
  domain: string;
}

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
    domain: ''
  });

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
        domain: data.domain || ''
      });
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

   
    setLoading(true);
    setTimeout(async () => {
      const response = await dispatch(
        updateOrganization({ orgId: user.orgId, data: { ...values, aiOrgId: user.aiOrgId } })
      );
      setLoading(false);

      if (updateOrganization.fulfilled.match(response)) {
        alert("Organization updated successfully!");
      } else {
        alert(`Update failed: ${response.payload}`);
      }
    }, 1000);
  };

 

  return (
    <FormContainer>
       {loading && <Loader />}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <FormTitle>Organization Form</FormTitle>
        <Button type="submit" form="org-form">
          Update
        </Button>
      </Box>
      <Box component="form" id="org-form" noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {fields.map((field, index) => (
            <Grid size={field.sm} key={index}>
              {field.key === "industry" ? (
                <FormControl fullWidth sx={{backgroundColor: 'white'}}>
                  <InputLabel>Industry</InputLabel>
                  <Select
                    name="industry"
                    value={values.industry}
                    onChange={handleSelectChange}
                    label="Industry"
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 250,
                        },
                      },
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
                  {...(field.multiline ? { multiline: true, rows: field.rows } : {})}
                />
              )}
            </Grid>
          ))}
        </Grid>
      </Box>
    </FormContainer>
  );
};

export default OrganizationForm;
