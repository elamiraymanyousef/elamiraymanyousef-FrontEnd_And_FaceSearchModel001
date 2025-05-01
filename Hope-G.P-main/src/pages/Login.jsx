import { useNavigate } from "react-router-dom";
import Cookie from "cookie-universal";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { LoginApi } from "../apiRequests/apiRequest";
import ChangePassword from "../components/home-page-components/Auth/ChangePassword";
import SuccessOrFailMsg from "../components/SuccessOrFailMsg";
import { useNav } from "../context/EmailContext";

// MUI Imports
import {
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
  Grid,
  Typography,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Container,
  Alert,
  Collapse,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

// Image imports
import LoginImage from "../assets/login-image.jpg";

function Login() {
  const { Nav, handlNav } = useNav();
  const navigate = useNavigate();
  const cookies = Cookie();
  
  const [Form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: true
  });
  
  const [changePass, setChangePass] = useState(false);
  const [errInpemail, seterrInpemail] = useState(false);
  const [errInppass, seterrInppass] = useState(false);
  const [emailErrorText, setEmailErrorText] = useState("");
  const [passwordErrorText, setPasswordErrorText] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setmsg] = useState(false);
  const [ErrForImg, setErrForImg] = useState(false);
  const [succesOrFAIL, setsuccesOrFAIL] = useState("");
  const [msgforsuccess, setMsgforsuccess] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorAlertMessage, setErrorAlertMessage] = useState("");
  
  const isOpen = () => setChangePass(true);
  const popUpchangPass = (data) => setChangePass(data);
  
  const handlChanges = (e) => {
    setForm({ ...Form, [e.target.name]: e.target.value });
    
    // Clear validation errors when user starts typing
    if (e.target.name === "email") {
      seterrInpemail(false);
      setEmailErrorText("");
    }
    if (e.target.name === "password") {
      seterrInppass(false);
      setPasswordErrorText("");
    }
    
    // Clear global error alert when user starts typing
    setShowErrorAlert(false);
  };
  
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Reset all error states
    setmsg(false);
    seterrInppass(false);
    seterrInpemail(false);
    setEmailErrorText("");
    setPasswordErrorText("");
    setShowErrorAlert(false);
    
    let hasErrors = false;

    // Validate email
    if (!Form.email) {
      seterrInpemail(true);
      setEmailErrorText("البريد الإلكتروني مطلوب");
      hasErrors = true;
    } else if (!validateEmail(Form.email)) {
      seterrInpemail(true);
      setEmailErrorText("يرجى إدخال بريد إلكتروني صحيح");
      hasErrors = true;
    }
    
    // Validate password
    if (!Form.password) {
      seterrInppass(true);
      setPasswordErrorText("كلمة المرور مطلوبة");
      hasErrors = true;
    } else if (Form.password.length < 6) {
      seterrInppass(true);
      setPasswordErrorText("كلمة المرور يجب أن تكون على الأقل 6 أحرف");
      hasErrors = true;
    }

    if (hasErrors) {
      setErrorAlertMessage("يرجى تصحيح الأخطاء في النموذج قبل المتابعة");
      setShowErrorAlert(true);
      return;
    }

    try {
      const response = await axios.post(`${LoginApi}`, Form, {
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "ar-EG",
        },
      });

      const res = response.data;

      if (res.succeeded) {
        setmsg(true);
        setsuccesOrFAIL("تم تسجيل الدخول بنجاح");
        setErrForImg(false);
        const token = res.data.token;
        const userId = res.data.userId;

        localStorage.setItem("userId", userId);
        cookies.set("Cookie", token);

        navigate("/HomePage");
      } else {
        setmsg(true);
        setErrForImg(true);
        setsuccesOrFAIL(res.message || "فشل تسجيل الدخول");
        
        // Show more specific error messages for common issues
        if (res.message && res.message.includes("password")) {
          seterrInppass(true);
          setPasswordErrorText("كلمة المرور غير صحيحة");
        } else if (res.message && res.message.includes("email")) {
          seterrInpemail(true);
          setEmailErrorText("البريد الإلكتروني غير مسجل");
        } else {
          // Set global error alert
          setErrorAlertMessage(res.message || "بيانات الدخول غير صحيحة، يرجى التحقق من البريد الإلكتروني وكلمة المرور");
          setShowErrorAlert(true);
        }
      }
    } catch (err) {
      console.log(err);
      setmsg(true);
      setErrForImg(true);
      
      // Handle different error scenarios
      if (err.response) {
        // The request was made and the server responded with a status code outside the 2xx range
        if (err.response.status === 401) {
          setsuccesOrFAIL("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        } else if (err.response.status === 404) {
          setsuccesOrFAIL("البريد الإلكتروني غير مسجل في النظام");
        } else if (err.response.status === 429) {
          setsuccesOrFAIL("عدد محاولات تسجيل الدخول تجاوز الحد المسموح، يرجى المحاولة لاحقًا");
        } else {
          setsuccesOrFAIL("حدث خطأ أثناء محاولة تسجيل الدخول، يرجى المحاولة مرة أخرى");
        }
      } else if (err.request) {
        // The request was made but no response was received
        setsuccesOrFAIL("لا يمكن الاتصال بالخادم، يرجى التحقق من اتصالك بالإنترنت");
      } else {
        // Something happened in setting up the request
        setsuccesOrFAIL("حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى");
      }
      
      setErrorAlertMessage("فشل تسجيل الدخول: " + setsuccesOrFAIL);
      setShowErrorAlert(true);
    }
  };

  return (
    <>
      {msg && (
        <SuccessOrFailMsg
          succesOrFAIL={succesOrFAIL}
          ErrForImg={ErrForImg}
          setmsg={setmsg}
        />
      )}
      
      {msgforsuccess && (
        <SuccessOrFailMsg
          succesOrFAIL={succesOrFAIL}
          ErrForImg={ErrForImg}
          setmsg={setmsg}
        />
      )}
      
      {changePass && <ChangePassword popUpchangPass={popUpchangPass} />}
      
      <Container maxWidth={false} disableGutters sx={{ height: '100vh', overflow: 'hidden' }}>
        <Grid
          container
          component={Paper}
          elevation={6}
          sx={{
            height: '100%',
            borderRadius: 0,
            overflow: 'hidden',
          }}
        >
          {/* Left Side - Image Panel */}
          <Grid
            component={motion.div}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            item
            xs={false}
            sm={5}
            md={4}
            sx={{
              position: 'relative',
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url(${LoginImage})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: { sm: 3, md: 5 },
                textAlign: 'center',
              }}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    color: '#fff',
                    fontWeight: 700,
                    mb: 4,
                    fontSize: { sm: '2rem', md: '2.5rem' },
                    textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
                  }}
                >
                  مرحبا بك مجددا
                </Typography>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontWeight: 500,
                    mb: 6,
                    lineHeight: 1.8,
                  }}
                >
                  أدخل بياناتك في حالة كنت
                  <br />
                  مستخدم للموقع بالفعل
                </Typography>
              </motion.div>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 6, width: '80%' }}>
                <Divider sx={{ flexGrow: 1, bgcolor: 'rgba(255,255,255,0.5)' }} />
                <Typography sx={{ mx: 2, color: '#fff' }}>أو</Typography>
                <Divider sx={{ flexGrow: 1, bgcolor: 'rgba(255,255,255,0.5)' }} />
              </Box>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <Button
                  component={NavLink}
                  to="/register"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: '#53FF98',
                    color: '#fff',
                    borderRadius: 8,
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: '#47e087', 
                      backgroundColor: 'rgba(83, 255, 152, 0.1)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  انشاء حساب جديد
                </Button>
              </motion.div>
            </Box>
          </Grid>

          {/* Right Side - Login Form */}
          <Grid
            item
            xs={12}
            sm={7}
            md={8}
            component={motion.div}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: { xs: 3, sm: 6, md: 8 },
              bgcolor: '#f9f9f9',
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, sm: 4, md: 5 },
                width: '100%',
                maxWidth: 650,
                borderRadius: 3,
                bgcolor: '#fff',
                boxShadow: '0px 8px 25px rgba(17, 18, 22, 0.05)',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mb: 4,
                }}
              >
                <Typography
                  component="h1"
                  variant="h4"
                  sx={{
                    color: '#333',
                    fontWeight: 600,
                    mb: 3,
                    fontSize: { xs: '1.75rem', md: '2rem' },
                  }}
                >
                  تسجيل الدخول
                </Typography>
                
                <Typography
                  variant="body1"
                  sx={{
                    color: '#666',
                    mb: 3,
                    textAlign: 'center',
                  }}
                >
                  قم بتسجيل الدخول للوصول إلى حسابك
                </Typography>
              </Box>

              {/* Global Error Alert */}
              <Collapse in={showErrorAlert}>
                <Alert 
                  severity="error" 
                  icon={<ErrorOutlineIcon fontSize="inherit" />}
                  sx={{ 
                    mb: 3, 
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      color: '#f44336',
                    },
                    '& .MuiAlert-message': {
                      fontWeight: 500,
                    }
                  }}
                  onClose={() => setShowErrorAlert(false)}
                >
                  {errorAlertMessage}
                </Alert>
              </Collapse>

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ width: '100%' }}
              >
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="البريد الإلكتروني"
                    name="email"
                    value={Form.email}
                    onChange={handlChanges}
                    error={errInpemail}
                    helperText={errInpemail ? emailErrorText : ""}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: errInpemail ? "#f44336" : "#408CFF" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        height: { xs: 40, md: 50, xl: 70 },
                        
                        '&:hover fieldset': {
                          borderColor: errInpemail ? '#f44336' : '#408CFF',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: errInpemail ? '#f44336' : '#408CFF',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: errInpemail ? '#f44336' : '#408CFF',
                      },
                      '& .MuiFormHelperText-root': {
                        fontWeight: 500,
                        fontSize: '0.8rem',
                        marginTop: '4px',
                      },
                    }}
                  />
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
                  <InputLabel 
                    htmlFor="password"
                    error={errInppass}
                    sx={{
                      '&.Mui-focused': {
                        color: errInppass ? '#f44336' : '#408CFF',
                      },
                    }}
                  >
                    كلمة المرور
                  </InputLabel>
                  <OutlinedInput
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={Form.password}
                    onChange={handlChanges}
                    error={errInppass}
                    startAdornment={
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: errInppass ? "#f44336" : "#408CFF" }} />
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    sx={{
                      borderRadius: 2,
                       height: { xs: 40, md: 50, xl: 70 },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: errInppass ? '#f44336' : '#408CFF',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: errInppass ? '#f44336' : '#408CFF',
                      },
                    }}
                  />
                  {errInppass && (
                    <Typography 
                      variant="caption" 
                      color="error" 
                      sx={{ 
                        mt: 0.5, 
                        mr: 1.5, 
                        fontWeight: 500,
                        fontSize: '0.8rem',
                      }}
                    >
                      {passwordErrorText}
                    </Typography>
                  )}
                </FormControl>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="rememberMe"
                        checked={Form.rememberMe}
                        onChange={(e) => setForm({ ...Form, rememberMe: e.target.checked })}
                        color="primary"
                        sx={{ 
                          color: '#408CFF',
                          '&.Mui-checked': {
                            color: '#408CFF',
                          }
                        }}
                      />
                    }
                    label="تذكرني"
                  />
                  
                  <Typography
                    onClick={isOpen}
                    variant="body2"
                    sx={{
                      color: '#408CFF',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                      transition: 'all 0.2s',
                    }}
                  >
                    نسيت كلمة المرور؟
                  </Typography>
                </Box>

                <Button
                  type="submit"
                  width="auto"
                  variant="contained"
                  size="large"
                  sx={{
                    mt: 2,
                    mb: 3,
                    py: 1,
                    px: 4,
                    borderRadius: 8,
                    backgroundColor: '#408CFF',
                    fontWeight: 600,
                    fontSize: '1rem',
                    boxShadow: '0 4px 10px rgba(64, 140, 255, 0.3)',
                    '&:hover': {
                      backgroundColor: '#3575d9',
                      boxShadow: '0 6px 15px rgba(64, 140, 255, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '0 auto',
                    minWidth: '200px',
                  }}
                >
                  تسجيل الدخول
                </Button>
              </Box>

              <Box sx={{ display: { xs: 'flex', sm: 'none' }, justifyContent: 'center', mt: 3 }}>
                <Typography sx={{ color: '#666', mr: 1 }}>
                  ليس لديك حساب؟
                </Typography>
                <Typography
                  component={NavLink}
                  to="/register"
                  sx={{
                    color: '#408CFF',
                    textDecoration: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  إنشاء حساب جديد
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Login;