import * as React from "react";

interface PurchaseConfirmationEmailProps {
  buyerName: string;
  itemTitle: string;
  downloadUrl: string;
  amount: number;
  currency: string;
  transactionReference: string;
  date: string;
}

export const PurchaseConfirmationEmailTemplate: React.FC<Readonly<PurchaseConfirmationEmailProps>> = ({
  buyerName,
  itemTitle,
  downloadUrl,
  amount,
  currency,
  transactionReference,
  date,
}) => (
  <html>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Your Download is Ready</title>
      <style>
        {`
          body, table, td, p, a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }

          table, td {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
          }

          img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
          }

          body {
            margin: 0;
            padding: 0;
            background-color: #f4f4f7;
            font-family: 'Montserrat', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          }

          @media screen and (max-width: 600px) {
            .email-header, .email-content, .email-footer {
              padding: 10px !important;
            }
            .amount {
              font-size: 30px !important;
            }
            .download-button {
              padding: 14px 20px !important;
              font-size: 15px !important;
            }
          }
        `}
      </style>
    </head>
    <body style={{ margin: 0, padding: "10px", backgroundColor: "#f4f4f7" }}>
      <center>
        <table width="100%" cellPadding="0" cellSpacing="0" border={0} style={{ backgroundColor: "#f4f4f7" }}>
          <tr>
            <td align="center" style={{ padding: "20px" }}>
              <table
                width="100%"
                cellPadding="0"
                cellSpacing="0"
                border={0}
                style={{ maxWidth: "600px", backgroundColor: "#ffffff", borderRadius: "16px", overflow: "hidden" }}>

                {/* Header */}
                <tr>
                  <td
                    className="email-header"
                    style={{ background: "linear-gradient(135deg, #ee0303 0%, #a50202 100%)", padding: "24px 16px", textAlign: "center" }}>
                    <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", margin: "0 0 8px 0" }}>
                      Spiritans Sound
                    </p>
                    <h1 style={{ color: "#ffffff", fontFamily: "'Playfair Display', Georgia, serif", fontSize: "30px", fontWeight: 700, margin: "0 0 8px 0", lineHeight: 1.3 }}>
                      Your Download is Ready
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "16px", margin: 0 }}>
                      Thank you for your purchase!
                    </p>
                  </td>
                </tr>

                {/* Content */}
                <tr>
                  <td className="email-content" style={{ padding: "24px 16px", backgroundColor: "#ffffff" }}>

                    <h2 style={{ fontSize: "22px", margin: "0 0 24px 0", color: "#1e293b", fontWeight: 600 }}>
                      Dear {buyerName},
                    </h2>

                    <p style={{ fontSize: "16px", lineHeight: 1.7, color: "#374151", margin: "0 0 28px 0" }}>
                      Your payment has been confirmed. Click the button below to download your copy of{" "}
                      <strong style={{ color: "#1e293b" }}>{itemTitle}</strong>.
                    </p>

                    {/* Download CTA */}
                    <table width="100%" style={{ marginBottom: "32px" }}>
                      <tr>
                        <td align="center">
                          <a
                            href={downloadUrl}
                            className="download-button"
                            style={{
                              display: "inline-block",
                              backgroundColor: "#ee0303",
                              color: "#ffffff",
                              textDecoration: "none",
                              padding: "18px 40px",
                              borderRadius: "9999px",
                              fontWeight: 700,
                              fontSize: "16px",
                              letterSpacing: "0.05em",
                            }}>
                            Download Your PDF
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style={{ fontSize: "13px", color: "#6b7280", textAlign: "center", margin: "0 0 32px 0", fontStyle: "italic" }}>
                      This link is unique to your purchase. The download will begin immediately when you click the button.
                    </p>

                    {/* Order Details */}
                    <table
                      width="100%"
                      style={{ backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "32px" }}>
                      <tr>
                        <td style={{ padding: "28px" }}>
                          <p style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 16px 0" }}>
                            Order Details
                          </p>

                          <div className="amount" style={{ fontSize: "42px", fontWeight: 800, color: "#ee0303", textAlign: "center", margin: "0 0 20px 0" }}>
                            {currency} {amount.toLocaleString()}
                          </div>

                          <div style={{ borderBottom: "1px solid #e2e8f0", padding: "10px 0" }}>
                            <span style={{ fontWeight: 600, color: "#4b5563", display: "inline-block", width: "120px", fontSize: "14px" }}>Item:</span>
                            <span style={{ color: "#1e293b", fontSize: "14px" }}>{itemTitle}</span>
                          </div>

                          <div style={{ borderBottom: "1px solid #e2e8f0", padding: "10px 0" }}>
                            <span style={{ fontWeight: 600, color: "#4b5563", display: "inline-block", width: "120px", fontSize: "14px" }}>Reference:</span>
                            <span style={{ color: "#1e293b", fontFamily: "monospace", fontSize: "13px" }}>{transactionReference}</span>
                          </div>

                          <div style={{ padding: "10px 0" }}>
                            <span style={{ fontWeight: 600, color: "#4b5563", display: "inline-block", width: "120px", fontSize: "14px" }}>Date:</span>
                            <span style={{ color: "#1e293b", fontSize: "14px" }}>{date}</span>
                          </div>
                        </td>
                      </tr>
                    </table>

                    {/* Scripture */}
                    <table width="100%" style={{ backgroundColor: "#fffcf8", borderLeft: "4px solid #ee0303", borderRadius: "8px" }}>
                      <tr>
                        <td style={{ padding: "20px 24px" }}>
                          <p style={{ fontSize: "16px", lineHeight: 1.8, color: "#2d3436", fontStyle: "italic", margin: "0 0 8px 0" }}>
                            "Whatever is true, whatever is noble, whatever is right… think about such things."
                          </p>
                          <cite style={{ fontSize: "13px", color: "#ee0303", fontWeight: 600, fontStyle: "normal" }}>
                            — Philippians 4:8
                          </cite>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td
                    className="email-footer"
                    style={{ backgroundColor: "#f8fafc", padding: "28px 30px", textAlign: "center", borderTop: "1px solid #e2e8f0" }}>
                    <p style={{ color: "#64748b", fontSize: "13px", margin: "0 0 6px 0" }}>
                      Spiritans Sound • Digital Ministry
                    </p>
                    <p style={{ color: "#94a3b8", fontSize: "12px", margin: 0 }}>
                      © {new Date().getFullYear()} Spiritans Sound. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </center>
    </body>
  </html>
);
