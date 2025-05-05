import express from 'express';
import mysql from '../config/mysql.js';
import { upload, uploadMultiple } from '../config/multer.js';
import { uploadImage, uploadMultipleImages } from '../utils/cloudinaryUtils.js';

const router = express.Router();

router.get('/dishes', async (req, res) => {
    try {
        const connection = await mysql.getConnection();

        const [dishes] = await connection.execute('SELECT * FROM dishes');

        const dishesWithDetails = await Promise.all(dishes.map(async (dish) => {
            const [ingredients] = await connection.execute(`
                SELECT i.id_ingredient, i.name, i.stock
                FROM ingredients i
                JOIN dish_ingredients di ON i.id_ingredient = di.ingredient_id
                WHERE di.id_dish = ?
            `, [dish.id]);
            
            const [images] = await connection.execute(`
                SELECT id, image_url, is_primary
                FROM dish_images
                WHERE dish_id = ?
                ORDER BY is_primary DESC, id ASC
            `, [dish.id]);

            return {
                ...dish,
                ingredients,
                images
            };
        }));

        connection.release();
        res.json(dishesWithDetails);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/dish/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await mysql.getConnection();

        const [dishes] = await connection.execute(
            'SELECT * FROM dishes WHERE id = ?',
            [id]
        );

        if (dishes.length === 0) {
            connection.release();
            return res.status(404).json({ message: 'Plat non trouvé' });
        }

        const [ingredients] = await connection.execute(`
            SELECT i.id, i.name, di.quantity
            FROM ingredients i
            JOIN dish_ingredients di ON i.id = di.ingredient_id
            WHERE di.id_dish = ?
        `, [id]);
        
        const [images] = await connection.execute(`
            SELECT id, image_url, is_primary
            FROM dish_images
            WHERE dish_id = ?
            ORDER BY is_primary DESC, id ASC
        `, [id]);

        const dishWithDetails = {
            ...dishes[0],
            ingredients,
            images
        };

        connection.release();
        res.json(dishWithDetails);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/dish', uploadMultiple.array('dishImages', 5), async (req, res) => {
    const { name, description, price, ingredients } = req.body;

    if (!name || !price) {
        return res.status(400).json({ message: 'Nom et prix sont requis' });
    }

    const connection = await mysql.getConnection();
    
    try {
        await connection.beginTransaction();

        const [result] = await connection.execute(
            'INSERT INTO dishes (name, description, price) VALUES (?, ?, ?)',
            [name, description, price]
        );
        
        const dishId = result.insertId;

        const parsedIngredients = ingredients ? JSON.parse(ingredients) : [];
        
        if (parsedIngredients.length > 0) {
            for (const ing of parsedIngredients) {
                await connection.execute(
                    'INSERT INTO dish_ingredients (dish_id, ingredient_id, quantity) VALUES (?, ?, ?)',
                    [dishId, ing.id, ing.quantity]
                );
            }
        }
        
        if (req.files && req.files.length > 0) {
            const uploadResults = await uploadMultipleImages(req.files, 'dishes');
            
            for (let i = 0; i < uploadResults.length; i++) {
                const isPrimary = i === 0; // La première image est l'image principale
                await connection.execute(
                    'INSERT INTO dish_images (dish_id, image_url, is_primary) VALUES (?, ?, ?)',
                    [dishId, uploadResults[i].secure_url, isPrimary]
                );
            }
        }

        await connection.commit();
        
        const [dish] = await connection.execute(
            'SELECT * FROM dishes WHERE id = ?',
            [dishId]
        );

        const [dishIngredients] = await connection.execute(`
            SELECT i.id_ingredient, i.name, i.stock
            FROM ingredients i
            JOIN dish_ingredients di ON i.id_ingredient = di.ingredient_id
            WHERE di.id_dish = ?
        `, [dishId]);

        const [dishImages] = await connection.execute(`
            SELECT id, image_url, is_primary
            FROM dish_images
            WHERE dish_id = ?
            ORDER BY is_primary DESC, id ASC
        `, [dishId]);

        const newDish = {
            ...dish[0],
            ingredients: dishIngredients,
            images: dishImages
        };

        connection.release();
        res.status(201).json(newDish);
    } catch (err) {
        await connection.rollback();
        connection.release();
        res.status(500).json({ error: err.message });
    }
});

router.post('/dish/:id/images', uploadMultiple.array('dishImages', 5), async (req, res) => {
    const { id } = req.params;
    
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            status: 'error',
            message: 'Aucune image fournie'
        });
    }
    
    const connection = await mysql.getConnection();
    
    try {
        const [existingImages] = await connection.execute(
            'SELECT COUNT(*) as count FROM dish_images WHERE dish_id = ?',
            [id]
        );
        
        const currentCount = existingImages[0].count;
        const allowedNewImages = Math.min(5 - currentCount, req.files.length);
        
        if (allowedNewImages <= 0) {
            connection.release();
            return res.status(400).json({
                status: 'error',
                message: 'Limite de 5 images atteinte pour ce plat'
            });
        }
        
        const filesToUpload = req.files.slice(0, allowedNewImages);
        
        const uploadResults = await uploadMultipleImages(filesToUpload, 'dishes');
        
        const [hasPrimary] = await connection.execute(
            'SELECT COUNT(*) as count FROM dish_images WHERE dish_id = ? AND is_primary = true',
            [id]
        );
        
        const needsPrimary = hasPrimary[0].count === 0;
        
        await connection.beginTransaction();
        
        for (let i = 0; i < uploadResults.length; i++) {
            const isPrimary = needsPrimary && i === 0; // La première image est principale seulement si nécessaire
            await connection.execute(
                'INSERT INTO dish_images (dish_id, image_url, is_primary) VALUES (?, ?, ?)',
                [id, uploadResults[i].secure_url, isPrimary]
            );
        }
        
        await connection.commit();
        
        const [images] = await connection.execute(
            'SELECT id, image_url, is_primary FROM dish_images WHERE dish_id = ? ORDER BY is_primary DESC, id ASC',
            [id]
        );
        
        connection.release();
        
        res.status(201).json({
            status: 'success',
            message: `${uploadResults.length} image(s) ajoutée(s)`,
            images
        });
    } catch (err) {
        await connection.rollback();
        connection.release();
        res.status(500).json({ error: err.message });
    }
});

