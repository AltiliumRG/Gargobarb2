import { useState } from "react";
import DashboardLayout from "../../components/barber/dashboard/DashboardLayout";
import Overview from "./dashboard/Overview";
import Income from "./dashboard/Income";
import Appointments from "./dashboard/Appointments";
import Employees from "./dashboard/Employees";
import Clients from "./dashboard/Clients";
import ServicesAnalytics from "./dashboard/ServicesAnalytics";
import SalesHistory from "./dashboard/SalesHistory";

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("overview");

    const renderContent = (data) => {
        switch (activeTab) {
            case "overview": return <Overview data={data} />;
            case "income": return <Income data={data} />;
            case "appointments": return <Appointments data={data} />;
            case "employees": return <Employees data={data} />;
            case "clients": return <Clients data={data} />;
            case "services": return <ServicesAnalytics data={data} />;
            case "sales": return <SalesHistory data={data} />;
            default: return <Overview data={data} />;
        }
    };

    return (
        <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            {(data) => renderContent(data)}
        </DashboardLayout>
    );
}
