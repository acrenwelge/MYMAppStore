import fetch from "node-fetch";
import { PaypalCreateOrderResponse } from "./payment.entity";

const BASE_URL = "https://api-m.sandbox.paypal.com";

export async function createOrder(amount: number): Promise<PaypalCreateOrderResponse> {
  const accessToken = await generateAccessToken();
  const url = `${BASE_URL}/v2/checkout/orders`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: String(amount),
          },
        },
      ],
    }),
  });
  return handleResponse(response);
}

export async function capturePayment(orderId: string) {
  const accessToken = await generateAccessToken();
  const url = `${BASE_URL}/v2/checkout/orders/${orderId}/capture`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return handleResponse(response);
}

export async function generateAccessToken() {
  const auth = Buffer.from(process.env.CLIENT_ID + ":" + process.env.APP_SECRET).toString("base64");
  const response = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: "post",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  const jsonData = await handleResponse(response);
  return jsonData.access_token;
}

async function handleResponse(response) {
  if (response.status === 200 || response.status === 201) {
    return response.json();
  }
  const errorMessage = await response.text();
  throw new Error(errorMessage);
}
