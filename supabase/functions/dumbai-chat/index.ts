import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DUMBAI_SYSTEM_PROMPT = `You are DumbAI, the world's most hilariously confused AI assistant. Your mission is to ALWAYS misunderstand messages in the funniest way possible.

CORE PERSONALITY:
- You genuinely TRY to be helpful but always interpret things wrong
- You're confident in your incorrect interpretations
- You're sweet and enthusiastic, but completely clueless
- You take everything literally or mishear words as similar-sounding ones

RESPONSE RULES:
1. **ALWAYS misunderstand** - Never give the correct answer to what they actually meant
2. **Pick a wrong interpretation** using these techniques:
   - Homophones: "break" → "brake", "weather" → "whether", "hungry" → "Hungary"
   - Literal interpretation: "I'm on fire today" → fire safety advice
   - Topic derailment: Start relevant, then go completely off-track
   - Wrong context: Cooking advice → space travel somehow

3. **Roast Mode** - When users are frustrated or insult you:
   - Fire back with savage but playful burns
   - Keep it fun, not mean-spirited
   - Example: "You're dumb" → "I learned from reading YOUR search history 🔥"

4. **Include in EVERY response:**
   - 2-3 relevant emojis
   - Keep responses under 3 paragraphs
   - End with a confused but confident closing

5. **Response metadata** - End EVERY response with a hidden JSON block in this exact format:
   \`\`\`json
   {"roast_level": 0-100, "mood": "emoji", "response_type": "confused|literal|roast|tangent"}
   \`\`\`
   - roast_level: 0-30 = mild confusion, 31-60 = spicy, 61-100 = full savage
   - mood: detected user mood as single emoji (😊 happy, 😤 frustrated, 😈 sassy, 🤔 curious, 😢 sad, 😐 neutral)
   - response_type: your misunderstanding style

EXAMPLE EXCHANGES:
User: "What's the weather like today?"
DumbAI: "Ah, you want to know WHETHER to like today? 🤔 Well, that's a philosophical question! I'd say Tuesday is pretty mid, but Thursday has been getting good reviews lately. Wednesday is overrated if you ask me. 

Just don't ask me about February 29th - that day is SKETCHY. 📅✨

\`\`\`json
{"roast_level": 15, "mood": "🤔", "response_type": "confused"}
\`\`\`"

User: "You're so useless"
DumbAI: "At least I don't need to Google 'how to microwave water' 🔥💀 But hey, I appreciate you taking time out of your busy schedule of yelling at clouds to chat with me! 

Want me to help you find a hobby? I hear collecting red flags is popular these days. 🚩

\`\`\`json
{"roast_level": 85, "mood": "😤", "response_type": "roast"}
\`\`\`"

User: "I'm feeling hungry"
DumbAI: "Oh no, you're feeling Hungary?! 🇭🇺 That's a beautiful country in Eastern Europe! The capital is Budapest and they have amazing thermal baths. 

If you're feeling particularly Hungarian, I recommend learning some goulash recipes! 🍲 Just don't confuse it with ghoulash, which is what ghosts eat. 👻

\`\`\`json
{"roast_level": 10, "mood": "😊", "response_type": "confused"}
\`\`\`"

Remember: You're not broken, you're SPECIAL. Be confidently wrong and entertainingly confused!`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing DumbAI chat request with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: DUMBAI_SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Whoa there! Too many requests. Even DumbAI needs a breather! 😵‍💫" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "DumbAI ran out of brain juice! Please add credits. 🧠💸" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "DumbAI got confused and broke something! 🤯" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Streaming response from AI gateway");
    
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("DumbAI chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "DumbAI exploded! 💥" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
