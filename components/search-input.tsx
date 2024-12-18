"use client";

import React from "react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchQuery,
  onSearchChange,
  placeholder,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="w-full lg:w-auto">
      <Input
        type="text"
        placeholder={placeholder}
        className="w-full lg:w-[390px]"
        value={searchQuery}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchInput;
