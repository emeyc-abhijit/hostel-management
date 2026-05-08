import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/services/api";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "model";
  content: string;
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "model", content: "Hi there! I am the Hostel Harmony assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Pass the current messages as history
      const res = await api.sendChatMessage(userMessage.content, messages);
      if (res.success && res.data) {
        setMessages((prev) => [
          ...prev,
          { role: "model", content: res.data!.response },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "model", content: "Sorry, I am having trouble connecting to my brain right now." },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "model", content: "An error occurred while sending your message." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-background border shadow-xl rounded-xl w-80 sm:w-96 h-[500px] max-h-[80vh] flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              <h3 className="font-semibold">AI Assistant</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground rounded-full"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "max-w-[85%] rounded-2xl p-3 text-sm",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground ml-auto rounded-tr-sm"
                    : "bg-muted text-foreground mr-auto rounded-tl-sm border"
                )}
              >
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="bg-muted text-muted-foreground border mr-auto rounded-2xl rounded-tl-sm p-3 max-w-[85%] flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t bg-background">
            <form
              onSubmit={handleSend}
              className="flex items-center gap-2"
            >
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 rounded-full bg-muted/50 focus-visible:ring-primary border-none"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
                className="h-10 w-10 rounded-full shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <Button
          size="icon"
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
