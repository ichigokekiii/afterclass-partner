"use client";

import React from "react";
import {
  MockPhotoTile,
  PartnerCard,
  PrimaryButton,
  SecondaryButton,
} from "../components/theme";
import { useNavigation } from "../navigation/routes";
import { usePartnerStore } from "../store/partner-store";

export function SignInScreen() {
  const store = usePartnerStore();
  const nav = useNavigation();

  return (
    <div className="min-h-dvh flex flex-col justify-between bg-partner-white px-6 pt-6 pb-4">
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-[32px] font-bold text-partner-ink leading-tight">
            After Class
          </h1>
          <p className="text-[20px] font-semibold text-partner-burgundy leading-snug">
            Partner
          </p>
        </div>

        <p className="text-[14px] text-partner-gray">
          The first move is showing up.
        </p>

        <PartnerCard>
          <div className="space-y-4">
            <MockPhotoTile label="Exterior" height={176} />
            <div className="space-y-1">
              <p className="text-[20px] font-bold text-partner-ink leading-snug">
                {store.cafe.name}
              </p>
              <p className="text-[14px] text-partner-gray">
                {store.cafe.address}
              </p>
            </div>
          </div>
        </PartnerCard>
      </div>

      <div className="pt-6 pb-2 space-y-4">
        <PrimaryButton
          title="Continue as Maria, owner"
          testId="sign-in-maria"
          onClick={() => {
            nav.resetAll();
            store.signIn("maria");
          }}
        />
        <SecondaryButton
          title="Continue as Paolo, staff"
          testId="sign-in-paolo"
          onClick={() => {
            nav.resetAll();
            store.signIn("paolo");
          }}
        />
      </div>
    </div>
  );
}
