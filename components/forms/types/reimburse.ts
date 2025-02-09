/**
 * file ini berisi type yang akan digunakan di Reimburse Module
 *
 */

// import { formSchema } from "../validation/reimburseSchema";
import { z } from "zod";

export const formSchema = z.object({
  driver: z.string().min(1, "Tolong Pilih Nama Driver"), // Nama driver (wajib diisi)
  nominal: z
    .string()
    .regex(/^\d+$/, "Nominal harus berupa angka") // Nominal dalam bentuk string angka
    .min(1, "Tolong masukkan nominal anda"),
  bank_name: z.string().min(1, "Tolong Pilih Nama Bank"), // Nama bank
  location: z.string().min(1, "Tolong Pilih Lokasi"), // Lokasi reimburse
  noRekening: z
    .string()
    .regex(/^\d+$/, "Nomor rekening harus berupa angka") // Nomor rekening (hanya angka)
    .min(10, "Tolong masukkan nomor rekening anda"),
  date: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    "Tolong masukkan tanggal ", // Validasi format tanggal
  ),
  description: z.string().optional(), // Keterangan tambahan (opsional)
});

export type ReimburseFormValues = z.infer<typeof formSchema> & {
  service_price: string;
};

export interface ReimburseFormProps {
  initialData: any | null;
  field?: string;
  isEdit?: boolean | null;
}

export type Messages = {
  [key in keyof ReimburseFormValues]?: string;
} & {
  driver?: string;
  bank_name?: string;
  nominal?: string;
  location?: string;
  noRekening?: string;
  date?: string;
  description?: string;
};
