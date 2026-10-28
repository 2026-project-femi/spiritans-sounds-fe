import type { Metadata } from "next";
import { SectionHeading, YcnLink, YCN_PATHS, btn } from "@/components/young-creators/components/primitives";

export const metadata: Metadata = {
	title: "Thank you — Support Young Creators",
	description: "Thank you for supporting the Young Creators Network.",
	robots: { index: false, follow: true },
};

interface Props {
	searchParams: Promise<{ reference?: string; status?: string }>;
}

export default async function SupportCompletePage({ searchParams }: Props) {
	const { reference, status } = await searchParams;
	const cancelled = status === "cancelled";

	return (
		<section className="mx-auto max-w-3xl px-5 pt-16">
			<SectionHeading
				eyebrow={cancelled ? "Checkout cancelled" : "Thank you"}
				title={cancelled ? "Your gift was not completed." : "Thank you for opening a door."}
				intro={
					cancelled
						? "No payment was taken. You can return to the support page whenever you are ready."
						: "If your payment was successful, a receipt is on its way to your email. Your gift funds mentoring, materials and showcase stages for young creators."
				}
				tone={cancelled ? undefined : "teal"}
			/>
			{reference && !cancelled && (
				<p className="mt-6 text-sm text-muted-foreground">
					Reference: <span className="font-mono">{reference}</span>
				</p>
			)}
			<div className="mt-10 flex flex-wrap gap-3">
				<YcnLink href={YCN_PATHS.support} className={btn.primary}>
					{cancelled ? "Try again" : "Support again"}
				</YcnLink>
				<YcnLink href={YCN_PATHS.directory} className={btn.outline}>
					Meet the creators
				</YcnLink>
			</div>
		</section>
	);
}
