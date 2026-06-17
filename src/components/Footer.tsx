"use client";

const navLinks = [
  { href: "#projects", label: "Projects" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#blog", label: "Blog" },
  { href: "#contact", label: "Contact" },
];

const socialLinks = [
  { href: "https://github.com/eunjeong-97", label: "GitHub", external: true },
  { href: "https://velog.io/@beanlove97", label: "Blog", external: true },
  { href: "mailto:beanlove97@gmail.com", label: "Email", external: false },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <p className="text-foreground font-bold text-lg mb-2">
              EunJeong<span className="text-primary">.</span>
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              웹과 앱을 함께 다루는<br />
              크로스플랫폼 개발자입니다.
            </p>
            <div className="flex items-center gap-1.5 mt-3">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-400">현재 구직 중</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Navigation</p>
            <ul className="grid grid-cols-2 gap-1.5">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Links</p>
            <ul className="space-y-1.5">
              {socialLinks.map(({ href, label, external }) => (
                <li key={href}>
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/resume.pdf"
                  download="박은정_이력서.pdf"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  이력서 다운로드
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-muted-foreground text-sm">
            © {currentYear} 박은정. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Built with Next.js · Tailwind CSS · Deployed on Vercel
          </p>
        </div>
      </div>
    </footer>
  );
}
