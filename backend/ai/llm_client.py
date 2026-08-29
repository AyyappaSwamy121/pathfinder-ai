import json
import logging
from typing import Dict, Any, Optional
from backend.config import settings
from backend.ai.fallback_engine import OfflineFallbackEngine

logger = logging.getLogger("pathfinder.ai")

class LLMClient:
    """Unified LLM abstraction layer with strict schema handling and offline fallback capability."""

    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY or settings.GEMINI_API_KEY
        self.provider = "openai" if settings.OPENAI_API_KEY else ("gemini" if settings.GEMINI_API_KEY else "offline")

    def parse_learner_profile(self, natural_language_input: str) -> Dict[str, Any]:
        """Extract structured JSON profile from conversational onboarding text."""
        if not self.api_key or self.provider == "offline":
            logger.info("Using offline fallback engine for profile parsing.")
            return OfflineFallbackEngine.extract_profile_from_text(natural_language_input)

        try:
            import openai
            client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)

            system_prompt = (
                "You are an AI Profile Extractor for PathFinder AI. Analyze the user's natural language input "
                "and output ONLY a valid JSON object matching the following JSON schema:\n"
                "{\n"
                '  "target_role": "AI Engineer" | "Data Scientist" | "Full Stack Developer" | "Data Analyst" | "Cloud Engineer" | "Cybersecurity Engineer",\n'
                '  "experience_level": "Beginner" | "Intermediate" | "Advanced",\n'
                '  "skills": [{"name": "Python Programming", "level": "Beginner"|"Intermediate"|"Advanced"}],\n'
                '  "interests": ["Artificial Intelligence"],\n'
                '  "weekly_hours": 8,\n'
                '  "timeline_months": 6,\n'
                '  "learning_preference": "Project Based" | "Video" | "Reading",\n'
                '  "extracted_summary": "Short explanation of findings"\n'
                "}\n"
                "Do NOT include markdown block markers (e.g. ```json). Return raw JSON string."
            )

            response = client.chat.completions.create(
                model=settings.AI_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": natural_language_input}
                ],
                temperature=0.2,
                response_format={"type": "json_object"} if hasattr(client.chat.completions, "create") else None
            )

            raw_text = response.choices[0].message.content.strip()
            parsed = json.loads(raw_text)
            return parsed
        except Exception as e:
            logger.warning(f"LLM Profile Parsing failed ({e}). Reverting to offline fallback.")
            return OfflineFallbackEngine.extract_profile_from_text(natural_language_input)

    def generate_explanation(self, skill_name: str, status: str, prereqs: list, target_career: str) -> str:
        """Generate explainable recommendation reason."""
        if not self.api_key or self.provider == "offline":
            return OfflineFallbackEngine.generate_explanation(skill_name, status, prereqs, target_career)

        try:
            import openai
            client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
            prompt = (
                f"Explain why '{skill_name}' (status: {status}) is recommended next for a learner striving to become an {target_career}. "
                f"Prerequisites satisfied: {', '.join(prereqs) if prereqs else 'None'}. "
                f"Keep explanation under 30 words, reference career requirements, prerequisites, and skill progression."
            )

            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=60,
                temperature=0.3
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            logger.warning(f"LLM Explanation failed ({e}). Using fallback.")
            return OfflineFallbackEngine.generate_explanation(skill_name, status, prereqs, target_career)

    def copilot_chat(self, user_message: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Grounded Copilot response with RAG-lite context state."""
        if not self.api_key or self.provider == "offline":
            return OfflineFallbackEngine.generate_copilot_response(user_message, context)

        try:
            import openai
            client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
            system_prompt = (
                f"You are PathFinder AI Copilot, a senior career navigation assistant grounded in live application state.\n"
                f"LIVE LEARNER CONTEXT:\n"
                f"- Target Career: {context.get('target_career', 'AI Engineer')}\n"
                f"- Readiness Score: {context.get('readiness_score', 64.0):.1f}%\n"
                f"- Missing Skills: {', '.join(context.get('missing_skills', []))}\n"
                f"- Next Action: {context.get('next_action', {}).get('title', 'Model Evaluation')}\n"
                f"Answer the user's question concisely, directly addressing their current skill gaps and roadmap."
            )

            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=250,
                temperature=0.4
            )
            reply = response.choices[0].message.content.strip()
            return {
                "reply": reply,
                "suggested_actions": ["Start Next Action", "View Roadmap", "What-if Simulator"]
            }
        except Exception as e:
            logger.warning(f"LLM Copilot Chat failed ({e}). Reverting to fallback.")
            return OfflineFallbackEngine.generate_copilot_response(user_message, context)

llm_client = LLMClient()
