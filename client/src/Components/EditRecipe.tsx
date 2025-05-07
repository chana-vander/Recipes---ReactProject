
// import axios from "axios";
// import { useFieldArray, useForm } from "react-hook-form";
// import { useEffect, useState } from "react";
// import { Category, Recipe } from "../Models/recipe";
// import { useNavigate, useParams } from "react-router-dom";

// const EditRecipe = () => {
//   const { id } = useParams(); // נשלף מה-URL
//   const [categories, setCategories] = useState<Category[]>([]);
//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//     reset, // ✅ לשימוש באתחול ערכים לאחר שליפה
//   } = useForm({
//     defaultValues: {
//       Name: "",
//       Instructions: "",
//       Difficulty: "",
//       Duration: "",
//       Description: "",
//       UserId: 0,
//       CategoryId: 0,
//       Img: "",
//       Ingridents: [{ Name: "", Count: "", Type: "" }],
//     }
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "Ingridents"
//   });

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get("http://localhost:8080/api/category");
//         setCategories(response.data);
//       } catch (error) {
//         console.error("שגיאה בטעינת הקטגוריות", error);
//       }
//     };

//     const fetchRecipe = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8080/api/recipe/${id}`);
//         const fetchedRecipe = response.data;

//         // הפוך את ההוראות למחרוזת
//         const instructionsString = fetchedRecipe.Instructions
//           .map((inst: any) => inst.Name)
//           .join("\n");

//         // אתחול השדות בטופס עם הערכים מהשרת
//         reset({
//           ...fetchedRecipe,
//           Instructions: instructionsString,
//           Ingridents: fetchedRecipe.Ingridents.length > 0 ? fetchedRecipe.Ingridents : [{ Name: "", Count: "", Type: "" }],
//         });
//       } catch (error) {
//         console.error("שגיאה בעת שליפת המתכון:", error);
//       }
//     };

//     fetchCategories();
//     if (id) {
//       fetchRecipe();
//     }
//   }, [id, reset]);

//   const handleEditRecipe = async (data: any) => {
//     try {
//       const userJson = localStorage.getItem("user");
//       const user = userJson ? JSON.parse(userJson) : null;

//       if (!user?.Id) {
//         alert("שגיאה בשליפת פרטי המשתמש");
//         return;
//       }

//       const formattedData = {
//         Id: Number(id),
//         Name: data.Name,
//         Instructions: data.Instructions
//           .split("\n")
//           .filter((line: string) => line.trim() !== "")
//           .map((line: string) => ({ Name: line.trim() })),
//         Difficulty: Number(data.Difficulty),
//         Duration: data.Duration,
//         Description: data.Description,
//         UserId: Number(user.Id),
//         CategoryId: Number(data.CategoryId),
//         Img: data.Img,
//         Ingridents: data.Ingridents,
//       };

//       const response = await axios.post("http://localhost:8080/api/recipe/edit", formattedData, {
//         headers: { "Content-Type": "application/json" }
//       });
//       console.log(response.data);
//       alert("המתכון עודכן בהצלחה!");
//       navigate("/recipes"); // נווט לדף המתכונים

//     }
//     catch (error: any) {
//       console.error("שגיאה כללית:", error.message || error);
//     }
//   };

//   return (
//     <>
//       <h2>עריכת מתכון</h2>
//       <form onSubmit={handleSubmit(handleEditRecipe)}>
//         <label>שם המתכון:</label>
//         <input {...register("Name", { required: "שדה זה חובה" })} />
//         {errors.Name && <p>{errors.Name.message}</p>}

//         <label>הוראות הכנה (שורה לכל שלב):</label>
//         <textarea {...register("Instructions", { required: "שדה זה חובה" })}></textarea>
//         {errors.Instructions && <p>{errors.Instructions.message}</p>}

//         <label>רמת קושי:</label>
//         <input {...register("Difficulty", { required: "שדה זה חובה" })} />
//         {errors.Difficulty && <p>{errors.Difficulty.message}</p>}

//         <label>זמן הכנה:</label>
//         <input {...register("Duration", { required: "שדה זה חובה" })} />
//         {errors.Duration && <p>{errors.Duration.message}</p>}

//         <label>תיאור:</label>
//         <input {...register("Description")} />

//         <label>קטגוריה:</label>
//         <select {...register("CategoryId", { required: "שדה זה חובה" })}>
//           <option value="">בחר קטגוריה</option>
//           {categories.map(category => (
//             <option key={category.Id} value={category.Id}>{category.Name}</option>
//           ))}
//         </select>
//         {errors.CategoryId && <p>{errors.CategoryId.message}</p>}

