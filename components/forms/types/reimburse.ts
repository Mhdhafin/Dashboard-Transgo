/**
 * file ini berisi type yang akan digunakan di Reimburse Module
 *
 */

import { formSchema } from "../validation/reimburseSchema";
import { z } from "zod";

export type ReimburseFormValues = z.infer<typeof formSchema> & {
  service_price: string;
  start_request: {
    distance: number;
    address: string;
  };
  end_request: {
    distance: number;
    address: string;
  };
};

export interface ReimburseFormProps {
  initialData: any | null;
  isEdit?: boolean | null;
}

export interface DetailPrice {
  discount: number;
  driver_price: number;
  grand_total: number;
  insurance_price: number;
  rent_price: number;
  service_price: number;
  sub_total: number;
  tax: number;
  total: number;
  total_driver_price: number;
  total_rent_price: number;
  total_weekend_price: number;
  weekend_days: any[];
  weekend_price: number;
}

export type Messages = {
  [key in keyof ReimburseFormValues]?: string;
} & {
  start_request?: {
    [key in keyof ReimburseFormValues["start_request"]]?: string | undefined;
  };
  end_request?: {
    [key in keyof ReimburseFormValues["end_request"]]?: string | undefined;
  };
};
