import NetworkBar from "@/components/layout/NetworkBar";
import MagazineNav from "@/components/magazine/MagazineNav";
import MagazineFooter from "@/components/magazine/MagazineFooter";

export default function UnveilerLayout({ children }: { children: React.ReactNode }) {
	return (
		<section className="unveiler-theme flex min-h-screen flex-col bg-background text-foreground">
			<NetworkBar current="unveiler" />
			<MagazineNav />
			<div className="flex-1">{children}</div>
			<MagazineFooter />
		</section>
	);
}
