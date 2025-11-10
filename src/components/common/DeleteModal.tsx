import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  title?: string;
  description?: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean; // NEW: loading state for confirm button
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  setIsOpen,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  onConfirm,
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false, // default false
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></span>
                {confirmText}
              </span>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
