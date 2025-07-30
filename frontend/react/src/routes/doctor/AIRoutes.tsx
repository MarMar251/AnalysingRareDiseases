import { Routes, Route } from "react-router-dom";
import { AIAnalysis } from "../../components/doctor/AIAnalysis";
import { AIHistory } from "../../components/doctor/AIHistory";

export default function AIRoutes() {
    return (
        <Routes>
            <Route index element={<AIAnalysis />} />
            <Route path="history" element={<AIHistory />} />
        </Routes>
    );
}