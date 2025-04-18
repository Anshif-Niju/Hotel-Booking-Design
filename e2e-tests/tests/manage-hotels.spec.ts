import { test, expect } from "@playwright/test";
import path from "path";

const UI_URL = "http://localhost:5174/";

test.beforeEach(async ({ page }) => {
  // Go to login page and perform login before each test
  await page.goto(UI_URL);
  
  // Get the sign-in button and click it
  await page.getByRole("link", { name: "Sign In" }).click();
  
  // Ensure the login page loads and is visible
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
  
  // Fill in login credentials and submit
  await page.locator("[name=email]").fill("1@1.com");
  await page.locator("[name=password]").fill("password123");
  
  // Click the login button and wait for the response
  const [response] = await Promise.all([
    page.waitForResponse((response) => response.url().includes("api/login") && response.status() === 200, { timeout: 60000 }),
    page.getByRole("button", { name: "Login" }).click(),
  ]);

  // Wait for the success message to appear after login
  await expect(page.getByText("Sign in Successful!")).toBeVisible();
});

test("should allow user to add a hotel", async ({ page }) => {
  await page.goto(`${UI_URL}add-hotel`);

  // Fill out the hotel form
  await page.locator('[name="name"]').fill("Test Hotel");
  await page.locator('[name="city"]').fill("Test City");
  await page.locator('[name="country"]').fill("Test Country");
  await page.locator('[name="description"]').fill("This is a description for the Test Hotel");
  await page.locator('[name="pricePerNight"]').fill("100");
  await page.selectOption('select[name="starRating"]', "3");

  // Select the amenities
  await page.getByText("Budget").click();
  await page.getByLabel("Free Wifi").check();
  await page.getByLabel("Parking").check();

  // Set the number of adults and children
  await page.locator('[name="adultCount"]').fill("2");
  await page.locator('[name="childCount"]').fill("4");

  // Set the image files
  const fileInput = page.locator('[name="imageFiles"]');
  await fileInput.setInputFiles([
    path.join(__dirname, "files", "1.png"),
    path.join(__dirname, "files", "2.png"),
  ]);

  // Wait for the upload to complete and click the Save button
  const [response] = await Promise.all([
    page.waitForResponse((response) => response.url().includes("api/hotels") && response.status() === 201, { timeout: 60000 }),
    page.getByRole("button", { name: "Save" }).click(),
  ]);

  // Ensure the success message is visible after saving the hotel
  await expect(page.getByText("Hotel Saved!")).toBeVisible();
});

test("should display hotels", async ({ page }) => {
  await page.goto(`${UI_URL}my-hotels`);

  // Check that hotel information is displayed correctly
  await expect(page.getByText("Dublin Getaways")).toBeVisible();
  await expect(page.getByText("Lorem ipsum dolor sit amet")).toBeVisible();
  await expect(page.getByText("Dublin, Ireland")).toBeVisible();
  await expect(page.getByText("All Inclusive")).toBeVisible();
  await expect(page.getByText("£119 per night")).toBeVisible();
  await expect(page.getByText("2 adults, 3 children")).toBeVisible();
  await expect(page.getByText("2 Star Rating")).toBeVisible();

  // Ensure that the "View Details" and "Add Hotel" buttons are visible
  await expect(page.getByRole("link", { name: "View Details" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Add Hotel" })).toBeVisible();
});

test("should edit hotel", async ({ page }) => {
  await page.goto(`${UI_URL}my-hotels`);

  // Click on the "View Details" link for the first hotel
  await page.getByRole("link", { name: "View Details" }).first().click();

  // Wait for the name input to be visible and confirm initial value
  await page.waitForSelector('[name="name"]', { state: "attached" });
  await expect(page.locator('[name="name"]')).toHaveValue("Dublin Getaways");

  // Update the hotel name
  await page.locator('[name="name"]').fill("Dublin Getaways UPDATED");
  await page.getByRole("button", { name: "Save" }).click();

  // Wait for success message and verify it
  await expect(page.getByText("Hotel Saved!")).toBeVisible();

  // Reload the page and verify that the hotel name has been updated
  await page.reload();
  await expect(page.locator('[name="name"]')).toHaveValue("Dublin Getaways UPDATED");

  // Restore the original name and save again
  await page.locator('[name="name"]').fill("Dublin Getaways");
  await page.getByRole("button", { name: "Save" }).click();
});
