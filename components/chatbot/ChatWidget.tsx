"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatWindow } from "./ChatWindow";
import { AssistantLogo } from "./AssistantLogo";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-[60]"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close assistant" : "Open AI assistant"}
          className={cn(
            "relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg ring-1 ring-white/15 transition-shadow duration-300 hover:shadow-xl",
            isOpen
              ? "bg-gradient-to-br from-blue-600 to-purple-600"
              : "bg-gradient-to-br from-blue-600 to-indigo-700",
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="logo"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Animated AI-assistant logo */}
                <AssistantLogo size={30} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Soft attention halo when closed (sits behind the logo) */}
          {!isOpen && (
            <motion.span
              aria-hidden
              className="absolute -z-10 h-14 w-14 rounded-full bg-sky-400/30"
              animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </motion.button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <ChatWindow onClose={() => setIsOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}