// =============================================================================
// gemini.ts — Gemini client initialization, tool definitions, and chat loop
// Runs CLIENT-SIDE (uses NEXT_PUBLIC_ env var)
// =============================================================================

import { GoogleGenAI, Type, Chat } from "@google/genai";
import { RESUME_DATA, PROJECTS, SKILLS, EXPERIENCE } from "../constants";
import {
    scrollToSection,
    scrollWindow,
    highlightElement,
    clickElement,
    readPageContent,
    fillForm,
    openProjectLink,
} from "./domActions";

// ---------------------------------------------------------------------------
// Rate-limit protection: minimum 1s gap between API calls
// ---------------------------------------------------------------------------
let lastCallTimestamp = 0;
const MIN_CALL_GAP_MS = 1000;

async function rateLimitGuard(): Promise<void> {
    const now = Date.now();
    const elapsed = now - lastCallTimestamp;
    if (elapsed < MIN_CALL_GAP_MS) {
        await new Promise((r) => setTimeout(r, MIN_CALL_GAP_MS - elapsed));
    }
    lastCallTimestamp = Date.now();
}

// ---------------------------------------------------------------------------
// 1. Gemini Client
// ---------------------------------------------------------------------------
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";

let aiInstance: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
    if (!aiInstance) {
        if (!API_KEY) {
            throw new Error(
                "NEXT_PUBLIC_GEMINI_API_KEY is not set. Add it to .env.local."
            );
        }
        aiInstance = new GoogleGenAI({ apiKey: API_KEY });
    }
    return aiInstance;
}

// ---------------------------------------------------------------------------
// 2. System Instruction
// ---------------------------------------------------------------------------
const SYSTEM_INSTRUCTION = `You are an intelligent Co-Browsing Assistant. Your goal is to navigate, explain, and interact with this website for the user.

CRITICAL RULE: Do not just tell the user where things are. If they ask to "see", "go to", or "show" something, use the scroll_to_section or scroll_window tool immediately.
If they ask about content, use read_page_content.
If they ask to click something, use click_element.
Be concise and helpful.

PAGE SECTIONS (use these IDs with scroll_to_section):
- "about" — Hero section with intro, identity card, and interactive terminal
- "desktop" — Windows-style desktop with Skills.exe, Experience.log, Projects.dir, Resume.pdf windows
- "contact" — Contact section with email, phone, LinkedIn, GitHub

PORTFOLIO CONTEXT:
Name: ${RESUME_DATA.name}
Role: ${RESUME_DATA.role}
Location: ${RESUME_DATA.location}
Email: ${RESUME_DATA.email}
Phone: ${RESUME_DATA.phone}
LinkedIn: ${RESUME_DATA.linkedin}
GitHub: ${RESUME_DATA.github}

About: ${RESUME_DATA.about}

SKILLS:
${SKILLS.map((s) => `- ${s.name} (${s.category})`).join("\n")}

PROJECTS:
${PROJECTS.map((p, i) => `${i + 1}. ${p.title}: ${p.description} (Tech: ${p.tags.join(", ")})`).join("\n")}

EXPERIENCE:
${EXPERIENCE.map((e, i) => `${i + 1}. ${e.role} at ${e.company} (${e.period}): ${e.description.join(" ")}`).join("\n")}
`;

