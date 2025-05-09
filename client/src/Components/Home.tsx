
//למורה היקרה תודה רבה על הכל
//אשמח שהמורה תתחשב אם יהיה צורך
//השרת היה מבלבל מאד וגם לי המון זמן להבין ולהצליח ולסנכרן דברים
import { useNavigate } from "react-router-dom"
import { Container, Typography, Button, Grid, Box, Paper, useTheme, alpha, Card, CardMedia, Stack } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import FavoriteIcon from "@mui/icons-material/Favorite"
import StarIcon from "@mui/icons-material/Star"
import LocalDiningIcon from "@mui/icons-material/LocalDining"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import { useAuth } from "../Hook/authUserContext"

const Home = () => {
  const navigate = useNavigate()
  const saveUser=useAuth();

  // מאפיינים של האתר
  const features = [
    {
      icon: <SearchIcon sx={{ fontSize: 40, color: "#d81b60" }} />,
      title: "חיפוש מתכונים",
      description: "מצא בקלות מתכונים לפי קטגוריה, זמן הכנה או רמת קושי",
    },
    {
      icon: <FavoriteIcon sx={{ fontSize: 40, color: "#d81b60" }} />,
      title: "שמירת מועדפים",
      description: "שמור את המתכונים האהובים עליך לשימוש מהיר בעתיד",
    },
    {
      icon: <StarIcon sx={{ fontSize: 40, color: "#d81b60" }} />,
      title: "דירוג מתכונים",
      description: "דרג מתכונים וקרא המלצות של משתמשים אחרים",
    },
    {
      icon: <LocalDiningIcon sx={{ fontSize: 40, color: "#d81b60" }} />,
      title: "שיתוף מתכונים",
      description: "שתף את המתכונים המיוחדים שלך עם קהילת הבישול שלנו",
    },
  ]

  return (
    <Box sx={{ width: "100%" }}>
      {/* חלק עליון - Hero Section */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "60vh", md: "80vh" },
          width: "100%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* תמונת רקע */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1,
            },
          }}
        >
          <img
            src="/images/hero-food.jpg"
            alt="מגוון מאכלים טעימים על שולחן"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>

        {/* תוכן מרכזי */}
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <Grid container justifyContent="center">
            <Grid item xs={12} md={10} lg={8} sx={{ textAlign: "center" }}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  mb: 3,
                  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                גלה את עולם הטעמים שלך
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color: "white",
                  mb: 5,
                  textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                }}
              >
                אלפי מתכונים מרהיבים במקום אחד, מותאמים בדיוק לטעם שלך
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => {
                    if (saveUser.isLoggedIn)
                      navigate("/recipes")
                    else
                      alert("עליך להתחבר כדי לגשת למתכונים")
                  }}
                  sx={{
                    bgcolor: "#d81b60",
                    color: "white",
                    px: 4,
                    py: 1.5,
                    borderRadius: "30px",
                    fontSize: "1.1rem",
                    "&:hover": {
                      bgcolor: "#c2185b",
                    },
                  }}
                >
                  גלה מתכונים
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/addRecipe")}
                  sx={{
                    borderColor: "white",
                    color: "white",
                    px: 4,
                    py: 1.5,
                    borderRadius: "30px",
                    fontSize: "1.1rem",
                    "&:hover": {
                      borderColor: "white",
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  הוסף מתכון
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* חלק המאפיינים */}
      <Box sx={{ py: 8, bgcolor: "#f9f9f9" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                color: "#333",
                fontWeight: "bold",
                mb: 2,
              }}
            >
              למה לבחור ב Yami ?
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "#666",
                maxWidth: "800px",
                mx: "auto",
              }}
            >
              אנחנו מציעים לך חוויה קולינרית מושלמת עם כלים שיעזרו לך למצוא, ליצור ולשתף את המתכונים האהובים עליך
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: "100%",
                    borderRadius: 3,
                    textAlign: "center",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">{feature.description}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* חלק הקטגוריות הפופולריות */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                color: "#333",
                fontWeight: "bold",
                mb: 2,
              }}
            >
              קטגוריות פופולריות
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "#666",
                maxWidth: "800px",
                mx: "auto",
              }}
            >
              גלה מתכונים מעולים בקטגוריות האהובות ביותר
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {[
              { name: "ארוחות בוקר", image: "/images/breakfast.jpg" },
              { name: "מנות עיקריות", image: "/images/main-dishes.jpg" },
              { name: "קינוחים", image: "/images/desserts.jpg" },
              { name: "מתכונים בריאים", image: "/images/healthy.jpg" },
            ].map((category, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    overflow: "hidden",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    },
                    position: "relative",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/recipes")}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      bgcolor: "rgba(0,0,0,0.3)",
                      transition: "background-color 0.3s",
                      "&:hover": {
                        bgcolor: "rgba(0,0,0,0.5)",
                      },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "center",
                        textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                      }}
                    >
                      {category.name}
                    </Typography>
                  </Box>
                  <CardMedia
                    component="img"
                    height="200"
                    image={category.image}
                    alt={category.name}
                    sx={{ objectFit: "cover" }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: "center", mt: 5 }}>
            <Button
              variant="outlined"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate("/recipes")}
              sx={{
                borderColor: "#d81b60",
                color: "#d81b60",
                px: 4,
                py: 1.5,
                borderRadius: "30px",
                "&:hover": {
                  borderColor: "#c2185b",
                  bgcolor: alpha("#d81b60", 0.05),
                },
              }}
            >
              לכל הקטגוריות
            </Button>
          </Box>
        </Container>
      </Box>

      {/* חלק הצטרפות לקהילה */}
      <Box
        sx={{
          py: 8,
          bgcolor: alpha("#d81b60", 0.05),
          position: "relative",
          overflow: "hidden",
        }}
      >
      
      </Box>
    </Box>
  )
}

export default Home
