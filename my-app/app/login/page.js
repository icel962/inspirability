"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "../signup/signup.css";
import { showToast } from "../utils/toast";

export default function Login() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    if (!formData.email || !formData.password)
      return showToast("Please enter your email and password.", "warning");

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) return showToast(data.message || "Login failed", "error");

      console.log("Logged in user:", data.user);
      console.log("User role:", data.user.role);
      console.log("Approval status:", data.user.approval_status);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("payment_status", data.user.payment_status);
      localStorage.setItem("approval_status", data.user.approval_status);

      const isProvider =
        data.user.role === "school" ||
        data.user.role === "clinic" ||
        data.user.role === "sport";

      const shouldShowReviewModal = isProvider && data.user.approval_status === "pending";
      console.log("Should show review modal:", shouldShowReviewModal);

if (isProvider && data.user.showApprovalMessage) {

  showToast("Your account has been approved by admin!", "success");

  await fetch(
    "http://localhost:5000/api/hide-approval-message",
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    }
  );
}

if (isProvider && data.user.showPaymentMessage) {

  showToast("Your payment has been approved successfully!", "success");

  await fetch(
    "http://localhost:5000/api/hide-payment-message",
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    }
  );
}

if (isProvider && data.user.payment_status !== "approved") {
  router.push("/flat-fee");
  return;
}

      // 🔥 redirect حسب الرول من الباك
switch (data.user.role) {
  case "parent":
    router.replace("/home");
    break;

  case "admin":
    router.replace("/admin");
    break;

  case "clinic":
  case "sport":
  case "school":
    router.replace("/profile");
    break;

  default:
    router.replace("/login");
}
    } catch (err) {
      console.error(err);
      showToast("Server error. Please try again.", "error");
    }
  };

  return (
    <div className="signup">
      <div className="signup-container">
        
        {/* LEFT */}
        <div className="left">
          <h1>Login</h1>
          <p>Enter your credentials</p>
        </div>

        {/* RIGHT */}
        <div className="right">
          <div className="login-form">
            <h2>Welcome Back</h2>

            <input
              name="email"
              placeholder="Enter Email"
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              onChange={handleChange}
            />

            <button onClick={handleLogin}>Login</button>
          </div>
        </div>

      </div>
    </div>
  );
}