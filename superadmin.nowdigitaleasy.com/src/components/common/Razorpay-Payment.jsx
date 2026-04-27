
const RazorpayPayment = ({ amount,onSuccess, onFailure, name = "Your Company", description = "Payment" }) => {

  const handlePayment = async () => {
    try {
      const res = await fetch("http://localhost:5000/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const order = await res.json();   

      const options = {
        key: "YOUR_RAZORPAY_KEY_ID",
        amount: order.amount,
        currency: order.currency,
        name,
        description,
        order_id: order.id,
        handler: function (response) {
          if (onSuccess) onSuccess(response);
        },
        modal: {
          ondismiss: function () {
            if (onFailure) onFailure({ error: "Payment cancelled" });
          },
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      if (onFailure) onFailure(error);
    }
  };

  return (
    <button onClick={handlePayment} style={{ padding: "10px 20px", background: "#3399cc", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
      Pay ₹{amount}
    </button>
  );
};

export default RazorpayPayment;
