import { PROJECTS } from "../constants";

export function scrollToSection(sectionId: string): string {
    if (typeof window === "undefined") return "Not in browser environment.";
    const el = document.getElementById(sectionId);
    if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return `Scrolled to section "${sectionId}".`;
    }
    return `Section "${sectionId}" not found on the page.`;
}

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

export function highlightElement(selector: string, color?: string): string {
    if (typeof window === "undefined") return "Not in browser environment.";

    const highlightColor = color || "#22c55e";
    // Convert hex to rgba for background/shadow
    const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${alpha})`;
    };

    // Try querySelector first, fall back to text search if selector is invalid
    let el: HTMLElement | null = null;
    try {
        el = document.querySelector(selector) as HTMLElement | null;
    } catch {
        // Invalid selector (e.g. :contains()) — try text-based fallback
        console.warn(`[CoBrowsing] Invalid selector "${selector}", falling back to text search.`);
    }

    // Fallback: search by text content if querySelector failed or found nothing
    if (!el) {
        // Extract text hints from the selector (anything in quotes or after keywords)
        const textHints = selector.match(/['"]([^'"]+)['"]/g)?.map(s => s.replace(/['"]/g, '')) || [];
        // Also try extracting text from patterns like #some-id or .some-class
        const idMatch = selector.match(/#([\w-]+)/);
        if (idMatch) {
            el = document.getElementById(idMatch[1]);
        }

        if (!el && textHints.length > 0) {
            const searchText = textHints[0].toLowerCase();

            // Search in priority tiers: headings first, then inline, then block
            // This prevents matching a large wrapper div instead of the specific h3
            const tiers = [
                'h1, h2, h3, h4, h5, h6',
                'span, a, button, label, p',
                'div, section, article, li',
            ];

            for (const tierSelector of tiers) {
                if (el) break;
                const candidates = document.querySelectorAll(tierSelector);
                let bestMatch: HTMLElement | null = null;
                let bestLen = Infinity;

                for (const candidate of candidates) {
                    const htmlEl = candidate as HTMLElement;
                    const text = htmlEl.textContent?.toLowerCase() || '';
                    if (text.includes(searchText)) {
                        // Among matches in same tier, prefer the smallest element
                        if (text.length < bestLen) {
                            bestMatch = htmlEl;
                            bestLen = text.length;
                        }
                    }
                }
                if (bestMatch) {
                    el = bestMatch;
                }
            }
        }
    }

    if (!el) return `No element found for selector "${selector}".`;

    el.scrollIntoView({ behavior: "smooth", block: "center" });

    // Wait a moment for scroll to settle before measuring position
    setTimeout(() => {
        const rect = el!.getBoundingClientRect();
        const overlay = document.createElement("div");
        overlay.style.cssText = `
        position: fixed;
        top: ${rect.top}px;
        left: ${rect.left}px;
        width: ${rect.width}px;
        height: ${rect.height}px;
        border: 2px solid ${highlightColor};
        border-radius: 8px;
        box-shadow: 0 0 20px ${hexToRgba(highlightColor, 0.4)}, inset 0 0 20px ${hexToRgba(highlightColor, 0.05)};
        background: ${hexToRgba(highlightColor, 0.08)};
        pointer-events: none;
        z-index: 99999;
        transition: opacity 0.5s ease;
        `;
        document.body.appendChild(overlay);

        let opacity = 1;
        const pulse = setInterval(() => {
            opacity = opacity === 1 ? 0.5 : 1;
            overlay.style.opacity = String(opacity);
        }, 400);

        setTimeout(() => {
            clearInterval(pulse);
            overlay.style.opacity = "0";
            setTimeout(() => overlay.remove(), 500);
        }, 2500);
    }, 300);

    return `Highlighted element matching "${selector}".`;
}

export function clickElement(selector: string): string {
    if (typeof window === "undefined") return "Not in browser environment.";
    const el = document.querySelector(selector) as HTMLElement | null;
    if (!el) return `No element found for selector "${selector}".`;

    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => el.click(), 400);
    return `Clicked element matching "${selector}".`;
}

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

    const contactSection = document.getElementById("contact");
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    return results.join(" ");
}

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
