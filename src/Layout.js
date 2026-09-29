// import react from "react";
// import { Route } from "react-router-dom";
import Header from "./components/header/Header";
import { Outlet } from "react-router-dom";
import { Footer } from "./components/footer/Footer";
// import Card from "./components/Cards/Card";
import ExtraText from "./components/demo/ExtraText";

function Layout() {
    return (
        <>
            <Header />
            <main className="pt-24">
                <ExtraText />
                <Outlet />
            </main>
            <Footer />

        </>
    );
}


export default Layout;