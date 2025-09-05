const pool = require("../models/db");
const bcrypt = require("bcryptjs");

exports.getAllUsers = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT id, pseudo, email, mdp, created_at FROM user");
        res.json({ users: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Erreur recuperation des utilisateurs", error: err.message });
    }
}

    // Créer un nouvel utilisateur
    exports.createUser = async (req, res) => {
        try {
            const { pseudo, email, mdp } = req.body;

            const [existing] = await pool.query("SELECT * FROM user WHERE email = ?", [email]);
            if (existing.length > 0) {
                return res.status(400).json({ msg: "Utilisateur déjà existant" });
            }

            // Hasher le mot de passe
            const hashedPassword = await bcrypt.hash(mdp, 10);
            
            // Insérer l'utilisateur
            await pool.query("INSERT INTO user (pseudo, email, mdp) VALUES (?, ?, ?)", [pseudo, email, hashedPassword]);

            res.status(201).json({ msg: "Utilisateur créé avec succès" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: "Erreur création utilisateur", error: err.message });
        }
    }

// Modifier un utilisateur existant
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { pseudo, email, mdp } = req.body;

    // Vérifier si l'utilisateur existe
    const [existing] = await pool.query("SELECT * FROM user WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ msg: "Utilisateur non trouvé" });
    }

    // Hasher le mot de passe si fourni
    let hashedPassword = existing[0].mdp;
    if (mdp) {
      const bcrypt = require("bcryptjs");
      hashedPassword = await bcrypt.hash(mdp, 10);
    }

    // Mettre à jour l'utilisateur
    await pool.query(
      "UPDATE user SET pseudo = ?, email = ?, mdp = ? WHERE id = ?",
      [pseudo || existing[0].pseudo, email || existing[0].email, hashedPassword, id]
    );

    res.json({ msg: "Utilisateur mis à jour avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erreur mise à jour utilisateur", error: err.message });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si l'utilisateur existe
    const [existing] = await pool.query("SELECT * FROM user WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ msg: "Utilisateur non trouvé" });
    }

    // Supprimer l'utilisateur
    await pool.query("DELETE FROM user WHERE id = ?", [id]);

    res.json({ msg: "Utilisateur supprimé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erreur suppression utilisateur", error: err.message });
  }
};
