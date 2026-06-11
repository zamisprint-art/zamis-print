import ShippingZone from '../models/ShippingZone.js';

// @desc    Seed default shipping zones if none exist
export const seedDefaultShippingZones = async () => {
    try {
        const count = await ShippingZone.countDocuments();
        if (count === 0) {
            console.log('Seeding default shipping zones...');
            await ShippingZone.insertMany([
                {
                    name: 'Bogotá y Sabana',
                    departments: ['Bogotá D.C.'],
                    cities: [
                        'Bogotá, D.C.', 'Chía', 'Cajicá', 'Sopó', 'Cota', 'Funza', 'Mosquera', 'Madrid'
                    ],
                    baseCost: 10000,
                    freeShippingThreshold: 150000,
                    estimatedDays: '1 a 2 días hábiles',
                    isDefault: false
                },
                {
                    name: 'Nacional por Defecto',
                    departments: [],
                    cities: [],
                    baseCost: 15000,
                    freeShippingThreshold: 200000,
                    estimatedDays: '3 a 5 días hábiles',
                    isDefault: true
                }
            ]);
            console.log('Default shipping zones seeded successfully');
        }
    } catch (error) {
        console.error('Error seeding shipping zones:', error);
    }
};

// @desc    Get all shipping zones
// @route   GET /api/shipping-zones
// @access  Private/Admin
export const getShippingZones = async (req, res) => {
    const zones = await ShippingZone.find({}).sort({ isDefault: 1, name: 1 });
    res.json(zones);
};

// @desc    Create a shipping zone
// @route   POST /api/shipping-zones
// @access  Private/Admin
export const createShippingZone = async (req, res) => {
    const { name, departments, cities, baseCost, freeShippingThreshold, estimatedDays, isDefault } = req.body;

    const zoneExists = await ShippingZone.findOne({ name });
    if (zoneExists) {
        return res.status(400).json({ message: 'Ya existe una zona con este nombre' });
    }

    if (isDefault) {
        // Unset any existing default zone if this one is set as default
        await ShippingZone.updateMany({}, { isDefault: false });
    }

    const zone = new ShippingZone({
        name,
        departments: departments || [],
        cities: cities || [],
        baseCost,
        freeShippingThreshold,
        estimatedDays,
        isDefault: isDefault || false
    });

    const createdZone = await zone.save();
    res.status(201).json(createdZone);
};

// @desc    Update a shipping zone
// @route   PUT /api/shipping-zones/:id
// @access  Private/Admin
export const updateShippingZone = async (req, res) => {
    const { name, departments, cities, baseCost, freeShippingThreshold, estimatedDays, isDefault } = req.body;

    const zone = await ShippingZone.findById(req.params.id);

    if (zone) {
        if (isDefault && !zone.isDefault) {
            await ShippingZone.updateMany({}, { isDefault: false });
        }

        zone.name = name || zone.name;
        zone.departments = departments !== undefined ? departments : zone.departments;
        zone.cities = cities !== undefined ? cities : zone.cities;
        zone.baseCost = baseCost !== undefined ? baseCost : zone.baseCost;
        zone.freeShippingThreshold = freeShippingThreshold !== undefined ? freeShippingThreshold : zone.freeShippingThreshold;
        zone.estimatedDays = estimatedDays || zone.estimatedDays;
        zone.isDefault = isDefault !== undefined ? isDefault : zone.isDefault;

        const updatedZone = await zone.save();
        res.json(updatedZone);
    } else {
        res.status(404).json({ message: 'Zona de envío no encontrada' });
    }
};

// @desc    Delete a shipping zone
// @route   DELETE /api/shipping-zones/:id
// @access  Private/Admin
export const deleteShippingZone = async (req, res) => {
    const zone = await ShippingZone.findById(req.params.id);

    if (zone) {
        if (zone.isDefault) {
            return res.status(400).json({ message: 'No puedes eliminar la zona por defecto' });
        }
        await zone.deleteOne();
        res.json({ message: 'Zona de envío eliminada' });
    } else {
        res.status(404).json({ message: 'Zona de envío no encontrada' });
    }
};

// @desc    Calculate shipping cost
// @route   POST /api/shipping-zones/calculate
// @access  Public
export const calculateShipping = async (req, res) => {
    const { department, city, subtotal } = req.body;

    if (!department || !city) {
        return res.status(400).json({ message: 'Departamento y ciudad son obligatorios' });
    }

    try {
        const allZones = await ShippingZone.find({});
        
        let matchedZone = null;

        // 1. Exact city match
        matchedZone = allZones.find(z => z.cities.includes(city));

        // 2. Exact department match
        if (!matchedZone) {
            matchedZone = allZones.find(z => z.departments.includes(department));
        }

        // 3. Fallback to default zone
        if (!matchedZone) {
            matchedZone = allZones.find(z => z.isDefault === true);
        }

        // Final fallback if database is empty or missing default
        if (!matchedZone) {
            return res.json({
                cost: 15000,
                estimatedDays: '3 a 5 días hábiles',
                zoneName: 'Tarifa Estándar'
            });
        }

        // Calculate cost based on threshold
        let finalCost = matchedZone.baseCost;
        if (matchedZone.freeShippingThreshold !== null && matchedZone.freeShippingThreshold !== undefined) {
            if (subtotal >= matchedZone.freeShippingThreshold) {
                finalCost = 0;
            }
        }

        res.json({
            cost: finalCost,
            estimatedDays: matchedZone.estimatedDays,
            zoneName: matchedZone.name
        });
    } catch (error) {
        res.status(500).json({ message: 'Error calculando el envío', error: error.message });
    }
};
