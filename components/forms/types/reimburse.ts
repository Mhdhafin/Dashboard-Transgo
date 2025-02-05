/**
 * file ini berisi type yang akan digunakan di Reimburse Module
 *
 */

// import { formSchema } from "../validation/reimburseSchema";
import { z } from "zod";

export const formSchema = z.object({
  driver: z.string().min(1, "Tolong Pilih Nama Driver"), // Nama driver (wajib diisi)
  amount: z
    .string()
    .regex(/^\d+$/, "Nominal harus berupa angka") // Nominal dalam bentuk string angka
    .min(1, "Tolong masukkan nominal anda"),
  bank_name: z.string().min(1, "Tolong Pilih Nama Bank"), // Nama bank
  location: z.string().min(1, "Tolong Pilih Lokasi"), // Lokasi reimburse
  account_number: z
    .string()
    .regex(/^\d+$/, "Nomor rekening harus berupa angka") // Nomor rekening (hanya angka)
    .min(10, "Tolong masukkan nomor rekening anda"),
  date: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    "Tolong masukkan tanggal ", // Validasi format tanggal
  ),
  time: z
    .string()
    .regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"), // Validasi format waktu
  description: z.string().optional(), // Keterangan tambahan (opsional)
});

export type ReimburseFormValues = z.infer<typeof formSchema> & {
  service_price: string;
};

export interface ReimburseFormProps {
  initialData: any | null;
  isEdit?: boolean | null;
}

export type Messages = {
  [key in keyof ReimburseFormValues]?: string;
} & {
  driver?: string;
  bank_name?: string;
  amount?: string;
  location?: string;
  account_number?: string;
  date?: string;
  time?: string;
  description?: string;
};
