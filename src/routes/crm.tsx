import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { CrmAuthProvider, useCrmAuth } from "@/lib/crm/auth-context";
import { LoginScreen } from "@/components/crm/LoginScreen";
import { CrmLayout } from "@/components/crm/CrmLayout";

function CrmApp() {
  const { isAuthenticated, isLoading } = useCrmAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7FB]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#087BEA] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-[#092B55]">Loading DMA Agency CRM...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return <CrmLayout />;
}

export const Route = createFileRoute("/crm")({
  head: () =>
    seo({
      title: "DMA Agency CRM – Private Staff Portal",
      description: "Internal CRM portal for managing agency leads, pipeline, clients, and sales performance.",
      path: "/crm",
      noindex: true,
    }),
  component: () => (
    <CrmAuthProvider>
      <CrmApp />
    </CrmAuthProvider>
  ),
});
