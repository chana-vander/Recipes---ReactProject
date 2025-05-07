
//v0

import axios from "axios"
import { useFieldArray, useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import type { User } from "../Models/user"
import type { Category } from "../Models/recipe"
import { useAuth } from "../Hook/authUserContext"
import { useNavigate } from "react-router-dom"
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material"
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Info as InfoIcon,
  Kitchen as KitchenIcon,
  ListAlt as ListAltIcon,
  Save as SaveIcon,
} from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion"

// Wrapper component for framer-motion animations
const MotionBox = motion(Box)
const MotionPaper = motion(Paper)

const AddRecipe = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [saving, setSaving] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [previewImage, setPreviewImage] = useState("")
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const theme = useTheme()

  const steps = [
    { label: "פרטים בסיסיים", icon: <InfoIcon /> },
    { label: "הוראות הכנה", icon: <ListAltIcon /> },
    { label: "רכיבים", icon: <KitchenIcon /> },
  ]

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    watch,
  } = useForm({
    defaultValues: {
      Name: "",
      Instructions: "",
      Difficulty: "",
      Duration: "",
      Description: "",
      CategoryId: "",
      Img: "",
      Ingridents: [{ Name: "", Count: "", Type: "" }],
    },
    mode: "onChange",
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "Ingridents",
  })

  // Watch for image URL changes to update preview
  const watchedImg = watch("Img")
  useEffect(() => {
    setPreviewImage(watchedImg)
  }, [watchedImg])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/category")
        setCategories(response.data)
      } catch (error) {
        console.error("שגיאה בטעינת הקטגוריות", error)
        setSnackbar({
          open: true,
          message: "שגיאה בטעינת הקטגוריות",
          severity: "error",
        })
      }
    }
    fetchCategories()
  }, [])

  const handleAddRecipe = async (data: any) => {
    try {
      setSaving(true)

      if (!isLoggedIn) {
        setSnackbar({
          open: true,
          message: "עליך להתחבר למערכת כדי להוסיף מתכון",
          severity: "error",
        })
        setSaving(false)
        return
      }

      const userJson = localStorage.getItem("user")
      const user: User | null = userJson ? JSON.parse(userJson) : null

      if (!user?.Id) {
        setSnackbar({
          open: true,
          message: "שגיאה בשליפת פרטי המשתמש",
          severity: "error",
        })
        setSaving(false)
        return
      }

      // כאן אנחנו מתאימים את מבנה הנתונים לשליחה לשרת
      const formattedData = {
        Name: data.Name,
        Instructions: data.Instructions.split("\n")
          .filter((line: string) => line.trim() !== "")
          .map((line: string) => ({ Name: line.trim() })),
        Difficulty: Number(data.Difficulty),
        Duration: data.Duration,
        Description: data.Description,
        UserId: Number(user.Id),
        CategoryId: Number(data.CategoryId),
        Img: data.Img,
        Ingridents: data.Ingridents,
      }

      // שליחת הבקשה לשרת
      await axios.post("http://localhost:8080/api/recipe", formattedData, {
        headers: { "Content-Type": "application/json" },
      })

      setSaving(false)
      setSnackbar({
        open: true,
        message: "המתכון נוסף בהצלחה! 🎉",
        severity: "success",
      })

      // Redirect after a short delay
      setTimeout(() => {
        navigate("recipes")
      }, 1500)
    } catch (error: any) {
      console.error("שגיאה כללית:", error.message || error)
      setSaving(false)
      setSnackbar({
        open: true,
        message: error?.errors?.[0]?.message || " נא למלא את כל השדות ",
        severity: "error",
      })
    }
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <Container maxWidth="md" sx={{ py: 4, direction: "rtl" }}>
      <MotionPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          mb: 4,
          background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.light, 0.05)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton color="primary" onClick={() => navigate("/")} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
            <AddIcon sx={{ mr: 1 }} /> הוספת מתכון חדש
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                StepIconComponent={() => (
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor:
                        index === activeStep
                          ? theme.palette.secondary.main
                          : index < activeStep
                            ? theme.palette.success.main
                            : alpha(theme.palette.text.disabled, 0.1),
                      color: index <= activeStep ? "white" : theme.palette.text.disabled,
                      transition: "all 0.3s ease",
                    }}
                  >
                    {index < activeStep ? <CheckIcon /> : step.icon}
                  </Box>
                )}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit(handleAddRecipe)}>
          <AnimatePresence mode="wait">
            {activeStep === 0 && (
              <MotionBox
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={8}>
                    <TextField
                      fullWidth
                      label="שם המתכון"
                      {...register("Name", { required: "שדה זה חובה" })}
                      error={!!errors.Name}
                      helperText={errors.Name?.message?.toString()}
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />

                    <TextField
                      fullWidth
                      label="תיאור קצר"
                      multiline
                      rows={3}
                      {...register("Description")}
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="רמת קושי (1-5)"
                          type="number"
                          InputProps={{ inputProps: { min: 1, max: 5 } }}
                          {...register("Difficulty", {
                            required: "שדה זה חובה",
                            min: { value: 1, message: "הערך המינימלי הוא 1" },
                            max: { value: 5, message: "הערך המקסימלי הוא 5" },
                          })}
                          error={!!errors.Difficulty}
                          helperText={errors.Difficulty?.message?.toString()}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="זמן הכנה"
                          placeholder="לדוגמה: 30 דקות"
                          {...register("Duration", { required: "שדה זה חובה" })}
                          error={!!errors.Duration}
                          helperText={errors.Duration?.message?.toString()}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>

                    <FormControl fullWidth sx={{ mt: 2 }} error={!!errors.CategoryId}>
                      <InputLabel id="category-label">קטגוריה</InputLabel>
                      <Select
                        labelId="category-label"
                        label="קטגוריה"
                        {...register("CategoryId", { required: "שדה זה חובה" })}
                      >
                        {categories.map((category) => (
                          <MenuItem key={category.Id} value={category.Id}>
                            {category.Name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.CategoryId && <FormHelperText>{errors.CategoryId.message?.toString()}</FormHelperText>}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{ fontWeight: "medium", display: "flex", alignItems: "center" }}
                      >
                        <ImageIcon sx={{ mr: 1, fontSize: "1rem" }} /> תמונת המתכון
                      </Typography>

                      <Box
                        sx={{
                          width: "100%",
                          height: 200,
                          borderRadius: 1,
                          overflow: "hidden",
                          mb: 2,
                          backgroundColor: alpha(theme.palette.secondary.light, 0.1),
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {previewImage ? (
                          <img
                            src={previewImage || "/placeholder.svg"}
                            alt="תצוגה מקדימה"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <ImageIcon sx={{ fontSize: "3rem", color: alpha(theme.palette.text.primary, 0.3) }} />
                        )}
                      </Box>

                      <TextField
                        fullWidth
                        label="URL לתמונה"
                        {...register("Img")}
                        variant="outlined"
                        placeholder="הזן כתובת URL לתמונה"
                        sx={{ mt: "auto" }}
                      />
                    </Paper>
                  </Grid>
                </Grid>
              </MotionBox>
            )}

            {activeStep === 1 && (
              <MotionBox
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
                    <ListAltIcon sx={{ mr: 1 }} /> הוראות הכנה
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    כתוב כל שלב בשורה נפרדת. הוראות ברורות יעזרו למשתמשים להכין את המתכון בקלות.
                  </Typography>

                  <TextField
                    fullWidth
                    multiline
                    rows={10}
                    label="הוראות הכנה"
                    placeholder="לדוגמה:&#10;1. חממו את התנור ל-180 מעלות&#10;2. ערבבו את כל החומרים היבשים בקערה&#10;3. הוסיפו את החומרים הרטובים וערבבו היטב"
                    {...register("Instructions", { required: "שדה זה חובה" })}
                    error={!!errors.Instructions}
                    helperText={errors.Instructions?.message?.toString()}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        fontFamily: "monospace",
                      },
                    }}
                  />
                </Paper>
              </MotionBox>
            )}

            {activeStep === 2 && (
              <MotionBox
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
                      <KitchenIcon sx={{ mr: 1 }} /> רכיבי המתכון
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => append({ Name: "", Count: "", Type: "" })}
                      size="small"
                      color="secondary"
                    >
                      הוסף רכיב
                    </Button>
                  </Box>

                  <AnimatePresence>
                    {fields.map((item, index) => (
                      <MotionBox
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        sx={{ mb: 2 }}
                      >
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 2,
                            borderRadius: 1,
                            borderColor: alpha(theme.palette.secondary.main, 0.2),
                            transition: "all 0.2s",
                            "&:hover": {
                              borderColor: theme.palette.secondary.main,
                              boxShadow: `0 0 0 1px ${alpha(theme.palette.secondary.main, 0.2)}`,
                            },
                          }}
                        >
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={4}>
                              <TextField
                                fullWidth
                                label="שם רכיב"
                                {...register(`Ingridents.${index}.Name`, { required: "שדה זה חובה" })}
                                error={!!errors.Ingridents?.[index]?.Name}
                                helperText={errors.Ingridents?.[index]?.Name?.message?.toString()}
                                variant="outlined"
                                size="small"
                              />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                              <TextField
                                fullWidth
                                label="כמות"
                                type="number"
                                {...register(`Ingridents.${index}.Count`, { required: "שדה זה חובה" })}
                                error={!!errors.Ingridents?.[index]?.Count}
                                helperText={errors.Ingridents?.[index]?.Count?.message?.toString()}
                                variant="outlined"
                                size="small"
                              />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                              <TextField
                                fullWidth
                                label="סוג כמות"
                                placeholder="גרם/כפית/יחידה"
                                {...register(`Ingridents.${index}.Type`, { required: "שדה זה חובה" })}
                                error={!!errors.Ingridents?.[index]?.Type}
                                helperText={errors.Ingridents?.[index]?.Type?.message?.toString()}
                                variant="outlined"
                                size="small"
                              />
                            </Grid>
                            <Grid item xs={12} sm={2} sx={{ textAlign: "center" }}>
                              <IconButton
                                color="error"
                                onClick={() => remove(index)}
                                disabled={fields.length === 1}
                                size="small"
                                sx={{
                                  transition: "all 0.2s",
                                  "&:hover": { transform: "scale(1.1)" },
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Paper>
                      </MotionBox>
                    ))}
                  </AnimatePresence>

                  {fields.length === 0 && (
                    <Box
                      sx={{
                        textAlign: "center",
                        py: 4,
                        backgroundColor: alpha(theme.palette.secondary.light, 0.05),
                        borderRadius: 1,
                      }}
                    >
                      <Typography color="text.secondary">אין רכיבים. לחץ על "הוסף רכיב" כדי להתחיל.</Typography>
                    </Box>
                  )}
                </Paper>
              </MotionBox>
            )}
          </AnimatePresence>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              חזרה
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="secondary"
                  type="submit"
                  disabled={saving || !isValid}
                  startIcon={<SaveIcon />}
                  sx={{
                    minWidth: 120,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {saving ? "שומר..." : "הוסף מתכון"}
                  {saving && (
                    <LinearProgress
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                      }}
                    />
                  )}
                </Button>
              ) : (
                <Button variant="contained" color="secondary" onClick={handleNext} sx={{ minWidth: 120 }}>
                  הבא
                </Button>
              )}
            </Box>
          </Box>
        </form>
      </MotionPaper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity as any}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default AddRecipe



