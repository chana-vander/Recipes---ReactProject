
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
  const [recipeData, setRecipeData] = useState<any>(null)
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
        setRecipeData(fetchedRecipe)

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

      if (!user?.Id) {
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
        UserId: Number(user.Id),
        CategoryId: Number(data.CategoryId),
        Img: data.Img,
        Ingridents: data.Ingridents,
      }

      const response = await axios.post("http://localhost:8080/api/recipe/edit", formattedData, {
        headers: { "Content-Type": "application/json" },
      })
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
      <Container
        sx={{
          py: 8,
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress color="primary" />
        <Typography sx={{ mt: 2 }}>טוען נתוני מתכון...</Typography>
      </Container>
    )
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        direction: "rtl",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: "16px",
          mb: 4,
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          width: "100%",
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













//לא למורה
//סליחה - קוד ללא עיצוב
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
