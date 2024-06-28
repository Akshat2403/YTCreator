"use client"
import Image from "next/image";
import logo from "@/public/Group.svg";
import "./NavBar.css";

const NavBar = () => {
    return (
        <div className="navbar">
            <div>
                <Image src={logo} alt="logo" />
            </div>
            <div className="rightNavBar">
                <div>Dashboard</div>
                <div>Jobs</div>
                <div>Login</div>
            </div>
        </div>
    )
}

export default NavBar;
