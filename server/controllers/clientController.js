const pool = require("../models/db");


exports.getAllClients = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT id, nom, prenom, contact, created_at FROM client");
        res.json({ users: rows });
    } catch (err) {
        console.error(err)
        res.status(500).json({ msg: "Erreur de recuperation de clients", error: err.message });
    }
}
exports.createClient = async (req, res) => {
  try {
    const { nom, prenom, contact } = req.body;

    const [existing] = await pool.query("SELECT * FROM client WHERE contact = ?", [contact]);
    if (existing.length > 0) {
      return res.status(400).json({ msg: "Client déjà existant" });
    }

    await pool.query(
      "INSERT INTO client (nom, prenom, contact) VALUES (?, ?, ?)",
      [nom, prenom, contact]
    );

    res.status(201).json({ msg: "Client créé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erreur création client", error: err.message });
  }
};


exports.updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, prenom, contact } = req.body;

        const [existing] = await pool.query("SELECT * FROM client WHERE id = ?", [id]);
        if (existing.length === 0) {
            return res.status(404).json({ msg: "Client non trouvé" });
        }

        await pool.query(
            "UPDATE client SET nom = ?, prenom = ?, contact = ? WHERE id = ?", [nom || existing[0].nom, prenom || existing[0].prenom, contact || existing[0].contact, id]
        );
        res.json({ msg: "Client mis à jour avec succès" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Erreur mise à jour client", error: err.message });
    }
}

exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si l'utilisateur existe
    const [existing] = await pool.query("SELECT * FROM client WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ msg: "Client non trouvé" });
    }

    // Supprimer l'utilisateur
    await pool.query("DELETE FROM client WHERE id = ?", [id]);

    res.json({ msg: "Client supprimé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erreur suppression client", error: err.message });
  }
};