import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Calendar } from "./components/Calendar";
import { Suspense } from "react";

const queryClient = new QueryClient();

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <h1>Dori</h1>
        <Suspense fallback="loading...">
          <Calendar />
        </Suspense>
      </div>
    </QueryClientProvider>
  );
};
