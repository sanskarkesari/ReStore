
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SendHorizontal, X, CornerDownLeft, ImagePlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  text: string;
  sender: "user" | "seller";
  timestamp: Date;
}

interface Seller {
  id: string;
  name: string;
  avatar: string;
  lastActive: string;
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  seller: Seller;
  productId?: string;
  productName?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  isOpen,
  onClose,
  seller,
  productId,
  productName,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial message from seller if product is selected
  useEffect(() => {
    if (productId && productName) {
      setTimeout(() => {
        setMessages([
          {
            id: "initial",
            text: `Hello! I see you're interested in my ${productName}. How can I help you?`,
            sender: "seller",
            timestamp: new Date(),
          },
        ]);
      }, 1000);
    }
  }, [productId, productName]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    // Add user message
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    // Simulate seller response after a delay
    setTimeout(() => {
      const responses = [
        "Yes, the item is still available!",
        "I can answer any questions you have about the product.",
        "I've been using it for about 6 months. It's in great condition.",
        "I can offer a small discount if you're interested in buying soon.",
        "Would you like to see more pictures of the item?",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const sellerResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: "seller",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, sellerResponse]);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-4 right-4 w-[350px] z-50"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ type: "spring", damping: 20 }}
      >
        <Card className="shadow-lg border-t-4 border-t-primary overflow-hidden">
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between bg-muted/50">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={seller.avatar} alt={seller.name} />
                <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{seller.name}</div>
                <div className="text-xs text-muted-foreground">
                  {seller.lastActive}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[300px] overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-4">
                  <div className="mb-2">
                    <CornerDownLeft className="h-10 w-10 mb-2 mx-auto opacity-20" />
                    <p>Start your conversation with {seller.name}</p>
                  </div>
                  {productName && (
                    <p className="text-sm">
                      Ask about: <span className="font-medium">{productName}</span>
                    </p>
                  )}
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <div className="text-sm">{message.text}</div>
                    <div className={`text-xs mt-1 ${
                      message.sender === "user" 
                        ? "text-primary-foreground/70" 
                        : "text-muted-foreground"
                    }`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </motion.div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t p-3 flex items-center gap-2">
              <Button variant="ghost" size="icon" className="shrink-0" type="button">
                <ImagePlus className="h-4 w-4" />
              </Button>
              <Input
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button 
                variant="ghost"
                size="icon" 
                className="shrink-0 text-primary" 
                onClick={handleSendMessage}
                disabled={inputValue.trim() === ""}
              >
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatInterface;
