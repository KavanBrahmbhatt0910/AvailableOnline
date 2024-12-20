// SignUp.js
import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardActions, 
  TextField, 
  Button, 
  Typography 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import UserPool from '../../Aws/UserPool';

const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 400,
  padding: theme.spacing(4),
  borderRadius: theme.spacing(1),
  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
}));

const Form = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
});

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const AdminSignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const attributeList = [
        new CognitoUserAttribute({Name: 'custom:role', Value: 'admin'})
    ]

    UserPool.signUp(email, password, attributeList, null, (err, data) => {
        if (err) {
            console.error(err);
        } else {
            console.log(data);
            navigate('/verify-otp',{state:{email,role:'admin'}});
        }
    });


    console.log('Sign up:', { name, email, password, confirmPassword });
  };

  return (
    <div className="auth-container">
      <StyledCard>
        <CardHeader title="Admin Sign Up" />
        <CardContent>
          <Form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
            />
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
            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
            />
            <SubmitButton type="submit" variant="contained" color="primary" fullWidth>
              Sign Up
            </SubmitButton>
          </Form>
        </CardContent>
        <CardActions>
          <Typography variant="body2">
            Already have an account? <Link to="/login">Sign In</Link>
          </Typography>
        </CardActions>
      </StyledCard>
    </div>
  );
};

export default AdminSignUp;