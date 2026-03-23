import * as React from "react";

interface NewsletterEmailProps {
  firstName: string;
  subject: string;
  preheader?: string;
  bodyHtml: string;     // pre-rendered HTML from blockContent
  unsubscribeUrl: string;
  senderName?: string;
}

export const NewsletterEmailTemplate: React.FC<Readonly<NewsletterEmailProps>> = ({
  firstName,
  subject,
  preheader,
  bodyHtml,
  unsubscribeUrl,
  senderName,
}) => (
  <html>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{subject}</title>
      <style>{`
        body, table, td, p, a {
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
        body { margin: 0; padding: 0; background-color: #f4f4f7; font-family: 'Montserrat', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }

        /* Body content styles (injected HTML) */
        .email-body h2 { font-size: 22px; font-weight: 700; color: #1e293b; margin: 0 0 12px 0; }
        .email-body h3 { font-size: 18px; font-weight: 600; color: #1e293b; margin: 0 0 10px 0; }
        .email-body p  { font-size: 16px; line-height: 1.8; color: #374151; margin: 0 0 16px 0; }
        .email-body blockquote { border-left: 4px solid #ee0303; padding: 12px 20px; margin: 0 0 16px 0; background: #fffcf8; font-style: italic; color: #2d3436; }
        .email-body a  { color: #ee0303; text-decoration: underline; }
        .email-body img { max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0; }
        .email-body ul, .email-body ol { padding-left: 24px; margin: 0 0 16px 0; }
        .email-body li { font-size: 16px; line-height: 1.8; color: #374151; margin-bottom: 6px; }

        @media screen and (max-width: 600px) {
          .email-wrapper { padding: 12px !important; }
          .email-header, .email-content, .email-footer { padding: 24px 20px !important; }
        }
      `}</style>
    </head>
    <body style={{ margin: 0, padding: "20px", backgroundColor: "#f4f4f7" }}>

      {/* Preheader — hidden preview text */}
      {preheader && (
        <div style={{ display: "none", maxHeight: 0, overflow: "hidden", opacity: 0, fontSize: 1, color: "#f4f4f7" }}>
          {preheader}
          {/* Padding to prevent body text appearing in preview */}
          {"\u00a0\u200c".repeat(50)}
        </div>
      )}

      <center>
        <table width="100%" cellPadding="0" cellSpacing="0" border={0} style={{ backgroundColor: "#f4f4f7" }}>
          <tr>
            <td align="center" className="email-wrapper" style={{ padding: "20px" }}>
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
                    style={{ background: "linear-gradient(135deg, #ee0303 0%, #a50202 100%)", padding: "36px 30px", textAlign: "center" }}>
                    <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", margin: "0 0 8px 0" }}>
                      Spiritans Sound
                    </p>
                    <h1 style={{ color: "#ffffff", fontFamily: "'Playfair Display', Georgia, serif", fontSize: "26px", fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
                      {subject}
                    </h1>
                  </td>
                </tr>

                {/* Body */}
                <tr>
                  <td className="email-content" style={{ padding: "40px 30px", backgroundColor: "#ffffff" }}>

                    {/* Personalised greeting */}
                    <p style={{ fontSize: "18px", fontWeight: 600, color: "#1e293b", margin: "0 0 24px 0" }}>
                      Hi {firstName},
                    </p>

                    {/* Rich text body (blockContent rendered to HTML) */}
                    <div
                      className="email-body"
                      dangerouslySetInnerHTML={{ __html: bodyHtml }}
                    />

                    {/* Sign-off */}
                    <table width="100%" style={{ marginTop: "32px", borderTop: "1px solid #e2e8f0" }}>
                      <tr>
                        <td style={{ paddingTop: "24px" }}>
                          <p style={{ fontSize: "15px", color: "#374151", margin: "0 0 4px 0" }}>
                            In faith,
                          </p>
                          <p style={{ fontSize: "15px", fontWeight: 700, color: "#1e293b", margin: 0 }}>
                            {senderName || "Spiritans Sound"}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td
                    className="email-footer"
                    style={{ backgroundColor: "#f8fafc", padding: "24px 30px", textAlign: "center", borderTop: "1px solid #e2e8f0" }}>
                    <p style={{ color: "#64748b", fontSize: "13px", margin: "0 0 8px 0" }}>
                      Spiritans Sound • Digital Ministry
                    </p>
                    <p style={{ color: "#94a3b8", fontSize: "12px", margin: 0 }}>
                      © {new Date().getFullYear()} Spiritans Sound. All rights reserved.
                      <br />
                      <a href={unsubscribeUrl} style={{ color: "#94a3b8", textDecoration: "underline" }}>
                        Unsubscribe
                      </a>
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
