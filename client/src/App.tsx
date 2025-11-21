import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Optional: add Navbar here */}
        <Outlet />
      </div>
    </div>
  );
}

export default App;
