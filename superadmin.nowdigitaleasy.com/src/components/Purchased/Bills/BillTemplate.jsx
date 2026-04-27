const BillTemplate = ({ billData }) => {
    const data = billData || {};
    const currency = data?.currency?.symbol || "₹";
    const company = data?.settings || {};

    return (
        <div
            style={{
                margin: "20px auto",
                background: "#fff",
                padding: 50,
                boxShadow: "0 0 8px rgba(0,0,0,0.1)",
                position: "relative",
                fontFamily: "Arial, sans-serif",
            }}
        >
            {/* Ribbon */}
            <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 160,
                height: 160,
                overflow: "hidden",
            }}>
                <div style={{
                    position: "absolute",
                    top: 20,
                    left: -45,
                    transform: "rotate(-45deg)",
                    color: "#fff",
                    background:
                        data?.status === "draft"
                            ? "#999"
                            : data?.status === "paid"
                                ? "#2e7d32"
                                : "#2d7dd2",
                    fontWeight: "bold",
                    fontSize: 12,
                    padding: "6px 60px",
                    textAlign: "center",
                }}>
                    {data?.status || "OPEN"}
                </div>
            </div>

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                    <img
                        src={company?.logo1}
                        alt="logo"
                        style={{ height: 50, marginBottom: 10 }}
                    />
                    <h3 style={{ margin: 0 }}>
                        {company?.companyName || "-"}
                    </h3>
                    <p>{company?.company_address?.address}</p>
                    <p>
                        {company?.company_address?.state},{" "}
                        {company?.company_address?.country}
                    </p>
                    <p>GST: {company?.company_address?.Gstin}</p>
                    <p>{company?.company_address?.Phone}</p>
                </div>

                <div style={{ textAlign: "right" }}>
                    <h1 style={{ margin: 0 }}>BILL</h1>
                    <p>Bill# {data?.billNo}</p>
                    <p>Order# {data?.orderNo}</p>
                    <p><strong>Balance Due</strong></p>
                    <p>{data?.formattedBalanceAmount}</p>
                </div>
            </div>

            {/* Bill Info */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 20
            }}>
                <div>
                    <p><strong>Bill From</strong></p>
                    <p style={{ color: "blue" }}>
                        {data?.vendor
                            ? `${data.vendor.first_name || ""} ${data.vendor.last_name || ""}`
                            : "-"
                        }
                    </p>
                    <p>{data?.vendor?.email}</p>
                </div>

                <div>
                    <p>Bill Date : {data?.formattedBillDate}</p>
                    <p>Due Date : {data?.formattedDueDate}</p>
                    <p>Terms : {data?.paymentTerm?.label}</p>
                </div>
            </div>

            {/* Table */}
            <table style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: 20
            }}>
                <thead>
                    <tr style={{ background: "#444", color: "#fff" }}>
                        <th>#</th>
                        <th style={{ textAlign: "left" }}>Item & Description</th>
                        <th>Qty</th>
                        <th>Rate</th>
                        <th style={{ textAlign: "right" }}>Amount</th>
                    </tr>
                </thead>

                <tbody>
                    {data?.items?.length > 0 ? (
                        data.items.map((item, index) => (
                            <tr
                                key={index}
                                style={{ borderBottom: "1px solid #e0e0e0" }}
                            >
                                <td>{index + 1}</td>

                                <td>
                                    <strong>{item?.itemName || "-"}</strong>
                                    <br />
                                    <span style={{ fontSize: 12, color: "#666" }}>
                                        {item?.description}
                                    </span>
                                </td>

                                <td>{item?.quantity || 0}</td>

                                <td>{currency}{item?.price || 0}</td>

                                <td style={{ textAlign: "right" }}>
                                    {currency}{item?.totalAmount || 0}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} style={{ textAlign: "center" }}>
                                No items available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Totals */}
            <div style={{
                width: 300,
                marginLeft: "auto",
                marginTop: 20,
                fontSize: 13,

            }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Sub Total</span>
                    <span>{currency}{data?.subTotal || 0}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Tax</span>
                    <span>{currency}{data?.taxTotal || 0}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Adjustment</span>
                    <span>{currency}{data?.adjustment || 0}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong>Total</strong>
                    <strong>{data?.formattedTotalAmount}</strong>
                </div>

                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    background: "#eee",
                    padding: 8,
                    fontWeight: "bold",
                    marginTop: 5
                }}>
                    <span>Balance Due</span>
                    <span>{data?.formattedBalanceAmount}</span>
                </div>
            </div>

            {/* Notes */}
            {data?.notes && (
                <div style={{ marginTop: 20 }}>
                    <strong>Notes:</strong>
                    <p>{data?.notes}</p>
                </div>
            )}

            {/* Bank Details */}
            {company?.accountDetails && (
                <div style={{ marginTop: 20 }}>
                    <strong>Bank Details:</strong>
                    <p>{company.accountDetails.Name}</p>
                    <p>A/C: {company.accountDetails.AccountNo}</p>
                    <p>IFSC: {company.accountDetails.IfscCode}</p>
                    <p>{company.accountDetails.Bank}</p>
                </div>
            )}

            {/* Signature */}
            <div style={{ marginTop: 50 }}>
                Authorized Signature
                <span style={{
                    display: "inline-block",
                    width: 250,
                    borderBottom: "1px solid #000",
                    marginLeft: 10
                }} />
            </div>
        </div>
    );
};

export default BillTemplate;