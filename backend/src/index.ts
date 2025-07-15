import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { supabase } from "./utils/supabase";
import { registerUser } from "./api/auth";
import {
  getBusinesses,
  createBusiness,
  updateBusiness,
  deleteBusiness,
} from "./api/business";

dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Extend req with supabase client
app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

// Routes
//Auth
app.post("/api/register", registerUser);

// Business CRUD
app.get("/api/business", getBusinesses);
app.post("/api/business", createBusiness);
app.patch("/api/business/:id", updateBusiness);
app.delete("/api/business/:id", deleteBusiness);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
