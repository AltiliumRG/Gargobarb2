const { Sale, Service, User } = require('../models');

exports.createSale = async (req, res) => {
    try {
        const {
            barbershop_id,
            service_id,
            barber_id,
            client_name,
            date,
            time,
            price,
            payment_method,
            status
        } = req.body;

        const newSale = await Sale.create({
            barbershop_id,
            service_id,
            barber_id,
            client_name,
            date,
            time,
            price,
            payment_method,
            status
        });

        res.status(201).json({
            ok: true,
            message: 'Venta creada correctamente',
            sale: newSale
        });
    } catch (error) {
        console.error('Error al crear venta:', error);
        res.status(500).json({ ok: false, message: 'Error al crear la venta' });
    }
};

exports.getSalesByBarbershop = async (req, res) => {
    try {
        const { barbershopId } = req.params;
        const sales = await Sale.findAll({
            where: { barbershop_id: barbershopId },
            include: [
                { model: Service, as: 'service', attributes: ['name', 'price'] },
                { model: User, as: 'barber', attributes: ['username', 'full_name'] }
            ],
            order: [['date', 'DESC'], ['time', 'DESC']]
        });

        res.json({ ok: true, sales });
    } catch (error) {
        console.error('Error al obtener ventas:', error);
        res.status(500).json({ ok: false, message: 'Error al obtener las ventas' });
    }
};

exports.getRequiredDataForSale = async (req, res) => {
    try {
        const { barbershopId } = req.params;

        const services = await Service.findAll({
            where: { barbershop_id: barbershopId, is_active: true }
        });

        // For now, we fetch all users with role_id 2 (barber)
        // In a more complex system, we'd filter by those associated with the barbershop
        const barbers = await User.findAll({
            where: { role_id: 2 },
            attributes: ['id', 'username', 'full_name']
        });

        res.json({ ok: true, services, barbers });
    } catch (error) {
        console.error('Error al obtener datos requeridos:', error);
        res.status(500).json({ ok: false, message: 'Error al obtener datos' });
    }
}
exports.bulkCreateSales = async (req, res) => {
    try {
        const { sales } = req.body;
        if (!sales || !Array.isArray(sales)) {
            return res.status(400).json({ ok: false, message: 'Se requiere un arreglo de ventas' });
        }

        const createdSales = await Sale.bulkCreate(sales);

        res.status(201).json({
            ok: true,
            message: `${createdSales.length} ventas importadas correctamente`,
            count: createdSales.length
        });
    } catch (error) {
        console.error('Error al importar ventas:', error);
        res.status(500).json({ ok: false, message: 'Error al importar las ventas' });
    }
};
