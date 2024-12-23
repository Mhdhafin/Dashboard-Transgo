"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/context/UserContext";

const API_HOST = process.env.NEXT_PUBLIC_API_HOST;

export default function DiscountPage() {
  const [discount, setDiscount] = useState(0);
  const { toast } = useToast();
  const { user } = useUser();

  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        const response = await fetch(`${API_HOST}/fleets/discount`);
        const data = await response.text();
        setDiscount(Number(data));
      } catch (error) {
        console.error("Failed to fetch discount:", error);
      }
    };

    fetchDiscount();
  });

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_HOST}/fleets/discount`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.accessToken}`,
        },
        body: JSON.stringify({ discount }),
      });

      if (response.ok) {
        toast({
          title: "Discount saved",
          description: `Discount percentage set to ${discount}%`,
        });
      } else {
        throw new Error("Failed to save discount");
      }
    } catch (error) {
      console.error("Failed to save discount:", error);
      toast({
        title: "Error",
        description: "Failed to save discount",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8">
      <Heading title="Set Discount" description="Set the global discount percentage" />
      <Separator />
      <div className="space-y-4">
        <Input
          type="number"
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value))}
          placeholder="Enter discount percentage"
        />
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}