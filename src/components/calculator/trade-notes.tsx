'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";

interface TradeNotesProps {
  notes: string;
  setNotes: (notes: string) => void;
}

export function TradeNotes({ notes, setNotes }: TradeNotesProps) {
  return (
    <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Trade Notes
        </CardTitle>
        <CardDescription>
          Document your trade setup and observations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[200px] resize-none"
        />
      </CardContent>
    </Card>
  );
}