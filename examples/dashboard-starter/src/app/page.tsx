import Link from "next/link";

import { BulletStatusList, FindingGroup, MissingLinkItem } from "@/components/dashboard-blocks";
import { DashboardShell, EmptyState, PageHeader, SummaryCard } from "@/components/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ItemGroup } from "@/components/ui/item";
import { getAidosProjectRoot } from "@/lib/project-root";
import { getDashboardData } from "@/lib/aidos-dashboard";

export default async function Home() {
  const data = await getDashboardData(getAidosProjectRoot());

  return (
    <DashboardShell>
      <PageHeader
        eyebrow="Markdown Source Of Truth"
        title="AIDOS knowledge, decisions, and governance at a glance."
        description="This dashboard reads repository artifacts and presents them without replacing the markdown files that remain the durable source of truth."
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3" aria-label="Project health cards">
        <SummaryCard label="ADRs" value={String(data.health.adrs)} detail="Accepted decision memory" />
        <SummaryCard label="Roadmap Items" value={String(data.roadmap.currentStatus.length)} detail="Current status bullets" />
        <SummaryCard
          label="Review Outcome"
          value={data.review.outcome}
          detail={`${data.traceability.missingLinks.length} missing traceability links`}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr]" id="product-intent">
        <Card>
          <CardHeader>
            <CardDescription className="font-mono text-xs uppercase tracking-[0.24em]">Mission</CardDescription>
            <CardTitle className="text-2xl">Product Intent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-7 text-muted-foreground">{data.productIntent.mission}</p>
          </CardContent>
        </Card>

        <Card id="roadmap">
          <CardHeader>
            <CardDescription className="font-mono text-xs uppercase tracking-[0.24em]">Current Focus</CardDescription>
            <CardTitle className="text-2xl">Roadmap Status</CardTitle>
          </CardHeader>
          <CardContent>
            <BulletStatusList items={data.roadmap.currentStatus} />
          </CardContent>
        </Card>
      </section>

      <Card id="adrs">
        <CardHeader>
          <CardDescription className="font-mono text-xs uppercase tracking-[0.24em]">Decision Layer</CardDescription>
          <CardTitle className="text-2xl">Architecture Decision Records</CardTitle>
          <CardAction>
            <Button render={<Link href="/adrs" />} variant="link">
              View ADR details
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Path</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.adrs.map((adr) => (
                <TableRow key={adr.path}>
                  <TableCell className="font-mono text-xs">{adr.id}</TableCell>
                  <TableCell>{adr.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{adr.status}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{adr.path}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card id="traceability">
          <CardHeader>
            <CardDescription className="font-mono text-xs uppercase tracking-[0.24em]">Trace Report</CardDescription>
            <CardTitle>Missing Links</CardTitle>
            <CardAction>
              <Button render={<Link href="/traceability" />} variant="link">
                View details
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {data.traceability.missingLinks.length === 0 ? (
              <EmptyState>No missing traceability links found.</EmptyState>
            ) : (
              <ItemGroup>
                {data.traceability.missingLinks.map((link) => (
                  <MissingLinkItem field={link.field} file={link.file} key={`${link.file}:${link.field}`} />
                ))}
              </ItemGroup>
            )}
          </CardContent>
        </Card>

        <Card id="review">
          <CardHeader>
            <CardDescription className="font-mono text-xs uppercase tracking-[0.24em]">Review Gate</CardDescription>
            <CardTitle>Outcome: {data.review.outcome}</CardTitle>
            <CardAction>
              <Button render={<Link href="/review" />} variant="link">
                View findings
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {data.review.blockingFindings.length === 0 && data.review.requestedChanges.length === 0 ? (
              <EmptyState>No deterministic review blockers or requested changes found.</EmptyState>
            ) : (
              <div className="flex flex-col gap-3">
                <FindingGroup findings={data.review.blockingFindings} title="Blocking Findings" tone="blocking" />
                <FindingGroup findings={data.review.requestedChanges} title="Requested Changes" tone="requested" />
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </DashboardShell>
  );
}
