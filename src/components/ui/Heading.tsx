import React from "react";

interface HeadingProps {
  children: React.ReactNode;
  level?: "h1" | "h2" | "h3";
  style?: React.CSSProperties;
  className?: string;
  id?: string;
}

export const Heading: React.FC<HeadingProps> = ({ 
  children, 
  level = "h2", 
  style = {}, 
  className = "", 
  id 
}) => {
  const getStyles = (): React.CSSProperties => {
    switch (level) {
      case "h1":
        return {
          fontFamily: "var(--font-syne)",
          fontWeight: 800,
          fontSize: "clamp(2rem, 4.2vw, 3.4rem)",
          lineHeight: 1.15,
          letterSpacing: "-0.025em",
          ...style,
        };
      case "h2":
        return {
          fontFamily: "var(--font-syne)",
          fontWeight: 800,
          fontSize: "clamp(1.65rem, 3vw, 2.35rem)",
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
          ...style,
        };
      case "h3":
        return {
          fontFamily: "var(--font-syne)",
          fontWeight: 700,
          fontSize: "clamp(1.15rem, 1.8vw, 1.35rem)",
          lineHeight: 1.3,
          letterSpacing: "-0.01em",
          ...style,
        };
      default:
        return style;
    }
  };

  const Component = level;

  return (
    <Component id={id} className={className} style={getStyles()}>
      {children}
    </Component>
  );
};
