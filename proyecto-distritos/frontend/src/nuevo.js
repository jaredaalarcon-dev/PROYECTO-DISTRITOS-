// src/nuevo.js
// Lógica del formulario de creación de nuevo distrito

import { createDistrito } from './api.js';

const inputNombre    = document.getElementById('nom_dis');
const inputCodPostal = document.getElementById('cod_postal');
const errNom         = document.getElementById('errNom');
const errCod         = document.getElementById('errCod');
const btnGuardar     = document.getElementById('btnGuardar');
const globalError    = document.getElementById('globalError');

// Limpiar error al escribir
inputNombre.addEventListener('input',    () => { errNom.textContent = ''; inputNombre.classList.remove('invalid'); });
inputCodPostal.addEventListener('input', () => { errCod.textContent = ''; inputCodPostal.classList.remove('invalid'); });

// Validación del formulario
function validate() {
  let valid = true;
  if (!inputNombre.value.trim()) {
    errNom.textContent = 'El nombre del distrito es requerido.';
    inputNombre.classList.add('invalid');
    valid = false;
  }
  if (!inputCodPostal.value.trim()) {
    errCod.textContent = 'El código postal es requerido.';
    inputCodPostal.classList.add('invalid');
    valid = false;
  }
  return valid;
}

// Envío del formulario
btnGuardar.addEventListener('click', async () => {
  globalError.style.display = 'none';
  if (!validate()) return;

  btnGuardar.disabled      = true;
  btnGuardar.textContent   = 'Guardando…';

  try {
    await createDistrito({
      nom_dis:    inputNombre.value.trim(),
      cod_postal: inputCodPostal.value.trim(),
    });

    // Redirigir al índice con mensaje de éxito en URL
    window.location.href = 'index.html?created=1';
  } catch (err) {
    globalError.textContent   = err.message || 'Error inesperado al guardar.';
    globalError.style.display = 'block';
    btnGuardar.disabled       = false;
    btnGuardar.textContent    = 'Guardar Distrito';
  }
});

// Enviar con Enter
[inputNombre, inputCodPostal].forEach(input => {
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') btnGuardar.click();
  });
});
