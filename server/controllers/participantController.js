const pool = require("../models/db");

exports.getAllParticipants = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT id, nom, prenom, email, contact, created_at FROM participant");
        res.json({ participants: rows });
    } catch (err) {
        console.error(err)
        res.status(500).json({ msg: "Erreur de recuperation de participants", error: err.message });
    }
}

exports.getParticipantById = async (req, res) => {
  try {
    const { id } = req.params; // récupère l'id depuis l'URL

    const [rows] = await pool.query(
      "SELECT id, nom, prenom, email, contact, created_at FROM participant WHERE id = ?", 
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: "Participant non trouvé" });
    }

    res.json({ participant: rows[0] }); // retourne un seul objet
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erreur de récupération du participant", error: err.message });
  }
};


exports.createParticipant = async (req, res) => {
    try {
        const { nom, prenom, email, contact } = req.body;

        const [existing] = await pool.query("SELECT * FROM participant WHERE email = ?", [email]);
        if (existing.length > 0) {
            return res.status(400).json({ msg: "Participant déjà existant" });
        }

        await pool.query(
            "INSERT INTO participant (nom, prenom, email, contact) VALUES (?, ?, ?, ?)",
            [nom, prenom, email, contact]
        );

        res.status(201).json({ msg: "Participant créé avec succès" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Erreur création participant", error: err.message });
    }
}

exports.updateParticipant = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, prenom,email, contact } = req.body;

        const [existing] = await pool.query("SELECT * FROM participant WHERE id = ?", [id]);
        if (existing.length === 0) {
            return res.status(404).json({ msg: "Participant non trouvé" });
        }

        await pool.query(
            "UPDATE participant SET nom = ?, prenom = ?, email = ?, contact = ? WHERE id = ?", [nom || existing[0].nom, prenom || existing[0].prenom, email || existing[0], contact || existing[0].contact, id]
        );
        res.json({ msg: "Participant mis à jour avec succès" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Erreur mise à jour participant", error: err.message });
    }
}

exports.deleteParticipant = async (req, res) => {
    try {
        const { id } = req.params
        const [existing] = await pool.query("SELECT * FROM participant WHERE id = ?", [id]);
        if (existing.length === 0) {
            return res.status(404).json({ msg: "Participant non trouvé" });
        }

        // Supprimer l'utilisateur
        await pool.query("DELETE FROM participant WHERE id = ?", [id]);

        res.json({ msg: "Participant supprimé avec succès" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Erreur suppression Participant", error: err.message });
    }

}

exports.searchParticipants = async (req, res) => {
  try {
    const { query } = req.query; // ex: /participants/search?query=John

    if (!query) {
      return res.status(400).json({ msg: "Veuillez fournir un terme de recherche" });
    }

    const [rows] = await pool.query(
      `SELECT id, nom, prenom, email, contact, created_at 
       FROM participant
       WHERE nom LIKE ? OR email LIKE ? OR contact LIKE ?`,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: "Aucun participant trouvé" });
    }

    res.json({ participants: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erreur lors de la recherche", error: err.message });
  }
};
