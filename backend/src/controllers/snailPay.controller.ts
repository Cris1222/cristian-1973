import type { Request, Response } from "express";
import type { SnailPayRequest, SnailPayResponse } from "../types/snailPay.types.js";

export const processPayment = (req: Request<{}, {}, SnailPayRequest>, res: Response<SnailPayResponse>) => {
  const {
    card_number = "",
    expiration_date = "",
    cvv = "",
    full_name = "",
    transaction_amount = 0,
    payer_id = "",
    payer_email = "",
  } = req.body ?? {};

  const timestamp = Date.now();
  const dateCreated = new Date().toISOString();
  const operationId = `txn_${timestamp}`;
  const reference = `SNAIL_${timestamp}`;

  const rejected = (statusDetail: string, statusCode: number = 400) => {
    return res.status(statusCode).json({
      id: operationId,
      status: "rejected",
      status_detail: statusDetail,
      transaction_amount: typeof transaction_amount === "number" ? transaction_amount : 0,
      date_created: dateCreated,
      authorization_code: null,
      reference,
      payer_id: payer_id || "",
      payer_email: payer_email || "",
      card_number: card_number || "",
      cvv: cvv || "",
    });
  };

  if (req.headers["x-simulate-error"] === "true") {
    return res.status(500).json({
      id: operationId,
      status: "error",
      status_detail: "internal_error",
      transaction_amount: typeof transaction_amount === "number" ? transaction_amount : 0,
      date_created: dateCreated,
      authorization_code: null,
      reference,
      payer_id: payer_id || "",
      payer_email: payer_email || "",
      card_number: card_number || "",
      cvv: cvv || "",
    });
  }

  if (!card_number || !expiration_date || !cvv || !full_name || !payer_id || !payer_email) {
    return rejected("invalid_data");
  }

  if ( typeof transaction_amount !== "number" || !Number.isFinite(transaction_amount) || transaction_amount <= 0) {
    return rejected("invalid_amount");
  }

  if (!/^\d{16}$/.test(card_number)) {
    return rejected("invalid_card_number");
  }

  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiration_date)) {
    return rejected("invalid_expiration_date");
  }

  if (!/^\d{3}$/.test(cvv)) {
    return rejected("invalid_cvv");
  }

  if (full_name.trim().length < 2) {
    return rejected("invalid_full_name");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(payer_email)) {
    return rejected("invalid_email");
  }

  const validPayment = card_number === "1234123412341234" && expiration_date === "12/26" && cvv === "543";

  if (!validPayment) {
    return rejected("card_declined");
  }

  return res.status(200).json({
    id: operationId,
    status: "approved",
    status_detail: "accredited",
    transaction_amount,
    date_created: dateCreated,
    authorization_code: `AUTH_${timestamp}`,
    reference,
    payer_id,
    payer_email,
    card_number,
    cvv,
  });
};