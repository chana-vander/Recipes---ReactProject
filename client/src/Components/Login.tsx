import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Hook/authUserContext";
import { User } from "../Models/user";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import LoginIcon from "@mui/icons-material/Login";
import {  useState } from "react"; 

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
      saveUser(response.data); // שמירת המשתמש בקונטקסט
      setIsLoggedIn(true); // עדכון מצב הכניסה
      alert("התחברת בהצלחה")
      saveUser(response.data);
      navigate("/recipes"); // ניתוב לעמוד המתכונים
    }
    catch (error) {
      // אם יש שגיאה, מעבירים את המשתמש לדף ההרשמה
      setMessage("שגיאה בהתחברות, מעביר אותך לדף ההרשמה");
      console.log(isLoggedIn);
      alert("שגיאה  בהתחברות נסה שוב בעוד מספר דקות")
      navigate("/home"); // נווט לדף ההרשמה
    }
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