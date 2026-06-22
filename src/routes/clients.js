const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const { authMiddleware } = require('../middleware/auth');

// 1. GET tous les clients
router.get('/', authMiddleware, async (req, res) => {
  try {
    const clients = await Client.findAll({ order: [['nom', 'ASC']] });
    res.json(clients);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// 2. GET un client par son ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client introuvable' });
    res.json(client);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// 3. POST un nouveau client
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { nom, compagnie, telephone, email, transitaire } = req.body;
    if (!nom) return res.status(400).json({ message: 'Le nom du client est obligatoire' });

    const nouveauClient = await Client.create({
      nom,
      compagnie,
      telephone,
      email,
      transitaire
    });
    res.status(201).json(nouveauClient);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// 4. PUT modifier un client
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client introuvable' });

    await client.update(req.body);
    res.json(client);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// 5. DELETE supprimer un client
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client introuvable' });

    await client.destroy();
    res.json({ message: 'Client supprimé avec succès' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;