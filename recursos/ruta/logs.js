const express = require('express');
const router = express.Router();
const { registrarLog } = require('../servicios/logServicio');

router.post('/', (req, res) => {
    const { accion, detalle } = req.body;
    const usuario = req.usuario?.ciempleado || 'Desconocido';

    if (!accion) {
        return res.status(400).json({ error: 'Acción requerida' });
    }

    registrarLog({
        usuario,
        accion,
        detalle
    });

    res.json({ ok: true });
});

module.exports = router;
