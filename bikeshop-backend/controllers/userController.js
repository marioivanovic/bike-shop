import mysql from '../config/mysql.js';

export const getAllUsers = async (req, res, next) => {
    try {
        const connection = await mysql.getConnection();
        const [rows] = await connection.execute('SELECT * FROM users');
        connection.release();
        res.json({
            status: 'success',
            data: rows
        });
    } catch (error) {
        next(error);
    }
};

export const createUser = async (req, res, next) => {
    const { lastName, firstName, email, password } = req.body;
    try {
        const connection = await mysql.getConnection();
        const [result] = await connection.execute(
            'INSERT INTO users (lastName, firstName, email, password) VALUES (?, ?, ?)',
            [lastName, firstName, email, password]
        );
        connection.release();
        res.status(201).json({
            status: 'success',
            data: {
                id: result.insertId,
                lastName,
                firstName,
                email
            }
        });
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    const { id } = req.params;
    const { lastName, firstName, email, password } = req.body;
    try {
        const connection = await mysql.getConnection();
        await connection.execute(
            'UPDATE users SET lastName = ?, firstName = ?, email = ?, password = ? WHERE id = ?',
            [lastName, firstName, email, password, id]
        );
        connection.release();
        res.json({
            status: 'success',
            data: {
                id,
                lastName,
                firstName,
                email,
            }
        });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const connection = await mysql.getConnection();
        await connection.execute('DELETE FROM users WHERE id = ?', [id]);
        connection.release();
        res.json({
            status: 'success',
            message: 'Utilisateur supprimé'
        });
    } catch (error) {
        next(error);
    }
};