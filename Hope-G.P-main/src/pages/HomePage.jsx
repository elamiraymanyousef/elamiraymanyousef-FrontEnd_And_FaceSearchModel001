import { useEffect, useRef, useState } from "react";
import {
  Box,
  IconButton,
  Popover,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
} from "@mui/material";
import {
  GetAllPosts,
  GetPostThings,
  GetPostOfShelters,
  GetPostOfAccidents,
  GetPostOfLosties,
} from "../apiRequests/apiRequest";
import bgImage from "../assets/cover.png";
import CreatePostIcon from "../assets/createPost-icon.png";
import palastine from "../assets/PALAST.jpg";

import Navbar from "../components/home-page-components/Navbar";
import Post from "../components/home-page-components/Post";
import NavigationBar from "../components/home-page-components/NavigationBar";
import Search from "../components/home-page-components/Search.component";
import axios from "axios";
import PostDetails from "../components/home-page-components/PostDetails";
import Notification from "../components/home-page-components/Notification";

import Cookie from "cookie-universal";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

function HomePage() {
  // Function to navigate to user profile
  const navigateToUserProfile = (userId) => {
    // Navigate to the user profile page with userId parameter
    history.push(`/profile/${userId}`);
  };
  //fetch all data state
  const [apiAllData, setApiAllData] = useState([]);
  // Define a state variable to track whether more data is available
  const [moreDataAvailable, setMoreDataAvailable] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  //notification logic
  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNotificationCategory, setSelectedNotificationCategory] =
    useState("incoming");
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Incoming Notification 1", category: "incoming" },
    { id: 2, message: "Outgoing Notification 1", category: "outgoing" },
    { id: 3, message: "Archived Notification 1", category: "archived" },
  ]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  //selected post state to show details
  const [selectedPost, setSelectedPost] = useState(null);
  console.log("selectedPost" + selectedPost);

  const [PageNumber, setPageNumber] = useState(0);
  const hasIncrementedPage = useRef(false);
  const [postsLoading, setPostsLoading] = useState(true);

  // Popup state
  const [isPopupOpen, setIsPopupOpen] = useState(true);

  const toggleSearchVisibility = () => {
    setIsSearchVisible((prev) => !prev);
  };
  //set data to selected
  const handlePostClick = (post) => {
    setSelectedPost(post);
  };
  const handleClosePostDetails = () => {
    setSelectedPost(null);
  };
  //to get token from login page
  const cookies = Cookie();
  const token = cookies.get("Cookie"); // Assuming "Cookie" is the key where the token is stored in cookies
  //fetch all data
  const handleFetchData = async (apiEndpoint, pageNumber) => {
    try {
      const response = await axios.get(
        `${apiEndpoint}&PageNumber=${pageNumber || 1}&pageSize=100`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseData = response.data.data.items;
      console.log(response.data.data.items);

      if (responseData.length === 0) {
        setMoreDataAvailable(false);
      } else {
        // Append new data to existing state
        setApiAllData((prevData) => {
          // Use a Set to avoid duplicates
          const uniqueData = new Set([...prevData, ...responseData]);
          console.log(Array.from(uniqueData));

          return Array.from(uniqueData);
        });
      }
      setPostsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  //handle scroll to get another data
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    // Check if the user has scrolled to the very bottom of the page
    if (scrollTop + clientHeight >= scrollHeight - 1) {
      // Load more posts only if the page number has not been incremented in this scroll event
      if (!hasIncrementedPage.current && moreDataAvailable) {
        setPageNumber((prevPageNumber) => prevPageNumber + 1); // Increment page number
        hasIncrementedPage.current = true; // Set the flag to true to indicate that the page number has been incremented
        setPostsLoading(true);
      }
    } else {
      // Reset the flag when the user scrolls back up
      hasIncrementedPage.current = false;
    }
  };

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsSearchVisible(true);
    }

    if (selectedCategory) {
      const apiEndpoint = getCategoryEndpoint(selectedCategory);
      handleFetchData(apiEndpoint, PageNumber);
    }
    
    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);
    
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [selectedCategory, PageNumber]);

  console.log(PageNumber);
  const getCategoryEndpoint = (category) => {
    // Map category to corresponding API endpoint
    const categoryEndpoints = {
      all: `${GetAllPosts}`, // Include PageNumber in the endpoint
      things: `${GetPostThings}`,
      shelters: `${GetPostOfShelters}`,
      accidents: `${GetPostOfAccidents}`,
      Missing: `${GetPostOfLosties}`,
    };
    return categoryEndpoints[category] || "";
  };
  const handleCategorySelect = (event, category) => {
    console.log("category = ", category);

    setIsOpen(false);
    setApiAllData([]); // Reset apiAllData array
    setPageNumber(0); // Reset PageNumber to 0 when a new category is selected
    setSelectedCategory(category);
  };
  const handleNotificationClose = () => {
    setIsOpen(false);
    setAnchorEl(null);
  };
  const handleNotificationIconClick = (event) => {
    setAnchorEl(event.currentTarget); // Set the anchor element for the popover
    setIsOpen((prev) => !prev); // Toggle the open state
  };
  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;
  const filteredNotifications = notifications.filter(
    (notification) => notification.category === selectedNotificationCategory
  );

  return (
    <Box sx={{ 
      backgroundColor: "#f8f9fa", 
      minHeight: "100vh"
    }}>
      <Dialog
        open={isPopupOpen}
        onClose={(event, reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            setIsPopupOpen(false);
          }
        }}
        PaperProps={{
          sx: {
            borderRadius: 8,
            padding: "0px",
            width: { xs: "95%", md: "60%" },
            margin: "0 10px",
            maxHeight: "465px",
            boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <DialogTitle sx={{ padding: "0" }}>
          <Box
            onClick={() => setIsPopupOpen(false)}
            color="primary"
            sx={{
              width: { xs: "30px", md: "50px" },
              height: { xs: "30px", md: "50px" },
              borderRadius: "50%",
              background: "#EBEBEB",
              color: "#000",
              position: "absolute",
              left: { xs: "10px", md: "20px" },
              cursor: "pointer",
              marginTop: { xs: "8px", md: "20px" },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                background: "#d1d1d1",
              },
            }}
          >
            X
          </Box>
        </DialogTitle>
        <DialogContent
          sx={{
            borderRadius: "0 0 8px 8px", // Apply borderRadius to bottom corners
            padding: "0px", // Remove padding from DialogContent
            overflow: "hidden", // Ensure content stays within rounded corners
          }}
        >
          <Grid container spacing={0}>
            <Grid
              item
              xs={12}
              sm={6}
              sx={{ 
                height: { xs: "500px", md: "465px" },
                position: "relative"
              }}
            >
              <Box
                component="img"
                src={palastine}
                alt="palastine"
                sx={{
                  width: "100%",
                  height: { xs: "60%", md: "100%" },
                  borderBottomLeftRadius: { xs: "200%", md: "0" },
                  objectFit: "cover",
                  transition: "transform 0.5s ease",
                  "&:hover": {
                    transform: { xs: "none", md: "scale(1.05)" },
                  },
                }}
              ></Box>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginTop: { xs: "-250px", md: "0" },
                padding: { xs: "20px", md: "30px" },
                background: "#fff",
              }}
            >
              <Box>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    whiteSpace: "pre-line",
                    textAlign: "center",
                    marginBottom: { xs: "20px", sm: "50px" },
                    fontSize: { xs: "20px", md: "36px" },
                    fontWeight: "600",
                    color: "#373b55",
                    textShadow: "0px 2px 4px rgba(0,0,0,0.1)"
                  }}
                >
                  فلسطيني .....
                </Typography>
                <Typography
                  sx={{
                    whiteSpace: "pre-line",
                    textAlign: "center",
                    fontSize: { xs: "12px", md: "20px" },
                    fontWeight: "300",
                    color: "#555",
                    lineHeight: "1.8",
                  }}
                >
                  ستنتهي الحرب يوما{"\n"}
                  ويعود الزيتون فلسطينيا{"\n"}
                  واللحن عراقيا{"\n"}
                  والبن يمنيا{"\n"}
                  والياسمين سوريا{"\n"}
                  ويعود العز عربيا{"\n"}
                  والنصر إسلاميا
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Box>
        <Navbar
          onNotificationIconClick={handleNotificationIconClick}
          isOpen={isOpen}
          anchorEl={anchorEl}
          onClose={handleNotificationClose}
          onSelectCategory={(category) => handleCategorySelect(event, category)}
          sx={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
        />
        {/* Notification tooltip */}
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleNotificationClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          sx={{ 
            marginTop: "20px",
            "& .MuiPaper-root": {
              borderRadius: "12px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
              overflow: "hidden"
            }
          }}
        >
          <Notification />
        </Popover>
        <Box sx={{ padding: { xs: "10px 10px", md: "10px 50px" } }}>
          <Box
            sx={{
              backgroundImage: `url(${bgImage})`,
              height: { xs: "50vh", md: "85vh" },
              backgroundSize: { xs: "cover", md: "100%" },
              backgroundRepeat: "no-repeat",
              borderRadius: { xs: 5, md: 12 },
              backgroundPosition: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
              },
            }}
          >
            <Box
              sx={{
                height: { xs: "100%", md: "85vh" },
                background:
                  "linear-gradient(to right, rgba(55, 59, 85, 0.85), rgba(196, 196, 196, 0))",
                borderRadius: { xs: 5, md: 12 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
              }}
            >
              <Box
                sx={{
                  textAlign: "left",
                  p: { xs: 2, sm: 5, md: 5, xl: 15 },
                  fontFamily: "defaultFont",
                }}
              >
                <Typography
                  variant="h1"
                  component="h2"
                  sx={{
                    fontSize: { xs: "18px", md: 50, xl: 75 },
                    fontFamily: "defaultFont",
                    color: "#fff",
                    fontWeight: 400,
                    textShadow: "2px 2px 8px rgba(0,0,0,0.3)",
                    animation: "fadeIn 1.5s ease-out",
                    "@keyframes fadeIn": {
                      "0%": {
                        opacity: 0,
                        transform: "translateY(20px)"
                      },
                      "100%": {
                        opacity: 1,
                        transform: "translateY(0)"
                      }
                    }
                  }}
                >
                  Find
                  <span
                    style={{
                      background: "linear-gradient(45deg, #A1C4FD 30%, #C2E9FB 90%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      marginLeft: "10px",
                      fontFamily: "defaultFont",
                      textShadow: "none"
                    }}
                  >
                    Hope
                  </span>
                </Typography>
                <Typography
                  variant="h1"
                  component="h5"
                  sx={{
                    fontSize: { xs: "16px", md: 25, xl: 30 },
                    fontFamily: "defaultFont",
                    color: "#fff",
                    opacity: 0.9,
                    marginTop: "8px",
                    animation: "fadeIn 1.5s ease-out 0.3s both",
                    "@keyframes fadeIn": {
                      "0%": {
                        opacity: 0,
                        transform: "translateY(20px)"
                      },
                      "100%": {
                        opacity: 0.9,
                        transform: "translateY(0)"
                      }
                    }
                  }}
                >
                  to find your lost
                </Typography>
              </Box>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    bottom: { md: 100, xl: -150 },
                    position: "relative",
                    animation: "fadeUp 1s ease-out 0.6s both",
                    "@keyframes fadeUp": {
                      "0%": {
                        opacity: 0,
                        transform: "translateY(30px)"
                      },
                      "100%": {
                        opacity: 1,
                        transform: "translateY(0)"
                      }
                    }
                  }}
                >
                  {isSearchVisible && <Search />}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          position: "relative",
          bottom: 120,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          alignItems: "baseline",
          justifyContent: "center",
          width: "70%",
          margin: "0 auto",
        }}
      >
        <Box
          className="creat"
          sx={{
            backgroundColor: "#fff",
            height: { md: "80px", xl: "101px" },
            width: { md: "240px", xl: "394px" },
            px: "10px",
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50px 50px 0px 0px",
            cursor: "pointer",
            boxShadow: "0 -5px 20px rgba(0,0,0,0.1)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 -8px 25px rgba(0,0,0,0.15)",
            }
          }}
        >
          <Link to="/MainCreatePost" style={{ textDecoration: "none" }}>
            <Button
              sx={{
                backgroundColor: "transparent",
                border: "none",
                fontSize: { md: "16px", xl: "20px" },
                fontWeight: "bold",
                cursor: "pointer",
                color: "#373b55",
                transition: "color 0.3s ease",
                "&:hover": {
                  backgroundColor: "transparent",
                  color: "#506ae4",
                },
              }}
            >
              انشاء منشور جديد
              <Box
                component="img"
                src={CreatePostIcon}
                alt="CreatePostIcon"
                sx={{
                  width: { md: "30px", xl: "50px" },
                  height: { md: "30px", xl: "50px" },
                  marginLeft: "10px",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "rotate(15deg)",
                  },
                }}
              />
            </Button>
          </Link>
        </Box>
        <NavigationBar
          toggleSearchVisibility={toggleSearchVisibility}
          onSelectCategory={(category) => handleCategorySelect(event, category)}
          sx={{ 
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            borderRadius: "0 0 12px 12px"
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: { sm: "100px", md: "40px", xl: "100px" },
          justifyContent: "center",
          padding: "20px 50px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {apiAllData &&
          apiAllData.map((postData, index) => (
            <Box
              key={`${postData.id}-${index}`}
              sx={{
                transform: "translateY(0px)",
                transition: "transform 0.4s ease, box-shadow 0.4s ease",
                "&:hover": {
                  transform: "translateY(-10px)",
                  "& > div": {
                    boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
                  }
                }
              }}
            >
              <Post
                data={postData}
                onClick={() => handlePostClick(postData)}
                navigateToUserProfile={navigateToUserProfile}
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "16px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                  transition: "box-shadow 0.4s ease",
                }}
              />
            </Box>
          ))}
      </Box>
      
      {postsLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
          <Loader />
        </Box>
      )}
      
      {selectedPost && (
        <PostDetails
          token={token}
          post={selectedPost}
          onClose={handleClosePostDetails}
          setSelectedPost={setSelectedPost}
          sx={{
            "& .MuiPaper-root": {
              borderRadius: "16px",
              boxShadow: "0 15px 50px rgba(0,0,0,0.15)",
            }
          }}
        />
      )}
    </Box>
  );
}

export default HomePage;