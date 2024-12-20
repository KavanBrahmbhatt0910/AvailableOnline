import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import { useLocation } from "react-router-dom";
import { CognitoUser } from "amazon-cognito-identity-js";
import UserPool from "../../Aws/UserPool";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StyledCard = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 400,
  padding: theme.spacing(4),
  borderRadius: theme.spacing(1),
  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
}));

const Form = styled("form")({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
});

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const OtpVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const email = location.state.email;
  const role = location.state.role;
  const user = new CognitoUser({
    Username: email,
    Pool: UserPool,
  });
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const handleSubmit = (e) => {
    e.preventDefault();
    user.confirmRegistration(otp, true, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        handleUserRegister();
        navigate("/login");
        console.log(data);
      }
    });
  };

  const handleUserRegister = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/register-user`,
        {
          email: email,
          role: role,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleResendOtp = () => {
    // Implement your resend OTP logic here
    user.resendConfirmationCode((err, result) => {
      if (err) {
        console.error(err);
      } else {
        console.log(result);
      }
    });
    console.log("Resend OTP");
  };

  return (
    <div className="auth-container">
      <StyledCard>
        <CardHeader title="Verify OTP" />
        <CardContent>
          <Typography variant="body1" gutterBottom>
            Please enter the 6-digit OTP sent to your email/phone.
          </Typography>
          <Form onSubmit={handleSubmit}>
            <TextField
              label="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              fullWidth
              inputProps={{ maxLength: 6, minLength: 6 }}
            />
            <SubmitButton
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Verify OTP
            </SubmitButton>
          </Form>
        </CardContent>
        <CardActions>
          <Button onClick={handleResendOtp}>Resend OTP</Button>
        </CardActions>
      </StyledCard>
    </div>
  );
};

export default OtpVerification;
