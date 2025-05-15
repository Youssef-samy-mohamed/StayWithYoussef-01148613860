import { useState } from "react";
import { toast } from "react-toastify";

type PaymentDetails = {
  name: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  address: string;
};

interface PaymentProps {
  onClose: () => void;
  onSubmit: (details: PaymentDetails) => void;
}

const Payment = ({ onClose, onSubmit }: PaymentProps) => {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    address: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { name, cardNumber, expiry, cvv, address } = paymentDetails;
    if (!name || !cardNumber || !expiry || !cvv || !address) {
      toast.warn("Please fill out all fields.");
      return;
    }

    onSubmit(paymentDetails);
    onClose();
    toast.success("Payment successful!");
    setPaymentDetails({
      name: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
      address: "",
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <form
        onSubmit={handlePaymentSubmit}
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md space-y-4 relative"
      >
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✖
        </button>
        <h3 className="text-2xl font-bold text-[#B89D63] mb-2">
          Enter Payment Details
        </h3>

        <input
          type="text"
          name="name"
          placeholder="Cardholder Name"
          value={paymentDetails.name}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
        />
        <input
          type="text"
          name="cardNumber"
          placeholder="Card Number"
          value={paymentDetails.cardNumber}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
        />
        <div className="flex gap-2">
          <input
            type="text"
            name="expiry"
            placeholder="MM/YY"
            value={paymentDetails.expiry}
            onChange={handleInputChange}
            className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring"
          />
          <input
            type="text"
            name="cvv"
            placeholder="CVV"
            value={paymentDetails.cvv}
            onChange={handleInputChange}
            className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring"
          />
        </div>
        <input
          type="text"
          name="address"
          placeholder="Billing Address"
          value={paymentDetails.address}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          Confirm Payment
        </button>
      </form>
    </div>
  );
};

export default Payment;
