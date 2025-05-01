import axios from "axios";
import Cookie from "cookie-universal";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Box, CardContent, Modal } from "@mui/material";
import { Typography, Button } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
// import PostedPerson from "../../assets/person.png";
import shareIcon from "../../assets/shareicon.png";
import pushIcon from "../../assets/pin icon.png";
import pined from "../../assets/pined.png";
import chatIcon from "../../assets/chat.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import { HidePost, DeletePost } from "../../apiRequests/apiRequest";

const Post = ({ data, onClick, navigateToUserProfile }) => {
  // Get role from sessionStorage
  const role = sessionStorage.getItem("role");
  const [isHidden, setIsHidden] = useState(false);
  const [isPinnedMsg, setIsPinnedMsg] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  // Modal handling
  const handleOpenDetails = () => setDetailsOpen(true);
  const handleCloseDetails = () => setDetailsOpen(false);
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
      setIsPinnedMsg(true);
      setTimeout(() => {
        setIsPinnedMsg(false);
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
      setIsHidden(true);
      setTimeout(() => {
        setIsHidden(false);
      }, 1000);
      window.location.reload();
    } catch (error) {
      console.error("Error pinning/unpinning post:", error);
    }
  };
  
  const handleBodyClick = (event) => {
    event.stopPropagation();
    onClick();
  };
  
  const handleDeletePost = async () => {
    try {
      await axios.delete(`${DeletePost}`, {
        data: {
          postId: data.id,
          isPeople: data.isPeople,
        },
      });
      window.location.reload();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  
  const getReportLabelAndColor = (data) => {
    if (data.reportType === 0) {
      if (data.missingPerson) return { label: "بلاغ عن مفقود شخص", color: "#2E74FD" };
      if (data.missingThing) return { label: "بلاغ عن مفقود شيء", color: "#2E74FD" };
      return { label: "بلاغ عن مفقود", color: "#2E74FD" };
    } else {
      if (data.missingPerson) return { label: "بلاغ عن إيجاد شخص", color: "#4CAF50" };
      if (data.missingThing) return { label: "بلاغ عن إيجاد شيء", color: "#4CAF50" };
      return { label: "بلاغ عن إيجاد", color: "#4CAF50" };
    }
  };
  
  const { label, color } = getReportLabelAndColor(data);
  
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

  // تنسيق للـ Modal - تم تعديله لإضافة الـ box-shadow وتحسين الشكل
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: '80%', md: '70%' },
    maxWidth: 1000,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '25px',
    overflow: 'hidden',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    direction: 'rtl',
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
            zIndex: 9999,
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
            zIndex: 9999,
            background: "rgba(0, 255, 0, 0.5)",
            padding: "10px",
          }}
        >
          تم تثبيت المنشور بنجاح
        </Box>
      )}
      
      <Card
        sx={{
          width: { xs: "290px", sm: "520px", md: "321px", xl: "380px" },  // تقليل العرض قليلاً
          height: { xl: "250px" },  // تقليل الارتفاع من 583px إلى 480px
          direction: "rtl",
          margin: { xs: "20px auto", md: "0px auto", xl: "0px auto" },
          borderRadius: "20px",
          position: "relative",
        }}
      >
        {/* مربع الصورة */}
        <Box
          sx={{
            width: "100%",
            height: { xs: "180px", md: "200px" },  // تقليل ارتفاع الصورة
            backgroundImage: `url(http://hopesystem.runasp.net/${data.missingPerson ? data.missingPerson.imagePath : data.missingThing?.imagePath})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            
          }}
        />
        
        <CardContent sx={{ padding: "20px" }}>
          <Typography sx={{ 
            color: color, 
            fontWeight: "600", 
            fontSize: "20px", 
            textAlign: "center", 
            marginBottom: "10px" 
          }}>
            {label}
          </Typography>
          
          {/* معلومات البوست */}
          <Box sx={{ marginBottom: 1 }}>
            {data.missingPerson ? (
              <>
                <Typography>الاسم: <strong>{data.missingPerson.name || "غير متوفر"}</strong></Typography>
                <Typography>العمر: <strong>{data.missingPerson.age || "غير محدد"}</strong> سنة</Typography>
                <Typography noWrap>الوصف: <strong>{data.missingPerson.description || "لا يوجد وصف"}</strong></Typography>
              </>
            ) : data.missingThing ? (
              <>
                <Typography>نوع الشيء: <strong>{data.missingThing.type || "غير محدد"}</strong></Typography>
                <Typography noWrap>الوصف: <strong>{data.missingThing.description || "لا يوجد وصف"}</strong></Typography>
              </>
            ) : (
              <Typography>لا توجد معلومات محددة</Typography>
            )}
          </Box>
          
          {/* معلومات اضافية مختصرة */}
          <Box sx={{ marginBottom: 2 }}>
            <Typography>المحافظة: {data.government?.nameAr || "غير محدد"}</Typography>
            <Typography>المركز: {data.center?.nameAr || "غير محدد"}</Typography>
          </Box>
          
          {/* زر التفاصيل */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "5px",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenDetails}
              sx={{ 
                borderRadius: "30px", 
                paddingX: "30px",
                backgroundColor: "#A6C0FE",
                '&:hover': {
                  backgroundColor: "#7A9DF0"
                }
              }}
              startIcon={<InfoIcon />}
            >
              تفاصيل
            </Button>
          </Box>
        </CardContent>
        
        <CardActions
          sx={{
            justifyContent: "space-around",
            gap: "10px",
            padding: "10px 20px 20px",
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
                url: `https://hope3221-001-site1.btempurl.com/post/${data.id}/${JSON.parse(data.isPeople)}`,
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
      
      {/* Modal لعرض تفاصيل البوست */}
<Modal
  open={detailsOpen}
  onClose={handleCloseDetails}
  aria-labelledby="post-details-modal"
  aria-describedby="post-details-description"
>
  <Box sx={modalStyle}>
    {/* عنوان المودال */}
    <Box
      sx={{
        padding: "20px",
        borderBottom: "1px solid #eee",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Typography
        id="post-details-modal"
        variant="h5"
        component="h2"
        sx={{
          fontWeight: "bold",
          color: color,
          textAlign: "center",
        }}
      >
        {label}
      </Typography>
    </Box>

    {/* محتوى المودال */}
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 3, // مسافة بين الصورة والتفاصيل
        flexGrow: 1,
        overflow: "auto",
        padding: "20px",
      }}
    >
      {/* الصورة على الشمال */}
      <Box
        sx={{
          flex: { xs: "none", md: "0 0 35%" },
          maxWidth: { xs: "100%", md: "35%" },
          height: { xs: "300px", md: "400px" },
          backgroundImage: `url(http://hopesystem.runasp.net/${data.missingPerson ? data.missingPerson.imagePath : data.missingThing?.imagePath})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderRadius: "15px",
          boxShadow: 3,
        }}
      />

      {/* التفاصيل على اليمين */}
      <Box sx={{ flex: "1 1 65%", maxWidth: { xs: "100%", md: "65%" } }}>
        {/* البيانات الأساسية */}
        <Box sx={{ mb: 0 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              mb: 2,
              borderBottom: "2px solid #eee",
              pb: 1,
            }}
          >
            البيانات الأساسية
          </Typography>

          {data.missingPerson ? (
            <>
              <Box sx={{ display: "flex", mb: 1.5 }}>
                <Typography sx={{ fontWeight: "bold", ml: 2, minWidth: "100px" }}>الاسم:</Typography>
                <Typography><strong>{data.missingPerson.name || "غير متوفر"}</strong></Typography>
              </Box>

              <Box sx={{ display: "flex", mb: 1.5 }}>
                <Typography sx={{ fontWeight: "bold", ml: 2, minWidth: "100px" }}>العمر:</Typography>
                <Typography><strong>{data.missingPerson.age || "غير محدد"}</strong> سنة</Typography>
              </Box>

              <Box sx={{ display: "flex", mb: 1.5 }}>
                <Typography sx={{ fontWeight: "bold", ml: 2, minWidth: "100px" }}>الوصف:</Typography>
                <Typography><strong>{data.missingPerson.description || "لا يوجد وصف"}</strong></Typography>
              </Box>

              {data.missingPerson.features && (
                <Box sx={{ display: "flex", mb: 1.5 }}>
                  <Typography sx={{ fontWeight: "bold", ml: 2, minWidth: "100px" }}>المميزات:</Typography>
                  <Typography><strong>{data.missingPerson.features}</strong></Typography>
                </Box>
              )}
            </>
          ) : data.missingThing ? (
            <>
              <Box sx={{ display: "flex", mb: 1.5 }}>
                <Typography sx={{ fontWeight: "bold", ml: 2, minWidth: "100px" }}>نوع الشيء:</Typography>
                <Typography><strong>{data.missingThing.type || "غير محدد"}</strong></Typography>
              </Box>

              <Box sx={{ display: "flex", mb: 1.5 }}>
                <Typography sx={{ fontWeight: "bold", ml: 2, minWidth: "100px" }}>الوصف:</Typography>
                <Typography><strong>{data.missingThing.description || "لا يوجد وصف"}</strong></Typography>
              </Box>

              {data.missingThing.brand && (
                <Box sx={{ display: "flex", mb: 1.5 }}>
                  <Typography sx={{ fontWeight: "bold", ml: 2, minWidth: "100px" }}>الماركة:</Typography>
                  <Typography><strong>{data.missingThing.brand}</strong></Typography>
                </Box>
              )}

              {data.missingThing.color && (
                <Box sx={{ display: "flex", mb: 1.5 }}>
                  <Typography sx={{ fontWeight: "bold", ml: 2, minWidth: "100px" }}>اللون:</Typography>
                  <Typography><strong>{data.missingThing.color}</strong></Typography>
                </Box>
              )}
            </>
          ) : (
            <Typography>لا توجد معلومات محددة</Typography>
          )}
        </Box>

        {/* معلومات الموقع والاتصال */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              mb: 2,
              borderBottom: "2px solid #eee",
              pb: 1,
            }}
          >
            معلومات الموقع والاتصال
          </Typography>

          <Box sx={{ display: "flex", mb: 1.5 }}>
            <Typography sx={{ fontWeight: "bold", ml: 2, minWidth: "100px" }}>المحافظة:</Typography>
            <Typography><strong>{data.government?.nameAr || "غير محدد"}</strong></Typography>
          </Box>

          <Box sx={{ display: "flex", mb: 1.5 }}>
            <Typography sx={{ fontWeight: "bold", ml: 2, minWidth: "100px" }}>المركز:</Typography>
            <Typography><strong>{data.center?.nameAr || "غير محدد"}</strong></Typography>
          </Box>

          <Box sx={{ display: "flex", mb: 1.5 }}>
            <Typography sx={{ fontWeight: "bold", ml: 2, minWidth: "100px" }}>العنوان:</Typography>
            <Typography><strong>{data.address || "غير متوفر"}</strong></Typography>
          </Box>

          <Box sx={{ display: "flex", mb: 1.5 }}>
            <Typography sx={{ fontWeight: "bold", ml: 2, minWidth: "100px" }}>رقم الهاتف:</Typography>
            <Typography dir="ltr"><strong>{data.phoneNumber || "غير متوفر"}</strong></Typography>
          </Box>
        </Box>

        {/* معلومات الحادثة */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              mb: 2,
              borderBottom: "2px solid #eee",
              pb: 1,
            }}
          >
            معلومات الحادثة
          </Typography>

          <Box sx={{ display: "flex", mb: 1.5 }}>
            <Typography sx={{ fontWeight: "bold", ml: 2, minWidth: "120px" }}>تاريخ الحادثة:</Typography>
            <Typography><strong>{new Date(data.incidentTime).toLocaleDateString('ar-EG')}</strong></Typography>
          </Box>

          <Box sx={{ display: "flex", mb: 1.5 }}>
            <Typography sx={{ fontWeight: "bold", ml: 2, minWidth: "120px" }}>وقت الحادثة:</Typography>
            <Typography><strong>{new Date(data.incidentTime).toLocaleTimeString('ar-EG')}</strong></Typography>
          </Box>

          {data.missingPerson && (
            <Box sx={{ display: "flex", mb: 1.5 }}>
              <Typography sx={{ fontWeight: "bold", ml: 2, minWidth: "120px" }}>آخر مكان شوهد:</Typography>
              <Typography><strong>{data.missingPerson.lastSeenLocation || "غير متوفر"}</strong></Typography>
            </Box>
          )}
        </Box>

        {/* تم بواسطة */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            sx={{
              color: "gray",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            تم النشر بواسطة: <strong>{data.userName}</strong>
          </Typography>
        </Box>
      </Box>
    </Box>

    {/* زر الإغلاق */}
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        padding: "20px",
        borderTop: "1px solid #eee",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Button
        variant="contained"
        onClick={handleCloseDetails}
        sx={{
          minWidth: "120px",
          backgroundColor: "#B7B6BE",
          "&:hover": {
            backgroundColor: "#9E9DA5",
          },
          borderRadius: "25px",
          fontWeight: "bold",
        }}
      >
        إغلاق
      </Button>
    </Box>
  </Box>
</Modal>

    </Box>
  );
};

export default Post;