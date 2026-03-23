import express from "express";
import cors from "cors";
import routes from "./routes/routes";

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 ALL ROUTES
app.use("/routes", routes);

// TEST
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});