import os
from django.core.asgi import get_asgi_application
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import crypto_app.routing

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "crypto_app.settings")

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            crypto_app.routing.websocket_urlpatterns
        )
    ),
})
