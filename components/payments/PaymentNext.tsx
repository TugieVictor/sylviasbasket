'use client'

import MpesaWaiting from './MpesaWaiting'
import SubmitToIPay from './SubmitToIPay'

export type PaymentNextData =
  | { form: { action: string; fields: Record<string, string> } }
  | { mpesa: { reference: string; phone: string } }

/** Shows the next payment step the server chose: the M-Pesa waiting screen, or the move to iPay. */
export default function PaymentNext({ next, onPaid, onTryAgain }: { next: PaymentNextData; onPaid?: () => void; onTryAgain?: () => void }) {
  if ('mpesa' in next) return <MpesaWaiting reference={next.mpesa.reference} phone={next.mpesa.phone} onPaid={onPaid} onTryAgain={onTryAgain} />
  return <SubmitToIPay action={next.form.action} fields={next.form.fields} />
}