//         <label>URL לתמונה:</label>
//         <input {...register("Img")} />

//         <h3>רכיבי המתכון</h3>
//         {fields.map((item, idx) => (
//           <div key={item.id}>
//             <input {...register(`Ingridents.${idx}.Name`, { required: "שדה זה חובה" })} placeholder="שם רכיב" />
//             <input type="number" {...register(`Ingridents.${idx}.Count`, { required: "שדה זה חובה" })} placeholder="כמות" />
//             <input {...register(`Ingridents.${idx}.Type`, { required: "שדה זה חובה" })} placeholder="סוג" />
//             <button type="button" onClick={() => remove(idx)}>מחק רכיב</button>
//           </div>
//         ))}
//         <button type="button" onClick={() => append({ Name: "", Count: "", Type: "" })}>
//           הוסף רכיב
//         </button>

//         <button type="submit">שמור שינויים</button>
//       </form>
//     </>
//   );
// };

// export default EditRecipe;


"use client"

import { useEffect, useState } from "react"
import { useFieldArray, useForm, Controller } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import type { Category } from "../Models/recipe"
import { useAuth } from "../Hook/authUserContext"
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Paper,
  Grid,
  Divider,
  IconButton,
  FormHelperText,
  Card,
  CardMedia,
  Stack,
  Alert,
  Snackbar,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  RestaurantMenu as RestaurantMenuIcon,
  MenuBook as MenuBookIcon,
  Image as ImageIcon,
  Category as CategoryIcon,
  AccessTime as AccessTimeIcon,
  FitnessCenter as FitnessCenterIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material"

