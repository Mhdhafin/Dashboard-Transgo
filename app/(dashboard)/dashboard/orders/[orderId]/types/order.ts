export function getStatusVariant(status: string): string {
    switch (status) {
        case 'pending':
            return 'bg-red-50 text-red-500';
        case 'waiting':
            return 'bg-yellow-50 text-yellow-500';
        case 'partially paid':
            return 'bg-yellow-50 text-yellow-500';
        case 'confirmed':
            return 'bg-orange-50 text-orange-500';
        case 'on_going':
            return 'bg-blue-50 text-blue-500';
        case 'on_progress':
            return 'bg-blue-50 text-blue-500';
        case 'done':
            return 'bg-green-50 text-green-500';
        case 'rejected':
            return 'bg-red-50 text-red-500';
        case 'failed':
            return 'bg-gray-50 text-gray-500';
        default:
            return '';
    }
}

export enum OrderStatus {
    PENDING = 'pending',
    WAITING = 'waiting',
    CONFIRMED = 'confirmed',
    ON_GOING = 'on_going',
    ON_PROGRESS = 'on_progress',
    DONE = 'done',
}

export enum PaymentStatus {
    PENDING = 'pending',
    PARTIALLY_PAID = 'partially paid',
    DONE = 'done',
    FAILED = 'failed',
}

export function getPaymentStatusLabel(payment_status: string): string {

    switch (payment_status) {
        case PaymentStatus.PENDING:
            return 'Belum Dibayar';
        case PaymentStatus.DONE:
            return 'Lunas';
        case PaymentStatus.PARTIALLY_PAID:
            return 'Kurang Bayar';
        case PaymentStatus.FAILED:
            return 'Gagal';
        default:
            return ''
    }
}