import { useRef } from "react";
import { motion, useInView } from "motion/react";

interface TypewriterProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
}

const parentVariants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};

const charVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export function Typewriter({
  text,
  delay = 0,
  speed = 0.015,
  className = "",
}: TypewriterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10px" });

  return (
    <motion.span
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: parentVariants.hidden,
        visible: {
          ...parentVariants.visible,
          transition: { staggerChildren: speed, delayChildren: delay },
        },
      }}
      aria-label={text}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          variants={charVariants}
          aria-hidden="true"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
