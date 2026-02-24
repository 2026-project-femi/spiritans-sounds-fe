export default function PrivacyPolicyPage() {
	return (
		<main className="min-h-screen bg-white text-gray-800">
			{/* Page content */}
			<div className="max-w-3xl mx-auto px-6 py-20">
				{/* Title block */}
				<h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
				<p className="text-sm text-gray-400 mb-10 pb-8 border-b border-gray-200">
					Spiritans Sound Global LTD &mdash; Effective 2025
				</p>

				{/* Introduction */}
				<section className="mb-10">
					<h2 className="text-xl font-semibold text-gray-900 mb-3">Introduction</h2>
					<p className="text-gray-600 leading-relaxed">
						Spiritans Sound Global LTD respects your privacy and is committed to protecting your personal data.
						This Privacy Policy explains how we collect, use, and safeguard your information when you visit our
						website.
					</p>
				</section>

				{/* Information We Collect */}
				<section className="mb-10">
					<h2 className="text-xl font-semibold text-gray-900 mb-3">Information We Collect</h2>
					<ul className="space-y-3 text-gray-600">
						<li className="flex gap-3 leading-relaxed">
							<span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-500 shrink-0" />
							<p>
								<span className="font-medium text-gray-800">Personal Information: </span>
								Name, email address, and contact details when you sign up for newsletters or contact
								us.
							</p>
						</li>
						<li className="flex gap-3 leading-relaxed">
							<span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-500 shrink-0" />
							<p>
								<span className="font-medium text-gray-800">Usage Data: </span>
								Information about how you use our website, including your IP address, browser type,
								and browsing history.
							</p>
						</li>
					</ul>
				</section>

				{/* How We Use */}
				<section className="mb-10">
					<h2 className="text-xl font-semibold text-gray-900 mb-3">How We Use Your Information</h2>
					<ul className="space-y-2 text-gray-600">
						{[
							"To provide, operate, and maintain our website.",
							"To improve our website and services based on user feedback.",
							"To communicate with you, including responding to inquiries and sending newsletters.",
							"To monitor and analyze usage to enhance user experience.",
							"To comply with legal obligations and protect our rights.",
						].map((item) => (
							<li key={item} className="flex gap-3 leading-relaxed">
								<span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-500 shrink-0" />
								<p>{item}</p>
							</li>
						))}
					</ul>
				</section>

				{/* Sharing */}
				<section className="mb-10">
					<h2 className="text-xl font-semibold text-gray-900 mb-3">Sharing Your Information</h2>
					<p className="text-gray-600 leading-relaxed">
						We do not sell, trade, or otherwise transfer your personal information to outside parties, except as
						necessary to provide our services, comply with the law, or protect our rights.
					</p>
				</section>

				{/* Data Security */}
				<section className="mb-10">
					<h2 className="text-xl font-semibold text-gray-900 mb-3">Data Security</h2>
					<p className="text-gray-600 leading-relaxed">
						We implement a variety of security measures to maintain the safety of your personal information.
						However, no method of transmission over the Internet or electronic storage is 100% secure.
					</p>
				</section>

				{/* Cookies */}
				<section className="mb-10">
					<h2 className="text-xl font-semibold text-gray-900 mb-3">Cookies</h2>
					<p className="text-gray-600 leading-relaxed">
						Our website uses cookies to enhance your experience. You can choose to disable cookies through your
						browser settings, but this may affect your ability to use certain features of our site.
					</p>
				</section>

				{/* Third-Party Links */}
				<section className="mb-10">
					<h2 className="text-xl font-semibold text-gray-900 mb-3">Third-Party Links</h2>
					<p className="text-gray-600 leading-relaxed">
						Our website may contain links to third-party sites. We are not responsible for the privacy practices
						or content of these external sites.
					</p>
				</section>

				{/* Your Rights */}
				<section className="mb-10">
					<h2 className="text-xl font-semibold text-gray-900 mb-3">Your Rights</h2>
					<p className="text-gray-600 leading-relaxed">
						You have the right to access, correct, or delete your personal information. To exercise these rights,
						please contact us at{" "}
						<a href="mailto:support@spiritanssound.com" className="text-blue-600 hover:underline">
							support@spiritanssound.com
						</a>
						.
					</p>
				</section>

				{/* Changes */}
				<section className="mb-10">
					<h2 className="text-xl font-semibold text-gray-900 mb-3">Changes to This Policy</h2>
					<p className="text-gray-600 leading-relaxed">
						We may update this Privacy Policy from time to time. Any changes will be posted on this page, and we
						encourage you to review it periodically.
					</p>
				</section>

				{/* Contact */}
				<section className="mb-12">
					<h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h2>
					<p className="text-gray-600 leading-relaxed">
						If you have any questions or concerns about this Privacy Policy, please contact us at{" "}
						<a href="mailto:support@spiritanssound.com" className="text-blue-600 hover:underline">
							support@spiritanssound.com
						</a>
						.
					</p>
				</section>
			</div>
		</main>
	);
}
