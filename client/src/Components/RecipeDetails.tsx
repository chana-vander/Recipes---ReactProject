"use client"

import { useEffect, useState } from "react"
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
} from "@mui/material"
import {
  AccessTime as AccessTimeIcon,
  FitnessCenter as FitnessCenterIcon,
  Category as CategoryIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material"

const RecipeDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

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

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <Typography>טוען מתכון...</Typography>
      </Container>
    )
  }

  if (!recipe) {
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h5">המתכון לא נמצא</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/recipes")} sx={{ mt: 2 }}>
          חזרה לרשימת המתכונים
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, direction: "rtl" }}>
      {/* פירורי לחם */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink underline="hover" color="inherit" onClick={() => navigate("/")} sx={{ cursor: "pointer" }}>
          דף הבית
        </MuiLink>
        <MuiLink underline="hover" color="inherit" onClick={() => navigate("/recipes")} sx={{ cursor: "pointer" }}>
          מתכונים
        </MuiLink>
        <Typography color="text.primary">{recipe.Name}</Typography>
      </Breadcrumbs>

      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/recipes")} sx={{ mb: 3 }}>
        חזרה לרשימת המתכונים
      </Button>

      <Grid container spacing={4}>
        {/* תמונה ופרטים כלליים */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
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
            <Typography variant="h4" component="h1" gutterBottom>
              {recipe.Name}
            </Typography>

            <Typography variant="body1" paragraph sx={{ mb: 3 }}>
              {recipe.Description}
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: "wrap", gap: 1 }}>
              <Chip
                icon={<FitnessCenterIcon />}
                label={`רמת קושי: ${recipe.Difficulty}`}
                color={recipe.Difficulty === "קל" ? "success" : recipe.Difficulty === "בינוני" ? "warning" : "error"}
              />
              <Chip icon={<AccessTimeIcon />} label={`זמן הכנה: ${recipe.Duration} דקות`} />
              {category && <Chip icon={<CategoryIcon />} label={`קטגוריה: ${category.Name}`} />}
            </Stack>

            {user?.Id === recipe.UserId && (
              <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/edit-recipe/${recipe.Id}`)}
                >
                  עריכת מתכון
                </Button>
                <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleDelete}>
                  מחיקת מתכון
                </Button>
              </Stack>
            )}
          </Box>
        </Grid>

        {/* מרכיבים */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
              מרכיבים
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <List>
              {recipe.Ingridents && recipe.Ingridents.length > 0 ? (
                recipe.Ingridents.map((ingredient, index) => (
                  <ListItem key={index} sx={{ py: 1 }}>
                    <ListItemText
                      primary={
                        <Typography variant="body1">
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
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h5" component="h2" gutterBottom>
              אופן ההכנה
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <List>
              {recipe.Instructions && recipe.Instructions.length > 0 ? (
                recipe.Instructions.map((instruction, index) => (
                  <ListItem key={index} alignItems="flex-start" sx={{ py: 1 }}>
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
                              width: 24,
                              height: 24,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mr: 2,
                              flexShrink: 0,
                            }}
                          >
                            {index + 1}
                          </Typography>
                          <Typography variant="body1">{instruction.Name}</Typography>
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
    </Container>
  )
}

export default RecipeDetails
