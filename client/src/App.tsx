import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          {/* PC: 한가운데 핸드폰 프레임, 모바일: 전체화면 */}
          <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center md:p-8">
            <div className="w-full md:w-[393px] md:min-h-[852px] md:max-h-[852px] md:rounded-[50px] md:shadow-[0_30px_80px_rgba(0,0,0,0.3)] md:overflow-hidden md:border-[10px] md:border-gray-900 relative bg-white flex flex-col">
              {/* 핵 노치 */}
              <div className="hidden md:flex absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-gray-900 rounded-b-2xl z-50 items-center justify-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                <div className="w-12 h-1.5 rounded-full bg-gray-700"></div>
              </div>
              <div className="flex-1 overflow-hidden flex flex-col md:pt-7">
                <Router />
              </div>
            </div>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
