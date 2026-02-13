import React, { useEffect } from "react";
import { motion, useAnimate, stagger } from "framer-motion";

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
}) => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
      },
      {
        duration: 2,
        delay: stagger(0.1),
      }
    );
  }, [animate]);

  const renderWords = () => {
    return (
      <motion.div ref={scope} className="inline">
        {words.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block mr-2">
              {word.text.split("").map((char, index) => (
                <motion.span
                  initial={{
                    opacity: 0,
                  }}
                  key={`char-${index}`}
                  className={`opacity-0 ${word.className}`}
                >
                  {char}
                </motion.span>
              ))}
            </div>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div
      className={`text-base sm:text-xl md:text-3xl lg:text-5xl font-bold text-center ${className}`}
    >
      {renderWords()}
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={`inline-block rounded-sm w-[4px] h-4 md:h-8 lg:h-10 bg-white align-middle ${cursorClassName}`}
      ></motion.span>
    </div>
  );
};