import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type FormDialogProps = {
  title: string;
  description?: string;
  trigger: React.ReactNode;
  formFields: React.ReactNode;
  onSubmit: () => Promise<void>;
  submitLabel?: string;
  cancelLabel?: string;
  disabled?: boolean;
};

export function FormDialog({
  title,
  description,
  trigger,
  formFields,
  onSubmit,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  disabled = false,
}: FormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit();
      setIsOpen(false);
    } catch (err) {
      console.error("Form submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="grid gap-4 py-4">{formFields}</div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting}
          >
            {cancelLabel}
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || disabled}>
            {isSubmitting ? "Submitting..." : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
