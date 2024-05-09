"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
export const usePresignedUrl = async (queryParams) => {
  const session = useSession();
  console.log("test", session);
  try {
    // Konfigurasi autentikasi kustom jika diperlukan
    const customAuthConfig = {
      headers: {
        Authorization: "Bearer YOUR_CUSTOM_TOKEN",
      },
    };

    // Membuat permintaan HTTP dengan Axios untuk mendapatkan presigned URL
    const response = await axios.get("YOUR_PREIGNED_URL_ENDPOINT", {
      params: { queryParams }, // Menambahkan query parameter kustom
      ...customAuthConfig, // Menggunakan konfigurasi autentikasi kustom
    });

    // Mengembalikan data yang diterima dari endpoint presign URL
    return response.data;
  } catch (error) {
    // Menangani kesalahan jika ada
    console.error("Error fetching presigned URL:", error);
    throw new Error("Failed to fetch presigned URL");
  }
};
