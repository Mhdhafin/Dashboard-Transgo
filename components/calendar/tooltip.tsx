import React from "react";
import { HoverCard, HoverCardTrigger } from "../ui/hover-card";
import TooltipDate from "./tooltip-date";
import TooltipFleet from "./tooltip-fleet";

const Tooltip = ({
  children,
  type,
  data,
}: {
  children: React.ReactNode;
  type: "date" | "fleet";
  data: any;
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger>{children}</HoverCardTrigger>
      {type === "date" ? (
        <TooltipDate data={data} />
      ) : (
        <TooltipFleet data={data} />
      )}
    </HoverCard>
  );
};

export default Tooltip;
