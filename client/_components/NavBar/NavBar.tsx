"use client"
import Image from "next/image";
import logo from "@/public/Group.svg";
import "./NavBar.css";
import Link from "next/link";

const NavBar = () => {
    return (
        <div className="navbar">
            <div>
                <Image src={logo} alt="logo" />
            </div>
            <div className="rightNavBar">
                <Link href="/"><div>Dashboard</div></Link>
                <Link href="/jobs"><div>Jobs</div></Link>
                <Link href="/Profile"><div>Login</div></Link>
            </div>
        </div>
    )
}

export default NavBar;
