// routes/ingredientRoutes.js
import express from 'express';
import mysql from '../config/mysql.js';

const router = express.Router();

router.get('/ingredients', async (req, res) => {
    try {
        const connection = await mysql.getConnection();
        const [rows] = await connection.execute('SELECT * FROM ingredients');
        connection.release();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/ingredient', async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Le nom est requis' });
    }

    try {
        const connection = await mysql.getConnection();
        const [result] = await connection.execute(
            'INSERT INTO ingredients (name) VALUES (?)',
            [name]
        );
        connection.release();

        res.status(201).json({
            id: result.insertId,
            name
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/ingredient/:id', async (req, res) => {
    try {
        const connection = await mysql.getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM ingredients WHERE id = ?',
            [req.params.id]
        );
        connection.release();

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Ingrédient non trouvé' });
        }

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/ingredient/:id', async (req, res) => {
    try {
        const connection = await mysql.getConnection();
        await connection.execute(
            'DELETE FROM ingredients WHERE id = ?',
            [req.params.id]
        );
        connection.release();
        res.json({ message: 'Ingrédient supprimé' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;