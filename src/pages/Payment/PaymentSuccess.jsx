import React, { useEffect } from "react";

import { useSearchParams } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useRef } from "react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const callRef = useRef(false);
  const axioSecure = useAxiosSecure();

  useEffect(() => {
    if (sessionId && !callRef.current) {
      callRef.current = true;
      axioSecure.post(`/payment-success`, { sessionId });
    }
  }, [sessionId, axioSecure]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center animate-fadeIn">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          {/* <CheckCircle className="w-20 h-20 text-green-500 animate-bounce" /> */}
          
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your payment has been processed
          successfully.
        </p>

        {/* Button */}
        <a
          href="/dashboard"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
};

export default PaymentSuccess;
