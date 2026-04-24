import $ from "jquery";
import jszip from "jszip";
import DataTable from "datatables.net-bs5";
// import pdfmake from "pdfmake";

import 'datatables.net-buttons-bs5';
import 'datatables.net-buttons/js/buttons.colVis.mjs';
import 'datatables.net-buttons/js/buttons.html5.mjs';
import 'datatables.net-buttons/js/buttons.print.mjs';
import 'datatables.net-responsive-bs5';

DataTable.Buttons.jszip(jszip);
// DataTable.Buttons.pdfMake(pdfmake);

export const initDataTable = (tableElement: HTMLTableElement) => {
  $(tableElement).DataTable({
    info: true,
    ordering: true,
    paging: true,
    searching: true,
    responsive: true,
    scrollX: true,
    destroy: true,
    language: {
      info: 'Mostrando página _PAGE_ de _PAGES_',
      infoEmpty: 'No hay información disponible.',
      emptyTable: 'No hay registros disponibles.',
      infoFiltered: '(filtrado de _MAX_ registros)',
      lengthMenu: 'Mostrar _MENU_ registros por página',
      zeroRecords: 'No se encontraron resultados en la búsqueda',
      search: 'Buscar:',
    },
    layout: {
      bottomEnd: {
        paging: {
          type: 'simple_numbers',
          firstLast: true,
          numbers: true,
          buttons: 5,
          boundaryNumbers: true
        }
      },
      topStart: {
        pageLength: {
          menu: [5, 10, 25, 50, 100, 1000]
        }
      },
      top1Start: {
        buttons: [
          {
            extend: 'copy',
            text: '<i class="ti ti-copy">  Copiar',
            titleAttr: 'Copiar',
            attr: { class: 'btn btn-light-primary' }
          },
          'spacer',
          {
            extend: 'print',
            text: '<i class="ti ti-printer"></i> Imprimir',
            titleAttr: 'Imprimir',
            attr: { class: 'btn btn-light-primary' }
          },
          'spacer',
          {
            extend: 'collection',
            text: '<i class="ti ti-table-export"></i> Exportar',
            titleAttr: 'Exportar',
            attr: { class: 'btn btn-light-primary' },
            buttons: ['csv', 'pdf', 'excel']
          },
          'spacer',
          {
            extend: 'colvis',
            text: '<i class="ti ti-eye-check"></i> Columnas visibles',
            titleAttr: 'Columnas visibles',
            attr: { class: 'btn btn-light-primary' },
            popoverTitle: 'Columnas',
            collectionLayout: 'one-column'
          }
        ]
      },/*
      top1: [
        {
          buttons: [
            {
              text: 'Action 1',
              key: '1',
              action: () => alert('Action 1 activated'),
              attr: { id: 'id_0', class: 'btn btn-outline btn-light-primary' }
            },
            'spacer',
            {
              text: 'Action 2',
              attr: { id: 'id_1', class: 'btn btn-outline btn-light-primary' }
            },
            'spacer',
            {
              text: 'Action 3',
              attr: { id: 'id_2', class: 'btn btn-outline btn-light-primary' }
            }
          ]
        },
        {},
        { div: {} }
      ]*/
    }
  });
};
