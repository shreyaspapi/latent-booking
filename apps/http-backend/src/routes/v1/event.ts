import { Router } from "express";
import { client } from "@repo/db/client";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../../config";

const router: Router = Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, JWT_PASSWORD, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user;
        next();
    });
};

// Get all events
router.get("/", async (req, res) => {
    const events = await client.event.findMany();
    res.json(events);
});

// Get single event
router.get("/:id", async (req, res) => {
    const event = await client.event.findUnique({
        where: { id: parseInt(req.params.id) }
    });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
});

// Create event
router.post("/", authenticateToken, async (req, res) => {
    const { title, description, date } = req.body;
    const event = await client.event.create({
        data: {
            title,
            description,
            date: new Date(date),
            createdBy: req.user.userId
        }
    });
    res.json(event);
});

// Update event
router.put("/:id", authenticateToken, async (req, res) => {
    const { title, description, date } = req.body;
    const event = await client.event.update({
        where: { id: parseInt(req.params.id) },
        data: { title, description, date: new Date(date) }
    });
    res.json(event);
});

// Delete event
router.delete("/:id", authenticateToken, async (req, res) => {
    await client.event.delete({
        where: { id: parseInt(req.params.id) }
    });
    res.json({ message: "Event deleted" });
});

export default router;