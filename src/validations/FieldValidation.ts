export interface FieldValidationRule {
    required?: { message: string };
    minLength?: { value: number; message: string };
    email?: { message: string };
    pattern?: { value: string; message: string };
  }
  
  export type FieldValidationConfig = {
    [key in "fullName" | "email" | "orgName" | "industry" | "country" | "phone" | "password"]: FieldValidationRule;
  };
  
  const fieldValidation: FieldValidationConfig = {
    fullName: {
      required: { message: "Full Name is required" },
      minLength: { value: 3, message: "Full Name must be at least 3 characters" }
    },
    email: {
      required: { message: "Email is required" },
      pattern: { value: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$", message: "Email is not valid" }
    },
    orgName: {
      required: { message: "Organization Name is required" }
    },
    industry: {
      required: { message: "Industry is required" }
    },
    country: {
      required: { message: "Country is required" }
    },
    phone: {
      required: { message: "Phone Number is required" },
      pattern: { value: "^\\+?[1-9]\\d{1,14}$", message: "Phone number is not valid" }
    },
    password: {
      required: { message: "Password is required" },
      minLength: { value: 6, message: "At least 6 characters" },
      pattern: { 
        value: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\da-zA-Z]).+$", 
        message: "Include uppercase, lowercase, number & special char" 
      }
    }    
  };
  
  export default fieldValidation;
  