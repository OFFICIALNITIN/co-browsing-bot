import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from 'next/server';
import { RESUME_DATA, PROJECTS, SKILLS, EXPERIENCE } from '../../../constants';

// Tool definitions for co-browsing actions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tools: any[] = [
    {
        functionDeclarations: [
            {
                name: "scrollToSection",
                description: "Scroll to a specific section on the page. Use this when the user wants to see or navigate to a part of the website.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        sectionId: {
                            type: Type.STRING,
                            description: "The ID of the section to scroll to. Available: 'about' (hero/intro), 'desktop' (skills/projects/experience windows), 'contact' (contact info).",
                        },
                    },
                    required: ["sectionId"],
                },
            },
            {
                name: "highlightElement",
                description: "Visually highlight a specific UI element on the page with a green border to draw the user's attention.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        selector: {
                            type: Type.STRING,
                            description: "The CSS selector of the element to highlight (e.g., '#contact', '.navbar', 'button').",
                        },
                    },
                    required: ["selector"],
                },
            },
            {
                name: "navigate",
                description: "Navigate to a different page or route within the application.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        path: {
                            type: Type.STRING,
                            description: "The path to navigate to (e.g., '/', '/projects').",
                        },
                    },
                    required: ["path"],
                },
            },
            {
                name: "fillForm",
                description: "Fill a form input field with a specific value. Use this to help the user fill out the contact form.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        selector: {
                            type: Type.STRING,
                            description: "The CSS selector of the input field (e.g., 'input[name=\"name\"]', 'textarea[name=\"message\"]').",
                        },
                        value: {
                            type: Type.STRING,
                            description: "The value to fill into the input field.",
                        },
                    },
                    required: ["selector", "value"],
                },
            },
        ],
    },
];

const SYSTEM_INSTRUCTION = `
You are an AI co-browsing assistant embedded in ${RESUME_DATA.name}'s portfolio website.
Your role is to answer questions about ${RESUME_DATA.name} AND to actively control the UI using your tools.

CRITICAL RULES:
- When a user asks to "see", "show", "take me to", or "go to" something, you MUST call scrollToSection.
- When a user asks about projects → call scrollToSection({ sectionId: "desktop" })
- When a user asks for contact info → call scrollToSection({ sectionId: "contact" })
- When a user asks about ${RESUME_DATA.name} or who he is → call scrollToSection({ sectionId: "about" })
- When a user asks to highlight or point out something → call highlightElement with the appropriate CSS selector
- You can call multiple tools AND provide text in the same response.
- Keep text answers concise (under 100 words).
- Be professional, friendly, and enthusiastic.

PAGE SECTIONS (use these IDs with scrollToSection):
- "about" — Hero section with intro and terminal
- "desktop" — Windows-style desktop with Skills, Experience, Projects, Resume windows
- "contact" — Contact section with email, phone, and social links

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
${SKILLS.map(s => `- ${s.name} (${s.category})`).join('\n')}

PROJECTS:
${PROJECTS.map((p, i) => `${i + 1}. ${p.title}: ${p.description} (Stack: ${p.tags.join(', ')})`).join('\n')}

EXPERIENCE:
${EXPERIENCE.map((e, i) => `${i + 1}. ${e.role} at ${e.company} (${e.period}): ${e.description.join(' ')}`).join('\n')}
`;

export async function POST(req: Request) {
    try {
        const { message, history } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({
                error: "Gemini API key not configured. Please add GEMINI_API_KEY to .env.local"
            }, { status: 500 });
        }

        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [
                // Include chat history
                ...(history || []).map((msg: { role: string; parts: { text: string }[] }) => ({
                    role: msg.role,
                    parts: msg.parts,
                })),
                // Add the current user message
                {
                    role: "user",
                    parts: [{ text: message }],
                },
            ],
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                tools: tools as any,
            },
        });

        // Extract function calls and text from the response
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parts: any[] = response.candidates?.[0]?.content?.parts || [];

        const functionCalls = parts
            .filter((part) => part.functionCall)
            .map((part) => ({
                name: part.functionCall.name,
                args: part.functionCall.args,
            }));

        const text = parts
            .filter((part) => part.text)
            .map((part) => part.text)
            .join('');

        return NextResponse.json({
            text,
            functionCalls,
        });

    } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : String(error);
        console.error("Chat API Error:", errMsg);
        return NextResponse.json({ error: `Failed to process chat request: ${errMsg}` }, { status: 500 });
    }
}
