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
import { Link } from "react-router-dom";
import { CognitoUser,AuthenticationDetails } from "amazon-cognito-identity-js";
import UserPool from "../../Aws/UserPool";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: UserPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    cognitoUser.authenticateUser(authDetails, {
        onSuccess: (data) => {
            console.log("onSuccess:", data);
            const decoded=jwtDecode(data.getIdToken().getJwtToken());
            localStorage.setItem('role',decoded['custom:role']);
            localStorage.setItem('token',data.getIdToken().getJwtToken());
            if(decoded['custom:role']==='admin'){
                navigate('/upload-media');
            }
            else
            {
                navigate('/home');
            }

        },
        onFailure: (err) => {
            console.log("onFailure:", err);
        },
        newPasswordRequired: (data) => {
            console.log("newPasswordRequired:", data);
        },
        });

    console.log("Sign in:", { email, password });
  };

  return (
    <div className="auth-container">
      <StyledCard>
        <CardHeader title="Sign In" />
        <CardContent>
          <Form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
            <SubmitButton
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Sign In
            </SubmitButton>
          </Form>
        </CardContent>
        <CardActions>
          <Typography variant="body2">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </Typography>
        </CardActions>
      </StyledCard>
    </div>
  );
};

export default Login;
