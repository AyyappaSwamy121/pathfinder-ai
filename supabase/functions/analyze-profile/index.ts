import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { natural_language_input } = await req.json();

    const apiKey = Deno.env.get("OPENAI_API_KEY") || Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          target_role: "AI Engineer",
          experience_level: "Intermediate",
          skills: [
            { name: "Python Programming", level: "Intermediate" },
            { name: "SQL & Relational Databases", level: "Intermediate" },
          ],
          interests: ["Artificial Intelligence"],
          weekly_hours: 8,
          timeline_months: 6,
          learning_preference: "Project Based",
          extracted_summary: "Extracted Python and SQL experience targeting AI Engineer goal.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are an AI Profile Extractor for PathFinder AI. Analyze the user's natural language input and output ONLY a valid JSON object matching this schema:
{
  "target_role": "AI Engineer" | "Data Scientist" | "Full Stack Developer" | "Data Analyst" | "Cloud Engineer" | "Cybersecurity Engineer",
  "experience_level": "Beginner" | "Intermediate" | "Advanced",
  "skills": [{"name": "Python Programming", "level": "Beginner"|"Intermediate"|"Advanced"}],
  "interests": ["Artificial Intelligence"],
  "weekly_hours": 8,
  "timeline_months": 6,
  "learning_preference": "Project Based" | "Video" | "Reading",
  "extracted_summary": "Short explanation of findings"
}`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: natural_language_input },
        ],
        temperature: 0.2,
      }),
    });

    const data = await res.json();
    const rawContent = data?.choices?.[0]?.message?.content || "";
    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      parsed = {
        target_role: "AI Engineer",
        experience_level: "Intermediate",
        skills: [{ name: "Python Programming", level: "Intermediate" }],
        interests: ["AI"],
        weekly_hours: 8,
        timeline_months: 6,
        learning_preference: "Project Based",
        extracted_summary: natural_language_input,
      };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        target_role: "AI Engineer",
        experience_level: "Intermediate",
        skills: [{ name: "Python Programming", level: "Intermediate" }],
        interests: ["AI"],
        weekly_hours: 8,
        timeline_months: 6,
        learning_preference: "Project Based",
        extracted_summary: "Offline fallback summary",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
