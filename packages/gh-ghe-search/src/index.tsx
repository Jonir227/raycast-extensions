import "isomorphic-fetch";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import Issues from "./Issues";

const queryClient = new QueryClient();

function QueryProvider({ children }: PropsWithChildren) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export default function Main() {
  return (
    <QueryProvider>
      <Issues />
    </QueryProvider>
  );
}
