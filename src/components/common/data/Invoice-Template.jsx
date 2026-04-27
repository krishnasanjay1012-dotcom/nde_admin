import CommonButton from "../NDE-Button";

const statusColors = {
  paid: "#0f9e43",
  pending: "#ff9800",
  overdue: "#f44336",
  closed: "#607d8b",
  void: "#9e9e9e",
};

const InvoiceTemplate = ({
  data,
  setShowButton,

}) => {
  // ---------- Helper: Convert number to words (Indian numbering) ----------
  const convertToWords = (num) => {
    if (num === 0) return "Zero";

    const ones = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    ];
    const teens = [
      "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
      "Seventeen", "Eighteen", "Nineteen",
    ];
    const tens = [
      "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
    ];

    const convertHundreds = (n) => {
      if (n === 0) return "";
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      if (n < 100)
        return (
          tens[Math.floor(n / 10)] +
          (n % 10 !== 0 ? " " + ones[n % 10] : "")
        );
      return (
        ones[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 !== 0 ? " and " + convertHundreds(n % 100) : "")
      );
    };

    const convertLakhs = (n) => {
      if (n === 0) return "";
      const lakhsPart = Math.floor(n / 100000);
      const remainder = n % 100000;
      return (
        convertHundreds(lakhsPart) +
        " Lakh" +
        (remainder !== 0 ? " " + convertThousands(remainder) : "")
      );
    };

    const convertThousands = (n) => {
      if (n === 0) return "";
      const thousandsPart = Math.floor(n / 1000);
      const remainder = n % 1000;
      if (thousandsPart === 0) return convertHundreds(remainder);
      return (
        convertHundreds(thousandsPart) +
        " Thousand" +
        (remainder !== 0 ? " " + convertHundreds(remainder) : "")
      );
    };

    if (num >= 10000000) {
      const crores = Math.floor(num / 10000000);
      const remainder = num % 10000000;
      return (
        convertHundreds(crores) +
        " Crore" +
        (remainder !== 0 ? " " + convertLakhs(remainder) : "")
      );
    }
    if (num >= 100000) {
      return convertLakhs(num);
    }
    if (num >= 1000) {
      return convertThousands(num);
    }
    return convertHundreds(num);
  };

  // ---------- Extract data from props ----------
  const company = {
    name: data?.settings?.companyName || "",
    address: {
      address: data?.settings?.company_address?.address || "",
      district: data?.settings?.company_address?.district || "",
      state: data?.settings?.company_address?.state || "",
      pincode: data?.settings?.company_address?.pincode || "",
      country: data?.settings?.company_address?.country || "",
    },
    email: data?.settings?.email || "",
    phone: data?.settings?.company_address?.Phone || "",
    gstin: data?.settings?.company_address?.Gstin || "",
    panNo: data?.settings?.company_address?.PanNo || "",
  };

  const invoice = {
    number: data?.invoiceNo || "",
    date: data?.invoiceDate
      ? new Date(data.invoiceDate).toLocaleDateString("en-IN")
      : "",
    dueDate: data?.dueDate
      ? new Date(data.dueDate).toLocaleDateString("en-IN")
      : "",
    terms: `Net ${data?.settings?.Due_time || 15} days`,
    po: data?.orderNo || "",
    status: data?.status || "",
  };

  const client = {
    name:
      `${data?.contact?.first_name || ""} ${data?.contact?.last_name || ""}`.trim() ||
      "Customer",
    email: data?.contact?.email || "",
    phone: data?.contact?.phone_number
      ? `+${data?.contact?.country_code || ""} ${data?.contact?.phone_number}`
      : "",
    city: data?.contact?.city || "",
    state: data?.contact?.state || "",
    country: data?.contact?.country || "",
    gstin: data?.contact?.gstin || "",
  };

  const billTo = {
    name: client.name,
    address: data?.contact?.profile_pic_path || "",
    city: client.city,
    state: client.state,
    zip: data?.contact?.pincode || "",
    country: client.country,
  };

  const shipTo = { ...billTo };

  // ---------- Line Items ----------
  const items = (data?.lineItems || []).map((item) => {
    const taxAmount = item?.tax?.amount || 0;
    const taxPercent = item?.tax?.percentage || 0;
    return {
      name: item.productName || item.planName || "Service/Product",
      description: item.description || "",
      qty: item.quantity || 1,
      unit: item.unit || "unit",
      rate: item.price || 0,
      discount: item.discount || 0,
      taxPercent: `${taxPercent}%`,
      taxAmount: taxAmount,
      amount: item.total_amount || 0,
    };
  });

  const subject = `Invoice for Order #${data?.orderNo || ""}`;
  const description = `Payment for services rendered`;

  // ---------- Compute Discount ----------
  let discountAmount = 0;
  let discountDisplay = "";
  if (data?.discountValue && data?.subTotal) {
    if (data.discountType === "percentage") {
      discountAmount = (data?.subTotal * data?.discountValue) / 100;
      discountDisplay = `${data?.discountValue}%`;
    } else {
      discountAmount = data?.discountValue;
      discountDisplay = `${data.currency?.code || "INR"} ${discountAmount.toFixed(2)}`;
    }
  }

  // ---------- Tax Lines (IGST or CGST/SGST) ----------
  const isIGST = data?.igst && !data?.cgst && !data?.sgst;
  const cgstAmount = data?.cgst?.amount || 0;
  const sgstAmount = data?.sgst?.amount || 0;
  const igstAmount = data?.igst?.amount || 0;

  // ---------- Summary ----------
  const currencySymbol = data?.currency?.symbol || "₹";
  const summary = {
    subTotal: `${currencySymbol} ${(data?.subTotal || 0).toFixed(2)}`,
    discount: `${currencySymbol} ${discountAmount.toFixed(2)}${discountDisplay ? ` (${discountDisplay})` : ""}`,
    cgst: `${currencySymbol} ${cgstAmount.toFixed(2)}`,
    sgst: `${currencySymbol} ${sgstAmount.toFixed(2)}`,
    igst: `${currencySymbol} ${igstAmount.toFixed(2)}`,
    tds: `${currencySymbol} ${(data?.tdsAmount || 0).toFixed(2)}`,
    adjustment: `${currencySymbol} ${(data?.adjustment || 0).toFixed(2)}`,
    total: `${currencySymbol} ${(data?.totalAmount || 0).toFixed(2)}`,
    paid: `${currencySymbol} ${(data?.paymentMade || 0).toFixed(2)}`,
    balance: `${currencySymbol} ${(data?.balance || 0).toFixed(2)}`,
  };

  const totalInWords = `Rupees ${convertToWords(data?.totalAmount || 0)} only`;
  const notes = data?.notes || data?.settings?.Notes || "Kindly pay the invoice within due date";
  const termsConditions = data?.terms || data?.settings?.Notes || "Terms and conditions apply";

  const paymentLink = data?.orderDetails?.paymentDetails?.razorpayDetails?.paymentId
    ? `https://razorpay.com/payment/${data.orderDetails.paymentDetails.razorpayDetails.paymentId}`
    : "#";
  const paypalImg =
    "https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg";

  // ---------- Render Items Table ----------
  const renderItems = () => {
    return items.map((item, index) => (
      <tr key={index} style={{ borderBottom: "1px solid #9e9e9e" }}>
        <td
          style={{
            textAlign: "center",
            borderRight: "1px solid #9e9e9e",
            borderBottom: "1px solid #9e9e9e",
            verticalAlign: "top",
          }}
        >
          {index + 1}
        </td>
        <td
          style={{
            borderRight: "1px solid #9e9e9e",
            wordWrap: "break-word",
            borderBottom: "1px solid #9e9e9e",
          }}
        >
          <b>{item.name}</b>
          <br />
          <p style={{ fontSize: "10px" }}>{item.description}</p>
        </td>
        <td
          style={{
            textAlign: "right",
            borderRight: "1px solid #9e9e9e",
            verticalAlign: "top",
            borderBottom: "1px solid #9e9e9e",
          }}
        >
          {item.qty}
          <br />
          <span style={{ fontSize: "10px" }}>{item.unit}</span>
        </td>
        <td
          style={{
            textAlign: "right",
            borderRight: "1px solid #9e9e9e",
            verticalAlign: "top",
            borderBottom: "1px solid #9e9e9e",
          }}
        >
          {item.rate}
        </td>
        <td
          style={{
            textAlign: "right",
            borderRight: "1px solid #9e9e9e",
            verticalAlign: "top",
            borderBottom: "1px solid #9e9e9e",
          }}
        >
          {item.discount}
        </td>
        <td
          style={{
            textAlign: "right",
            borderRight: "1px solid #9e9e9e",
            verticalAlign: "top",
            borderBottom: "1px solid #9e9e9e",
          }}
        >
          {item.taxPercent}
        </td>
        <td
          style={{
            textAlign: "right",
            borderRight: "1px solid #9e9e9e",
            verticalAlign: "top",
            borderBottom: "1px solid #9e9e9e",
          }}
        >
          {item.taxAmount}
        </td>
        <td
          style={{
            textAlign: "right",
            verticalAlign: "top",
            borderBottom: "1px solid #9e9e9e",
          }}
        >
          {item.amount}
        </td>
      </tr>
    ));
  };

  // ---------- Main Render ----------
  return (
    <div
      style={{
        position: "relative",
        boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
        border: "1px solid rgba(231, 229, 229, 0.3)",
        overflow: "hidden",
        // background: "#fff",
        color: "black",
      }}
      onMouseEnter={() => setShowButton(true)}
      onMouseLeave={() => setShowButton(true)}
    >
      {/* Status Ribbon */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "160px",
          height: "160px",
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "-45px",
            transform: "rotate(-45deg)",
            background: statusColors[data?.status?.toLowerCase()] || "#607d8b",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "12px",
            padding: "6px 60px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          {data?.statusLabel}
        </div>
      </div>

      {/* {showButton && (
        <div style={{ position: "absolute", right: "0%" }}>
          <CommonButton
            label={"Customize"}
            startIcon={false}
            onClick={(e) => handleMenuClick(e)}
          />
        </div>
      )} */}

      <div>
        <table cellSpacing="0" style={{ border: "1px solid #9e9e9e", margin: 56 }}>
          <tbody>
            <tr>
              <td align="center">
                {/* PAGE */}
                <table width="100%" cellPadding="0" cellSpacing="0">
                  <tbody>
                    {/* HEADER */}
                    <tr>
                      <td style={{ padding: "12px 15px" }}>
                        <table width="100%">
                          <tbody>
                            <tr>
                              <td valign="top">
                                {data?.settings?.logo1 && (
                                  <img
                                    src={data.settings.logo1}
                                    alt="Company Logo"
                                    style={{ height: "60px", marginBottom: "8px", maxWidth: "200px" }}
                                  />
                                )}
                                <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "4px" }}>
                                  {company.name}
                                </div>
                                <div style={{ fontSize: "11px", marginBottom: "2px" }}>
                                  {company.address.address}
                                </div>
                                <div style={{ fontSize: "11px", marginBottom: "2px" }}>
                                  {company.address.district}, {company.address.state} - {company.address.pincode}
                                </div>
                                <div style={{ fontSize: "11px", marginBottom: "2px" }}>
                                  {company.address.country}
                                </div>
                                <div style={{ fontSize: "11px", marginBottom: "2px" }}>
                                  GSTIN: {company.gstin}
                                </div>
                                <div style={{ fontSize: "11px", marginBottom: "2px" }}>
                                  PAN: {company.panNo}
                                </div>
                                <div style={{ fontSize: "11px", marginBottom: "2px" }}>
                                  Phone: {company.phone}
                                </div>
                                <div style={{ fontSize: "11px", marginBottom: "4px" }}>
                                  Email: {company.email}
                                </div>
                              </td>
                              <td align="right">
                                <div style={{ fontSize: "29px", fontWeight: "bold" }}>TAX INVOICE</div>
                                <div style={{ fontSize: "11px", marginTop: "8px" }}>
                                  Place of Supply: {data?.settings?.placeOfSupply || company.address.state}
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    {/* INVOICE META */}
                    <tr>
                      <td>
                        <table width="100%" cellPadding="6" cellSpacing="0" style={{ borderTop: "1px solid #9e9e9e" }}>
                          <tbody>
                            <tr>
                              <td width="50%" style={{ borderRight: "1px solid #9e9e9e", fontSize: "11px" }}>
                                <div style={{ marginBottom: "4px", width: "100%", display: "flex", justifyContent: "space-between" }}>
                                  <div style={{ padding: "1px 5px 1px 0px", width: "45%" }}>Invoice #</div>
                                  : <b style={{ width: "45%" }}>{invoice.number}</b>
                                </div>
                                <div style={{ marginBottom: "4px", width: "100%", display: "flex", justifyContent: "space-between" }}>
                                  <div style={{ padding: "1px 5px 1px 0px", width: "45%" }}>Invoice Date</div>
                                  : <b style={{ width: "45%" }}>{invoice.date}</b>
                                </div>
                                <div style={{ marginBottom: "4px", width: "100%", display: "flex", justifyContent: "space-between" }}>
                                  <div style={{ padding: "1px 5px 1px 0px", width: "45%" }}>Terms</div>
                                  : <b style={{ width: "45%" }}>{invoice.terms}</b>
                                </div>
                                <div style={{ marginBottom: "4px", width: "100%", display: "flex", justifyContent: "space-between" }}>
                                  <div style={{ padding: "1px 5px 1px 0px", width: "45%" }}>Due Date</div>
                                  : <b style={{ width: "45%" }}>{invoice.dueDate}</b>
                                </div>
                                <div style={{ marginBottom: "4px", width: "100%", display: "flex", justifyContent: "space-between" }}>
                                  <div style={{ padding: "1px 5px 1px 0px", width: "45%" }}>Order #</div>
                                  : <b style={{ width: "45%" }}>{invoice.po}</b>
                                </div>
                                <div style={{ marginBottom: "4px", width: "100%", display: "flex", justifyContent: "space-between" }}>
                                  <div style={{ padding: "1px 5px 1px 0px", width: "45%" }}>Payment Method</div>
                                  : <b style={{ width: "45%" }}>{data?.payment_method || "Online"}</b>
                                </div>
                              </td>
                              <td width="50%"></td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    {/* BILL / SHIP */}
                    <tr>
                      <td>
                        <table cellPadding="0" cellSpacing="0" width="100%" style={{ borderTop: "1px solid #9e9e9e" }}>
                          <tbody>
                            <tr style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                              <td width="50%" style={{ borderRight: "1px solid #9e9e9e", fontSize: "11px" }}>
                                <div style={{ width: "99%", background: "#f2f3f4", padding: "3px", border: "1px solid #9e9e9e" }}>
                                  <b>Bill To</b>
                                </div>
                                <br />
                                <div style={{ paddingLeft: "6px", fontSize: "10px", marginTop: "-10px", paddingBottom: "6px" }}>
                                  <p style={{ fontSize: "12px" }}><b>{billTo.name}</b></p>
                                  {client.gstin && <p style={{ marginBottom: "2px" }}>GSTIN: {client.gstin}</p>}
                                  <p style={{ marginBottom: "2px" }}>{client.email}</p>
                                  <p style={{ marginBottom: "2px" }}>{client.phone}</p>
                                  <p style={{ marginBottom: "2px" }}>{billTo.city}</p>
                                  <p style={{ marginBottom: "2px" }}>{billTo.state}</p>
                                  <p style={{ marginBottom: "2px" }}>{billTo.country}</p>
                                </div>
                              </td>
                              <td width="50%" style={{ fontSize: "11px" }}>
                                <div style={{ width: "98%", background: "#f2f3f4", padding: "3px", border: "1px solid #9e9e9e" }}>
                                  <b>Ship To</b>
                                </div>
                                <br />
                                <div style={{ paddingLeft: "6px", fontSize: "10px", marginTop: "-10px", paddingBottom: "6px" }}>
                                  <p style={{ fontSize: "12px" }}><b>{shipTo.name}</b></p>
                                  {client.gstin && <p style={{ marginBottom: "2px" }}>GSTIN: {client.gstin}</p>}
                                  <p style={{ marginBottom: "2px" }}>{client.email}</p>
                                  <p style={{ marginBottom: "2px" }}>{client.phone}</p>
                                  <p style={{ marginBottom: "2px" }}>{shipTo.city}</p>
                                  <p style={{ marginBottom: "2px" }}>{shipTo.state}</p>
                                  <p style={{ marginBottom: "2px" }}>{shipTo.country}</p>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    {/* SUBJECT */}
                    <tr>
                      <td style={{ padding: "10px", borderTop: "1px solid #9e9e9e", fontSize: "11px" }}>
                        <b>Subject :</b> <b>{subject}</b>
                        <br />
                        <p>{description}</p>
                      </td>
                    </tr>

                    {/* ITEMS TABLE */}
                    <tr>
                      <td>
                        <table
                          width="100%"
                          cellPadding="5"
                          cellSpacing="0"
                          style={{ borderTop: "1px solid #9e9e9e", tableLayout: "fixed", fontSize: "11px" }}
                        >
                          <thead>
                            <tr style={{ background: "#f2f3f4", padding: "5px 7px 2px" }}>
                              <th style={{ borderRight: "1px solid #9e9e9e", width: "5%" }}>#</th>
                              <th style={{ borderRight: "1px solid #9e9e9e", textAlign: "left", width: "30%" }}>Item & Description</th>
                              <th style={{ borderRight: "1px solid #9e9e9e", textAlign: "right", width: "10%" }}>Qty</th>
                              <th style={{ borderRight: "1px solid #9e9e9e", textAlign: "right", width: "10%" }}>Rate</th>
                              <th style={{ borderRight: "1px solid #9e9e9e", textAlign: "right", width: "10%" }}>Discount</th>
                              <th style={{ borderRight: "1px solid #9e9e9e", textAlign: "right", width: "10%" }}>Tax %</th>
                              <th style={{ borderRight: "1px solid #9e9e9e", textAlign: "right", width: "10%" }}>Tax</th>
                              <th style={{ textAlign: "right", width: "15%" }}>Amount</th>
                            </tr>
                          </thead>
                          <tbody>{renderItems()}</tbody>
                        </table>
                      </td>
                    </tr>

                    {/* TOTALS */}
                    <tr>
                      <td>
                        <table
                          width="100%"
                          height="100%"
                          cellPadding="6"
                          cellSpacing="0"
                          style={{ borderTop: "1px solid #9e9e9e", borderBottom: "1px solid #9e9e9e", fontSize: "11px" }}
                        >
                          <tbody>
                            <tr>
                              <td width="55%" valign="top" style={{ borderRight: "1px solid #9e9e9e" }}>
                                <p>Total In Words</p>
                                <b><i>{totalInWords}</i></b>

                                <div style={{ marginTop: "10px" }}>
                                  <p>Notes</p>
                                  <p style={{ marginTop: "-3px" }}>{notes}</p>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
                                  <p style={{ marginRight: "10px" }}>Payment options</p>
                                  <a href={paymentLink} target="_blank" rel="noopener noreferrer">
                                    <img src={paypalImg} alt="PayPal" style={{ width: "30px", height: "auto", marginRight: "10px" }} />
                                  </a>
                                </div>

                                <div>
                                  <p>Terms & Conditions</p>
                                  <p style={{ marginTop: "-3px" }}>{termsConditions}</p>
                                </div>
                              </td>

                              <td width="45%">
                                <table width="100%" cellPadding="5" cellSpacing="0" style={{ fontSize: "12px" }}>
                                  <tbody>
                                    <tr>
                                      <td align="right">Sub Total</td>
                                      <td align="right">{summary.subTotal}</td>
                                    </tr>
                                    {discountAmount !== 0 && (
                                      <tr>
                                        <td align="right">Discount</td>
                                        <td align="right">{summary.discount}</td>
                                      </tr>
                                    )}
                                    {/* Tax rows */}
                                    {isIGST ? (
                                      <tr>
                                        <td align="right">IGST</td>
                                        <td align="right">{summary.igst}</td>
                                      </tr>
                                    ) : (
                                      <>
                                        {cgstAmount > 0 && (
                                          <tr>
                                            <td align="right">CGST ({data?.cgst?.percentage || 0}%)</td>
                                            <td align="right">{summary.cgst}</td>
                                          </tr>
                                        )}
                                        {sgstAmount > 0 && (
                                          <tr>
                                            <td align="right">SGST ({data?.sgst?.percentage || 0}%)</td>
                                            <td align="right">{summary?.sgst}</td>
                                          </tr>
                                        )}
                                      </>
                                    )}
                                    {/* TDS / Amount Withheld */}
                                    {data?.tdsAmount > 0 && (
                                      <tr>
                                        <td align="right">Amount Withheld (TDS)</td>
                                        <td align="right">(-) {summary.tds}</td>
                                      </tr>
                                    )}
                                    {/* Adjustment */}
                                    {data?.adjustment !== 0 && (
                                      <tr>
                                        <td align="right">Adjustment</td>
                                        <td align="right">
                                          {data?.adjustment > 0 ? "(+)" : "(-)"} {summary?.adjustment}
                                        </td>
                                      </tr>
                                    )}
                                    <tr>
                                      <td align="right"><b>Total</b></td>
                                      <td align="right"><b>{summary.total}</b></td>
                                    </tr>
                                    <tr>
                                      <td align="right">Payment Made</td>
                                      <td align="right" style={{ color: data?.paymentMade > 0 ? "green" : "red" }}>
                                        (-) {summary.paid}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td align="right"><b>Balance Due</b></td>
                                      <td align="right">
                                        <b style={{ color: data?.balance > 0 ? "red" : "green" }}>
                                          {summary.balance}
                                        </b>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    {/* BANK DETAILS */}
                    <tr>
                      <td style={{ padding: "10px", borderTop: "1px solid #9e9e9e", fontSize: "11px" }}>
                        <div style={{ background: "#f2f3f4", padding: "5px", marginBottom: "5px" }}>
                          <b>Bank Details</b>
                        </div>
                        <table width="100%" cellPadding="3" style={{ fontSize: "10px" }}>
                          <tbody>
                            <tr>
                              <td width="25%"><b>Bank Name:</b></td>
                              <td>{data?.settings?.accountDetails?.Bank || "ICICI Bank Ltd"}</td>
                              <td width="25%"><b>Account No:</b></td>
                              <td>{data?.settings?.accountDetails?.AccountNo || "607205026596"}</td>
                            </tr>
                            <tr>
                              <td><b>Account Name:</b></td>
                              <td>{data?.settings?.accountDetails?.Name || "IAAXIN TECH LABS INDIA PVT LTD"}</td>
                              <td><b>IFSC Code:</b></td>
                              <td>{data?.settings?.accountDetails?.IfscCode || "ICIC0006072"}</td>
                            </tr>
                            <tr>
                              <td><b>Branch:</b></td>
                              <td colSpan="3">{data?.settings?.accountDetails?.Branch || "Karur"}</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    {/* SIGNATURE */}
                    <tr>
                      <td style={{ padding: "20px", textAlign: "right", marginTop: "20px" }}>
                        <div style={{ width: "200px", float: "right" }}>
                          {data?.settings?.company_address?.logo2 && (
                            <img
                              src={data.settings.company_address.logo2}
                              alt="Company Seal"
                              style={{ height: "80px", marginBottom: "10px" }}
                            />
                          )}
                          <div style={{ borderTop: "1px solid #000", paddingTop: "5px" }}>
                            Authorized Signature
                          </div>
                          <div style={{ fontSize: "10px", marginTop: "5px" }}>
                            For {company.name}
                          </div>
                        </div>
                        <br />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceTemplate;