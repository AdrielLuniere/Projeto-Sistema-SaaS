import axios from "axios";

// Constants
const PAGBANK_SANDBOX_URL = "https://sandbox.api.pagseguro.com";
const PAGBANK_PROD_URL = "https://api.pagseguro.com";

interface CreateChargeParams {
  reference_id: string;
  description: string;
  amount: {
    value: number; // in cents
    currency: "BRL";
  };
  payment_method: {
    type: "BOLETO";
    boleto: {
      due_date: string; // YYYY-MM-DD
      instruction_lines: { line_1: string; line_2: string };
      holder: {
        name: string;
        tax_id: string; // CPF/CNPJ
        email: string;
        address: {
          country: "BRA";
          region_code: string; // SP, RJ...
          city: string;
          postal_code: string;
          street: string;
          number: string;
          locality: string;
        };
      };
    };
  };
}

export class PagBankService {
  private baseUrl: string;
  private token: string;

  constructor(token: string, sandbox = true) {
    this.token = token;
    this.baseUrl = sandbox ? PAGBANK_SANDBOX_URL : PAGBANK_PROD_URL;
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
      "x-api-version": "4.0",
    };
  }

  // Create formatted charge payload
  async createBoleto(data: any) {
    try {
      const response = await axios.post(`${this.baseUrl}/charges`, data, {
        headers: this.headers,
      });
      return response.data;
    } catch (error: any) {
      console.error("PagBank Create Error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error_messages?.[0]?.description || "Failed to create Boleto");
    }
  }

  async getCharge(chargeId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/charges/${chargeId}`, {
        headers: this.headers,
      });
      return response.data;
    } catch (error: any) {
      console.error("PagBank Get Error:", error.response?.data || error.message);
      return null;
    }
  }

  async cancelCharge(chargeId: string) {
      try {
        const response = await axios.post(`${this.baseUrl}/charges/${chargeId}/cancel`, {}, {
            headers: this.headers,
        });
        return response.data;
      } catch (error: any) {
         console.error("PagBank Cancel Error:", error.response?.data || error.message);
         throw error;
      }
  }
}
