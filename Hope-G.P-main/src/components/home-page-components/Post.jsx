import axios from "axios";
import Cookie from "cookie-universal";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Box, CardContent } from "@mui/material";
import { Typography ,Button } from "@mui/material";

// import PostedPerson from "../../assets/person.png";
import shareIcon from "../../assets/shareicon.png";
import pushIcon from "../../assets/pin icon.png";
import pined from "../../assets/pined.png";
import chatIcon from "../../assets/chat.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import { HidePost, DeletePost } from "../../apiRequests/apiRequest";

// import postImg from "../../assets/post-1.jpg";

const Post = ({ data, onClick, navigateToUserProfile }) => {
  // Get role from sessionStorage
  const role = sessionStorage.getItem("role");
  console.log("inputpost = ",data);
  
  const [isHidden, setIsHidden] = useState(false);
  const [isPinnedMsg, setIsPinnedMsg] = useState(false);

  // This will give you the current URL
  const postId = data.id; 
  const isPeople = data.isPeople;
  const cookies = Cookie();
  const token = cookies.get("Cookie");

  const [isPinned, setIsPinned] = useState(false); // State to track if the post is pinned

  const togglePinPost = async () => {
    try {
      const pinStatus = isPinned ? "UnPinPost" : "PinPost";
      await axios.post(
        `https://hope3221-001-site1.btempurl.com/api/Posts/${pinStatus}`,
        {
          userId: "string",
          postId: postId,
          IsPeople: isPeople,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsPinned((prev) => !prev);
      setIsPinnedMsg(true); // Set the state to true after successfully hiding the post
      setTimeout(() => {
        setIsPinnedMsg(false); // Reset the state after 1 second
      }, 1000);
    } catch (error) {
      console.error("Error pinning/unpinning post:", error);
    }
  };

  const hidePost = async () => {
    try {
      await axios.post(
        HidePost,
        {
          userId: "string",
          postId: postId,
          IsPeople: isPeople,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsHidden(true); // Set the state to true after successfully hiding the post
      setTimeout(() => {
        setIsHidden(false); // Reset the state after 1 second
      }, 1000);
      // Reload the homepage
      window.location.reload();
    } catch (error) {
      console.error("Error pinning/unpinning post:", error);
    }
  };
  // Function to handle clicks on the post body
  const handleBodyClick = (event) => {
    // Prevent the event from bubbling up to the parent Card component
    event.stopPropagation();
    // Call the onClick function passed from the parent component
    onClick();
  };

  //admin delete post
  const handleDeletePost = async () => {
    try {
      // Send a DELETE request to the API endpoint
      await axios.delete(`${DeletePost}`, {
        data: {
          postId: data.id, // Assuming data.id contains the postId
          isPeople: data.isPeople, // Assuming data.isPeople indicates if it's a people post
        },
      });
      // Handle success, such as reloading the page or updating the UI
      // Reload the homepage
      window.location.reload();
    } catch (error) {
      // Handle error, such as displaying an error message
      console.error("Error deleting post:", error);
    }
  };

  const renderCondition = () => {
    if (data.condition === "Losties") {
      return "مفقود";
    } else if (data.condition === "Accidents") {
      return "حوادث";
    } else if (data.condition === "Shelters") {
      return "ملاجئ";
    } else {
      return "اشياء";
    }
  };

  return (
    <Box style={{ position: "relative" }}>
      {isHidden && (
        <Box
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999, // Set a high z-index to ensure it appears above other content
            background: "rgba(0, 255, 0, 0.5)",
            padding: "10px",
          }}
        >
          تم اخفاء المنشور بنجاح
        </Box>
      )}
      {isPinnedMsg && (
        <Box
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999, // Set a high z-index to ensure it appears above other content
            background: "rgba(0, 255, 0, 0.5)",
            padding: "10px",
          }}
        >
          تم تثبيت المنشور بنجاح
        </Box>
      )}
      <Card
        sx={{
          width: { xs: "290px", sm: "520px", md: "321px", xl: "421px" },
          height: { xl: "583px" },
          direction: "rtl",
          margin: { xs: "20px auto", md: "0px auto", xl: "0px auto" },
          borderRadius: "20px",
          backgroundImage: `url(${data.imageUrl})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          position: "relative",
        }}
      >
        {/* <CardContent sx={{ height: { xs: "320px", md: "350px", xl: "490px" } }}>
          {}
          <CardHeader
            sx={{ padding: "0" }}
            avatar={
              <Link to={`/profile/${data.userId}`}>
                <Avatar
                  src={data.userImage}
                  alt="PostedPerson"
                  sx={{
                    marginRight: 0,
                    marginLeft: "15px",
                    width: "65px",
                    height: "65px",
                    marginBottom: "10px",
                  }}
                />
              </Link>
            }
            action={
              <Box
                sx={{
                  height: "50px",
                  width: "50px",
                  borderRadius: "50%",
                 
                  backgroundColor: "#B7B6BE",
                  textAlign: "center",
                  padding: "2px",
                }}
              >
                <IconButton onClick={hidePost}>
                  <ClearIcon sx={{ fontSize: "30px", color: "#fff" }} />
                </IconButton>
              </Box>
            }
          />
          <Box onClick={handleBodyClick}>
            <Box sx={{ height: "calc(583px - 200px)" }}>
              <span
                style={{
                  // marginRight: "30px",
                  marginTop: "10px",
                  fontSize: "17px",
                  fontWeight: "600",
                }}
              >
                {data.userName}
              </span>
            </Box>
            <Box
              sx={{
                position: "absolute",
                top: 100,
                left: 0,
                width: "80px",
                height: "40px",
                backgroundColor: "#A6C0FE",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p style={{ fontWeight: "600", color: "#fff", fontSize: "25px" }}>
                {renderCondition()}
              </p>
            </Box>
          </Box>
        </CardContent> */}
<Box
    sx={{
      width: "100%",
      height: { xs: "200px", md: "250px" },
      backgroundImage: `url(http://hopesystem.runasp.net/${data.missingPerson ? data.missingPerson.imagePath : data.missingThing?.imagePath})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  />

  <CardContent sx={{ padding: "20px" }}>
    {/* اسم النوع */}
    <Typography
      variant="h6"
      sx={{
        fontWeight: "bold",
        fontSize: { xs: "18px", md: "22px" },
        textAlign: "center",
        color: "#1976d2",
        marginBottom: "10px",
      }}
    >
      {data.missingPerson ? "بلاغ عن مفقود" : data.missingThing ? "بلاغ عن شيء مفقود" : "بلاغ"}
    </Typography>

    {/* معلومات البوست */}
    <Box sx={{ marginBottom: 1 }}>
      {data.missingPerson ? (
        <>
          <Typography>الاسم: <strong>{data.missingPerson.name || "غير متوفر"}</strong></Typography>
          <Typography>العمر: <strong>{data.missingPerson.age || "غير محدد"}</strong> سنة</Typography>
          <Typography>الوصف: <strong>{data.missingPerson.description || "لا يوجد وصف"}</strong></Typography>
        </>
      ) : data.missingThing ? (
        <>
          <Typography>نوع الشيء: <strong>{data.missingThing.type || "غير محدد"}</strong></Typography>
          <Typography>الوصف: <strong>{data.missingThing.description || "لا يوجد وصف"}</strong></Typography>
        </>
      ) : (
        <Typography>لا توجد معلومات محددة</Typography>
      )}
    </Box>

    {/* معلومات اضافية */}
    <Box sx={{ marginBottom: 2 }}>
      <Typography>المحافظة: {data.government?.nameAr || "غير محدد"}</Typography>
      <Typography>المركز: {data.center?.nameAr || "غير محدد"}</Typography>
      <Typography>رقم الهاتف: {data.phoneNumber || "غير متوفر"}</Typography>
      <Typography>تاريخ الحادثة: {new Date(data.incidentTime).toLocaleDateString('ar-EG')}</Typography>
    </Box>

    {/* زر التفاصيل أو الإجراءات */}
    {/* <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        marginTop: "10px",
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={handleBodyClick}
        sx={{ borderRadius: "30px", paddingX: "30px" }}
      >
        عرض التفاصيل
      </Button>
    </Box> */}
  </CardContent>
        <CardActions
          sx={{
            justifyContent: "space-around",
            gap: "10px",
          }}
        >
          {role === "Admin" && (
            <Box
              sx={{
                position: "absolute",
                top: 250,
                right: 0,
                width: "80px",
                height: "70px",
                backgroundColor: "#A6C0FE",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "15px 0 0 15px",
                cursor: "pointer",
              }}
              onClick={handleDeletePost}
            >
              <DeleteOutlineIcon sx={{ fontSize: "45px", color: "#fff" }} />
            </Box>
          )}
          <IconButton
            sx={{
              height: { xs: "60px", sm: "80px", md: "50px", xl: "60px" },
              width: { xs: "60px", sm: "80px", md: "80px", xl: "100px" },
              borderRadius: "50px",
              // background:
              //   "linear-gradient(to right, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.4))",
              backgroundColor: "#B7B6BE",
              textAlign: "center",
              padding: "2px",
              border: "1px solid rgba(255, 255, 255, 0.5)",
            }}
          >
            <img src={chatIcon} alt="" />
          </IconButton>
          <IconButton
            onClick={togglePinPost}
            sx={{
              height: { xs: "60px", sm: "80px", md: "50px", xl: "60px" },
              width: { xs: "60px", sm: "80px", md: "80px", xl: "100px" },
              borderRadius: "50px",
              // background:
              //   "linear-gradient(to right, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.4))",
              backgroundColor: isPinned ? "#A6C0FE" : "#B7B6BE",
              textAlign: "center",
              padding: "2px",
              border: "1px solid rgba(255, 255, 255, 0.5)",
            }}
          >
            <img src={isPinned ? pined : pushIcon} alt="" />
          </IconButton>
          <IconButton
            onClick={() => {
              window.navigator.share({
                title: "SharedPost",
                url: `https://hope3221-001-site1.btempurl.com/post/${
                  data.id
                }/${JSON.parse(data.isPeople)}`,
              });
            }}
            sx={{
              height: { xs: "60px", sm: "80px", md: "50px", xl: "60px" },
              width: { xs: "60px", sm: "80px", md: "80px", xl: "100px" },
              borderRadius: "50px",
              backgroundColor: "#B7B6BE",
              textAlign: "center",
              padding: "2px",
              border: "1px solid rgba(255, 255, 255, 0.5)",
            }}
          >
            <img src={shareIcon} alt="" />
          </IconButton>
        </CardActions>
      </Card>
    </Box>
  );
};

export default Post;
