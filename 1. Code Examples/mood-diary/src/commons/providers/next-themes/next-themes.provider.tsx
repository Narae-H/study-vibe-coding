"use client";

import { ThemeProvider } from "next-themes";
import type { ComponentProps } from "react";

export function NextThemesProvider({ children, ...props }: ComponentProps<typeof ThemeProvider>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </ThemeProvider>
  );
}

