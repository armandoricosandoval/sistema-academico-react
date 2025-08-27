import AppContent from "@/components/AppContent";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StoreProvider } from "@/store/Provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <StoreProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </StoreProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
