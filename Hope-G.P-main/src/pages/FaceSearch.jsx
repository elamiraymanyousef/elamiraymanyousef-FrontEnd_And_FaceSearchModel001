import React, { useState, useRef } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  CircularProgress, 
  Dialog, 
  DialogTitle, 
  DialogContent,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Avatar,
  IconButton,
  Slide,
  Fade,
  Paper,
  LinearProgress,
  Tooltip
} from '@mui/material';
import { 
  CloudUpload, 
  Search, 
  Close, 
  CheckCircle, 
  ErrorOutline,
  Person,
  Home,
  ArrowBack
} from '@mui/icons-material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

// Enhanced styled components with more modern aesthetics
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: 'auto',
  maxWidth: 1000, // Increased card size
  width: '95%',
  background: 'linear-gradient(135deg, #1D2B64 0%, #4A148C 50%, #880E4F 100%)',
  color: 'white',
  borderRadius: '24px',
  boxShadow: '0 10px 40px 0 rgba(31, 38, 135, 0.5)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 70%)',
    pointerEvents: 'none'
  }
}));

const FileInputArea = styled('div')(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(5),
  border: '2px dashed rgba(255, 255, 255, 0.4)',
  borderRadius: '18px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.4s ease',
  '&:hover': {
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    transform: 'translateY(-3px)'
  }
}));

const HiddenInput = styled('input')({
  display: 'none',
});

const GlowButton = styled(Button)(({ theme }) => ({
  minWidth: 200,
  padding: '12px 26px',
  borderRadius: '50px',
  fontWeight: 'bold',
  boxShadow: '0 4px 20px rgba(255, 0, 128, 0.5)',
  transition: 'all 0.3s ease',
  background: 'linear-gradient(45deg, #FF5252, #FF1976)',
  '&:hover': {
    boxShadow: '0 6px 25px rgba(255, 0, 128, 0.7)',
    transform: 'translateY(-2px)'
  }
}));

const HomeButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  top: 20,
  left: 20,
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  color: 'white',
  borderRadius: '50px',
  padding: '8px 16px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: 'scale(1.05)'
  },
  transition: 'all 0.3s ease',
  zIndex: 10,
}));

const ResultCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.12)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  overflow: 'hidden',
  transition: 'all 0.4s ease',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)'
  },
  cursor: 'pointer'
}));

