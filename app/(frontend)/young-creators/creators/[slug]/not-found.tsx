import { YcnLink, YCN_PATHS, btn } from "@/components/young-creators/components/primitives";

export default function CreatorNotFound() {
	return (
		<div className="mx-auto max-w-xl px-5 py-24 text-center">
			<h1 className="text-4xl font-bold">We couldn&apos;t find that creator</h1>
			<p className="mt-4 text-muted-foreground">
				The creator you&apos;re looking for may have moved or is no longer published.
			</p>
			<YcnLink href={YCN_PATHS.directory} className={`${btn.primary} mt-8`}>
				Meet the Creators
			</YcnLink>
		</div>
	);
}
