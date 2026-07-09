import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

const navItems = [
  { label: "Overview", href: "/" },
  { label: "ADRs", href: "/adrs" },
  { label: "Traceability", href: "/traceability" },
  { label: "Review", href: "/review" },
];

export function DashboardShell(props: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr]">
        <aside className="border-b bg-sidebar text-sidebar-foreground lg:border-b-0 lg:border-r">
          <div className="flex flex-col gap-8 p-6">
            <div className="flex flex-col gap-2">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">AIDOS</p>
              <h1 className="text-2xl font-semibold tracking-tight">Project Dashboard</h1>
              <p className="text-sm leading-6 text-muted-foreground">
                Read-only navigation over repository knowledge.
              </p>
            </div>
            <nav aria-label="Dashboard sections" className="flex flex-col gap-2 text-sm">
              {navItems.map((item) => (
                <Button render={<Link href={item.href} />} variant="ghost" className="justify-start" key={item.href}>
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
        </aside>
        <main className="flex flex-col gap-8 p-6 lg:p-10">{props.children}</main>
      </div>
    </div>
  );
}

export function PageHeader(props: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="flex flex-col gap-2">
      <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">{props.eyebrow}</p>
      <h2 className="max-w-3xl text-4xl font-semibold tracking-tight">{props.title}</h2>
      <p className="max-w-3xl text-base leading-7 text-muted-foreground">{props.description}</p>
    </section>
  );
}

export function SummaryCard(props: { label: string; value: string; detail: string }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription className="font-mono text-xs uppercase tracking-[0.24em]">{props.label}</CardDescription>
        <CardTitle className="text-3xl tracking-tight">{props.value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{props.detail}</p>
      </CardContent>
    </Card>
  );
}

export function EmptyState(props: { children: ReactNode }) {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyTitle>No items</EmptyTitle>
        <EmptyDescription>{props.children}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
