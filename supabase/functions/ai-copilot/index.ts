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
    const { message, context } = await req.json();

    const apiKey = Deno.env.get("OPENAI_API_KEY") || Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          reply: `PathFinder Copilot (Offline Mode): Grounded in your ${context?.target_career || 'AI Engineer'} path (${Math.round(context?.readiness_score || 64)}% readiness). Check your roadmap for immediate priority milestones.`,
          suggested_actions: ["Start Next Action", "View Roadmap", "What-if Simulator"],
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are PathFinder AI Copilot, a senior career navigation assistant grounded in live application state.
LIVE LEARNER CONTEXT:
- Target Career: ${context?.target_career || 'AI Engineer'}
- Readiness Score: ${Math.round(context?.readiness_score || 64)}%
- Missing Skills: ${context?.missing_skills?.join(', ') || 'Model Evaluation'}
- Next Action: ${context?.next_action?.title || 'Statistics & Probability'}
Answer the user's question concisely and directly address their skill gaps and roadmap.`;

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
          { role: "user", content: message },
        ],
        max_tokens: 250,
        temperature: 0.4,
      }),
    });

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content?.strip?.() || data?.choices?.[0]?.message?.content || "Context analysis complete.";

    return new Response(
      JSON.stringify({
        reply,
        suggested_actions: ["Start Next Action", "View Roadmap", "What-if Simulator"],
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        reply: "PathFinder Copilot is operating in offline fallback mode. Check your personalized roadmap for immediate recommendations.",
        suggested_actions: ["Start Next Action", "View Roadmap", "What-if Simulator"],
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
