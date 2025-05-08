import axios from "axios";
import Cookie from "cookie-universal";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import { Box, CardContent } from "@mui/material";
import { Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Paper, Chip, Divider, TextField, CircularProgress } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import CommentIcon from "@mui/icons-material/Comment";
import SendIcon from "@mui/icons-material/Send";

// import PostedPerson from "../../assets/person.png";
import shareIcon from "../../assets/shareicon.png";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DeletePost } from "../../apiRequests/apiRequest";

const Post = ({ data, onClick, navigateToUserProfile, onEdit }) => {
  // Get role from sessionStorage
  const role = sessionStorage.getItem("role");
  const userId = sessionStorage.getItem("userId");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false); // State for the details dialog
  const [openCommentsDialog, setOpenCommentsDialog] = useState(false); // State for the comments dialog
  const [comments, setComments] = useState([]); // State for comments
  const [newComment, setNewComment] = useState(""); // State for new comment
  const [isLoadingComments, setIsLoadingComments] = useState(false); // Loading state
  const navigate = useNavigate();
  
  // Function to format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return "غير محدد";
    return new Date(dateString).toLocaleDateString('ar-EG');
  };

  // Format date and time for comments 
  const formatDateTime = (dateString) => {
    if (!dateString) return "غير محدد";
    const date = new Date(dateString);
    return `${date.toLocaleDateString('ar-EG')} ${date.toLocaleTimeString('ar-EG')}`;
  };

  // This will give you the current URL
  const postId = data.id;
  const isPeople = data.isPeople;
  const cookies = Cookie();
  const token = cookies.get("Cookie");

  // Toggle the details dialog
  const handleDetailsClick = () => {
    setOpenDetailsDialog(true);
  };

  // Close the details dialog
  const handleCloseDialog = () => {
    setOpenDetailsDialog(false);
  };

  // Handle edit post
  const handleEditPost = () => {
    // Navigate to edit post page or call edit function
    if (onEdit) {
      onEdit(data);
    } else {
      // Fallback if onEdit prop is not provided
      navigate(`/edit-post/${data.id}/${data.isPeople}`);
    }
  };

  // Handle comments button click
  const handleCommentsClick = async () => {
    setOpenCommentsDialog(true);
    await fetchComments();
  };

  // Close comments dialog
  const handleCloseCommentsDialog = () => {
    setOpenCommentsDialog(false);
  };

  // // Fetch comments for the post
  // const fetchComments = async () => {
  //   setIsLoadingComments(true);
  //   try {
  //     const response = await axios.get(`http://hopesystem.runasp.net/api/Comments/report/${data.id}`);
  //     setComments(response.data);
  //   } catch (error) {
  //     console.error("Error fetching comments:", error);
  //   } finally {
  //     setIsLoadingComments(false);
  //   }
  // };
  
  const fetchComments = async () => {
    setIsLoadingComments(true);
    try {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjFlNGZjMzI3LTc2ZjMtNDZlOC04ZDlkLTllMDAzNjg2ZjcwNyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJhbGFteXJheW1hbjcyMkBnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJhbGFteXJheW1hbjcyMkBnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9naXZlbm5hbWUiOiJhbWlyIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvc3VybmFtZSI6Itin2YTYp9mF2YrYsSDYp9mK2YXZhiAgICIsImV4cCI6MTc0NzMwOTI5NCwiaXNzIjoiaHR0cHM6Ly9Ib3BlLmNvbSIsImF1ZCI6Imh0dHBzOi8vSG9wZS5jb20ifQ.7UwKr3wS8Em-_aNUDPfmmGDbaYKBqsEJa2nF8tc2MhA"; // التوكن اللي كتبته فوق كامل
  
      const response = await axios.get(
        `http://hopesystem.runasp.net/api/Comments/report/${data.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments(response.data.data);

    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };
  

  // Submit new comment
  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      const commentData = {
        reportId: data.id,
        content: newComment,
        userId: userId
      };
      
      await axios.post('http://hopesystem.runasp.net/api/Comments', commentData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Refresh comments
      setNewComment("");
      await fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("حدث خطأ أثناء إرسال التعليق");
    }
  };

  //admin delete post
  const handleDeletePost = async () => {
    try {
      if (window.confirm("هل أنت متأكد من حذف هذا المنشور؟")) {
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
      }
    } catch (error) {
      // Handle error, such as displaying an error message
      console.error("Error deleting post:", error);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    try {
      if (window.confirm("هل أنت متأكد من حذف هذا التعليق؟")) {
        await axios.delete(`http://hopesystem.runasp.net/api/Comments/${commentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        // Refresh comments after deletion
        await fetchComments();
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("حدث خطأ أثناء حذف التعليق");
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

  // Check if user is post owner or admin to show edit/delete buttons
  const isOwnerOrAdmin = role === "Admin" || data.userId === sessionStorage.getItem("userId");

  return (
    <Box style={{ position: "relative" }}>
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
        
        {/* أزرار الإجراءات */}
        <CardActions
          sx={{
            justifyContent: "space-around",
            gap: "10px",
            padding: "10px",
          }}
        >
          {/* زر المشاركة */}
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
              height: { xs: "50px", sm: "60px", md: "50px", xl: "60px" },
              width: { xs: "50px", sm: "60px", md: "50px", xl: "60px" },
              borderRadius: "50px",
              backgroundColor: "#B7B6BE",
              textAlign: "center",
              padding: "2px",
              border: "1px solid rgba(255, 255, 255, 0.5)",
            }}
          >
            <img src={shareIcon} alt="مشاركة" style={{ width: "24px", height: "24px" }} />
          </IconButton>
          
          {/* زر التعليقات */}
          <IconButton
            onClick={handleCommentsClick}
            sx={{
              height: { xs: "50px", sm: "60px", md: "50px", xl: "60px" },
              width: { xs: "50px", sm: "60px", md: "50px", xl: "60px" },
              borderRadius: "50px",
              backgroundColor: "#7986CB",
              textAlign: "center",
              padding: "2px",
              border: "1px solid rgba(255, 255, 255, 0.5)",
              '&:hover': {
                backgroundColor: "#5C6BC0",
              }
            }}
          >
            <CommentIcon sx={{ fontSize: "24px", color: "#fff" }} />
          </IconButton>
          
          {/* أزرار التعديل والحذف (تظهر فقط للمسؤول أو صاحب المنشور) */}
          {isOwnerOrAdmin && (
            <>
              {/* زر تعديل البوست */}
              <IconButton
                onClick={handleEditPost}
                sx={{
                  height: { xs: "50px", sm: "60px", md: "50px", xl: "60px" },
                  width: { xs: "50px", sm: "60px", md: "50px", xl: "60px" },
                  borderRadius: "50px",
                  backgroundColor: "#FFC107",
                  textAlign: "center",
                  padding: "2px",
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                  '&:hover': {
                    backgroundColor: "#e6ac00",
                  }
                }}
              >
                <EditIcon sx={{ fontSize: "24px", color: "#fff" }} />
              </IconButton>
              
              {/* زر حذف البوست */}
              <IconButton
                onClick={handleDeletePost}
                sx={{
                  height: { xs: "50px", sm: "60px", md: "50px", xl: "60px" },
                  width: { xs: "50px", sm: "60px", md: "50px", xl: "60px" },
                  borderRadius: "50px",
                  backgroundColor: "#F44336",
                  textAlign: "center",
                  padding: "2px",
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                  '&:hover': {
                    backgroundColor: "#d32f2f",
                  }
                }}
              >
                <DeleteOutlineIcon sx={{ fontSize: "24px", color: "#fff" }} />
              </IconButton>
            </>
          )}
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
          {/* أزرار التعديل والحذف (تظهر في النافذة المنبثقة) */}
          {isOwnerOrAdmin && (
            <>
              <Button
                variant="contained"
                color="warning"
                startIcon={<EditIcon />}
                sx={{
                  borderRadius: "30px",
                  px: 4,
                  py: 1,
                  fontWeight: "bold",
                  boxShadow: "0 4px 10px rgba(255, 193, 7, 0.3)",
                  "&:hover": {
                    boxShadow: "0 6px 15px rgba(255, 193, 7, 0.4)",
                  }
                }}
                onClick={() => {
                  handleCloseDialog();
                  handleEditPost();
                }}
              >
                تعديل البلاغ
              </Button>
              
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteOutlineIcon />}
                sx={{
                  borderRadius: "30px",
                  px: 4,
                  py: 1,
                  fontWeight: "bold",
                  boxShadow: "0 4px 10px rgba(244, 67, 54, 0.3)",
                  "&:hover": {
                    boxShadow: "0 6px 15px rgba(244, 67, 54, 0.4)",
                  }
                }}
                onClick={() => {
                  handleCloseDialog();
                  handleDeletePost();
                }}
              >
                حذف البلاغ
              </Button>
            </>
          )}
          
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

      {/* نافذة منبثقة للتعليقات */}
      <Dialog
        open={openCommentsDialog}
        onClose={handleCloseCommentsDialog}
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
            backgroundColor: "#7986CB", 
            color: "white", 
            borderRadius: "10px 10px 0 0",
            textAlign: "center",
            position: "relative",
            py: 2
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            التعليقات
          </Typography>
          <IconButton
            onClick={handleCloseCommentsDialog}
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
        
        <DialogContent sx={{ mt: 2, pb: 4, minHeight: "400px" }}>
          {/* حالة التحميل */}
          {isLoadingComments ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* قائمة التعليقات */}
              {comments.length > 0 ? (
                <Box sx={{ mb: 4 }}>
                  {comments.map((comment) => (
                    <Paper
                      key={comment.id}
                      elevation={2}
                      sx={{ 
                        p: 2, 
                        mb: 2, 
                        borderRadius: "10px",
                        backgroundColor: "#f5f5f5",
                        position: "relative"
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Avatar sx={{ mr: 1, bgcolor: "#3f51b5" }}>
                          {comment.user?.firstName?.charAt(0) || "U"}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {comment.user?.firstName} {comment.user?.lastName || ""}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDateTime(comment.createdAt)}
                          </Typography>
                        </Box>
                        
                        {/* زر حذف التعليق (يظهر فقط للمسؤول أو صاحب التعليق) */}
                        {(role === "Admin" || comment.userId === userId) && (
                          <IconButton 
                            size="small" 
                            sx={{ 
                              position: "absolute", 
                              left: 8,
                              top: 8,
                              color: "#F44336" 
                            }}
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                      
                      <Typography sx={{ mt: 2, whiteSpace: "pre-wrap" }}>
                        {comment.content}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Box sx={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center", 
                  height: "200px",
                  flexDirection: "column" 
                }}>
                  <CommentIcon sx={{ fontSize: 60, color: "#bdbdbd", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    لا توجد تعليقات بعد
                  </Typography>
                  <Typography color="text.secondary">
                    كن أول من يعلق على هذا البلاغ
                  </Typography>
                </Box>
              )}
              
              {/* إضافة تعليق جديد */}
              {token ? (
                <Box sx={{ mt: 3 }}>
                  <Paper
                    elevation={3}
                    sx={{ 
                      p: 3, 
                      borderRadius: "10px",
                      background: "linear-gradient(to right, #e8f0fe, #f1f8fe)"
                    }}
                  >
                    <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
                      إضافة تعليق جديد
                    </Typography>
                    
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="اكتب تعليقك هنا..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                    
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<SendIcon />}
                        onClick={handleSubmitComment}
                        disabled={!newComment.trim()}
                        sx={{
                          borderRadius: "30px",
                          px: 4,
                          py: 1,
                          fontWeight: "bold",
                        }}
                      >
                        إرسال
                      </Button>
                    </Box>
                  </Paper>
                </Box>
              ) : (
                <Box sx={{ 
                  mt: 3, 
                  p: 3, 
                  borderRadius: "10px", 
                  backgroundColor: "#f5f5f5",
                  textAlign: "center" 
                }}>
                  <Typography>
                    يرجى <Link to="/login" style={{ color: "#1976d2", fontWeight: "bold" }}>تسجيل الدخول</Link> للتمكن من إضافة تعليق
                  </Typography>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            variant="outlined"
            sx={{
              borderRadius: "30px",
              px: 4,
              py: 1,
              fontWeight: "bold",
            }}
            onClick={handleCloseCommentsDialog}
          >
            إغلاق
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Post;