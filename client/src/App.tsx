
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Components/home';
import Login from'./Components/login'
import SignIn from './Components/signIn';
import Recipes from "./Components/recipes";
import AddRecipe from './Components/add_recipe';
import EditRecipe from './Components/edit_recipe';
import RecipeDetails from './Components/recipe_details';
import Dashboard from './Components/menu';
import { AuthProvider } from './Hook/authUserContext';
import Layout from "./Components/layout";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* כאן כל הדפים עטופים ב-Header */}
          <Route path='/' element={<Layout />}>
            <Route path='home' element={<Home />} />
            <Route path='login' element={<Login />} />
            <Route path='signin' element={<SignIn />} />
            <Route path='menu' element={<Dashboard />} />
            <Route path='recipes' element={<Recipes />} />
            <Route path='recipe/:id' element={<RecipeDetails />} />
            <Route path='edit-recipe/:id' element={<EditRecipe />} />
            <Route path='addRecipe' element={<AddRecipe />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
