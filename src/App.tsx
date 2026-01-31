import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/demand/Dashboard";
import CreateRequirement from "@/pages/demand/CreateRequirement";
import TaskSquare from "@/pages/supply/TaskSquare";
import Workbench from "@/pages/supply/Workbench";
import MyTasks from "@/pages/supply/MyTasks";
import Wallet from "@/pages/supply/Wallet";
import Profile from "@/pages/supply/Profile";
import Messages from "@/pages/supply/Messages";
import Application from "@/pages/supply/Application";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        {/* Demand Side Routes */}
        <Route path="/demand/dashboard" element={<Dashboard />} />
        <Route path="/demand/create" element={<CreateRequirement />} />
        
        {/* Supply Side Routes */}
        <Route path="/supply/square" element={<TaskSquare />} />
        <Route path="/supply/workbench" element={<Workbench />} />
        <Route path="/supply/tasks" element={<MyTasks />} />
        <Route path="/supply/wallet" element={<Wallet />} />
        <Route path="/supply/profile" element={<Profile />} />
        <Route path="/supply/messages" element={<Messages />} />
        <Route path="/supply/application/:taskId" element={<Application />} />
        
        {/* Fallback */}
        <Route path="*" element={<div className="text-center text-xl mt-20">Page Not Found</div>} />
      </Routes>
    </Router>
  );
}
