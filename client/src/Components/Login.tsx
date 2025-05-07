// //כניסה למערכת
// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { LoginFormInputs } from "../Models/loginUser"
// import { useAuth } from "../Hook/authUserContext";
// import { useState } from "react";
// import { User } from "../Models/user";

// const Login = () => {
//     const { register, handleSubmit } = useForm<LoginFormInputs>();
//     const navigator = useNavigate();
//     const { isLoggedIn, setIsLoggedIn, saveUser } = useAuth();
//     const [message, setMessage] = useState("");
//     const [password, setPassword] = useState("");
//     const [userName, setUserName] = useState("");
//     const onSubmit = async (data: { userName: string, password: string }) => {
//         try {
//             // שליחת בקשת התחברות לשרת
//             const response = await axios.post<User>("http://localhost:8080/api/user/login",
//                 { UserName: userName, Password: password },
//                 { headers: { 'Content-Type': 'application/json' } }
//             );
//             // אם השרת מחזיר את פרטי המשתמש (כולל ID)
//             if (response.data && response.data.Id) {
//                 console.log(response.data);
//                 saveUser(response.data); // שמירת המשתמש בקונטקסט
//                 setIsLoggedIn(true); // עדכון מצב הכניסה
//                 console.log(isLoggedIn);
//                 navigator("/recipes"); // ניתוב לעמוד המתכונים
//             }
//         }
//         catch (error) {
//             // אם יש שגיאה, מעבירים את המשתמש לדף ההרשמה
//             alert("שגיאה בהתחברות, מעביר אותך לדף ההרשמה");
//             console.log(isLoggedIn);
//             navigator("/register"); // נווט לדף ההרשמה
//         }
//     };

//     return (<>
//         <form onSubmit={handleSubmit(onSubmit)}>
//             <h2>התחברות</h2>
//             <label>שם משתמש</label>
//             <input {...register("userName")} onChange={({ target }) => setUserName(target.value)} placeholder="שם משתמש" />
//             <br />
//             <input {...register("password")} onChange={({ target }) => setPassword(target.value)} value={password} type="password" placeholder="סיסמא" />
//             <br />
//             <button type="submit" >כניסה</button>
//         </form>
//     </>)
// }
// export default Login
"use client"
import { useNavigate } from "react-router-dom"
import { Container, Typography, Button, Card, CardContent, Grid, Box, Paper, useTheme, alpha } from "@mui/material"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import LoginIcon from "@mui/icons-material/Login"
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu"
import Header from "./header"

const Home = () => {
  const navigate = useNavigate()
  const theme = useTheme()

  return (
    <>
      <Header />
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha("#ffebee", 0.8)} 0%, ${alpha("#f8bbd0", 0.8)} 100%)`,
          minHeight: "calc(100vh - 64px)",
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

// MUI עיצוב
// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../Hook/authUserContext";
// import { User } from "../Models/user";
// import { Box, Button, TextField, Typography, Alert, Icon } from "@mui/material";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// // import { Typography } from "@mui/material";
// import LoginIcon from "@mui/icons-material/Login";
// import React, { ReactNode, createContext, useContext, useState, useEffect } from "react"; // הוסף useEffect כאן


// // סכמת ולידציה עם Yup
// const schema = yup.object().shape({
//     userName: yup.string().required("שם משתמש הוא שדה חובה"),
//     password: yup.string().required("סיסמה היא שדה חובה"),
// });

// const Login = () => {
//     const navigate = useNavigate();
//     const { isLoggedIn, setIsLoggedIn, saveUser } = useAuth();
//     const [message, setMessage] = useState("");

//     const { register, handleSubmit, formState: { errors } } = useForm<{ userName: string; password: string; }>({
//         resolver: yupResolver(schema),
//     });

//     const onSubmit = async (data: { userName: string; password: string; }) => {
//         try {
//             // שליחת בקשת התחברות לשרת
//             const response = await axios.post<User>("http://localhost:8080/api/user/login",
//                 { UserName: data.userName, Password: data.password },
//                 { headers: { 'Content-Type': 'application/json' } }
//             );

//             // אם השרת מחזיר את פרטי המשתמש (כולל ID)
//             // if (response.data && response.data.Id) {
//             console.log(response.data);
//             saveUser(response.data); // שמירת המשתמש בקונטקסט
//             setIsLoggedIn(true); // עדכון מצב הכניסה
//             console.log(isLoggedIn);
//             alert("התחברת בהצלחה")
//             localStorage.setItem("isLoggedIn", "true"); // שמירת מצב התחברות
//             saveUser(response.data);
//             navigate("/recipes"); // ניתוב לעמוד המתכונים

//             // }
//         } catch (error) {
//             // אם יש שגיאה, מעבירים את המשתמש לדף ההרשמה
//             setMessage("שגיאה בהתחברות, מעביר אותך לדף ההרשמה");
//             console.log(isLoggedIn);
//             alert("שגיאה  בהתחברות נסה שוב בעוד מספר דקות")
//             navigate("/home"); // נווט לדף ההרשמה
//         }
//         // שימוש ב-useEffect כדי לנווט לעמוד הבית כאשר המשתמש מחובר
//         // useEffect(() => {
//         //     if (isLoggedIn) {
//         //         navigate("/home");
//         //     }
//         // }, [isLoggedIn, navigate]); // התלות ב-navigate כדי למנוע אזהרות
//     };

//     return (
//         <Box sx={{ maxWidth: 400, mx: "auto", p: 4, boxShadow: 0, borderRadius: 0 }}>

//             <Typography variant="h4" gutterBottom textAlign="center" color="#d81b60" dir="rtl">
//                 <LoginIcon sx={{ fontSize: 40, verticalAlign: "middle", marginLeft: 1 }} />
//                 התחברות למערכת
//             </Typography>

//             {message && <Alert severity="error" sx={{ mb: 2 }}>{message}</Alert>}

//             <form onSubmit={handleSubmit(onSubmit)}>
//                 <TextField
//                     fullWidth
//                     label="שם משתמש"
//                     variant="outlined"
//                     {...register("userName")}
//                     error={!!errors.userName}
//                     helperText={errors.userName?.message}
//                     sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& input': { textAlign: 'right' }, '& fieldset': { borderColor: "#d81b60" } } }}
//                     placeholder="שם משתמש"
//                 />

//                 <TextField
//                     fullWidth
//                     label="סיסמה"
//                     type="password"
//                     variant="outlined"
//                     {...register("password")}
//                     error={!!errors.password}
//                     helperText={errors.password?.message}
//                     sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& input': { textAlign: 'right' }, '& fieldset': { borderColor: "#d81b60" } } }}
//                     placeholder="סיסמה"
//                 />

//                 <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, bgcolor: "#d81b60", '&:hover': { bgcolor: "#c2185b" } }}>
//                     כניסה
//                 </Button>
//             </form>
//         </Box>
//     );
// };

// export default Login;