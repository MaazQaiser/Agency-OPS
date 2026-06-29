"use client";

import { useState } from "react";
import { FarmersEdgePageHeader } from "./FarmersEdgePageHeader";
import { FarmersEdgeWorkspace } from "./FarmersEdgeWorkspace";
import { useFarmersEdgeData } from "@/hooks/useFarmersEdgeData";

export function FarmersEdgeModule() {
  const [activeVertical, setActiveVertical] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { verticals } = useFarmersEdgeData(activeVertical);

  return (
    <>
      <FarmersEdgePageHeader
        activeVertical={activeVertical}
        onVerticalSelect={setActiveVertical}
        verticals={verticals}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <FarmersEdgeWorkspace
        vertical={activeVertical}
        onVerticalChange={setActiveVertical}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showToolbar={false}
      />
    </>
  );
}
