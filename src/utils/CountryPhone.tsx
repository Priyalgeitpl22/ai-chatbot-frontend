import { useState } from "react";
import PhoneInput, { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import styled from "@emotion/styled";
import { CountryCode } from "libphonenumber-js";

interface PhoneNumberInputProps {
  value?: string;
  onChange: (phone: string, countryCode: string, countryName: string) => void;
}

const StyledPhoneInput = styled(PhoneInput)`
  .form-control {
    width: 100% !important;
    height: 48px !important;
    font-size: 16px;
    border-radius: 10px !important;
    padding-left: 50px !important;
  }
  .flag-dropdown {
    border-radius: 10px 0 0 10px !important;
  }
  .selected-flag {
    background-color: #f5f5f5 !important;
    border-radius: 10px 0 0 10px !important;
    padding: 10px !important;
    &:hover {
      background-color: rgb(255, 255, 255) !important;
    }
  }
  .country-list {
    border-radius: 8px !important;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1) !important;
  }
`;

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({ value = "", onChange }) => {
  const [phone, setPhone] = useState<string>(value);

  const handlePhoneChange = (phone: string, country?: CountryData) => {
    const countryCode = country?.countryCode?.toUpperCase() as CountryCode | undefined;
    setPhone(phone);
    onChange(phone, countryCode || "", country?.name || ""); 
  };
  
  return (
    <StyledPhoneInput
      country={"us"} 
      value={phone}
      enableAreaCodes={true}
      autoFormat={true}
      countryCodeEditable={false}
      onChange={(phone, country) => handlePhoneChange(phone, country as CountryData)}
      inputProps={{
        required: true,
        autoComplete: "off",
      }}
    />
  );
};

export default PhoneNumberInput;
