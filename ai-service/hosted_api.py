"""One Python host for quality checks and the authenticated research demonstration."""
from main import app
from demo_api import app as research_app

app.mount('/research', research_app)
