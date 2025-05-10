import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  TextField,
  Typography,
  Backdrop,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  InputAdornment,
  IconButton
} from "@mui/material";
import axios from "axios";
import Cookie from "cookie-universal";
import SuccessMsg from "./SuccessMsg";
import { getAllGovernments, resetPassword, UpdateUserData } from "../../apiRequests/apiRequest";

const cookies = Cookie();
const token = cookies.get("Cookie");

export default function EditProfile({
  openPopUp,
  setopenPopUp,
  ProfileData,
  getProfileDate,
}) {
  const [msg, setmsg] = useState(false);
  const [ErrForImg, setErrForImg] = useState(false);
  const [succesOrFAIL, setsuccesOrFAIL] = useState("");
  const [msgforsuccess, setMsgforsuccess] = useState(false);
  
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState(false);
  const [governments, setGovernments] = useState([]);

  const [form, setForm] = useState({
    userId: localStorage.getItem("userId") || "",
    firstName: ProfileData.firstName || "",
    lastName: ProfileData.lastName || "",
    phoneNumber: ProfileData.phoneNumber || "",
    governmentId: ProfileData.government.id || "",
  });

  useEffect(() => {
    let isMounted = true;

    axios.get(getAllGovernments).then((response) => {
      if (isMounted) {
        setGovernments(response.data);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMsg("");
    console.log(form);
    
    try {
      const response = await axios.put(UpdateUserData, form, {
        headers: {
          Authorization: "Bearer " + token,
          "Accept-Language": "ar-EG",
        },
      });
      console.log("response.isSuccess",response.data);
      
      if (response.data.succeeded) {
        setError(false);
        setSuccessMsg("Profile Updated Successfully");
        getProfileDate();
        setTimeout(() => {
          window.location.reload();

        }, 1000);
      } else {
        setSuccessMsg(response.data.message);
        setError(true);
      }
    } catch (err) {
      setSuccessMsg("حدث خطأ أثناء تحديث البيانات");
      setError(true);
    }
  };

  const [passwordForm, setPasswordForm] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  // Handle password form input change
  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

   // Reset password submission
   const handleResetPassword = async (event) => {
    event.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSuccessMsg("Passwords do not match.");
      setError(true);
      return;
    }
    
    try {
      const response = await axios.post(resetPassword, passwordForm, {
        headers: {
          Authorization: "Bearer " + token,
          "Accept-Language": "ar-EG",
        },
      });

      if (response.data.succeeded) {
        setError(false);
        setSuccessMsg("Password reset successfully.");
        getProfileDate();
        setTimeout(() => {
          window.location.reload();

        }, 1000);
      } else {
        setSuccessMsg(response.data.message);
        setError(true);
      }
    } catch (err) {
      setSuccessMsg("حدث خطأ أثناء تغيير كلمة المرور");
      setError(true);
    }
  };

  return (
    <>
         {/* {msg && (
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
            
          )} */}
      {successMsg !== "" && <SuccessMsg succesMsg={successMsg} />}
      <Backdrop sx={{ color: "#483131", zIndex: 11 }} open={openPopUp}>
        <Card sx={{ width: { xs: 350, md: 500 }, borderRadius: 4 }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h6" color="primary">
                تعديل البيانات الشخصية
              </Typography>
              <Typography
                onClick={() => setopenPopUp(false)}
                sx={{
                  backgroundColor: "#EBEBEB",
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  textAlign: "center",
                  lineHeight: "30px",
                  cursor: "pointer",
                  fontSize: 20,
                }}
              >
                x
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                  name="firstName"
                  label="الاسم الأول"
                  value={form.firstName}
                  onChange={handleChange}
                  fullWidth
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                  name="lastName"
                  label="الاسم الأخير"
                  value={form.lastName}
                  onChange={handleChange}
                  fullWidth
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                  name="phoneNumber"
                  label="رقم الهاتف"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  fullWidth
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="gov-label">اختر محافظتك</InputLabel>
                <Select
                  labelId="gov-label"
                  name="governmentId"
                  value={form.governmentId}
                  onChange={handleChange}
                  input={
                    <OutlinedInput
                      startAdornment={
                        <InputAdornment position="start">
                          {/* <IconButton aria-label="gov icon" sx={{ p: 0 }}>
                            <img src={cityIcon} alt="city" width="20" />
                          </IconButton> */}
                        </InputAdornment>
                      }
                    />
                  }
                >
                  {governments.map((gov) => (
                    <MenuItem key={gov.id} value={gov.id}>
                      {gov.nameAr}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button variant="contained" color="primary" type="submit" fullWidth>
                حفظ التعديلات
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

{/* Reset Password Section */}
<Box component="form" onSubmit={handleResetPassword}>
  <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
    تغيير كلمة المرور
  </Typography>

  <FormControl fullWidth sx={{ mb: 2 }}>
    <TextField
      name="email"
      label="البريد الإلكتروني"
      value={passwordForm.email}
      onChange={handlePasswordChange}
      fullWidth
      required
    />
  </FormControl>

  <FormControl fullWidth sx={{ mb: 2 }}>
    <TextField
      type="password"
      name="currentPassword"
      label="كلمة المرور الحالية"
      value={passwordForm.currentPassword}
      onChange={handlePasswordChange}
      fullWidth
      required
    />
  </FormControl>

  <FormControl fullWidth sx={{ mb: 2 }}>
    <TextField
      type="password"
      name="newPassword"
      label="كلمة المرور الجديدة"
      value={passwordForm.newPassword}
      onChange={handlePasswordChange}
      fullWidth
      required
    />
  </FormControl>

  <FormControl fullWidth sx={{ mb: 2 }}>
    <TextField
      type="password"
      name="confirmPassword"
      label="تأكيد كلمة المرور الجديدة"
      value={passwordForm.confirmPassword}
      onChange={handlePasswordChange}
      fullWidth
      required
    />
  </FormControl>

  <Button variant="contained" color="secondary" type="submit" fullWidth>
    حفظ كلمة المرور
  </Button>
</Box>
          </CardContent>
        </Card>
      </Backdrop>
    </>
  );
}
