// =============================================================================
// domActions.ts — Raw DOM manipulation utilities for the Co-Browsing AI Assistant
// All functions are SSR-safe (guarded with typeof window !== 'undefined')
// =============================================================================

import { PROJECTS } from "../constants";

/**
 * Smooth scroll to a specific section by its element ID.
 */
export function scrollToSection(sectionId: string): string {
    if (typeof window === "undefined") return "Not in browser environment.";
    const el = document.getElementById(sectionId);
    if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return `Scrolled to section "${sectionId}".`;
    }
    return `Section "${sectionId}" not found on the page.`;
}

/**
 * Scroll the window in a given direction.
 * Supports: "up", "down", "top", "bottom"
 */
export function scrollWindow(direction: string): string {
    if (typeof window === "undefined") return "Not in browser environment.";
    const amount = window.innerHeight * 0.75;
    switch (direction.toLowerCase()) {
        case "down":
            window.scrollBy({ top: amount, behavior: "smooth" });
            return "Scrolled down.";
        case "up":
            window.scrollBy({ top: -amount, behavior: "smooth" });
            return "Scrolled up.";
        case "top":
            window.scrollTo({ top: 0, behavior: "smooth" });
            return "Scrolled to the top of the page.";
        case "bottom":
            window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
            return "Scrolled to the bottom of the page.";
        default:
            return `Unknown direction "${direction}". Use "up", "down", "top", or "bottom".`;
    }
}

/**
 * Draw a temporary highlight box/overlay around an element matching the CSS selector.
 * The highlight fades out after ~2.5 seconds.
 */
export function highlightElement(selector: string): string {
    if (typeof window === "undefined") return "Not in browser environment.";
    const el = document.querySelector(selector) as HTMLElement | null;
    if (!el) return `No element found for selector "${selector}".`;

    // Scroll the element into view first
    el.scrollIntoView({ behavior: "smooth", block: "center" });

    // Create an overlay div that matches the element's bounding box
    const rect = el.getBoundingClientRect();
    const overlay = document.createElement("div");
    overlay.style.cssText = `
    position: fixed;
    top: ${rect.top}px;
    left: ${rect.left}px;
    width: ${rect.width}px;
    height: ${rect.height}px;
    border: 2px solid #22c55e;
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(34,197,94,0.4), inset 0 0 20px rgba(34,197,94,0.05);
    background: rgba(34,197,94,0.08);
    pointer-events: none;
    z-index: 99999;
    transition: opacity 0.5s ease;
  `;
    document.body.appendChild(overlay);

    // Animate a pulse effect
    let opacity = 1;
    const pulse = setInterval(() => {
        opacity = opacity === 1 ? 0.5 : 1;
        overlay.style.opacity = String(opacity);
    }, 400);

    // Remove after 2.5s
    setTimeout(() => {
        clearInterval(pulse);
        overlay.style.opacity = "0";
        setTimeout(() => overlay.remove(), 500);
    }, 2500);

    return `Highlighted element matching "${selector}".`;
}

/**
 * Simulate a click on the first element matching the CSS selector.
 */
export function clickElement(selector: string): string {
    if (typeof window === "undefined") return "Not in browser environment.";
    const el = document.querySelector(selector) as HTMLElement | null;
    if (!el) return `No element found for selector "${selector}".`;

    el.scrollIntoView({ behavior: "smooth", block: "center" });
    // Small delay so the scroll completes before clicking
    setTimeout(() => el.click(), 400);
    return `Clicked element matching "${selector}".`;
}

/**
 * Read the text content from <main> or a specific section by ID.
 * Returns a trimmed version (max 3000 chars) to fit in context.
 */
export function readPageContent(sectionId?: string): string {
    if (typeof window === "undefined") return "Not in browser environment.";

    let el: HTMLElement | null;
    if (sectionId) {
        el = document.getElementById(sectionId);
        if (!el) return `Section "${sectionId}" not found.`;
    } else {
        el = document.querySelector("main");
        if (!el) return "No <main> element found on this page.";
    }

    const text = el.innerText.trim();
    if (text.length > 3000) {
        return text.slice(0, 3000) + "\n... (content truncated)";
    }
    return text || "Section appears to be empty.";
}

/**
 * Fill form fields. Accepts an object with keys like name, email, message.
 * Dispatches React-compatible synthetic events.
 */
export function fillForm(data: Record<string, string>): string {
    if (typeof window === "undefined") return "Not in browser environment.";

    const results: string[] = [];

    for (const [field, value] of Object.entries(data)) {
        // Try multiple selector strategies
        const selectors = [
            `input[name="${field}"]`,
            `textarea[name="${field}"]`,
            `input[id="${field}"]`,
            `textarea[id="${field}"]`,
            `input[placeholder*="${field}" i]`,
            `textarea[placeholder*="${field}" i]`,
        ];

        let filled = false;
        for (const sel of selectors) {
            const el = document.querySelector(sel) as
                | HTMLInputElement
                | HTMLTextAreaElement
                | null;
            if (el) {
                // Use native setter to work with React controlled inputs
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype,
                    "value"
                )?.set;
                const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLTextAreaElement.prototype,
                    "value"
                )?.set;

                if (el.tagName === "TEXTAREA" && nativeTextAreaValueSetter) {
                    nativeTextAreaValueSetter.call(el, value);
                } else if (nativeInputValueSetter) {
                    nativeInputValueSetter.call(el, value);
                }

                el.dispatchEvent(new Event("input", { bubbles: true }));
                el.dispatchEvent(new Event("change", { bubbles: true }));

                results.push(`Filled "${field}" with "${value}".`);
                filled = true;
                break;
            }
        }
        if (!filled) {
            results.push(`Could not find form field for "${field}".`);
        }
    }

    // Scroll to the contact section so the user sees the form
    const contactSection = document.getElementById("contact");
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    return results.join(" ");
}

/**
 * Open a project's demo link or GitHub repo in a new tab by matching the project name.
 * Uses case-insensitive partial matching (e.g., "mockmate" matches "MockMate - AI Interview Platform").
 */
export function openProjectLink(
    projectName: string,
    linkType: "demo" | "github" = "demo"
): string {
    if (typeof window === "undefined") return "Not in browser environment.";

    const query = projectName.toLowerCase();
    const project = PROJECTS.find(
        (p) =>
            p.title.toLowerCase().includes(query) ||
            query.includes(p.title.toLowerCase().split(" ")[0]) // match first word too
    );

    if (!project) {
        const available = PROJECTS.map((p) => p.title).join(", ");
        return `No project found matching "${projectName}". Available projects: ${available}`;
    }

    const url = linkType === "github" ? project.github : project.link;
    if (!url) {
        return `Project "${project.title}" does not have a ${linkType} link.`;
    }

    window.open(url, "_blank", "noopener,noreferrer");
    return `Opened ${linkType} link for "${project.title}": ${url}`;
}
