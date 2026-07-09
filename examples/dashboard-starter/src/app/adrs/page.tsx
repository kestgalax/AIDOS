import { SectionBlock } from "@/components/dashboard-blocks";
import { DashboardShell, EmptyState, PageHeader, SummaryCard } from "@/components/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAdrDetail, getDashboardData } from "@/lib/aidos-dashboard";
import { getAidosProjectRoot } from "@/lib/project-root";

export default async function AdrsPage() {
  const root = getAidosProjectRoot();
  const data = await getDashboardData(root);
  const details = (
    await Promise.all(data.adrs.map(async (adr) => await getAdrDetail(root, adr.id)))
  ).filter((adr) => adr !== null);

  return (
    <DashboardShell>
      <PageHeader
        eyebrow="Decision Layer"
        title="Architecture Decision Records"
        description="Detailed view of accepted project decisions. Markdown ADR files remain the source of truth."
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3" aria-label="ADR summary">
        <SummaryCard label="Total ADRs" value={String(details.length)} detail="Decision records found" />
        <SummaryCard
          label="Accepted"
          value={String(details.filter((adr) => adr.status.toLowerCase().includes("accepted")).length)}
          detail="Status contains Accepted"
        />
        <SummaryCard label="Source" value="Markdown" detail="Read-only projection" />
      </section>

      <section className="flex flex-col gap-4">
        {details.length === 0 ? (
          <EmptyState>No ADRs found in docs/decisions.</EmptyState>
        ) : (
          details.map((adr) => (
            <Card id={adr.id} key={adr.path}>
              <CardHeader>
                <CardDescription className="font-mono text-xs uppercase tracking-[0.24em]">{adr.id}</CardDescription>
                <CardTitle className="text-2xl">{adr.title}</CardTitle>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <Badge variant="outline">{adr.status}</Badge>
                  <span className="font-mono text-muted-foreground">{adr.path}</span>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                  {Object.entries(adr.sections)
                    .filter(([, body]) => body.length > 0)
                    .map(([title, body]) => (
                      <SectionBlock body={body} key={`${adr.id}:${title}`} title={title} />
                    ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </section>
    </DashboardShell>
  );
}
