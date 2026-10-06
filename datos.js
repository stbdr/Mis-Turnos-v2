/* Datos compartidos: guardado, constantes y cálculos. Lo usan todas las páginas. */
const Datos = (() => {
  const K = {data:'turnos_data_v2', settings:'turnos_settings_v2', neto:'turnos_neto_v1', companeros:'turnos_companeros_v1', retenciones:'turnos_retenciones_v1'};
  const TURNOS = ['M','T','N','MA','L'];
  const NOMBRES = {M:'Mañana', T:'Tarde', N:'Noche', MA:'Madrugada', L:'Libre'};
  const EMPRESAS = ['OPCSA','La Luz','Gesport'];
  const PUESTOS = ['Especialista','Maffi','Trastainer','Trinca'];
  const PUESTO_DEFECTO = 'Especialista';
  const ABREV = {OPCSA:'OP', 'La Luz':'LL', Gesport:'GS'};
  const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

  // Valores iniciales de Ajustes (se pueden cambiar desde la página Ajustes)
  const RET_DEF = {irpfPct:0, ss:201.68, fijo:2.64, sindical:40.61, anticipos:0, prestamos:0, otras:0, telefono:0, seguro:0};
  const TIPOS_TARIFA = [['Mañana/tarde',''],['Noche',''],['Mañana/tarde','festivo'],['Noche','festivo'],['Mañana','sábado'],['Madrugada',''],['Madrugada','festivo']];
  const UNIDAD_BASE = [0.90, 1.37, 1.27, 1.71, 1.04, 1.79, 2.08];
  const TARIFAS_BASE = {
    Especialista:[97, 140, 132, 182, 111, 180, 200],
    Maffi:[129, 187, 176, 242, 149, 239, 266],
    Trastainer:[0, 0, 0, 0, 0, 0, 0],
    Trinca:[0, 0, 0, 0, 0, 0, 0]
  };
  const MOV_BASE = {Especialista:120, Maffi:138, Trastainer:0, Trinca:0};

  const leer = (k, def) => { try { return JSON.parse(localStorage.getItem(k)) || def; } catch(e){ return def; } };
  const data = leer(K.data, {});
  const settings = leer(K.settings, {M:{horas:6}, T:{horas:6}, N:{horas:6}, MA:{horas:6}});
  const neto = leer(K.neto, {});
  const retenciones = leer(K.retenciones, {}); // { '2026-10': {irpfPct, irpfEur, irpfModo, ss, ...} }
  const companeros = leer(K.companeros, []);   // [{censo, nombre}]

  function guardar(){
    try{
      localStorage.setItem(K.data, JSON.stringify(data));
      localStorage.setItem(K.settings, JSON.stringify(settings));
      localStorage.setItem(K.neto, JSON.stringify(neto));
      localStorage.setItem(K.companeros, JSON.stringify(companeros));
      localStorage.setItem(K.retenciones, JSON.stringify(retenciones));
    }catch(e){}
  }
  const clave = (y, m) => y + '-' + String(m+1).padStart(2,'0');
  const mes = (y, m) => data[clave(y,m)] || {};
  const dia = (y, m, d) => mes(y,m)[d] || null;

  function ponerDia(y, m, d, entrada){
    const k = clave(y,m);
    if(!data[k]) data[k] = {};
    if(entrada) data[k][d] = entrada; else delete data[k][d];
    guardar();
  }

  function porNombre(n){
    n = String(n || '').trim().toLowerCase();
    return n ? (companeros.find(c => c.nombre.toLowerCase() === n) || null) : null;
  }
  function porCenso(x){
    x = String(x || '').trim();
    return x ? (companeros.find(c => String(c.censo) === x) || null) : null;
  }
  function recordarCompanero(censo, nombre){
    censo = String(censo || '').trim(); nombre = String(nombre || '').trim();
    if(!censo || !nombre) return;
    const c = companeros.find(c => String(c.censo) === censo);
    if(c) c.nombre = nombre; else companeros.push({censo, nombre});
  }

  function retDefecto(){ return Object.assign({}, RET_DEF, settings.retDefecto || {}); }
  function tarifas(){
    const t = {unidad: UNIDAD_BASE.slice(), puestos: {}};
    PUESTOS.forEach(p => t.puestos[p] = {base: MOV_BASE[p], valores: TARIFAS_BASE[p].slice()});
    const s = settings.tarifas;
    if(s){
      if(Array.isArray(s.unidad)) t.unidad = s.unidad.slice();
      PUESTOS.forEach(p => {
        const sp = s.puestos && s.puestos[p];
        if(!sp) return;
        if(sp.base !== undefined) t.puestos[p].base = sp.base;
        if(Array.isArray(sp.valores)) t.puestos[p].valores = sp.valores.slice();
      });
    }
    return t;
  }

  const vaciar = o => Object.keys(o).forEach(k => delete o[k]);
  function exportar(){
    return {version: 2, fecha: new Date().toISOString(), data, settings, neto, retenciones, companeros};
  }
  // Acepta copias nuevas y las de la app antigua (solo data y settings).
  function importar(p){
    if(!p || typeof p !== 'object' || !p.data || typeof p.data !== 'object') throw new Error('formato');
    vaciar(data); Object.assign(data, p.data);
    if(p.settings){ vaciar(settings); Object.assign(settings, p.settings); }
    if(p.neto){ vaciar(neto); Object.assign(neto, p.neto); }
    if(p.retenciones){ vaciar(retenciones); Object.assign(retenciones, p.retenciones); }
    if(Array.isArray(p.companeros)){ companeros.length = 0; companeros.push(...p.companeros); }
    guardar();
  }
  function contar(datos){
    let meses = 0, dias = 0;
    Object.values(datos || {}).forEach(m => { const n = Object.keys(m).length; if(n){ meses++; dias += n; } });
    return {meses, dias};
  }

  function resumen(y, m){
    const r = {cuenta:{M:0,T:0,N:0,MA:0,L:0}, turnos:0, horas:0, movimientos:0, salario:0, extra:0};
    Object.values(mes(y,m)).forEach(e => {
      if(e.shift) r.cuenta[e.shift]++;
      if(e.shift && e.shift !== 'L'){ r.turnos++; r.horas += (settings[e.shift] && settings[e.shift].horas) || 0; }
      r.movimientos += parseFloat(e.movimientos) || 0;
      r.salario += parseFloat(e.salario) || 0;
      r.extra += parseFloat(e.extra) || 0;
    });
    return r;
  }

  return {retDefecto, tarifas, TIPOS_TARIFA, exportar, importar, contar, retenciones, companeros, porNombre, porCenso, recordarCompanero, TURNOS, NOMBRES, EMPRESAS, PUESTOS, PUESTO_DEFECTO, ABREV, MESES, data, settings, neto, guardar, clave, mes, dia, ponerDia, resumen};
})();