const EditRecipe = () => {
  const { id } = useParams<{ id: string }>()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const navigate = useNavigate()
  const { user } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<any>({
    defaultValues: {
      Name: "",
      Instructions: "",
      Difficulty: "",
      Duration: "",
      Description: "",
      UserId: 0,
      CategoryId: 0,
      Img: "",
      Ingridents: [{ Name: "", Count: "", Type: "" }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "Ingridents",
  })

  // שמירת הערך הנוכחי של URL התמונה לתצוגה מקדימה
  const watchImageUrl = watch("Img")

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/category")
        setCategories(response.data)
      } catch (error) {
        console.error("שגיאה בטעינת הקטגוריות", error)
        setErrorMessage("שגיאה בטעינת הקטגוריות")
      }
    }

    const fetchRecipe = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`http://localhost:8080/api/recipe/${id}`)
        const fetchedRecipe = response.data

        // הפוך את ההוראות למחרוזת
        const instructionsString = fetchedRecipe.Instructions.map((inst: any) => inst.Name).join("\n")

        // אתחול השדות בטופס עם הערכים מהשרת
        reset({
          ...fetchedRecipe,
          Instructions: instructionsString,
          Ingridents:
            fetchedRecipe.Ingridents.length > 0 ? fetchedRecipe.Ingridents : [{ Name: "", Count: "", Type: "" }],
        })
      } catch (error) {
        console.error("שגיאה בעת שליפת המתכון:", error)
        setErrorMessage("שגיאה בעת שליפת המתכון")
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
    if (id) {
      fetchRecipe()
    } else {
      setLoading(false)
    }
  }, [id, reset])

  const handleEditRecipe = async (data: any) => {
    try {
      setSaving(true)
      const userJson = localStorage.getItem("user")
      const userData = userJson ? JSON.parse(userJson) : null

      if (!userData?.Id) {
        setErrorMessage("שגיאה בשליפת פרטי המשתמש")
        return
      }

      const formattedData = {
        Id: Number(id),
        Name: data.Name,
        Instructions: data.Instructions.split("\n")
          .filter((line: string) => line.trim() !== "")
          .map((line: string) => ({ Name: line.trim() })),
        Difficulty: data.Difficulty,
        Duration: Number(data.Duration),
        Description: data.Description,
        UserId: Number(userData.Id),
        CategoryId: Number(data.CategoryId),
        Img: data.Img,
        Ingridents: data.Ingridents,
      }

      const response = await axios.post("http://localhost:8080/api/recipe/edit", formattedData, {
        headers: { "Content-Type": "application/json" },
      })
      console.log(response.data)
      setSuccessMessage("המתכון עודכן בהצלחה!")

      // נווט לדף המתכונים לאחר 1.5 שניות
      setTimeout(() => {
        navigate("/recipes")
      }, 1500)
    } catch (error: any) {
      console.error("שגיאה כללית:", error.message || error)
      setErrorMessage("שגיאה בעדכון המתכון: " + (error.message || "אנא נסה שנית"))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress color="primary" />
        <Typography sx={{ mt: 2 }}>טוען נתוני מתכון...</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, direction: "rtl" }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: "16px",
          mb: 4,
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "100%",
            height: "8px",
            background: "linear-gradient(90deg, #d81b60, #f06292)",
          }}
        />

        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate("/recipes")} sx={{ ml: 2 }}>
            חזרה למתכונים
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", flexGrow: 1, textAlign: "center" }}>
            עריכת מתכון
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <form onSubmit={handleSubmit(handleEditRecipe)}>
          <Grid container spacing={4}>
            {/* מידע בסיסי */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 3, display: "flex", alignItems: "center" }}>
                <RestaurantMenuIcon sx={{ mr: 1 }} /> מידע בסיסי
              </Typography>

              <Stack spacing={3}>
                <TextField
                  label="שם המתכון"
                  fullWidth
                  variant="outlined"
                  {...register("Name", { required: "שם המתכון הוא שדה חובה" })}
                  error={!!errors.Name}
                  helperText={errors.Name?.message?.toString()}
                  InputProps={{
                    startAdornment: <RestaurantMenuIcon sx={{ mr: 1, color: "text.secondary" }} />,
                  }}
                />

                <TextField
                  label="תיאור המתכון"
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  {...register("Description", { required: "תיאור המתכון הוא שדה חובה" })}
                  error={!!errors.Description}
                  helperText={errors.Description?.message?.toString()}
                  InputProps={{
                    startAdornment: <DescriptionIcon sx={{ mr: 1, mt: 1, color: "text.secondary" }} />,
                  }}
                />

                <FormControl fullWidth error={!!errors.CategoryId}>
                  <InputLabel id="category-label">קטגוריה</InputLabel>
                  <Controller
                    name="CategoryId"
                    control={control}
                    rules={{ required: "קטגוריה היא שדה חובה" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId="category-label"
                        label="קטגוריה"
                        startAdornment={<CategoryIcon sx={{ mr: 1, color: "text.secondary" }} />}
                      >
                        <MenuItem value={0} disabled>
                          בחר קטגוריה
                        </MenuItem>
                        {categories.map((category) => (
                          <MenuItem key={category.Id} value={category.Id}>
                            {category.Name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.CategoryId && <FormHelperText>{errors.CategoryId.message?.toString()}</FormHelperText>}
                </FormControl>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <FormControl fullWidth error={!!errors.Duration}>
                    <InputLabel id="duration-label">זמן הכנה (דקות)</InputLabel>
                    <Controller
                      name="Duration"
                      control={control}
                      rules={{
                        required: "זמן הכנה הוא שדה חובה",
                        min: { value: 1, message: "זמן הכנה חייב להיות לפחות דקה אחת" },
                      }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          labelId="duration-label"
                          label="זמן הכנה (דקות)"
                          startAdornment={<AccessTimeIcon sx={{ mr: 1, color: "text.secondary" }} />}
                        >
                          {[5, 10, 15, 20, 30, 45, 60, 90, 120, 150, 180].map((time) => (
                            <MenuItem key={time} value={time}>
                              {time} דקות
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.Duration && <FormHelperText>{errors.Duration.message?.toString()}</FormHelperText>}
                  </FormControl>

                  <FormControl fullWidth error={!!errors.Difficulty}>
                    <InputLabel id="difficulty-label">רמת קושי</InputLabel>
                    <Controller
                      name="Difficulty"
                      control={control}
                      rules={{ required: "רמת קושי היא שדה חובה" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          labelId="difficulty-label"
                          label="רמת קושי"
                          startAdornment={<FitnessCenterIcon sx={{ mr: 1, color: "text.secondary" }} />}
                        >
                          <MenuItem value="קל">קל</MenuItem>
                          <MenuItem value="בינוני">בינוני</MenuItem>
                          <MenuItem value="קשה">קשה</MenuItem>
                        </Select>
                      )}
                    />
                    {errors.Difficulty && <FormHelperText>{errors.Difficulty.message?.toString()}</FormHelperText>}
                  </FormControl>
                </Box>

                <TextField
                  label="קישור לתמונה"
                  fullWidth
                  variant="outlined"
                  {...register("Img", { required: "קישור לתמונה הוא שדה חובה" })}
                  error={!!errors.Img}
                  helperText={errors.Img?.message?.toString()}
                  InputProps={{
                    startAdornment: <ImageIcon sx={{ mr: 1, color: "text.secondary" }} />,
                  }}
                />

                {watchImageUrl && (
                  <Card sx={{ mt: 2, borderRadius: "8px", overflow: "hidden" }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={watchImageUrl}
                      alt="תצוגה מקדימה של תמונת המתכון"
                      sx={{ objectFit: "cover" }}
                    />
                  </Card>
                )}
              </Stack>
            </Grid>

            {/* הוראות הכנה ומרכיבים */}
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="h6" sx={{ mb: 3, display: "flex", alignItems: "center" }}>
                  <MenuBookIcon sx={{ mr: 1 }} /> הוראות הכנה
                </Typography>

                <TextField
                  label="הוראות הכנה (כל שורה היא שלב נפרד)"
                  fullWidth
                  multiline
                  rows={8}
                  variant="outlined"
                  placeholder="1. חממו את התנור ל-180 מעלות&#10;2. ערבבו את כל המרכיבים היבשים בקערה&#10;3. הוסיפו את הנוזלים וערבבו היטב"
                  {...register("Instructions", { required: "הוראות הכנה הן שדה חובה" })}
                  error={!!errors.Instructions}
                  helperText={errors.Instructions?.message?.toString() || "כל שורה תהפוך לשלב נפרד בהוראות ההכנה"}
                />
              </Box>

              <Box sx={{ mt: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
                    <RestaurantMenuIcon sx={{ mr: 1 }} /> מרכיבים
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => append({ Name: "", Count: "", Type: "" })}
                    size="small"
                  >
                    הוסף מרכיב
                  </Button>
                </Box>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: "8px",
                    bgcolor: "#f9f9f9",
                    border: "1px solid rgba(0,0,0,0.1)",
                    maxHeight: "300px",
                    overflowY: "auto",
                  }}
                >
                  {fields.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
                      אין מרכיבים. לחץ על "הוסף מרכיב" כדי להתחיל.
                    </Typography>
                  ) : (
                    <Stack spacing={2}>
                      {fields.map((item, index) => (
                        <Box
                          key={item.id}
                          sx={{
                            display: "flex",
                            gap: 1,
                            p: 2,
                            borderRadius: "8px",
                            bgcolor: "white",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                          }}
                        >
                          <TextField
                            label="שם המרכיב"
                            size="small"
                            {...register(`Ingridents.${index}.Name`, { required: "שם המרכיב הוא שדה חובה" })}
                            error={!!errors.Ingridents?.[index]?.Name}
                            helperText={errors.Ingridents?.[index]?.Name?.message?.toString()}
                            sx={{ flexGrow: 2 }}
                          />
                          <TextField
                            label="כמות"
                            size="small"
                            {...register(`Ingridents.${index}.Count`, { required: "כמות היא שדה חובה" })}
                            error={!!errors.Ingridents?.[index]?.Count}
                            helperText={errors.Ingridents?.[index]?.Count?.message?.toString()}
                            sx={{ flexGrow: 1 }}
                          />
                          <TextField
                            label="יחידה"
                            size="small"
                            {...register(`Ingridents.${index}.Type`, { required: "יחידה היא שדה חובה" })}
                            error={!!errors.Ingridents?.[index]?.Type}
                            helperText={errors.Ingridents?.[index]?.Type?.message?.toString()}
                            sx={{ flexGrow: 1 }}
                          />
                          <IconButton
                            color="error"
                            onClick={() => remove(index)}
                            sx={{ alignSelf: fields.length > 1 ? "center" : "flex-start" }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Paper>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 6, display: "flex", justifyContent: "space-between" }}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate("/recipes")} size="large">
              ביטול
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              size="large"
              disabled={saving}
              sx={{ minWidth: "150px" }}
            >
              {saving ? <CircularProgress size={24} color="inherit" /> : "שמור שינויים"}
            </Button>
          </Box>
        </form>
      </Paper>

      {/* הודעות הצלחה ושגיאה */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSuccessMessage("")} severity="success" sx={{ width: "100%" }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setErrorMessage("")} severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default EditRecipe


//מעןצב שניתקע
// "use client"

// import axios from "axios"
// import { useFieldArray, useForm } from "react-hook-form"
// import { useEffect, useState } from "react"
// import type { Category } from "../Models/recipe"
// import { useParams, useNavigate } from "react-router-dom"
// import {
//   Alert,
//   Box,
//   Button,
//   Container,
//   FormControl,
//   FormHelperText,
//   Grid,
//   IconButton,
//   InputLabel,
//   LinearProgress,
//   MenuItem,
//   Paper,
//   Select,
//   Snackbar,
//   Step,
//   StepLabel,
//   Stepper,
//   TextField,
//   Typography,
//   alpha,
//   useTheme,
// } from "@mui/material"
// import {
//   Add as AddIcon,
//   ArrowBack as ArrowBackIcon,
//   Check as CheckIcon,
//   Delete as DeleteIcon,
//   Edit as EditIcon,
//   Image as ImageIcon,
//   Info as InfoIcon,
//   Kitchen as KitchenIcon,
//   ListAlt as ListAltIcon,
//   Save as SaveIcon,
// } from "@mui/icons-material"
// import { motion, AnimatePresence } from "framer-motion"

// // Wrapper component for framer-motion animations
// const MotionBox = motion(Box)
// const MotionPaper = motion(Paper)

// const EditRecipe = () => {
//   const { id } = useParams()
//   const [categories, setCategories] = useState<Category[]>([])
//   const [loading, setLoading] = useState(true)
//   const [saving, setSaving] = useState(false)
//   const [activeStep, setActiveStep] = useState(0)
//   const [previewImage, setPreviewImage] = useState("")
//   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
//   const navigate = useNavigate()
//   const theme = useTheme()

//   const steps = [
//     { label: "פרטים בסיסיים", icon: <InfoIcon /> },
//     { label: "הוראות הכנה", icon: <ListAltIcon /> },
//     { label: "רכיבים", icon: <KitchenIcon /> },
//   ]

//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors, isValid, isDirty },
//     reset,
//     watch,
//   } = useForm({
//     defaultValues: {
//       Name: "",
//       Instructions: "",
//       Difficulty: "",
//       Duration: "",
//       Description: "",
//       UserId: 0,
//       CategoryId: 0,
//       Img: "",
//       Ingridents: [{ Name: "", Count: "", Type: "" }],
//     },
//     mode: "onChange",
//   })

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "Ingridents",
//   })

//   // Watch for image URL changes to update preview
//   const watchedImg = watch("Img")
//   useEffect(() => {
//     setPreviewImage(watchedImg)
//   }, [watchedImg])

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get("http://localhost:8080/api/category")
//         setCategories(response.data)
//       } catch (error) {
//         console.error("שגיאה בטעינת הקטגוריות", error)
//         setSnackbar({
//           open: true,
//           message: "שגיאה בטעינת הקטגוריות",
//           severity: "error",
//         })
//       }
//     }

//     const fetchRecipe = async () => {
//       try {
//         setLoading(true)
//         const response = await axios.get(`http://localhost:8080/api/recipe/${id}`)
//         const fetchedRecipe = response.data

//         // הפוך את ההוראות למחרוזת
//         const instructionsString = fetchedRecipe.Instructions.map((inst: any) => inst.Name).join("\n")

//         // אתחול השדות בטופס עם הערכים מהשרת
//         reset({
//           ...fetchedRecipe,
//           Instructions: instructionsString,
//           Ingridents:
//             fetchedRecipe.Ingridents.length > 0 ? fetchedRecipe.Ingridents : [{ Name: "", Count: "", Type: "" }],
//         })

//         setPreviewImage(fetchedRecipe.Img)
//         setLoading(false)
//       } catch (error) {
//         console.error("שגיאה בעת שליפת המתכון:", error)
//         setLoading(false)
//         setSnackbar({
//           open: true,
//           message: "שגיאה בטעינת המתכון",
//           severity: "error",
//         })
//       }
//     }

//     fetchCategories()
//     if (id) {
//       fetchRecipe()
//     }
//   }, [id, reset])

//   const handleEditRecipe = async (data: any) => {
//     try {
//       setSaving(true)
//       const userJson = localStorage.getItem("user")
//       const user = userJson ? JSON.parse(userJson) : null

//       if (!user?.Id) {
//         setSnackbar({
//           open: true,
//           message: "שגיאה בשליפת פרטי המשתמש",
//           severity: "error",
//         })
//         setSaving(false)
//         return
//       }

//       // const formattedData = {
//       //   Id: Number(id),
//       //   Name: data.Name,
//       //   Instructions: data.Instructions.split("\n")
//       //     .filter((line: string) => line.trim() !== "")
//       //     .map((line: string) => ({ Name: line.trim() })),
//       //   Difficulty: Number(data.Difficulty),
//       //   Duration: data.Duration,
//       //   Description: data.Description,
//       //   UserId: Number(user.Id),
//       //   CategoryId: Number(data.CategoryId),
//       //   Img: data.Img,
//       //   Ingridents: data.Ingridents,
//       // }
//       const formattedData = {
//         Id: Number(id),
//         Name: data.Name,
//         Instructions: data.Instructions
//           .split("\n")
//           .filter((line: string) => line.trim() !== "")
//           .map((line: string) => ({ Name: line.trim() })),
//         Difficulty: Number(data.Difficulty),
//         Duration: data.Duration,
//         Description: data.Description,
//         UserId: Number(user.Id),
//         CategoryId: Number(data.CategoryId),
//         Img: data.Img,
//         Ingridents: data.Ingridents,
//       };

//       await axios.post("http://localhost:8080/api/recipe/edit", formattedData, {
//         headers: { "Content-Type": "application/json" },
//       })

//       setSaving(false)
//       setSnackbar({
//         open: true,
//         message: "המתכון עודכן בהצלחה!",
//         severity: "success",
//       })

//       // Redirect after a short delay
//       setTimeout(() => {
//         navigate("/")
//       }, 1500)
//     } catch (error: any) {
//       console.error("שגיאה כללית:", error.message || error)
//       setSaving(false)
//       setSnackbar({
//         open: true,
//         message: "שגיאה בעדכון המתכון",
//         severity: "error",
//       })
//     }
//   }

//   const handleNext = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep + 1)
//   }

//   const handleBack = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep - 1)
//   }

//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false })
//   }

//   if (loading) {
//     return (
//       <Container maxWidth="md" sx={{ py: 8, direction: "rtl" }}>
//         <Paper
//           elevation={3}
//           sx={{
//             p: 4,
//             borderRadius: 2,
//             textAlign: "center",
//           }}
//         >
//           <Typography variant="h5" gutterBottom>
//             טוען מתכון...
//           </Typography>
//           <LinearProgress sx={{ mt: 2, mb: 4 }} />
//         </Paper>
//       </Container>
//     )
//   }

//   return (
//     <Container maxWidth="md" sx={{ py: 4, direction: "rtl" }}>
//       <MotionPaper
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         elevation={3}
//         sx={{
//           p: 4,
//           borderRadius: 2,
//           mb: 4,
//           background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
//         }}
//       >
//         <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
//           <IconButton color="primary" onClick={() => navigate("/")} sx={{ mr: 2 }}>
//             <ArrowBackIcon />
//           </IconButton>
//           <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
//             <EditIcon sx={{ mr: 1 }} /> עריכת מתכון
//           </Typography>
//         </Box>

//         <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
//           {steps.map((step, index) => (
//             <Step key={step.label}>
//               <StepLabel
//                 StepIconComponent={() => (
//                   <Box
//                     sx={{
//                       width: 40,
//                       height: 40,
//                       borderRadius: "50%",
//                       display: "flex",
//                       justifyContent: "center",
//                       alignItems: "center",
//                       backgroundColor:
//                         index === activeStep
//                           ? theme.palette.primary.main
//                           : index < activeStep
//                             ? theme.palette.success.main
//                             : alpha(theme.palette.text.disabled, 0.1),
//                       color: index <= activeStep ? "white" : theme.palette.text.disabled,
//                       transition: "all 0.3s ease",
//                     }}
//                   >
//                     {index < activeStep ? <CheckIcon /> : step.icon}
//                   </Box>
//                 )}
//               >
//                 {step.label}
//               </StepLabel>
//             </Step>
//           ))}
//         </Stepper>

//         <form onSubmit={handleSubmit(handleEditRecipe)}>
//           <AnimatePresence mode="wait">
//             {activeStep === 0 && (
//               <MotionBox
//                 key="step1"
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <Grid container spacing={3}>
//                   <Grid item xs={12} sm={8}>
//                     <TextField
//                       fullWidth
//                       label="שם המתכון"
//                       {...register("Name", { required: "שדה זה חובה" })}
//                       error={!!errors.Name}
//                       helperText={errors.Name?.message?.toString()}
//                       variant="outlined"
//                       sx={{ mb: 2 }}
//                     />

//                     <TextField
//                       fullWidth
//                       label="תיאור קצר"
//                       multiline
//                       rows={3}
//                       {...register("Description")}
//                       variant="outlined"
//                       sx={{ mb: 2 }}
//                     />

//                     <Grid container spacing={2}>
//                       <Grid item xs={12} sm={6}>
//                         <TextField
//                           fullWidth
//                           label="רמת קושי (1-5)"
//                           type="number"
//                           InputProps={{ inputProps: { min: 1, max: 5 } }}
//                           {...register("Difficulty", {
//                             required: "שדה זה חובה",
//                             min: { value: 1, message: "הערך המינימלי הוא 1" },
//                             max: { value: 5, message: "הערך המקסימלי הוא 5" },
//                           })}
//                           error={!!errors.Difficulty}
//                           helperText={errors.Difficulty?.message?.toString()}
//                           variant="outlined"
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={6}>
//                         <TextField
//                           fullWidth
//                           label="זמן הכנה"
//                           {...register("Duration", { required: "שדה זה חובה" })}
//                           error={!!errors.Duration}
//                           helperText={errors.Duration?.message?.toString()}
//                           variant="outlined"
//                         />
//                       </Grid>
//                     </Grid>

//                     <FormControl fullWidth sx={{ mt: 2 }} error={!!errors.CategoryId}>
//                       <InputLabel id="category-label">קטגוריה</InputLabel>
//                       <Select
//                         labelId="category-label"
//                         label="קטגוריה"
//                         {...register("CategoryId", { required: "שדה זה חובה" })}
//                       >
//                         {categories.map((category) => (
//                           <MenuItem key={category.Id} value={category.Id}>
//                             {category.Name}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                       {errors.CategoryId && <FormHelperText>{errors.CategoryId.message?.toString()}</FormHelperText>}
//                     </FormControl>
//                   </Grid>

//                   <Grid item xs={12} sm={4}>
//                     <Paper
//                       elevation={2}
//                       sx={{
//                         p: 2,
//                         borderRadius: 2,
//                         height: "100%",
//                         display: "flex",
//                         flexDirection: "column",
//                       }}
//                     >
//                       <Typography
//                         variant="subtitle1"
//                         gutterBottom
//                         sx={{ fontWeight: "medium", display: "flex", alignItems: "center" }}
//                       >
//                         <ImageIcon sx={{ mr: 1, fontSize: "1rem" }} /> תמונת המתכון
//                       </Typography>

//                       <Box
//                         sx={{
//                           width: "100%",
//                           height: 200,
//                           borderRadius: 1,
//                           overflow: "hidden",
//                           mb: 2,
//                           backgroundColor: alpha(theme.palette.primary.light, 0.1),
//                           display: "flex",
//                           justifyContent: "center",
//                           alignItems: "center",
//                         }}
//                       >
//                         {previewImage ? (
//                           <img
//                             src={previewImage || "/placeholder.svg"}
//                             alt="תצוגה מקדימה"
//                             style={{
//                               width: "100%",
//                               height: "100%",
//                               objectFit: "cover",
//                             }}
//                           />
//                         ) : (
//                           <ImageIcon sx={{ fontSize: "3rem", color: alpha(theme.palette.text.primary, 0.3) }} />
//                         )}
//                       </Box>

//                       <TextField
//                         fullWidth
//                         label="URL לתמונה"
//                         {...register("Img")}
//                         variant="outlined"
//                         placeholder="הזן כתובת URL לתמונה"
//                         sx={{ mt: "auto" }}
//                       />
//                     </Paper>
//                   </Grid>
//                 </Grid>
//               </MotionBox>
//             )}

//             {activeStep === 1 && (
//               <MotionBox
//                 key="step2"
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
//                   <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
//                     <ListAltIcon sx={{ mr: 1 }} /> הוראות הכנה
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" paragraph>
//                     כתוב כל שלב בשורה נפרדת. הוראות ברורות יעזרו למשתמשים להכין את המתכון בקלות.
//                   </Typography>

//                   <TextField
//                     fullWidth
//                     multiline
//                     rows={10}
//                     label="הוראות הכנה"
//                     placeholder="לדוגמה:&#10;1. חממו את התנור ל-180 מעלות&#10;2. ערבבו את כל החומרים היבשים בקערה&#10;3. הוסיפו את החומרים הרטובים וערבבו היטב"
//                     {...register("Instructions", { required: "שדה זה חובה" })}
//                     error={!!errors.Instructions}
//                     helperText={errors.Instructions?.message?.toString()}
//                     variant="outlined"
//                     sx={{
//                       "& .MuiOutlinedInput-root": {
//                         fontFamily: "monospace",
//                       },
//                     }}
//                   />
//                 </Paper>
//               </MotionBox>
//             )}

//             {activeStep === 2 && (
//               <MotionBox
//                 key="step3"
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
//                   <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//                     <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
//                       <KitchenIcon sx={{ mr: 1 }} /> רכיבי המתכון
//                     </Typography>
//                     <Button
//                       variant="outlined"
//                       startIcon={<AddIcon />}
//                       onClick={() => append({ Name: "", Count: "", Type: "" })}
//                       size="small"
//                     >
//                       הוסף רכיב
//                     </Button>
//                   </Box>

//                   <AnimatePresence>
//                     {fields.map((item, index) => (
//                       <MotionBox
//                         key={item.id}
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, height: 0 }}
//                         transition={{ duration: 0.2 }}
//                         sx={{ mb: 2 }}
//                       >
//                         <Paper
//                           variant="outlined"
//                           sx={{
//                             p: 2,
//                             borderRadius: 1,
//                             borderColor: alpha(theme.palette.primary.main, 0.2),
//                             transition: "all 0.2s",
//                             "&:hover": {
//                               borderColor: theme.palette.primary.main,
//                               boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.2)}`,
//                             },
//                           }}
//                         >
//                           <Grid container spacing={2} alignItems="center">
//                             <Grid item xs={12} sm={4}>
//                               <TextField
//                                 fullWidth
//                                 label="שם רכיב"
//                                 {...register(`Ingridents.${index}.Name`, { required: "שדה זה חובה" })}
//                                 error={!!errors.Ingridents?.[index]?.Name}
//                                 helperText={errors.Ingridents?.[index]?.Name?.message?.toString()}
//                                 variant="outlined"
//                                 size="small"
//                               />
//                             </Grid>
//                             <Grid item xs={6} sm={3}>
//                               <TextField
//                                 fullWidth
//                                 label="כמות"
//                                 type="number"
//                                 {...register(`Ingridents.${index}.Count`, { required: "שדה זה חובה" })}
//                                 error={!!errors.Ingridents?.[index]?.Count}
//                                 helperText={errors.Ingridents?.[index]?.Count?.message?.toString()}
//                                 variant="outlined"
//                                 size="small"
//                               />
//                             </Grid>
//                             <Grid item xs={6} sm={3}>
//                               <TextField
//                                 fullWidth
//                                 label="סוג כמות"
//                                 placeholder="גרם/כפית/יחידה"
//                                 {...register(`Ingridents.${index}.Type`, { required: "שדה זה חובה" })}
//                                 error={!!errors.Ingridents?.[index]?.Type}
//                                 helperText={errors.Ingridents?.[index]?.Type?.message?.toString()}
//                                 variant="outlined"
//                                 size="small"
//                               />
//                             </Grid>
//                             <Grid item xs={12} sm={2} sx={{ textAlign: "center" }}>
//                               <IconButton
//                                 color="error"
//                                 onClick={() => remove(index)}
//                                 disabled={fields.length === 1}
//                                 size="small"
//                                 sx={{
//                                   transition: "all 0.2s",
//                                   "&:hover": { transform: "scale(1.1)" },
//                                 }}
//                               >
//                                 <DeleteIcon />
//                               </IconButton>
//                             </Grid>
//                           </Grid>
//                         </Paper>
//                       </MotionBox>
//                     ))}
//                   </AnimatePresence>

//                   {fields.length === 0 && (
//                     <Box
//                       sx={{
//                         textAlign: "center",
//                         py: 4,
//                         backgroundColor: alpha(theme.palette.primary.light, 0.05),
//                         borderRadius: 1,
//                       }}
//                     >
//                       <Typography color="text.secondary">אין רכיבים. לחץ על "הוסף רכיב" כדי להתחיל.</Typography>
//                     </Box>
//                   )}
//                 </Paper>
//               </MotionBox>
//             )}
//           </AnimatePresence>

//           <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
//             <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
//               חזרה
//             </Button>
//             <Box>
//               {activeStep === steps.length - 1 ? (
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   type="submit"
//                   disabled={saving || !isValid}
//                   startIcon={<SaveIcon />}
//                   sx={{
//                     minWidth: 120,
//                     position: "relative",
//                     overflow: "hidden",
//                   }}
//                 >
//                   {saving ? "שומר..." : "שמור שינויים"}
//                   {saving && (
//                     <LinearProgress
//                       sx={{
//                         position: "absolute",
//                         bottom: 0,
//                         left: 0,
//                         right: 0,
//                         height: 3,
//                       }}
//                     />
//                   )}
//                 </Button>
//               ) : (
//                 <Button variant="contained" onClick={handleNext} sx={{ minWidth: 120 }}>
//                   הבא
//                 </Button>
//               )}
//             </Box>
//           </Box>
//         </form>
//       </MotionPaper>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//       >
//         <Alert
//           onClose={handleCloseSnackbar}
//           severity={snackbar.severity as any}
//           variant="filled"
//           sx={{ width: "100%" }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Container>
//   )
// }

// export default EditRecipe
