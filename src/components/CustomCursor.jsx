import { motion, useSpring } from "framer-motion";
import { useCursor } from "../hooks/useCursor";

export default function CustomCursor() {
  const { pos, isPointer, isClicking, isDesktop } = useCursor();

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const x = useSpring(pos.x, springConfig);
  const y = useSpring(pos.y, springConfig);

  const dotX = useSpring(pos.x, { damping: 40, stiffness: 500, mass: 0.2 });
  const dotY = useSpring(pos.y, { damping: 40, stiffness: 500, mass: 0.2 });
  if (!isDesktop) return null;
  if (pos.x === -100 && pos.y === -100) return null;
  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: x,
          y: y,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            width: isPointer ? 44 : 28,
            height: isPointer ? 44 : 28,
            opacity: isClicking ? 0.5 : 1,
            borderColor: isPointer
              ? "rgba(0,245,255,0.8)"
              : "rgba(0,245,255,0.4)",
          }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          style={{
            borderRadius: "50%",
            border: "1.5px solid rgba(0,245,255,0.4)",
            boxShadow: isPointer
              ? "0 0 20px rgba(0,245,255,0.4), inset 0 0 10px rgba(0,245,255,0.1)"     
              : "0 0 10px rgba(0,245,255,0.2)",
          }}
        />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            width: isPointer ? 6 : 4,
            height: isPointer ? 6 : 4,
            opacity: isClicking ? 0.3 : 1,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 500 }}
          style={{
            borderRadius: "50%",
            background: "#00f5ff",
            boxShadow: "0 0 6px rgba(0,245,255,0.8)",
          }}
        />
      </motion.div>
    </>
  );
}
