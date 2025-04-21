import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
// import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Button,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import LoginImage from "../assets/login-image.jpg";
import instgram from "../assets/instagram 1.png";
import google from "../assets/google.png";
import facebook from "../assets/facebook-logo.png";
import username from "../assets/User.png";
import email from "../assets/email.png";
import password from "../assets/Lock.png";
import city from "../assets/government.png";
import fingerprint from "../assets/Fingerprint.png";
import phone from "../assets/Phone.png";
import { NavLink } from "react-router-dom";
import { RegesterApi, getAllGovernments } from "../apiRequests/apiRequest";
import Loading from "../components/home-page-components/Loading";
import axios from "axios";

import Cookie from "cookie-universal";
import { Shower } from "@mui/icons-material";
import ResetPasswordEnterEmail from "../components/home-page-components/Auth/VerifyEmail";
import VerifyEmail from "../components/home-page-components/Auth/VerifyEmail";
import SuccessOrFailMsg from "../components/SuccessOrFailMsg";
import { useNav } from "../context/EmailContext";

function Register() {
  const { Nav, handlNav } = useNav();
  const [getCity, setGetCity] = useState([]);
  const [ErrForImg, setErrForImg] = useState(false);
  const [userId, setUserId] = useState("");
 

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
  

  const [showVerifyPopup, setShowVerifyPopup] = useState(false);

  const [realEmail, setrealEmail] = useState("");
  const compareEmail = (email) => {
    setrealEmail(email);
  };


  const [userData, setUserData] = useState({
    UserName: "",
    DisplayName: "",
    City: "",
    Email: "",
    PhoneNumber: "",
    Password: "",
    ConfirmPassword: "",
  });
  const [err, setErr] = useState(false);
  const [MatchPassword, setMatchPassword] = useState("");
  const [succesOrFAIL, setsuccesOrFAIL] = useState("");
  const [showErrname, setShowErrname] = useState("");
  const [showErrnum, setShowErrnum] = useState("");
  const [showErremail, setShowErremail] = useState("");
  const [showErrpass, setShowErrpass] = useState("");
  const [msg, setmsg] = useState(false);
  const [msgforsuccess, setMsgforsuccess] = useState(false);
  // const refForm = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const cookies = Cookie();
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
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
      setMatchPassword("Passwords do not match.");
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
        console.log(res.data);
        console.log(res.data.userId);
        setUserId(res.data.userId || "static id"); // after registration success

        setErrForImg(true);
        setShowVerifyPopup(true);

        // window.location.pathname = "/";
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
  

  return (
    <>
      {/* <VerifyEmail compareEmail={compareEmail} /> */}
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
          height: { sm: "100%", lg: "100%" },
          overflowX: "hidden",
          flexWrap: "nowrap",
        }}
      >
        <Grid item xs={12} sm={8} md={8} elevation={6} square>
          <Box
            sx={{
              my: { xs: 8, sm: 4, xl: 8 },
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              component="h1"
              variant="h3"
              sx={{
                color: "#888",
                fontFamily: "Inter",
                fontSize: { xs: "18px", md: "30px", xl: "50px" },
                fontStyle: "normal",
                fontWeight: "600",
                textTransform: "capitalize",
                marginBottom: { xs: "50px", md: "50px", xl: "20px" },
              }}
            >
              اشترك فى الموقع
            </Typography>
            
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                marginTop: { xs: "10px", md: "0px", xl: "10px" },
              }}
            >
              {/* <img src={google} alt="" /> */}
            </Box>
            <Box
              sx={{
                display: { xs: "flex", sm: "none" },
                gap: "15px",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
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
                <Divider
                  sx={{
                    backgroundColor: "#939393",
                    width: { xs: "50px", md: 167 },
                    height: 2,
                    marginLeft: 2,
                  }}
                />
                <Typography
                  component="h4"
                  variant="h4"
                  sx={{
                    color: "#939393",
                    fontFamily: "Inter",
                    fontSize: "15px",
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: "normal",
                    textTransform: "capitalize",
                  }}
                >
                  أو
                </Typography>
                <Divider
                  sx={{
                    backgroundColor: "#939393",
                    width: { xs: "50px", md: 167 },
                    height: 2,
                    marginRight: 2,
                  }}
                />
              </Box>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#408CFF",
                  borderRadius: 100,
                  width: 117,
                  height: 45,

                  color: "#939393",
                  fontFamily: "Inter",
                  fontSize: "12px",
                  fontStyle: "normal",
                  fontWeight: "500",
                  lineHeight: "normal",
                  textTransform: "capitalize",
                }}
              >
                <NavLink
                  to={"/login"}
                  onClick={() => handlNav()}
                  style={{
                    textDecoration: "none",
                    color: "#a3a1a1",
                  }}
                >
                  تسجيل الدخول
                </NavLink>
              </Button>
            </Box>
            <Box
              component="form"
              // ref={refForm}
              noValidate
              onSubmit={handleRegisterSubmit}
              sx={{
                mt: { xs: 5, md: 2, xl: 5 },
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: { xs: 4, md: 4, xl: 4 },
                width: { xs: 300, md: 620 },
              }}
            >
              <FormControl
                // variant="outlined"
                fullWidth
              >
                <TextField
                  fullWidth
                  id="UserName"
                  label="اسم المستخدم"
                  name="UserName"
                  required
                  value={userData.UserName}
                  onChange={handleInputChange}
                  placeholder="ادخل الاسم باللغه الانجليزية"
                  sx={{
                    "& .MuiInputBase-root": {
                      height: { xs: 55, md: 60, xl: 80 },
                      borderRadius: { xs: 5, md: 6, xl: 8 },
                    },
                    "& .MuiInputBase-input": {
                      padding: { xs: 1, xl: 3 },
                      fontSize: { xs: 15, md: 20, xl: 25 },
                    },

                    "& .MuiOutlinedInput-root": {
                      "& > fieldset": showErrname !== "" && {
                        borderColor: "red",
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton aria-label="toggle">
                          <img src={username} alt="userName" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
              {msg && (
                <Typography
                  sx={{ color: "red", fontSize: "20px", fontWeight: "400" }}
                >
                  {showErrname}
                </Typography>
              )}
              <FormControl
                // variant="outlined"
                fullWidth
              >
                <TextField
                  fullWidth
                  id="DisplayName"
                  label=" اسم المستخدم الحقيقى"
                  name="DisplayName"
                  required
                  value={userData.DisplayName}
                  onChange={handleInputChange}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: { xs: 55, md: 60, xl: 80 },
                      borderRadius: { xs: 5, md: 6, xl: 8 },
                    },
                    "& .MuiInputBase-input": {
                      padding: 3,
                      fontSize: { xs: 15, md: 20, xl: 25 },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton aria-label="toggle">
                          <img src={username} alt="DisplayNAme" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>

              <FormControl
                variant="outlined"
                fullWidth
                sx={{
                  "& .MuiInputBase-root": {
                    height: { xs: 55, md: 60, xl: 80 },
                    borderRadius: { xs: 5, md: 6, xl: 8 },
                  },
                  "& .MuiInputBase-input": {
                    padding: 3,
                    fontSize: { xs: 15, md: 20, xl: 25 },
                  },
                }}
              >
                <InputLabel htmlFor="City" sx={{ background: "white" }}>
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
                          <IconButton aria-label="toggle">
                            <img src={city} alt="City" />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  }
                  IconComponent={() => null} // This line removes the dropdown arrow
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200, // Set the max height to control the number of visible items
                        borderRadius: 16,
                        marginTop: { xs: "100px" },
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

              <FormControl
                // variant="outlined"
                fullWidth
              >
                <TextField
                  fullWidth
                  id="Email"
                  label="الايميل"
                  name="Email"
                  type={"email"}
                  required
                  value={userData.Email}
                  onChange={handleInputChange}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: { xs: 55, md: 60, xl: 80 },
                      borderRadius: { xs: 5, md: 6, xl: 8 },
                    },
                    "& .MuiInputBase-input": {
                      padding: 3,
                      fontSize: { xs: 15, md: 20, xl: 25 },
                    },

                    "& .MuiOutlinedInput-root": {
                      "& > fieldset": showErremail !== "" && {
                        borderColor: "red",
                      },
                    },
                    // "& .MuiFormLabel-root": {
                    //   fontSize: 25,
                    //   color: "#000",
                    //   marginLeft: -1,
                    // },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton aria-label="toggle">
                          <img src={email} alt="Email" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
              {msg && (
                <Typography
                  sx={{ color: "red", fontSize: "20px", fontWeight: "400" }}
                >
                  {showErremail}
                </Typography>
              )}
              <FormControl
                // variant="outlined"
                fullWidth
              >
                <TextField
                  fullWidth
                  id="PhoneNumber"
                  label="رقم الهاتف"
                  name="PhoneNumber"
                  required
                  value={userData.PhoneNumber}
                  onChange={handleInputChange}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: { xs: 55, md: 60, xl: 80 },
                      borderRadius: { xs: 5, md: 6, xl: 8 },
                    },
                    "& .MuiInputBase-input": {
                      padding: 3,
                      fontSize: { xs: 15, md: 20, xl: 25 },
                    },

                    "& .MuiOutlinedInput-root": {
                      "& > fieldset": showErrnum !== "" && {
                        borderColor: "red",
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton aria-label="toggle">
                          <img src={phone} alt="PhoneNumber" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
              {msg && (
                <Typography
                  sx={{ color: "red", fontSize: "20px", fontWeight: "400" }}
                >
                  {showErrnum}
                </Typography>
              )}
              <FormControl variant="outlined" fullWidth>
                <OutlinedInput
                  sx={{
                    "& .MuiInputBase-input": {
                      padding: 3,
                      fontSize: { xs: 15, md: 20, xl: 25 },
                    },
                    "& .MuiFormLabel-root": {
                      fontSize: { xs: 15, md: 20, xl: 25 },
                      color: "#000",
                      marginLeft: -1,
                    },

                    "& .MuiOutlinedInput-root": {
                      "& > fieldset": showErrpass !== "" && {
                        borderColor: "red",
                      },
                    },
                    height: { xs: 55, md: 60, xl: 80 },
                    borderRadius: { xs: 5, md: 6, xl: 8 },
                    padding: 2,
                  }}
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "Password"}
                  startAdornment={
                    <IconButton aria-label="toggle" edge="end">
                      <img src={password} alt="Password" />
                    </IconButton>
                  }
                  endAdornment={
                    <InputAdornment position="start">
                      <IconButton
                        aria-label="toggle Password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                  name="Password"
                  required
                  value={userData.Password}
                  onChange={handleInputChange}
                  inputProps={{ minLength: 8 }}
                />
                <InputLabel htmlFor="outlined-adornment-password">
                  كلمة المرور
                </InputLabel>
              </FormControl>
              {msg && (
                <Typography
                  sx={{ color: "red", fontSize: "20px", fontWeight: "400" }}
                >
                  {showErrpass}
                </Typography>
              )}
              <FormControl variant="outlined" fullWidth>
                <OutlinedInput
                  sx={{
                    "& .MuiInputBase-input": {
                      padding: 3,
                      fontSize: { xs: 15, md: 20, xl: 25 },
                    },
                    "& .MuiFormLabel-root": {
                      fontSize: { xs: 15, md: 20, xl: 25 },
                      color: "#000",
                      marginLeft: -1,
                    },
                    height: { xs: 55, md: 60, xl: 80 },
                    borderRadius: { xs: 5, md: 6, xl: 8 },
                    padding: 2,
                  }}
                  id="outlined-adornment-password confirmPassword"
                  type={showConfirmPassword ? "text" : "Password"}
                  startAdornment={
                    <IconButton aria-label="toggle" edge="end">
                      <img src={fingerprint} alt="Password" />
                    </IconButton>
                  }
                  endAdornment={
                    <InputAdornment position="start">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="confirmPassword"
                  name="ConfirmPassword"
                  value={userData.ConfirmPassword}
                  onChange={handleInputChange}
                  required
                  inputProps={{ minLength: 8 }}
                />
                <InputLabel htmlFor="outlined-adornment-password">
                  تأكيد كلمة المرور
                </InputLabel>
              </FormControl>

              {MatchPassword == "" ? (
                ""
              ) : (
                <Typography
                  sx={{ fontSize: "20px", fontWeight: "400", color: "red" }}
                >
                  {MatchPassword}
                </Typography>
              )}
              <FormControlLabel
                sx={{ color: "#0038FF", marginTop: { md: "-15px", xl: "0" } }}
                control={<Checkbox value="remember" color="primary" />}
                label="هل توافق علي البنود وسياسة الأمان"
              />
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-end" },
                  marginRight: { xs: "0", md: "60px" },
                  zIndex: "11",
                }}

                // transition={{duration:.5}}
              >
                <Button
                  component={motion.button}
                  type="submit"
                  variant="contained"
                  color="success"
                  // onClick={handleRegisterSubmit}
                  sx={{
                    mb: 2,
                    borderRadius: 100,
                    background: "#5FE164",
                    width: { xs: 114, md: 170, xl: 214 },
                    height: { xs: 45, md: 55, xl: 65 },
                    zIndex: 13,
                    fontSize: { xs: "11px", md: "15px", xl: "20px" },
                  }}
                  initial={{ x: -350, y: -200, backgroundColor: "#408CFF" }}
                  animate={{ x: 0, y: 0, backgroundColor: "#5FE164" }}
                >
                  إبدء الإستخدام
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid
          component={motion.div}
          initial={{ right: -842 }}
          animate={{ right: 0 }}
          transition={{ duration: 1.2 }}
          item
          xs={0}
          sm={0}
          md={4}
          sx={{
            backgroundImage: `url(${LoginImage})`,
            backgroundRepeat: "no-repeat",
            transform: "scaleX(-1)",
            backgroundPosition: " -300px ",
            backgroundSize: "cover",
            position: "relative",
            zIndex: 11,

            display: { xs: "none", sm: "grid" },
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: { md: "88%", lg: "100%" },
              backgroundColor: "rgb(0 0 0 / 32%)",
              transform: "scaleX(-1)",
              paddingTop: "30px",
            }}
          >
            <Box
              sx={{
                height: "100%",
                display: "flex",
                justifyContent: { md: "start", xl: "center" },
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Typography
                component="h1"
                variant="h1"
                sx={{
                  color: "#fff",
                  fontFamily: "Inter",
                  fontSize: { sm: "40px", xl: "50px" },
                  fontStyle: "normal",
                  fontWeight: "700",
                  lineHeight: "normal",
                  textTransform: "capitalize",
                  marginTop: { xs: "0", md: "60px", xl: "20px" },
                }}
              >
                مرحبا بك
              </Typography>

              <Typography
                component="h4"
                variant="h4"
                sx={{
                  color: "rgba(255, 255, 255, 0.75)",
                  fontFamily: "Rubik",
                  fontSize: { sm: "20px", xl: "25px" },
                  fontStyle: "normal",
                  fontWeight: "700",
                  lineHeight: 1.5,
                  textTransform: "capitalize",
                  textAlign: "center",
                  marginTop : { xs: "0", md: "0px", xl: "20px" }, 
                }}
              >
                قم بادخال بياناتك في التسجيل <br />
                لبدء الإستخدام
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Divider
                  sx={{
                    backgroundColor: "#fff",
                    width: 167,
                    height: -1,
                    marginLeft: 2,
                  }}
                />
                <Typography
                  component="h4"
                  variant="h4"
                  sx={{
                    color: "#fff",
                    fontFamily: "Inter",
                    fontSize: "25px",
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: "normal",
                    textTransform: "capitalize",
                  }}
                >
                  أو
                </Typography>
                <Divider
                  sx={{
                    backgroundColor: "#fff",
                    width: 167,
                    height: -1,
                    marginRight: 2,
                  }}
                />
              </Box>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#53E0FF",
                  borderRadius: 100,
                  width: 250,
                  height: { md: 65, xl: 85 },

                  color: "#D3D3D3",
                  fontFamily: "Inter",
                  fontSize: "25px",
                  fontStyle: "normal",
                  fontWeight: "500",
                  lineHeight: "normal",
                  textTransform: "capitalize",
                }}
              >
                <NavLink
                  to={"/login"}
                  style={{
                    textDecoration: "none",
                    color: "#D3D3D3",
                  }}
                >
                  تسجيل الدخول
                </NavLink>
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default Register;
