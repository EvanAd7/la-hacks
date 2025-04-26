"use server";

import { ObserveResult, Page } from "@browserbasehq/stagehand";
import fs from "fs/promises";
import { z } from "zod";
import { existsSync, unlinkSync } from 'fs';

export async function drawObserveOverlay(page: Page, results: ObserveResult[]) {
  // Convert single xpath to array for consistent handling
  const xpathList = results.map((result) => result.selector);

  // Filter out empty xpaths
  const validXpaths = xpathList.filter((xpath) => xpath !== "xpath=");

  await page.evaluate((selectors) => {
    selectors.forEach((selector) => {
      let element;
      if (selector.startsWith("xpath=")) {
        const xpath = selector.substring(6);
        element = document.evaluate(
          xpath,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null,
        ).singleNodeValue;
      } else {
        element = document.querySelector(selector);
      }

      if (element instanceof HTMLElement) {
        const overlay = document.createElement("div");
        overlay.setAttribute("stagehandObserve", "true");
        const rect = element.getBoundingClientRect();
        overlay.style.position = "absolute";
        overlay.style.left = rect.left + "px";
        overlay.style.top = rect.top + "px";
        overlay.style.width = rect.width + "px";
        overlay.style.height = rect.height + "px";
        overlay.style.backgroundColor = "rgba(255, 255, 0, 0.3)";
        overlay.style.pointerEvents = "none";
        overlay.style.zIndex = "10000";
        document.body.appendChild(overlay);
      }
    });
  }, validXpaths);
}

export async function clearOverlays(page: Page) {
  // remove existing stagehandObserve attributes
  await page.evaluate(() => {
    const elements = document.querySelectorAll('[stagehandObserve="true"]');
    elements.forEach((el) => {
      const parent = el.parentNode;
      while (el.firstChild) {
        parent?.insertBefore(el.firstChild, el);
      }
      parent?.removeChild(el);
    });
  });
}

export async function simpleCache(
  instruction: string,
  actionToCache: ObserveResult,
) {
  // Save action to cache.json
  try {
    // Read existing cache if it exists
    let cache: Record<string, ObserveResult> = {};
    try {
      const existingCache = await fs.readFile("cache.json", "utf-8");
      cache = JSON.parse(existingCache);
    } catch (error) {
      // File doesn't exist yet, use empty cache
    }

    // Add new action to cache
    cache[instruction] = actionToCache;

    // Write updated cache to file
    await fs.writeFile("cache.json", JSON.stringify(cache, null, 2));
  } catch (error) {
    console.error("Failed to save to cache:", error);
  }
}

export async function readCache(
  instruction: string,
): Promise<ObserveResult | null> {
  try {
    const existingCache = await fs.readFile("cache.json", "utf-8");
    const cache: Record<string, ObserveResult> = JSON.parse(existingCache);
    return cache[instruction] || null;
  } catch (error) {
    return null;
  }
}

/**
 * This function is used to act with a cacheable action.
 * It will first try to get the action from the cache.
 * If not in cache, it will observe the page and cache the result.
 * Then it will execute the action.
 * @param instruction - The instruction to act with.
 */
export async function actWithCache(
  page: Page,
  instruction: string,
): Promise<void> {
  // Try to get action from cache first
  const cachedAction = await readCache(instruction);
  if (cachedAction) {
    console.log("Using cached action for:", instruction);
    await page.act(cachedAction);
    return;
  }

  // If not in cache, observe the page and cache the result
  const results = await page.observe(instruction);
  console.log("Got results:", results);

  // Cache the playwright action
  const actionToCache = results[0];
  console.log("Taking cacheable action:", actionToCache);
  await simpleCache(instruction, actionToCache);
  // OPTIONAL: Draw an overlay over the relevant xpaths
  await drawObserveOverlay(page, results);
  await page.waitForTimeout(1000); // Can delete this line, just a pause to see the overlay
  await clearOverlays(page);

  // Execute the action
  await page.act(actionToCache);
}

/**
 * Clear the action cache file
 */
export async function clearActionCache(): Promise<void> {
  try {
    const cachePath = "cache.json";
    if (existsSync(cachePath)) {
      unlinkSync(cachePath);
      console.log("Action cache cleared successfully.");
    }
  } catch (error: any) {
    console.error("Failed to clear action cache:", error.message);
  }
}
