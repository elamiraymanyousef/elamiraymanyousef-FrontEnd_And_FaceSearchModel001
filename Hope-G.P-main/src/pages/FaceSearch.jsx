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
  LinearProgress
} from '@mui/material';
import { 
  CloudUpload, 
  Search, 
  Close, 
  CheckCircle, 
  ErrorOutline,
  Person
} from '@mui/icons-material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: 'auto',
  maxWidth: 800,
  background: 'linear-gradient(135deg, #1D2B64 0%, #4A148C 50%, #880E4F 100%)',
  color: 'white',
  borderRadius: '16px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
}));

const FileInputArea = styled('div')(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(4),
  border: '2px dashed rgba(255, 255, 255, 0.4)',
  borderRadius: '12px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  }
}));

// حل مشكلة إخفاء input وجعله مرتبط بشكل صحيح بالمنطقة القابلة للنقر
const HiddenInput = styled('input')({
  display: 'none',
});



const FaceSearch = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noMatch, setNoMatch] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  
  // إضافة مرجع للـ input المخفي
  const fileInputRef = useRef(null);
  
  const navigate = useNavigate(); 
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResults([]);
      setNoMatch(false);
    }
  };

  // وظيفة جديدة تفتح مربع حوار اختيار الملفات
  const handleFileAreaClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    setLoading(true);
    setResults([]);
    setNoMatch(false);

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:5000/search-face', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log(data);
      if (data.match_found) {
        setResults(data.matched_images);
        setOpenDialog(true);
      } else {
        setNoMatch(true);
      }
    } catch (error) {
      console.error('Error:', error);
    }

    setLoading(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleClearImage = () => {
    setImage(null);
    setPreview(null);
    setResults([]);
    setNoMatch(false);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to right, #1D2B64, #4A148C)',
      padding: 2
    }}>
      <Fade in timeout={500}>
        <StyledPaper elevation={3}>
          <Typography 
            variant="h3" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 4,
              background: 'linear-gradient(90deg, #FFFFFF, #FFD700)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            البحث عن مفقودين
          </Typography>
          
          <form onSubmit={handleSubmit}>
            {/* تعديل طريقة رفع الملفات باستخدام Input مخفي ومرجع */}
            <FileInputArea 
              onClick={handleFileAreaClick}
              style={{ 
                backgroundColor: preview ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
              }}
            >
              {preview ? (
                <>
                  <Avatar
                    src={preview}
                    sx={{
                      width: 120,
                      height: 120,
                      margin: '0 auto',
                      border: '3px solid white'
                    }}
                  />
                  <IconButton 
                    onClick={(e) => {
                      e.stopPropagation(); // منع انتشار الحدث للعنصر الأب
                      handleClearImage();
                    }}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      color: 'white',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }}
                  >
                    <Close />
                  </IconButton>
                </>
              ) : (
                <>
                  <CloudUpload sx={{ fontSize: 48, color: 'white', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                    رفع صورة المفقود
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    JPG, PNG, او JPEG (الحد الاقصي 5 ميجا)
                  </Typography>
                </>
              )}
              
              {/* استخدام عنصر input مخفي مع مرجع */}
              <HiddenInput
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                required={!image}
              />
            </FileInputArea>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                disabled={!image || loading}
                startIcon={!loading && <Search />}
                sx={{
                  minWidth: 200,
                  padding: '10px 24px',
                  borderRadius: '50px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(255, 0, 128, 0.4)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(255, 0, 128, 0.6)'
                  }
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                     جاري البحث...
                  </>
                ) : (
                  'بحث'
                )}
              </Button>
            </Box>
          </form>

          {loading && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <LinearProgress color="secondary" />
            </Box>
          )}

          {noMatch && (
            <Slide direction="up" in={noMatch} mountOnEnter unmountOnExit>
              <Box 
                sx={{
                  mt: 3,
                  p: 2,
                  backgroundColor: 'rgba(255, 0, 0, 0.1)',
                  borderRadius: '8px',
                  borderLeft: '4px solid #FF5252',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <ErrorOutline sx={{ color: '#FF5252', mr: 1 }} />
                <Typography sx={{ color: 'white' }}>
                  لم يتم العثور علي الشخص في قاعدة البيانات
                </Typography>
              </Box>
            </Slide>
          )}
        </StyledPaper>
      </Fade>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: 'linear-gradient(145deg, #1D2B64, #4A148C)',
            color: 'white'
            
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              النتائج
            </Typography>
            <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box py={3}>
            <Grid container spacing={3}>
              {results.map((result, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card 
                  onClick={() => navigate(`/post-details/${result.name}`)}
                  sx={{ 
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)'
                    }
                  }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={result.image_base64}
                      alt={result.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Person sx={{ mr: 1, color: 'secondary.main' }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {result.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                         البوست: {result.name}
                      </Typography>
                      <Box display="flex" alignItems="center">
                        <CheckCircle sx={{ color: '#4CAF50', mr: 1 }} />
                        <Typography variant="body2">
                          متطابقة بنسبة كبيرة
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default FaceSearch;