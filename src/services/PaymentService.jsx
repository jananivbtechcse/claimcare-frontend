// import api from "../api/api";
// import axios from "axios";

// // 🔥 Replace with YOUR Beeceptor URL
// const BEECEPTOR_URL = "https://claimcare-payments.free.beeceptor.com";

// const paymentService = {
//   async processPayment(data) {
//     // Step 1: Call Beeceptor (Fake Gateway)
//     const gatewayRes = await axios.post(BEECEPTOR_URL, {
//       paymentAmount: data.paymentAmount,
//       paymentType: data.paymentType
//     });

//     if (gatewayRes.data.status !== "success") {
//       throw new Error("Payment failed in gateway");
//     }

//     // Step 2: Send to backend
//     const backendRes = await api.post("/Payment", {
//       claimId: data.claimId,
//       paymentAmount: data.paymentAmount,
//       paymentType: data.paymentType,
//       transactionReference: gatewayRes.data.transactionId
//     });

//     return backendRes.data;
//   }
// };

// export default paymentService;


// src/services/PaymentService.js
import api from "../api/api";
import axios from "axios";

const BEECEPTOR_URL = "https://claimcare-payments.free.beeceptor.com";

const paymentService = {
  async processPayment(data) {

    // ── Step 1: Call Beeceptor (Fake Payment Gateway) ──────────────────
    let gatewayTransactionId = null;

    try {
      const gatewayRes = await axios.post(BEECEPTOR_URL, {
        paymentAmount: data.paymentAmount,
        paymentType:   data.paymentType,
        claimId:       data.claimId,
      });

      // Beeceptor can return many shapes — handle all of them safely
      const gData = gatewayRes.data;

      // ✅ Accept any of these as a successful gateway response:
      //    { status: "success" }  or  { status: "SUCCESS" }
      //    or any 2xx response (Beeceptor default returns 200 with custom body)
      const statusVal = gData?.status ?? gData?.Status ?? "";
      const isSuccess =
        statusVal === "" ||                                        // no status field → treat as success
        statusVal.toString().toLowerCase() === "success" ||
        statusVal.toString().toLowerCase() === "ok" ||
        gData?.success === true;

      if (!isSuccess) {
        throw new Error(gData?.message || gData?.error || "Payment declined by gateway.");
      }

      // Grab transaction ID from whichever field Beeceptor returns
      gatewayTransactionId =
        gData?.transactionId ??
        gData?.transaction_id ??
        gData?.txnId ??
        gData?.id ??
        "TXN-BEEP-" + Date.now();

    } catch (gatewayErr) {
      // If Beeceptor is down / rate-limited (free tier), generate a local txn ref
      // and still proceed to backend so the app keeps working
      if (gatewayErr?.response?.status >= 500 || !gatewayErr?.response) {
        console.warn("Beeceptor unreachable — using local transaction reference.");
        gatewayTransactionId = "TXN-LOCAL-" + Date.now();
      } else {
        // Real gateway rejection (4xx) — surface the error
        throw new Error(
          gatewayErr?.response?.data?.message ||
          gatewayErr?.response?.data?.error  ||
          gatewayErr.message ||
          "Payment failed at gateway."
        );
      }
    }

    // ── Step 2: Tell your backend the payment succeeded ────────────────
    // POST /api/Payment/process
    const backendRes = await api.post("/api/Payment/process", {
      claimId:             data.claimId,
      paymentAmount:       data.paymentAmount,
      paymentType:         data.paymentType,
      transactionReference: gatewayTransactionId,
    });

    return backendRes.data;  // PaymentResponseDTO { transactionReference, paymentDate, message }
  },
};

export default paymentService;