import { Outlet } from "react-router-dom";

import Navbar from "client/common/Navbar";
import Footer from "client/common/Footer";

function Layout()
{
    return(
        <div>
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    )
}

export default Layout;