router.put('/dish/:dishId/images/:imageId/primary', async (req, res) => {
    const { dishId, imageId } = req.params;
    
    const connection = await mysql.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const [imageCheck] = await connection.execute(
            'SELECT id FROM dish_images WHERE id = ? AND dish_id = ?',
            [imageId, dishId]
        );
        
        if (imageCheck.length === 0) {
            await connection.rollback();
            connection.release();
            return res.status(404).json({
                status: 'error',
                message: 'Image non trouvée pour ce plat'
            });
        }
        
        await connection.execute(
            'UPDATE dish_images SET is_primary = false WHERE dish_id = ?',
            [dishId]
        );
        
        await connection.execute(
            'UPDATE dish_images SET is_primary = true WHERE id = ?',
            [imageId]
        );
        
        await connection.commit();
        
        const [images] = await connection.execute(
            'SELECT id, image_url, is_primary FROM dish_images WHERE dish_id = ? ORDER BY is_primary DESC, id ASC',
            [dishId]
        );
        
        connection.release();
        
        res.json({
            status: 'success',
            message: 'Image principale mise à jour',
            images
        });
    } catch (err) {
        await connection.rollback();
        connection.release();
        res.status(500).json({ error: err.message });
    }
});

router.delete('/dish/:dishId/images/:imageId', async (req, res) => {
    const { dishId, imageId } = req.params;
    
    const connection = await mysql.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const [imageCheck] = await connection.execute(
            'SELECT is_primary FROM dish_images WHERE id = ? AND dish_id = ?',
            [imageId, dishId]
        );
        
        if (imageCheck.length === 0) {
            await connection.rollback();
            connection.release();
            return res.status(404).json({
                status: 'error',
                message: 'Image non trouvée pour ce plat'
            });
        }
        
        const isPrimary = imageCheck[0].is_primary;
        
        // Supprimer l'image
        await connection.execute(
            'DELETE FROM dish_images WHERE id = ?',
            [imageId]
        );
        
        if (isPrimary) {
            const [remainingImages] = await connection.execute(
                'SELECT id FROM dish_images WHERE dish_id = ? LIMIT 1',
                [dishId]
            );
            
            if (remainingImages.length > 0) {
                await connection.execute(
                    'UPDATE dish_images SET is_primary = true WHERE id = ?',
                    [remainingImages[0].id]
                );
            }
        }
        
        await connection.commit();
        
        const [images] = await connection.execute(
            'SELECT id, image_url, is_primary FROM dish_images WHERE dish_id = ? ORDER BY is_primary DESC, id ASC',
            [dishId]
        );
        
        connection.release();
        
        res.json({
            status: 'success',
            message: 'Image supprimée',
            images
        });
    } catch (err) {
        await connection.rollback();
        connection.release();
        res.status(500).json({ error: err.message });
    }
});

export default router;

