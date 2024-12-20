import React, { useState, useEffect } from 'react';
import { 
  AppBar,
  Toolbar,
  Container, 
  Grid, 
  Card, 
  CardMedia, 
  Typography, 
  Modal, 
  Box,
  Button
} from '@mui/material';
import { styled } from '@mui/system';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import UserPool from "../../Aws/UserPool";

const NetflixContainer = styled(Container)(({ theme }) => ({
  backgroundColor: '#141414',
  minHeight: 'calc(100vh - 64px)', // Subtract AppBar height
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(to right, #E50914, #B20710)',
}));

const VideoCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  cursor: 'pointer',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
}));

const VideoTitle = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(1),
  backgroundColor: 'rgba(0,0,0,0.7)',
  color: 'white',
}));

const VideoModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const VideoPlayer = styled('video')({
  maxWidth: '90vw',
  maxHeight: '90vh',
  borderRadius: '8px',
});

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch(`${BASE_URL}/get-media`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+localStorage.getItem('token')
        }
      });
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      const data = await response.json();
      console.log('API Response:', data);
      setVideos(data.videos || []);
      if(videos.length === 0) {
        setError('No videos found');
      }
      setError(null);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError('Failed to fetch videos. Please try again later.');
    }
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
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

  if (error) {
    return (
      <NetflixContainer maxWidth={false}>
        <Typography variant="h5" style={{ color: 'white' }}>
          {error}
        </Typography>
      </NetflixContainer>
    );
  }

  return (
    <>
      <StyledAppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Movies Ocean
          </Typography>
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
            Logout
          </Button>
        </Toolbar>
      </StyledAppBar>
      <NetflixContainer maxWidth={false}>
        {videos.length === 0 ? (
          <Typography variant="h5" style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>
            Loading videos...
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {videos.map((video) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
                <VideoCard onClick={() => handleVideoClick(video)}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={video.thumbnail_url}
                    alt={video.title}
                  />
                  <VideoTitle variant="subtitle1">{video.title}</VideoTitle>
                </VideoCard>
              </Grid>
            ))}
          </Grid>
        )}
      </NetflixContainer>
      <VideoModal
        open={Boolean(selectedVideo)}
        onClose={handleCloseModal}
      >
        <Box>
          {selectedVideo && (
            <VideoPlayer controls autoPlay>
              <source src={selectedVideo.video_url} type="video/mp4" />
              Your browser does not support the video tag.
            </VideoPlayer>
          )}
        </Box>
      </VideoModal>
    </>
  );
};

export default Home;
