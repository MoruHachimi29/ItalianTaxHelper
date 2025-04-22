import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User } from "@shared/schema";

// Estende il namespace Express per includere l'utente autenticato
declare global {
  namespace Express {
    // Definisce l'interfaccia utente per Express
    interface User {
      id: number;
      username: string;
      password: string;
      email?: string | null;
      fullName?: string | null;
      createdAt?: Date;
    }
  }
}

const scryptAsync = promisify(scrypt);

// Funzione per hashing delle password
async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// Funzione per confrontare le password
async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Configura l'autenticazione
export function setupAuth(app: Express) {
  // Configurazione della sessione
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "f24editabile-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 settimana
      sameSite: "lax"
    }
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Strategia di autenticazione locale
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    })
  );

  // Serializzazione dell'utente nella sessione
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserializzazione dell'utente dalla sessione
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Rotte per l'autenticazione
  // Registrazione
  app.post("/api/register", async (req, res, next) => {
    try {
      // Controlla se l'utente esiste già
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username già in uso" });
      }

      // Crea un nuovo utente con password hashata
      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });

      // Login automatico dopo la registrazione
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json({
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName
        });
      });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ message: "Errore durante la registrazione" });
    }
  });

  // Login
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: "Credenziali non valide" });
      }
      req.login(user, (err: any) => {
        if (err) return next(err);
        res.status(200).json({
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName
        });
      });
    })(req, res, next);
  });

  // Logout
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.status(200).json({ message: "Logout effettuato con successo" });
    });
  });

  // Info utente corrente
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Non autenticato" });
    }
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Utente non trovato" });
    }
    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName
    });
  });
}