
import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import type { Recipe, Category } from "../Models/recipe"
import { useAuth } from "../Hook/authUserContext"
import {
  Box,
  Container,
  Typography,
  Chip,
  Divider,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  Button,
  Card,
  CardMedia,
  Stack,
  Breadcrumbs,
  Link as MuiLink,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Fab,
  Zoom,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import {
  AccessTime as AccessTimeIcon,
  FitnessCenter as FitnessCenterIcon,
  Category as CategoryIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Restaurant as RestaurantIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Close as CloseIcon,
} from "@mui/icons-material"
import Header from "./header"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

const RecipeDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [printDialogOpen, setPrintDialogOpen] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()
  const theme = useTheme()
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`http://localhost:8080/api/recipe/${id}`)
        setRecipe(response.data)

        // שליפת פרטי הקטגוריה
        if (response.data.CategoryId) {
          const categoryResponse = await axios.get(`http://localhost:8080/api/category/${response.data.CategoryId}`)
          setCategory(categoryResponse.data)
        }
      } catch (error) {
        console.error("שגיאה בטעינת המתכון:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchRecipe()
    }
  }, [id])

  const handleDelete = async () => {
    if (!recipe?.Id) return

    if (window.confirm("האם אתה בטוח שברצונך למחוק את המתכון?")) {
      try {
        await axios.post(`http://localhost:8080/api/recipe/delete/${recipe.Id}`, {
          id: recipe.Id,
        })
        alert("המתכון נמחק בהצלחה!")
        navigate("/recipes")
      } catch (error) {
        console.error("שגיאה במחיקת המתכון:", error)
      }
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = async () => {
    if (!printRef.current) return

    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      })
      const imgData = canvas.toDataURL("image/jpeg", 1.0)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 30

      pdf.addImage(imgData, "JPEG", imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      pdf.save(`מתכון-${recipe?.Name || "מתכון"}.pdf`)
    } catch (error) {
      console.error("שגיאה ביצירת PDF:", error)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: recipe?.Name || "מתכון טעים",
          text: `בדקו את המתכון המדהים הזה: ${recipe?.Name}`,
          url: window.location.href,
        })
        .catch((error) => console.error("שגיאה בשיתוף:", error))
    } else {
      setPrintDialogOpen(true)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <Container sx={{ py: 8, textAlign: "center" }}>
          <Typography>טוען מתכון...</Typography>
        </Container>
      </>
    )
  }

  if (!recipe) {
    return (
      <>
        <Header />
        <Container sx={{ py: 8, textAlign: "center" }}>
          <Typography variant="h5">המתכון לא נמצא</Typography>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/recipes")} sx={{ mt: 2 }}>
            חזרה לרשימת המתכונים
          </Button>
        </Container>
      </>
    )
  }

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          py: 4,
          background: `linear-gradient(135deg, ${alpha("#f5f5f5", 0.8)} 0%, ${alpha("#fafafa", 0.8)} 100%)`,
        }}
      >
        <Container maxWidth="lg">
          {/* פירורי לחם */}
          <Breadcrumbs sx={{ mb: 3, direction: "rtl" }}>
            <MuiLink underline="hover" color="inherit" onClick={() => navigate("/")} sx={{ cursor: "pointer" }}>
              דף הבית
            </MuiLink>
            <MuiLink underline="hover" color="inherit" onClick={() => navigate("/recipes")} sx={{ cursor: "pointer" }}>
              מתכונים
            </MuiLink>
            <Typography color="text.primary">{recipe.Name}</Typography>
          </Breadcrumbs>

          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/recipes")}
            sx={{
              mb: 3,
              borderColor: "#d81b60",
              color: "#d81b60",
              "&:hover": {
                borderColor: "#c2185b",
                bgcolor: alpha("#d81b60", 0.05),
              },
            }}
          >
            חזרה לרשימת המתכונים
          </Button>

          <div ref={printRef}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                mb: 4,
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                position: "relative",
                overflow: "hidden",
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

              <Grid container spacing={4}>
                {/* תמונה ופרטים כלליים */}
                <Grid item xs={12} md={6}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="400"
                      image={recipe.Img || "/placeholder.svg?height=400&width=600"}
                      alt={recipe.Name}
                      sx={{ objectFit: "cover" }}
                    />
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography
                      variant="h3"
                      component="h1"
                      gutterBottom
                      sx={{
                        fontWeight: "bold",
                        color: "#333",
                        mb: 2,
                      }}
                    >
                      {recipe.Name}
                    </Typography>

                    <Typography
                      variant="body1"
                      paragraph
                      sx={{
                        mb: 3,
                        color: "#555",
                        fontSize: "1.1rem",
                        lineHeight: 1.6,
                      }}
                    >
                      {recipe.Description}
                    </Typography>

                    <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: "wrap", gap: 1 }}>
                      <Chip
                        icon={<FitnessCenterIcon />}
                        label={`רמת קושי: ${recipe.Difficulty}`}
                        color={
                          recipe.Difficulty === "קל" ? "success" : recipe.Difficulty === "בינוני" ? "warning" : "error"
                        }
                        sx={{ borderRadius: "20px", py: 0.5 }}
                      />
                      <Chip
                        icon={<AccessTimeIcon />}
                        label={`זמן הכנה: ${recipe.Duration} דקות`}
                        sx={{ borderRadius: "20px", py: 0.5 }}
                      />
                      {category && (
                        <Chip
                          icon={<CategoryIcon />}
                          label={`קטגוריה: ${category.Name}`}
                          sx={{ borderRadius: "20px", py: 0.5 }}
                        />
                      )}
                    </Stack>

                    {user?.Id === recipe.UserId && (
                      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                        <Button
                          variant="contained"
                          startIcon={<EditIcon />}
                          onClick={() => navigate(`/edit-recipe/${recipe.Id}`)}
                          sx={{
                            bgcolor: "#2196f3",
                            "&:hover": { bgcolor: "#1976d2" },
                            borderRadius: "30px",
                            px: 3,
                          }}
                        >
                          עריכת מתכון
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={handleDelete}
                          sx={{
                            borderRadius: "30px",
                            px: 3,
                          }}
                        >
                          מחיקת מתכון
                        </Button>
                      </Stack>
                    )}
                  </Box>
                </Grid>

                {/* מרכיבים */}
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      height: "100%",
                      borderRadius: 3,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                    }}
                  >
                    <Typography
                      variant="h5"
                      component="h2"
                      gutterBottom
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      <RestaurantIcon sx={{ mr: 1, color: "#d81b60" }} />
                      מרכיבים
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <List sx={{ py: 0 }}>
                      {recipe.Ingridents && recipe.Ingridents.length > 0 ? (
                        recipe.Ingridents.map((ingredient, index) => (
                          <ListItem
                            key={index}
                            sx={{
                              py: 1.5,
                              px: 0,
                              borderBottom:
                                index < recipe.Ingridents.length - 1 ? `1px solid ${alpha("#000", 0.1)}` : "none",
                            }}
                          >
                            <ListItemText
                              primary={
                                <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                                  <Box
                                    component="span"
                                    sx={{
                                      width: 8,
                                      height: 8,
                                      borderRadius: "50%",
                                      bgcolor: "#d81b60",
                                      display: "inline-block",
                                      mr: 2,
                                    }}
                                  />
                                  <strong>{ingredient.Name}</strong>
                                  {ingredient.Count && ingredient.Type
                                    ? ` - ${ingredient.Count} ${ingredient.Type}`
                                    : ingredient.Count
                                      ? ` - ${ingredient.Count}`
                                      : ""}
                                </Typography>
                              }
                            />
                          </ListItem>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          לא נמצאו מרכיבים למתכון זה
                        </Typography>
                      )}
                    </List>
                  </Paper>
                </Grid>

                {/* הוראות הכנה */}
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      height: "100%",
                      borderRadius: 3,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                    }}
                  >
                    <Typography
                      variant="h5"
                      component="h2"
                      gutterBottom
                      sx={{
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      אופן ההכנה
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <List>
                      {recipe.Instructions && recipe.Instructions.length > 0 ? (
                        recipe.Instructions.map((instruction, index) => (
                          <ListItem key={index} alignItems="flex-start" sx={{ py: 2, px: 0 }}>
                            <ListItemText
                              primary={
                                <Box sx={{ display: "flex" }}>
                                  <Typography
                                    variant="body1"
                                    component="span"
                                    sx={{
                                      bgcolor: "#d81b60",
                                      color: "white",
                                      borderRadius: "50%",
                                      width: 28,
                                      height: 28,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      mr: 2,
                                      flexShrink: 0,
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {index + 1}
                                  </Typography>
                                  <Typography
                                    variant="body1"
                                    sx={{
                                      lineHeight: 1.6,
                                      color: "#333",
                                    }}
                                  >
                                    {instruction.Name}
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          לא נמצאו הוראות הכנה למתכון זה
                        </Typography>
                      )}
                    </List>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </div>

          {/* כפתורי פעולה צפים */}
          <Box sx={{ position: "fixed", bottom: 16, left: 16, zIndex: 1000 }}>
            <Stack direction="column" spacing={1}>
              <Zoom in={true} style={{ transitionDelay: "0ms" }}>
                <Tooltip title="הדפסה" placement="right">
                  <Fab
                    color="primary"
                    size="medium"
                    onClick={handlePrint}
                    sx={{ bgcolor: "#d81b60", "&:hover": { bgcolor: "#c2185b" } }}
                  >
                    <PrintIcon />
                  </Fab>
                </Tooltip>
              </Zoom>
              <Zoom in={true} style={{ transitionDelay: "100ms" }}>
                <Tooltip title="הורדה כ-PDF" placement="right">
                  <Fab
                    color="primary"
                    size="medium"
                    onClick={handleDownloadPDF}
                    sx={{ bgcolor: "#2196f3", "&:hover": { bgcolor: "#1976d2" } }}
                  >
                    <DownloadIcon />
                  </Fab>
                </Tooltip>
              </Zoom>
              <Zoom in={true} style={{ transitionDelay: "200ms" }}>
                <Tooltip title="שיתוף" placement="right">
                  <Fab
                    color="primary"
                    size="medium"
                    onClick={handleShare}
                    sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}
                  >
                    <ShareIcon />
                  </Fab>
                </Tooltip>
              </Zoom>
            </Stack>
          </Box>

          {/* דיאלוג הדפסה/שיתוף */}
          <Dialog open={printDialogOpen} onClose={() => setPrintDialogOpen(false)} maxWidth="xs" fullWidth>
            <DialogTitle>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6">אפשרויות שיתוף</Typography>
                <IconButton onClick={() => setPrintDialogOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2} sx={{ pt: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<PrintIcon />}
                  onClick={handlePrint}
                  fullWidth
                  sx={{ justifyContent: "flex-start" }}
                >
                  הדפסת המתכון
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadPDF}
                  fullWidth
                  sx={{ justifyContent: "flex-start" }}
                >
                  הורדה כקובץ PDF
                </Button>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setPrintDialogOpen(false)}>סגור</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </>
  )
}

export default RecipeDetails
