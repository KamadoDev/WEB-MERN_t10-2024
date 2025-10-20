import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// -----------------------------
// ⚙️ Basic setup
// -----------------------------
app.use(express.json({ limit: "10kb" }));
app.disable("x-powered-by"); // ẩn thông tin framework
app.set("etag", false);

// -----------------------------
// 🌐 CORS cấu hình an toàn
// -----------------------------
const allowedOrigins = [
  "https://runshop.netlify.app",
  "https://runshop-admin.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("❌ Origin not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// -----------------------------
// 🧱 Helmet - Security Headers
// -----------------------------
app.use(helmet.hidePoweredBy());
app.use(helmet.noSniff());
app.use(helmet.frameguard({ action: "deny" })); // chống clickjacking
app.use(helmet.xssFilter());
app.use(hpp());
app.use(mongoSanitize());
app.use(xss());

// ✅ HSTS - Chỉ hoạt động khi HTTPS
app.use(
  helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  })
);

// ✅ Content Security Policy - KHÔNG còn unsafe-inline/eval
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "script-src": [
        "'self'",
        "https://www.googletagmanager.com",
        "https://ssl.google-analytics.com",
      ],
      "style-src": [
        "'self'",
        "https://fonts.googleapis.com",
      ],
      "img-src": [
        "'self'",
        "data:",
        `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/`,
      ],
      "font-src": ["'self'", "https://fonts.gstatic.com"],
      "connect-src": [
        "'self'",
        "https://runshop.netlify.app",
        "https://runshop-admin.netlify.app",
        "http://localhost:4000",
      ],
      "object-src": ["'none'"],
      "frame-ancestors": ["'none'"],
      "form-action": ["'self'"],
      "base-uri": ["'self'"],
      "upgrade-insecure-requests": [],
    },
    reportOnly: false,
  })
);

// -----------------------------
// 🚦 Rate Limit
// -----------------------------
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: "Too many requests, please try again later.",
  })
);

// -----------------------------
// ✅ Route test
// -----------------------------
app.get("/", (req, res) => {
  res.send("✅ CSP, HSTS, XSS, CORS and Headers are fully secured");
});

// -----------------------------
// 🚀 Start server
// -----------------------------
app.listen(process.env.PORT || 4000, () => {
  console.log(`✅ Server running at http://localhost:${process.env.PORT || 4000}`);
});

export default app;
