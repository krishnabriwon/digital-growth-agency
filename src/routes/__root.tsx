import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, useRouter, useRouterState, HeadContent, Scripts, type ErrorComponentProps } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header, Footer, FloatingWhatsApp } from "@/components/site/Layout";
import { siteConfig } from "@/lib/site-config";
import { trackPageView, trackingHeadScripts } from "@/lib/tracking";
import { Button } from "@/components/ui/button";

function NotFoundComponent() {
  return (
    <div className="container-site flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-gradient text-8xl font-extrabold">404</p>
      <h1 className="mt-4 text-3xl font-bold">This page doesn't exist</h1>
      <p className="mt-3 max-w-md text-muted-foreground">The page may have moved, or the link may be incorrect. Let's get you back on track.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="rounded-lg bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Back to Home</Link>
        <Link to="/services" className="rounded-lg border px-5 py-3 text-sm font-semibold text-navy">View Services</Link>
        <Link to="/contact" className="rounded-lg border px-5 py-3 text-sm font-semibold text-navy">Contact Us</Link>
      </div>
    </div>
  );
}

export function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong on our end. You can try refreshing or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button onClick={() => { void router.invalidate().then(reset); }}>Try again</Button>
          <a href="/" className="rounded-md border border-input px-4 py-2 text-sm font-medium text-foreground">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: ({ matches }) => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${siteConfig.name} – ${siteConfig.tagline}` },
      { name: "description", content: "Digital marketing services for businesses across Pan India." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: siteConfig.name },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#092B55" },
      ...(matches.some((match) => match.status === "notFound") ? [
        { title: "Page Not Found | Digital Marketing Agency" },
        { name: "description", content: "This page is unavailable. Explore Digital Marketing Agency services or contact us about your business goals." },
        { property: "og:title", content: "Page Not Found | Digital Marketing Agency" },
        { property: "og:description", content: "Find digital marketing services and contact Digital Marketing Agency." },
        { name: "robots", content: "noindex, nofollow" },
      ] : []),
      ...(siteConfig.tracking.searchConsoleVerification ? [{ name: "google-site-verification", content: siteConfig.tracking.searchConsoleVerification }] : []),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" },
    ],
    scripts: trackingHeadScripts(),
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-PX3XV6DT" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());`,
          }}
        />
        <HeadContent />
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PX3XV6DT"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RouteTracker() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    // Defer so the new route's <title> is applied first.
    const t = setTimeout(() => trackPageView(path), 0);
    return () => clearTimeout(t);
  }, [path]);
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <RouteTracker />
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:p-3">Skip to content</a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </QueryClientProvider>
  );
}
