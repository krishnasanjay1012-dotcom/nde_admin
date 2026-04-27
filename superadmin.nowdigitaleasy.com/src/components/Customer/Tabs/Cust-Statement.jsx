const StatementOfAccounts = ({ statementData }) => {
  console.log(statementData, "statementData");

  if (!statementData) return null;

  const {
    formatDateRange,
    userData = {},
    transactions = [],
    settingsConfig = {},
  } = statementData;

  const company = settingsConfig?.company_address || {};

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN");
  };

  const formatCurrency = (value) => {
    if (!value && value !== 0) return "";
    return Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div style={{ padding: 10 }}>
      <div
        style={{
          maxWidth: "1000px",
          padding: "40px",
          background: "#ffffff",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          fontFamily: "Arial, sans-serif",
          color: "#333",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "40px",
          }}
        >
          {/* Company Address */}
          <div>
            <h4 style={{ marginBottom: "5px" }}>
              {company?.address || ""}
            </h4>
            <p style={{ margin: 0, fontSize: "14px" }}>
              {company?.district || ""}
            </p>
            <p style={{ margin: 0, fontSize: "14px" }}>
              {company?.state || ""}
            </p>
            <p style={{ margin: 0, fontSize: "14px" }}>
              {company?.pincode || ""}
            </p>
            <p style={{ margin: 0, fontSize: "14px" }}>
              {company?.country || ""}
            </p>
            <p style={{ margin: 0, fontSize: "14px" }}>
              GSTIN: {company?.Gstin || ""}
            </p>
          </div>

          {/* User + Statement Info */}
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: "14px" }}>
              {userData?.city || ""}
            </p>
            <p style={{ margin: 0, fontSize: "14px" }}>
              {userData?.state || ""}
            </p>
            <p style={{ margin: 0, fontSize: "14px" }}>
              {userData?.email || ""}
            </p>
            <p style={{ margin: 0, fontSize: "14px" }}>
              {userData?.phone_number || ""}
            </p>

            <h2 style={{ marginTop: "20px", marginBottom: "5px" }}>
              Statement of Accounts
            </h2>
            <p style={{ fontSize: "13px", marginBottom: "15px" }}>
              {formatDateRange || ""}
            </p>

            {/* Summary Box (dynamic calculation if transactions exist) */}
            <div
              style={{
                background: "#f3f3f3",
                padding: "15px",
                width: "280px",
                textAlign: "left",
                display: "inline-block",
              }}
            >
              <h4 style={{ marginBottom: "10px" }}>Account Summary</h4>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "14px",
                  marginBottom: "5px",
                }}
              >
                <span>Opening Balance</span>
                <span>
                  {transactions.length
                    ? formatCurrency(transactions[0]?.balance)
                    : ""}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "14px",
                  marginBottom: "5px",
                }}
              >
                <span>Invoiced Amount</span>
                <span>
                  {formatCurrency(
                    transactions.reduce(
                      (acc, cur) =>
                        acc + (parseFloat(cur?.amount) || 0),
                      0
                    )
                  )}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "14px",
                  marginBottom: "5px",
                }}
              >
                <span>Amount Received</span>
                <span>
                  {formatCurrency(
                    transactions.reduce(
                      (acc, cur) =>
                        acc + (parseFloat(cur?.payments) || 0),
                      0
                    )
                  )}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                  borderTop: "1px solid #ccc",
                  paddingTop: "8px",
                  marginTop: "8px",
                }}
              >
                <span>Balance Due</span>
                <span>
                  {transactions.length
                    ? formatCurrency(
                        transactions[transactions.length - 1]?.balance
                      )
                    : ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead style={{ background: "#333", color: "#fff" }}>
            <tr>
              {[
                "Date",
                "Transactions",
                "Details",
                "Amount",
                "Payments",
                "Balance",
              ].map((head) => (
                <th
                  key={head}
                  style={{
                    padding: "10px",
                    fontSize: "14px",
                    textAlign:
                      head === "Amount" ||
                      head === "Payments" ||
                      head === "Balance"
                        ? "right"
                        : "left",
                  }}
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{ padding: "20px", textAlign: "center" }}
                >
                  No transactions available
                </td>
              </tr>
            ) : (
              transactions.map((row, index) => (
                <tr
                  key={index}
                  style={{
                    background: index % 2 === 0 ? "#fff" : "#f7f7f7",
                  }}
                >
                  <td style={{ padding: "10px", fontSize: "14px" }}>
                    {formatDate(row?.date)}
                  </td>
                  <td style={{ padding: "10px", fontSize: "14px" }}>
                    {row?.transaction || ""}
                  </td>
                  <td style={{ padding: "10px", fontSize: "14px" }}>
                    {row?.details || ""}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      fontSize: "14px",
                      textAlign: "right",
                    }}
                  >
                    {formatCurrency(row?.amount)}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      fontSize: "14px",
                      textAlign: "right",
                    }}
                  >
                    {formatCurrency(row?.payments)}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      fontSize: "14px",
                      textAlign: "right",
                    }}
                  >
                    {formatCurrency(row?.balance)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "40px",
            fontWeight: "bold",
            fontSize: "16px",
            marginTop: "20px",
          }}
        >
          <span>Balance Due</span>
          <span>
            {transactions.length
              ? formatCurrency(
                  transactions[transactions.length - 1]?.balance
                )
              : ""}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatementOfAccounts;