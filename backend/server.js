import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import productRoute from "./routes/product.route.js";
import path from "path";
import helmet from "helmet";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

// Utilisation de helmet avec des directives personnalisées
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], // Autorise les ressources provenant de ton domaine
        scriptSrc: ["'self'", "'unsafe-eval'"], // Évite d'utiliser 'unsafe-eval' si possible
        imgSrc: ["'self'", "data:"], // Permet les images locales et celles encodées en base64
        styleSrc: ["'self'", "'unsafe-inline'"], // Autorise le style inline si nécessaire
        connectSrc: ["'self'", "https://example.com"], // Autorise les connexions AJAX vers ton API
        fontSrc: ["'self'", "https://fonts.googleapis.com"], // Permet de charger des polices externes
        frameAncestors: ["'self'"], // Empêche le framing par d'autres sites
        upgradeInsecureRequests: [], // Force l'utilisation de HTTPS
      },
    },
  })
);

app.use(express.json()); // allows us to accept JSON data in the body

app.use("/api/products", productRoute);

if (process.env.Node_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(5000, () => {
  connectDB();
  console.log("Server started at http://localhost:" + PORT);
});
