
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FoodItem } from '@/lib/cart-provider';
import { foodData } from '@/lib/food-data';
import { MessageSquare, Send, User } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  suggestions?: FoodItem[];
}

export default function ChatSuggestions() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      sender: 'bot', 
      text: 'Hi there! I can help you find something delicious to eat. What are you in the mood for today?' 
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');

    // Generate bot response based on user message
    setTimeout(() => {
      const suggestions = getSuggestionsFromInput(input);
      
      let responseText = 'Here are some suggestions based on your preferences:';
      if (suggestions.length === 0) {
        responseText = "I couldn't find any items matching your request. How about trying something from our popular items?";
      }

      const botResponse: Message = {
        sender: 'bot',
        text: responseText,
        suggestions: suggestions.length > 0 ? suggestions : getRandomItems(3)
      };
      
      setMessages(prev => [...prev, botResponse]);
    }, 500);
  };

  const getSuggestionsFromInput = (input: string): FoodItem[] => {
    const lowerInput = input.toLowerCase();
    
    // Keywords to match
    const keywords: Record<string, string[]> = {
      spicy: ['spicy', 'hot', 'chili', 'spice'],
      healthy: ['healthy', 'diet', 'nutritious', 'light'],
      hungry: ['hungry', 'starving', 'famished', 'filling'],
      dessert: ['dessert', 'sweet', 'sugar', 'ice cream', 'chocolate'],
      drinks: ['drink', 'beverage', 'thirsty', 'cold drink', 'refreshing'],
    };

    // Check for direct food category mentions
    if (lowerInput.includes('snack')) {
      return foodData.filter(item => item.category === 'Snacks').slice(0, 3);
    } else if (lowerInput.includes('main') || lowerInput.includes('lunch') || lowerInput.includes('dinner')) {
      return foodData.filter(item => item.category === 'Main Course').slice(0, 3);
    } else if (lowerInput.includes('beverage') || keywords.drinks.some(word => lowerInput.includes(word))) {
      return foodData.filter(item => item.category === 'Beverages').slice(0, 3);
    }

    // Check for spicy food preference
    if (keywords.spicy.some(word => lowerInput.includes(word))) {
      return foodData
        .filter(item => item.customization?.spiceLevel === 'Medium' || item.customization?.spiceLevel === 'High')
        .slice(0, 3);
    }

    // Check for veg/non-veg preference
    if (lowerInput.includes('veg') || lowerInput.includes('vegetarian')) {
      return foodData.filter(item => item.isVeg).slice(0, 3);
    } else if (lowerInput.includes('non-veg') || lowerInput.includes('chicken') || lowerInput.includes('meat')) {
      return foodData.filter(item => !item.isVeg).slice(0, 3);
    }

    // Check for price range mentions
    if (lowerInput.includes('cheap') || lowerInput.includes('budget') || lowerInput.includes('inexpensive')) {
      return foodData.filter(item => item.price < 100).slice(0, 3);
    }

    // Fallback to random suggestions
    return [];
  };

  const getRandomItems = (count: number): FoodItem[] => {
    const shuffled = [...foodData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="default" 
          size="icon" 
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-20"
          aria-label="Open chat suggestions"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col h-full">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Food Suggestions</SheetTitle>
        </SheetHeader>
        
        <div className="flex-grow overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg p-3 max-w-[80%] ${
                    message.sender === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {message.sender === 'bot' ? (
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="h-6 w-6">
                        <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                      </Avatar>
                    )}
                    <p className="text-xs font-medium">
                      {message.sender === 'user' ? 'You' : 'FoodBot'}
                    </p>
                  </div>
                  <p>{message.text}</p>

                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.suggestions.map((item) => (
                        <div
                          key={item.id}
                          className="bg-background rounded p-2 text-sm flex items-center gap-2"
                        >
                          <div className="w-10 h-10 rounded overflow-hidden bg-muted shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg";
                              }}
                            />
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              ₹{item.price} • {item.isVeg ? 'Veg' : 'Non-Veg'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t mt-auto">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What are you craving today?"
              className="resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button size="icon" onClick={handleSend} disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
