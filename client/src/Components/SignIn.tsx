import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { User } from "../Models/user"; // ודא שהמודל User כולל את כל השדות הנדרשים
import axios from "axios";
import { useAuth } from "../Hook/authUserContext";
import { useState } from "react";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// סכמת ולידציה עם Yup
const schema = yup.object().shape({
  UserName: yup.string().required("שם משתמש הוא שדה חובה"),
  Password: yup.string()
    .min(8, "הסיסמה חייבת להכיל לפחות 8 תווים")
    .matches(/[A-Z]/, "הסיסמה חייבת לכלול לפחות אות גדולה אחת")
    .matches(/[0-9]/, "הסיסמה חייבת לכלול לפחות מספר אחד")
    .required("סיסמה היא שדה חובה"),
  Name: yup.string().required("שם מלא הוא שדה חובה"),
  Phone: yup.string()
    .matches(/^[0-9]{10}$/, "מספר טלפון לא תקין (יש להזין 10 ספרות)")
    .required("טלפון הוא שדה חובה"),
  Email: yup.string().email("כתובת המייל לא תקינה").required("מייל הוא שדה חובה"),
  Tz: yup.string()
    .matches(/^\d{9}$/, "תעודת זהות חייבת להכיל בדיוק 9 ספרות")
    .required("תעודת זהות היא שדה חובה"),
});

const SignIn = () => {
  const navigate = useNavigate();
  const { saveUser, setIsLoggedIn } = useAuth();
  const [msg, setMsg] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<User>({
    resolver: yupResolver(schema), // ודא שה-FormData תואם
    mode: "onSubmit",
  });

  const onSubmit = async (data: User) => {
    try {
      const response = await axios.post("http://localhost:8080/api/user/sighin", data);
      setMsg("ההרשמה בוצעה בהצלחה! 🎉");
      saveUser(response.data);
      setIsLoggedIn(true);
      navigate("/recipes");
    }
    catch (error: any) {
      if (error.response?.data?.includes) {
        setMsg("😜 לחץ כאן לכניסה, אתה כבר רשום במערכת!");
        alert("😜 משתמש קיים!! , הנך מועבר לעמוד הבית כדי להתחבר");
        navigate("/home");
      }
      else {
        setMsg("שגיאה בחיבור לשרת. נסה שוב מאוחר יותר.");
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", p: 4, boxShadow: 0, borderRadius: 0 }}>
      <Typography variant="h4" gutterBottom textAlign="center" color="#d81b60" dir="rtl">
        הרשמה למערכת
      </Typography>
      {msg && <Alert severity="info" sx={{ mb: 2 }}>{msg}</Alert>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth label="שם משתמש" variant="outlined"
          {...register("UserName")}
          error={!!errors.UserName} helperText={errors.UserName?.message}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& input': { textAlign: 'right' }, '& fieldset': { borderColor: "#d81b60" } } }}
          placeholder="שם משתמש"
        />

        <TextField
          fullWidth label="סיסמה" type="password" variant="outlined"
          {...register("Password")}
          error={!!errors.Password} helperText={errors.Password?.message}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& input': { textAlign: 'right' }, '& fieldset': { borderColor: "#d81b60" } } }}
          placeholder="סיסמה"
        />

        <TextField
          fullWidth label="שם מלא" variant="outlined"
          {...register("Name")}
          error={!!errors.Name} helperText={errors.Name?.message}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& input': { textAlign: 'right' }, '& fieldset': { borderColor: "#d81b60" } } }}
          placeholder="שם מלא"
        />

        <TextField
          fullWidth label="מספר טלפון" variant="outlined"
          {...register("Phone")}
          error={!!errors.Phone} helperText={errors.Phone?.message}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& input': { textAlign: 'right' }, '& fieldset': { borderColor: "#d81b60" } } }}
          placeholder="מספר טלפון"
        />

        <TextField
          fullWidth label="כתובת מייל" type="email" variant="outlined"
          {...register("Email")}
          error={!!errors.Email} helperText={errors.Email?.message}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& input': { textAlign: 'right' }, '& fieldset': { borderColor: "#d81b60" } } }}
          placeholder="כתובת מייל"
        />

        <TextField
          fullWidth label="תעודת זהות" variant="outlined"
          {...register("Tz")}
          error={!!errors.Tz} helperText={errors.Tz?.message}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& input': { textAlign: 'right' }, '& fieldset': { borderColor: "#d81b60" } } }}
          placeholder="תעודת זהות"  
        />

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, bgcolor: "#d81b60", '&:hover': { bgcolor: "#c2185b" } }}>
          להירשם עכשיו 🚀
        </Button>
      </form>
    </Box>
  );
};

export default SignIn;