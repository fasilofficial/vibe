"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const database_1 = require("./config/database");
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.get("/", (req, res) => {
  res.send("welcome to VIBE.");
});
app.use("/api/v1/users", UserRoutes_1.default);
(0, database_1.connectDatabase)().then(() => {
  app.listen(port, () => {
    console.log(`[server]: server listening on port ${port}`);
  });
});
