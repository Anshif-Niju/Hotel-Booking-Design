import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5174/";

test("should book hotel", async ({ page }) => {
  await page.goto(UI_URL);

  // Fill out the search form for Dublin
  await page.getByPlaceholder("Where are you going?").fill("Dublin");

  // Select a checkout date (3 days from now)
  const date = new Date();
  date.setDate(date.getDate() + 3);
  const formattedDate = date.toISOString().split("T")[0];
  await page.getByPlaceholder("Check-out Date").fill(formattedDate);

  await page.getByRole("button", { name: "Search" }).click();

  await page.getByText("Dublin Getaways").click();
  await page.getByRole("button", { name: "Book now" }).click();

  // Wait for the total cost to be visible
  await expect(page.getByText("Total Cost: £357.00")).toBeVisible({ timeout: 10000 });

  // Wait for the Stripe iframe and fill out payment details
  const stripeFrame = page.frameLocator("iframe").first();

  // Ensure the iframe is fully loaded and wait for the card number field
  const cardNumberLocator = stripeFrame.locator('[placeholder="Card number"]');
  await cardNumberLocator.waitFor({ timeout: 10000 });

  await cardNumberLocator.fill("4242424242424242");
  await stripeFrame.locator('[placeholder="MM / YY"]').fill("04/30");
  await stripeFrame.locator('[placeholder="CVC"]').fill("242");
  await stripeFrame.locator('[placeholder="ZIP"]').fill("24225");

  // Submit the payment
  await page.getByRole("button", { name: "Confirm Booking" }).click();

  // Wait for booking confirmation message
  await expect(page.getByText("Booking Saved!")).toBeVisible({ timeout: 10000 });

  // Navigate to "My Bookings" and verify the booking
  await page.getByRole("link", { name: "My Bookings" }).click();
  await expect(page.getByText("Dublin Getaways")).toBeVisible();
});
