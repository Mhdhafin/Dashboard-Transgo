export function getStatusVariant(status: string): string {
  switch (status) {
    case LedgerStatus.PENDING:
    case LedgerStatus.ON_HOLD:
      return "bg-red-50 text-red-500";
    case LedgerStatus.PARTIALLY_PAID:
      return "bg-yellow-50 text-yellow-500";
    case LedgerStatus.DONE:
    case LedgerStatus.PROCCESSED:
      return "bg-green-50 text-green-500";
    default:
      return "bg-red-50 text-red-500";
  }
}

export enum LedgerStatus {
  PENDING = "pending",
  DONE = "done",
  PARTIALLY_PAID = "partially paid",

  ON_HOLD = "on_hold",
  PROCCESSED = "proccessed",
}

export function getLedgerStatusLabel(payment_status: string): string {
  switch (payment_status) {
    case LedgerStatus.PENDING:
      return "Belum Dibayar";
    case LedgerStatus.DONE:
      return "Lunas";
    case LedgerStatus.PARTIALLY_PAID:
      return "Kurang Bayar";
    case LedgerStatus.ON_HOLD:
      return "Belum Diproses";
    case LedgerStatus.PROCCESSED:
      return "Sudah Diproses";
    default:
      return "";
  }
}
