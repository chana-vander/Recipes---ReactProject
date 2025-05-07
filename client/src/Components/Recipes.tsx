// import { Recipe } from '../Models/recipe';
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from '../Hook/authUserContext';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@mui/material';
// import AddIcon from "@mui/icons-material/Add";

// const Recipes = () => {
//     const [recipes, setRecipes] = useState<Recipe[]>([]); // רשימת המתכונים
//     const [categories, setCategories] = useState<{ Id: number; Name: string }[]>([]); // רשימת הקטגוריות
//     const { user } = useAuth();
//     const navigate = useNavigate();

//     // שמירת הערכים של הסינון
//     const [filters, setFilters] = useState({
//         category: 0,
//         duration: 0,
//         difficulty: "",
//         createdBy: "",
//     });

//     // טעינת המתכונים והקטגוריות מהשרת
//     useEffect(() => {
//         const fetchRecipes = async () => {
//             try {
//                 const response = await axios.get("http://localhost:8080/api/recipe");
//                 setRecipes(response.data);
//             } catch (error) {
//                 console.error("Error fetching recipes:", error);
//             }
//         };

//         const fetchCategories = async () => {
//             try {
//                 const response = await axios.get("http://localhost:8080/api/category");
//                 setCategories(response.data); // שמירה של הקטגוריות במבנה נכון
//             } catch (error) {
//                 console.error("Error fetching categories:", error);
//             }
//         };

//         fetchRecipes();
//         fetchCategories();
//     }, []);

//     // עדכון משתני הסינון
//     const handlerFilter = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
//         setFilters({ ...filters, [event.target.name]: event.target.value });
//     };

//     // סינון המתכונים לפי הבחירות של המשתמש
//     const filteredRecipes = recipes.filter((recipe) => {
//         return (
//             (!filters.category || recipe.CategoryId === Number(filters.category)) &&
//             (!filters.duration || recipe.Duration === filters.duration) &&
//             (!filters.difficulty || recipe.Difficulty === filters.difficulty)
//             // (!filters.createdBy || recipe.CreatedBy.includes(filters.createdBy))
//         );
//     });
//     const handleDelete = async (id: number) => {
//         try {
//             await axios.post(`http://localhost:8080/api/recipe/delete/${id}`, {
//                 id: id, // נשלח גם בגוף הבקשה ליתר ביטחון
//             });
    
//             // עדכון הרשימה לאחר מחיקה
//             setRecipes(prev => prev.filter(r => r.Id !== id));
//             alert("המתכון נמחק!")
//         } catch (error) {
//             console.error("שגיאה במחיקת המתכון:", error);
//         }
//     };
    
    
//     return (
//         <>
//         <Button
//             variant="contained"
//             startIcon={<AddIcon />}
//             onClick={() => navigate("/addRecipe")}
//             sx={{ bgcolor: "#d81b60", color: "#fff", marginBottom: 1, "&:hover": { bgcolor: "#c2185b" } }}
//           >
//             הוספת מתכון
//           </Button>
//           <br/>
//             {/* טופס הסינון */}
//             <select name="category" value={filters.category} onChange={handlerFilter}>
//                 <option value="">בחר קטגוריה</option>
//                 {categories.map((category) => (
//                     <option key={category.Id} value={category.Id}>
//                         {category.Name}
//                     </option>
//                 ))}
//             </select>

//             <input type="number" name="duration" placeholder="משך זמן (דקות)" value={filters.duration} onChange={handlerFilter} />

//             <input type="number" name="difficulty" placeholder="רמת קושי" value={filters.difficulty} onChange={handlerFilter} />

//             <input type="text" name="createdBy" placeholder="נוצר על ידי" value={filters.createdBy} onChange={handlerFilter} />

//             {/* הצגת המתכונים */}
//             <div>
//                 <h2>המתכונים</h2>
//                 <ul>
//                     {filteredRecipes.length > 0 ? (
//                         filteredRecipes.map(recipe => (
//                             <li key={recipe.Id}>
//                                 <h3>{recipe.Name}</h3>
//                                 <p>{recipe.Description}</p>
//                                 <p>רמת קושי: {recipe.Difficulty}</p>
//                                 <p>זמן הכנה: {recipe.Duration} דקות</p>
//                                 <img src={recipe.Img} alt={recipe.Name} width="200" />
//                                 <br/>
//                                 {user?.Id === recipe.UserId && (
//                                     <>
//                                         <button onClick={() => navigate(`/edit-recipe/${recipe.Id}`)}>לעריכה</button>
//                                         <button onClick={() => handleDelete(Number(recipe.Id))}>למחיקה</button>
//                                     </>)}

//                             </li>
//                         ))
//                     ) : (
//                         <p>לא נמצאו מתכונים</p>
//                     )}
//                 </ul>
//             </div>
//         </>
//     );
// };

// export default Recipes;
// עד לפה מה שהיה טוב ללא עיצוב כלל

//עכשיו 3 וחצי 
"use client"

