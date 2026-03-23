import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
	try {
		const formData = await request.formData();

		const name = formData.get("name")?.toString() ?? "";
		const email = formData.get("email")?.toString() ?? "";
		const subject = formData.get("subject")?.toString() ?? "";
		const message = formData.get("message")?.toString() ?? "";

		if (!name || !email || !message) {
			return new Response(
				JSON.stringify({
					message: "Missing required fields",
					errors: {
						name: !name ? "Name is required" : null,
						email: !email ? "Email is required" : null,
						message: !message ? "Message is required" : null,
					},
				}),
				{ status: 400 },
			);
		}

		const fromAddress = `Spiritans Sounds <${process.env.SMTP_FROM_EMAIL}>`;
		const toAddress = process.env.ADMIN_EMAIL || "spiritansounds@gmail.com";

		const { error } = await resend.emails.send({
			from: fromAddress,
			to: toAddress,
			replyTo: email,
			subject: `New Contact Request: ${subject || "No Subject"}`,
			html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Montserrat', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #2d3436; background-color: #fffcf8; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; }
                    .header { background: #ee0303; background: linear-gradient(135deg, #ee0303 0%, #a50202 100%); color: #ffffff; padding: 40px 24px; text-align: center; }
                    .header h2 { margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 28px; font-weight: 700; letter-spacing: -0.02em; }
                    .header p { margin: 10px 0 0; opacity: 0.9; font-size: 15px; font-weight: 500; }
                    .content { padding: 40px 32px; background-color: #ffffff; }
                    .field-group { margin-bottom: 28px; border-bottom: 1px solid #f3f4f6; padding-bottom: 12px; }
                    .field-group:last-child { border-bottom: none; }
                    .label { display: block; font-size: 11px; color: #ee0303; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
                    .value { font-size: 17px; color: #2d3436; font-weight: 500; }
                    .message-box { background-color: #fffcf8; border-left: 4px solid #ee0303; padding: 20px; margin-top: 12px; border-radius: 4px; color: #2d3436; white-space: pre-wrap; font-size: 16px; font-style: italic; }
                    .footer { background-color: #f9fafb; padding: 32px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
                    .footer p { margin: 6px 0; }
                    .brand { color: #ee0303; font-weight: 700; font-size: 14px; margin-bottom: 12px; display: block; }
                    a { color: #ee0303; text-decoration: none; font-weight: 600; }
                    a:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>New Contact Request</h2>
                        <p>A new message has been received from Spiritans Sound website.</p>
                    </div>
                    <div class="content">
                        <div class="field-group">
                            <span class="label">From</span>
                            <div class="value">${escapeHtml(name)}</div>
                        </div>
                        <div class="field-group">
                            <span class="label">Email Address</span>
                            <div class="value"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div>
                        </div>
                        <div class="field-group">
                            <span class="label">Subject</span>
                            <div class="value">${escapeHtml(subject) || "No Subject"}</div>
                        </div>
                        <div class="field-group">
                            <span class="label">Message</span>
                            <div class="value message-box">${escapeHtml(message)}</div>
                        </div>
                    </div>
                    <div class="footer">
                        <span class="brand">Spiritans Sound</span>
                        <p>&copy; ${new Date().getFullYear()} Spiritans Sound. All rights reserved.</p>
                        <p>This email was sent via the contact form on your website.</p>
                    </div>
                </div>
            </body>
            </html>
            `,
		});

		if (error) {
			console.error("Email sending failed:", error);
			return new Response(
				JSON.stringify({
					message: "Internal server error",
					error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
				}),
				{ status: 500 },
			);
		}

		return new Response(JSON.stringify({ message: "Form submitted successfully" }), { status: 200 });
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("Email sending failed:", error.message);
			return new Response(
				JSON.stringify({
					message: "Internal server error",
					error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
				}),
				{ status: 500 },
			);
		}

		return new Response(
			JSON.stringify({
				message: "Internal server error",
				error: "Unexpected error occurred",
			}),
			{ status: 500 },
		);
	}
}
