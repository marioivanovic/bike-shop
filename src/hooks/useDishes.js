// src/hooks/useDishes.js
import { useState, useEffect, createContext, useContext } from 'react';
import { dishAPI, ingredientAPI } from '../api/config';

const DishesContext = createContext(null);

export const DishesProvider = ({ children }) => {
    const [dishes, setDishes] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Charger tous les plats au montage du composant
    useEffect(() => {
        fetchDishes();
        fetchIngredients();
    }, []);

    const fetchDishes = async () => {
        setLoading(true);
        try {
            const response = await dishAPI.getAllDishes();
            setDishes(response.data);
        } catch (err) {
            setError('Erreur lors du chargement des plats');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchIngredients = async () => {
        try {
            const response = await ingredientAPI.getAllIngredients();
            setIngredients(response.data);
        } catch (err) {
            console.error('Erreur lors du chargement des ingrédients:', err);
        }
    };

    const createDish = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await dishAPI.createDish(formData);
            
            // Mettre à jour la liste des plats
            setDishes(prevDishes => [...prevDishes, response.data]);
            
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la création du plat');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const addDishImages = async (dishId, formData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await dishAPI.addDishImages(dishId, formData);
            
            setDishes(prevDishes => prevDishes.map(dish => 
                dish.id === dishId 
                    ? { ...dish, images: response.data.images } 
                    : dish
            ));
            
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de l\'ajout des images');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const setDishPrimaryImage = async (dishId, imageId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await dishAPI.setDishPrimaryImage(dishId, imageId);
            
            setDishes(prevDishes => prevDishes.map(dish => 
                dish.id === dishId 
                    ? { ...dish, images: response.data.images } 
                    : dish
            ));
            
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la définition, image principale');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteDishImage = async (dishId, imageId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await dishAPI.deleteDishImage(dishId, imageId);
            
            setDishes(prevDishes => prevDishes.map(dish => 
                dish.id === dishId 
                    ? { ...dish, images: response.data.images } 
                    : dish
            ));
            
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la suppression d\'image');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <DishesContext.Provider value={{
            dishes,
            ingredients,
            loading,
            error,
            fetchDishes,
            fetchIngredients,
            createDish,
            addDishImages,
            setDishPrimaryImage,
            deleteDishImage
        }}>
            {children}
        </DishesContext.Provider>
    );
};

export const useDishes = () => {
    const context = useContext(DishesContext);
    if (!context) {
        throw new Error('useDishes doit être utilisé à l\'intérieur d\'un DishesProvider');
    }
    return context;
};