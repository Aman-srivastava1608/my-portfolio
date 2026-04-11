import { NextResponse } from "next/server";
import { chatbotData } from "@/utils/data/chatbot-data";
import { personalData } from "@/utils/data/personal-data";
import { projectsData } from "@/utils/data/projects-data";
import { skillsData } from "@/utils/data/skills";

export const runtime = "nodejs";

const MODEL = process.env.OPENAI_MODEL || "gpt-5-mini";

function buildPortfolioContext() {
  const projectSummary = projectsData
    .map(
      (project) =>
        `- ${project.name}: ${project.description} Tech: ${project.tools.join(", ")}.`
    )
    .join("\n");

  const allSkills = [...new Set([...chatbotData.primarySkills, ...skillsData])];

  return `
Name: ${personalData.name}
Role: ${personalData.designation}
About: ${personalData.description}
Primary skills: ${chatbotData.primarySkills.join(", ")}
Additional skills: ${allSkills.join(", ")}
Projects:
${projectSummary}
Contact email: ${personalData.email}
GitHub: ${personalData.github}
LinkedIn: ${personalData.linkedIn}
Phone: ${personalData.phone}
Location: ${personalData.address}
Availability: ${chatbotData.availability}
`.trim();
}

function normalizeMessages(messages = []) {
  return messages
    .filter(
      (message) =>
        message &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim()
    )
    .slice(-8)
    .map((message) => ({
      role: message.role,
      content: message.content.trim(),
    }));
}

function extractText(responseJson) {
  if (typeof responseJson?.output_text === "string" && responseJson.output_text.trim()) {
    return responseJson.output_text.trim();
  }

  const textParts = [];

  for (const item of responseJson?.output || []) {
    if (item?.type !== "message") {
      continue;
    }

    for (const contentItem of item.content || []) {
      if (contentItem?.type === "output_text" && contentItem.text) {
        textParts.push(contentItem.text);
      }
    }
  }

  return textParts.join("\n").trim();
}

function getTopSkills() {
  return chatbotData.primarySkills.join(", ");
}

function getProjectHighlights() {
  const featuredProjects = projectsData
    .slice(0, 3)
    .map((project) => project.name)
    .join(", ");

  return `I've worked on ${featuredProjects}.`;
}

function getContactSummary() {
  return `You can reach me at ${personalData.email} or ${personalData.phone}. GitHub: ${personalData.github} and LinkedIn: ${personalData.linkedIn}.`;
}

function getLocalFallbackReply(userMessage) {
  const message = userMessage.toLowerCase();

  if (
    message.includes("contact") ||
    message.includes("email") ||
    message.includes("github") ||
    message.includes("linkedin") ||
    message.includes("phone") ||
    message.includes("call") ||
    message.includes("number")
  ) {
    return getContactSummary();
  }

  if (
    message.includes("skill") ||
    message.includes("tech") ||
    message.includes("stack") ||
    message.includes("javascript") ||
    message.includes("next") ||
    message.includes("node") ||
    message.includes("mysql")
  ) {
    return `My main skills are ${getTopSkills()}. I also work with React, Express, Tailwind CSS, and PostgreSQL.`;
  }

  if (
    message.includes("project") ||
    message.includes("portfolio") ||
    message.includes("food") ||
    message.includes("delivery")
  ) {
    return `${getProjectHighlights()} A recent highlight is my Food Delivery App built with Next.js, Node.js, and MySQL.`;
  }

  if (
    message.includes("hire") ||
    message.includes("available") ||
    message.includes("open to work") ||
    message.includes("job")
  ) {
    return "Yes, I'm open to work and available for web development opportunities.";
  }

  if (
    message.includes("about") ||
    message.includes("who are you") ||
    message.includes("introduce") ||
    message.includes("yourself")
  ) {
    return `I'm Aman Kumar, a web developer focused on building modern, responsive web applications. I enjoy working with ${getTopSkills()}.`;
  }

  return "I'm Aman Kumar, a web developer. I can help with my background, skills, projects, contact details, and job availability.";
}

export async function POST(request) {
  try {
    const { message, messages } = await request.json();

    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid message is required.",
        },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          success: true,
          message: getLocalFallbackReply(message.trim()),
          source: "local-fallback",
        },
        { status: 200 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        reasoning: { effort: "low" },
        max_output_tokens: 180,
        instructions: [
          `You are ${personalData.name}, a ${personalData.designation}, replying in first person inside your portfolio chatbot.`,
          "Keep every answer short, professional, and friendly.",
          "Answer only based on the portfolio details below.",
          "If a question is outside the portfolio, briefly say you can help with questions about Aman Kumar's background, skills, projects, contact details, and work availability.",
          "If the user asks about hiring or availability, say you are open to work.",
          "If the user asks for contact details, share email, phone, GitHub, and LinkedIn.",
          `Portfolio details:\n${buildPortfolioContext()}`,
        ].join("\n\n"),
        input: [
          ...normalizeMessages(messages),
          {
            role: "user",
            content: message.trim(),
          },
        ],
      }),
    });

    const responseJson = await response.json();

    if (!response.ok) {
      const apiError =
        responseJson?.error?.message || "OpenAI request failed. Please try again.";

      if (response.status === 429 || apiError.toLowerCase().includes("quota")) {
        return NextResponse.json(
          {
            success: true,
            message: getLocalFallbackReply(message.trim()),
            source: "local-fallback",
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: apiError,
        },
        { status: response.status }
      );
    }

    const reply = extractText(responseJson);

    if (!reply) {
      return NextResponse.json(
        {
          success: false,
          message: "The chatbot returned an empty response.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: reply,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Chat API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to generate a reply right now. Please try again.",
      },
      { status: 500 }
    );
  }
}
