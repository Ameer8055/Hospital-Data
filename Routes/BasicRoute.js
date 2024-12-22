const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '../Hospital.json');


const readData = async () => {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
};


const writeData = async (data) => {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
};

// Get all hospitals
router.get('/', async (req, res) => {
    try {
        const hospitals = await readData();
        res.json(hospitals);
    } catch (error) {
        res.status(500).send('Error reading data');
    }
});

// Get a hospital by ID
router.get('/:id', async (req, res) => {
    try {
        const hospitals = await readData();
        const hospital = hospitals.find(h => h.id === parseInt(req.params.id));
        if (!hospital) return res.status(404).send('Hospital not found');
        res.json(hospital);
    } catch (error) {
        res.status(500).send('Error reading data');
    }
});

// Create a new hospital
router.post('/', async (req, res) => {
    try {
        const hospitals = await readData();
        const newHospital = {
            id: hospitals.length + 1,
            name: req.body.name,
            location: req.body.location,
            capacity: req.body.capacity
        };
        hospitals.push(newHospital);
        await writeData(hospitals);
        res.status(201).json(newHospital);
    } catch (error) {
        res.status(500).send('Error writing data');
    }
});

// Update a hospital
router.put('/:id', async (req, res) => {
    try {
        const hospitals = await readData();
        const hospital = hospitals.find(h => h.id === parseInt(req.params.id));
        if (!hospital) return res.status(404).send('Hospital not found');

        hospital.name = req.body.name;
        hospital.location = req.body.location;
        hospital.capacity = req.body.capacity;
        await writeData(hospitals);
        res.json(hospital);
    } catch (error) {
        res.status(500).send('Error writing data');
    }
});

// Delete a hospital
router.delete('/:id', async (req, res) => {
    try {
        let hospitals = await readData();
        const hospitalIndex = hospitals.findIndex(h => h.id === parseInt(req.params.id));
        if (hospitalIndex === -1) return res.status(404).send('Hospital not found');

        hospitals.splice(hospitalIndex, 1);
        await writeData(hospitals);
        res.status(204).send();
    } catch (error) {
        res.status(500).send('Error writing data');
    }
});

module.exports = router;