// //זה קוד מעוללה ללא עיצוב
// import axios from "axios";
// import { useFieldArray, useForm } from "react-hook-form";
// import { useEffect, useState } from "react";
// import { User } from "../Models/user";
// import { Category, Recipe } from "../Models/recipe";
// import { useAuth } from "../Hook/authUserContext";
// import { useNavigate } from "react-router-dom";

// const AddRecipe = () => {
//     const { user, isLoggedIn } = useAuth();
//     const navigate = useNavigate();

//     const { register, handleSubmit, control, formState: { errors } } = useForm({
//         defaultValues: {
//             Name: "",
//             Instructions: "",
//             Difficulty: "",
//             Duration: 0,
//             Description: "",
//             UserId: user?.Id || 0,
//             CategoryId: 0,
//             Img: "",
//             Ingredients: [{ Name: "", Count: 0, Type: "" }]
//         }
//     });

//     const { fields, append, remove } = useFieldArray({
//         control,
//         name: "Ingredients"
//     });

//     const [categories, setCategories] = useState<Category[]>([]);

//     useEffect(() => {
//         const fetchCategories = async () => {
//             try {
//                 const response = await axios.get("http://localhost:8080/api/category");
//                 // setCategories(prevCat => {
//                 //     const mergeCat = [...prevCat, ...response.data];
//                 //     return mergeCat.filter((category, index, self) =>
//                 //         index === self.findIndex(c => c.id === category.id));
//                 // });
//                 setCategories(response.data); // בלי מיזוג מיותר

