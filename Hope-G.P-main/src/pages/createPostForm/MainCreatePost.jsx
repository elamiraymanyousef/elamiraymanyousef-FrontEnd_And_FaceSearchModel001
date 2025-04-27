import { Avatar, Box, Button, Typography } from "@mui/material";

import { useState } from "react";
import ComunicationDetails from "./ComunicationDetails";
import ComunicationaboutLose from "./ComunicationaboutLose";
import Cookie from "cookie-universal";
import axios from "axios";
import { AddPostPeople, AddPostThings } from "../../apiRequests/apiRequest";
import { Link } from "react-router-dom";
import SuccessOrFailMsg from "../../components/SuccessOrFailMsg";
import userProfile from "../../assets/profileUser/user_profile.png";

const MainCreatePost = () => {
  const profile = localStorage.getItem("avater");
  // console.log("profile", profile);
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [City, setCity] = useState("");
  const [Town, setTown] = useState("");
  const [IsSearcher, setIsSearcher] = useState(true);
  const [MissigDate, setMissigDate] = useState(new Date());
  const [Name, setName] = useState("");
  const [Condition, setCondition] = useState("");
  const [Gendre, setGendre] = useState("");
  const [Age, setAge] = useState("");
  const [Description, setDescription] = useState("");
  const [ImageFile, setImageFile] = useState("");
  const [Type, setType] = useState("");
  const [checkLostPeapleOrThing, setcheckLostPeapleOrThing] = useState(true);
  const [succesOrFAIL, setsuccesOrFAIL] = useState("");
  const [msg, setmsg] = useState(false);
  const [resErr, setReserr] = useState("");

  const [ErrForImg, setErrForImg] = useState(false);

  const cookies = Cookie();
  const Token = cookies.get("Cookie");
  console.log("mmm", MissigDate);
  console.log(checkLostPeapleOrThing);
  const getData = (PhoneNumber, City, IsSearcher, MissigDate, Town) => {
    setPhoneNumber(PhoneNumber);
    setCity(City);
    setTown(Town);
    setIsSearcher(IsSearcher);
    setMissigDate(MissigDate);

    // console.log("alldata,",town,PhoneNumber,city,IsSearcher,mixedValue)
  };
  const getcheckLostPeapleOrThing = (checkLostPeapleOrThing) => {
    setcheckLostPeapleOrThing(checkLostPeapleOrThing);
  };
  console.log("cc", checkLostPeapleOrThing);
  const getDataForLosePeople = (
    Name,
    Condition,
    Gendre,
    Age,
    Description,
    ImageFile
  ) => {
    // setcheckLostPeapleOrThing(checkLostPeapleOrThing)
    setName(Name);
    setCondition(Condition);
    setGendre(Gendre);
    setAge(Age);
    setDescription(Description);
    setImageFile(ImageFile);
    // console.log("alldata,sss",Name,condition,Gendre,Age,Description,imagePhoto)
  };

  const getDataForthings = (Type, Description, ImageFile) => {
    setDescription(Description);
    setImageFile(ImageFile);
    setType(Type);
  };

  // const handlePostSubmit = async (e) => {
  //   e.preventDefault();

  //   setReserr("");
  //   setmsg(false);

  //   let userData;
  //   if (checkLostPeapleOrThing) {
  //     userData = {
  //       UserId: "",
  //       PhoneNumber,
  //       City,
  //       IsSearcher,
  //       MissigDate,
  //       Town,
  //       Name,
  //       Condition,
  //       Gendre,
  //       Age,
  //       Description,
  //       ImageFile,
  //     };
  //   } else {
  //     userData = {
  //       UserId: "",
  //       PhoneNumber,
  //       City,
  //       IsSearcher,
  //       MissigDate,
  //       Town,
  //       Type,
  //       Description,
  //       ImageFile,
  //     };
  //   }
  //   try {
  //     let formData;
  //     formData = new FormData();
  //     for (const key in userData) {
  //       // formData.append(key, userData[key]);

  //       if (key == "ImageFile") {
  //         if (userData[key] !== "") {
  //           formData.append(key, userData[key], userData[key].name);
  //         }
  //       } else {
  //         formData.append(key, userData[key]);
  //       }
  //     }
  //     await axios
  //       .post(
  //         `${checkLostPeapleOrThing ? AddPostPeople : AddPostThings}`,
  //         formData,
  //         {
  //           headers: {
  //             "Accept-Language": "ar-EG",
  //             Authorization: "Bearer " + Token,
  //           },
  //         }
  //       )
  //       .then((response) => {
  //         console.log(response);
  //         if (response.data.isSuccess) {
  //           setmsg(true);
  //           setsuccesOrFAIL("تم عمل المنشور بنجاح ");
  //           setErrForImg(true);

  //           setInterval(() => {
  //             window.location.pathname = "/HomePage";
  //           }, 1000);
  //         } else {
  //           setReserr(response.data.data[0]);
  //         }
  //       });
  //   } catch (err) {
  //     console.log("111", err);
  //     if (
  //       (City == "" ||
  //         Town == "" ||
  //         Gendre == "" ||
  //         Condition == "" ||
  //         Description == "") &&
  //       checkLostPeapleOrThing
  //     ) {
  //       setmsg(true);
  //       console.log("111");
  //       setsuccesOrFAIL("ادخل جميع الحقول");
  //     } else if (
  //       (City == "" || Town == "" || Type == "" || Description == "") &&
  //       checkLostPeapleOrThing == false
  //     ) {
  //       setmsg(true);
  //       console.log("22");
  //       setsuccesOrFAIL("ادخل جميع الحقول");
  //     }
  //   }
  // };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
  
    setReserr("");
    setmsg(false);
  
    try {
      const formData = new FormData();
  
      formData.append("PhoneNumber", PhoneNumber);
      formData.append("IncidentTime", new Date(MissigDate).toISOString());
      formData.append("ReportType", IsSearcher ? 0 : 1);
      formData.append("ReportSubjectType", checkLostPeapleOrThing ? 1 : 2);
      formData.append("CenterId", Town);
      formData.append("GovernmentId", City);
  
      if (checkLostPeapleOrThing) {
        formData.append("PersonName", Name);
        formData.append("Gender", Gendre);
        formData.append("Age", Age);
        formData.append("Description", Description);
        formData.append("State", Condition);
      } else {
        formData.append("ThingType", Type);
        formData.append("ThingDescription", Description);
        formData.append("ThingState", 1);
      }
  
      if (ImageFile) {
        formData.append("Image", ImageFile, ImageFile.name);
      }
  
      const response = await axios.post(`${AddPostPeople}`, formData, {
        headers: {
          Authorization: `Bearer ${Token}`,
          "Accept-Language": "ar-EG",
        },
      });
  
      console.log("Full API Response:", response);
  
      // Handle Success Case
      if (response.data.succeeded) {
        console.log("Post created successfully with ID:", response.data.data);
        setmsg(true);
        setsuccesOrFAIL("تم عمل المنشور بنجاح ✅");
        setErrForImg(true);
  
        setTimeout(() => {
          window.location.pathname = "/HomePage";
        }, 1000);
      } 
      // Handle API returned Validation Errors
      else if (response.data.errors) {
        console.log("Validation Errors:", response.data.errors);
        const firstErrorField = Object.keys(response.data.errors)[0];
        const firstErrorMessage = response.data.errors[firstErrorField][0];
        setReserr(firstErrorMessage);
        setmsg(true);
        setsuccesOrFAIL(firstErrorMessage);
      }
      // Any other unexpected case
      else {
        console.log("Unexpected Error Response:", response.data);
        setReserr("حدث خطأ غير متوقع");
        setmsg(true);
        setsuccesOrFAIL("حدث خطأ غير متوقع ❗");
      }
  
    } catch (err) {
      // Catching Network Errors or Axios Errors
      console.error("Axios Network Error:", err);
  
      if (err.response && err.response.data && err.response.data.errors) {
        const firstErrorField = Object.keys(err.response.data.errors)[0];
        const firstErrorMessage = err.response.data.errors[firstErrorField][0];
        console.log("Caught Validation Error:", firstErrorMessage);
        setReserr(firstErrorMessage);
        setmsg(true);
        setsuccesOrFAIL(firstErrorMessage);
      } else {
        console.log("Caught Unknown Error:", err);
        setReserr("حدث خطأ أثناء الاتصال بالخادم");
        setmsg(true);
        setsuccesOrFAIL("حدث خطأ أثناء الاتصال بالخادم ❗");
      }
    }
  };
  
  
  // console.log("v",PhoneNumber,City,IsSearcher,MissigDate,Town,Name,Condition,Gendre,Age,Description,imagePhoto)
  return (
    <>
      {msg && (
        <SuccessOrFailMsg
          succesOrFAIL={succesOrFAIL}
          ErrForImg={ErrForImg}
          setmsg={setmsg}
        />
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "center", md: "space-between" },
          alignItems: "flex-start",
          flexDirection: "row-reverse",
          padding: { xs: "1rem 10px", md: "1rem" },
        }}
      >
        <Link to="/HomePage">
          <Typography
            sx={{
              backgroundColor: "#EBEBEB",
              width: { xs: "30px", md: "50px" },
              height: { xs: "30px", md: "50px" },
              padding: "13px, 12px, 12px, 13px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50%",
              textAlign: "center",
              lineHeight: "50px",
              fontSize: { xs: "15px", md: "24px" },
              fontWeight: "500",
            }}
          >
            X
          </Typography>
        </Link>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: { xs: "30px", md: "50px" },
            width: { xs: "80%", md: "100%" },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "20px", md: "27px" },
              fontWeight: "400",
              lineHeight: { xs: "100px", md: "51px" },
              letterSpacing: "0em",
              textAlign: "left",
            }}
          >
            إنشاء بلاغ عن مفقود
          </Typography>
          <Typography
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row-reverse",
            }}
          >
            <Typography
              sx={{
                width: { xs: "30px", md: "50px" },
                height: { xs: "30px", md: "50px" },
                padding: " 8px, 0px, 8px, 0px",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                backgroundColor: "#FFB86D",
                textAlign: "center",
                lineHeight: "50px",
              }}
            >
              1
            </Typography>
            <Typography
              sx={{
                display: "block",
                width: "162px",
                height: "1px",
                backgroundColor: "#DDDDDD",
                position: "relative",
                top: { xs: "15px", md: "20px" },
              }}
            ></Typography>
            <Typography
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: { xs: "30px", md: "50px" },
                height: { xs: "30px", md: "50px" },
                padding: " 8px, 0px, 8px, 0px",
                borderRadius: "50%",
                color: "#000",
                backgroundColor: "#F1F4FC",
                textAlign: "center",
                lineHeight: "50px",
              }}
            >
              2
            </Typography>
          </Typography>
          <Typography
            sx={{
              borderRadius: "25px",
              border: "2px solid #B08BFF",
              padding: { xs: "5px 10px", md: "10px 45px" },
              fontSize: { xs: "16px", md: "20px" },
              fontWeight: "400",
              cursor: "pointer",
              color: "#000",
            }}
          >
            {" "}
            أدخل بياناتك للتواصل معك{" "}
          </Typography>
        </Box>

        <Avatar
          alt="Remy Sharp"
          sx={{
            width: { xs: "30px", md: "50px" },
            height: { xs: "30px", md: "50px" },
            objectFit: "cover",
          }}
          src={profile ? profile : userProfile}
        />
      </Box>

      <Box component="form" onSubmit={handlePostSubmit}>
        <ComunicationDetails getData={getData} resErr={resErr} /> 
        <ComunicationaboutLose
          getDataForLosePeople={getDataForLosePeople}
          getDataForthings={getDataForthings}
          getcheckLostPeapleOrThing={getcheckLostPeapleOrThing}
        />
        <Box sx={{ padding: "1rem" }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              padding: "10px 40px",
              fontWeight: "700",
              fontSize: { xs: "15px", md: "20px" },
              borderRadius: "20px",
              width: { md: "20%", xl: "15%" },
            }}
          >
            عمل منشور
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default MainCreatePost;
