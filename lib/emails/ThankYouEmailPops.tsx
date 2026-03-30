// app/emails/ThankYouEmail.tsx
import * as React from "react";

interface ThankYouEmailProps {
	donorName: string;
	amount: number;
	currency: string;
	transactionReference: string;
	date: string;
	message?: string;
}

export const ThankYouEmailTemplate: React.FC<Readonly<ThankYouEmailProps>> = ({
	donorName,
	amount,
	currency,
	transactionReference,
	date,
	message,
}) => (
	<html>
		<head>
			<meta charSet="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>Thank You for Your Donation</title>
			<style>
				{`
          /* Gmail-friendly styles */
          .ExternalClass, .ReadMsgBody {
            width: 100%;
            background-color: #fffcf8;
          }
          
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
            background-color: #fffcf8;
            font-family: 'Montserrat', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          }
          
          /* Container */
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
          }
          
          /* Header */
          .header {
            background: linear-gradient(135deg, #ee0303 0%, #a50202 100%);
            padding: 40px 30px;
            text-align: center;
          }
          
          .header h1 {
            color: #ffffff;
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 32px;
            font-weight: 700;
            margin: 0 0 8px 0;
            line-height: 1.3;
          }
          
          .header p {
            color: rgba(255, 255, 255, 0.9);
            font-size: 18px;
            margin: 0;
          }
          
          /* Content */
          .content {
            padding: 40px 30px;
            background-color: #ffffff;
          }
          
          /* Scripture */
          .scripture {
            background-color: #fffcf8;
            border-left: 4px solid #ee0303;
            padding: 24px;
            margin-bottom: 32px;
            border-radius: 8px;
          }
          
          .scripture p {
            font-size: 18px;
            line-height: 1.8;
            color: #2d3436;
            font-style: italic;
            margin: 0 0 12px 0;
          }
          
          .scripture cite {
            font-size: 14px;
            color: #ee0303;
            font-weight: 600;
            font-style: normal;
          }
          
          /* Donation card */
          .donation-card {
            background-color: #f8fafc;
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 32px;
            border: 1px solid #e2e8f0;
          }
          
          .amount {
            font-size: 48px;
            font-weight: 800;
            color: #ee0303;
            text-align: center;
            margin: 0 0 24px 0;
          }
          
          .detail-row {
            padding: 12px 0;
            border-bottom: 1px solid #e2e8f0;
          }
          
          .detail-row:last-child {
            border-bottom: none;
          }
          
          .detail-label {
            font-weight: 600;
            color: #455254;
            display: inline-block;
            width: 140px;
          }
          
          .detail-value {
            color: #2d3436;
          }
          
          /* Impact */
          .impact {
            background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 32px;
          }
          
          .impact h3 {
            font-size: 24px;
            font-weight: 700;
            margin: 0 0 16px 0;
            color: #9b2c2c;
          }
          
          .impact ul {
            margin: 0;
            padding: 0;
            list-style: none;
          }
          
          .impact li {
            margin-bottom: 12px;
            padding-left: 28px;
            position: relative;
            color: #9b2c2c;
          }
          
          .impact li:before {
            content: "✨";
            position: absolute;
            left: 0;
          }
          
          /* Button */
          .button {
            display: inline-block;
            background-color: #ee0303;
            color: #ffffff;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 9999px;
            font-weight: 600;
            font-size: 16px;
            margin: 16px 0;
          }
          
          /* Footer */
          .footer {
            background-color: #f8fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          }
          
          .footer p {
            color: #64748b;
            font-size: 14px;
            margin: 0 0 8px 0;
          }
          
          /* Mobile */
          @media screen and (max-width: 600px) {
            .header,
            .content,
            .footer {
              padding: 10px 10px;
            }
            
            .amount {
              font-size: 30px;
            }
            
            .detail-label {
              display: block;
              width: auto;
              margin-bottom: 4px;
            }
          }
        `}
			</style>
		</head>
		<body style={{ margin: 0, padding: "8px", backgroundColor: "#f4f4f7" }}>
			<center>
				<table width="100%" cellPadding="0" cellSpacing="0" border={0} style={{ backgroundColor: "#f4f4f7" }}>
					<tr>
						<td align="center" style={{ padding: "8px" }}>
							<table
								width="100%"
								cellPadding="0"
								cellSpacing="0"
								border={0}
								style={{ maxWidth: "600px", backgroundColor: "#ffffff", borderRadius: "16px", overflow: "hidden" }}>
								{/* Header */}
								<tr>
									<td
										className="header"
										style={{ background: "linear-gradient(135deg, #ee0303 0%, #a50202 100%)", padding: "24px 20px", textAlign: "center" }}>
										<h1 style={{ color: "#ffffff", fontFamily: "'Playfair Display', Georgia, serif", fontSize: "26px", margin: "0 0 6px 0" }}>
											Thank You for Your Gift! 🙏
										</h1>
										<p style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "15px", margin: 0 }}>
											Your generosity is changing lives
										</p>
									</td>
								</tr>

								{/* Content */}
								<tr>
									<td className="content" style={{ padding: "20px", backgroundColor: "#ffffff" }}>
										<h2 style={{ fontSize: "20px", margin: "0 0 10px 0", color: "#1e293b" }}>
											Dear {donorName},
										</h2>

										{/* Scripture */}
										<table
											width="100%"
											style={{ backgroundColor: "#fffcf8", borderLeft: "4px solid #ee0303", borderRadius: "6px", marginBottom: "14px" }}>
											<tr>
												<td style={{ padding: "12px 14px" }}>
													<p style={{ fontSize: "14px", lineHeight: 1.6, color: "#2d3436", fontStyle: "italic", margin: "0 0 6px 0" }}>
														"Each one must give as he has decided
														in his heart, not reluctantly or under
														compulsion, for God loves a cheerful
														giver."
													</p>
													<cite style={{ fontSize: "14px", color: "#ee0303", fontWeight: 600, fontStyle: "normal" }}>
														— 2 Corinthians 9:7
													</cite>
												</td>
											</tr>
										</table>

										{/* Donation Card */}
										<table
											width="100%"
											style={{ backgroundColor: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "14px" }}>
											<tr>
												<td style={{ padding: "16px" }}>
													<div style={{ fontSize: "36px", fontWeight: 800, color: "#ee0303", textAlign: "center", marginBottom: "12px" }}>
														{currency} {amount.toLocaleString()}
													</div>

													<div style={{ borderBottom: "1px solid #e2e8f0", padding: "12px 0" }}>
														<span style={{ fontWeight: 600, color: "#4b5563", width: "140px", display: "inline-block" }}>
															Reference:
														</span>
														<span style={{ color: "#1e293b", fontFamily: "monospace" }}>
															{transactionReference}
														</span>
													</div>

													<div style={{ padding: "12px 0" }}>
														<span style={{ fontWeight: 600, color: "#4b5563", width: "140px", display: "inline-block" }}>
															Date:
														</span>
														<span style={{ color: "#1e293b" }}>
															{date}
														</span>
													</div>
												</td>
											</tr>
										</table>

										{/* Impact */}
										<table
											width="100%"
											style={{ background: "linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)", borderRadius: "10px", marginBottom: "14px" }}>
											<tr>
												<td style={{ padding: "16px" }}>
													<h3 style={{ fontSize: "17px", fontWeight: 700, margin: "0 0 10px 0", color: "#9b2c2c" }}>
														Your Gift Will:
													</h3>
													<ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
														<li style={{ marginBottom: "7px", paddingLeft: "22px", position: "relative", color: "#9b2c2c" }}>
															📖 Help produce daily homilies
															reaching thousands
														</li>
														<li style={{ marginBottom: "7px", paddingLeft: "22px", position: "relative", color: "#9b2c2c" }}>
															🎙 Support online spiritual
															broadcasts
														</li>
														<li style={{ marginBottom: "7px", paddingLeft: "22px", position: "relative", color: "#9b2c2c" }}>
															📚 Provide faith formation
															resources
														</li>
														<li style={{ marginBottom: "7px", paddingLeft: "22px", position: "relative", color: "#9b2c2c" }}>
															🙏 Enable prayer support for
															families in need
														</li>
													</ul>
													<p style={{ margin: "10px 0 0 0", fontStyle: "italic", color: "#9b2c2c" }}>
														{message ||
															"Your generosity helps us continue spreading the Gospel to thousands worldwide."}
													</p>
												</td>
											</tr>
										</table>
									</td>
								</tr>

								{/* Footer */}
								<tr>
									<td
										className="footer"
										style={{ backgroundColor: "#f8fafc", padding: "14px 20px", textAlign: "center", borderTop: "1px solid #e2e8f0" }}>
										<p style={{ color: "#64748b", fontSize: "13px", margin: "0 0 5px 0" }}>
											Spiritans Sound • Digital Ministry
										</p>
										<p style={{ color: "#64748b", fontSize: "13px", margin: "0 0 8px 0" }}>
											This receipt serves as your official donation record for tax
											purposes.
										</p>
										<p style={{ color: "#94a3b8", fontSize: "11px", margin: "8px 0 0 0" }}>
											© {new Date().getFullYear()} Spiritans Sound. All rights
											reserved.
											<br />
											<a
												href="#"
												style={{ color: "#94a3b8", textDecoration: "underline" }}>
												Unsubscribe
											</a>{" "}
											•
											<a
												href="#"
												style={{ color: "#94a3b8", textDecoration: "underline" }}>
												Privacy Policy
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
