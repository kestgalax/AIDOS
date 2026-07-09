import { FileArtifactItem, FindingGroup } from "@/components/dashboard-blocks";
import { DashboardShell, EmptyState, PageHeader, SummaryCard } from "@/components/dashboard-shell";
import { ItemGroup } from "@/components/ui/item";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getReviewDetail } from "@/lib/aidos-dashboard";
import { getAidosProjectRoot } from "@/lib/project-root";

export default async function ReviewPage() {
  const root = getAidosProjectRoot();
  const detail = await getReviewDetail(root);
  const blockingCount = detail.files.reduce((total, file) => total + file.blocking.length, 0);
  const requestedChangeCount = detail.files.reduce((total, file) => total + file.requestedChanges.length, 0);

  return (
    <DashboardShell>
      <PageHeader
        eyebrow="Review Gate"
        title="Deterministic Review Findings"
        description="A read-only view of reviewer automation findings grouped by artifact, making blockers visible before handoff."
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3" aria-label="Review summary">
        <SummaryCard label="Outcome" value={detail.outcome} detail="Current deterministic review result" />
        <SummaryCard label="Blocking" value={String(blockingCount)} detail="Must be fixed before approval" />
        <SummaryCard label="Requested Changes" value={String(requestedChangeCount)} detail="Quality gaps to resolve" />
      </section>

      <Card>
        <CardHeader>
          <CardDescription className="font-mono text-xs uppercase tracking-[0.24em]">By Artifact</CardDescription>
          <CardTitle className="text-2xl">Findings</CardTitle>
        </CardHeader>
        <CardContent>
          {detail.files.length === 0 ? (
            <EmptyState>No deterministic review blockers or requested changes found.</EmptyState>
          ) : (
            <ItemGroup>
              {detail.files.map((file) => (
                <FileArtifactItem file={file.file} key={file.file}>
                  <FindingGroup findings={file.blocking} title="Blocking Findings" tone="blocking" />
                  <FindingGroup findings={file.requestedChanges} title="Requested Changes" tone="requested" />
                </FileArtifactItem>
              ))}
            </ItemGroup>
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
