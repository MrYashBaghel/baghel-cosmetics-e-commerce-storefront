import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative min-h-[65vh] overflow-hidden bg-cream/50 px-5 py-24 text-center">
      <div className="absolute inset-0 opacity-20">
        <img src="/images/bangles-glass.jpg" alt="" className="h-full w-full object-cover" />
      </div>
      <div className="relative mx-auto max-w-xl">
        <p className="eyebrow text-gold">404 · A little detour</p>
        <h1 className="display-font mt-5 text-7xl leading-none">This beauty wandered off.</h1>
        <p className="mt-5 text-sm leading-7 text-plum/65">The page you&apos;re looking for is no longer here, but there are plenty of beautiful things waiting in the collection.</p>
        <Link href="/shop" className="btn-primary mt-8">Explore the shop</Link>
      </div>
    </div>
  );
}
