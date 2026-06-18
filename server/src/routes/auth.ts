import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { registerSchema } from "../schemas/auth.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    // Validate request body
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }
    const { email, password } = parsed.data;

    // Check that the email is not already taken
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: { email, passwordHash },
    });

    // Issue a token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    // Return token + user
    return res.status(201).json({
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;