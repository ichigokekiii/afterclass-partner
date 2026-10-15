const MOBILE_OR_TABLET_UA_REGEX =
  /iPhone|iPad|iPod|Android|webOS|BlackBerry|BB10|IEMobile|Windows Phone|Opera Mini|Mobile|Tablet|Silk|Kindle|PlayBook|Fennec/i;

export function isMobileOrTabletRequest(headers: {
  userAgent?: string | null;
  secChUaMobile?: string | null;
  secChUaPlatform?: string | null;
}): boolean {
  const ua = headers.userAgent ?? "";
  const chMobile = headers.secChUaMobile ?? "";
  const chPlatform = (headers.secChUaPlatform ?? "").replace(/"/g, "");

  if (chMobile === "?1") {
    return true;
  }

  if (/^(Android|iOS|iPadOS)$/i.test(chPlatform)) {
    return true;
  }

  return MOBILE_OR_TABLET_UA_REGEX.test(ua);
}
