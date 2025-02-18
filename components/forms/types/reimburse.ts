/**
 * file ini berisi type yang akan digunakan di Reimburse Module
 *
 */
import { z } from "zod";

import { formSchema, editSchema } from "../validation/reimburseSchema";

export type ReimburseFormValues = z.infer<typeof formSchema> & {
  nominal: number;
  bank: string;
  noRekening: string;
  driver: number;
  location: number;
  date: Date;
  description: string;
  transaction_proof_url: string;
};

export interface ReimburseFormProps {
  initialData: any | null;
  field?: string;
  isEdit?: boolean | null;
}

export type Messages = {
  [key in keyof ReimburseFormValues]?: string | number | Date;
} & {
  nominal: number;
  bank: string;
  noRekening: string;
  driver: number;
  location: number;
  date: Date;
  description: string;
  transaction_proof_url: string;
};
