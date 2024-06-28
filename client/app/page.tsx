import Image from "next/image";
import App from "../_components/JobTable/Table"
import Aapp from "../_components/TableNew/App"
import NavBar from "../_components/NavBar/NavBar"
import NewApp from "@/_components/table2.0/App";

export default function Home() {
  return (
    <div>
      <NavBar />
      <App />
      <Aapp />
      <NewApp />
    </div>
  );
}
