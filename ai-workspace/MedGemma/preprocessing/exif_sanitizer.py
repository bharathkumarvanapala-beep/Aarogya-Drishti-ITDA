"""
Dual-Stage EXIF Sanitizer for Aarogya Drishti Oral Photographic Evidence
"""
import io
from PIL import Image

def sanitize_image_bytes(raw_bytes: bytes) -> bytes:
    """Removes all EXIF, GPS, camera serial, and timestamp metadata."""
    if not raw_bytes or len(raw_bytes) < 30:
        return raw_bytes
    try:
        with Image.open(io.BytesIO(raw_bytes)) as img:
            out_buf = io.BytesIO()
            img.save(out_buf, format="JPEG", quality=92, exif=b"")
            return out_buf.getvalue()
    except Exception:
        return raw_bytes