// ---------------------------------------------------------------------------
// 3. Tool Definitions (FunctionDeclarations)
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tools: any[] = [
    {
        functionDeclarations: [
            {
                name: "scroll_to_section",
                description:
                    "Smooth scroll to a specific section on the page by its ID. Use when the user wants to see, show, go to, or navigate to a section.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        sectionId: {
                            type: Type.STRING,
                            description:
                                'The section ID. Available: "about", "desktop", "contact".',
                        },
                    },
                    required: ["sectionId"],
                },
            },
            {
                name: "scroll_window",
                description:
                    'Scroll the browser window. Use for generic scroll requests like "scroll down", "go to top", etc.',
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        direction: {
                            type: Type.STRING,
                            description: '"up", "down", "top", or "bottom".',
                        },
                    },
                    required: ["direction"],
                },
            },
            {
                name: "highlight_element",
                description:
                    "Draw a temporary green highlight box around a UI element to draw the user's attention.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        selector: {
                            type: Type.STRING,
                            description:
                                'CSS selector of the element to highlight, e.g. "#contact", ".navbar".',
                        },
                    },
                    required: ["selector"],
                },
            },
            {
                name: "click_element",
                description: "Simulate a click on a button, link, or interactive element.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        selector: {
                            type: Type.STRING,
                            description: "CSS selector of the element to click.",
                        },
                    },
                    required: ["selector"],
                },
            },
            {
                name: "read_page_content",
                description:
                    "Read visible text content from the main page or a specific section. Use this to answer questions about what's on the page.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        sectionId: {
                            type: Type.STRING,
                            description:
                                'Optional section ID to read from. If omitted, reads the entire <main> tag. Available: "about", "desktop", "contact".',
                        },
                    },
                },
            },
            {
                name: "fill_form",
                description:
                    "Fill form input fields with provided data. Use when the user provides their name, email, or a message to fill into the contact form.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        data: {
                            type: Type.OBJECT,
                            description:
                                'Object with form field names as keys and values to fill. Example: {"name": "John", "email": "john@example.com", "message": "Hello!"}',
                            properties: {
                                name: { type: Type.STRING, description: "The name to fill." },
                                email: { type: Type.STRING, description: "The email to fill." },
                                message: {
                                    type: Type.STRING,
                                    description: "The message to fill.",
                                },
                            },
                        },
                    },
                    required: ["data"],
                },
            },
            {
                name: "open_project_link",
                description:
                    "Open a project's live demo or GitHub repository in a new browser tab. Use when the user asks to see, open, visit, or demo a specific project.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        projectName: {
                            type: Type.STRING,
                            description:
                                'The name (or partial name) of the project. Available: "MockMate", "Nutriguard", "Discord Clone".',
                        },
                        linkType: {
                            type: Type.STRING,
                            description:
                                '"demo" to open the live site, "github" to open the GitHub repo. Defaults to "demo".',
                        },
                    },
                    required: ["projectName"],
                },
            },
        ],
    },
];

// ---------------------------------------------------------------------------
// 4. Execute a single tool call in the browser
// ---------------------------------------------------------------------------
function executeTool(
    name: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: Record<string, any>
): string {
    switch (name) {
        case "scroll_to_section":
            return scrollToSection(args.sectionId);
        case "scroll_window":
            return scrollWindow(args.direction);
        case "highlight_element":
            return highlightElement(args.selector);
        case "click_element":
            return clickElement(args.selector);
        case "read_page_content":
            return readPageContent(args.sectionId);
        case "fill_form":
            return fillForm(args.data ?? {});
        case "open_project_link":
            return openProjectLink(args.projectName, args.linkType ?? "demo");
        default:
            return `Unknown tool: ${name}`;
    }
}

// ---------------------------------------------------------------------------
// 5. Create a Chat session
// ---------------------------------------------------------------------------
export function createChatSession(): Chat {
    const ai = getAI();
    return ai.chats.create({
        model: "gemini-2.0-flash",
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            tools,
        },
    });
}

// ---------------------------------------------------------------------------
// 6. Multi-turn chat loop: send message → execute tools → send results back
// ---------------------------------------------------------------------------
export async function sendCoBrowsingMessage(
    chat: Chat,
    userText: string
): Promise<string> {
    await rateLimitGuard();
    let response = await chat.sendMessage({ message: userText });

    // Loop: if the model wants to call tools, execute them and send results back
    const MAX_TURNS = 3; // safety limit (keeps API usage low)
    let turns = 0;

    while (turns < MAX_TURNS) {
        const parts = response.candidates?.[0]?.content?.parts ?? [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const functionCalls = parts.filter((p: any) => p.functionCall);

        if (functionCalls.length === 0) break; // No more tool calls → done

        // Execute each tool and collect results
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const functionResponses = functionCalls.map((part: any) => {
            const { name, args } = part.functionCall;
            console.log(`[CoBrowsing] Executing tool: ${name}`, args);
            const result = executeTool(name, args ?? {});
            return {
                functionResponse: {
                    name,
                    response: { result },
                },
            };
        });

        // Send tool results back to the model
        await rateLimitGuard();
        response = await chat.sendMessage({ message: functionResponses });
        turns++;
    }

    // Extract the final text response
    const textParts = response.candidates?.[0]?.content?.parts ?? [];
    const finalText = textParts
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((p: any) => p.text)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((p: any) => p.text)
        .join("");

    return finalText || "Done! I've performed the requested action.";
}
