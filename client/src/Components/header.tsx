"use client"

import React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../Hook/authUserContext"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import {
  Restaurant as RestaurantIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  Add as AddIcon,
} from "@mui/icons-material"

const Header = () => {
  const { isLoggedIn, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    handleClose()
    navigate("/home")
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <AppBar position="sticky" sx={{ bgcolor: "white", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", width: "100%" }}>
      <Toolbar sx={{ justifyContent: "space-between", py: 1, direction: "rtl", width: "100%", px: { xs: 2, md: 4 } }}>
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/home")}>
          <RestaurantIcon sx={{ color: "#d81b60", fontSize: 32, mr: 1 }} />
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#d81b60", display: { xs: "none", sm: "block" } }}>
            Yami
          </Typography>
        </Box>

        {/* Navigation */}
        {isMobile ? (
          <Box>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
              sx={{ color: "#d81b60" }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  handleClose()
                  navigate("/home")
                }}
              >
                דף הבית
              </MenuItem>
              {isLoggedIn ? (
                <>
                  <MenuItem
                    onClick={() => {
                      handleClose()
                      navigate("/recipes")
                    }}
                  >
                    המתכונים שלי
                  </MenuItem>
                  {/* <MenuItem
                    onClick={() => {
                      handleClose()
                      navigate("/addRecipe")
                    }}
                  >
                    <AddIcon fontSize="small" sx={{ ml: 1 }} />
                    הוסף מתכון
                  </MenuItem>
                  <Divider /> */}
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon fontSize="small" sx={{ ml: 1 }} />
                    התנתק
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem
                    onClick={() => {
                      handleClose()
                      navigate("/login")
                    }}
                  >
                    התחברות
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleClose()
                      navigate("/signin")
                    }}
                  >
                    הרשמה
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* <Button
              color="inherit"
              onClick={() => navigate("/home")}
              sx={{
                color: isActive("/home") ? "#d81b60" : "text.primary",
                fontWeight: isActive("/home") ? "bold" : "normal",
              }}
            >
              דף הבית
            </Button> */}
{/* 
            {isLoggedIn && (
              <>
                <Button
                  color="inherit"
                  onClick={() => navigate("/recipes")}
                  sx={{
                    color: isActive("/recipes") ? "#d81b60" : "text.primary",
                    fontWeight: isActive("/recipes") ? "bold" : "normal",
                  }}
                >
                  המתכונים שלי
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate("/addRecipe")}
                  sx={{
                    bgcolor: "#d81b60",
                    "&:hover": { bgcolor: "#c2185b" },
                    borderRadius: "20px",
                    px: 2,
                  }}
                >
                  הוסף מתכון
                </Button>
              </>
            )} */}

            {isLoggedIn ? (
              <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
                <IconButton onClick={handleMenu} size="small">
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: "#d81b60",
                      border: "2px solid white",
                    }}
                  >
                    <PersonIcon />
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  <MenuItem disabled>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {user?.UserName || "משתמש"}
                    </Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon fontSize="small" sx={{ ml: 1 }} />
                    התנתק
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<LoginIcon />}
                  onClick={() => navigate("/login")}
                  sx={{
                    borderColor: "#d81b60",
                    color: "#d81b60",
                    "&:hover": { borderColor: "#c2185b", bgcolor: "rgba(216, 27, 96, 0.04)" },
                  }}
                >
                  התחברות
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate("/signin")}
                  sx={{ bgcolor: "#d81b60", "&:hover": { bgcolor: "#c2185b" } }}
                >
                  הרשמה
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Header
