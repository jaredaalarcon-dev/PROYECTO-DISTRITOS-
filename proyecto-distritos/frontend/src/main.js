// src/main.js
// Lógica principal: tabla, paginación, búsqueda y CRUD en index.html

import { fetchDistritos, deleteDistrito, fetchDistritoById, updateDistrito } from './api.js';

// ── Estado de la aplicación ──────────────────────────────────────────────
const state = {
  page:   1,
  limit:  10,
  search: '',
  total:  0,
  totalPages: 0,
};

// ── Referencias al DOM ───────────────────────────────────────────────────
const tableBody        = document.getElementById('tableBody');
const paginationInfo   = document.getElementById('paginationInfo');
const paginationCtrl   = document.getElementById('paginationControls');
const searchInput      = document.getElementById('searchInput');
const editModal        = document.getElementById('editModal');
const editId           = document.getElementById('editId');
const editNombre       = document.getElementById('editNombre');
const editCodPostal    = document.getElementById('editCodPostal');
const editAlcalde      = document.getElementById('editAlcalde');
const editNombreErr    = document.getElementById('editNombreErr');
const editCodErr       = document.getElementById('editCodErr');
const btnCancelEdit    = document.getElementById('btnCancelEdit');
const btnSaveEdit      = document.getElementById('btnSaveEdit');
const toastEl          = document.getElementById('toast');

// ── Helpers ──────────────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  toastEl.textContent = msg;
  toastEl.className   = `show ${type}`;
  clearTimeout(toastEl._timer);
  toastEl._timer = setTimeout(() => { toastEl.className = ''; }, 2800);
}

function setLoading() {
  tableBody.innerHTML = `<tr class="state-row"><td colspan="5"><span class="loading-dot">Cargando</span></td></tr>`;
}

function setEmpty(msg = 'No se encontraron registros') {
  tableBody.innerHTML = `<tr class="state-row"><td colspan="5">${msg}</td></tr>`;
}

// ── Renderizar tabla ─────────────────────────────────────────────────────
function renderTable(rows) {
  if (!rows.length) { setEmpty(); return; }

  tableBody.innerHTML = rows.map(d => `
    <tr>
      <td class="id-cell">#${d.id_dis}</td>
      <td>${escHtml(d.nom_dis)}</td>
      <td class="cod-cell">${escHtml(d.cod_postal)}</td>
      <td>${escHtml(d.alcalde || '—')}</td>
      <td>
        <div class="actions">
          <button class="btn-action btn-edit"   data-id="${d.id_dis}">Editar</button>
          <button class="btn-action btn-delete" data-id="${d.id_dis}">Eliminar</button>
        </div>
      </td>
    </tr>
  `).join('');

  tableBody.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => openEditModal(btn.dataset.id));
  });
  tableBody.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => handleDelete(btn.dataset.id));
  });
}

function escHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, c => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[c]));
}

// ── Renderizar paginación ────────────────────────────────────────────────
function renderPagination() {
  const { page, totalPages, total, limit } = state;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to   = Math.min(page * limit, total);
  paginationInfo.textContent = total === 0
    ? 'Sin resultados'
    : `Mostrando ${from}–${to} de ${total} registros`;

  let html = '';
  html += `<button class="page-btn" data-page="${page - 1}" ${page <= 1 ? 'disabled' : ''}>‹</button>`;

  const range = buildPageRange(page, totalPages);
  range.forEach(p => {
    if (p === '…') {
      html += `<button class="page-btn" disabled>…</button>`;
    } else {
      html += `<button class="page-btn ${p === page ? 'active' : ''}" data-page="${p}">${p}</button>`;
    }
  });

  html += `<button class="page-btn" data-page="${page + 1}" ${page >= totalPages ? 'disabled' : ''}>›</button>`;

  paginationCtrl.innerHTML = html;
  paginationCtrl.querySelectorAll('.page-btn[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      const newPage = parseInt(btn.dataset.page);
      if (newPage >= 1 && newPage <= totalPages) {
        state.page = newPage;
        loadData();
      }
    });
  });
}

function buildPageRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4)  return [1,2,3,4,5,'…',total];
  if (current >= total - 3) return [1,'…',total-4,total-3,total-2,total-1,total];
  return [1,'…',current-1,current,current+1,'…',total];
}

// ── Cargar datos ─────────────────────────────────────────────────────────
async function loadData() {
  setLoading();
  try {
    const json = await fetchDistritos(state.page, state.limit, state.search);
    state.total      = json.pagination.total;
    state.totalPages = json.pagination.totalPages;
    renderTable(json.data);
    renderPagination();
  } catch (err) {
    setEmpty('Error al cargar datos. Verifica que el servidor esté activo.');
    console.error(err);
  }
}

// ── Eliminar ─────────────────────────────────────────────────────────────
async function handleDelete(id) {
  if (!confirm(`¿Eliminar el distrito #${id}? Esta acción no se puede deshacer.`)) return;
  try {
    await deleteDistrito(id);
    showToast('Distrito eliminado correctamente.', 'success');
    if (state.page > 1 && state.total - 1 <= (state.page - 1) * state.limit) {
      state.page--;
    }
    loadData();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ── Modal Editar ──────────────────────────────────────────────────────────
async function openEditModal(id) {
  editNombreErr.textContent = '';
  editCodErr.textContent    = '';
  try {
    const json = await fetchDistritoById(id);
    editId.value        = json.data.id_dis;
    editNombre.value    = json.data.nom_dis;
    editCodPostal.value = json.data.cod_postal;
    editAlcalde.value   = json.data.alcalde || '';
    editModal.classList.add('open');
    editNombre.focus();
  } catch (err) {
    showToast('No se pudo cargar el distrito.', 'error');
  }
}

function closeEditModal() {
  editModal.classList.remove('open');
}

btnCancelEdit.addEventListener('click', closeEditModal);
editModal.addEventListener('click', e => { if (e.target === editModal) closeEditModal(); });

btnSaveEdit.addEventListener('click', async () => {
  editNombreErr.textContent = '';
  editCodErr.textContent    = '';
  let valid = true;

  if (!editNombre.value.trim()) {
    editNombreErr.textContent = 'El nombre es requerido.';
    valid = false;
  }
  if (!editCodPostal.value.trim()) {
    editCodErr.textContent = 'El código postal es requerido.';
    valid = false;
  }
  if (!valid) return;

  try {
    btnSaveEdit.disabled = true;
    await updateDistrito(editId.value, {
      nom_dis:    editNombre.value.trim(),
      cod_postal: editCodPostal.value.trim(),
      alcalde:    editAlcalde.value.trim() || null,
    });
    showToast('Distrito actualizado correctamente.', 'success');
    closeEditModal();
    loadData();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btnSaveEdit.disabled = false;
  }
});

// ── Buscador con debounce ────────────────────────────────────────────────
let searchTimer;
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    state.search = searchInput.value.trim();
    state.page   = 1;
    loadData();
  }, 350);
});

// ── Inicio ────────────────────────────────────────────────────────────────
if (new URLSearchParams(window.location.search).get('created') === '1') {
  window.history.replaceState({}, '', 'index.html');
  setTimeout(() => showToast('✓ Distrito creado correctamente.', 'success'), 200);
}

loadData();
