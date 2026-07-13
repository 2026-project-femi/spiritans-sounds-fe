"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";

export type Currency = "NGN" | "USD" | "GBP";

const CURRENCY_STORAGE_KEY = "user_preferred_currency_v2";

// Cache the promise at the module level so multiple components mounting simultaneously
// don't trigger multiple requests to ipapi.co
let ipapiPromise: Promise<Currency> | null = null;

function fetchCurrencyByIP(): Promise<Currency> {
  if (!ipapiPromise) {
    ipapiPromise = fetch("https://ipwho.is/", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        const countryCode = data.country_code;
        if (countryCode === "NG") return "NGN";
        if (countryCode === "GB") return "GBP";
        return "USD"; // Default for international
      })
      .catch((error) => {
        console.error("Failed to detect currency by IP:", error);
        return "NGN"; // Fallback if API fails
      });
    
    // Clear the promise cache after 5 seconds so that subsequent page navigations 
    // or HMR reloads will re-evaluate the IP (useful for VPN toggling in dev)
    setTimeout(() => {
      ipapiPromise = null;
    }, 5000);
  }
  return ipapiPromise;
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (newCurrency: Currency) => void;
  symbol: string;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("NGN");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeCurrency = async () => {
      // Check if user has explicitly manually selected a currency
      const savedCurrency = localStorage.getItem(CURRENCY_STORAGE_KEY) as Currency | null;
      if (savedCurrency && ["NGN", "USD", "GBP"].includes(savedCurrency)) {
        setCurrencyState(savedCurrency);
        setIsLoading(false);
        return;
      }

      // Auto-detect based on IP
      const detectedCurrency = await fetchCurrencyByIP();
      setCurrencyState(detectedCurrency);
      setIsLoading(false);
    };

    initializeCurrency();
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    // Only save to localStorage when the user explicitly changes it via the UI
    localStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency);
  };

  const symbol = currency === "NGN" ? "₦" : currency === "GBP" ? "£" : "$";

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, symbol, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
