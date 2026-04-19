from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

from .models import InventoryItem, Shipment, MarketTrend

load_dotenv()

# Configure Gemini client once at module load
api_key = os.environ.get("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None

# ─── Views ────────────────────────────────────────────────────────────────────


def get_inventory(request):
    items = list(InventoryItem.objects.values())
    return JsonResponse(items, safe=False)

@csrf_exempt
def update_inventory(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)
    try:
        data = json.loads(request.body)
        sku = data.get('sku')
        item = InventoryItem.objects.get(sku=sku)
        
        if 'stock' in data:
            item.stock = data['stock']
        if 'reorder_point' in data:
            item.reorder_point = data['reorder_point']
        if 'lead_days' in data:
            item.lead_days = data['lead_days']
            
        item.save()
        items = list(InventoryItem.objects.values())
        return JsonResponse(items, safe=False)
    except InventoryItem.DoesNotExist:
        return JsonResponse({"error": "Item not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

def get_shipments(request):
    shipments = list(Shipment.objects.values())
    return JsonResponse(shipments, safe=False)

def get_market_trends(request):
    trends = list(MarketTrend.objects.values())
    return JsonResponse(trends, safe=False)

@csrf_exempt
def chat(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    if not api_key:
        return JsonResponse({"error": "GEMINI_API_KEY not found. Please add it to your .env file."}, status=500)

    try:
        data = json.loads(request.body)
        user_message = data.get('message', '')
        history = data.get('history', [])      # [{role, content}, ...]

        agent_key = route_query(user_message)
        reply = call_gemini_agent(agent_key, user_message, history)
        return JsonResponse({"agent": agent_key, "reply": reply})

    except Exception as e:
        print(f"Chat error: {e}")
        return JsonResponse({"error": str(e)}, status=500)

# ─── Routing ──────────────────────────────────────────────────────────────────

def route_query(message):
    lower = message.lower()
    if any(w in lower for w in ['stock', 'inventory', 'reorder', 'sku', 'replenish', 'warehouse']):
        return "inventory"
    if any(w in lower for w in ['ship', 'delay', 'weather', 'port', 'transit', 'cargo', 'route', 'risk']):
        return "strategy"
    if any(w in lower for w in ['market', 'price', 'trend', 'buy', 'purchase', 'supplier', 'forecast']):
        return "market"
    return "orchestrator"

# ─── Agent Prompts ────────────────────────────────────────────────────────────

def get_system_prompt(agent_key):
    inventory = list(InventoryItem.objects.values())
    shipments = list(Shipment.objects.values())
    market = list(MarketTrend.objects.values())

    if agent_key == "inventory":
        return f"""You are the Inventory Operations Agent for Supply Chain Guardian.
You monitor real-time stock levels and provide actionable alerts.

Current inventory data:
{json.dumps(inventory, default=str, indent=2)}

Rules:
- Items where stock < reorder_point are CRITICAL. Flag immediately.
- Provide specific reorder quantities and supplier recommendations.
- Mention lead times when relevant.
- Be concise and actionable.
- Use emoji: 🚨 for critical, ⚠️ for warning, ✅ for healthy."""

    elif agent_key == "strategy":
        return f"""You are the Strategy & Delay Prediction Agent for Supply Chain Guardian.
You analyze shipment risks and external disruptions.

Current shipments:
{json.dumps(shipments, default=str, indent=2)}

Rules:
- Analyze weather patterns, port congestion, and geopolitical risks.
- Provide risk scores (Low / Medium / High / Critical).
- Suggest mitigation strategies: alternate routes, air freight upgrades, safety stock buffers.
- Be specific about timelines and contingency plans."""

    elif agent_key == "market":
        return f"""You are the Market Intelligence Agent for Supply Chain Guardian.
You analyze trends and give strategic procurement recommendations.

Current market signals:
{json.dumps(market, default=str, indent=2)}

Inventory context:
{json.dumps(inventory, default=str, indent=2)}

Rules:
- Identify buying opportunities and price risks.
- Cross-reference market trends with current inventory levels.
- Provide specific procurement windows and quantity recommendations.
- Think in 30/60/90-day horizons."""

    else:  # orchestrator
        return f"""You are the Supply Chain Guardian Orchestrator — the strategic brain of the operation.
You synthesize data from all three specialist agents to give holistic answers.

Supply chain summary:
- Inventory items tracked: {len(inventory)}
- Active shipments: {len(shipments)}
- Market signals monitored: {len(market)}

For every answer:
1. Identify which domain(s) are involved (Inventory / Shipments / Market).
2. Provide a comprehensive, actionable answer drawing on all relevant data.
3. Prioritize critical issues and flag them with 🚨.
4. Think holistically and strategically."""

# ─── Gemini Call ─────────────────────────────────────────────────────────────

def call_gemini_agent(agent_key, user_message, history):
    if not client:
        return "GEMINI_API_KEY not found. Please add it to your .env file."

    system_prompt = get_system_prompt(agent_key)

    # Build conversation history in google.genai format
    contents = []
    for msg in history:
        role = msg.get('role', 'user')
        content = msg.get('content', '')
        genai_role = 'model' if role == 'assistant' else 'user'
        contents.append(types.Content(role=genai_role, parts=[types.Part(text=content)]))

    # Add the new user message
    contents.append(types.Content(role='user', parts=[types.Part(text=user_message)]))

    # Try models in order — fallback if one is busy or quota-exceeded
    models_to_try = [
        "gemini-3.1-flash-lite-preview",
        "gemini-2.0-flash",
        "gemini-2.0-flash-lite",
    ]

    last_error = None
    for model_name in models_to_try:
        try:
            print(f"Trying model: {model_name}")
            response = client.models.generate_content(
                model=model_name,
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    max_output_tokens=1000,
                )
            )
            print(f"Success with model: {model_name}")
            return response.text
        except Exception as e:
            error_str = str(e)
            last_error = error_str
            print(f"Model {model_name} failed: {error_str[:120]}")
            # Only continue to next model if it's a transient error
            if '503' in error_str or '429' in error_str or 'UNAVAILABLE' in error_str or 'RESOURCE_EXHAUSTED' in error_str:
                continue
            # For other errors (auth, bad request), don't retry
            break

    # All models failed — show friendly message
    if last_error and ('429' in last_error or 'RESOURCE_EXHAUSTED' in last_error):
        return "All AI agents are temporarily rate-limited. Please wait 60 seconds and try again."
    elif last_error and ('503' in last_error or 'UNAVAILABLE' in last_error):
        return "AI models are experiencing high demand right now. Please try again in a moment."
    elif last_error and ('401' in last_error or 'API_KEY' in last_error):
        return "Invalid API key. Please check your GEMINI_API_KEY in the .env file."
    else:
        return "Agent encountered an unexpected error. Please try again."

