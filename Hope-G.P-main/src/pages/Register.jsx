import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import Cookie from "cookie-universal";

// MUI Components
import {
  Button,
  Box,
  Grid,
  Typography,
  TextField,
  FormControl,
  FormControlLabel,
  Checkbox,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Divider,
  Paper,
} from "@mui/material";

// Icons
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// Components
import VerifyEmail from "../components/home-page-components/Auth/VerifyEmail";
import SuccessOrFailMsg from "../components/SuccessOrFailMsg";

// Context
import { useNav } from "../context/EmailContext";

// API Endpoints
import { RegesterApi, getAllGovernments } from "../apiRequests/apiRequest";

// Assets
import LoginImage from "../assets/login-image.jpg";
import username from "../assets/User.png";
import email from "../assets/email.png";
import password from "../assets/Lock.png";
import city from "../assets/government.png";
import fingerprint from "../assets/Fingerprint.png";
import phone from "../assets/Phone.png";

// Framer Motion
import { motion } from "framer-motion";

// Theme colors
const theme = {
  primary: "#3A7BFF",
  secondary: "#53E0FF",
  success: "#4ECB71",
  background: "#F9FAFC",
  dark: "#2A3040",
  light: "#FFFFFF",
  error: "#FF5252",
  textPrimary: "#2A3040",
  textSecondary: "#6B7280",
  divider: "#E5E7EB",
  gradientPrimary: "linear-gradient(45deg,rgb(68, 193, 61) 0%, #53E0FF 100%)",
  gradientSecondary: "linear-gradient(45deg, #4ECB71 0%, #53E0FF 100%)",
};

