import time
import functools
import logging
from typing import Callable
from ninja import NinjaAPI
from django.http import HttpRequest

logger = logging.getLogger(__name__)

class TimingMiddleware:
    """
    ASGI/WSGI middleware that measures response time for every request
    and injects an X-Response-Time header into the response.

    Register in settings.py:
        MIDDLEWARE = [
            ...
            "utils.timing.TimingMiddleware",
        ]
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request: HttpRequest):
        start = time.perf_counter()
        response = self.get_response(request)
        elapsed_ms = (time.perf_counter() - start) * 1000

        response["X-Response-Time"] = f"{elapsed_ms:.2f}ms"
        logger.info(
            f"[TIMING] {request.method} {request.path} — {elapsed_ms:.2f}ms"
        )
        return response