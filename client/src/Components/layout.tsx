import { AppBar } from "@mui/material";
import Header from "./header";
import Footer from "./footer"
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div>
            <AppBar position="fixed">
                <Header />
            </AppBar>

            <main style={{ paddingTop: '64px' }}>
                <Outlet />
            </main>

            {<AppBar position="static">
                <Footer></Footer>
            </AppBar> } 
        </div>
    );
};
export default Layout