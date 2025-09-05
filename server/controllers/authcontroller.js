const pool = require("../models/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { email, mdp } = req.body;

    // Vérifier si l'utilisateur existe
    const [rows] = await pool.query("SELECT * FROM user WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(404).json({ msg: "Utilisateur non trouvé" });
    }

    const user = rows[0];

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(mdp, user.mdp);
    if (!isMatch) {
      return res.status(401).json({ msg: "Mot de passe incorrect" });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "24h" }
    );


    res.json({
      msg: "Connexion réussie",
      token,
      user: { id: user.id, pseudo: user.pseudo, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erreur lors de la connexion", error: err.message });
  }
};
