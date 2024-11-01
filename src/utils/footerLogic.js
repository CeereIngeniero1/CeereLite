
export const reset = async () => {
    document.getElementById('listaTipoRips').value = 'Sin Seleccionar';
    document.getElementById('listaEntidad').value = 'Sin Seleccionar';
    document.getElementById('listaViaIngreso').value = 'Sin Seleccionar';
    document.getElementById('listamodalidadAtencion').value = 'Sin Seleccionar';
    document.getElementById('listaGrupoServicios').value = 'Sin Seleccionar';
    document.getElementById('listaServicios').value = 'Sin Seleccionar';
    document.getElementById('listaFinalidad').value = 'Sin Seleccionar';
    document.getElementById('listaCausaMotivo').value = 'Sin Seleccionar';
    document.getElementById('listaTipoDiag').value = 'Sin Seleccionar';
    document.getElementById('listaComplica').value = 'Sin Seleccionar';
    document.getElementById('listaCodConsulta').value = 'Sin Seleccionar';
    document.getElementById('listaCodConsulta2').value = 'Sin Seleccionar';
    document.getElementById('listaDiag').value = 'Sin Seleccionar';
    document.getElementById('listaDiag2').value = 'Sin Seleccionar';
    document.getElementById('inputCodConsulta').value = '';
    document.getElementById('inputDiag').value = '';
    const radioButtons = document.querySelectorAll('input[name="tipoRIPS"]');
    radioButtons.forEach(radio => {
        radio.checked = false;
    });
}