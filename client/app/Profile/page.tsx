import Profile from "@/_components/Profile/Profile";
import NavBar from "@/_components/NavBar/NavBar"

export default function Home() {
    return (
        <div className="bg-transparent">
            <NavBar />
            <Profile />
        </div>
    );
}
