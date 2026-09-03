"use client";

import React, { useState, useTransition } from "react";
import { requestPayoutAction } from "@/app/(frontend)/unveiler/actions/requestPayoutAction";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface PayoutButtonProps {
  availableBalance: number;
  minimumThreshold: number;
  hasPending: boolean;
}

export function PayoutButton({ availableBalance, minimumThreshold, hasPending }: PayoutButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const router = useRouter();

  const handlePayout = async () => {
    setMessage(null);
    startTransition(async () => {
      const result = await requestPayoutAction();
      if (result.success) {
        setMessage({ type: 'success', text: result.message! });
        router.refresh();
      } else {
        setMessage({ type: 'error', text: result.error || 'An error occurred' });
      }
    });
  };

  const isDisabled = availableBalance < minimumThreshold || hasPending || isPending;

  return (
    <div>
      <button 
        onClick={handlePayout}
        disabled={isDisabled}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-brand-primary font-black uppercase tracking-widest text-xs rounded-xl shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 w-full sm:w-auto"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {hasPending ? 'Payout Pending' : 'Request Payout'}
      </button>
      
      {availableBalance < minimumThreshold && !hasPending && (
        <p className="text-[10px] text-red-200 mt-3 font-medium uppercase tracking-widest">
          Min. payout threshold is ₦{minimumThreshold.toLocaleString()}
        </p>
      )}

      {message && (
        <p className={`text-xs mt-3 font-medium ${message.type === 'error' ? 'text-red-300' : 'text-green-300'}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
