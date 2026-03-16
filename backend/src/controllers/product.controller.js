const { Product } = require("../models");

// Crear producto
exports.createProduct = async (req, res) => {
  try {
    const { barbershop_id, name, description, price, image } = req.body;

    const product = await Product.create({
      barbershop_id,
      name,
      description,
      price,
      image,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("❌ Error creando producto:", err);
    res.status(500).json({ error: "Error al crear el producto" });
  }
};

// Obtener productos por barbería
exports.getProductsByBarbershop = async (req, res) => {
  try {
    const { barbershopId } = req.params;

    const products = await Product.findAll({
      where: {
        barbershop_id: barbershopId,
      },
      order: [["createdAt", "DESC"]],
    });

    res.json(products);
  } catch (err) {
    console.error("❌ Error obteniendo productos:", err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

// Actualizar producto
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    await product.update({
      name,
      description,
      price,
      image,
    });

    res.json(product);
  } catch (err) {
    console.error("❌ Error actualizando producto:", err);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
};

// Eliminar producto
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    await product.destroy();

    res.json({ message: "Producto eliminado correctamente" });
  } catch (err) {
    console.error("❌ Error eliminando producto:", err);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};
