import { Router } from "express";
import { index } from "../controllers/index.rotes.js";

const router = Router();

router.get("/index", index);

// router.get("/ping", ping);

export default router;