//             } catch (error) {
//                 console.error("שגיאה בטעינת הקטגוריות", error);
//             }
//         };
//         fetchCategories();
//     }, []);

//     //  שליחת הנתונים לשרת
//     const handleAddRecipe = async (data: any) => {
//         try {

//             if (!isLoggedIn) {
//                 alert("עליך להתחבר למערכת כדי להוסיף מתכון");
//                 return;
//             }

//             const formattedData = {
//                 Name: data.Name,
//                 Instructions: data.Instructions
//                     .split("\n")
//                     .filter((line: string) => line.trim() !== "")
//                     .map((line: string) => ({ Name: line.trim() })),
//                 Difficulty: data.Difficulty,
//                 Duration: data.Duration,
//                 Description: data.Description,
//                 UserId: user?.Id,
//                 CategoryId: data.CategoryId,
//                 Img: data.Img,
//                 Ingridents: data.Ingredients // תיקון לשם השדה ל-Ingrident
//             };
//             console.log(formattedData);

//             const response = await axios.post<Recipe>("http://localhost:8080/api/recipe", formattedData, {
//                 headers: { "Content-Type": "application/json" }
//             });

//             alert("המתכון נוסף בהצלחה! 🎉");
//             console.log(response.data);
//             navigate("/recipes"); // נווט לדף ההרשמה

