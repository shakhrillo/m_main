import React, { useState } from "react";

export const ResetPassword = () => {
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleResetPassword = async (e: React.FormEvent) => {};

  return (
    <div className="login container-fluid">
      <nav className="login__navbar">
        <a href="/">
          {/* <img
            className="login__navbar-logo"
            src={logo}
            alt="GeoScraper logo"
          /> */}
        </a>
      </nav>
      <div className="login__card">
        <div className="login__card__header">
          <h3 className="login__card__header-title">Reset Password</h3>
          <span className="login__text">
            Enter your email address to reset your password
          </span>
        </div>
        <form className="login__card__form" onSubmit={handleResetPassword}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="login__card__form-submit">
            <button className="btn btn-primary" type="submit">
              Reset Password
            </button>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && (
            <div className="alert alert-success">
              Password reset link sent to your email.
            </div>
          )}
        </form>
        <div className="login__card__footer">
          <a href="/auth/login">Back to login</a>
        </div>
      </div>
    </div>
  );
};
