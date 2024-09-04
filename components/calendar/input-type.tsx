'use client'
import React from "react";

import { useMonthYearState } from "@/hooks/useMonthYearState";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const InputType = () => {
  const { typeQuery, setTypeQuery } = useMonthYearState();

  const type = [
    { id: "", name: "Semua Kendaraan" },
    { id: "motorcycle", name: "Motor" },
    { id: "car", name: "Mobil" },
  ]

  const handleTypeInputChange = (
    value: string,
  ) => {
    setTypeQuery(value);
  };

  return (
    <Select
      onValueChange={handleTypeInputChange}
      value={typeQuery}
      defaultValue={typeQuery}
    >
      <SelectTrigger>
        <SelectValue
          defaultValue={typeQuery}
          placeholder="Pilih tipe"
        />
      </SelectTrigger>
      <SelectContent>
        {/* @ts-ignore  */}
        {type.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default InputType;
