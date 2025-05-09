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
  CardMedia,
  Grid,
  Typography,
  Container,
  IconButton,
  Tooltip,
  Paper,
  useTheme,
  alpha,
  Chip,
  Stack,
  Collapse,
  Divider,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter"
import CategoryIcon from "@mui/icons-material/Category"
import PersonIcon from "@mui/icons-material/Person"
import FilterListIcon from "@mui/icons-material/FilterList"
import ClearIcon from "@mui/icons-material/Clear"
import HomeIcon from '@mui/icons-material/Home';
import type { Recipe } from "../Models/recipe"

const Recipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [categories, setCategories] = useState<{ Id: number; Name: string }[]>([])
  const { user } = useAuth()
  const navigate = useNavigate()
  const theme = useTheme()
  const [showFilters, setShowFilters] = useState(false)

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
        setCategories(response.data)
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

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()

    if (window.confirm("האם אתה בטוח שברצונך למחוק את המתכון?")) {
      try {
        await axios.post(`http://localhost:8080/api/recipe/delete/${id}`, {
          id: id,
        })

        // עדכון הרשימה לאחר מחיקה
        setRecipes((prev) => prev.filter((r) => r.Id !== id))
      } catch (error) {
        console.error("שגיאה במחיקת המתכון:", error)
      }
    }
  }

  // ניווט לעמוד פרטי מתכון
  const navigateToRecipeDetails = (recipeId: number) => {
    navigate(`/recipe/${recipeId}`)
  }

  // מניעת ניווט בעת לחיצה על כפתורי עריכה ומחיקה
  const handleEdit = (e: React.MouseEvent, recipeId: number) => {
    e.stopPropagation()
    navigate(`/edit-recipe/${recipeId}`)
  }

  // בדיקה אם יש סינונים פעילים
  const hasActiveFilters = () => {
    return filters.category !== 0 || filters.duration !== 0 || filters.difficulty !== "" || filters.userId !== ""
  }

  return (
    <>
      {/* <Header /> */}
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          py: 4,
          px: 2,
          background: `linear-gradient(135deg, ${alpha("#f5f5f5", 0.8)} 0%, ${alpha("#fafafa", 0.8)} 100%)`,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", color: "#333" }}>
              המתכונים שלי
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={() => setShowFilters(!showFilters)}
                sx={{
                  position: 'sticky', // הופך את האלמנט לנעוץ
                  top: 16,           // מרחק מהקצה העליון (התאם לפי הצורך)
                  // zIndex: 1, 
                  borderColor: showFilters ? "#d81b60" : undefined,
                  color: showFilters ? "#d81b60" : undefined,
                  "&:hover": {
                    borderColor: "#d81b60",
                    color: "#d81b60",
                  },
                }}
              >
                {showFilters ? "הסתר סינונים" : " לסינון"}
              </Button>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/addRecipe")}
                sx={{
                  bgcolor: "#d81b60",
                  color: "#fff",
                  "&:hover": { bgcolor: "#c2185b" },
                  borderRadius: "30px",
                  px: 3,
                  py: 1,
                  boxShadow: "0 4px 10px rgba(216, 27, 96, 0.3)",
                }}
              >
                הוספת מתכון
              </Button>
              <Button
                variant="contained"
                startIcon={< HomeIcon/>}
                onClick={() => navigate("/home")}
                sx={{
                  bgcolor: "#d81b60",
                  color: "#fff",
                  "&:hover": { bgcolor: "#c2185b" },
                  borderRadius: "30px",
                  px: 3,
                  py: 1,
                  boxShadow: "0 4px 10px rgba(216, 27, 96, 0.3)",
                }}
              >
                חזרה לעמוד הבית
              </Button>
            </Stack>
          </Box>

          {/* טופס הסינון */}
          <Collapse in={showFilters}>
            <Paper
              elevation={0}
              sx={{
                mb: 4,
                p: 3,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                bgcolor: "white",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
                  <FilterListIcon sx={{ mr: 1, color: "#d81b60" }} />
                  סינון מתכונים
                </Typography>

                {hasActiveFilters() && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ClearIcon />}
                    onClick={resetFilters}
                    sx={{
                      borderColor: "#d81b60",
                      color: "#d81b60",
                      "&:hover": {
                        borderColor: "#c2185b",
                        bgcolor: alpha("#d81b60", 0.05),
                      },
                    }}
                  >
                    נקה סינונים
                  </Button>
                )}
              </Box>

              <Grid container spacing={2}>
                {/* סינון לפי קטגוריה */}
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel id="category-label">קטגוריה</InputLabel>
                    <Select
                      labelId="category-label"
                      name="category"
                      value={filters.category}
                      // onChange={handleFilter}
                      label="קטגוריה"
                      startAdornment={<CategoryIcon sx={{ mr: 1, color: alpha("#000", 0.54) }} />}
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
                      startAdornment={<FitnessCenterIcon sx={{ mr: 1, color: alpha("#000", 0.54) }} />}
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
                      startAdornment: <AccessTimeIcon sx={{ mr: 1, color: alpha("#000", 0.54) }} />,
                    }}
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
                      startAdornment: <PersonIcon sx={{ mr: 1, color: alpha("#000", 0.54) }} />,
                    }}
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

              {hasActiveFilters() && (
                <Box sx={{ mt: 3 }}>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    סינונים פעילים:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {filters.category !== 0 && (
                      <Chip
                        label={`קטגוריה: ${
                          categories.find((c) => c.Id === filters.category)?.Name || filters.category
                        }`}
                        onDelete={() => setFilters({ ...filters, category: 0 })}
                        color="primary"
                        size="small"
                        sx={{ bgcolor: "#d81b60" }}
                      />
                    )}
                    {filters.difficulty !== "" && (
                      <Chip
                        label={`רמת קושי: ${filters.difficulty}`}
                        onDelete={() => setFilters({ ...filters, difficulty: "" })}
                        color="primary"
                        size="small"
                        sx={{ bgcolor: "#d81b60" }}
                      />
                    )}
                    {filters.duration !== 0 && (
                      <Chip
                        label={`זמן הכנה: ${filters.duration} דקות ומטה`}
                        onDelete={() => setFilters({ ...filters, duration: 0 })}
                        color="primary"
                        size="small"
                        sx={{ bgcolor: "#d81b60" }}
                      />
                    )}
                    {filters.userId !== "" && (
                      <Chip
                        label={`מזהה משתמש: ${filters.userId}`}
                        onDelete={() => setFilters({ ...filters, userId: "" })}
                        color="primary"
                        size="small"
                        sx={{ bgcolor: "#d81b60" }}
                      />
                    )}
                  </Stack>
                </Box>
              )}
            </Paper>
          </Collapse>

          {/* הצגת המתכונים */}
          <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ color: "#555" }}>
              נמצאו {filteredRecipes.length} מתכונים
            </Typography>
          </Box>

          {filteredRecipes.length > 0 ? (
            <Grid container spacing={3}>
              {filteredRecipes.map((recipe) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={recipe.Id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3,
                      overflow: "hidden",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 20px rgba(0,0,0,0.15)",
                      },
                      position: "relative",
                    }}
                    onClick={() => navigateToRecipeDetails(Number(recipe.Id))}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={recipe.Img || "/placeholder.svg?height=200&width=300"}
                      alt={recipe.Name}
                      sx={{ objectFit: "cover" }}
                    />

                    <Box sx={{ p: 2, textAlign: "center" }}>
                      <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 1 }}>
                        {recipe.Name}
                      </Typography>
                    </Box>

                    {user?.Id === recipe.UserId && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          display: "flex",
                          gap: 1,
                          zIndex: 2,
                        }}
                      >
                        <Tooltip title="עריכה" arrow>
                          <Paper
                            elevation={2}
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              bgcolor: "rgba(255, 255, 255, 0.9)",
                              backdropFilter: "blur(4px)",
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={(e) => handleEdit(e, Number(recipe.Id))}
                              sx={{ color: "#2196f3" }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Paper>
                        </Tooltip>

                        <Tooltip title="מחיקה" arrow>
                          <Paper
                            elevation={2}
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              bgcolor: "rgba(255, 255, 255, 0.9)",
                              backdropFilter: "blur(4px)",
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={(e) => handleDelete(Number(recipe.Id), e)}
                              sx={{ color: "#f44336" }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Paper>
                        </Tooltip>
                      </Box>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper
              elevation={0}
              sx={{
                p: 6,
                borderRadius: 3,
                textAlign: "center",
                bgcolor: "white",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <Typography variant="h5" sx={{ mb: 2, color: "text.secondary" }}>
                לא נמצאו מתכונים התואמים את הסינון
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
                נסה לשנות את הגדרות הסינון או להוסיף מתכונים חדשים
              </Typography>
              <Button
                variant="outlined"
                onClick={resetFilters}
                sx={{
                  borderColor: "#d81b60",
                  color: "#d81b60",
                  "&:hover": {
                    borderColor: "#c2185b",
                    bgcolor: alpha("#d81b60", 0.05),
                  },
                  mr: 2,
                }}
              >
                נקה סינונים
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/addRecipe")}
                sx={{
                  bgcolor: "#d81b60",
                  color: "#fff",
                  "&:hover": { bgcolor: "#c2185b" },
                  borderRadius: "30px",
                  px: 4,
                  py: 1.5,
                }}
              >
                הוסף מתכון חדש
              </Button>
            </Paper>
          )}
        </Container>
      </Box>
    </>
  )
}

export default Recipes














//בשבילי -ללא עיצוב
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
