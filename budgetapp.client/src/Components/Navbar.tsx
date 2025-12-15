import { Link, useNavigate } from "react-router-dom";

export function Navbar() {
    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem("userId");
        navigate("/", { replace: true });
    }

    return (
        <div className="sticky top-0 z-50 bg-white border-b">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center">
                <div className="font-bold text-xl">ClearDollar</div>

                <div className="ml-auto flex gap-2 items-center">
                    <Link to="/dashboard">
                        <button className="px-3 py-1.5 border rounded-lg hover:bg-gray-50">
                            Dashboard
                        </button>
                    </Link>

                    <Link to="/budget">
                        <button className="px-3 py-1.5 border rounded-lg hover:bg-gray-50">
                            Budget
                        </button>
                    </Link>

                    <Link to="/transactions">
                        <button className="px-3 py-1.5 border rounded-lg hover:bg-gray-50">
                            Transactions
                        </button>
                    </Link>

                    {/* Logout */}
                    <button
                        onClick={logout}
                        className="px-3 py-1.5 border rounded-lg text-red-600 border-red-200 hover:bg-red-50"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
