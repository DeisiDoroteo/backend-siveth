import { Router } from "express";
import { index } from "../controllers/index.rotes.js";
import { ping } from "../controllers/index.rotes.js";

const router = Router();

router.get("/", index);
router.get("/ping", ping);

export default router;
