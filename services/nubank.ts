// Native fetch implementation to avoid dependency issues
// Constants
const NUBANK_SANDBOX_URL = "https://sandbox-api.spinpay.com.br/v1";
const NUBANK_PROD_URL = "https://api.spinpay.com.br/v1";

export interface NuBankPayload {
    referenceId: string;
    merchantOrderReference: string;
    amount: {
        value: number; // 100.00
        currency: "BRL";
    };
    paymentMethod: {
        type: "nupay" | "boleto" | string;
        authorizationType: "manually_authorized" | "pre_authorized" | "automatic";
        fundingSource?: "credit" | "debit" | string; // for pre_authorized
    };
    installments?: number; // for credit
    shopper: {
        firstName: string;
        lastName: string;
        document: string;
        documentType: "CPF" | "CNPJ";
        email: string;
        phone: {
            country: string; // "55"
            number: string;
        };
        ip?: string; // Optional
    };
    paymentFlow?: {
        returnUrl: string;
        cancelUrl: string;
    };
    recipients?: {
        referenceId: string;
        amount: {
            value: number;
            currency: "BRL";
        };
    };
}

export class NuBankService {
  private baseUrl: string;
  private token: string;
  private key: string;

  constructor(token: string, key: string, sandbox = true) {
    this.token = token;
    this.key = key;
    this.baseUrl = sandbox ? NUBANK_SANDBOX_URL : NUBANK_PROD_URL;
  }

  private get headers() {
    return {
      "X-Merchant-Key": this.key,
      "X-Merchant-Token": this.token,
      "Content-Type": "application/json",
    };
  }

  async createPayment(data: NuBankPayload) {
    try {
      const response = await fetch(`${this.baseUrl}/checkouts/payments`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
           throw new Error(responseData?.message || JSON.stringify(responseData) || "Failed to create NuBank Payment");
      }
      
      return responseData;
    } catch (error: any) {
      console.error("NuBank Create Payment Error:", error.message);
      throw error;
    }
  }

  async getPaymentStatus(id: string) {
    try {
        const response = await fetch(`${this.baseUrl}/checkouts/payments/${id}/status`, {
            method: "GET",
            headers: this.headers
        });
        
        if (!response.ok) return null;
        
        return await response.json();
    } catch (error: any) {
        console.error("NuBank Get Status Error:", error.message);
        return null;
    }
  }

  async cancelPayment(id: string) {
      try {
        const response = await fetch(`${this.baseUrl}/checkouts/payments/${id}/cancel`, {
            method: "POST",
            headers: this.headers,
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
            throw new Error(responseData?.message || "Failed to cancel");
        }
        
        return responseData;
      } catch (error: any) {
         console.error("NuBank Cancel Error:", error.message);
         throw error;
      }
  }
}
