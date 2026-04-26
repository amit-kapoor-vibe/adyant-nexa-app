"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#020202",
          color: "#00F2FF",
          fontFamily: "var(--font-syne)",
          textAlign: "center",
          padding: "20px"
        }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>NEURAL_LINK_DISRUPTED</h1>
          <p style={{ color: "#E5E5E5", opacity: 0.6, maxWidth: "400px", marginBottom: "32px" }}>
            A critical synchronization error occurred. Our engineers have been notified.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: "#00F2FF",
              color: "#020202",
              border: "none",
              padding: "12px 24px",
              fontWeight: 800,
              cursor: "pointer",
              fontFamily: "var(--font-geist-mono)"
            }}
          >
            REBOOT_SYSTEM
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
