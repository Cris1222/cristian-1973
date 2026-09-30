# Carreras Caracoles

Aplicación web que simula una plataforma de carreras de caracoles y recargas de saldo mediante un servicio de pagos ficticio llamado **SnailPay**.

El proyecto utiliza React y TypeScript para el frontend y Express con TypeScript para la API de SnailPay.

---

## Tecnologías

### Frontend

- React
- TypeScript
- Vite
- React Router
- Recharts
- CSS
- LocalStorage
- Web Crypto API

### Backend

- Node.js
- Express
- TypeScript
- CORS

### Pruebas

- Vitest
- Supertest
- React Testing Library
- User Event
- JSDOM

---

## Funcionalidades

### Autenticación

La aplicación permite:

- Crear una cuenta.
- Iniciar sesión.
- Cerrar sesión.
- Mantener la sesión después de recargar la página.
- Proteger el dashboard para usuarios sin sesión.
- Persistir la información mediante LocalStorage.

El usuario inicia con un saldo de:

```text
$0.00
```

### Dashboard

El dashboard muestra:

- Nombre del usuario.
- Saldo disponible.
- Gráfica de apuestas ganadas y perdidas.
- Gráfica de victorias de los 6 caracoles.
- Opción para cargar saldo.
- Opción para cerrar sesión.

Los datos de carreras y apuestas son simulados.

Se consideran 6 caracoles y 6 carreras simuladas.

## SnailPay

SnailPay es una API ficticia desarrollada con Express para simular el procesamiento de una recarga.

Endpoint:

```text
POST /api/snailpay/charge
```

En desarrollo:

```text
http://localhost:3000/api/snailpay/charge
```

### Datos para una operación aprobada

Utilizar:

```text
Número de tarjeta:
1234123412341234

Fecha de vencimiento:
12/26

CVV:
543

Nombre:
Cualquier nombre no vacío con mas de dos caracteres

Monto:
Cualquier número mayor a 0
```

Ejemplo:

```json
{
  "card_number": "1234123412341234",
  "expiration_date": "12/26",
  "cvv": "543",
  "full_name": "Usuario Prueba",
  "transaction_amount": 500,
  "payer_id": "user_1",
  "payer_email": "usuario@correo.com"
}
```

Una operación aprobada incrementa inmediatamente el saldo del usuario y el nuevo saldo se guarda en LocalStorage.

## Errores de transacción

Si los datos de la tarjeta no corresponden con los datos definidos para SnailPay, la operación es rechazada.

Por ejemplo:

```text
1111111111111111
```

puede producir:

```json
{
  "status": "rejected",
  "status_detail": "card_declined"
}
```

Una transacción rechazada nunca modifica el saldo.

También se validan casos como:

```text
invalid_data
invalid_amount
invalid_card_number
invalid_expiration_date
invalid_cvv
invalid_full_name
invalid_email
card_declined
```

## Simulación de error del sistema

La API permite simular un error interno mediante el header:

```text
X-Simulate-Error: true
```

También puede activarse desde la interfaz utilizando:

```text
Simular error del sistema
```

En ese caso SnailPay responde con:

```json
{
  "status": "error",
  "status_detail": "internal_error"
}
```

Una operación con error del sistema nunca incrementa el saldo.

## Persistencia

La aplicación utiliza LocalStorage para conservar la información requerida por la prueba.

Principales claves:

```text
user
session
snailpay_payment_data
```

`user` almacena los datos del usuario y su saldo.

`session` permite conservar la sesión activa después de recargar la página.

`snailpay_payment_data` almacena los datos ficticios solicitados para la simulación de SnailPay.

## Consideraciones de seguridad

Este proyecto es una simulación. El número de tarjeta y CVV ficticios son incluidos en las respuestas de SnailPay y almacenados en LocalStorage.

**Esto no debe realizarse en una aplicación real.**

En un sistema de producción:

- Nunca debe almacenarse el CVV.
- No deben almacenarse datos sensibles de tarjetas en LocalStorage.
- El procesamiento de pagos debe realizarse mediante un proveedor certificado.
- La autenticación debe realizarse en el servidor.

La contraseña del usuario tampoco se almacena directamente en texto plano. Para esta simulación local se genera un hash SHA-256 utilizando Web Crypto API.

SHA-256 por sí solo no es una estrategia adecuada para almacenar contraseñas en producción. En una aplicación real se utilizaría un algoritmo diseñado para contraseñas como Argon2, bcrypt o scrypt junto con autenticación del lado del servidor.

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/Cris1222/cristian-1973.git
```

### Backend

Entrar al backend:

```bash
cd backend
```

Instalar dependencias:

```bash
npm install
```

Ejecutar:

```bash
npm run dev
```

La API estará disponible en:

```text
http://localhost:3000
```

### Frontend

Abrir otra terminal y entrar al frontend:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

Ejecutar:

```bash
npm run dev
```

Abrir en el navegador la dirección mostrada por Vite.

Normalmente:

```text
http://localhost:5173
```

## Flujo de prueba recomendado

1. Crear una cuenta.
2. Iniciar sesión.
3. Verificar que el saldo inicial sea `$0.00`.
4. Recargar saldo con los datos válidos de SnailPay.
5. Verificar que el saldo cambie inmediatamente.
6. Recargar la página y comprobar que el saldo se conserve.
7. Intentar una operación con una tarjeta incorrecta.
8. Verificar que el saldo no cambie.
9. Activar la simulación de error del sistema.
10. Verificar que el saldo tampoco cambie.
11. Cerrar sesión.
12. Intentar acceder directamente a `/dashboard`.
13. Comprobar que la aplicación redirija a `/login`.

## Autor

Cristian Corona