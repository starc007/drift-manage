"use client";

import React from "react";
import { motion } from "framer-motion";

interface TabItemProps {
  title: string;
  count?: number;
  isActive: boolean;
  setActiveTab: () => void;
  id?: string;
}

const TabItem = ({
  title,
  count,
  isActive,
  setActiveTab,
  id,
}: TabItemProps) => {
  return (
    <button
      className={`md:px-5 px-3 py-2 sm:text-sm text-xs font-medium transition-all relative ${
        isActive ? "text-primary" : "text-primary-disabled hover:text-primary"
      }`}
      style={{
        WebkitTapHighlightColor: "transparent",
      }}
      onClick={() => setActiveTab()}
    >
      {isActive && (
        <motion.span
          layoutId={`bubble-tab-${id || ""}`}
          className="absolute inset-0 z-0 bg-primary rounded-lg overflow-hidden border border-primary/10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
        />
      )}
      <span
        className={`relative z-10 flex items-center gap-1.5 ${
          isActive ? "text-background" : ""
        }`}
      >
        {title}
      </span>
    </button>
  );
};

interface TabsProps {
  tabs: { label: string; value: string; count?: number }[];
  activeTab: string;
  setActiveTab: (index: string) => void;
  id?: string;
}

const Tabs = ({ tabs, activeTab, setActiveTab, id }: TabsProps) => {
  return (
    <div className="flex gap-2">
      {tabs.map((tab, index) => (
        <TabItem
          key={index}
          title={tab.label}
          count={tab.count}
          isActive={activeTab === tab.value}
          setActiveTab={() => setActiveTab(tab.value)}
          id={id}
        />
      ))}
    </div>
  );
};

export default Tabs;