//         } catch (error) {
//             console.error("❌ שגיאה בהוספת המתכון:", error);
//             alert("הוספת המתכון נכשלה 😢");
//         }
//     };

//     return (
//         <>
//             <h2>הוספת מתכון חדש</h2>
//             <form onSubmit={handleSubmit(handleAddRecipe)}>
//                 <label>שם המתכון:</label>
//                 <input {...register("Name", { required: "שדה זה חובה" })} />
//                 {errors.Name && <p>{errors.Name.message}</p>}
//                 <br />

//                 <label>הוראות הכנה (שורה לכל שלב):</label>
//                 <textarea {...register("Instructions", { required: "שדה זה חובה" })}></textarea>
//                 {errors.Instructions && <p>{errors.Instructions.message}</p>}
//                 <br />

//                 <label>רמת קושי:</label>
//                 <input {...register("Difficulty", { required: "שדה זה חובה" })} />
//                 {errors.Difficulty && <p>{errors.Difficulty.message}</p>}
//                 <br />

//                 <label>זמן הכנה בדקות:</label>
//                 <input type="number" {...register("Duration", { required: "שדה זה חובה" })} />
//                 {errors.Duration && <p>{errors.Duration.message}</p>}
//                 <br />

//                 <label>תיאור קצר:</label>
//                 <input {...register("Description")} />
//                 <br />

//                 <label>קטגוריה:</label>
//                 <select {...register("CategoryId", { required: "שדה זה חובה", valueAsNumber: true })}>
//                     <option value="">בחר קטגוריה</option>
//                     {categories.map((category: any) => (
//                         <option key={category.Id} value={category.Id}>{category.Name}</option>
//                     ))}
//                 </select>
//                 {errors.CategoryId && <p>{errors.CategoryId.message}</p>}
//                 <br />

//                 <label>URL לתמונה:</label>
//                 <input {...register("Img")} />
//                 <br />

//                 <h3>רכיבי המתכון</h3>
//                 {fields.map((item, id) => (
//                     <div key={item.id}>
//                         <label>שם מוצר:</label>
//                         <input {...register(`Ingredients.${id}.Name`, { required: "שדה זה חובה" })} />
//                         <label>כמות:</label>
//                         <input type="number" {...register(`Ingredients.${id}.Count`, { required: "שדה זה חובה" })} />
//                         <label>סוג כמות:</label>
//                         <input {...register(`Ingredients.${id}.Type`, { required: "שדה זה חובה" })} />
//                         <button type="button" onClick={() => remove(id)}>מחק רכיב</button>
//                     </div>
//                 ))}
//                 <br />
//                 <button type="button" onClick={() => append({ Name: "", Count: 0, Type: "" })}>
//                     הוסף רכיב
//                 </button>
//                 <br />
//                 <button type="submit">שלח מתכון</button>
//             </form>
//         </>
//     );
// };
// export default AddRecipe
