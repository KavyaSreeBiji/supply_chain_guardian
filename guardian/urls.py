from django.urls import path
from . import views

urlpatterns = [
    path('api/inventory', views.get_inventory, name='get_inventory'),
    path('api/inventory/update', views.update_inventory, name='update_inventory'),
    path('api/shipments', views.get_shipments, name='get_shipments'),
    path('api/market', views.get_market_trends, name='get_market_trends'),
    path('api/chat', views.chat, name='chat'),
]
