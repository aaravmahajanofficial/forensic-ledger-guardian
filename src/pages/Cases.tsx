import React from "react";
import CaseList from "@/components/cases/CaseList";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Cases = () => {
  return (
    <div className="space-y-8">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-foreground">
              Case Management
            </h1>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>All Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <CaseList />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Cases;
