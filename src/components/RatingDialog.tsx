import * as React from 'react';
import { useState, useEffect } from 'react';
import { Star, Loader2, Edit2, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { toast } from "./ui/sonner";
import { ratingService } from '../lib/rating-service';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface RatingDialogProps {
  itemName: string;
  itemId: string;
  orderId: string;
  onRatingSubmit: (itemId: string, rating: number, review: string) => void;
  trigger: React.ReactNode;
  existingRating?: {
    id: string;
    rating: number;
    review: string;
  } | null;
}

export function RatingDialog({ 
  itemName, 
  itemId, 
  orderId, 
  onRatingSubmit, 
  trigger,
  existingRating 
}: RatingDialogProps) {
  const [rating, setRating] = useState(existingRating?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState(existingRating?.review || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (existingRating) {
      setRating(existingRating.rating);
      setReview(existingRating.review);
    }
  }, [existingRating]);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      if (existingRating && !isEditing) {
        setIsEditing(true);
        return;
      }

      const data = {
        itemId,
        orderId,
        rating,
        review
      };

      if (existingRating?.id) {
        await ratingService.updateRating(existingRating.id, data);
        toast.success('Rating updated successfully!');
      } else {
        await ratingService.submitRating(data);
        toast.success('Thank you for your feedback!');
      }

      onRatingSubmit(itemId, rating, review);
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to submit rating. Please try again.');
      console.error('Rating submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!existingRating?.id) return;

    setIsDeleting(true);
    try {
      await ratingService.deleteRating(existingRating.id);
      toast.success('Rating deleted successfully');
      onRatingSubmit(itemId, 0, '');
      setShowDeleteAlert(false);
    } catch (error) {
      toast.error('Failed to delete rating');
      console.error('Rating deletion error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const ratingDescriptions = [
    'Rate this item',
    'Poor',
    'Fair',
    'Good',
    'Very Good',
    'Excellent'
  ];

  const isReadOnly = Boolean(existingRating && !isEditing);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rate {itemName}</DialogTitle>
            {existingRating && !isEditing && (
              <DialogDescription>
                You've already rated this item. You can edit or delete your rating.
              </DialogDescription>
            )}
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => !isReadOnly ? setRating(star) : undefined}
                    onMouseEnter={() => !isReadOnly ? setHoveredRating(star) : undefined}
                    onMouseLeave={() => !isReadOnly ? setHoveredRating(0) : undefined}
                    className={`transition-transform ${
                      isReadOnly
                        ? 'cursor-default' 
                        : 'hover:scale-110'
                    } focus:outline-none`}
                    disabled={isReadOnly}
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
              <p className="text-center text-sm text-muted-foreground">
                {ratingDescriptions[hoveredRating || rating]}
              </p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="review" className="text-sm font-medium">
                Your Review {isReadOnly ? '(read-only)' : '(Optional)'}
              </label>
              <Textarea
                id="review"
                placeholder="Tell us what you think about this item..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="min-h-[100px]"
                disabled={isReadOnly}
              />
            </div>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            {existingRating ? (
              <>
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setRating(existingRating.rating);
                        setReview(existingRating.review);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteAlert(true)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit Rating
                    </Button>
                  </>
                )}
              </>
            ) : (
              <>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Rating
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Rating</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your rating? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Rating
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 