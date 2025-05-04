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
import { Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Paper, Chip, Divider } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

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
  // console.log("inputpost = ",data);

  const [isHidden, setIsHidden] = useState(false);
  const [isPinnedMsg, setIsPinnedMsg] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false); // State for the details dialog
  
  // Function to format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return "غير محدد";
    return new Date(dateString).toLocaleDateString('ar-EG');
  };

  // This will give you the current URL
  const postId = data.id;
  const isPeople = data.isPeople;
  const cookies = Cookie();
  const token = cookies.get("Cookie");

  const [isPinned, setIsPinned] = useState(false); // State to track if the post is pinned

  // Toggle the details dialog
  const handleDetailsClick = () => {
    setOpenDetailsDialog(true);
  };

  // Close the details dialog
  const handleCloseDialog = () => {
    setOpenDetailsDialog(false);
  };

  const togglePinPost = async () => {
    try {
      const pinStatus = isPinned ? "UnPinPost" : "PinPost";
      await axios.post(
        ` http://hopesystem.runasp.net/api/Reports/${pinStatus}`,
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
  const getReportLabelAndColor = (data) => {
    if (data.reportType === 0) {
      if (data.missingPerson) return { label: "بلاغ عن مفقود شخص", color: "#2E74FD" }; // أزرق
      if (data.missingThing) return { label: "بلاغ عن مفقود شيء", color: "#2E74FD" };
      return { label: "بلاغ عن مفقود", color: "#2E74FD" };
    } else {
      if (data.missingPerson) return { label: "بلاغ عن إيجاد شخص", color: "#4CAF50" }; // أخضر
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

  return (
    <Box style={{ position: "relative" }}>
      {/* {isHidden && (
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
      )} */}
      <Card
        sx={{
          width: { xs: "290px", sm: "520px", md: "321px", xl: "421px" },
          height: { xl: "650px" },
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
          <Typography sx={{ color: color, fontWeight: "600", fontSize: "20px" }}>
            {label}
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

          {/* زر عرض التفاصيل الجديد */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleDetailsClick}
              endIcon={<InfoIcon />}
              sx={{ 
                borderRadius: "30px", 
                paddingX: "30px",
                backgroundColor: "#A6C0FE",
                '&:hover': {
                  backgroundColor: "#8BA8E5",
                }
              }}
            >
              عرض التفاصيل
            </Button>
          </Box>
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
              backgroundColor: "#B7B6BE",
              textAlign: "center",
              padding: "2px",
              border: "1px solid rgba(255, 255, 255, 0.5)",
            }}
          >
            <img src={chatIcon} alt="" />
          
             <IconButton
              onClick={() => {
                // استخدام الرابط الصحيح للمشاركة
                const shareUrl = `http://hopesystem.runasp.net/api/Reports/${data.id}`;
                
                // التحقق من دعم واجهة مشاركة الويب
                if (navigator.share) {
                  navigator.share({
                    title: "مشاركة بلاغ",
                    url: shareUrl,
                  })
                  .catch((error) => console.log('خطأ في المشاركة:', error));
                } else {
                  // بديل للمتصفحات التي لا تدعم واجهة مشاركة الويب
                  navigator.clipboard.writeText(shareUrl)
                    .then(() => alert("تم نسخ الرابط بنجاح!"))
                    .catch(() => alert("حدث خطأ أثناء نسخ الرابط"));
                }
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

          </IconButton>
         
        </CardActions>
      </Card>

      {/* النافذة المنبثقة لتفاصيل البوست */}
      <Dialog
        open={openDetailsDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        dir="rtl"
        PaperProps={{
          sx: {
            borderRadius: "20px",
            padding: "10px",
            overflowY: "visible"
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            backgroundColor: "#1976d2", 
            color: "white", 
            borderRadius: "10px 10px 0 0",
            textAlign: "center",
            position: "relative",
            py: 2
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            {data.missingPerson ? "تفاصيل بلاغ عن شخص مفقود" : "تفاصيل بلاغ عن شيء مفقود"}
          </Typography>
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              position: "absolute",
              left: 8,
              top: 8,
              color: "white"
            }}
          >
            <ClearIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2, pb: 4 }}>
          <Grid container spacing={3}>
            {/* صورة الشخص/الشيء المفقود */}
            <Grid item xs={12} md={5}>
              <Paper 
                elevation={3} 
                sx={{ 
                  height: "100%", 
                  overflow: "hidden", 
                  borderRadius: "10px",
                  border: "2px solid #e0e0e0" 
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "300px",
                    backgroundImage: `url(http://hopesystem.runasp.net/${data.missingPerson ? data.missingPerson.imagePath : data.missingThing?.imagePath})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "10px"
                  }}
                />
              </Paper>
            </Grid>
            
            {/* معلومات المفقود */}
            <Grid item xs={12} md={7}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  height: "100%", 
                  borderRadius: "10px",
                  backgroundColor: "#f5f5f5" 
                }}
              >
                {/* نوع البلاغ والحالة */}
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={data.missingPerson ? "شخص مفقود" : "شيء مفقود"} 
                    color="primary" 
                    sx={{ 
                      fontSize: "1rem", 
                      px: 2, 
                      py: 2.5,
                      fontWeight: "bold", 
                      mb: 1, 
                      mr: 1 
                    }} 
                  />
                  <Chip 
                    label={renderCondition()} 
                    color="secondary" 
                    sx={{ 
                      fontSize: "1rem", 
                      px: 2, 
                      py: 2.5,
                      fontWeight: "bold",
                      mb: 1 
                    }} 
                  />
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                {/* تفاصيل المفقود */}
                <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
                  {data.missingPerson ? "معلومات الشخص المفقود" : "معلومات الشيء المفقود"}
                </Typography>
                
                {data.missingPerson ? (
                  <Box sx={{ mb: 3 }}>
                    <Typography sx={{ mb: 1 }}>
                      <strong>الاسم:</strong> {data.missingPerson.name || "غير متوفر"}
                    </Typography>
                    <Typography sx={{ mb: 1 }}>
                      <strong>العمر:</strong> {data.missingPerson.age || "غير محدد"} سنة
                    </Typography>
                    <Typography sx={{ mb: 1 }}>
                      <strong>النوع:</strong> {data.missingPerson.gender === 0 ? "ذكر" : "أنثى"}
                    </Typography>
                    
                    <Typography sx={{ mb: 1 }}>
                      <strong>الوصف:</strong> {data.missingPerson.description || "لا يوجد وصف"}
                    </Typography>
                   
                  </Box>
                ) : data.missingThing ? (
                  <Box sx={{ mb: 3 }}>
                    <Typography sx={{ mb: 1 }}>
                      <strong>نوع الشيء:</strong> {data.missingThing.type || "غير محدد"}
                    </Typography>
                   
                    <Typography sx={{ mb: 1 }}>
                      <strong>الوصف:</strong> {data.missingThing.description || "لا يوجد وصف"}
                    </Typography>
                   
                  </Box>
                ) : (
                  <Typography>لا توجد معلومات محددة</Typography>
                )}
                
                <Divider sx={{ mb: 2 }} />
                
                {/* معلومات الحادثة */}
                <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
                  معلومات الحادثة
                </Typography>
                
                <Box>
                  <Typography sx={{ mb: 1 }}>
                    <strong>المحافظة:</strong> {data.government?.nameAr || "غير محدد"}
                  </Typography>
                  <Typography sx={{ mb: 1 }}>
                    <strong>المركز:</strong> {data.center?.nameAr || "غير محدد"}
                  </Typography>
                  
                  <Typography sx={{ mb: 1 }}>
                    <strong>تاريخ الحادثة:</strong> {new Date(data.incidentTime).toLocaleDateString('ar-EG')}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            {/* معلومات الاتصال */}
            <Grid item xs={12}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  borderRadius: "10px",
                  background: "linear-gradient(to right, #e8f5e9, #f1f8e9)"
                }}
              >
                <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
                  معلومات الاتصال
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    {/* <Typography sx={{ mb: 1 }}>
                      <strong>اسم المبلغ:</strong> {data.userName || "غير متوفر"}
                    </Typography> */}
                    <Typography sx={{ mb: 1 }}>
                      <strong>رقم الهاتف:</strong> {data.phoneNumber || "غير متوفر"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography sx={{ mb: 1 }}>
                      <strong>البريد الإلكتروني:</strong> {data.email || "غير متوفر"}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            {/* ملاحظات إضافية */}
            {data.note && (
              <Grid item xs={12}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 3, 
                    borderRadius: "10px",
                    background: "#fff8e1"
                  }}
                >
                  <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
                    ملاحظات إضافية
                  </Typography>
                  <Typography>
                    {data.note || "لا توجد ملاحظات إضافية"}
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          {/* زر الاتصال */}
          <Button
            variant="contained"
            color="success"
            sx={{
              borderRadius: "30px",
              px: 4,
              py: 1,
              fontWeight: "bold",
              boxShadow: "0 4px 10px rgba(76, 175, 80, 0.3)",
              "&:hover": {
                boxShadow: "0 6px 15px rgba(76, 175, 80, 0.4)",
              }
            }}
            onClick={() => window.location.href = `tel:${data.phoneNumber}`}
            disabled={!data.phoneNumber}
          >
            الاتصال بالمبلغ
          </Button>
          
          {/* زر مشاركة */}
          {/* <Button
            variant="contained"
            color="primary"
            sx={{
              borderRadius: "30px",
              px: 4,
              py: 1,
              fontWeight: "bold",
              boxShadow: "0 4px 10px rgba(25, 118, 210, 0.3)",
              "&:hover": {
                boxShadow: "0 6px 15px rgba(25, 118, 210, 0.4)",
              }
            }}
            onClick={() => {
              window.navigator.share({
                title: "SharedPost",
                url: `https://hope3221-001-site1.btempurl.com/post/${
                  data.id
                }/${JSON.parse(data.isPeople)}`,
              });
            }}
          >
            مشاركة البلاغ
          </Button> */}
          
          {/* زر إغلاق */}
          <Button
            variant="outlined"
            sx={{
              borderRadius: "30px",
              px: 4,
              py: 1,
              fontWeight: "bold",
            }}
            onClick={handleCloseDialog}
          >
            إغلاق
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Post;