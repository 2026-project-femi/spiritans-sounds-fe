import MagazineNav from "@/components/magazine/MagazineNav";

export default function UnveilerLayout({ children }: { children: React.ReactNode }) {
	return (
		<section className="unveiler-theme min-h-screen bg-background text-foreground">
			<MagazineNav />
			{children}
		</section>
	);
}
