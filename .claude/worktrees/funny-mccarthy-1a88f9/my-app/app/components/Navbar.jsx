"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import "../styles/navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    setIsLoggedIn(!!token);
    setRole(userRole);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const syncAuthState = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("storage", syncAuthState);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", syncAuthState);
    };
  }, [pathname]);

  // 🔥 active logic (ماعدا home ليه condition خاص)
  const isActive = (path) => pathname.startsWith(path);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setRole(null);
    router.push("/login");
  };

  // 🔥 تحديد لينك البروفايل
  const getProfilePath = () => {
    if (role === "admin") return "/admin";
    return "/profile";
  };

  const getOrdersPath = () => {
  if (role === "parent") return "/my-appointments";

  if (
    role === "school" ||
    role === "clinic" ||
    role === "sport"
  )
    return "/provider-appointments";

  return "/"; // fallback
};

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div
        className="logo"
        onClick={() => router.push("/")}
        style={{ cursor: "pointer" }}
      >
        <Image src="/images/logo.jpeg" alt="logo" width={40} height={40} />
        <span>INSPIRABILITY</span>
      </div>

      <ul className="nav-links">

        {/* ✅ Home condition خاص */}
        <li className={pathname === "/home" || pathname === "/" ? "active" : ""}>
          <Link href="/home">Home</Link>
        </li>

        <li className={isActive("/about") ? "active" : ""}>
          <Link href="/about">About</Link>
        </li>

        <li className={isActive("/services") ? "active" : ""}>
          <Link href="/services">Services</Link>
        </li>

        <li className={isActive("/contact") ? "active" : ""}>
          <Link href="/contact">Contact</Link>
        </li>

        <li className={isActive("/pricing") ? "active" : ""}>
          <Link href="/pricing">Pricing</Link>
        </li>

        {mounted && (
          <>
            {!isLoggedIn ? (
              <>
                <li className={isActive("/signup") ? "active" : ""}>
                  <Link href="/signup">Sign Up</Link>
                </li>

                <li>
                  <Link
                    href="/login"
                    className={`login-btn ${
                      isActive("/login") ? "active-btn" : ""
                    }`}
                  >
                    Login
                  </Link>
                </li>
              </>
            ) : (
              <>
                {/* ✅ Profile dynamic */}
                <li className={isActive(getProfilePath()) ? "active" : ""}>
                  <Link href={getProfilePath()} className="profile-link">
                    Profile
                  </Link>
                </li>
                {/* ✅ Orders dynamic */}
                {isLoggedIn && (
  <li className={isActive(getOrdersPath()) ? "active" : ""}>
    <Link href={getOrdersPath()}>Orders</Link>
  </li>
)}

                <li>
                  <button onClick={handleLogout} className="logout-btn-nav">
                    Logout
                  </button>
                </li>
              </>
            )}
          </>
        )}
      </ul>
    </nav>
  );
}