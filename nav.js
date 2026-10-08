/* Barra de navegación inferior. Se carga en todas las páginas; para cambiar botones, edita ITEMS. */
(function(){
  var ITEMS = [
    ['index', 'Inicio', '<svg viewBox="0 0 24 24"><path d="M4 11l8-7 8 7M6 10v10h12V10"/></svg>'],
    ['registro', 'Registro', '<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/></svg>'],
    ['estadisticas', 'Estadísticas', '<svg viewBox="0 0 24 24"><path d="M5 20V11M12 20V4M19 20v-6"/></svg>'],
    ['ingresos', 'Ingresos', '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M14.8 9.2c-.5-.9-1.5-1.4-2.8-1.4-1.6 0-2.7.8-2.7 2 0 3 5.6 1.2 5.6 4.2 0 1.2-1.2 2.1-2.9 2.1-1.4 0-2.5-.6-3-1.6M12 6.5v1.3M12 16.2v1.3"/></svg>'],
    ['buscar', 'Buscar', '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/></svg>']
  ];
  var actual = window.PAGINA || (location.pathname.split('/').pop().replace('.html', '') || 'index');
  var nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.innerHTML = ITEMS.map(function(i){
    var on = i[0] === actual;
    return '<a href="' + i[0] + '.html"' + (on ? ' class="on" aria-current="page"' : '') + '>' + i[2] + '<span>' + i[1] + '</span></a>';
  }).join('');
  document.body.appendChild(nav);
})();
