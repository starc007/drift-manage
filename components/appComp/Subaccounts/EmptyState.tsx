import { PiEmptyBold } from "react-icons/pi";

interface EmptyStateProps {
  message?: string;
}

export const EmptyState = ({ message }: EmptyStateProps) => (
  <div className="text-center p-8 bg-primary/5 rounded-xl backdrop-blur-sm border border-primary/10 max-w-md mx-auto mt-20">
    <PiEmptyBold className="w-12 h-12 text-primary mx-auto mb-4" />
    <h3 className="text-xl font-semibold mb-2">No Subaccounts Found</h3>
    <p className="text-primary/60">{message}</p>
  </div>
);
