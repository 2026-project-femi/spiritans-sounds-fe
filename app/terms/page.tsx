export default function TermsAndConditionsPage() {
	return (
		<main className="min-h-screen bg-white text-gray-800">
			{/* Page content */}
			<div className="max-w-3xl mx-auto px-6 py-20">
				{/* Title block */}
				<h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
				<p className="text-sm text-gray-400 mb-4">Last updated: 3rd July, 2024</p>
				<p className="text-gray-600 leading-relaxed mb-10 pb-8 border-b border-gray-200">
					Welcome to Spiritans sound Outreach! By accessing or using our website (spiritanssound.com), you agree to be
					bound by the following terms of service and conditions (the "Terms"). Please read them carefully.
				</p>

				{/* 1. Acceptance of Terms */}
				<section className="mb-10">
					<h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
					<p className="text-gray-600 leading-relaxed">
						By using Spiritans sound Outreach, you agree to comply with and be bound by these Terms. If you do
						not agree to these Terms, please do not use our website.
					</p>
				</section>

				{/* 2. Changes to Terms */}
				<section className="mb-10">
					<h2 className="text-xl font-semibold text-gray-900 mb-3">2. Changes to Terms</h2>
					<p className="text-gray-600 leading-relaxed">
						We reserve the right to modify these Terms at any time. Any changes will be posted on this page, and
						your continued use of the website after such changes have been posted constitutes your acceptance of
						the new Terms.
					</p>
				</section>

				{/* 3. Use of the Website */}
				<section className="mb-10">
					<h2 className="text-xl font-semibold text-gray-900 mb-3">3. Use of the Website</h2>
					<ul className="space-y-4 text-gray-600">
						<li className="flex gap-3 leading-relaxed">
							<span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-500 shrink-0" />
							<p>
								<span className="font-medium text-gray-800">Eligibility: </span>
								You must be at least 13 years old to use Spiritans sound Outreach. By using the
								website, you represent and warrant that you are at least 13 years old.
							</p>
						</li>
						<li className="flex gap-3 leading-relaxed">
							<span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-500 shrink-0" />
							<p>
								<span className="font-medium text-gray-800">Account: </span>
								You may be required to create an account to access certain features of the website.
								You are responsible for maintaining the confidentiality of your account information
								and for all activities that occur under your account.
							</p>
						</li>
						<li className="flex gap-3 leading-relaxed">
							<span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-500 shrink-0" />
							<p>
								<span className="font-medium text-gray-800">Content: </span>
								You are solely responsible for any content you post or share on Spiritans Sound Global
								LTD. By posting content, you grant us a non-exclusive, royalty-free, worldwide,
								perpetual license to use, display, modify, and distribute your content.
							</p>
						</li>
					</ul>
				</section>

				{/* 4. Prohibited Conduct */}
				<section className="mb-10">
					<h2 className="text-xl font-semibold text-gray-900 mb-3">4. Prohibited Conduct</h2>
					<p className="text-gray-600 leading-relaxed mb-4">
						You agree not to engage in any of the following prohibited activities:
					</p>
					<ul className="space-y-3 text-gray-600">
						{[
							"Posting or sharing content that is illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable.",
							"Impersonating any person or entity or falsely stating or misrepresenting your affiliation with a person or entity.",
							"Using the website for any unauthorized or illegal purpose.",
							"Interfering with or disrupting the operation of the website.",
						].map((item) => (
							<li key={item} className="flex gap-3 leading-relaxed">
								<span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-500 shrink-0" />
								<p>{item}</p>
							</li>
						))}
					</ul>
				</section>

				{/* 5. Intellectual Property */}
				<section className="mb-10">
					<h2 className="text-xl font-semibold text-gray-900 mb-3">5. Intellectual Property</h2>
					<p className="text-gray-600 leading-relaxed">
						All content and materials on Spiritans sound Outreach, including but not limited to text, graphics,
						logos, and software, are the property of Spiritans sound Outreach or its content suppliers and are
						protected by intellectual property laws. You may not use, reproduce, or distribute any content from
						the website without our prior written permission.
					</p>
				</section>

				{/* 6. Privacy */}
				<section className="mb-10">
					<h2 className="text-xl font-semibold text-gray-900 mb-3">6. Privacy</h2>
					<p className="text-gray-600 leading-relaxed">
						Your privacy is important to us. Please review our{" "}
						<a href="/privacy-policy" className="text-blue-600 hover:underline">
							Privacy Policy
						</a>{" "}
						to understand how we collect, use, and protect your personal information.
					</p>
				</section>

				{/* 7. Limitation of Liability */}
				<section className="mb-10">
					<h2 className="text-xl font-semibold text-gray-900 mb-3">7. Limitation of Liability</h2>
					<p className="text-gray-600 leading-relaxed">
						Spiritans sound Outreach is provided on an "as is" and "as available" basis. We make no warranties
						or representations about the accuracy or completeness of the website's content or the content of any
						sites linked to this site. To the fullest extent permitted by law, we disclaim all warranties, express
						or implied, including, but not limited to, implied warranties of merchantability and fitness for a
						particular purpose.
					</p>
				</section>

				{/* 8. Indemnification */}
				<section className="mb-10">
					<h2 className="text-xl font-semibold text-gray-900 mb-3">8. Indemnification</h2>
					<p className="text-gray-600 leading-relaxed">
						You agree to indemnify, defend, and hold harmless Spiritans sound Outreach, its affiliates,
						officers, directors, employees, and agents from and against any and all claims, liabilities, damages,
						losses, or expenses arising out of or in any way connected with your access to or use of the website.
					</p>
				</section>

				{/* 9. Termination */}
				<section className="mb-10">
					<h2 className="text-xl font-semibold text-gray-900 mb-3">9. Termination</h2>
					<p className="text-gray-600 leading-relaxed">
						We reserve the right to terminate or suspend your account and access to Spiritans sound Outreach at
						any time, without prior notice or liability, for any reason, including if you breach these Terms.
					</p>
				</section>

				{/* 10. Governing Law */}
				<section className="mb-10">
					<h2 className="text-xl font-semibold text-gray-900 mb-3">10. Governing Law</h2>
					<p className="text-gray-600 leading-relaxed">
						These Terms shall be governed by and construed in accordance with the laws of the United Kingdom,
						without regard to its conflict of law provisions.
					</p>
				</section>

				{/* 11. Contact Us */}
				<section className="mb-12">
					<h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contact Us</h2>
					<p className="text-gray-600 leading-relaxed mb-2">
						If you have any questions about these Terms, please contact us at:
					</p>
					<p className="text-gray-600">
						Email:{" "}
						<a href="mailto:info@spiritanssound.com" className="text-blue-600 hover:underline">
							info@spiritanssound.com
						</a>
					</p>
				</section>
			</div>
		</main>
	);
}
