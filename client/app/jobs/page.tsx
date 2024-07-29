import JobTable from "@/_components/Job/Job";
import Page from "@/_components/Job/New";
import NavBar from "@/_components/NavBar/NavBar"

export default function Home() {
    return (
        <div>
            <NavBar />
            <JobTable />
            {/* <Page /> */}
        </div>
    );
}
