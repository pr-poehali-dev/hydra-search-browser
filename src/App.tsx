import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HydraProvider } from "@/context/HydraContext";
import HydraApp from "@/pages/HydraApp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <HydraProvider>
        <Toaster />
        <Sonner />
        <HydraApp />
      </HydraProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
