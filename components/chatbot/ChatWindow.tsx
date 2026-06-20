"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minimize2, RotateCcw, User } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { AssistantLogo } from "./AssistantLogo";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatWindowProps {
  onClose: () => void;
}

interface LeadFormData {
  name: string;
  email: string;
  company: string;
}

export function ChatWindow({ onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hi 👋 I'm the Omansai AI assistant.\n\nI can help you explore our AI consulting services, build enterprise data platforms, or book a demo. What would you like to know?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadFormData, setLeadFormData] = useState<LeadFormData>({
    name: "",
    email: "",
    company: "",
  });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, showLeadForm]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Check if the response indicates interest in demo/consultation
      const lowerContent = data.message.toLowerCase();
      const triggerWords = ["demo", "consultation", "pricing", "contact", "book", "schedule", "interested"];
      const shouldShowLeadForm = triggerWords.some(word =>
        lowerContent.includes(word) && (
          lowerContent.includes("book") ||
          lowerContent.includes("schedule") ||
          lowerContent.includes("contact") ||
          lowerContent.includes("interested")
        )
      );

      if (shouldShowLeadForm && !showLeadForm) {
        setTimeout(() => setShowLeadForm(true), 1000);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting right now. Please try again later or contact us directly.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLead(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...leadFormData,
          type: "chatbot",
          message: `Lead captured from chatbot. Interested in: ${messages[messages.length - 1]?.content || "services"}`,
        }),
      });

      if (response.ok) {
        setShowLeadForm(false);
        const successMessage: Message = {
          id: (Date.now() + 2).toString(),
          content: "Thanks for your interest! 🎉\n\nI've captured your information and someone from our team will be in touch within 24 hours to discuss your needs and schedule a demo.\n\nIs there anything else I can help you with in the meantime?",
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, successMessage]);
        setLeadFormData({ name: "", email: "", company: "" });
      } else {
        throw new Error("Failed to submit lead");
      }
    } catch (error) {
      console.error("Lead submission error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: "Sorry, there was an issue capturing your information. Please try again or contact us directly at hello@omansai.com",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome",
        content: "Hi 👋 I'm the Omansai AI assistant.\n\nI can help you explore our AI consulting services, build enterprise data platforms, or book a demo. What would you like to know?",
        role: "assistant",
        timestamp: new Date(),
      },
    ]);
    setShowLeadForm(false);
    setLeadFormData({ name: "", email: "", company: "" });
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed bottom-24 right-6 z-50"
      >
        <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">Omansai Assistant</span>
            <button
              onClick={() => setIsMinimized(false)}
              className="ml-auto text-gray-500 hover:text-gray-700"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
        onClick={onClose}
      />

      {/* Chat Window */}
      <div className="flex max-h-[calc(100dvh-7rem)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white/95 shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AssistantLogo size={32} />
              <div>
                <h3 className="font-semibold">Omansai Assistant</h3>
                <p className="text-xs opacity-90">Online now</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearChat}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title="Clear chat"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title="Minimize"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {/* Lead Capture Form */}
          <AnimatePresence>
            {showLeadForm && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                  <h4 className="font-semibold text-purple-900">Let&apos;s get you connected!</h4>
                </div>
                <p className="text-sm text-purple-700 mb-4">
                  I&apos;d love to help you further. Please provide your details and we&apos;ll be in touch soon.
                </p>

                <form onSubmit={handleLeadSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-purple-800 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={leadFormData.name}
                      onChange={(e) => setLeadFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-purple-800 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={leadFormData.email}
                      onChange={(e) => setLeadFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="your.email@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-purple-800 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      value={leadFormData.company}
                      onChange={(e) => setLeadFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Your company"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmittingLead || !leadFormData.name || !leadFormData.email}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg font-medium text-sm hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isSubmittingLead ? "Submitting..." : "Get Started 🚀"}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {isTyping && (
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput onSendMessage={handleSendMessage} disabled={isTyping || showLeadForm} />
      </div>
    </motion.div>
  );
}