import { Router } from "express";
import userRouter from "./user";
import eventRouter from "./event";

const router: Router = Router();

router.use("/user", userRouter);
router.use("/events", eventRouter);

export default router;