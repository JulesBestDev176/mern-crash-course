import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import productRoute from "./routes/product.route.js";
import path from "path";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

const helmet = require("helmet");

// Utilisation de helmet avec des directives personnalisées
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-eval'"], // Si nécessaire
        imgSrc: ["'self'", "data:"],
        // Ajoute d'autres directives si besoin
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
