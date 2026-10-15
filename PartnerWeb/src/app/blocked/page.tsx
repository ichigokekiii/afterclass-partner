export default function BlockedDesktopPage() {
  return (
    <main
      data-testid="desktop-blocked"
      className="min-h-dvh bg-partner-cream text-partner-ink flex items-center justify-center p-6"
    >
      <div className="max-w-sm w-full bg-partner-white border border-partner-line rounded-[20px] p-6 shadow-sm space-y-4">
        <div className="w-11 h-11 rounded-2xl bg-partner-burgundy text-partner-white flex items-center justify-center font-bold text-base tracking-tight">
          AC
        </div>
        <div className="space-y-1">
          <p className="text-[13px] font-semibold uppercase tracking-wider text-partner-burgundy">
            After Class Partner
          </p>
          <h1 className="text-[26px] leading-tight font-bold text-partner-ink">
            Open this link on your phone or tablet
          </h1>
        </div>
        <p className="text-[17px] leading-snug text-partner-ink">
          The partner counter app runs on mobile browsers at the café counter and is not available on desktop computers.
        </p>
        <p className="text-[14px] leading-snug text-partner-gray">
          Send this URL to the café phone or counter iPad to sign in and confirm today&apos;s dates.
        </p>
      </div>
    </main>
  );
}
