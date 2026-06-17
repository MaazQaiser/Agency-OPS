"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/login/actions";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/auth";

const initialState: LoginState = {};

export function LoginScreen() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <img
            src="/brand/agency-os-mark.png"
            srcSet="/brand/agency-os-mark@2x.png 2x"
            alt=""
            width={48}
            height={24}
            className="login-brand-mark"
          />
          <h1 className="login-title">
            Agency <em>OPS</em>
          </h1>
          <p className="login-subtitle">Insurance Town · Executive Command Center</p>
        </div>

        <form className="login-form" action={formAction}>
          <label className="login-field">
            <span className="login-label">Email</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@insurancetown.com"
              defaultValue={DEMO_EMAIL}
              required
            />
          </label>

          <label className="login-field">
            <span className="login-label">Password</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              required
            />
          </label>

          {state.error && (
            <p className="login-error" role="alert">
              {state.error}
            </p>
          )}

          <button type="submit" className="login-submit" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="login-demo-hint">
          Demo: <strong>{DEMO_EMAIL}</strong> / <strong>{DEMO_PASSWORD}</strong>
        </p>
      </div>
    </div>
  );
}
