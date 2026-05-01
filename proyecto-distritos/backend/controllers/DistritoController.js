const DistritoModel = require('../models/DistritoModel');

const DistritoController = {

  async index(req, res) {
    try {
      const page   = Math.max(1, parseInt(req.query.page)  || 1);
      const limit  = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
      const search = (req.query.search || '').trim();

      const { rows, total } = await DistritoModel.getAll(page, limit, search);
      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: rows,
        pagination: { page, limit, total, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
      });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error al obtener distritos.' });
    }
  },

  async show(req, res) {
    try {
      const distrito = await DistritoModel.getById(req.params.id);
      if (!distrito) return res.status(404).json({ success: false, message: 'Distrito no encontrado.' });
      res.json({ success: true, data: distrito });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error al obtener el distrito.' });
    }
  },

  async store(req, res) {
    try {
      const { nom_dis, cod_postal, alcalde } = req.body;

      if (!nom_dis || !nom_dis.trim())
        return res.status(422).json({ success: false, message: 'El nombre del distrito es requerido.' });
      if (!cod_postal || !cod_postal.trim())
        return res.status(422).json({ success: false, message: 'El código postal es requerido.' });

      const insertId = await DistritoModel.create(nom_dis, cod_postal, alcalde || null);
      res.status(201).json({
        success: true,
        message: 'Distrito creado correctamente.',
        data: { id_dis: insertId, nom_dis, cod_postal, alcalde },
      });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error al crear el distrito.' });
    }
  },

  async update(req, res) {
    try {
      const { nom_dis, cod_postal, alcalde } = req.body;
      const { id } = req.params;

      if (!nom_dis || !nom_dis.trim())
        return res.status(422).json({ success: false, message: 'El nombre del distrito es requerido.' });
      if (!cod_postal || !cod_postal.trim())
        return res.status(422).json({ success: false, message: 'El código postal es requerido.' });

      const existing = await DistritoModel.getById(id);
      if (!existing) return res.status(404).json({ success: false, message: 'Distrito no encontrado.' });

      await DistritoModel.update(id, nom_dis, cod_postal, alcalde || null);
      res.json({ success: true, message: 'Distrito actualizado correctamente.' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error al actualizar el distrito.' });
    }
  },

  async destroy(req, res) {
    try {
      const existing = await DistritoModel.getById(req.params.id);
      if (!existing) return res.status(404).json({ success: false, message: 'Distrito no encontrado.' });

      await DistritoModel.delete(req.params.id);
      res.json({ success: true, message: 'Distrito eliminado correctamente.' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error al eliminar el distrito.' });
    }
  },
};

module.exports = DistritoController;