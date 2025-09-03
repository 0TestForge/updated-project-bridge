export function SiteFooter() {
  return (
    <footer className="border-t border-white/5 mt-24">
      <div className="container py-10 grid gap-8 md:grid-cols-3 text-sm">
        <div>
          <div className="flex items-center gap-2 font-bold">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600" />
            RO-CART
          </div>
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
