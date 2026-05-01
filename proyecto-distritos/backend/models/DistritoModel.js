const supabase = require('../config/db');

const DistritoModel = {

  async getAll(page = 1, limit = 10, search = '') {
    const from = (page - 1) * limit;
    const to   = from + limit - 1;

    let query = supabase
      .from('distritos')
      .select('*', { count: 'exact' })
      .order('id_dis', { ascending: true })
      .range(from, to);

    if (search) {
      query = query.or(
        `nom_dis.ilike.%${search}%,cod_postal.ilike.%${search}%,id_dis::text.ilike.%${search}%,alcalde.ilike.%${search}%`
      );
    }

    const { data, count, error } = await query;
    if (error) throw new Error(error.message);

    return { rows: data, total: count };
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('distritos')
      .select('*')
      .eq('id_dis', id)
      .single();
    if (error) return null;
    return data;
  },

  async create(nom_dis, cod_postal, alcalde) {
    const { data, error } = await supabase
      .from('distritos')
      .insert([{ nom_dis, cod_postal, alcalde }])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data.id_dis;
  },

  async update(id, nom_dis, cod_postal, alcalde) {
    const { error } = await supabase
      .from('distritos')
      .update({ nom_dis, cod_postal, alcalde })
      .eq('id_dis', id);
    if (error) throw new Error(error.message);
    return 1;
  },

  async delete(id) {
    const { error } = await supabase
      .from('distritos')
      .delete()
      .eq('id_dis', id);
    if (error) throw new Error(error.message);
    return 1;
  },
};

module.exports = DistritoModel;