export const PAYMENT_STATUS = {
  pending: {
    text: "Belum Bayar",
    color: "text-red-900",
    bgColor: "bg-red-50",
  },
  done: {
    text: "Lunas",
    color: "text-green-900",
    bgColor: "bg-green-50",
  },
  "partially paid": {
    text: "Kurang Bayar",
    color: "text-yellow-900",
    bgColor: "bg-yellow-50",
  },
};

export const ORDER_STATUS = {
  pending: {
    text: "Belum Diterima",
    color: "text-red-900",
    bgColor: "bg-red-100",
    bgColorDarker: "bg-red-500",
    border: "hover:border hover:border-red-500",
  },
  done: {
    text: "Selesai Sewa",
    color: "text-green-900",
    bgColor: "bg-green-100",
    bgColorDarker: "bg-green-500",
    border: "hover:border hover:border-green-500",
  },
  on_progress: {
    text: "Sedang Berjalan",
    color: "text-blue-900",
    bgColor: "bg-blue-50",
    bgColorDarker: "bg-blue-500",
    border: "hover:border hover:border-blue-500",
  },
  waiting: {
    text: "Belum Kembali",
    color: "text-neutral-900",
    bgColor: "bg-yellow-100",
    bgColorDarker: "bg-yellow-500",
    border: "hover:border hover:border-yellow-500",
  },
};

export const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
