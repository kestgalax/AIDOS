import type { ReactNode } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";

export function BulletStatusList(props: { items: string[] }) {
  return (
    <ItemGroup>
      {props.items.map((item) => (
        <Item key={item} variant="muted">
          <ItemContent>
            <ItemDescription>{item}</ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  );
}

export function FileArtifactItem(props: { file: string; children: ReactNode }) {
  return (
    <Item className="flex-col items-start gap-3" variant="muted">
      <ItemContent className="w-full">
        <ItemTitle className="font-mono text-xs font-normal text-muted-foreground">{props.file}</ItemTitle>
        {props.children}
      </ItemContent>
    </Item>
  );
}

export function MissingLinkItem(props: { file: string; field: string }) {
  return (
    <Item variant="muted">
      <ItemContent>
        <ItemTitle className="font-mono text-xs font-normal text-muted-foreground">{props.file}</ItemTitle>
        <ItemDescription>Missing: {props.field}</ItemDescription>
      </ItemContent>
    </Item>
  );
}

export function SectionBlock(props: { title: string; body: string }) {
  return (
    <Item className="h-full flex-col items-start" variant="muted">
      <ItemContent>
        <ItemTitle>{props.title}</ItemTitle>
        <ItemDescription className="mt-2 whitespace-pre-wrap leading-6">{props.body}</ItemDescription>
      </ItemContent>
    </Item>
  );
}

type Finding = string | { file: string; message: string };

function findingKey(finding: Finding): string {
  return typeof finding === "string" ? finding : `${finding.file}:${finding.message}`;
}

function findingMessage(finding: Finding): string {
  return typeof finding === "string" ? finding : finding.message;
}

function findingFile(finding: Finding): string | undefined {
  return typeof finding === "string" ? undefined : finding.file;
}

export function FindingGroup(props: {
  title: string;
  findings: Finding[];
  tone: "blocking" | "requested";
}) {
  if (props.findings.length === 0) {
    return null;
  }

  const alertVariant = props.tone === "blocking" ? "destructive" : "default";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-semibold">{props.title}</h4>
        <Badge variant={props.tone === "blocking" ? "destructive" : "secondary"}>{props.findings.length}</Badge>
      </div>
      <ItemGroup>
        {props.findings.map((finding) => {
          const file = findingFile(finding);
          return (
            <Alert key={findingKey(finding)} variant={alertVariant}>
              {file ? <AlertTitle className="font-mono text-xs">{file}</AlertTitle> : null}
              <AlertDescription>{findingMessage(finding)}</AlertDescription>
            </Alert>
          );
        })}
      </ItemGroup>
    </div>
  );
}