import type { Recipe } from "../Models/recipe"
import type React from "react"
import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../Hook/authUserContext"
import { useNavigate } from "react-router-dom"
import {
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Grid,
  Chip,
  Stack,
  CardActionArea,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter"
import CategoryIcon from "@mui/icons-material/Category"
import PersonIcon from "@mui/icons-material/Person"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"

const Recipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]) // רשימת המתכונים
  const [categories, setCategories] = useState<{ Id: number; Name: string }[]>([]) // רשימת הקטגוריות
  const { user } = useAuth()
  const navigate = useNavigate()

  // שמירת הערכים של הסינון
  const [filters, setFilters] = useState({
    category: 0,
    duration: 0,
    difficulty: "",
    userId: "",
  })

  // טעינת המתכונים והקטגוריות מהשרת
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/recipe")
        setRecipes(response.data)
      } catch (error) {
        console.error("Error fetching recipes:", error)
      }
    }

    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/category")
        setCategories(response.data) // שמירה של הקטגוריות במבנה נכון
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchRecipes()
    fetchCategories()
  }, [])

  // עדכון משתני הסינון
  const handleFilter = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const name = event.target.name as string
    const value = event.target.value
    setFilters({ ...filters, [name]: value })
  }

  // איפוס כל הסינונים
  const resetFilters = () => {
    setFilters({
      category: 0,
      duration: 0,
      difficulty: "",
      userId: "",
    })
  }

  // סינון המתכונים לפי הבחירות של המשתמש
  const filteredRecipes = recipes.filter((recipe) => {
    return (
      // סינון לפי קטגוריה - אם לא נבחרה קטגוריה (0) או שהקטגוריה תואמת
      (filters.category === 0 || recipe.CategoryId === Number(filters.category)) &&
      // סינון לפי זמן הכנה - אם לא הוזן זמן (0) או שזמן ההכנה קטן או שווה לזמן שהוזן
      (filters.duration === 0 || recipe.Duration <= Number(filters.duration)) &&
      // סינון לפי רמת קושי - אם לא נבחרה רמת קושי או שרמת הקושי תואמת
      (filters.difficulty === "" || recipe.Difficulty === filters.difficulty) &&
      // סינון לפי מזהה משתמש - אם לא הוזן מזהה או שמזהה המשתמש תואם
      (filters.userId === "" || recipe.UserId === Number(filters.userId))
    )
  })

  const handleDelete = async (id: number) => {
    try {
      await axios.post(`http://localhost:8080/api/recipe/delete/${id}`, {
        id: id, // נשלח גם בגוף הבקשה ליתר ביטחון
      })

      // עדכון הרשימה לאחר מחיקה
      setRecipes((prev) => prev.filter((r) => r.Id !== id))
      alert("המתכון נמחק!")
    } catch (error) {
      console.error("שגיאה במחיקת המתכון:", error)
    }
  }

  // ניווט לעמוד פרטי מתכון
  const navigateToRecipeDetails = (recipeId: number) => {
    navigate(`/recipe/${recipeId}`)
  }

  // מניעת ניווט בעת לחיצה על כפתורי עריכה ומחיקה
  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation() // מניעת בועה של האירוע לאלמנט ההורה
    action()
  }

  return (
    <Box sx={{ p: 3, direction: "rtl" }}>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => navigate("/addRecipe")}
        sx={{ bgcolor: "#d81b60", color: "#fff", marginBottom: 3, "&:hover": { bgcolor: "#c2185b" } }}
      >
        הוספת מתכון
      </Button>

      {/* טופס הסינון */}
      <Box sx={{ mb: 4, p: 3, bgcolor: "#f5f5f5", borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          סינון מתכונים
        </Typography>
        <Grid container spacing={2}>
          {/* סינון לפי קטגוריה */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="category-label">קטגוריה</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={filters.category}
                onChange={handleFilter}
                label="קטגוריה"
                startAdornment={<CategoryIcon sx={{ mr: 1 }} />}
              >
                <MenuItem value={0}>כל הקטגוריות</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.Id} value={category.Id}>
                    {category.Name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* סינון לפי רמת קושי */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="difficulty-label">רמת קושי</InputLabel>
              <Select
                labelId="difficulty-label"
                name="difficulty"
                value={filters.difficulty}
                onChange={handleFilter}
                label="רמת קושי"
                startAdornment={<FitnessCenterIcon sx={{ mr: 1 }} />}
              >
                <MenuItem value="">כל הרמות</MenuItem>
                <MenuItem value="קל">קל</MenuItem>
                <MenuItem value="בינוני">בינוני</MenuItem>
                <MenuItem value="קשה">קשה</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* סינון לפי זמן הכנה */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="number"
              name="duration"
              label="זמן הכנה (דקות ומטה)"
              value={filters.duration || ""}
              onChange={handleFilter}
              InputProps={{
                startAdornment: <AccessTimeIcon sx={{ mr: 1 }} />,
              }}
            />
          </Grid>

          {/* סינון לפי מזהה משתמש */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="number"
              name="userId"
              label="מזהה משתמש"
              value={filters.userId}
              onChange={handleFilter}
              InputProps={{
                startAdornment: <PersonIcon sx={{ mr: 1 }} />,
              }}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={resetFilters} sx={{ mr: 1 }}>
            איפוס סינונים
          </Button>
        </Box>
      </Box>

      {/* הצגת המתכונים */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        המתכונים ({filteredRecipes.length})
      </Typography>

      {filteredRecipes.length > 0 ? (
        <Grid container spacing={3}>
          {filteredRecipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} key={recipe.Id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardActionArea onClick={() => navigateToRecipeDetails(Number(recipe.Id))}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={recipe.Img || "/placeholder.svg?height=200&width=300"}
                    alt={recipe.Name}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                      {recipe.Name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        height: "40px",
                      }}
                    >
                      {recipe.Description}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                      <Chip
                        icon={<FitnessCenterIcon />}
                        label={recipe.Difficulty}
                        size="small"
                        color={
                          recipe.Difficulty === "קל" ? "success" : recipe.Difficulty === "בינוני" ? "warning" : "error"
                        }
                      />
                      <Chip icon={<AccessTimeIcon />} label={`${recipe.Duration} דקות`} size="small" />
                    </Stack>
                  </CardContent>
                </CardActionArea>

                {user?.Id === recipe.UserId && (
                  <Box sx={{ p: 2, mt: "auto", display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={(e) => handleActionClick(e, () => navigate(`/edit-recipe/${recipe.Id}`))}
                      sx={{ flex: 1 }}
                    >
                      עריכה
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={(e) => handleActionClick(e, () => handleDelete(Number(recipe.Id)))}
                      sx={{ flex: 1 }}
                    >
                      מחיקה
                    </Button>
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ p: 4, textAlign: "center", bgcolor: "#f5f5f5", borderRadius: 2 }}>
          <Typography variant="h6">לא נמצאו מתכונים התואמים את הסינון</Typography>
          <Button variant="contained" onClick={resetFilters} sx={{ mt: 2 }}>
            הצג את כל המתכונים
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default Recipes

// v0
// "use client"

// import type { Recipe } from "../Models/recipe"
// import type React from "react"
// import { useEffect, useState } from "react"
// import axios from "axios"
// import {
//   Box,
//   Button,
//   Card,
//   CardActions,
//   CardContent,
//   CardMedia,
//   Container,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Divider,
//   FormControl,
//   Grid,
//   IconButton,
//   InputLabel,
//   MenuItem,
//   Select,
//   TextField,
//   Typography,
//   Paper,
//   Stack,
//   Chip,
//   FormHelperText,
// } from "@mui/material"
// import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material"
// import { useFieldArray, useForm, Controller } from "react-hook-form"

// const Recipes = () => {
//   const [recipes, setRecipes] = useState<Recipe[]>([]) // רשימת המתכונים
//   const [categories, setCategories] = useState<{ Id: number; Name: string }[]>([]) // רשימת הקטגוריות
//   const [openEditDialog, setOpenEditDialog] = useState(false)
//   const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
//   const [loading, setLoading] = useState(false)

//   // שמירת הערכים של הסינון
//   const [filters, setFilters] = useState({
//     category: 0,
//     duration: 0,
//     difficulty: "",
//     createdBy: "",
//   })

//   // טעינת המתכונים והקטגוריות מהשרת
//   const fetchRecipes = async () => {
//     try {
//       setLoading(true)
//       const response = await axios.get("http://localhost:8080/api/recipe")
//       setRecipes(response.data)
//       setLoading(false)
//     } catch (error) {
//       console.error("Error fetching recipes:", error)
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchRecipes()

//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get("http://localhost:8080/api/category")
//         setCategories(response.data) // שמירה של הקטגוריות במבנה נכון
//       } catch (error) {
//         console.error("Error fetching categories:", error)
//       }
//     }

//     fetchCategories()
//   }, [])

//   // עדכון משתני הסינון
//   const handlerFilter = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
//     setFilters({ ...filters, [event.target.name]: event.target.value })
//   }

//   // סינון המתכונים לפי הבחירות של המשתמש
//   const filteredRecipes = recipes.filter((recipe) => {
//     return (
//       (!filters.category || recipe.CategoryId === Number(filters.category)) &&
//       (!filters.duration || recipe.Duration === filters.duration) &&
//       (!filters.difficulty || recipe.Difficulty === Number(filters.difficulty))
//     )
//   })

//   // פתיחת חלון העריכה
//   const handleEditClick = (recipe: Recipe) => {
//     setSelectedRecipe(recipe)
//     setOpenEditDialog(true)
//   }

//   // סגירת חלון העריכה
//   const handleCloseEditDialog = () => {
//     setOpenEditDialog(false)
//     setSelectedRecipe(null)
//   }

//   // מחיקת מתכון
//   const handleDeleteClick = async (recipeId: number) => {
//     if (window.confirm("האם אתה בטוח שברצונך למחוק מתכון זה?")) {
//       try {
//         await axios.delete(`http://localhost:8080/api/recipe/${recipeId}`)
//         // רענון רשימת המתכונים
//         fetchRecipes()
//         alert("המתכון נמחק בהצלחה!")
//       } catch (error) {
//         console.error("Error deleting recipe:", error)
//         alert("אירעה שגיאה במחיקת המתכון")
//       }
//     }
//   }

//   return (
//     <Container maxWidth="lg" sx={{ mt: 4, mb: 4, direction: "rtl" }}>
//       <Typography variant="h4" component="h1" gutterBottom align="center">
//         המתכונים שלנו
//       </Typography>

//       {/* טופס הסינון */}
//       <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
//         <Typography variant="h6" gutterBottom>
//           סינון מתכונים
//         </Typography>
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={3}>
//             <FormControl fullWidth>
//               <InputLabel id="category-label">קטגוריה</InputLabel>
//               <Select
//                 labelId="category-label"
//                 name="category"
//                 value={filters.category}
//                 onChange={handlerFilter}
//                 label="קטגוריה"
//               >
//                 <MenuItem value={0}>כל הקטגוריות</MenuItem>
//                 {categories.map((category) => (
//                   <MenuItem key={category.Id} value={category.Id}>
//                     {category.Name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <TextField
//               fullWidth
//               type="number"
//               name="duration"
//               label="משך זמן (דקות)"
//               value={filters.duration}
//               onChange={handlerFilter}
//             />
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <TextField
//               fullWidth
//               type="number"
//               name="difficulty"
//               label="רמת קושי"
//               value={filters.difficulty}
//               onChange={handlerFilter}
//             />
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <TextField
//               fullWidth
//               name="createdBy"
//               label="נוצר על ידי"
//               value={filters.createdBy}
//               onChange={handlerFilter}
//             />
//           </Grid>
//         </Grid>
//       </Paper>

//       {/* הצגת המתכונים */}
//       {loading ? (
//         <Typography>טוען מתכונים...</Typography>
//       ) : (
//         <Grid container spacing={3}>
//           {filteredRecipes.length > 0 ? (
//             filteredRecipes.map((recipe) => (
//               <Grid item xs={12} sm={6} md={4} key={recipe.Id}>
//                 <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
//                   <CardMedia
//                     component="img"
//                     height="200"
//                     image={recipe.Img || "/placeholder.svg?height=200&width=300"}
//                     alt={recipe.Name}
//                   />
//                   <CardContent sx={{ flexGrow: 1 }}>
//                     <Typography variant="h5" component="h2" gutterBottom>
//                       {recipe.Name}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary" paragraph>
//                       {recipe.Description}
//                     </Typography>
//                     <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
//                       <Chip label={`רמת קושי: ${recipe.Difficulty}`} color="primary" variant="outlined" />
//                       <Chip label={`זמן הכנה: ${recipe.Duration}`} color="secondary" variant="outlined" />
//                     </Stack>
//                   </CardContent>
//                   <CardActions>
//                     <Button size="small" startIcon={<EditIcon />} onClick={() => handleEditClick(recipe)}>
//                       עריכה
//                     </Button>
//                     <Button
//                       size="small"
//                       color="error"
//                       startIcon={<DeleteIcon />}
//                       onClick={() => handleDeleteClick(recipe.Id)}
//                     >
//                       מחיקה
//                     </Button>
//                   </CardActions>
//                 </Card>
//               </Grid>
//             ))
//           ) : (
//             <Grid item xs={12}>
//               <Typography variant="h6" align="center">
//                 לא נמצאו מתכונים
//               </Typography>
//             </Grid>
//           )}
//         </Grid>
//       )}

//       {/* חלון עריכת מתכון */}
//       {selectedRecipe && (
//         <EditRecipeDialog
//           open={openEditDialog}
//           onClose={handleCloseEditDialog}
//           recipe={selectedRecipe}
//           categories={categories}
//           onSuccess={fetchRecipes}
//         />
//       )}
//     </Container>
//   )
// }

// // קומפוננטת עריכת מתכון
// interface EditRecipeDialogProps {
//   open: boolean
//   onClose: () => void
//   recipe: Recipe
//   categories: { Id: number; Name: string }[]
//   onSuccess: () => void
// }

// const EditRecipeDialog = ({ open, onClose, recipe, categories, onSuccess }: EditRecipeDialogProps) => {
//   const {
//     control,
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm({
//     defaultValues: {
//       Id: recipe.Id,
//       Name: recipe.Name,
//       Instructions: recipe.Instructions
//         ? recipe.Instructions.map((instruction: { Name: string }) => instruction.Name).join("\n")
//         : "",
//       Difficulty: recipe.Difficulty.toString(),
//       Duration: recipe.Duration,
//       Description: recipe.Description || "",
//       UserId: recipe.UserId,
//       CategoryId: recipe.CategoryId.toString(),
//       Img: recipe.Img || "",
//       Ingridents:
//         recipe.Ingridents && recipe.Ingridents.length > 0 ? recipe.Ingridents : [{ Name: "", Count: "", Type: "" }],
//     },
//   })

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "Ingridents",
//   })

//   useEffect(() => {
//     if (open && recipe) {
//       reset({
//         Id: recipe.Id,
//         Name: recipe.Name,
//         Instructions: recipe.Instructions
//           ? recipe.Instructions.map((instruction: { Name: string }) => instruction.Name).join("\n")
//           : "",
//         Difficulty: recipe.Difficulty.toString(),
//         Duration: recipe.Duration,
//         Description: recipe.Description || "",
//         UserId: recipe.UserId,
//         CategoryId: recipe.CategoryId.toString(),
//         Img: recipe.Img || "",
//         Ingridents:
//           recipe.Ingridents && recipe.Ingridents.length > 0 ? recipe.Ingridents : [{ Name: "", Count: "", Type: "" }],
//       })
//     }
//   }, [open, recipe, reset])

//   const handleUpdateRecipe = async (data: any) => {
//     try {
//       // Format the data for submission
//       const formattedData = {
//         Id: data.Id,
//         Name: data.Name,
//         Instructions: data.Instructions.split("\n")
//           .filter((line: string) => line.trim() !== "")
//           .map((line: string) => ({ Name: line.trim() })),
//         Difficulty: Number(data.Difficulty),
//         Duration: data.Duration,
//         Description: data.Description,
//         UserId: Number(data.UserId),
//         CategoryId: Number(data.CategoryId),
//         Img: data.Img,
//         Ingridents: data.Ingridents,
//       }

//       // Send update request
//       await axios.post("http://localhost:8080/api/recipe/edit", formattedData, {
//         headers: { "Content-Type": "application/json" },
//       })

//       alert("המתכון עודכן בהצלחה! 🎉")
//       onSuccess() // רענון רשימת המתכונים
//       onClose() // סגירת החלון
//     } catch (error: any) {
//       if (error?.errors && error.errors.length > 0) {
//         alert(`שגיאה: ${error.errors[0].message}`)
//       } else {
//         console.error("שגיאה כללית:", error.message || error)
//         alert("אירעה שגיאה בעדכון המתכון. אנא נסה שוב.")
//       }
//     }
//   }

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="md"
//       fullWidth
//       PaperProps={{
//         sx: {
//           direction: "rtl",
//           minHeight: "80vh",
//         },
//       }}
//     >
//       <DialogTitle>
//         <Typography variant="h5">עריכת מתכון: {recipe.Name}</Typography>
//       </DialogTitle>
//       <DialogContent dividers>
//         <form id="edit-recipe-form" onSubmit={handleSubmit(handleUpdateRecipe)}>
//           <input type="hidden" {...register("Id")} />
//           <input type="hidden" {...register("UserId")} />

//           <Grid container spacing={3}>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="שם המתכון"
//                 {...register("Name", { required: "שדה זה חובה" })}
//                 error={!!errors.Name}
//                 helperText={errors.Name?.message?.toString()}
//                 margin="normal"
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <Controller
//                 name="CategoryId"
//                 control={control}
//                 rules={{ required: "שדה זה חובה" }}
//                 render={({ field }) => (
//                   <FormControl fullWidth error={!!errors.CategoryId} margin="normal">
//                     <InputLabel>קטגוריה</InputLabel>
//                     <Select {...field} label="קטגוריה">
//                       <MenuItem value="">בחר קטגוריה</MenuItem>
//                       {categories.map((category) => (
//                         <MenuItem key={category.Id} value={category.Id.toString()}>
//                           {category.Name}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                     {errors.CategoryId && <FormHelperText>{errors.CategoryId.message?.toString()}</FormHelperText>}
//                   </FormControl>
//                 )}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField fullWidth label="URL לתמונה" {...register("Img")} margin="normal" />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="רמת קושי (1-5)"
//                 type="number"
//                 InputProps={{ inputProps: { min: 1, max: 5 } }}
//                 {...register("Difficulty", {
//                   required: "שדה זה חובה",
//                   min: { value: 1, message: "הערך המינימלי הוא 1" },
//                   max: { value: 5, message: "הערך המקסימלי הוא 5" },
//                 })}
//                 error={!!errors.Difficulty}
//                 helperText={errors.Difficulty?.message?.toString()}
//                 margin="normal"
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="זמן הכנה (לדוגמה: '30 דקות')"
//                 {...register("Duration", { required: "שדה זה חובה" })}
//                 error={!!errors.Duration}
//                 helperText={errors.Duration?.message?.toString()}
//                 margin="normal"
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <TextField fullWidth label="תיאור קצר" multiline rows={2} {...register("Description")} margin="normal" />
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="הוראות הכנה (שורה לכל שלב)"
//                 multiline
//                 rows={4}
//                 {...register("Instructions", { required: "שדה זה חובה" })}
//                 error={!!errors.Instructions}
//                 helperText={errors.Instructions?.message?.toString()}
//                 margin="normal"
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Typography variant="h6" gutterBottom>
//                 רכיבי המתכון
//               </Typography>
//               <Paper variant="outlined" sx={{ p: 2 }}>
//                 {fields.map((item, index) => (
//                   <Box key={item.id} sx={{ mb: 2 }}>
//                     {index > 0 && <Divider sx={{ my: 2 }} />}
//                     <Grid container spacing={2} alignItems="center">
//                       <Grid item xs={12} sm={4}>
//                         <TextField
//                           fullWidth
//                           label="שם מוצר"
//                           {...register(`Ingridents.${index}.Name`, { required: "שדה זה חובה" })}
//                           error={!!errors.Ingridents?.[index]?.Name}
//                           helperText={errors.Ingridents?.[index]?.Name?.message?.toString()}
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={3}>
//                         <TextField
//                           fullWidth
//                           label="כמות"
//                           type="number"
//                           {...register(`Ingridents.${index}.Count`, { required: "שדה זה חובה" })}
//                           error={!!errors.Ingridents?.[index]?.Count}
//                           helperText={errors.Ingridents?.[index]?.Count?.message?.toString()}
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={3}>
//                         <TextField
//                           fullWidth
//                           label="סוג כמות"
//                           {...register(`Ingridents.${index}.Type`, { required: "שדה זה חובה" })}
//                           error={!!errors.Ingridents?.[index]?.Type}
//                           helperText={errors.Ingridents?.[index]?.Type?.message?.toString()}
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={2}>
//                         <IconButton color="error" onClick={() => remove(index)} disabled={fields.length === 1}>
//                           <RemoveIcon />
//                         </IconButton>
//                       </Grid>
//                     </Grid>
//                   </Box>
//                 ))}
//                 <Box sx={{ mt: 2, textAlign: "center" }}>
//                   <Button
//                     variant="outlined"
//                     startIcon={<AddIcon />}
//                     onClick={() => append({ Name: "", Count: "", Type: "" })}
//                   >
//                     הוסף רכיב
//                   </Button>
//                 </Box>
//               </Paper>
//             </Grid>
//           </Grid>
//         </form>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="inherit">
//           ביטול
//         </Button>
//         <Button type="submit" form="edit-recipe-form" variant="contained" color="primary">
//           עדכן מתכון
//         </Button>
//       </DialogActions>
//     </Dialog>
//   )
// }

// export default Recipes


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { 
//   Box, 
//   Card, 
//   CardActionArea, 
//   CardContent, 
//   CardMedia, 
//   CircularProgress, 
//   Container, 
//   Grid, 
//   Typography 
// } from "@mui/material";
// import { Recipe } from "../Models/recipe";
// // / קומפוננט להצגת רשימת המתכונים
// const RecipeList: React.FC = () => {
//     const [recipes, setRecipes] = useState<Recipe[]>([]);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchRecipes = async () => {
//             try {
//                 setLoading(true);
//                 const response = await axios.get("http://localhost:8080/api/recipe");
//                 setRecipes(response.data);
//                 setLoading(false);
//             } catch (err) {
//                 setError("שגיאה בטעינת המתכונים");
//                 setLoading(false);
//                 console.error(err);
//             }
//         };

//         fetchRecipes();
//     }, []);

//     const handleRecipeClick = (recipeId: number) => {
//         navigate(`/recipe/${recipeId}`);
//     };

//     if (loading) {
//         return (
//             <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//                 <CircularProgress />
//             </Box>
//         );
//     }

//     if (error) {
//         return (
//             <Box sx={{ textAlign: "center", mt: 4 }}>
//                 <Typography color="error">{error}</Typography>
//             </Box>
//         );
//     }

//     return (
//         <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
//             <Typography 
//                 variant="h3" 
//                 component="h1" 
//                 gutterBottom 
//                 sx={{ 
//                     textAlign: "center", 
//                     mb: 4,
//                     color: "#5E2B12",
//                     fontWeight: "bold" 
//                 }}
//             >
//                 המתכונים שלנו
//             </Typography>
            
//             <Grid container spacing={3}>
//                 {recipes.map((recipe) => (
//                     <Grid item xs={12} sm={6} md={4} key={recipe.Id}>
//                         <Card 
//                             sx={{ 
//                                 height: "100%", 
//                                 display: "flex", 
//                                 flexDirection: "column",
//                                 transition: "transform 0.3s, box-shadow 0.3s",
//                                 "&:hover": {
//                                     transform: "translateY(-8px)",
//                                     boxShadow: "0 12px 20px rgba(0,0,0,0.2)",
//                                 },
//                                 borderRadius: 2,
//                                 overflow: "hidden"
//                             }}
//                         >
//                             <CardActionArea 
//                                 onClick={() => recipe.Id && handleRecipeClick(recipe.Id)}
//                                 sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
//                             >
//                                 <CardMedia
//                                     component="img"
//                                     height="180"
//                                     image={recipe.Img || "https://via.placeholder.com/300x180?text=אין+תמונה"}
//                                     alt={recipe.Name}
//                                     sx={{ objectFit: "cover" }}
//                                 />
//                                 <CardContent sx={{ flexGrow: 1, bgcolor: "#FEF8F0" }}>
//                                     <Typography 
//                                         gutterBottom 
//                                         variant="h5" 
//                                         component="div"
//                                         sx={{ 
//                                             color: "#5E2B12",
//                                             fontWeight: "bold",
//                                             textAlign: "center" 
//                                         }}
//                                     >
//                                         {recipe.Name}
//                                     </Typography>
//                                     <Typography 
//                                         variant="body2" 
//                                         color="text.secondary"
//                                         sx={{ 
//                                             overflow: "hidden",
//                                             textOverflow: "ellipsis",
//                                             display: "-webkit-box",
//                                             WebkitLineClamp: 3,
//                                             WebkitBoxOrient: "vertical",
//                                             textAlign: "center"
//                                         }}
//                                     >
//                                         {recipe.Description}
//                                     </Typography>
//                                 </CardContent>
//                             </CardActionArea>
//                         </Card>
//                     </Grid>
//                 ))}
//             </Grid>
//         </Container>
//     );
// };
// export default RecipeList

// //2
// "use client"

// import type { Recipe } from "../Models/recipe"
// import type React from "react"
// import { useEffect, useState } from "react"
// import axios from "axios"
// import {
//   Box,
//   Button,
//   Card,
//   CardActions,
//   CardContent,
//   CardMedia,
//   Container,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Divider,
//   FormControl,
//   Grid,
//   IconButton,
//   InputLabel,
//   MenuItem,
//   Select,
//   TextField,
//   Typography,
//   Paper,
//   Stack,
//   Chip,
//   FormHelperText,
// } from "@mui/material"
// import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material"
// import { useFieldArray, useForm, Controller } from "react-hook-form"

// const Recipes = () => {
//   const [recipes, setRecipes] = useState<Recipe[]>([]) // רשימת המתכונים
//   const [categories, setCategories] = useState<{ Id: number; Name: string }[]>([]) // רשימת הקטגוריות
//   const [openEditDialog, setOpenEditDialog] = useState(false)
//   const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
//   const [loading, setLoading] = useState(false)

//   // שמירת הערכים של הסינון
//   const [filters, setFilters] = useState({
//     category: 0,
//     duration: 0,
//     difficulty: "",
//     createdBy: "",
//   })

//   // טעינת המתכונים והקטגוריות מהשרת
//   const fetchRecipes = async () => {
//     try {
//       setLoading(true)
//       const response = await axios.get("http://localhost:8080/api/recipe")
//       setRecipes(response.data)
//       setLoading(false)
//     } catch (error) {
//       console.error("Error fetching recipes:", error)
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchRecipes()

//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get("http://localhost:8080/api/category")
//         setCategories(response.data) // שמירה של הקטגוריות במבנה נכון
//       } catch (error) {
//         console.error("Error fetching categories:", error)
//       }
//     }

//     fetchCategories()
//   }, [])

//   // עדכון משתני הסינון
//   const handlerFilter = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
//     setFilters({ ...filters, [event.target.name]: event.target.value })
//   }

//   // סינון המתכונים לפי הבחירות של המשתמש
//   const filteredRecipes = recipes.filter((recipe) => {
//     return (
//       (!filters.category || recipe.CategoryId === Number(filters.category)) &&
//       (!filters.duration || recipe.Duration === filters.duration) &&
//       (!filters.difficulty || recipe.Difficulty === filters.difficulty)
//     )
//   })

//   // פתיחת חלון העריכה
//   const handleEditClick = (recipe: Recipe) => {
//     setSelectedRecipe(recipe)
//     setOpenEditDialog(true)
//   }

//   // סגירת חלון העריכה
//   const handleCloseEditDialog = () => {
//     setOpenEditDialog(false)
//     setSelectedRecipe(null)
//   }

//   // מחיקת מתכון
//   const handleDeleteClick = async (recipeId: number) => {
//     if (window.confirm("האם אתה בטוח שברצונך למחוק מתכון זה?")) {
//       try {
//         await axios.delete(`http://localhost:8080/api/recipe/${recipeId}`)
//         // רענון רשימת המתכונים
//         fetchRecipes()
//         alert("המתכון נמחק בהצלחה!")
//       } catch (error) {
//         console.error("Error deleting recipe:", error)
//         alert("אירעה שגיאה במחיקת המתכון")
//       }
//     }
//   }

//   return (
//     <Container maxWidth="lg" sx={{ mt: 4, mb: 4, direction: "rtl" }}>
//       <Typography variant="h4" component="h1" gutterBottom align="center">
//         המתכונים שלנו
//       </Typography>

//       {/* טופס הסינון */}
//       <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
//         <Typography variant="h6" gutterBottom>
//           סינון מתכונים
//         </Typography>
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={3}>
//             <FormControl fullWidth>
//               <InputLabel id="category-label">קטגוריה</InputLabel>
//               <Select
//                 labelId="category-label"
//                 name="category"
//                 value={filters.category}
//                 onChange={handlerFilter}
//                 label="קטגוריה"
//               >
//                 <MenuItem value={0}>כל הקטגוריות</MenuItem>
//                 {categories.map((category) => (
//                   <MenuItem key={category.Id} value={category.Id}>
//                     {category.Name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <TextField
//               fullWidth
//               type="number"
//               name="duration"
//               label="משך זמן (דקות)"
//               value={filters.duration}
//               onChange={handlerFilter}
//             />
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <TextField
//               fullWidth
//               type="number"
//               name="difficulty"
//               label="רמת קושי"
//               value={filters.difficulty}
//               onChange={handlerFilter}
//             />
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <TextField
//               fullWidth
//               name="createdBy"
//               label="נוצר על ידי"
//               value={filters.createdBy}
//               onChange={handlerFilter}
//             />
//           </Grid>
//         </Grid>
//       </Paper>

//       {/* הצגת המתכונים */}
//       {loading ? (
//         <Typography>טוען מתכונים...</Typography>
//       ) : (
//         <Grid container spacing={3}>
//           {filteredRecipes.length > 0 ? (
//             filteredRecipes.map((recipe) => (
//               <Grid item xs={12} sm={6} md={4} key={recipe.Id}>
//                 <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
//                   <CardMedia
//                     component="img"
//                     height="200"
//                     image={recipe.Img || "/placeholder.svg?height=200&width=300"}
//                     alt={recipe.Name}
//                   />
//                   <CardContent sx={{ flexGrow: 1 }}>
//                     <Typography variant="h5" component="h2" gutterBottom>
//                       {recipe.Name}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary" paragraph>
//                       {recipe.Description}
//                     </Typography>
//                     <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
//                       <Chip label={`רמת קושי: ${recipe.Difficulty}`} color="primary" variant="outlined" />
//                       <Chip label={`זמן הכנה: ${recipe.Duration} דקות`} color="secondary" variant="outlined" />
//                     </Stack>
//                   </CardContent>
//                   <CardActions>
//                     <Button size="small" startIcon={<EditIcon />} onClick={() => handleEditClick(recipe)}>
//                       עריכה
//                     </Button>
//                     <Button
//                       size="small"
//                       color="error"
//                       startIcon={<DeleteIcon />}
//                       onClick={() => handleDeleteClick(recipe.Id)}
//                     >
//                       מחיקה
//                     </Button>
//                   </CardActions>
//                 </Card>
//               </Grid>
//             ))
//           ) : (
//             <Grid item xs={12}>
//               <Typography variant="h6" align="center">
//                 לא נמצאו מתכונים
//               </Typography>
//             </Grid>
//           )}
//         </Grid>
//       )}

//       {/* חלון עריכת מתכון */}
//       {selectedRecipe && (
//         <EditRecipeDialog
//           open={openEditDialog}
//           onClose={handleCloseEditDialog}
//           recipe={selectedRecipe}
//           categories={categories}
//           onSuccess={fetchRecipes}
//         />
//       )}
//     </Container>
//   )
// }

// // קומפוננטת עריכת מתכון
// interface EditRecipeDialogProps {
//   open: boolean
//   onClose: () => void
//   recipe: Recipe
//   categories: { Id: number; Name: string }[]
//   onSuccess: () => void
// }

// const EditRecipeDialog = ({ open, onClose, recipe, categories, onSuccess }: EditRecipeDialogProps) => {
//   const {
//     control,
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm({
//     defaultValues: {
//       Id: recipe.Id,
//       Name: recipe.Name,
//       Instructions: recipe.Instructions
//         ? recipe.Instructions.map((instruction: { Name: string }) => instruction.Name).join("\n")
//         : "",
//       Difficulty: recipe.Difficulty.toString(),
//       Duration: recipe.Duration,
//       Description: recipe.Description || "",
//       UserId: recipe.UserId,
//       CategoryId: recipe.CategoryId,
//       Img: recipe.Img || "",
//       Ingridents:
//         recipe.Ingridents && recipe.Ingridents.length > 0 ? recipe.Ingridents : [{ Name: "", Count: "", Type: "" }],
//     },
//   })

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "Ingridents",
//   })

//   useEffect(() => {
//     if (open && recipe) {
//       reset({
//         Id: recipe.Id,
//         Name: recipe.Name,
//         Instructions: recipe.Instructions
//           ? recipe.Instructions.map((instruction: { Name: string }) => instruction.Name).join("\n")
//           : "",
//         Difficulty: recipe.Difficulty.toString(),
//         Duration: recipe.Duration,
//         Description: recipe.Description || "",
//         UserId: recipe.UserId,
//         CategoryId: recipe.CategoryId,
//         Img: recipe.Img || "",
//         Ingridents:
//           recipe.Ingridents && recipe.Ingridents.length > 0 ? recipe.Ingridents : [{ Name: "", Count: "", Type: "" }],
//       })
//     }
//   }, [open, recipe, reset])

//   const handleUpdateRecipe = async (data: any) => {
//     try {
//       // Format the data for submission
//       const formattedData = {
//         Id: data.Id,
//         Name: data.Name,
//         Instructions: data.Instructions.split("\n")
//           .filter((line: string) => line.trim() !== "")
//           .map((line: string) => ({ Name: line.trim() })),
//         Difficulty: Number(data.Difficulty),
//         Duration: data.Duration,
//         Description: data.Description,
//         UserId: Number(data.UserId),
//         CategoryId: Number(data.CategoryId),
//         Img: data.Img,
//         Ingridents: data.Ingridents,
//       }

//       // Send update request
//       await axios.post("http://localhost:8080/api/recipe/edit", formattedData, {
//         headers: { "Content-Type": "application/json" },
//       })

//       alert("המתכון עודכן בהצלחה! 🎉")
//       onSuccess() // רענון רשימת המתכונים
//       onClose() // סגירת החלון
//     } catch (error: any) {
//       if (error?.errors && error.errors.length > 0) {
//         alert(`שגיאה: ${error.errors[0].message}`)
//       } else {
//         console.error("שגיאה כללית:", error.message || error)
//         alert("אירעה שגיאה בעדכון המתכון. אנא נסה שוב.")
//       }
//     }
//   }

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="md"
//       fullWidth
//       PaperProps={{
//         sx: {
//           direction: "rtl",
//           minHeight: "80vh",
//         },
//       }}
//     >
//       <DialogTitle>
//         <Typography variant="h5">עריכת מתכון: {recipe.Name}</Typography>
//       </DialogTitle>
//       <DialogContent dividers>
//         <form id="edit-recipe-form" onSubmit={handleSubmit(handleUpdateRecipe)}>
//           <input type="hidden" {...register("Id")} />
//           <input type="hidden" {...register("UserId")} />

//           <Grid container spacing={3}>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="שם המתכון"
//                 {...register("Name", { required: "שדה זה חובה" })}
//                 error={!!errors.Name}
//                 helperText={errors.Name?.message?.toString()}
//                 margin="normal"
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <Controller
//                 name="CategoryId"
//                 control={control}
//                 rules={{ required: "שדה זה חובה" }}
//                 render={({ field }) => (
//                   <FormControl fullWidth error={!!errors.CategoryId} margin="normal">
//                     <InputLabel>קטגוריה</InputLabel>
//                     <Select {...field} label="קטגוריה">
//                       <MenuItem value="">בחר קטגוריה</MenuItem>
//                       {categories.map((category) => (
//                         <MenuItem key={category.Id} value={category.Id.toString()}>
//                           {category.Name}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                     {errors.CategoryId && <FormHelperText>{errors.CategoryId.message?.toString()}</FormHelperText>}
//                   </FormControl>
//                 )}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField fullWidth label="URL לתמונה" {...register("Img")} margin="normal" />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="רמת קושי (1-5)"
//                 type="number"
//                 InputProps={{ inputProps: { min: 1, max: 5 } }}
//                 {...register("Difficulty", {
//                   required: "שדה זה חובה",
//                   min: { value: 1, message: "הערך המינימלי הוא 1" },
//                   max: { value: 5, message: "הערך המקסימלי הוא 5" },
//                 })}
//                 error={!!errors.Difficulty}
//                 helperText={errors.Difficulty?.message?.toString()}
//                 margin="normal"
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="זמן הכנה (לדוגמה: '30 דקות')"
//                 {...register("Duration", { required: "שדה זה חובה" })}
//                 error={!!errors.Duration}
//                 helperText={errors.Duration?.message?.toString()}
//                 margin="normal"
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <TextField fullWidth label="תיאור קצר" multiline rows={2} {...register("Description")} margin="normal" />
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="הוראות הכנה (שורה לכל שלב)"
//                 multiline
//                 rows={4}
//                 {...register("Instructions", { required: "שדה זה חובה" })}
//                 error={!!errors.Instructions}
//                 helperText={errors.Instructions?.message?.toString()}
//                 margin="normal"
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Typography variant="h6" gutterBottom>
//                 רכיבי המתכון
//               </Typography>
//               <Paper variant="outlined" sx={{ p: 2 }}>
//                 {fields.map((item, index) => (
//                   <Box key={item.id} sx={{ mb: 2 }}>
//                     {index > 0 && <Divider sx={{ my: 2 }} />}
//                     <Grid container spacing={2} alignItems="center">
//                       <Grid item xs={12} sm={4}>
//                         <TextField
//                           fullWidth
//                           label="שם מוצר"
//                           {...register(`Ingridents.${index}.Name`, { required: "שדה זה חובה" })}
//                           error={!!errors.Ingridents?.[index]?.Name}
//                           helperText={errors.Ingridents?.[index]?.Name?.message?.toString()}
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={3}>
//                         <TextField
//                           fullWidth
//                           label="כמות"
//                           type="number"
//                           {...register(`Ingridents.${index}.Count`, { required: "שדה זה חובה" })}
//                           error={!!errors.Ingridents?.[index]?.Count}
//                           helperText={errors.Ingridents?.[index]?.Count?.message?.toString()}
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={3}>
//                         <TextField
//                           fullWidth
//                           label="סוג כמות"
//                           {...register(`Ingridents.${index}.Type`, { required: "שדה זה חובה" })}
//                           error={!!errors.Ingridents?.[index]?.Type}
//                           helperText={errors.Ingridents?.[index]?.Type?.message?.toString()}
//                         />
//                       </Grid>
//                       <Grid item xs={12} sm={2}>
//                         <IconButton color="error" onClick={() => remove(index)} disabled={fields.length === 1}>
//                           <RemoveIcon />
//                         </IconButton>
//                       </Grid>
//                     </Grid>
//                   </Box>
//                 ))}
//                 <Box sx={{ mt: 2, textAlign: "center" }}>
//                   <Button
//                     variant="outlined"
//                     startIcon={<AddIcon />}
//                     onClick={() => append({ Name: "", Count: "", Type: "" })}
//                   >
//                     הוסף רכיב
//                   </Button>
//                 </Box>
//               </Paper>
//             </Grid>
//           </Grid>
//         </form>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="inherit">
//           ביטול
//         </Button>
//         <Button type="submit" form="edit-recipe-form" variant="contained" color="primary">
//           עדכן מתכון
//         </Button>
//       </DialogActions>
//     </Dialog>
//   )
// }

// export default Recipes
