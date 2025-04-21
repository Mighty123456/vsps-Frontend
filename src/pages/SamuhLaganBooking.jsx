import React, { useState, Suspense, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Button, 
  Alert, 
  Box, 
  Typography, 
  TextField, 
  Grid,
  Card,
  CardContent,
  Avatar,
  Paper,
  Container,
  Divider,
  CircularProgress
} from '@mui/material';
import { PhotoCamera, CloudUpload, AccessTime, Person, Email, Phone, Home, Badge } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Define API base URL with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Color constants
const colors = {
  primary: {
    main: '#9333EA',
    light: '#A855F7',
    dark: '#7E22CE',
    gradient: 'linear-gradient(45deg, #9333EA, #A855F7)',
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#F3E8FF',
    light: '#FAF5FF',
    dark: '#DDD6FE',
    text: '#6B21A8'
  },
  background: {
    light: '#FAFAFA',
    paper: '#ffffff',
    gradient: 'linear-gradient(135deg, #F3E8FF 0%, #ffffff 100%)'
  }
};

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 8px 24px rgba(147, 51, 234, 0.08)',
  marginBottom: theme.spacing(3),
  backgroundColor: colors.background.paper,
  overflow: 'visible',
  position: 'relative',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 32px rgba(147, 51, 234, 0.12)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: colors.primary.gradient,
    borderRadius: '16px 16px 0 0',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: colors.primary.gradient,
  color: colors.primary.contrastText,
  '&:hover': {
    background: `linear-gradient(45deg, ${colors.primary.dark}, ${colors.primary.main})`,
    boxShadow: '0 6px 16px rgba(147, 51, 234, 0.3)',
  },
  borderRadius: '12px',
  padding: '12px 32px',
  marginTop: theme.spacing(3),
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 600,
  boxShadow: '0 4px 12px rgba(147, 51, 234, 0.2)',
  transition: 'all 0.3s ease',
  '&:disabled': {
    background: '#e0e0e0',
    color: '#9e9e9e',
  },
}));

const TimeUnit = styled(Box)(({ theme }) => ({
  padding: '8px 12px',
  borderRadius: '8px',
  background: colors.primary.gradient,
  color: colors.primary.contrastText,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: '70px',
  boxShadow: '0 4px 12px rgba(147, 51, 234, 0.15)',
  position: 'relative',
  '&:not(:last-child)::after': {
    content: '":"',
    position: 'absolute',
    right: '-12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: colors.primary.main,
    fontSize: '1.5rem',
    fontWeight: 700,
  }
}));

const TimeLabel = styled(Typography)({
  fontSize: '0.75rem',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  opacity: 0.9,
});

const TimeValue = styled(Typography)({
  fontSize: '1.5rem',
  fontWeight: 700,
  lineHeight: 1.2,
});

const CountdownTimer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  background: `linear-gradient(135deg, ${colors.secondary.light} 0%, ${colors.background.paper} 100%)`,
  borderRadius: '16px',
  border: `1px solid ${colors.secondary.main}`,
  boxShadow: '0 4px 24px rgba(147, 51, 234, 0.08)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: colors.background.light,
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#ffffff',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: colors.primary.main,
      },
    },
    '&.Mui-focused': {
      backgroundColor: '#ffffff',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: colors.primary.main,
        borderWidth: '2px',
      },
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(0, 0, 0, 0.6)',
    '&.Mui-focused': {
      color: colors.primary.main,
    },
  },
  '& .MuiInputAdornment-root': {
    '& .MuiSvgIcon-root': {
      color: colors.primary.main,
    },
  },
}));

const PhotoUploadButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '12px 24px',
  backgroundColor: colors.secondary.main,
  color: colors.primary.main,
  border: `1px solid ${colors.secondary.main}`,
  '&:hover': {
    backgroundColor: colors.secondary.light,
    borderColor: colors.primary.main,
  },
  textTransform: 'none',
  fontSize: '0.9rem',
  boxShadow: '0 2px 8px rgba(147, 51, 234, 0.08)',
}));

const DocumentUploadButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '16px',
  backgroundColor: colors.background.light,
  color: colors.primary.main,
  border: `2px dashed ${colors.secondary.main}`,
  '&:hover': {
    backgroundColor: colors.secondary.light,
    border: `2px dashed ${colors.primary.main}`,
  },
  textTransform: 'none',
  fontSize: '0.9rem',
  minHeight: '100px',
  flexDirection: 'column',
  gap: '8px',
  transition: 'all 0.3s ease',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: '16px',
  boxShadow: '0 4px 12px rgba(147, 51, 234, 0.12)',
  border: `4px solid ${colors.background.paper}`,
  backgroundColor: colors.secondary.main,
  color: colors.primary.main,
}));

const LoadingFallback = () => (
  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="200px">
    <CircularProgress size={40} sx={{ color: colors.primary.main, mb: 2 }} />
    <Typography variant="body1" color="textSecondary">Loading form...</Typography>
  </Box>
);

