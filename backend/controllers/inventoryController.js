import Product from '../models/Product.js';
import MateriaPrima from '../models/MateriaPrima.js';

// @desc    Get all products inventory details
// @route   GET /api/inventory/products
// @access  Private/Admin
export const getProductsInventory = async (req, res) => {
    try {
        const pageSize = Number(req.query.limit) || 20;
        const page = Number(req.query.page) || 1;
        const search = req.query.search || '';
        
        const query = search ? { name: { $regex: search, $options: 'i' } } : {};
        
        const count = await Product.countDocuments(query);

        // Find products and select inventory related fields
        const products = await Product.find(query)
            .select('name image category price countInStock stockMinimo stockMovimientos')
            .sort({ countInStock: 1 }) // Sort by lowest stock first
            .limit(pageSize)
            .skip(pageSize * (page - 1));
            
        res.json({
            products,
            page,
            pages: Math.ceil(count / pageSize),
            total: count
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products inventory', error: error.message });
    }
};

// @desc    Update product stock
// @route   PUT /api/inventory/products/:id
// @access  Private/Admin
export const updateProductStock = async (req, res) => {
    try {
        const { newStock, stockMinimo, motivo, tipoMovimiento } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        const oldStock = product.countInStock;
        const diferencia = newStock - oldStock;

        // Ensure type of movement is explicitly passed or inferred
        const tipo = tipoMovimiento || (diferencia >= 0 ? 'entrada' : 'salida');
        const cantidadAbsoluta = Math.abs(diferencia);

        // Actualizar valores
        product.countInStock = newStock;
        if (stockMinimo !== undefined) {
            product.stockMinimo = stockMinimo;
        }

        // Registrar el movimiento si hubo un cambio
        if (diferencia !== 0) {
            product.stockMovimientos.push({
                tipo: tipo,
                cantidad: cantidadAbsoluta,
                motivo: motivo || 'Ajuste manual desde admin',
                usuario: req.user ? req.user.email : 'admin'
            });
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error updating product stock', error: error.message });
    }
};

// @desc    Get all raw materials (materias primas)
// @route   GET /api/inventory/materials
// @access  Private/Admin
export const getMaterials = async (req, res) => {
    try {
        const pageSize = Number(req.query.limit) || 20;
        const page = Number(req.query.page) || 1;
        const search = req.query.search || '';
        
        const query = search ? { nombre: { $regex: search, $options: 'i' } } : {};
        
        const count = await MateriaPrima.countDocuments(query);
        const materials = await MateriaPrima.find(query)
            .sort({ stockActual: 1 })
            .limit(pageSize)
            .skip(pageSize * (page - 1));
            
        res.json({
            materials,
            page,
            pages: Math.ceil(count / pageSize),
            total: count
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching materials', error: error.message });
    }
};

// @desc    Create raw material
// @route   POST /api/inventory/materials
// @access  Private/Admin
export const createMaterial = async (req, res) => {
    try {
        const material = new MateriaPrima({
            nombre: req.body.nombre || 'Nueva Materia Prima',
            tipo: req.body.tipo || 'otro',
            unidad: req.body.unidad || 'unidades',
            stockActual: req.body.stockActual || 0,
            stockMinimo: req.body.stockMinimo || 1,
            proveedor: req.body.proveedor || '',
            precioUnitario: req.body.precioUnitario || 0,
        });

        const createdMaterial = await material.save();
        res.status(201).json(createdMaterial);
    } catch (error) {
        res.status(500).json({ message: 'Error creating material', error: error.message });
    }
};

// @desc    Update raw material stock
// @route   PUT /api/inventory/materials/:id
// @access  Private/Admin
export const updateMaterialStock = async (req, res) => {
    try {
        const { nombre, tipo, unidad, stockActual, stockMinimo, proveedor, precioUnitario, motivo, tipoMovimiento } = req.body;
        const material = await MateriaPrima.findById(req.params.id);

        if (!material) {
            return res.status(404).json({ message: 'Materia prima no encontrada' });
        }

        let diferencia = 0;
        if (stockActual !== undefined) {
            diferencia = stockActual - material.stockActual;
            material.stockActual = stockActual;
        }

        if (nombre) material.nombre = nombre;
        if (tipo) material.tipo = tipo;
        if (unidad) material.unidad = unidad;
        if (stockMinimo !== undefined) material.stockMinimo = stockMinimo;
        if (proveedor !== undefined) material.proveedor = proveedor;
        if (precioUnitario !== undefined) material.precioUnitario = precioUnitario;

        // Register movement if stock changed
        if (diferencia !== 0) {
            material.movimientos.push({
                tipo: tipoMovimiento || (diferencia >= 0 ? 'ajuste' : 'uso'),
                cantidad: Math.abs(diferencia),
                motivo: motivo || 'Ajuste manual',
                usuario: req.user ? req.user.email : 'admin'
            });
        }

        const updatedMaterial = await material.save();
        res.json(updatedMaterial);
    } catch (error) {
        res.status(500).json({ message: 'Error updating material', error: error.message });
    }
};

// @desc    Delete raw material
// @route   DELETE /api/inventory/materials/:id
// @access  Private/Admin
export const deleteMaterial = async (req, res) => {
    try {
        const material = await MateriaPrima.findById(req.params.id);

        if (!material) {
            return res.status(404).json({ message: 'Materia prima no encontrada' });
        }

        await material.deleteOne();
        res.json({ message: 'Materia prima eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting material', error: error.message });
    }
};
