"use server";

import { Stagehand, Page, BrowserContext } from "@browserbasehq/stagehand";
import StagehandConfig from "../../../stagehand.config";
import { z } from "zod";
import * as fs from 'fs';
import * as path from 'path';

// Define the message schema
export interface OutreachMessage {
    linkedinUrl: string;
    body: string;
}

// Path to store LinkedIn authentication state
const AUTH_STATE_PATH = path.join(process.cwd(), 'linkedin-auth-state.json');

/**
 * Main Stagehand script for LinkedIn outreach
 */
async function main({
    page,
    context,
    stagehand,
    messages
}: {
    page: Page; // Playwright Page with act, extract, and observe methods
    context: BrowserContext; // Playwright BrowserContext
    stagehand: Stagehand; // Stagehand instance
    messages: OutreachMessage[]; // Array of outreach messages
}) {
    // Navigate to LinkedIn
    await page.goto("https://www.linkedin.com");

    // Check if we need to log in
    let isLoggedIn = false;

    try {
        // First check URL for a quick way to determine login status
        const currentUrl = page.url();
        if (currentUrl.includes('linkedin.com/feed') ||
            currentUrl.includes('linkedin.com/in/') ||
            currentUrl.includes('linkedin.com/mynetwork')) {
            isLoggedIn = true;
        } else {
            // Fall back to extraction if URL check doesn't confirm login
            const result = await page.extract({
                instruction: "Check if the user is already logged in to LinkedIn",
                schema: z.object({
                    isLoggedIn: z.boolean()
                }),
            });

            isLoggedIn = result.isLoggedIn;
        }
    } catch (error: any) {
        isLoggedIn = false;
    }

    // If not logged in, have them log in manually
    if (!isLoggedIn) {
        // Wait for user to manually log in - checking every 5 seconds for login state
        let loginCounter = 0;
        const maxLoginChecks = 120; // 10 minutes max wait (120 * 5 seconds)

        while (!isLoggedIn && loginCounter < maxLoginChecks) {
            await page.waitForTimeout(5000); // Wait 5 seconds

            // Check login status again - wrap in try-catch to handle navigation issues
            try {
                // First check if the URL indicates we're logged in (LinkedIn feed URL)
                const currentUrl = page.url();
                if (currentUrl.includes('linkedin.com/feed') ||
                    currentUrl.includes('linkedin.com/in/') ||
                    currentUrl.includes('linkedin.com/mynetwork')) {
                    isLoggedIn = true;
                } else {
                    // Fall back to extraction if URL check doesn't confirm login
                    const { currentlyLoggedIn } = await page.extract({
                        instruction: "Check if the user is now logged in to LinkedIn",
                        schema: z.object({
                            currentlyLoggedIn: z.boolean()
                        }),
                    });

                    isLoggedIn = currentlyLoggedIn;
                }
            } catch (error: any) {
                console.error("Error checking login status:", error);
                await page.waitForTimeout(2000);
            }

            loginCounter++;

            if (isLoggedIn) {
                // Save the authentication state to be reused later
                try {
                    await context.storageState({ path: AUTH_STATE_PATH });
                } catch (error: any) {
                    console.error("Error saving authentication state:", error);
                }
                break;
            }
        }

        if (!isLoggedIn) {
            console.error("Login timeout exceeded. Please run the script again after logging in.");
            return;
        }
    }

    // Process each message in the messages array
    if (messages && messages.length > 0) {
        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];

            // Navigate to the LinkedIn profile
            await page.goto(message.linkedinUrl);

            // Click on the Message button
            await page.act("Click on the Message button, underneath the profile header");

            // Input the message
            await page.act(`Type "${message.body}" into the message input field`);

            // Pause briefly between messages
            await page.waitForTimeout(300);
        }
    } else {
        console.error("No messages to process. Please provide messages to send.");
    }
}

// Initialize and run the main() function
export async function runLinkedInOutreach(messages: OutreachMessage[]) {
    // Initialize Stagehand
    const stagehand = new Stagehand({
        ...StagehandConfig
    });

    await stagehand.init();
    const page = stagehand.page;
    const context = stagehand.context;

    // Try to load the authentication state if the file exists
    try {
        if (fs.existsSync(AUTH_STATE_PATH)) {
            console.log('Found saved authentication state. Loading...');

            // Load the auth state from file
            const authData = JSON.parse(fs.readFileSync(AUTH_STATE_PATH, 'utf-8'));

            // Add the cookies to the context
            await context.addCookies(authData.cookies);

            console.log('Authentication state loaded successfully!');
        } else {
            console.log('No authentication state found. You may need to log in.');
        }
    } catch (error: any) {
        console.error('Error loading authentication state:', error.message);
    }

    try {
        await main({
            page,
            context,
            stagehand,
            messages,
        });
        return true;
    } catch (error) {
        console.error("Error running LinkedIn outreach:", error);
        return false;
    } finally {
        await stagehand.close();
    }
}

/**
 * Check if authentication file exists
 */
export async function isAuthSetup() {
    try {
        return fs.existsSync(AUTH_STATE_PATH);
    } catch {
        return false;
    }
}
