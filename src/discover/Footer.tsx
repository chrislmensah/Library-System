interface FooterProps {
  poweredByName?: string;
  poweredByHref?: string;
  siteName?: string;
  siteHref?: string;
}

export function Footer({
  poweredByName = "Raynux.com",
  poweredByHref = "https://raynux.com",
  siteName = "Librarika.com",
  siteHref = "https://librarika.com",
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-moss-700 text-ivory-100/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs sm:flex-row sm:items-center sm:justify-between">
        <p className="font-sans">
          Powered by{" "}
          <a href={poweredByHref} className="underline underline-offset-2 hover:text-ivory-50">
            {poweredByName}
          </a>
        </p>
        <p className="font-sans">
          Copyright © {year},{" "}
          <a href={siteHref} className="underline underline-offset-2 hover:text-ivory-50">
            {siteName}
          </a>
        </p>
      </div>
    </footer>
  );
}