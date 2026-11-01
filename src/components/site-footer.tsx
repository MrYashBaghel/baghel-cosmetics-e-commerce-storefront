import Link from "next/link";
import { Camera, Mail, MapPin, Phone } from "lucide-react";

const shopLinks = [
  { label: "Bangles", href: "/shop?category=bangles" },
  { label: "Makeup", href: "/shop?category=makeup" },
  { label: "Skincare", href: "/shop?category=skincare" },
  { label: "Fragrance", href: "/shop?category=fragrance" },
  { label: "Gift Boxes", href: "/shop?category=gifting" },
];

const helpLinks = [
  { label: "Shop All", href: "/shop" },
  { label: "Our Story", href: "/#story" },
  { label: "Shipping & Returns", href: "/#service" },
  { label: "Checkout", href: "/checkout" },
];

export function SiteFooter() {
  return (
    <footer className="bg-plum text-[#f7eee5]">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr] lg:px-12">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-gold/70">
              <span className="display-font text-2xl text-gold">B</span>
            </span>
            <span>
              <span className="display-font block text-2xl leading-none">Baghel</span>
              <span className="mt-1 block text-[0.55rem] font-bold tracking-[0.32em] text-gold uppercase">Cosmetics</span>
            </span>
          </div>
          <p className="mt-6 max-w-sm text-sm leading-7 text-[#f7eee5]/65">
            Modern beauty rituals and hand-finished bangles for women, girls and ladies who make every day a little more beautiful.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-full border border-white/20 transition-colors hover:border-gold hover:text-gold">
              <Camera size={16} />
            </a>
            <a href="mailto:hello@baghelcosmetics.in" aria-label="Email" className="grid h-9 w-9 place-items-center rounded-full border border-white/20 transition-colors hover:border-gold hover:text-gold">
              <Mail size={16} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="eyebrow text-gold">The Collection</h3>
          <ul className="mt-6 space-y-3 text-sm text-[#f7eee5]/70">
            {shopLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="transition-colors hover:text-white">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow text-gold">Explore</h3>
          <ul className="mt-6 space-y-3 text-sm text-[#f7eee5]/70">
            {helpLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="transition-colors hover:text-white">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow text-gold">Visit & Connect</h3>
          <div className="mt-6 space-y-4 text-sm text-[#f7eee5]/70">
            <p className="flex gap-3"><MapPin size={16} className="mt-0.5 shrink-0 text-gold" /> 14 Rose Avenue, Jaipur, Rajasthan 302001</p>
            <p className="flex gap-3"><Phone size={16} className="shrink-0 text-gold" /> +91 98280 45610</p>
            <p className="flex gap-3"><Mail size={16} className="shrink-0 text-gold" /> hello@baghelcosmetics.in</p>
          </div>
          <p className="mt-6 text-xs leading-6 text-[#f7eee5]/45">Mon–Sat, 10am–7pm IST. Orders are lovingly packed within 24 hours.</p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-5 py-6 text-[0.68rem] tracking-[0.12em] text-[#f7eee5]/45 uppercase sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <span>© {new Date().getFullYear()} Baghel Cosmetics. All rights reserved.</span>
          <span>Crafted with care · Made for every celebration</span>
        </div>
      </div>
    </footer>
  );
}
