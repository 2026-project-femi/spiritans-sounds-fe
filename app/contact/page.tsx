"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Check, AlertCircle, Loader2 } from "lucide-react";

export default function ContactPage() {
	const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
	const [responseMsg, setResponseMsg] = useState("");

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setStatus("loading");
		setResponseMsg("");

		const formData = new FormData(e.currentTarget);

		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				body: formData,
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message || "Something went wrong");
			}

			setStatus("success");
			setResponseMsg("Message sent successfully! We'll get back to you soon.");
			(e.target as HTMLFormElement).reset();
		} catch (error) {
			console.error(error);
			setStatus("error");
			setResponseMsg("Failed to send message. Please try again or contact us directly.");
		} finally {
			setTimeout(() => {
				if (status === "success" || status === "error") setStatus("idle");
				setResponseMsg("");
			}, 5000);
		}
	}

	return (
		<section id="contact" className="relative pt-20">
			{/* Hero banner */}
			<div className="relative bg-[#1a1a1a] py-20 text-center text-white pt-30">
				<motion.h1
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-4xl md:text-5xl font-extrabold">
					Contact Us
				</motion.h1>
				<p className="mt-3 text-red-100 max-w-2xl mx-auto italic font-light">
					"Silence is the root of everything. If you spiral into its center, you will find the source of your light." — Thomas Merton
				</p>
			</div>

			{/* Main section */}
			<div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid lg:grid-cols-2 gap-10">
				{/* Contact Info */}
				<motion.div
					initial={{ x: -20, opacity: 0 }}
					whileInView={{ x: 0, opacity: 1 }}
					transition={{ duration: 0.6 }}
					className="bg-white rounded-2xl shadow-lg p-8">
					<h2 className="text-2xl font-bold text-red-700 mb-6">Get In Touch</h2>
					<ul className="space-y-6 text-slate-700">
						<li className="flex items-center gap-4">
							<Phone className="w-6 h-6 text-red-600" />
							<div>
								<div className="font-semibold">Connect with us</div>
								<a href="https://wa.me/447576543367" target="_blank" rel="noopener noreferrer" className="hover:text-red-600">
									+44 7576 543367 (WhatsApp)
								</a>
							</div>
						</li>
						<li className="flex items-center gap-4">
							<Mail className="w-6 h-6 text-red-600" />
							<div>
								<div className="font-semibold">Email</div>
								<a href="mailto:info@spiritanssound.com" className="hover:text-red-600">
									info@spiritanssound.com
								</a>
							</div>
						</li>
						<li className="flex items-center gap-4">
							<MapPin className="w-6 h-6 text-red-600" />
							<div>
								<div className="font-semibold">Address</div>
								<p>
									Spiritans Provincialate, 51, Femi Kila Street, Off Ago Palace Way, Okota,
									Lagos, Nigeria
								</p>
							</div>
						</li>
					</ul>
				</motion.div>

				{/* Contact Form */}
				<motion.div
					initial={{ x: 20, opacity: 0 }}
					whileInView={{ x: 0, opacity: 1 }}
					transition={{ duration: 0.6 }}
					className="bg-white rounded-2xl shadow-lg p-8">
					<h2 className="text-2xl font-bold text-red-700 mb-6">Send Message</h2>

					<form className="space-y-4" onSubmit={handleSubmit}>
						<div className="grid sm:grid-cols-2 gap-4">
							<input
								type="text"
								name="name"
								placeholder="Your Name"
								required
								className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-100"
							/>
							<input
								type="email"
								name="email"
								placeholder="Your Email"
								required
								className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-100"
							/>
						</div>
						<input
							type="text"
							name="subject"
							placeholder="Subject"
							className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-100"
						/>
						<textarea
							name="message"
							placeholder="Your Message"
							rows={5}
							required
							className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-100"
						/>

						{responseMsg && (
							<div
								className={`flex items-center gap-2 p-3 rounded-md text-sm ${
									status === "success" ? "bg-red-100 text-red-800" : "bg-red-100 text-red-800"
								}`}>
								{status === "success" ? (
									<Check className="w-4 h-4" />
								) : (
									<AlertCircle className="w-4 h-4" />
								)}
								{responseMsg}
							</div>
						)}

						<button
							type="submit"
							disabled={status === "loading"}
							className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
							{status === "loading" ? (
								<>
									<Loader2 className="w-4 h-4 animate-spin" /> Sending...
								</>
							) : (
								"Send Message"
							)}
						</button>
					</form>
				</motion.div>
			</div>

			{/* Map */}
			<div className="w-full h-80 py-12 bg-gray-200">
				<iframe
					src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.1!2d3.3050129!3d6.5062317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8ce7e3032e5%3A0x584f72d62a398b2d!2s51%20Femi%20Kila%20St%2C%20Okota%2C%20Lagos%2C%20Nigeria!5e0!3m2!1sen!2sng!4v1698858876!5m2!1sen!2sng"
					width="100%"
					height="100%"
					style={{ border: 0 }}
					loading="lazy"></iframe>
			</div>
		</section>
	);
}
