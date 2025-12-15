import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "./Pages/Dashboard";
import { LoginPage } from "./Pages/Login";
import { BudgetPage } from "./Pages/Budget";
import { TransactionsPage } from "./Pages/Transactions";

function RequireUserId({ children }: { children: JSX.Element }) {
    const userId = localStorage.getItem("userId");
    if (!userId) return <Navigate to="/" replace />;
    return children;
}

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />

                <Route
                    path="/dashboard"
                    element={
                        <RequireUserId>
                            <Dashboard />
                        </RequireUserId>
                    }
                />

                <Route
                    path="/budget"
                    element={
                        <RequireUserId>
                            <BudgetPage />
                        </RequireUserId>
                    }
                />

                <Route
                    path="/transactions"
                    element={
                        <RequireUserId>
                            <TransactionsPage />
                        </RequireUserId>
                    }
                />

                {/* optional: unknown routes go to budget if logged in, else login */}
                <Route
                    path="*"
                    element={
                        localStorage.getItem("userId") ? (
                            <Navigate to="/budget" replace />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />
            </Routes>
        </Router>
    );
}
