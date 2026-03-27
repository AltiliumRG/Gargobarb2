const { ShoppingCart, BarbershopSite } = require('../models');

exports.createShoppingCart = async (req, res) => {
    try {
        const { site_id, client_name, client_phone, items, total } = req.body;

        if (!site_id || !client_name || !items || items.length === 0) {
            return res.status(400).json({ ok: false, message: 'Faltan datos requeridos (site_id, client_name, items)' });
        }

        // Verify the site exists
        const site = await BarbershopSite.findByPk(site_id);
        if (!site) {
            return res.status(404).json({ ok: false, message: 'Sitio de barbería no encontrado' });
        }

        const newCart = await ShoppingCart.create({
            site_id,
            client_name,
            client_phone: client_phone || null,
            items,
            total: total || 0,
            status: 'pending'
        });

        res.status(201).json({
            ok: true,
            message: 'Carrito guardado correctamente',
            cart: newCart
        });
    } catch (error) {
        console.error('Error al guardar carrito:', error);
        res.status(500).json({ ok: false, message: 'Error interno al guardar el carrito' });
    }
};

exports.getShoppingCartsBySite = async (req, res) => {
    try {
        const { siteId } = req.params;
        const carts = await ShoppingCart.findAll({
            where: { site_id: siteId },
            order: [['created_at', 'DESC']]
        });

        res.json({ ok: true, carts });
    } catch (error) {
        console.error('Error al obtener carritos:', error);
        res.status(500).json({ ok: false, message: 'Error interno al obtener los carritos' });
    }
};
