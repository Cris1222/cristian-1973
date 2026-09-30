import express from "express";
import cors from "cors";
import snailPayRoutes from "./routes/snailPay.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/snailpay", snailPayRoutes);

app.get("/", (_req, res) => {
  res.json({
    message: "SnailPay API funcionando",
  });
});

export default app;