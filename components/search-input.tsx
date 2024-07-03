"use client";

import React from "react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="my-4">
      <Input
        type="text"
        placeholder="Cari pesanan..."
        className="w-full"
        value={searchQuery}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchInput;