const FaceSearch = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noMatch, setNoMatch] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate(); 

  // Simulating progress for better UX
  const simulateProgress = () => {
    const timer = setInterval(() => {
      setUploadProgress((oldProgress) => {
        const newProgress = Math.min(oldProgress + Math.random() * 10, 95);
        if (newProgress === 95) {
          clearInterval(timer);
        }
        return newProgress;
      });
    }, 500);
    return timer;
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResults([]);
      setNoMatch(false);
    }
  };

  const handleFileAreaClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleGoHome = () => {
    navigate('/HomePage'); // Navigate to home page (not login page)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    setLoading(true);
    setResults([]);
    setNoMatch(false);
    setUploadProgress(0);

    // Start progress simulation
    const progressTimer = simulateProgress();

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:5000/search-face', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressTimer);
      setUploadProgress(100);
      
      const data = await response.json();
      console.log(data);
      
      // Add a small delay for better UX
      setTimeout(() => {
        if (data.match_found) {
          setResults(data.matched_images);
          setOpenDialog(true);
        } else {
          setNoMatch(true);
        }
        setLoading(false);
      }, 800);
      
    } catch (error) {
      console.error('Error:', error);
      clearInterval(progressTimer);
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleClearImage = (e) => {
    e.stopPropagation();
    setImage(null);
    setPreview(null);
    setResults([]);
    setNoMatch(false);
    setUploadProgress(0);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1D2B64, #4A148C)',
      padding: 3,
      position: 'relative'
    }}>
      <Fade in timeout={800}>
        <StyledPaper elevation={5}>
          {/* Home Button - Bigger and more visible at the top of the card */}
          <HomeButton 
            onClick={handleGoHome} 
            aria-label="العودة للصفحة الرئيسية"
            startIcon={<Home />}
          >
            الرئيسية
          </HomeButton>
          
          <Typography 
            variant="h3" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 4,
              background: 'linear-gradient(90deg, #FFFFFF, #FFD700)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 10px rgba(255, 215, 0, 0.3)'
            }}
          >
            البحث عن مفقودين
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <FileInputArea 
              onClick={handleFileAreaClick}
              style={{ 
                backgroundColor: preview ? 'rgba(255, 255, 255, 0.08)' : 'transparent'
              }}
            >
              {preview ? (
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={preview}
                    sx={{
                      width: 140,
                      height: 140,
                      margin: '0 auto',
                      border: '4px solid rgba(255,255,255,0.8)',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
                    }}
                  />
                  <IconButton 
                    onClick={handleClearImage}
                    sx={{
                      position: 'absolute',
                      top: -10,
                      right: '50%',
                      transform: 'translateX(70px)',
                      color: 'white',
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 0, 0, 0.7)',
                      }
                    }}
                  >
                    <Close />
                  </IconButton>
                </Box>
              ) : (
                <>
                  <CloudUpload sx={{ fontSize: 60, color: 'white', mb: 2, opacity: 0.9 }} />
                  <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                    رفع صورة المفقود
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    JPG, PNG, او JPEG (الحد الاقصي 5 ميجا)
                  </Typography>
                </>
              )}
              
              <HiddenInput
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                required={!image}
              />
            </FileInputArea>

            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <GlowButton
                variant="contained"
                type="submit"
                disabled={!image || loading}
                startIcon={!loading && <Search />}
              >
                {loading ? (
                  <>
                    <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                    جاري البحث...
                  </>
                ) : (
                  'بحث'
                )}
              </GlowButton>
              
              {/* Return Home Button */}
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={handleGoHome}
                sx={{
                  ml: 2,
                 margin :2,
                  borderColor: 'rgba(255,255,255,0.5)',
                  color: 'white',
                  borderRadius: '50px',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                الرئيسية
              </Button>
            </Box>
          </form>

          {loading && (
            <Box sx={{ width: '100%', mt: 3 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1, textAlign: 'center' }}>
                {uploadProgress < 100 ? 'جاري تحليل الصورة...' : 'اكتمل التحليل، جاري البحث في قاعدة البيانات...'}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={uploadProgress} 
                color="secondary"
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #FF5252, #FF1976)'
                  }
                }}
              />
            </Box>
          )}

          {noMatch && (
            <Slide direction="up" in={noMatch} mountOnEnter unmountOnExit>
              <Box 
                sx={{
                  mt: 4,
                  p: 3,
                  backgroundColor: 'rgba(255, 0, 0, 0.15)',
                  borderRadius: '12px',
                  borderLeft: '5px solid #FF5252',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0 4px 15px rgba(255, 0, 0, 0.2)'
                }}
              >
                <ErrorOutline sx={{ color: '#FF5252', mr: 2, fontSize: 28 }} />
                <Box>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 0.5 }}>
                    لم يتم العثور على نتائج
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    لم يتم العثور علي الشخص في قاعدة البيانات
                  </Typography>
                </Box>
              </Box>
            </Slide>
          )}
        </StyledPaper>
      </Fade>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: '24px',
            background: 'linear-gradient(145deg, #1D2B64, #4A148C)',
            color: 'white',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', py: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              نتائج البحث
            </Typography>
            <IconButton 
              onClick={handleCloseDialog} 
              sx={{ 
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ py: 4 }}>
          <Grid container spacing={3}>
            {results.map((result, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <ResultCard onClick={() => navigate(`/post-details/${result.name}`)}>
                  <CardMedia
                    component="img"
                    height="220"
                    image={result.image_base64}
                    alt={result.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" mb={1.5}>
                      <Person sx={{ mr: 1.5, color: '#FF5252', fontSize: 28 }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {result.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.8)' }}>
                      البوست: {result.name}
                    </Typography>
                    <Box 
                      display="flex" 
                      alignItems="center" 
                      sx={{ 
                        p: 1, 
                        borderRadius: '8px', 
                        backgroundColor: 'rgba(76, 175, 80, 0.15)'
                      }}
                    >
                      <CheckCircle sx={{ color: '#4CAF50', mr: 1 }} />
                      <Typography variant="body2" fontWeight="medium">
                        متطابقة بنسبة كبيرة
                      </Typography>
                    </Box>
                  </CardContent>
                </ResultCard>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default FaceSearch;