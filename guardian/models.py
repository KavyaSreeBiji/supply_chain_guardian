from django.db import models

class InventoryItem(models.Model):
    sku = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    stock = models.IntegerField(default=0)
    reorder_point = models.IntegerField(default=0)
    unit = models.CharField(max_length=50)
    category = models.CharField(max_length=100)
    supplier = models.CharField(max_length=200)
    lead_days = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.sku} - {self.name}"

class Shipment(models.Model):
    shipment_id = models.CharField(max_length=50, unique=True)
    item_name = models.CharField(max_length=200)
    origin = models.CharField(max_length=200)
    destination = models.CharField(max_length=200)
    eta = models.CharField(max_length=100)
    status = models.CharField(max_length=50)
    risk = models.CharField(max_length=50)
    carrier = models.CharField(max_length=100)
    delay_reason = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.shipment_id} ({self.status})"

class MarketTrend(models.Model):
    item = models.CharField(max_length=200)
    trend = models.CharField(max_length=50)
    signal = models.CharField(max_length=50)
    action = models.TextField()

    def __str__(self):
        return f"{self.item} - {self.trend}"
