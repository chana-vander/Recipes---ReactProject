import axios from "axios"
import { useFieldArray, useForm, Controller } from "react-hook-form"
import { useEffect, useState } from "react"
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
  const { user, isLoggedIn } = useAuth()
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
    getValues,
  } = useForm({
    defaultValues: {
      Name: "",
      Instructions: "",
      Difficulty: "",
      Duration: "",
      Description: "",
      CategoryId: 0,
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
        Difficulty: data.Difficulty,
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
        navigate("/recipes")
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
    // Check if the current step is valid before proceeding
    const currentValues = getValues()

    if (activeStep === 0 && (!currentValues.Name || !currentValues.CategoryId)) {
      setSnackbar({
        open: true,
        message: "יש למלא את כל שדות החובה לפני המשך",
        severity: "error",
      })
      return
    }

    if (activeStep === 1 && !currentValues.Instructions) {
      setSnackbar({
        open: true,
        message: "יש להזין הוראות הכנה לפני המשך",
        severity: "error",
      })
      return
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <Box
      sx={{
        py: 4,
        background: `linear-gradient(135deg, ${alpha("#f5f5f5", 0.8)} 0%, ${alpha("#fafafa", 0.8)} 100%)`,
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Container maxWidth="md" sx={{ width: "100%" }}>
        <MotionPaper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            mb: 4,
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 1)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <IconButton
              color="primary"
              onClick={() => navigate("/recipes")}
              sx={{
                mr: 2,
                color: "#d81b60",
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                color: "#333",
              }}
            >
              <AddIcon sx={{ mr: 1, color: "#d81b60" }} /> הוספת מתכון חדש
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
                            ? "#d81b60"
                            : index < activeStep
                              ? "#4caf50"
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
                        sx={{
                          mb: 3,
                          "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": { borderColor: alpha("#d81b60", 0.5) },
                            "&.Mui-focused fieldset": { borderColor: "#d81b60" },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#d81b60",
                          },
                        }}
                      />

                      <TextField
                        fullWidth
                        label="תיאור קצר"
                        multiline
                        rows={3}
                        {...register("Description")}
                        variant="outlined"
                        sx={{
                          mb: 3,
                          "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": { borderColor: alpha("#d81b60", 0.5) },
                            "&.Mui-focused fieldset": { borderColor: "#d81b60" },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#d81b60",
                          },
                        }}
                      />

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <FormControl
                            fullWidth
                            error={!!errors.Difficulty}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "&:hover fieldset": { borderColor: alpha("#d81b60", 0.5) },
                                "&.Mui-focused fieldset": { borderColor: "#d81b60" },
                              },
                              "& .MuiInputLabel-root.Mui-focused": {
                                color: "#d81b60",
                              },
                            }}
                          >
                            <InputLabel id="difficulty-label">רמת קושי (1-5)</InputLabel>
                            <Controller
                              name="Difficulty"
                              control={control}
                              rules={{ required: "שדה זה חובה" }}
                              render={({ field }) => (
                                <Select {...field} labelId="difficulty-label" label="רמת קושי (1-5)">
                                  <MenuItem value="1">1 - קל מאוד</MenuItem>
                                  <MenuItem value="2">2 - קל</MenuItem>
                                  <MenuItem value="3">3 - בינוני</MenuItem>
                                  <MenuItem value="4">4 - קשה</MenuItem>
                                  <MenuItem value="5">5 - קשה מאוד</MenuItem>
                                </Select>
                              )}
                            />
                            {errors.Difficulty && (
                              <FormHelperText>{errors.Difficulty.message?.toString()}</FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="זמן הכנה (דקות)"
                            type="number"
                            {...register("Duration", { required: "שדה זה חובה" })}
                            error={!!errors.Duration}
                            helperText={errors.Duration?.message?.toString()}
                            variant="outlined"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "&:hover fieldset": { borderColor: alpha("#d81b60", 0.5) },
                                "&.Mui-focused fieldset": { borderColor: "#d81b60" },
                              },
                              "& .MuiInputLabel-root.Mui-focused": {
                                color: "#d81b60",
                              },
                            }}
                          />
                        </Grid>
                      </Grid>

                      <FormControl fullWidth sx={{ mt: 3 }} error={!!errors.CategoryId}>
                        <InputLabel id="category-label">קטגוריה</InputLabel>
                        <Controller
                          name="CategoryId"
                          control={control}
                          rules={{ required: "שדה זה חובה" }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              labelId="category-label"
                              label="קטגוריה"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "&:hover fieldset": { borderColor: alpha("#d81b60", 0.5) },
                                  "&.Mui-focused fieldset": { borderColor: "#d81b60" },
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "#d81b60",
                                },
                              }}
                            >
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
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          sx={{ fontWeight: "medium", display: "flex", alignItems: "center" }}
                        >
                          <ImageIcon sx={{ mr: 1, fontSize: "1rem", color: "#d81b60" }} /> תמונת המתכון
                        </Typography>

                        <Box
                          sx={{
                            width: "100%",
                            height: 200,
                            borderRadius: 2,
                            overflow: "hidden",
                            mb: 3,
                            backgroundColor: alpha(theme.palette.secondary.light, 0.1),
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            border: previewImage ? "none" : `1px dashed ${alpha("#d81b60", 0.3)}`,
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
                          sx={{
                            mt: "auto",
                            "& .MuiOutlinedInput-root": {
                              "&:hover fieldset": { borderColor: alpha("#d81b60", 0.5) },
                              "&.Mui-focused fieldset": { borderColor: "#d81b60" },
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "#d81b60",
                            },
                          }}
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
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: 3,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                    }}
                  >
                    <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
                      <ListAltIcon sx={{ mr: 1, color: "#d81b60" }} /> הוראות הכנה
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
                          "&:hover fieldset": { borderColor: alpha("#d81b60", 0.5) },
                          "&.Mui-focused fieldset": { borderColor: "#d81b60" },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#d81b60",
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
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: 3,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                      <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
                        <KitchenIcon sx={{ mr: 1, color: "#d81b60" }} /> רכיבי המתכון
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => append({ Name: "", Count: "", Type: "" })}
                        size="small"
                        sx={{
                          borderColor: "#d81b60",
                          color: "#d81b60",
                          "&:hover": {
                            borderColor: "#c2185b",
                            bgcolor: alpha("#d81b60", 0.05),
                          },
                        }}
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
                              borderRadius: 2,
                              borderColor: alpha("#d81b60", 0.2),
                              transition: "all 0.2s",
                              "&:hover": {
                                borderColor: "#d81b60",
                                boxShadow: `0 0 0 1px ${alpha("#d81b60", 0.2)}`,
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
                                  sx={{
                                    "& .MuiOutlinedInput-root": {
                                      "&:hover fieldset": { borderColor: alpha("#d81b60", 0.5) },
                                      "&.Mui-focused fieldset": { borderColor: "#d81b60" },
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                      color: "#d81b60",
                                    },
                                  }}
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
                                  sx={{
                                    "& .MuiOutlinedInput-root": {
                                      "&:hover fieldset": { borderColor: alpha("#d81b60", 0.5) },
                                      "&.Mui-focused fieldset": { borderColor: "#d81b60" },
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                      color: "#d81b60",
                                    },
                                  }}
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
                                  sx={{
                                    "& .MuiOutlinedInput-root": {
                                      "&:hover fieldset": { borderColor: alpha("#d81b60", 0.5) },
                                      "&.Mui-focused fieldset": { borderColor: "#d81b60" },
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                      color: "#d81b60",
                                    },
                                  }}
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
                          backgroundColor: alpha("#d81b60", 0.05),
                          borderRadius: 2,
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
                    color="primary"
                    type="submit"
                    disabled={saving || !isValid}
                    startIcon={<SaveIcon />}
                    sx={{
                      minWidth: 120,
                      position: "relative",
                      overflow: "hidden",
                      bgcolor: "#d81b60",
                      "&:hover": { bgcolor: "#c2185b" },
                      borderRadius: "30px",
                      px: 3,
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
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{
                      minWidth: 120,
                      bgcolor: "#d81b60",
                      "&:hover": { bgcolor: "#c2185b" },
                      borderRadius: "30px",
                    }}
                  >
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
    </Box>
  )
}

export default AddRecipe