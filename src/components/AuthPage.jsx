import React, { useState } from "react";
import "./AuthPage.css";

function AuthPage({ onLogin, onRegister }) {
  const [mode, setMode] = useState("login");

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "FARMER",
  });

  const [error, setError] = useState("");

  /* ---------- VALIDATIONS ---------- */

  const isValidGmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  const isValidPassword = (pwd) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pwd);

  /* ---------- LOGIN ---------- */
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!loginForm.email || !loginForm.password) {
      setError("Please enter email and password.");
      return;
    }

    const ok = await onLogin({
      identifier: loginForm.email,
      password: loginForm.password,
    });

    if (!ok) setError("Invalid email or password.");
  };

  /* ---------- REGISTER ---------- */
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { username, email, password, confirmPassword, role } = registerForm;

    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (!isValidGmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!isValidPassword(password)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const ok = await onRegister({
      username: email, // ✅ email used as backend username
      password,
      role,
    });

    if (!ok) {
      setError("Registration failed. Try again.");
      return;
    }

    alert("Registration successful! Please login.");
    setMode("login");
    setRegisterForm({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "FARMER",
    });
  };

  return (
    <div className="auth-container">
      <div className={`auth-card ${mode === "register" ? "slide-mode" : ""}`}>
        <div className="side-panel">
          {mode === "login" ? (
            <>
              <h1>Welcome Back!</h1>
              <p>Login to continue your FarmChainX journey.</p>
              <button className="side-btn" onClick={() => setMode("register")}>
                CREATE ACCOUNT
              </button>
            </>
          ) : (
            <>
              <h1>Hello, Friend!</h1>
              <p>Enter your details to join FarmChainX.</p>
              <button className="side-btn" onClick={() => setMode("login")}>
                SIGN IN
              </button>
            </>
          )}
        </div>

        <div className="form-panel">
          <div className="form-box">
            <h2>
              {mode === "login"
                ? "Sign in to FarmChainX"
                : "Create Your FarmChainX Account"}
            </h2>

            {error && <div className="error-box">{error}</div>}

            {/* LOGIN */}
            {mode === "login" ? (
              <form onSubmit={handleLoginSubmit}>
                <input
                  type="email"
                  placeholder="Email"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                />
                <button className="submit-btn" type="submit">
                  Sign In
                </button>
              </form>
            ) : (
              /* REGISTER */
              <form onSubmit={handleRegisterSubmit}>
                <input
                  type="text"
                  placeholder="Username"
                  value={registerForm.username}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, username: e.target.value })
                  }
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, email: e.target.value })
                  }
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, password: e.target.value })
                  }
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={registerForm.confirmPassword}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      confirmPassword: e.target.value,
                    })
                  }
                />
                <select
                  value={registerForm.role}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, role: e.target.value })
                  }
                >
                  <option value="FARMER">Farmer</option>
                  <option value="DISTRIBUTOR">Distributor</option>
                  <option value="CONSUMER">Consumer</option>
                </select>
                <button className="submit-btn" type="submit">
                  Sign Up
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
