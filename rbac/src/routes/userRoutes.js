import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Define your user routes here
router.get("/admin", verifyToken, authorizeRoles("admin"), (req, res) => {
    res.json({ message: "Welcome to the admin page!" });
});

router.get("/manager", verifyToken, authorizeRoles("admin", "manager"), (req, res) => {
    res.json({ message: "Welcome to the manager page!" });
});

router.get("/user", verifyToken, authorizeRoles("admin", "manager", "user"), (req, res) => {
    res.json({ message: "Welcome to the user page!" });
});

export default router;
