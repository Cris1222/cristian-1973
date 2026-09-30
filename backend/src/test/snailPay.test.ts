
import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app.js";

describe("SnailPay API", () => {

  const validPayment = {
    card_number: "1234123412341234",
    expiration_date: "12/26",
    cvv: "543",
    full_name: "Usuario Prueba",
    transaction_amount: 500,
    payer_id: "user_1",
    payer_email: "correo@ejemplo.com",
  };

  // TRANSACCIÓN APROBADA
  it("debe aprobar una transacción válida", async () => {
    const response = await request(app).post("/api/snailpay/charge").send(validPayment);

    expect(response.status).toBe(200);

    expect(response.body.status).toBe("approved");

    expect(response.body.status_detail).toBe("accredited");

    expect(response.body.transaction_amount).toBe(500);

    expect(response.body.authorization_code).not.toBeNull();
  });


  // TARJETA RECHAZADA
  it("debe rechazar una tarjeta incorrecta", async () => {
    const response = await request(app)
      .post("/api/snailpay/charge")
      .send({
        ...validPayment,
        card_number: "1111111111111111",
      });

    expect(response.status).toBe(400);

    expect(response.body.status).toBe("rejected");

    expect(response.body.status_detail).toBe("card_declined");

    expect(response.body.authorization_code).toBeNull();
  });


  // MONTO INVÁLIDO
  it("debe rechazar un monto igual a cero", async () => {
    const response = await request(app)
      .post("/api/snailpay/charge")
      .send({
        ...validPayment,
        transaction_amount: 0,
      });

    expect(response.status).toBe(400);

    expect(response.body.status).toBe("rejected");

    expect(response.body.status_detail).toBe("invalid_amount");
  });


  it("debe rechazar un monto negativo", async () => {
    const response = await request(app)
      .post("/api/snailpay/charge")
      .send({
        ...validPayment,
        transaction_amount: -100,
      });

    expect(response.status).toBe(400);

    expect(response.body.status_detail).toBe("invalid_amount");
  });


  // NÚMERO DE TARJETA
  it("debe rechazar un número de tarjeta inválido", async () => {
    const response = await request(app)
      .post("/api/snailpay/charge")
      .send({
        ...validPayment,
        card_number: "1234",
      });

    expect(response.status).toBe(400);

    expect(response.body.status_detail).toBe("invalid_card_number");
  });


  // CVV
  it("debe rechazar un CVV inválido", async () => {
    const response = await request(app)
      .post("/api/snailpay/charge")
      .send({
        ...validPayment,
        cvv: "12",
      });

    expect(response.status).toBe(400);

    expect(response.body.status_detail).toBe("invalid_cvv");
  });


  // VENCIMIENTO
  it("debe rechazar un formato de vencimiento inválido", async () => {
    const response = await request(app)
      .post("/api/snailpay/charge")
      .send({
        ...validPayment,
        expiration_date: "2026-12",
      });

    expect(response.status).toBe(400);

    expect(response.body.status_detail).toBe("invalid_expiration_date");
  });


  // EMAIL
  it("debe rechazar un email inválido", async () => {
    const response = await request(app)
      .post("/api/snailpay/charge")
      .send({
        ...validPayment,
        payer_email: "correo-invalido",
      });

    expect(response.status).toBe(400);

    expect(response.body.status_detail).toBe("invalid_email");
  });


  // CAMPOS VACÍOS
  it("debe rechazar campos obligatorios vacíos", async () => {
    const response = await request(app)
      .post("/api/snailpay/charge")
      .send({
        ...validPayment,
        full_name: "",
      });

    expect(response.status).toBe(400);

    expect(response.body.status).toBe("rejected");

    expect(response.body.status_detail).toBe("invalid_data");});


  // ERROR DEL SISTEMA

  it("debe simular un error interno de SnailPay", async () => {
    const response = await request(app)
      .post("/api/snailpay/charge")
      .set("X-Simulate-Error", "true")
      .send(validPayment);

    expect(response.status).toBe(500);

    expect(response.body.status).toBe("error");

    expect(response.body.status_detail).toBe("internal_error");

    expect(response.body.authorization_code).toBeNull();
  });


  // ESTRUCTURA DE RESPUESTA

  it("debe regresar todos los campos requeridos", async () => {
    const response = await request(app).post("/api/snailpay/charge").send(validPayment);

    expect(response.body).toHaveProperty("id");

    expect(response.body).toHaveProperty("status");

    expect(response.body).toHaveProperty("status_detail");

    expect(response.body).toHaveProperty("transaction_amount");

    expect(response.body).toHaveProperty("date_created");

    expect(response.body).toHaveProperty("authorization_code");

    expect(response.body).toHaveProperty("reference");

    expect(response.body).toHaveProperty("payer_id");

    expect(response.body).toHaveProperty("payer_email");

    expect(response.body).toHaveProperty("card_number");

    expect(response.body).toHaveProperty("cvv");
  });
});