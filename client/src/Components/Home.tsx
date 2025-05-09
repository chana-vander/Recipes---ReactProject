"use client"
import { useNavigate } from "react-router-dom"
import { Container, Typography, Button, Card, CardContent, Grid, Box, Paper, useTheme, alpha } from "@mui/material"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import LoginIcon from "@mui/icons-material/Login"
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu"

const Home = () => {
  const navigate = useNavigate()
  const theme = useTheme()

  return (
    <>
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha("#ffebee", 0.8)} 0%, ${alpha("#f8bbd0", 0.8)} 100%)`,
          minHeight: "calc(100vh)",
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: 4,
              textAlign: "center",
              bgcolor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
              mb: 6,
            }}
          >
            <RestaurantMenuIcon sx={{ fontSize: 80, color: "#d81b60", mb: 2 }} />
            <Typography variant="h3" align="center" sx={{ color: "#d81b60", mb: 2, fontWeight: "bold" }}>
              ברוכים הבאים לאתר המתכונים
            </Typography>
            <Typography variant="h6" align="center" sx={{ mb: 4, color: "#8e44ad", maxWidth: "700px", mx: "auto" }}>
              גלה מתכונים חדשים, שתף את היצירות הקולינריות שלך והיה חלק מקהילת האוכל המובילה!
            </Typography>
          </Paper>

          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={5}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  },
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "8px",
                    bgcolor: "#d81b60",
                  }}
                />
                <CardContent sx={{ p: 4, textAlign: "center" }}>
                  <AccountCircleIcon sx={{ fontSize: 80, color: "#d81b60", mb: 2 }} />
                  <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold" }}>
                    הצטרף אלינו
                  </Typography>
                  <Typography sx={{ mb: 4 }} color="text.secondary">
                    הצטרף לקהילה שלנו ותהנה ממגוון מתכונים חדשים ומרגשים! שתף את המתכונים שלך ותן לאחרים להנות מהם.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate("/signin")}
                    sx={{
                      bgcolor: "#d81b60",
                      color: "white",
                      px: 4,
                      py: 1.5,
                      borderRadius: "30px",
                      "&:hover": {
                        bgcolor: "#c2185b",
                      },
                    }}
                  >
                    הרשמה
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={5}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  },
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "8px",
                    bgcolor: "#8e44ad",
                  }}
                />
                <CardContent sx={{ p: 4, textAlign: "center" }}>
                  <LoginIcon sx={{ fontSize: 80, color: "#8e44ad", mb: 2 }} />
                  <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold" }}>
                    כבר רשום?
                  </Typography>
                  <Typography sx={{ mb: 4 }} color="text.secondary">
                    התחבר כדי לגשת למתכונים האישיים שלך, לשתף מתכונים חדשים ולגלות מתכונים מעניינים מחברי הקהילה.
                  </Typography>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate("/login")}
                    sx={{
                      borderColor: "#8e44ad",
                      color: "#8e44ad",
                      px: 4,
                      py: 1.5,
                      borderRadius: "30px",
                      "&:hover": {
                        borderColor: "#7d3c98",
                        bgcolor: "rgba(142, 68, 173, 0.05)",
                      },
                    }}
                  >
                    התחברות
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}

export default Home