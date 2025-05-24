import { useState } from 'react';
import { Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";

interface RatingDialogProps {
  itemName: string;
  itemId: string;
  orderId: string;
  onRatingSubmit: (itemId: string, rating: number, review: string) => void;
  trigger: React.ReactNode;
}

export function RatingDialog({ itemName, itemId, orderId, onRatingSubmit, trigger }: RatingDialogProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const [isOpen, setIsOpen] = useState(false); // New state for dialog visibility

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    onRatingSubmit(itemId, rating, review);
    toast.success('Thank you for your feedback!');
    setRating(0);
    setReview('');
    setIsOpen(false); // Close the dialog after successful submission
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}> {/* Control dialog visibility */}
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate {itemName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  className={`h-8 w-8 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="review" className="text-sm font-medium">
              Your Review (Optional)
            </label>
            <Textarea
              id="review"
              placeholder="Tell us what you think about this item..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Submit Rating</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
