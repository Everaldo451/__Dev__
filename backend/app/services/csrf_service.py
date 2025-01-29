from flask_wtf.csrf import CSRFProtect
from flask_cors import CORS

cors = CORS(origins="http://localhost:3000", supports_credentials=True)
CSRF = CSRFProtect()