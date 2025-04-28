import { Box, Typography, Card, CardContent, CardMedia, Grid, Divider, CircularProgress, IconButton } from "@mui/material"; 


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookie from "cookie-universal";
import HomeIcon from '@mui/icons-material/Home';

const BASE_IMAGE_URL = "http://hopesystem.runasp.net/";
const DEFAULT_IMAGE = "/assets/person-not-found-default.png";
const cookies = Cookie();
const token = cookies.get("Cookie");

const PostDetails = () => {
  const { id } = useParams();
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://hopesystem.runasp.net/api/Reports/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPostData(response.data.data);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("خطأ أثناء تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const getImageUrl = () => {
    if (postData.missingPerson?.imagePath) {
      return `${BASE_IMAGE_URL}${postData.missingPerson.imagePath}`;
    }
    if (postData.missingThing?.imagePath) {
      return `${BASE_IMAGE_URL}${postData.missingThing.imagePath}`;
    }
    return DEFAULT_IMAGE;
  };

  return (
    <>
      {/* Navbar */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 20px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          position: "sticky",
          top: 0,
          zIndex: 1100,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={() => navigate('/HomePage')} size="large">
            <HomeIcon sx={{ fontSize: 30, color: "primary.main" }} />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img src="/src/assets/Hope-Logo.png" alt="Logo" style={{ width: "100px", objectFit: "contain" }} />
        </Box>
      </Box>

      {/* Post Details */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5, mb: 5, px: 2 }}>
        <Card sx={{ maxWidth: 1200, width: "100%", boxShadow: 5, borderRadius: 4, overflow: "hidden" }}>
          <Grid container spacing={0}>
            <Grid item xs={12} md={6}>
              <CardMedia
                component="div"
                sx={{
                  height: { xs: 250, md: "100%" },
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundImage: `url(${getImageUrl()})`,
                  minHeight: { md: 500 },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h5" color="primary" gutterBottom>
                  تفاصيل البلاغ
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body1" sx={{ mb: 1 }}>
                  <b>رقم الهاتف:</b> {postData.phoneNumber || "غير متوفر"}
                </Typography>

                <Typography variant="body1" sx={{ mb: 1 }}>
                  <b>وقت الحادث:</b> {new Date(postData.incidentTime).toLocaleString()}
                </Typography>

                <Typography variant="body1" sx={{ mb: 1 }}>
                  <b>مركز البلاغ:</b> {postData.center?.nameAr || "غير متوفر"}
                </Typography>

                <Typography variant="body1" sx={{ mb: 1 }}>
                  <b>المحافظة:</b> {postData.government?.nameAr || "غير متوفر"}
                </Typography>

                {postData.missingPerson && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" color="secondary" gutterBottom>
                      بيانات الشخص المفقود:
                    </Typography>
                    <Typography variant="body1"><b>الاسم:</b> {postData.missingPerson.name}</Typography>
                    <Typography variant="body1"><b>النوع:</b> {postData.missingPerson.gender === 0 ? "ذكر" : "أنثى"}</Typography>
                    <Typography variant="body1"><b>العمر:</b> {postData.missingPerson.age} سنة</Typography>
                    <Typography variant="body1"><b>الوصف:</b> {postData.missingPerson.description}</Typography>
                  </>
                )}

                {postData.missingThing && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" color="secondary" gutterBottom>
                      بيانات الشيء المفقود:
                    </Typography>
                    <Typography variant="body1"><b>النوع:</b> {postData.missingThing.type}</Typography>
                    <Typography variant="body1"><b>الوصف:</b> {postData.missingThing.description}</Typography>
                  </>
                )}
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </>
  );
};

export default PostDetails;
