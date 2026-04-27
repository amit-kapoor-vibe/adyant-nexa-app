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
          fontSize: "clamp(42px, 10vw, 130px)",
          lineHeight: 0.9,
          letterSpacing: "-0.04em",
          ...style,
        };
      case "h2":
        return {
          fontFamily: "var(--font-syne)",
          fontWeight: 800,
          fontSize: "clamp(1.8rem, 5vw, 4rem)",
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          ...style,
        };
      case "h3":
        return {
          fontFamily: "var(--font-syne)",
          fontWeight: 700,
          fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
          lineHeight: 1.2,
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
