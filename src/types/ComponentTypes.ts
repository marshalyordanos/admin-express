export interface ButtonProps {
  type: "button" | "submit" | "reset";
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export interface InputProps {
  id: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  label?: string;
  className?: string;
}

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface DeletePopupProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  deleting: boolean;
  title?: string;
  description?: string;
  item?: {
    name?: string;
    location?: string;
    staffCount?: number;
    orderCount?: number;
  };
}

export interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  bg: string;
}
