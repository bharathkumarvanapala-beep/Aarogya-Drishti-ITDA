import asyncio
import json
import os
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from demo_api import require_backend, status
from starlette.requests import Request
from starlette.responses import JSONResponse

async def request(headers=None):
    async def next_handler(_):
        return JSONResponse(status())
    response = await require_backend(Request({'type':'http','headers':headers or []}), next_handler)
    return response.status_code, response.body

class GatewayTest(unittest.TestCase):
    def test_hosted_requires_configuration(self):
        with patch.dict(os.environ, {'REQUIRE_AI_AUTH':'true'},clear=True):
            self.assertEqual(asyncio.run(request())[0],503)
    def test_rejects_missing_or_wrong_token(self):
        with patch.dict(os.environ, {'AI_SERVICE_TOKEN':'test-token'},clear=True):
            self.assertEqual(asyncio.run(request())[0],401)
            self.assertEqual(asyncio.run(request([(b'x-ai-service-token',b'wrong')]))[0],401)
    def test_authenticated_status_is_honest_about_model(self):
        with patch.dict(os.environ, {'AI_SERVICE_TOKEN':'test-token'},clear=True):
            status,body=asyncio.run(request([(b'x-ai-service-token',b'test-token')]))
            self.assertEqual(status,200)
            self.assertIs(json.loads(body)['modelLoaded'],False)

if __name__=='__main__': unittest.main()
