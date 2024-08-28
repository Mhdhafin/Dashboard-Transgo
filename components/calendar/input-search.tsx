import React from "react";

import { Input } from "../ui/input";
import { useMonthYearState } from "@/hooks/useMonthYearState";

const InputSearch = () => {
  const { searchQuery, setSearchQuery } = useMonthYearState();

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;
    setSearchQuery(value);
  };

  return (
    <Input
      placeholder="Cari armada atau arus...."
      value={searchQuery}
      onChange={handleSearchInputChange}
      className="w-[360px]"
    />
  );
};

export default InputSearch;