const SamuhLaganBooking = ({ formDetails }) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [countdown, setCountdown] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState({
    bride: [],
    groom: []
  });
  
  // Check for user state on mount and after login
  useEffect(() => {
    if (user) {
      setShowForm(true);
    }
  }, [user]);

  // Add countdown timer effect
  useEffect(() => {
    let countdownTimer;
    
    if (formDetails?.endTime) {
      const updateCountdown = () => {
        const now = new Date().getTime();
        const end = new Date(formDetails.endTime).getTime();
        const timeLeft = end - now;

        if (timeLeft <= 0) {
          setCountdown('');
          if (countdownTimer) {
            clearInterval(countdownTimer);
          }
          return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      };

      updateCountdown(); // Initial call
      countdownTimer = setInterval(updateCountdown, 1000); // Update every second
    }

    return () => {
      if (countdownTimer) {
        clearInterval(countdownTimer);
      }
    };
  }, [formDetails]);

  // Add effect to check if we're returning from login
  useEffect(() => {
    const checkRedirectFromLogin = () => {
      const redirectPath = localStorage.getItem('redirectAfterLogin');
      if (redirectPath && user) {
        localStorage.removeItem('redirectAfterLogin');
        setShowForm(true);
      }
    };

    checkRedirectFromLogin();
  }, [user]); // Add user as dependency

  // Form data state
  const [formData, setFormData] = useState({
    // Bride Details
    brideName: '',
    brideFatherName: '',
    brideMotherName: '',
    brideAge: '',
    brideMobile: '',
    brideEmail: '',
    brideAddress: '',
    bridePhoto: null,
    brideDocuments: [],
    
    // Groom Details
    groomName: '',
    groomFatherName: '',
    groomMotherName: '',
    groomAge: '',
    groomMobile: '',
    groomEmail: '',
    groomAddress: '',
    groomPhoto: null,
    groomDocuments: []
  });

  // Preview states
  const [bridePhotoPreview, setBridePhotoPreview] = useState(null);
  const [groomPhotoPreview, setGroomPhotoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      if (name === 'bridePhoto' || name === 'groomPhoto') {
        const file = files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (name === 'bridePhoto') {
              setBridePhotoPreview(reader.result);
            } else {
              setGroomPhotoPreview(reader.result);
            }
          };
          reader.readAsDataURL(file);
        }
      } else if (name === 'brideDocuments' || name === 'groomDocuments') {
        const newFiles = Array.from(files);
        const prefix = name === 'brideDocuments' ? 'bride' : 'groom';
        setUploadedDocuments(prev => ({
          ...prev,
          [prefix]: [...prev[prefix], ...newFiles]
        }));
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: files
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to submit the form');
      }

      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (Array.isArray(formData[key])) {
          formData[key].forEach(file => {
            formDataToSend.append(key, file);
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch(`${API_BASE_URL}/api/forms/samuhLagan/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit form');
      }

      const data = await response.json();
      if (data.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error.message || 'An error occurred while submitting the form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle book button click
  const handleBookClick = () => {
    if (!user) {
      // Store the current path to redirect back after login
      localStorage.setItem('redirectAfterLogin', '/samuh-lagan');
      navigate('/auth');
      return;
    }
    setShowForm(true);
  };

  const renderUploadedDocuments = (prefix) => {
    const documents = uploadedDocuments[prefix];
    if (documents.length === 0) return null;

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          Uploaded Documents:
        </Typography>
        <Grid container spacing={1}>
          {documents.map((file, index) => (
            <Grid item xs={12} key={index}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 1, 
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: colors.secondary.light
                }}
              >
                <Typography variant="body2" sx={{ flex: 1, mr: 2 }}>
                  {file.name}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => window.URL.createObjectURL(file)}
                  sx={{
                    color: colors.primary.main,
                    borderColor: colors.primary.main,
                    '&:hover': {
                      borderColor: colors.primary.dark,
                      backgroundColor: colors.secondary.main
                    }
                  }}
                >
                  View
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const renderFormSection = (prefix, title, photoPreview, handleChange) => (
    <StyledCard>
      <CardContent sx={{ p: 4, background: colors.background.paper }}>
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            mb: 4, 
            fontWeight: 600,
            color: colors.primary.main,
            borderBottom: `2px solid ${colors.secondary.main}`,
            paddingBottom: 1
          }}
        >
          {title}
        </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={3} mb={4}>
              <StyledAvatar
                src={photoPreview}
                sx={{ bgcolor: 'rgba(147, 51, 234, 0.08)' }}
              >
                <Person sx={{ fontSize: 40, color: colors.primary.main }} />
              </StyledAvatar>
              <PhotoUploadButton
                variant="outlined"
                component="label"
                startIcon={<PhotoCamera />}
              >
                Upload Photo
                <input
                  type="file"
                  name={`${prefix}Photo`}
                  hidden
                  accept="image/*"
                  onChange={handleChange}
                />
              </PhotoUploadButton>
            </Box>
            </Grid>

          <Grid item xs={12}>
            <StyledTextField
                fullWidth
                label="Full Name"
              name={`${prefix}Name`}
                required
              InputProps={{
                startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />,
              }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
            <StyledTextField
                fullWidth
              label="Father's Name"
              name={`${prefix}FatherName`}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
            <StyledTextField
                fullWidth
              label="Mother's Name"
              name={`${prefix}MotherName`}
                required
              />
            </Grid>

          <Grid item xs={12} sm={6}>
            <StyledTextField
                fullWidth
              label="Age"
              name={`${prefix}Age`}
              type="number"
                required
              InputProps={{
                startAdornment: <Badge sx={{ mr: 1, color: 'action.active' }} />,
              }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
            <StyledTextField
                fullWidth
              label="Mobile Number"
              name={`${prefix}Mobile`}
              type="tel"
                required
              InputProps={{
                startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />,
              }}
              />
            </Grid>

          <Grid item xs={12}>
            <StyledTextField
                fullWidth
              label="Email"
              name={`${prefix}Email`}
              type="email"
                required
              InputProps={{
                startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />,
              }}
              />
            </Grid>

          <Grid item xs={12}>
            <StyledTextField
                fullWidth
              label="Address"
              name={`${prefix}Address`}
              multiline
              rows={3}
                required
              InputProps={{
                startAdornment: <Home sx={{ mr: 1, mt: 1, color: 'action.active' }} />,
              }}
              />
            </Grid>

            <Grid item xs={12}>
            <DocumentUploadButton
              component="label"
              fullWidth
            >
              <CloudUpload sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="body1" sx={{ mb: 0.5 }}>
                Upload Required Documents
              </Typography>
              <Typography variant="caption" color="textSecondary">
                L.C, Aadhar Card, Birth Certificate, Affidavit
              </Typography>
              <input
                type="file"
                name={`${prefix}Documents`}
                hidden
                multiple
                onChange={handleChange}
              />
            </DocumentUploadButton>
            {renderUploadedDocuments(prefix)}
            </Grid>
            </Grid>
      </CardContent>
    </StyledCard>
  );

  if (error) {
    return (
      <Container maxWidth="md">
        <Box p={3}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  if (submitSuccess) {
    return (
      <Container maxWidth="md">
        <Box p={3}>
          <Alert severity="success">
            Form submitted successfully! Redirecting to dashboard...
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ background: colors.background.light, borderRadius: '24px', my: 4 }}>
      <Box py={6}>
        <Typography 
          variant="h3" 
          align="center" 
          sx={{ 
            mb: 4, 
            fontWeight: 700,
            background: colors.primary.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 4px rgba(147, 51, 234, 0.1)',
          }}
        >
          Samuh Lagan Registration
        </Typography>

        {countdown && (
          <CountdownTimer elevation={0}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 3,
              width: '100%',
              justifyContent: 'center'
            }}>
              <AccessTime 
                sx={{ 
                  fontSize: 32, 
                  color: colors.primary.main,
                  mr: 2
                }} 
              />
              {countdown.split(' ').map((part, index) => {
                if (part.endsWith('d')) {
                  return (
                    <TimeUnit key="days">
                      <TimeValue>{part.replace('d', '')}</TimeValue>
                      <TimeLabel>Days</TimeLabel>
                    </TimeUnit>
                  );
                }
                if (part.endsWith('h')) {
                  return (
                    <TimeUnit key="hours">
                      <TimeValue>{part.replace('h', '')}</TimeValue>
                      <TimeLabel>Hours</TimeLabel>
                    </TimeUnit>
                  );
                }
                if (part.endsWith('m')) {
                  return (
                    <TimeUnit key="minutes">
                      <TimeValue>{part.replace('m', '')}</TimeValue>
                      <TimeLabel>Minutes</TimeLabel>
                    </TimeUnit>
                  );
                }
                if (part.endsWith('s')) {
                  return (
                    <TimeUnit key="seconds">
                      <TimeValue>{part.replace('s', '')}</TimeValue>
                      <TimeLabel>Seconds</TimeLabel>
                    </TimeUnit>
                  );
                }
                return null;
              })}
            </Box>
          </CountdownTimer>
        )}
        
        <Suspense fallback={<LoadingFallback />}>
          {!showForm ? (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleBookClick}
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: 3,
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                Book Now
              </Button>
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  {renderFormSection('bride', 'Bride Details', bridePhotoPreview, handleChange)}
                </Grid>
                <Grid item xs={12} md={6}>
                  {renderFormSection('groom', 'Groom Details', groomPhotoPreview, handleChange)}
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="center">
                    <StyledButton
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                      size="large"
                  >
                    {isSubmitting ? (
                      <>
                          <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                        Submitting...
                      </>
                    ) : (
                        'Submit Registration'
                    )}
                    </StyledButton>
                </Box>
              </Grid>
            </Grid>
          </form>
          )}
        </Suspense>
    </Box>
    </Container>
  );
};

export default SamuhLaganBooking; 