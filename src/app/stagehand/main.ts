"use server";

import { Stagehand, Page, BrowserContext } from "@browserbasehq/stagehand";
import StagehandConfig from "../../../stagehand.config";
import { z } from "zod";

/**
 * Main Stagehand script
 */
async function main({
    page,
    context,
    stagehand,
}: {
    page: Page; // Playwright Page with act, extract, and observe methods
    context: BrowserContext; // Playwright BrowserContext
    stagehand: Stagehand; // Stagehand instance
}) {
    // Navigate to a URL
    await page.goto("https://docs.stagehand.dev/reference/introduction");

    // Use act() to take actions on the page
    await page.act("Click the search box");

    // Use observe() to plan an action before doing it
    const [action] = await page.observe(
        "Type 'Tell me in one sentence why I should use Stagehand' into the search box",
    );
    await page.act(action); // Take action

    await page.act("Click the suggestion to use AI");

    // Use extract() to extract structured data from the page
    const { text } = await page.extract({
        instruction:
            "extract the text of the AI suggestion from the search results",
        schema: z.object({
            text: z.string(),
        }),
    });
    stagehand.log({
        category: "create-browser-app",
        message: `Got AI Suggestion`,
        auxiliary: {
            text: {
                value: text,
                type: "string",
            },
        },
    });
    stagehand.log({
        category: "create-browser-app",
        message: `Metrics`,
        auxiliary: {
            metrics: {
                value: JSON.stringify(stagehand.metrics),
                type: "object",
            },
        },
    });
}

/**
 * Initialize and run the main() function
 */
export async function runStagehand() {
    const stagehand = new Stagehand({
        ...StagehandConfig,
    });
    await stagehand.init();
    const page = stagehand.page;
    const context = stagehand.context;
    await main({
        page,
        context,
        stagehand,
    });
    await stagehand.close();
}