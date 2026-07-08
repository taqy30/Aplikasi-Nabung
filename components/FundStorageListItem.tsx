"use client";

import Link from "next/link";
import { ChevronRight, Pin, PinOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRupiah } from "@/lib/transactions-display";
import { Button } from "@/components/ui/button";
import FundSourceIcon, { FUND_ICON } from "./FundSourceIcon";

type FundStorageListItemProps = {
  slug: string;
  name: string;
  masuk: number;
  keluar: number;
  href?: string;
  pinned?: boolean;
  canTogglePin?: boolean;
  onTogglePin?: () => void;
};

export default function FundStorageListItem({
  slug,
  name,
  masuk,
  keluar,
  href,
  pinned = false,
  canTogglePin = false,
  onTogglePin,
}: FundStorageListItemProps) {
  const net = masuk - keluar;
  const showPin = canTogglePin && slug !== "cash";

  const content = (
    <>
      <FundSourceIcon slug={slug} size={FUND_ICON.recap} className="shrink-0" />
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex min-w-0 items-center gap-1.5">
          <p className="truncate text-sm font-medium leading-none">{name}</p>
          {pinned && slug !== "cash" && (
            <span className="inline-flex items-center gap-0.5 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
              <Pin className="size-2.5 fill-current" />
              Sematan
            </span>
          )}
          {slug === "cash" && (
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              Tetap
            </span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground tabular-nums leading-snug">
          +{formatRupiah(masuk)} · −{formatRupiah(keluar)}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1 pl-1">
        <p
          className={cn(
            "text-xs font-semibold tabular-nums whitespace-nowrap",
            net >= 0 ? "text-emerald-600" : "text-destructive"
          )}
        >
          {net >= 0 ? "+" : "−"}
          {formatRupiah(Math.abs(net))}
        </p>
        {href && (
          <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
        )}
      </div>
    </>
  );

  const rowClass =
    "flex min-w-0 flex-1 items-center gap-2.5 rounded-lg border bg-card px-3 py-2.5 shadow-sm ring-1 ring-foreground/[0.06] transition-colors hover:bg-muted/50";

  return (
    <div className="flex w-full min-w-0 items-stretch gap-1.5">
      {href ? (
        <Link href={href} className={rowClass}>
          {content}
        </Link>
      ) : (
        <div className={rowClass}>{content}</div>
      )}
      {showPin && (
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className={cn(
            "h-auto shrink-0 self-stretch px-2",
            pinned && "border-primary/40 bg-primary/5 text-primary"
          )}
          aria-label={pinned ? `Lepas sematan ${name}` : `Sematkan ${name}`}
          title={pinned ? "Lepas sematan" : "Sematkan di dashboard"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onTogglePin?.();
          }}
        >
          {pinned ? (
            <PinOff className="size-3.5" />
          ) : (
            <Pin className="size-3.5" />
          )}
        </Button>
      )}
    </div>
  );
}
