import { useToast } from "@/components/ui/use-toast";

let globalToast: ReturnType<typeof useToast>['toast'] | null = null;

export const setGlobalToast = (toastFunction: ReturnType<typeof useToast>['toast']) => {
  globalToast = toastFunction;
};

export const getGlobalToast = () => {
  if (!globalToast) {
    console.warn("Global toast not initialized. Toast messages might not appear.");
  }
  return globalToast;
};