function Register() {
  const { handlNav } = useNav();
  const [getCity, setGetCity] = useState([]);
  const [ErrForImg, setErrForImg] = useState(false);
  const [userId, setUserId] = useState("");
  const [showVerifyPopup, setShowVerifyPopup] = useState(false);
  const [realEmail, setrealEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [msg, setmsg] = useState(false);
  const [msgforsuccess, setMsgforsuccess] = useState(false);
  const [succesOrFAIL, setsuccesOrFAIL] = useState("");
  const [MatchPassword, setMatchPassword] = useState("");
  const [showErrname, setShowErrname] = useState("");
  const [showErrnum, setShowErrnum] = useState("");
  const [showErremail, setShowErremail] = useState("");
  const [showErrpass, setShowErrpass] = useState("");

  const [userData, setUserData] = useState({
    UserName: "",
    DisplayName: "",
    City: "",
    Email: "",
    PhoneNumber: "",
    Password: "",
    ConfirmPassword: "",
  });

  const cookies = Cookie();

  // Effects
  useEffect(() => {
    let isMounted = true;
  
    axios.get(getAllGovernments).then((response) => {
      if (isMounted) {
        setGetCity(response.data);
      }
    });
  
    return () => {
      isMounted = false;
    };
  }, []);

  // Handlers
  const compareEmail = (email) => {
    setrealEmail(email);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setmsg(false);
    setMsgforsuccess(true);
  
    // Validation
    if (
      !userData.UserName ||
      !userData.DisplayName ||
      !userData.City ||
      !userData.Email ||
      !userData.PhoneNumber ||
      !userData.Password ||
      !userData.ConfirmPassword
    ) {
      setmsg(true);
      setsuccesOrFAIL("من فضلك أدخل جميع الحقول المطلوبة");
      return;
    }

    if (userData.Password !== userData.ConfirmPassword) {
      setMatchPassword("كلمات المرور غير متطابقة");
      return;
    }
  
    try {
      const payload = {
        email: userData.Email,
        password: userData.Password,
        confirmPassword: userData.ConfirmPassword,
        firstName: userData.UserName,
        lastName: userData.DisplayName,
        governmentId: userData.City,
        phoneNumber: userData.PhoneNumber,
      };
  
      const response = await axios.post(RegesterApi, payload, {
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "ar-EG",
        },
      });
  
      const res = response.data;
  
      if (res.succeeded) {
        setmsg(true);
        setMsgforsuccess(false);
        setsuccesOrFAIL(res.message || "تم التسجيل بنجاح");
        if (res.data?.token) {
          cookies.set("Cookie", res.data.token);
        }
        setUserId(res.data.userId || "static id");
        setErrForImg(true);
        setShowVerifyPopup(true);
      } else {
        setmsg(true);
        setMsgforsuccess(false);
        setsuccesOrFAIL(res.message || "فشل التسجيل");
      }
    } catch (err) {
      const errors = err.response?.data?.errors;
  
      if (err.response?.status === 400 && errors) {
        if (errors.Email) setShowErremail(errors.Email[0]);
        if (errors.Password) setShowErrpass(errors.Password[0]);
        if (errors.GovernmentId) setsuccesOrFAIL("اختر المحافظة من فضلك");
        if (errors.PhoneNumber) setShowErrnum(errors.PhoneNumber[0]);
  
        setmsg(true);
      } else if (err.response?.status === 415) {
        setmsg(true);
        setsuccesOrFAIL("حدث خطأ في نوع البيانات المرسلة");
      } else {
        setmsg(true);
        setsuccesOrFAIL("حدث خطأ غير متوقع");
      }
    }
  };

  // Common styles for form inputs
  const inputStyles = {
    "& .MuiInputBase-root": {
      height: { xs: 40, md: 50, xl: 70 },
      borderRadius: { xs: 2, md: 2, xl: 2 },
      transition: "transform 0.2s, box-shadow 0.2s",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
      },
    },
    "& .MuiInputBase-input": {
      padding: { xs: 3, md: 3, xl: 4 },
      fontSize: { xs: 14, md: 16, xl: 18 },
    },
    "& .MuiOutlinedInput-root": {
      "& > fieldset": {
        borderColor: theme.divider,
        transition: "border-color 0.3s",
      },
      "&:hover fieldset": {
        borderColor: theme.primary,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.primary,
        borderWidth: 2,
      },
    },
    "& .MuiFormLabel-root": {
      fontSize: { xs: 14, md: 16, xl: 18 },
      color: theme.textSecondary,
      fontFamily: "'Noto Sans Arabic', 'Tajawal', sans-serif",
    },
    mb: 2,
  };

  // Button animation props
  const buttonAnimation = {
    whileHover: { scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" },
    whileTap: { scale: 0.95 },
    transition: { type: "spring", stiffness: 400, damping: 15 }
  };

  // Form container animation
  const formContainerAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, staggerChildren: 0.1 }
  };

  // Error text style
  const errorTextStyle = {
    color: theme.error,
    fontSize: "12px",
    mt: 0.5,
    mb: 1,
    fontFamily: "'Noto Sans Arabic', 'Tajawal', sans-serif",
  };

  return (
    <>
      {showVerifyPopup && <VerifyEmail userId={userId} />}

      {msg && (
        <SuccessOrFailMsg
          succesOrFAIL={succesOrFAIL}
          ErrForImg={ErrForImg}
          setmsg={setmsg}
        />
      )}
      
      <Grid
        container
        component="main"
        sx={{
          height: "100vh",
          overflowX: "hidden",
          backgroundColor: theme.background,
          direction: "rtl",
          fontFamily: "'Noto Sans Arabic', 'Tajawal', sans-serif",
        }}
      >
        {/* Form Section */}
        <Grid 
          item 
          xs={12} 
          sm={7} 
          md={7} 
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              my: { xs: 4, sm: 6, xl: 8 },
              mx: { xs: 2, sm: 4, xl: 6 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              component="h1"
              variant="h3"
              sx={{
                color: theme.textPrimary,
                fontFamily: "'Noto Sans Arabic', 'Tajawal', sans-serif",
                fontSize: { xs: "22px", md: "32px", xl: "42px" },
                fontWeight: "700",
                mb: { xs: 3, md: 4, xl: 5 },
                position: "relative",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  width: "60px",
                  height: "4px",
                  backgroundColor: theme.primary,
                  bottom: "-12px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  borderRadius: "2px",
                }
              }}
            >
              اشترك في الموقع
            </Typography>
            
            <Box
              sx={{
                display: { xs: "flex", sm: "none" },
                gap: "15px",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "150px",
                }}
              >
                <Divider sx={{ flex: 1, bgcolor: theme.divider }} />
                <Typography sx={{ mx: 2, color: theme.textSecondary }}>
                  أو
                </Typography>
                <Divider sx={{ flex: 1, bgcolor: theme.divider }} />
              </Box>
              
              <Button
                component={motion.button}
                {...buttonAnimation}
                variant="outlined"
                sx={{
                  borderColor: theme.primary,
                  borderRadius: 6,
                  py: 1,
                  px: 3,
                  color: theme.primary,
                  fontFamily: "'Noto Sans Arabic', 'Tajawal', sans-serif",
                  fontWeight: 500,
                  textTransform: "none",
                }}
              >
                <NavLink
                  to="/login"
                  onClick={() => handlNav()}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  تسجيل الدخول
                </NavLink>
              </Button>
            </Box>
            
            {/* Enhanced Form Box with Shadow */}
            <Paper
              elevation={0}
              component={motion.div}
              {...formContainerAnimation}
              sx={{
                width: { xs: "95%", sm: "85%", md: "80%" },
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                background: theme.light,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                },
                p: { xs: 1, md: 2 },
                mt: { xs:1, md: 2 },
              }}
            >
              <Box
                component="form"
                noValidate
                onSubmit={handleRegisterSubmit}
                sx={{
                  width: "100%",
                }}
              >
                {/* UserName Field */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    id="UserName"
                    label="اسم المستخدم"
                    name="UserName"
                    required
                    value={userData.UserName}
                    onChange={handleInputChange}
                    placeholder="ادخل الاسم باللغة الإنجليزية"
                    sx={{
                      ...inputStyles,
                      "& .MuiOutlinedInput-root": {
                        "& > fieldset": showErrname !== "" ? {
                          borderColor: theme.error,
                        } : inputStyles["& .MuiOutlinedInput-root"]["& > fieldset"],
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton aria-label="toggle" sx={{ p: 0 }}>
                            <img src={username} alt="userName" width="20" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {showErrname && (
                    <Typography sx={errorTextStyle}>
                      {showErrname}
                    </Typography>
                  )}
                </FormControl>

                {/* DisplayName Field */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    id="DisplayName"
                    label="اسم المستخدم الحقيقي"
                    name="DisplayName"
                    required
                    value={userData.DisplayName}
                    onChange={handleInputChange}
                    sx={inputStyles}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton aria-label="toggle" sx={{ p: 0 }}>
                            <img src={username} alt="DisplayName" width="20" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>

                {/* City Field */}
                <FormControl fullWidth sx={{ ...inputStyles, mb: 2 }}>
                  <InputLabel htmlFor="City" sx={{ background: theme.light, paddingX: 0.5 }}>
                    اختر محافظتك
                  </InputLabel>
                  <Select
                    fullWidth
                    label="اختر محافظتك"
                    name="City"
                    required
                    value={userData.City}
                    onChange={handleInputChange}
                    input={
                      <OutlinedInput
                        startAdornment={
                          <InputAdornment position="start">
                            <IconButton aria-label="toggle" sx={{ p: 0 }}>
                              <img src={city} alt="City" width="20" />
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    }
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 200,
                          borderRadius: 8,
                          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                        },
                      },
                    }}
                  >
                    {Array.isArray(getCity) &&
                      getCity.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.nameAr}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>

                {/* Email Field */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    id="Email"
                    label="البريد الإلكتروني"
                    name="Email"
                    type="email"
                    required
                    value={userData.Email}
                    onChange={handleInputChange}
                    sx={{
                      ...inputStyles,
                      "& .MuiOutlinedInput-root": {
                        "& > fieldset": showErremail !== "" ? {
                          borderColor: theme.error,
                        } : inputStyles["& .MuiOutlinedInput-root"]["& > fieldset"],
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton aria-label="toggle" sx={{ p: 0 }}>
                            <img src={email} alt="Email" width="20" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {showErremail && (
                    <Typography sx={errorTextStyle}>
                      {showErremail}
                    </Typography>
                  )}
                </FormControl>

                {/* Phone Number Field */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    id="PhoneNumber"
                    label="رقم الهاتف"
                    name="PhoneNumber"
                    required
                    value={userData.PhoneNumber}
                    onChange={handleInputChange}
                    sx={{
                      ...inputStyles,
                      "& .MuiOutlinedInput-root": {
                        "& > fieldset": showErrnum !== "" ? {
                          borderColor: theme.error,
                        } : inputStyles["& .MuiOutlinedInput-root"]["& > fieldset"],
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton aria-label="toggle" sx={{ p: 0 }}>
                            <img src={phone} alt="PhoneNumber" width="20" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {showErrnum && (
                    <Typography sx={errorTextStyle}>
                      {showErrnum}
                    </Typography>
                  )}
                </FormControl>

                {/* Password Field */}
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                  <InputLabel htmlFor="outlined-adornment-password" sx={{ background: theme.light, paddingX: 0.5 }}>
                    كلمة المرور
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    name="Password"
                    required
                    value={userData.Password}
                    onChange={handleInputChange}
                    sx={{
                      ...inputStyles,
                      "& > fieldset": showErrpass !== "" ? {
                        borderColor: theme.error,
                      } : {},
                    }}
                    startAdornment={
                      <InputAdornment position="start">
                        <IconButton aria-label="toggle" sx={{ p: 0 }}>
                          <img src={password} alt="Password" width="20" />
                        </IconButton>
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="كلمة المرور"
                    inputProps={{ minLength: 8 }}
                  />
                  {showErrpass && (
                    <Typography sx={errorTextStyle}>
                      {showErrpass}
                    </Typography>
                  )}
                </FormControl>

                {/* Confirm Password Field */}
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                  <InputLabel htmlFor="outlined-adornment-confirm-password" sx={{ background: theme.light, paddingX: 0.5 }}>
                    تأكيد كلمة المرور
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="ConfirmPassword"
                    required
                    value={userData.ConfirmPassword}
                    onChange={handleInputChange}
                    sx={inputStyles}
                    startAdornment={
                      <InputAdornment position="start">
                        <IconButton aria-label="toggle" sx={{ p: 0 }}>
                          <img src={fingerprint} alt="ConfirmPassword" width="20" />
                        </IconButton>
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="تأكيد كلمة المرور"
                    inputProps={{ minLength: 8 }}
                  />
                  {MatchPassword && (
                    <Typography sx={errorTextStyle}>
                      {MatchPassword}
                    </Typography>
                  )}
                </FormControl>

                {/* Terms Checkbox */}
                <FormControlLabel
                  sx={{ 
                    color: theme.textSecondary,
                    my: 1,
                    "& .MuiCheckbox-root": {
                      color: theme.primary,
                    }
                  }}
                  control={
                    <Checkbox 
                      value="agree" 
                      color="primary" 
                      size="small"
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: { xs: 12, md: 14 } }}>
                      أوافق على شروط الاستخدام وسياسة الخصوصية
                    </Typography>
                  }
                />

                {/* Submit Button */}
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    mt: 2,
                  }}
                >
                  <Button
                    component={motion.button}
                    type="submit"
                    variant="contained"
                    {...buttonAnimation}
                    sx={{
                      py: { xs: 1, md: 1.5 },
                      px: { xs: 4, md: 6 },
                      borderRadius: 6,
                      background: theme.gradientPrimary,
                      color: theme.light,
                      fontSize: { xs: 14, md: 16, xl: 18 },
                      fontWeight: 600,
                      textTransform: "none",
                      boxShadow: "0 4px 15px rgba(51, 106, 215, 0.3)",
                      "&:hover": {
                        background: theme.gradientPrimary,
                        boxShadow: "0 8px 20px rgba(58, 123, 255, 0.4)",
                      }
                    }}
                  >
                    إنشاء حساب
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Grid>

        {/* Image Section */}
        <Grid
          component={motion.div}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          item
          xs={false}
          sm={5}
          md={5}
          sx={{
            position: "relative",
            display: { xs: "none", sm: "block" },
            overflow: "hidden",
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundImage: `url(${LoginImage})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              
              "&:before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              background: "linear-gradient(to bottom, rgba(23, 25, 31, 0.7), rgba(24, 29, 39, 0.7))",
                zIndex: 1,
              }
            }}
          />
          
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              zIndex: 2,
              p: 4,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Typography
                variant="h3"
                sx={{
                  color: theme.light,
                  fontFamily: "'Noto Sans Arabic', 'Tajawal', sans-serif",
                  fontSize: { sm: "32px", md: "42px" },
                  fontWeight: 700,
                  mb: 4,
                  textAlign: "center",
                }}
              >
                مرحباً بك
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Typography
                sx={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontFamily: "'Noto Sans Arabic', 'Tajawal', sans-serif",
                  fontSize: { sm: "16px", md: "18px" },
                  fontWeight: 500,
                  textAlign: "center",
                  mb: 6,
                  lineHeight: 1.7,
                }}
              >
                قم بإدخال بياناتك في التسجيل <br />
                لبدء استخدام جميع خدماتنا
              </Typography>
            </motion.div>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 4,
                width: "100%",
              }}
            >
              <Divider sx={{ flex: 1, bgcolor: "rgba(255,255,255,0.3)" }} />
              <Typography sx={{ mx: 2, color: theme.light }}>
                أو
              </Typography>
              <Divider sx={{ flex: 1, bgcolor: "rgba(255,255,255,0.3)" }} />
            </Box>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outlined"
                sx={{
                  borderColor: "rgba(255,255,255,0.5)",
                  color: theme.light,
                  borderRadius: 6,
                  py: 1.5,
                  px: 4,
                  fontSize: { sm: "14px", md: "16px" },
                  fontWeight: 500,
                  textTransform: "none",
                  "&:hover": {
                    borderColor: theme.light,
                    background: "rgba(255,255,255,0.1)",
                  }
                }}
              >
                <NavLink
                  to="/login"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    
                  }}
                >
                  تسجيل الدخول
                </NavLink>
              </Button>
            </motion.div>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default Register;
 