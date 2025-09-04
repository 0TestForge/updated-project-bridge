export function SiteFooter() {
  return (
    <footer className="border-t border-white/5 mt-24">
      <div className="container py-10 grid gap-8 md:grid-cols-3 text-sm">
        <div>
          <a href="/" className="flex items-center gap-2">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fb2458d5aab5847128a2b754080dc1712%2F59703aedd2134312974c10a72e7d28f4?format=webp&width=220"
              alt="RO-CART logo"
              className="h-8 md:h-9 w-auto object-contain"
            />
            <span className="sr-only">RO-CART</span>
          </a>
          <p className="mt-3 text-muted-foreground max-w-xs">Fast, safe, and automated delivery of your favorite in‑game items.</p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="mb-2 font-semibold">Company</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground">Features</a></li>
              <li><a href="#how" className="hover:text-foreground">How it works</a></li>
              <li><a href="#faq" className="hover:text-foreground">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-semibold">Legal</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">Privacy</a></li>
              <li><a href="#" className="hover:text-foreground">Terms</a></li>
              <li><a href="#" className="hover:text-foreground">Support</a></li>
            </ul>
          </div>
        </div>
        <div className="md:text-right text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} RO-CART. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
