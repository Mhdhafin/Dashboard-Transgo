export function getStatusVariant(status: string): string {
  switch (status) {
    case "pending":
      return "bg-red-50 text-red-500";
    case "waiting":
      return "bg-yellow-50 text-yellow-500";
    case "partially paid":
      return "bg-yellow-50 text-yellow-500";
    case "on_progress":
      return "bg-blue-50 text-blue-500";
    case "done":
    case "paid":
      return "bg-green-50 text-green-500";
    case "rejected":
      return "bg-red-50 text-red-500";
    case "failed":
      return "bg-red-50 text-red-500";
    default:
      return "";
  }
}

export enum LedgerStatus {
  PENDING = "pending",
  PARTIALLY_PAID = "partially paid",
  DONE = "done",
  FAILED = "failed",
  PAID = "paid",
}

export function getLedgerStatusLabel(payment_status: string): string {
  switch (payment_status) {
    case LedgerStatus.PENDING:
      return "Belum Dibayar";
    case LedgerStatus.DONE:
    case LedgerStatus.PAID:
      return "Lunas";
    case LedgerStatus.PARTIALLY_PAID:
      return "Kurang Bayar";
    case LedgerStatus.FAILED:
      return "Gagal";
    default:
      return "";
  }
}
