"use client";

import { TaskPriority } from "@/lib/types";
import { PRIORITY_CONFIG } from "@/lib/constants";

interface PriorityIconProps {
  priority: TaskPriority;
  size?: number;
}

export default function PriorityIcon({ priority, size = 12 }: PriorityIconProps) {
  const color = PRIORITY_CONFIG[priority].color;

  switch (priority) {
    case "critical":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
        >
          <path d="M8 1L15 14H1L8 1Z" strokeLinejoin="round" />
          <path d="M8 6V9" strokeLinecap="round" />
          <circle cx="8" cy="11.5" r="0.5" fill={color} />
        </svg>
      );
    case "high":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="none"
          stroke={color}
          strokeWidth="2"
        >
          <path d="M8 12V4" strokeLinecap="round" />
          <path d="M4 7L8 3L12 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "medium":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="none"
          stroke={color}
          strokeWidth="2"
        >
          <path d="M3 8H13" strokeLinecap="round" />
        </svg>
      );
    case "low":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="none"
          stroke={color}
          strokeWidth="2"
        >
          <path d="M8 4V12" strokeLinecap="round" />
          <path d="M4 9L8 13L12 9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}
