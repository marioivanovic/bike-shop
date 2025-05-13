// src/data/bikes.js
const imageFiles = [
    'carl-nenzen-loven-igKjieyjcko-unsplash.jpg',
    'didier-weemaels-4yfdgmbgBWU-unsplash.jpg',
    'dmitrii-vaccinium-sw9Vozf6j_4-unsplash.jpg',
    'jacek-dylag-giFeTshEYYQ-unsplash.jpg',
    'mikkel-bech-yjAFnkLtKY0-unsplash.jpg',
    'robert-bye-tG36rvCeqng-unsplash.jpg',
    'sole-bicycles-JK6lD_y3aDg-unsplash.jpg',
    'streetsh-vZAk_n9Plfc-unsplash.jpg',
    'tiffany-nutt-0ClfreiNppM-unsplash.jpg',
];

const brands = ['Trek', 'Giant', 'Specialized', 'Cannondale', 'Bianchi', 'Scott', 'Cube', 'Merida', 'Orbea'];
const models = ['SpeedX Pro', 'TrailMaster', 'RoadRunner', 'UrbanLight', 'MountainKing', 'TrackRacer', 'CrossWind', 'EcoRide', 'VoltE'];
const descriptions = [
    'Conçu pour avaler les kilomètres en toute légèreté.',
    'Le partenaire idéal pour vos escapades off-road.',
    'Design épuré et performance maximale.',
    'Confort absolu même après des heures en selle.',
    'Matériaux high-tech pour un poids plume.',
    'Polyvalent, s’adapte à tous les terrains.',
    'Éco-responsable et 100% fun.',
    'Rend chaque montée plus simple.',
    'Style vintage, âmes modernes.'
];

const randomPick = arr => arr[Math.floor(Math.random() * arr.length)];
const randomPrice = (min, max) => Number((Math.random() * (max - min) + min).toFixed(2));

const bikes = imageFiles.map(fileName => ({
    image: fileName,
    brand: randomPick(brands),
    model: randomPick(models),
    price: randomPrice(100, 2999),
    description: randomPick(descriptions)
}));

export default bikes;
