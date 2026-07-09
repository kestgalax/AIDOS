import { FileArtifactItem } from "@/components/dashboard-blocks";
import { DashboardShell, EmptyState, PageHeader, SummaryCard } from "@/components/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { ItemGroup } from "@/components/ui/item";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDashboardData, getTraceabilityDetail } from "@/lib/aidos-dashboard";
import { getAidosProjectRoot } from "@/lib/project-root";

export default async function TraceabilityPage() {
  const root = getAidosProjectRoot();
  const [data, detail] = await Promise.all([getDashboardData(root), getTraceabilityDetail(root)]);
  const missingFieldCount = detail.files.reduce((total, file) => total + file.missingFields.length, 0);

  return (
    <DashboardShell>
      <PageHeader
        eyebrow="Trace Report"
        title="Traceability Findings"
        description="Grouped missing links across feature and task artifacts, preserving the markdown files as the editable record."
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3" aria-label="Traceability summary">
        <SummaryCard label="Files With Gaps" value={String(detail.files.length)} detail="Artifacts needing trace links" />
        <SummaryCard label="Missing Fields" value={String(missingFieldCount)} detail="Required traceability fields" />
        <SummaryCard label="Review Outcome" value={data.review.outcome} detail="Current deterministic gate" />
      </section>

      <Card>
        <CardHeader>
          <CardDescription className="font-mono text-xs uppercase tracking-[0.24em]">By Artifact</CardDescription>
          <CardTitle className="text-2xl">Missing Traceability Links</CardTitle>
        </CardHeader>
        <CardContent>
          {detail.files.length === 0 ? (
            <EmptyState>No missing traceability links found.</EmptyState>
          ) : (
            <ItemGroup>
              {detail.files.map((file) => (
                <FileArtifactItem file={file.file} key={file.file}>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {file.missingFields.map((field) => (
                      <Badge key={field} variant="outline">
                        Missing: {field}
                      </Badge>
                    ))}
                  </div>
                </FileArtifactItem>
              ))}
            </ItemGroup>
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
