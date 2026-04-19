import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supply_chain.settings')
django.setup()

from guardian.models import InventoryItem, Shipment, MarketTrend

INVENTORY = [
  { "id": "SKU-001", "name": "Bottled Water (500ml)", "stock": 320, "reorder": 500, "unit": "bottles", "category": "Beverages", "supplier": "AquaPure Ltd.", "leadDays": 2 },
  { "id": "SKU-002", "name": "A4 Printer Paper", "stock": 40, "reorder": 100, "unit": "reams", "category": "Stationery", "supplier": "PaperWorld Inc.", "leadDays": 3 },
  { "id": "SKU-003", "name": "Coffee Beans (1kg)", "stock": 5, "reorder": 50, "unit": "bags", "category": "Beverages", "supplier": "BeanHouse Co.", "leadDays": 5 },
  { "id": "SKU-004", "name": "Office Chairs", "stock": 80, "reorder": 30, "unit": "units", "category": "Furniture", "supplier": "ErgoComfort EU", "leadDays": 14 },
  { "id": "SKU-005", "name": "USB-C Cables", "stock": 15, "reorder": 60, "unit": "units", "category": "Electronics", "supplier": "CableKing HK", "leadDays": 7 },
  { "id": "SKU-006", "name": "Hand Sanitizer (250ml)", "stock": 200, "reorder": 150, "unit": "bottles", "category": "Hygiene", "supplier": "CleanGuard SA", "leadDays": 4 },
  { "id": "SKU-007", "name": "Ballpoint Pens (Box of 50)", "stock": 8, "reorder": 40, "unit": "boxes", "category": "Stationery", "supplier": "WriteRight DE", "leadDays": 3 },
  { "id": "SKU-008", "name": "Laptop Bags (15\")", "stock": 55, "reorder": 25, "unit": "units", "category": "Accessories", "supplier": "BagIt Pro", "leadDays": 10 },
]

SHIPMENTS = [
  { "id": "SHP-4821", "item": "SKU-003 Coffee Beans", "origin": "Nairobi, KE", "dest": "London, UK", "eta": "2 days", "status": "delayed", "risk": "high", "carrier": "AirFreight Express", "delay": "Weather: Heavy storms over Arabian Sea" },
  { "id": "SHP-4819", "item": "SKU-002 Printer Paper", "origin": "Helsinki, FI", "dest": "New York, US", "eta": "5 days", "status": "on-track", "risk": "low", "carrier": "OceanLine Cargo", "delay": None },
  { "id": "SHP-4815", "item": "SKU-007 Ballpoint Pens", "origin": "Shanghai, CN", "dest": "Sydney, AU", "eta": "3 days", "status": "at-risk", "risk": "medium", "carrier": "SkyFreight", "delay": "Port congestion at Shanghai" },
  { "id": "SHP-4810", "item": "SKU-005 USB-C Cables", "origin": "Shenzhen, CN", "dest": "Chicago, US", "eta": "1 day", "status": "on-track", "risk": "low", "carrier": "ExpressLine", "delay": None },
]

MARKET_TRENDS = [
  { "item": "Coffee Beans", "trend": "+18%", "signal": "high", "action": "Drought in Brazil pushing prices up — stock up now" },
  { "item": "Printer Paper", "trend": "-9%", "signal": "buy", "action": "Prices dropped — good time for bulk purchase" },
  { "item": "USB-C Cables", "trend": "+12%", "signal": "monitor", "action": "Chip shortage increasing accessory costs" },
  { "item": "Office Chairs", "trend": "+5%", "signal": "monitor", "action": "Demand rising with return-to-office trend" },
]

print("Clearing existing data...")
InventoryItem.objects.all().delete()
Shipment.objects.all().delete()
MarketTrend.objects.all().delete()

print("Seeding Inventory...")
for item in INVENTORY:
    InventoryItem.objects.create(
        sku=item['id'], name=item['name'], stock=item['stock'],
        reorder_point=item['reorder'], unit=item['unit'],
        category=item['category'], supplier=item['supplier'],
        lead_days=item['leadDays']
    )

print("Seeding Shipments...")
for s in SHIPMENTS:
    Shipment.objects.create(
        shipment_id=s['id'], item_name=s['item'], origin=s['origin'],
        destination=s['dest'], eta=s['eta'], status=s['status'],
        risk=s['risk'], carrier=s['carrier'], delay_reason=s.get('delay')
    )

print("Seeding Market Trends...")
for m in MARKET_TRENDS:
    MarketTrend.objects.create(
        item=m['item'], trend=m['trend'], signal=m['signal'], action=m['action']
    )

print("Seed complete with everyday inventory!")
