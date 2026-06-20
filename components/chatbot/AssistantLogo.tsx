"use client";

import { motion, type Variants } from "framer-motion";

// Animated AI-assistant "helmet" mark. Self-contained (inline styles), so it
// drops in anywhere. `size` sets the rendered square in px; internals scale
// proportionally from the 120px native design.
export function AssistantLogo({ size = 120 }: { size?: number }) {
  // Breathing/floating of the whole head.
  const floatVariants: Variants = {
    animate: {
      y: [0, -6, 0],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    },
  };

  // Soft pulse for the glowing blue eyes.
  const eyeGlowVariants: Variants = {
    animate: {
      scale: [1, 1.03, 1],
      opacity: [0.9, 1, 0.9],
      boxShadow: [
        "0 0 15px rgba(0, 191, 255, 0.6), inset 0 0 10px rgba(0, 191, 255, 0.4)",
        "0 0 25px rgba(0, 191, 255, 0.9), inset 0 0 15px rgba(0, 191, 255, 0.6)",
        "0 0 15px rgba(0, 191, 255, 0.6), inset 0 0 10px rgba(0, 191, 255, 0.4)",
      ],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
    },
  };

  // Subtle "looking around" of the visor internals.
  const lookAroundVariants: Variants = {
    animate: {
      x: [0, 2, -2, 0],
      y: [0, -1, 1, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.45, 0.5, 1],
      },
    },
  };

  return (
    <div style={{ ...styles.container, width: size, height: size }}>
      <motion.div
        variants={floatVariants}
        animate="animate"
        // Use Framer's `scale` (not CSS `transform`) so it composes with the
        // float animation instead of being overwritten by it.
        style={{ ...styles.logoWrapper, scale: size / 120 }}
      >
        {/* Outer white helmet frame */}
        <div style={styles.helmet}>
          {/* Side pods with cyan rings */}
          <div style={{ ...styles.sidePod, left: -8, borderRight: "3px solid #00bfff" }} />
          <div style={{ ...styles.sidePod, right: -8, borderLeft: "3px solid #00bfff" }} />

          {/* Dark glass visor */}
          <div style={styles.visor}>
            <motion.div variants={lookAroundVariants} animate="animate" style={styles.visorContent}>
              <motion.div variants={eyeGlowVariants} animate="animate" style={styles.eyeRing} />
              <motion.div variants={eyeGlowVariants} animate="animate" style={styles.eyeRing} />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "transparent",
  },
  logoWrapper: {
    position: "relative",
    width: "90px",
    height: "90px",
    transformOrigin: "center",
  },
  helmet: {
    position: "relative",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15), inset 0 -4px 8px rgba(0,0,0,0.1)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  sidePod: {
    position: "absolute",
    top: "30%",
    width: "12px",
    height: "35px",
    backgroundColor: "#ffffff",
    borderRadius: "6px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  visor: {
    width: "82%",
    height: "68%",
    borderRadius: "40% 40% 45% 45%",
    background: "linear-gradient(180deg, #121214 0%, #08080a 100%)",
    border: "2.5px solid #2a2b30",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "inset 0 4px 10px rgba(0,0,0,0.8)",
  },
  visorContent: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  eyeRing: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    border: "2.5px solid #00bfff",
    backgroundColor: "transparent",
  },
};
