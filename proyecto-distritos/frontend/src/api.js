// src/api.js
// Capa de comunicación con el backend — todas las llamadas fetch centralizadas

const BASE_URL = 'http://localhost:3000/api/distritos';

/**
 * Listar distritos con paginación y búsqueda.
 * @returns {{ data, pagination }}
 */
export async function fetchDistritos(page = 1, limit = 10, search = '') {
  const params = new URLSearchParams({ page, limit, search });
  const res    = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) throw new Error('Error al obtener los distritos.');
  return res.json();
}

/**
 * Obtener un distrito por ID.
 */
export async function fetchDistritoById(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error('Distrito no encontrado.');
  return res.json();
}

/**
 * Crear un nuevo distrito.
 */
export async function createDistrito(data) {
  const res = await fetch(BASE_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Error al crear el distrito.');
  return json;
}

/**
 * Actualizar un distrito.
 */
export async function updateDistrito(id, data) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Error al actualizar el distrito.');
  return json;
}

/**
 * Eliminar un distrito.
 */
export async function deleteDistrito(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Error al eliminar el distrito.');
  return json;
}
