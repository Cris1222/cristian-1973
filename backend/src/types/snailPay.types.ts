export interface SnailPayRequest {
  card_number: string;
  expiration_date: string;
  cvv: string;
  full_name: string;
  transaction_amount: number;
  payer_id: string;
  payer_email: string;
}

export type SnailPayStatus = | "approved" | "rejected" | "error";

export interface SnailPayResponse {
  id: string;
  status: SnailPayStatus;
  status_detail: string;
  transaction_amount: number;
  date_created: string;
  authorization_code: string | null;
  reference: string;
  payer_id: string;
  payer_email: string;
  card_number: string;
  cvv: string;
}