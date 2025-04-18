import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5174/";

test.setTimeout(3000); // Set test timeout to 60 seconds

test("should allow the user to sign in", async ({ page }) => {
  await page.goto(UI_URL);

  // Click the Sign In link
  await page.getByRole("link", { name: "Sign In" }).click();

  // Check that the Sign In heading is visible
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  // Fill in the login credentials
  await page.locator("[name=email]").fill("1@1.com");
  await page.locator("[name=password]").fill("password123");

  // Log network responses to debug API issues
  page.on("response", (response) => {
    console.log("Response URL:", response.url(), "Status:", response.status());
  });

  // Click the login button
  await page.getByRole("button", { name: "Login" }).click();

  // Wait for the specific API response
  const response = await page.waitForResponse(
    (response) =>
      response.url().includes("api/login") && response.status() === 200,
    { timeout: 6000 } // Extend timeout if necessary
  );

  console.log("Response received:", response.url()); // Debugging

  // Ensure the success message appears
  const signInMessage = await page.getByText("Sign in Successful!");
  await expect(signInMessage).toBeVisible();

  // Check visibility of post-login elements
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});

test.setTimeout(120000); // Set test timeout to 60 seconds

test("should allow user to register", async ({ page }) => {
  const testEmail = `test_register_${Math.floor(Math.random() * 90000) + 10000}@test.com`;

  await page.goto(UI_URL);

  // Click the Sign In link and then the Create Account link
  await page.getByRole("link", { name: "Sign In" }).click();
  await page.getByRole("link", { name: "Create an account here" }).click();

  // Check that the Create an Account heading is visible
  await expect(page.getByRole("heading", { name: "Create an Account" })).toBeVisible();

  // Fill out the registration form
  await page.locator("[name=firstName]").fill("test_firstName");
  await page.locator("[name=lastName]").fill("test_lastName");
  await page.locator("[name=email]").fill(testEmail);
  await page.locator("[name=password]").fill("password123");
  await page.locator("[name=confirmPassword]").fill("password123");

  // Click the Create Account button
  await page.getByRole("button", { name: "Create Account" }).click();

  // Wait for the specific API response
  const response = await page.waitForResponse(
    (response) =>
      response.url().includes("api/register") && response.status() === 201,
    { timeout: 120000 }
  );

  console.log("Response URL:", response.url()); // Debugging

  // Ensure the registration success message appears
  const registrationMessage = await page.getByText("Registration Success!");
  await expect(registrationMessage).toBeVisible();

  // Check visibility of post-registration elements
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});