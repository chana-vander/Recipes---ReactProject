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


// MUI עיצוב
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Hook/authUserContext";
import { User } from "../Models/user";
import { Box, Button, TextField, Typography, Alert, Icon } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// import { Typography } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import React, { ReactNode, createContext, useContext, useState, useEffect } from "react"; // הוסף useEffect כאן


// סכמת ולידציה עם Yup
const schema = yup.object().shape({
    userName: yup.string().required("שם משתמש הוא שדה חובה"),
    password: yup.string().required("סיסמה היא שדה חובה"),
});

const Login = () => {
    const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn, saveUser } = useAuth();
    const [message, setMessage] = useState("");

    const { register, handleSubmit, formState: { errors } } = useForm<{ userName: string; password: string; }>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: { userName: string; password: string; }) => {
        try {
            // שליחת בקשת התחברות לשרת
            const response = await axios.post<User>("http://localhost:8080/api/user/login",
                { UserName: data.userName, Password: data.password },
                { headers: { 'Content-Type': 'application/json' } }
            );

            // אם השרת מחזיר את פרטי המשתמש (כולל ID)
            // if (response.data && response.data.Id) {
            console.log(response.data);
            saveUser(response.data); // שמירת המשתמש בקונטקסט
            setIsLoggedIn(true); // עדכון מצב הכניסה
            console.log(isLoggedIn);
            alert("התחברת בהצלחה")
            localStorage.setItem("isLoggedIn", "true"); // שמירת מצב התחברות
            saveUser(response.data);
            navigate("/recipes"); // ניתוב לעמוד המתכונים

            // }
        } catch (error) {
            // אם יש שגיאה, מעבירים את המשתמש לדף ההרשמה
            setMessage("שגיאה בהתחברות, מעביר אותך לדף ההרשמה");
            console.log(isLoggedIn);
            alert("שגיאה  בהתחברות נסה שוב בעוד מספר דקות")
            navigate("/home"); // נווט לדף ההרשמה
        }
        // שימוש ב-useEffect כדי לנווט לעמוד הבית כאשר המשתמש מחובר
        // useEffect(() => {
        //     if (isLoggedIn) {
        //         navigate("/home");
        //     }
        // }, [isLoggedIn, navigate]); // התלות ב-navigate כדי למנוע אזהרות
    };

    return (
        <Box sx={{ maxWidth: 400, mx: "auto", p: 4, boxShadow: 0, borderRadius: 0 }}>

            <Typography variant="h4" gutterBottom textAlign="center" color="#d81b60" dir="rtl">
                <LoginIcon sx={{ fontSize: 40, verticalAlign: "middle", marginLeft: 1 }} />
                התחברות למערכת
            </Typography>

            {message && <Alert severity="error" sx={{ mb: 2 }}>{message}</Alert>}

            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    fullWidth
                    label="שם משתמש"
                    variant="outlined"
                    {...register("userName")}
                    error={!!errors.userName}
                    helperText={errors.userName?.message}
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& input': { textAlign: 'right' }, '& fieldset': { borderColor: "#d81b60" } } }}
                    placeholder="שם משתמש"
                />

                <TextField
                    fullWidth
                    label="סיסמה"
                    type="password"
                    variant="outlined"
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& input': { textAlign: 'right' }, '& fieldset': { borderColor: "#d81b60" } } }}
                    placeholder="סיסמה"
                />

                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, bgcolor: "#d81b60", '&:hover': { bgcolor: "#c2185b" } }}>
                    כניסה
                </Button>
            </form>
        </Box>
    );
};

export default Login;