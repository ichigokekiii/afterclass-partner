import { devices, expect, test } from "@playwright/test";

test.describe("Desktop browser gate", () => {
  test.use({
    viewport: { width: 1280, height: 800 },
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    isMobile: false,
    hasTouch: false,
  });

  test("blocks desktop browsers and shows the mobile-only gate", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByTestId("desktop-blocked")).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Open this link on your phone or tablet",
      })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Continue as Maria, owner" })
    ).toHaveCount(0);
  });
});

test.describe("Tablet browser access (iPad Mini)", () => {
  test.use({
    viewport: devices["iPad Mini"].viewport,
    userAgent: devices["iPad Mini"].userAgent,
    isMobile: true,
    hasTouch: true,
  });

  test("allows tablet browsers through to sign-in", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: "Continue as Maria, owner" })
    ).toBeVisible();
  });
});

test.describe("Mobile phone walk (iPhone 14 Pro)", () => {
  test.use({
    viewport: devices["iPhone 14 Pro"].viewport,
    userAgent: devices["iPhone 14 Pro"].userAgent,
    isMobile: true,
    hasTouch: true,
  });

  test("owner and staff walk the seeded day (1:1 parity with DemoWalkTests.swift)", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Continue as Maria, owner" }).click();
    await expect(page.getByText("2 still open")).toBeVisible();
    await expect(page.getByText("10 customers brought in")).toBeVisible();
    await expect(page.getByTestId("tab-Café")).toBeVisible();

    await page.getByTestId("booking-today-jennie").click();
    await expect(page.getByText("Together by the window")).toBeVisible();
    await expect(page.getByText("Two cups on the table")).toBeVisible();
    await expect(page.getByText("Both students are inside.")).toBeVisible();

    await page.getByText("Ateneo de Manila University").first().click();
    await expect(page.getByText("Verified")).toBeVisible();
    await expect(
      page.getByText(
        "Email, phone, ID, and emergency contact stay off this screen."
      )
    ).toBeVisible();
    await page.getByTestId("nav-back-Date").click();

    await page.getByRole("button", { name: "Confirm date happened" }).click();
    await expect(page.getByText("Completed")).toBeVisible();
    await page.getByTestId("nav-back-Today").click();
    await expect(page.getByText("12 customers brought in")).toBeVisible();
    await expect(page.getByText("1 still open")).toBeVisible();

    await page.getByTestId("booking-today-aria").click();
    await expect(
      page.getByText("Waiting for the students to share these photos.")
    ).toBeVisible();
    await expect(
      page.getByText("No photos for this task.").first()
    ).toBeVisible();
    await expect(page.getByText("One student is inside.")).toBeVisible();
    await page.getByTestId("nav-back-Today").click();

    await page.getByTestId("tab-Alerts").click();
    await page.getByTestId("alert-report-report-pending").click();
    await expect(
      page.getByRole("button", { name: "Confirm report" })
    ).toBeVisible();
    await page.getByRole("button", { name: "Confirm report" }).click();
    await expect(page.getByTestId("report-location")).toBeVisible();
    await page.getByTestId("nav-back-Alerts").click();

    await page.getByTestId("tab-Café").click();
    await expect(page.getByTestId("cafe-section-menu")).toBeVisible();
    await page.getByTestId("cafe-section-menu").click();
    await expect(page.getByTestId("tier-and-billing")).toBeVisible();
    await page.getByTestId("tier-and-billing").click();
    await expect(page.getByText("Senior")).toBeVisible();
    await expect(page.getByText("12 of 500 customers")).toBeVisible();
    await expect(
      page.getByText("Free until 500 customers. Then the monthly fee starts.")
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Pay" })).toHaveCount(0);

    await page.getByTestId("tab-Today").click();
    await page.getByRole("button", { name: "Sign out" }).click();

    await page.getByRole("button", { name: "Continue as Paolo, staff" }).click();
    await expect(page.getByText("1 still open")).toBeVisible();
    await expect(page.getByTestId("tab-Café")).toHaveCount(0);
    await expect(page.getByTestId("tab-Alerts")).toBeVisible();
  });
});
