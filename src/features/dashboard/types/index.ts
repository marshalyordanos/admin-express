export interface AgentPerformance {
  id: string;
  avgTime: string;
  region: string;
  status: "Completed" | "Failed";
  onTimePercent: number;
}

export interface BranchData {
  name: string;
  completed: number;
  delayed: number;
  revenue: number;
  efficiency: number;
  trend: "up" | "down";
}

export interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    value: number;
  }[];
  label?: string;
}

export interface SalesData {
  name: string;
  revenue: number;
  profit: number;
}
