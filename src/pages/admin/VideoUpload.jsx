import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  LinearProgress,
  Snackbar,
  Container,
  IconButton,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LogoutIcon from '@mui/icons-material/Logout';
import { styled } from '@mui/system';
import { S3 } from 'aws-sdk';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserPool from "../../Aws/UserPool";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
}));

const UploadContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  borderRadius: 15,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
}));

const Form = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(3),
}));

const UploadButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
}));

const VideoUpload = () => {
  const [title, setTitle] = useState('');
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [progress, setProgress] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const BUCKET_NAME = process.env.REACT_APP_S3_BUCKET_NAME;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !video || !thumbnail) {
      setSnackbarMessage('Please fill in all fields');
      setSnackbarOpen(true);
      return;
    }

    try {
      // Upload video to S3
      const videoUrl = await uploadToS3(video, 'videos');
      
      // Upload thumbnail to S3
      const thumbnailUrl = await uploadToS3(thumbnail, 'thumbnails');

      // Call Lambda function to store metadata
      await callLambdaFunction(title, videoUrl, thumbnailUrl);

      setSnackbarMessage('Upload successful!');
      setSnackbarOpen(true);
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      setSnackbarMessage('Upload successful!');
      setSnackbarOpen(true);
    }
  };

  const uploadToS3 = async (file, folder) => {
    const s3 = new S3({
      accessKeyId: `${process.env.REACT_APP_AWS_ACCESS_KEY_ID}`,
      secretAccessKey: `${process.env.REACT_APP_AWS_SECRET_ACCESS_KEY}`,
      sessionToken: `${process.env.REACT_APP_AWS_SESSION_TOKEN}`,
      region: `${process.env.REACT_APP_REGION}`,
    });

    const params = {
      Bucket: `${BUCKET_NAME}`,
      Key: `${folder}/${Date.now()}-${file.name}`,
      Body: file,
    };

    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Location);
        }
      }).on('httpUploadProgress', (evt) => {
        setProgress(Math.round((evt.loaded / evt.total) * 100));
      });
    });
  };

 

  const callLambdaFunction = async (title, videoUrl, thumbnailUrl) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/upload-media`, {
        title: title,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      console.log('Upload Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  };

  const resetForm = () => {
    setTitle('');
    setVideo(null);
    setThumbnail(null);
    setProgress(0);
  };

  const handleLogout = () => {
    const user = UserPool.getCurrentUser();
    if (user) {
      user.signOut();
    }
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <>
      <StyledAppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Video Upload
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
            Logout
          </IconButton>
        </Toolbar>
      </StyledAppBar>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'calc(100vh - 64px)',
          background: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
          pt: 4,
        }}
      >
        <Container maxWidth="sm">
          <UploadContainer elevation={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              Upload Your Video
            </Typography>
            <Form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Video Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                margin="normal"
                variant="outlined"
                sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 1 }}
              />
              <UploadButton
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
                fullWidth
              >
                Upload Video
                <input
                  type="file"
                  hidden
                  accept="video/*"
                  onChange={(e) => setVideo(e.target.files[0])}
                />
              </UploadButton>
              <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                {video ? `Selected: ${video.name}` : 'No video selected'}
              </Typography>
              <UploadButton
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
                fullWidth
                sx={{ mt: 2 }}
              >
                Upload Thumbnail
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => setThumbnail(e.target.files[0])}
                />
              </UploadButton>
              <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                {thumbnail ? `Selected: ${thumbnail.name}` : 'No thumbnail selected'}
              </Typography>
              {progress > 0 && (
                <Box sx={{ width: '100%', mt: 2 }}>
                  <LinearProgress variant="determinate" value={progress} />
                </Box>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2, height: 48 }}
              >
                Submit
              </Button>
            </Form>
          </UploadContainer>
        </Container>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </>
  );
};

export default VideoUpload;