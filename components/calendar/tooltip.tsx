import React from "react";
import { HoverCard, HoverCardTrigger } from "../ui/hover-card";
import TooltipDate from "./tooltip-date";
import TooltipFleet from "./tooltip-fleet";

const Tooltip = ({
  children,
  type,
}: {
  children: React.ReactNode;
  type: "date" | "fleet";
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger>{children}</HoverCardTrigger>
      {type === "date" ? <TooltipDate /> : <TooltipFleet />}
    </HoverCard>
  );
};

export default Tooltip;
