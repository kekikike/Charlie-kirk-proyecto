const express = require('express');
const router = express.Router();
const { registrarLog } = require('../servicios/log');

router.post('/logs', (req, res) => {
    const { usuario, accion, detalle = '' } = req.body;

    if (!usuario || !accion) {
        return res.status(400).json({ success: false, error: 'Faltan datos' });
    }

    try {
        registrarLog(usuario, accion, detalle);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
