"use client";

import { TabView } from "@/components/appComp/Subaccounts/TabView";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Drift Subaccounts</h1>
        <p className="text-primary/60">
          View and manage Drift Protocol subaccounts
        </p>
      </div>
      <TabView />
    </main>
  );
}
