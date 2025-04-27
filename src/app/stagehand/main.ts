"use server";

import { Stagehand, Page, BrowserContext } from "@browserbasehq/stagehand";
import StagehandConfig from "../../../stagehand.config";
import { drawObserveOverlay, clearOverlays, actWithCache, clearActionCache } from "@/lib/stagehand-utils";
import { z } from "zod";
import * as fs from 'fs';
import * as path from 'path';

// Define the message schema
export interface OutreachMessage {
    linkedinUrl: string;
    body: string;
    subject?: string;
    name?: string;
}

// Path to store authentication states
const LINKEDIN_AUTH_STATE_PATH = path.join(process.cwd(), 'linkedin-auth-state.json');
const GMAIL_AUTH_STATE_PATH = path.join(process.cwd(), 'gmail-auth-state.json');

// Main Stagehand script for LinkedIn outreach
async function mainLinkedIn({
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
                    await context.storageState({ path: LINKEDIN_AUTH_STATE_PATH });
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

// Main Stagehand script for Gmail outreach
async function mainGmail({
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
    // Navigate to Gmail
    await page.goto("https://mail.google.com");

    // Check if we need to log in
    let isLoggedIn = false;

    try {
        // First check URL for a quick way to determine login status
        const currentUrl = page.url();
        if (currentUrl.includes('mail.google.com/mail/u/0/#inbox') ||
            currentUrl.includes('mail.google.com/mail/u/0/#sent') ||
            currentUrl.includes('mail.google.com/mail/u/0/#drafts')) {
            isLoggedIn = true;
        } else {
            // Fall back to extraction if URL check doesn't confirm login
            const result = await page.extract({
                instruction: "Check if the user is already logged in to Gmail",
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
                // First check if the URL indicates we're logged in (Gmail inbox URL)
                const currentUrl = page.url();
                if (currentUrl.includes('mail.google.com/mail/u/0/#inbox') ||
                    currentUrl.includes('mail.google.com/mail/u/0/#sent') ||
                    currentUrl.includes('mail.google.com/mail/u/0/#drafts')) {
                    isLoggedIn = true;
                } else {
                    // Fall back to extraction if URL check doesn't confirm login
                    const { currentlyLoggedIn } = await page.extract({
                        instruction: "Check if the user is now logged in to Gmail",
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
                    await context.storageState({ path: GMAIL_AUTH_STATE_PATH });
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
            
            // Click on the compose button using cached action
            const composeInstruction = "Click on the Compose button";
            await actWithCache(page, composeInstruction);
            
            // Generate email from name
            let recipientEmail = "test@example.com";
            if (message.name) {
                // Convert name to lowercase, remove spaces/special chars, and append @email.com
                recipientEmail = message.name.toLowerCase().replace(/[^a-z0-9]/g, '') + "@email.com";
            }
            
            // Add recipient email
            await page.act(`Type "${recipientEmail}" into the recipient (To) field`);
            
            // Add subject if provided
            if (message.subject) {
                const typeSubjectInstruction = `Type "${message.subject}" into the Subject field`;
                await actWithCache(page, typeSubjectInstruction);
            }
            
            // Add email body
            await page.act(`Type "${message.body}" into the email body area`);
            
            // Click the X button to close the compose window
            const saveEmailInstruction = "Click the X button in the top right corner of the message window";
            await actWithCache(page, saveEmailInstruction);
            
            // Pause briefly between emails
            await page.waitForTimeout(300);
        }
    } else {
        console.error("No messages to process. Please provide messages to send.");
    }
}

// Initialize and run the mainLinkedIn() function
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
        if (fs.existsSync(LINKEDIN_AUTH_STATE_PATH)) {
            console.log('Found saved authentication state. Loading...');

            // Load the auth state from file
            const authData = JSON.parse(fs.readFileSync(LINKEDIN_AUTH_STATE_PATH, 'utf-8'));

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
        await mainLinkedIn({
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

// Initialize and run the mainGmail() function
export async function runGmailOutreach(messages: OutreachMessage[]) {
    // Initialize Stagehand
    const stagehand = new Stagehand({
        ...StagehandConfig
    });

    await stagehand.init();
    const page = stagehand.page;
    const context = stagehand.context;

    // Try to load the authentication state if the file exists
    try {
        if (fs.existsSync(GMAIL_AUTH_STATE_PATH)) {
            console.log('Found saved Gmail authentication state. Loading...');

            // Load the auth state from file
            const authData = JSON.parse(fs.readFileSync(GMAIL_AUTH_STATE_PATH, 'utf-8'));

            // Add the cookies to the context
            await context.addCookies(authData.cookies);

            console.log('Gmail authentication state loaded successfully!');
        } else {
            console.log('No Gmail authentication state found. You may need to log in.');
        }
    } catch (error: any) {
        console.error('Error loading Gmail authentication state:', error.message);
    }

    try {
        await mainGmail({
            page,
            context,
            stagehand,
            messages,
        });
        return true;
    } catch (error) {
        console.error("Error running Gmail outreach:", error);
        return false;
    } finally {
        await stagehand.close();
    }
}
