import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

function Navbar() {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navStyle = ({ isActive }: { isActive: boolean }) =>
    `nav-link text-black hover:underline ${isActive ? "font-semibold underline" : ""}`;

  return (
    <nav className="flex justify-between items-center px-10 py-6 bg-white shadow-md">
      {/* Left-side nav */}
      <ul className="flex items-center space-x-8">
        <li>
          <NavLink to="/" className={navStyle}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className={navStyle}>
            About
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className={navStyle}>
            Contact
          </NavLink>
        </li>

        {user && (
          <>
            <li>
              <NavLink to="/problems" className={navStyle}>
                Challenges
              </NavLink>
            </li>
            <li>
              <NavLink to="/discussions" className={navStyle}>
                Discussions
              </NavLink>
            </li>
            <li>
              <NavLink to="/lobby" className={navStyle}>
                Lobby
              </NavLink>
            </li>
            <li>
              <NavLink to="/join-lobby" className={navStyle} >
                Join Lobby
              </NavLink>
            </li>
          </>
        )}
      </ul>

      {/* Right-side nav */}
      {user ? (
        <ul>
          <li>
            <NavLink
              to="#"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
              className="nav-link text-black hover:underline"
            >
              Logout
            </NavLink>
          </li>
        </ul>
      ) : (
        <ul className="flex space-x-6">
          <li>
            <NavLink to="/login" className={navStyle}>
              Login
            </NavLink>
          </li>
          <li>
            <NavLink to="/register" className={navStyle}>
              Register
            </NavLink>
          </li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
