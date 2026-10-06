import { QuoteCalculator } from "./components/QuoteCalculator";

function App() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-between gap-4 bg-[#1b373c]">
      <h1 className="text-lg font-extralight py-2 text-white">added-today</h1>
      <QuoteCalculator />
      <div className="py-2 w-full bg-linear-160/srgb from-login-foreground/5.5 via-login-foreground/1.5 via-45% to-transparent">
        <p className="text-xs text-center text-white">
          (c) Copyright 2026 Added Today. All Rights Reserved.
        </p>
      </div>
    </main>
  );
}

export default App;
