import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, CssBaseline, Box } from "@mui/material";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Container
      component="main"
      maxWidth="lg"
      sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", bgcolor: "#fff" }}
    >
      <CssBaseline />
      <Box sx={{ position: "absolute", top: 20, right: 20 }}>
        <Button
          variant="contained"
          startIcon={<FastfoodIcon />}
          onClick={() => navigate("/recipes")}
          sx={{ bgcolor: "#d81b60", color: "#fff", fontSize: "1.1rem", padding: "10px 20px", "&:hover": { bgcolor: "#c2185b" } }}
        >
          לכל המתכונים
        </Button>

        <Box sx={{ display: "flex", flexDirection: "column", marginTop: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/addRecipe")}
            sx={{ bgcolor: "#d81b60", color: "#fff", marginBottom: 1, "&:hover": { bgcolor: "#c2185b" } }}
          >
            הוספת מתכון
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate("/editRecipe")}
            sx={{ bgcolor: "#d81b60", color: "#fff", "&:hover": { bgcolor: "#c2185b" } }}
          >
            עריכת מתכון
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;