import { NavigationProvider } from "../navigation/routes";
import { PartnerAppShell } from "../navigation/shell";
import { PartnerStoreProvider } from "../store/partner-store";

export default function HomePage() {
  return (
    <PartnerStoreProvider>
      <NavigationProvider>
        <PartnerAppShell />
      </NavigationProvider>
    </PartnerStoreProvider>
  );
}
