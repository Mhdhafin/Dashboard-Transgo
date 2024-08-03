import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "../ui/button";

const MonthSelector = () => {
  return (
    <div className="flex flex-row gap-1 items-center">
      <Button variant="outline" className="h-8 w-8 p-0">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button variant="outline" className="h-8">
        Agustus
      </Button>
      <Button variant="outline" className="h-8 w-8 p-0">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MonthSelector;
