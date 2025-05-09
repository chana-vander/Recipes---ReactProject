import React from "react"
import { Box, Typography, Link, IconButton, useTheme, useMediaQuery } from "@mui/material"
import { Instagram, Facebook, GitHub } from "@mui/icons-material"

const Footer = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#f8f8f8",
        color: "#333",
        mt: 4,
        py: 3,
        px: { xs: 2, sm: 4 },
        borderTop: "5px solid #f48fb1",
        direction: "rtl",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: "bold", color: "#d81b60" }}>
          Yami - מתכונים באהבה
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton size="small" href="https://github.com" target="_blank">
            <GitHub sx={{ color: "#333" }} />
          </IconButton>
          <IconButton size="small" href="https://facebook.com" target="_blank">
            <Facebook sx={{ color: "#3b5998" }} />
          </IconButton>
          <IconButton size="small" href="https://instagram.com" target="_blank">
            <Instagram sx={{ color: "#d81b60" }} />
          </IconButton>
        </Box>
      </Box>

      <Typography variant="caption" sx={{ display: "block", mt: 2, color: "#888" }}>
        © {new Date().getFullYear()} כל הזכויות שמורות ל־Yami
      </Typography>
    </Box>
  )
}

export default Footer
