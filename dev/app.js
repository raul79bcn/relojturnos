var DIAS=['Lunes','Martes','Mi\u00e9rcoles','Jueves','Viernes','S\u00e1bado','Domingo'];
var DIAS_SHORT=['LUN','MAR','MI\u00c9','JUE','VIE','S\u00c1B','DOM'];
var COLORS=['#e74c3c','#3498db','#2ecc71','#9b59b6','#e67e22','#1abc9c','#e91e63','#ff9800'];
var ROLES=['Resp. Ma\u00f1ana','Resp. Noche','Cam. Ma\u00f1ana','Cam. Noche','Cam. Tarde','Cam. Intermedio','Cocinero','Ayud. Cocina','Encargado','Barman'];

// ========== COMPRAS DATA ==========
var cmpFamilias=[], cmpArticulos=[], cmpProveedores=[], cmpPrecios=[];
var cmpTabActual='articulos', cmpAnTabActual='margen';

// ========== SUPABASE CONFIG ==========
const SUPA_URL = 'https://ttewezdnroiqtetmgyrh.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0ZXdlemRucm9pcXRldG1neXJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3OTExMDIsImV4cCI6MjA4ODM2NzEwMn0.mA5tWItknmHmBe7-8AZpN9579RRwEaM3ZybYpQBc2Pw';

async function sbGet(table, filters){
  var url = SUPA_URL+'/rest/v1/'+table+'?'+( filters||'order=id.asc');
  var r = await fetch(url,{headers:{'apikey':SUPA_KEY,'Authorization':'Bearer '+SUPA_KEY,'Content-Type':'application/json'}});
  if(!r.ok) throw new Error('GET '+table+' error '+r.status);
  return r.json();
}

async function sbPost(table, data){
  var r = await fetch(SUPA_URL+'/rest/v1/'+table,{
    method:'POST',
    headers:{'apikey':SUPA_KEY,'Authorization':'Bearer '+SUPA_KEY,'Content-Type':'application/json','Prefer':'return=representation'},
    body:JSON.stringify(data)
  });
  if(!r.ok){var e=await r.text();throw new Error('POST '+table+' error '+r.status+': '+e);}
  return r.json();
}

async function sbPatch(table, id, data){
  var r = await fetch(SUPA_URL+'/rest/v1/'+table+'?id=eq.'+id,{
    method:'PATCH',
    headers:{'apikey':SUPA_KEY,'Authorization':'Bearer '+SUPA_KEY,'Content-Type':'application/json','Prefer':'return=representation'},
    body:JSON.stringify(data)
  });
  if(!r.ok) throw new Error('PATCH '+table+' error '+r.status);
  return r.json();
}

async function sbDelete(table, filters){
  var r = await fetch(SUPA_URL+'/rest/v1/'+table+'?'+filters,{
    method:'DELETE',
    headers:{'apikey':SUPA_KEY,'Authorization':'Bearer '+SUPA_KEY}
  });
  if(!r.ok) throw new Error('DELETE '+table+' error '+r.status);
}

// ========== AUDIT LOG RENDER ==========

var AUDIT_ICONOS = {
  LOGIN:'🔑', GUARDAR_CUADRANTE:'📅', ACTUALIZAR_CUADRANTE:'🔄',
  GUARDAR_ARQUEO:'💰', EDITAR_ARQUEO:'✏️', CREAR_USUARIO:'👤',
  CAMBIAR_PASSWORD:'🔒'
};
var AUDIT_COLORES = {
  LOGIN:'var(--blue)', GUARDAR_CUADRANTE:'var(--green)', ACTUALIZAR_CUADRANTE:'var(--orange)',
  GUARDAR_ARQUEO:'var(--accent)', EDITAR_ARQUEO:'#ffc107', CREAR_USUARIO:'var(--purple)',
  CAMBIAR_PASSWORD:'var(--muted)'
};
var LOCALES_NOMBRE = {1:'La Cala', 2:"Roto's Burguer"};

function renderAuditRows(rows){
  if(!rows||!rows.length) return '<div style="color:var(--muted);font-size:11px;text-align:center;padding:20px">'+t('audit_sin_registros')+'</div>';
  return rows.map(function(r){
    var icono = AUDIT_ICONOS[r.accion] || '📋';
    var col   = AUDIT_COLORES[r.accion] || 'var(--muted)';
    var fecha = r.created_at ? new Date(r.created_at).toLocaleString('es-ES',{day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit'}) : '—';
    var localTxt = r.local_id ? (LOCALES_NOMBRE[r.local_id]||'Local '+r.local_id) : '—';
    return '<div style="display:flex;align-items:flex-start;gap:10px;padding:7px 6px;border-bottom:1px solid var(--border)20">'
      +'<div style="font-size:16px;flex-shrink:0;margin-top:1px">'+icono+'</div>'
      +'<div style="flex:1;min-width:0">'
      +'<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">'
      +'<span style="font-size:11px;font-weight:700;color:'+col+'">'+r.accion+'</span>'
      +'<span style="font-size:10px;color:var(--muted)">·</span>'
      +'<span style="font-size:10px;font-weight:600;color:var(--text)">'+r.usuario_nombre+'</span>'
      +'<span style="font-size:9px;color:var(--muted);background:var(--card);padding:1px 5px;border-radius:4px">'+r.rol+'</span>'
      +'<span style="font-size:9px;color:var(--muted)">'+localTxt+'</span>'
      +'</div>'
      +(r.detalle?'<div style="font-size:10px;color:var(--muted);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+r.detalle+'</div>':'')
      +'</div>'
      +'<div style="font-size:9px;color:var(--muted);flex-shrink:0;white-space:nowrap">'+fecha+'</div>'
      +'</div>';
  }).join('');
}

async function cargarAuditLog(){
  var el = document.getElementById('director-audit');
  if(!el) return;
  el.innerHTML = '<div style="color:var(--muted);font-size:11px;text-align:center;padding:14px">'+t('audit_cargando')+'</div>';
  try{
    var filtros = 'order=created_at.desc&limit=50';
    var fLocal  = (document.getElementById('audit-filtro-local')||{}).value;
    var fAccion = (document.getElementById('audit-filtro-accion')||{}).value;
    if(fLocal)  filtros = 'local_id=eq.'+fLocal+'&'+filtros;
    if(fAccion) filtros = 'accion=eq.'+fAccion+'&'+filtros;
    var rows = await sbGet('audit_log', filtros);
    el.innerHTML = renderAuditRows(rows);
  }catch(e){
    el.innerHTML = '<div style="color:var(--red);font-size:11px;text-align:center;padding:14px">⚠ Error: '+e.message+'</div>';
  }
}

async function cargarMiActividad(){
  var el = document.getElementById('portal-actividad');
  if(!el||!currentUser) return;
  el.innerHTML = '<div style="padding:16px"><div style="font-size:13px;font-weight:700;color:var(--accent);margin-bottom:12px">'+t('portal_mi_actividad')+'</div>'
    +'<div id="mi-actividad-list"><div style="color:var(--muted);font-size:11px;text-align:center;padding:14px">'+t('audit_cargando')+'</div></div></div>';
  try{
    var rows = await sbGet('audit_log','usuario_dni=eq.'+encodeURIComponent(currentUser.dni)+'&order=created_at.desc&limit=30');
    document.getElementById('mi-actividad-list').innerHTML = renderAuditRows(rows);
  }catch(e){
    document.getElementById('mi-actividad-list').innerHTML = '<div style="color:var(--red);font-size:11px;text-align:center;padding:14px">⚠ '+t('err_datos_contrato')+'</div>';
  }
}


async function logAccion(accion, detalle, localId){
  if(!currentUser) return;
  // Fire-and-forget — no bloquea la UI si falla
  try{
    await sbPost('audit_log',{
      usuario_nombre: currentUser.nombre || currentUser.dni,
      usuario_dni:    currentUser.dni,
      rol:            currentUser.rol,
      accion:         accion,
      detalle:        detalle || null,
      local_id:       localId || currentUser.local_id || null
    });
  }catch(e){ console.warn('audit_log error (no crítico):', e.message); }
}


var localIdMap = {};   // {'La Cala': 1, "Roto's Burguer": 2}
var empIdMap   = {};   // {empCounter_local_id: supabase_id}
var currentCuadranteId = null;

// ===================== AUTH / LOGIN =====================
var currentUser = null; // {id, dni, nombre, rol, local_id, empleado_id}

// Hash simple SHA-256 para contraseñas
async function hashPass(str){
  var buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(function(b){return b.toString(16).padStart(2,'0');}).join('');
}

async function doLogin(){
  var dni = (document.getElementById('login-dni').value||'').trim().toUpperCase();
  var pass = (document.getElementById('login-pass').value||'').trim();
  var errEl = document.getElementById('login-error');
  errEl.style.display = 'none';

  if(!dni || !pass){
    errEl.textContent = 'Introduce tu DNI/NIE y contraseña';
    errEl.style.display = 'block'; return;
  }

  try{
    var passHash = await hashPass(pass);
    // Comprobar usuarios demo primero
    var DEMO_USERS = [
      {id:0, dni:'DEMO0001', password_hash:'', rol:'directora', nombre:'LORENA (DEMO)', local_id:1, empleado_id:null},
      {id:0, dni:'DEMO0002', password_hash:'', rol:'directora_general', nombre:'MIRYAM (DEMO)', local_id:null, empleado_id:null},
    ];
    var demoUser = DEMO_USERS.find(function(u){ return u.dni===dni; });
    if(demoUser && pass==='1234'){
      currentUser = demoUser;
      document.getElementById('login-screen').style.display='none';
      checkMostrarBtnUsuarios();
      if(demoUser.rol==='directora_general'){
        document.querySelector('header').style.display='';
        document.querySelector('.container').style.display='';
        abrirVistaDirector();
      } else {
        document.querySelector('header').style.display='';
        document.querySelector('.container').style.display='';
        abrirDashboard();
        showToast(t('toast_bienvenida')+demoUser.nombre,'green');
      }
      return;
    }
    var rows = await sbGet('usuarios','dni=eq.'+encodeURIComponent(dni)+'&activo=eq.true');
    if(!rows.length){ errEl.textContent=t('login_error'); errEl.style.display='block'; return; }
    var user = rows[0];
    if(user.password_hash !== passHash){
      errEl.textContent=t('login_error'); errEl.style.display='block'; return;
    }
    currentUser = user;
    document.getElementById('login-screen').style.display = 'none';
    checkMostrarBtnUsuarios();
    aplicarTraducciones();
    logAccion('LOGIN', 'Acceso correcto', user.local_id);
    if(user.rol === 'empleado'){
      abrirPortalEmpleado(user);
    } else if(user.rol === 'directora_general'){
      document.getElementById('portal-empleado').style.display = 'none';
      document.querySelector('header').style.display = '';
      document.querySelector('.container').style.display = '';
      abrirVistaDirector();
    } else {
      // directora / admin — acceso completo
      document.querySelector('header').style.display = '';
      document.querySelector('.container').style.display = '';
      abrirDashboard();
      showToast(t('toast_bienvenida')+user.nombre,'green');
    }
  }catch(e){
    var OFFLINE_USERS = [
      {dni:'23842646H', password_hash:'fcd3ea094503446af61291a741292e480275f1f5c9f4660ebcf885880a2109fe', rol:'directora', nombre:'LORENA', local_id:1},
      {dni:'DEMO0002',  password_hash:'03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', rol:'directora_general', nombre:'MIRYAM', local_id:null},
      {dni:'DEMO0001',  password_hash:'03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', rol:'directora', nombre:'LORENA (DEMO)', local_id:1},
    ];
    var offlineUser = OFFLINE_USERS.find(function(u){ return u.dni===dni; });
    if(offlineUser && offlineUser.password_hash === passHash){
      currentUser = offlineUser;
      document.getElementById('login-screen').style.display='none';
      document.querySelector('header').style.display='';
      document.querySelector('.container').style.display='';
      if(offlineUser.rol==='directora_general'){ abrirVistaDirector(); } else { abrirDashboard(); }
      showToast(t('toast_bienvenida')+offlineUser.nombre,'green');
    } else {
      errEl.textContent=t('login_error');
      errEl.style.display='block';
    }
  }
}

function doLogout(){
  currentUser = null;
  document.getElementById('portal-empleado').style.display='none';
  document.getElementById('login-screen').style.display='flex';
  document.getElementById('login-dni').value='';
  document.getElementById('login-pass').value='';
  document.getElementById('login-error').style.display='none';
}

async function abrirPortalEmpleado(user){
  var portal = document.getElementById('portal-empleado');
  portal.style.display = 'block';
  document.querySelector('header').style.display = 'none';
  document.querySelector('.container').style.display = 'none';

  // Cabecera
  var nombre = user.nombre || user.dni;
  document.getElementById('portal-avatar').textContent = nombre.substring(0,2).toUpperCase();
  document.getElementById('portal-nombre').textContent = nombre;

  // Cargar local
  try{
    var locs = await sbGet('locales','id=eq.'+user.local_id);
    document.getElementById('portal-local').textContent = locs.length ? locs[0].nombre : '—';
  }catch(e){ document.getElementById('portal-local').textContent = '—'; }

  portalTab('cuadrante');
  await cargarPortalCuadrante(user);
  await cargarPortalContrato(user);
}

function portalTab(tab){
  ['cuadrante','contrato','actividad','password'].forEach(function(t){
    var el = document.getElementById('portal-'+t);
    if(el) el.style.display = t===tab?'block':'none';
  });
  document.querySelectorAll('.portal-tab').forEach(function(btn, i){
    btn.classList.toggle('active', ['cuadrante','contrato','actividad','password'][i]===tab);
  });
  if(tab==='actividad') cargarMiActividad();
}

async function cargarPortalCuadrante(user){
  var el = document.getElementById('portal-cuadrante');
  el.innerHTML = '<div style="color:var(--muted);font-size:12px;padding:20px;text-align:center">'+t('portal_cargando_cuad')+'</div>';
  try{
    // Cargar cuadrante más reciente del local
    var cuads = await sbGet('cuadrantes','local_id=eq.'+user.local_id+'&order=id.desc&limit=1');
    if(!cuads.length){ el.innerHTML='<div style="color:var(--muted);padding:20px;text-align:center">'+t('portal_no_cuad')+'</div>'; return; }
    var cuad = cuads[0];
    var turnos = await sbGet('turnos_cuadrante','cuadrante_id=eq.'+cuad.id);
    var emps = await sbGet('empleados','local_id=eq.'+user.local_id+'&activo=eq.true');
    renderPortalCuadrante(el, cuad, emps, turnos, user.empleado_id);
  }catch(e){
    el.innerHTML='<div style="color:#ff8080;padding:20px;text-align:center">'+t('portal_error_cuad')+'</div>';
  }
}

function renderPortalCuadrante(el, cuad, emps, turnos, miEmpId){
  var DIAS_S = ['L','M','X','J','V','S','D'];
  var TURNO_LABEL = {manana:'M',noche:'N',tarde:'T',intermedio:'I',fiesta:'🏖',mediafiesta:'½'};
  var TURNO_COLOR = {manana:'var(--green)',noche:'#6b8fff',tarde:'#ffa040',intermedio:'#c080ff',fiesta:'#ff6b6b',mediafiesta:'#ffaa40'};

  var html = '<div style="font-size:11px;font-weight:700;color:var(--muted);margin-bottom:10px;text-align:center">'+cuad.semana_label+'</div>';
  html += '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:10px">';
  html += '<thead><tr><th style="padding:6px 4px;text-align:left;border-bottom:1px solid var(--border);color:var(--muted)">'+t('col_empleado')+'</th>';
  DIAS_S.forEach(function(d){ html += '<th style="padding:6px 3px;text-align:center;border-bottom:1px solid var(--border);color:var(--muted)">'+d+'</th>'; });
  html += '</tr></thead><tbody>';

  emps.forEach(function(emp){
    var esMio = emp.id === miEmpId;
    var bg = esMio ? 'background:var(--accent)15;' : '';
    var nameCol = esMio ? 'color:var(--accent);font-weight:700' : 'color:var(--text)';
    html += '<tr style="'+bg+'">';
    html += '<td style="padding:6px 4px;border-bottom:1px solid var(--border)20;'+nameCol+'">'+(esMio?'👤 ':'')+emp.nombre+'</td>';
    for(var d=0; d<7; d++){
      var t = (turnos.find(function(x){ return x.empleado_id===emp.id && x.dia===d; })||{}).turno || emp.turno_habitual || '—';
      var col = TURNO_COLOR[t] || 'var(--muted)';
      var lbl = TURNO_LABEL[t] || t.substring(0,1).toUpperCase();
      html += '<td style="padding:5px 2px;text-align:center;border-bottom:1px solid var(--border)20"><span style="font-weight:700;color:'+col+'">'+lbl+'</span></td>';
    }
    html += '</tr>';
  });
  html += '</tbody></table></div>';
  html += '<div style="margin-top:10px;font-size:10px;color:var(--muted);display:flex;gap:10px;flex-wrap:wrap">';
  [{l:'M',c:'var(--green)',tk:'turno_m_label'},{l:'N',c:'#6b8fff',tk:'turno_n_label'},{l:'T',c:'#ffa040',tk:'turno_t_label'},{l:'I',c:'#c080ff',tk:'turno_i_label'},{l:'🏖',c:'#ff6b6b',tk:'turno_fiesta'},{l:'½',c:'#ffaa40',tk:'turno_mediafiesta'}]
    .forEach(function(x){ html += '<span><strong style="color:'+x.c+'">'+x.l+'</strong> '+t(x.tk)+'</span>'; });
  html += '</div>';
  el.innerHTML = html;
}

async function cargarPortalContrato(user){
  var el = document.getElementById('portal-contrato');
  try{
    var sals = await sbGet('salarios','empleado_id=eq.'+user.empleado_id);
    var sal = sals.length ? sals[0] : null;
    var emps = await sbGet('empleados','id=eq.'+user.empleado_id);
    var emp = emps.length ? emps[0] : null;
    if(!sal && !emp){ el.innerHTML='<div style="color:var(--muted);padding:20px;text-align:center">'+t('portal_no_contrato')+'</div>'; return; }
    el.innerHTML = '<div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:16px;margin-top:4px">'
      +'<div style="font-size:13px;font-weight:700;color:var(--accent);margin-bottom:14px">'+t('portal_mis_datos')+'</div>'
      +(emp?'<div style="margin-bottom:8px;font-size:12px"><span style="color:var(--muted)">'+t('portal_nombre')+'</span> <strong>'+emp.nombre+'</strong></div>':'')
      +(emp?'<div style="margin-bottom:8px;font-size:12px"><span style="color:var(--muted)">'+t('portal_rol_lbl')+'</span> <strong>'+emp.rol+'</strong></div>':'')
      +(sal?'<div style="margin-bottom:8px;font-size:12px"><span style="color:var(--muted)">'+t('portal_sal_bruto')+'</span> <strong style="color:var(--green)">'+sal.bruto_mes+' €</strong></div>':'')
      +(sal?'<div style="margin-bottom:8px;font-size:12px"><span style="color:var(--muted)">'+t('portal_h_contrato')+'</span> <strong>'+sal.horas_contrato+'h</strong></div>':'')
      +'<div style="margin-top:14px;font-size:10px;color:var(--muted);border-top:1px solid var(--border);padding-top:10px">'+t('nominas_proximamente')+'</div>'
      +'</div>';
  }catch(e){
    el.innerHTML='<div style="color:#ff8080;padding:20px;text-align:center">'+t('portal_error_contrato')+'</div>';
  }
}

async function cambiarPassword(){
  var actual = document.getElementById('pass-actual').value;
  var nueva = document.getElementById('pass-nueva').value;
  var repite = document.getElementById('pass-repite').value;
  var errEl = document.getElementById('pass-error');
  var okEl = document.getElementById('pass-ok');
  errEl.style.display='none'; okEl.style.display='none';

  if(!actual||!nueva||!repite){ errEl.textContent=t('err_rellena'); errEl.style.display='block'; return; }
  if(nueva.length<4){ errEl.textContent=t('err_pass_min'); errEl.style.display='block'; return; }
  if(nueva!==repite){ errEl.textContent=t('err_pass_no_coincide'); errEl.style.display='block'; return; }

  try{
    var actualHash = await hashPass(actual);
    var rows = await sbGet('usuarios','id=eq.'+currentUser.id);
    if(!rows.length||rows[0].password_hash!==actualHash){ errEl.textContent=t('toast_password_incorrecta'); errEl.style.display='block'; return; }
    var nuevaHash = await hashPass(nueva);
    await sbPatch('usuarios', currentUser.id, {password_hash: nuevaHash});
    logAccion('CAMBIAR_PASSWORD', 'Contraseña actualizada', currentUser.local_id);
    okEl.style.display='block';
    document.getElementById('pass-actual').value='';
    document.getElementById('pass-nueva').value='';
    document.getElementById('pass-repite').value='';
  }catch(e){
    errEl.textContent=t('err_cambiar_pass');
    errEl.style.display='block';
  }
}

async function initSupabase(){
  try{
    var locs = await sbGet('locales');
    if(locs && locs.length){
      locs.forEach(function(l){ localIdMap[l.nombre]=l.id; });
      showToast(t('toast_conectado'),'green');
    } else {
      // Tabla locales vacía — usar fallback hardcoded
      localIdMap['La Cala'] = 1;
      localIdMap["Roto's Burguer"] = 2;
      showToast(t('toast_conectado_default'),'green');
    }
  }catch(e){
    // Sin tabla locales — usar fallback
    localIdMap['La Cala'] = 1;
    localIdMap["Roto's Burguer"] = 2;
    showToast(t('toast_sin_tabla'),'orange');
  }
}

function showToast(msg, color){
  var t=document.getElementById('toast');
  if(!t){
    t=document.createElement('div');
    t.id='toast';
    t.style.cssText='position:fixed;bottom:20px;left:50%;transform:translateX(-50%);padding:10px 20px;border-radius:8px;font-size:12px;font-weight:700;z-index:9999;transition:opacity .5s';
    document.body.appendChild(t);
  }
  t.textContent=msg;
  t.style.background=color==='green'?'#1a4a2a':color==='orange'?'#3d2a00':'#3d1a1a';
  t.style.border='1px solid '+(color==='green'?'#2ecc71':color==='orange'?'var(--orange)':'var(--red)');
  t.style.color=color==='green'?'#2ecc71':color==='orange'?'var(--orange)':'var(--red)';
  t.style.opacity='1';
  setTimeout(function(){t.style.opacity='0';},3000);
}

// ========== GUARDAR CUADRANTE EN BD ==========
async function guardarCuadranteEnBD(){
  var local = getLocal();
  var localId = localIdMap[local];
  // Fallback: si el mapa no tiene el local, intentar hardcoded
  if(!localId){
    if(local === 'La Cala') localId = 1;
    else if(local === "Roto's Burguer") localId = 2;
  }
  if(!localId){ showToast(t('toast_local_no_encontrado'),'red'); return; }

  var semana = getSemanaLabel();
  var btn = document.getElementById('btn-guardar-bd');
  if(btn){ btn.textContent='⏳ Guardando...'; btn.disabled=true; }

  try{
    // 1. Upsert cuadrante: si ya existe para este local+semana, reutilizar
    var existing = await sbGet('cuadrantes','local_id=eq.'+localId+'&semana_label=eq.'+encodeURIComponent(semana)+'&order=id.desc&limit=1');
    var cuadranteId;
    if(existing && existing.length){
      cuadranteId = existing[0].id;
      // Borrar turnos anteriores para regenerar
      await sbDelete('turnos_cuadrante','cuadrante_id=eq.'+cuadranteId);
      showToast(t('toast_actualizando_cuad'),'orange');
      logAccion('ACTUALIZAR_CUADRANTE', semana, localId);
    } else {
      var cArr = await sbPost('cuadrantes',{local_id:localId, semana_label:semana});
      cuadranteId = cArr[0].id;
      logAccion('GUARDAR_CUADRANTE', semana, localId);
    }
    currentCuadranteId = cuadranteId;

    // 2. Guardar/actualizar empleados en BD
    for(var i=0;i<empleados.length;i++){
      var emp = empleados[i];
      // Buscar si ya existe por nombre+local
      var existing = await sbGet('empleados','local_id=eq.'+localId+'&nombre=eq.'+encodeURIComponent(emp.nombre));
      var empBdId;
      if(existing.length){
        empBdId = existing[0].id;
        await sbPatch('empleados', empBdId, {rol:emp.rol, turno_habitual:emp.turno, telefono:emp.telefono||null, email:emp.email||null});
      } else {
        var newEmp = await sbPost('empleados',{local_id:localId, nombre:emp.nombre, rol:emp.rol, turno_habitual:emp.turno, telefono:emp.telefono||null, email:emp.email||null});
        empBdId = newEmp[0].id;
      }
      empIdMap[emp.id] = empBdId;

      // 3. Turnos del cuadrante
      for(var d=0;d<7;d++){
        await sbPost('turnos_cuadrante',{
          cuadrante_id:currentCuadranteId,
          empleado_id:empBdId,
          dia:d,
          turno:emp.turnos[d]||'fiesta'
        });
      }

      // 4. Salarios (upsert)
      var sal = getSalario(emp.id);
      if(sal.brutoMes!==''){
        var salExist = await sbGet('salarios','empleado_id=eq.'+empBdId);
        if(salExist.length){
          await sbPatch('salarios', salExist[0].id, {bruto_mes:parseFloat(sal.brutoMes), horas_contrato:sal.hContrato});
        } else {
          await sbPost('salarios',{empleado_id:empBdId, bruto_mes:parseFloat(sal.brutoMes), horas_contrato:sal.hContrato});
        }
      }
    }

    // 5. Extras del día
    for(var j=0;j<extrasDia.length;j++){
      var ex = extrasDia[j];
      var empBdIdEx = empIdMap[ex.empId];
      if(empBdIdEx){
        await sbPost('extras_dia',{
          cuadrante_id:currentCuadranteId,
          empleado_id:empBdIdEx,
          dia:ex.dia,
          horas:parseFloat(ex.horas)||0,
          precio_hora:parseFloat(ex.precioHora)||0,
          motivo:ex.motivo
        });
      }
    }

    if(btn){ btn.textContent='✓ Guardado'; btn.style.background='var(--green)'; btn.style.color='var(--darker)'; btn.disabled=false; }
    showToast(t('toast_cuad_guardado'),'green');
  }catch(e){
    console.error(e);
    if(btn){ btn.textContent='💾 Guardar en BD'; btn.disabled=false; btn.style.background=''; btn.style.color='var(--green)'; }
    showToast(t('toast_cuad_error')+e.message,'red');
  }
}

var empleados=[], eventos=[], empCounter=0, turnosConfig=[];
var refuerzoPersonas=[], refuerzoCounter=0;
var mostrarHoras=true, lastLocal='';

function toMin(t){var p=t.split(':');return parseInt(p[0])*60+parseInt(p[1]);}
function toStr(m){m=((m%1440)+1440)%1440;return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');}
function diffH(s,e){var sm=toMin(s),em=toMin(e);if(em<=sm)em+=1440;return(em-sm)/60;}

function horaOpts(selId,defVal){
  var el=document.getElementById(selId);if(!el)return;
  el.innerHTML='';
  for(var h=0;h<24;h++){for(var m=0;m<60;m+=30){
    var str=String(h).padStart(2,'0')+':'+String(m).padStart(2,'0');
    var o=document.createElement('option');o.value=str;o.textContent=str;
    if(str===defVal)o.selected=true;el.appendChild(o);
  }}
}

function buildFechas(){
  var sel=document.getElementById('fecha-inicio');if(!sel)return;sel.innerHTML='';
  var today=new Date(),d=new Date(today);
  d.setDate(d.getDate()+((1+7-d.getDay())%7||7));
  for(var i=-2;i<10;i++){
    var dd=new Date(d);dd.setDate(dd.getDate()+i*7);
    var val=dd.toISOString().split('T')[0];
    var label=dd.toLocaleDateString('es-ES',{day:'numeric',month:'short',year:'numeric'});
    var o=document.createElement('option');o.value=val;o.textContent='Lunes '+label;
    if(i===0)o.selected=true;sel.appendChild(o);
  }
}

function getLocal(){
  var sel=document.getElementById('local-select');if(!sel)return'';
  var v=sel.value;
  if(v==='Otro'){var inp=document.getElementById('otro-local-input');return inp?(inp.value||'Nuevo local'):'Nuevo local';}
  return v;
}

function getSemanaLabel(){
  var fi=document.getElementById('fecha-inicio');if(!fi||!fi.value)return'';
  var d=new Date(fi.value+'T12:00:00');
  var fin=new Date(d);fin.setDate(fin.getDate()+6);
  var fmt=function(dt){return dt.toLocaleDateString('es-ES',{day:'numeric',month:'short'});};
  return fmt(d)+' \u2013 '+fmt(fin);
}

function updateHeader(){
  var hl=document.getElementById('header-local'),hs=document.getElementById('header-semana');
  if(hl)hl.textContent=getLocal()||'\u2014';
  if(hs)hs.textContent=getSemanaLabel()||'\u2014';
}

function onLocalChange(){
  var sel=document.getElementById('local-select');if(!sel)return;
  var v=sel.value;
  var wrap=document.getElementById('otro-local-wrap');
  if(wrap)wrap.style.display=(v==='Otro')?'block':'none';
  var ap=document.getElementById('hora-apertura');
  var ci=document.getElementById('hora-cierre');
  if(v==='La Cala'){if(ap)ap.value='07:30';if(ci)ci.value='03:00';}
  else if(v==="Roto's Burguer"){if(ap)ap.value='11:00';if(ci)ci.value='00:00';}
  if(v!==lastLocal){empleados=[];empCounter=0;eventos=[];extrasDia=[];extraCounter=0;lastLocal=v;}
}

function toggleSidebar(){
  var sb = document.getElementById('sidebar');
  var ov = document.getElementById('sidebar-overlay');
  var open = sb && sb.classList.contains('open');
  if(sb) sb.classList.toggle('open', !open);
  if(ov) ov.classList.toggle('open', !open);
  document.body.classList.toggle('sidebar-open', !open);
}
function closeSidebar(){
  var sb = document.getElementById('sidebar');
  var ov = document.getElementById('sidebar-overlay');
  if(sb) sb.classList.remove('open');
  if(ov) ov.classList.remove('open');
  document.body.classList.remove('sidebar-open');
}
// Alias legacy — some calls may still use old names
function toggleNavMenu(e){ if(e) e.stopPropagation(); toggleSidebar(); }
function closeNavMenu(){ closeSidebar(); }
// Cerrar sidebar al clicar fuera (teclado Escape)
document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeSidebar(); });

function goStep(n){
  for(var i=0;i<=17;i++){
    var sc=document.getElementById('screen'+i),st=document.getElementById('step'+i);
    if(sc)sc.className='screen'+(i===n?' active':'');
    if(st){st.className='step'+(i===n?' active':i<n?' done':'');}
  }
  // Mostrar barra de pasos solo en el flujo Cuadrante (screens 1-6)
  var stepsBar=document.getElementById('steps-bar');
  if(stepsBar) stepsBar.style.display=(n>=1&&n<=6)?'flex':'none';
  // Marcar item activo en sidebar
  var snavMap={0:0,1:1,2:1,3:1,4:1,5:1,6:1,7:7,8:8,9:9,10:10,12:12,14:14,15:15,16:16,17:17};
  [0,1,7,8,9,10,12,14,15,16,17].forEach(function(i){
    var el=document.getElementById('snav-'+i);
    if(el) el.classList.toggle('active', snavMap[n]===i);
  });
  if(n===7) renderCostes();
  if(n===9) cargarUsuarios();
  if(n===10){ renderPersonalizacion(); cargarParamsCosteGuardados(); var sl=localStorage.getItem('rt_logo'); aplicarLogoGuardado(sl||null); }
  if(n===12){ initCompras(); }
  if(n===14){ initAsistenteIA(); }
  if(n===15){ initAvisos(); }
  if(n===16){ initChecklist(); }
  if(n===17){ initEquipo17(); }
  window.scrollTo(0,0);
}

async function initEquipo17(){
  if(!empleados.length) await cargarEmpleadosBD();
  if(!turnosConfig.length) buildTurnosConfig();
  renderEmpleados();
  renderLorenaHorario();
}

function nextStep(from){
  if(from===1){if(!getLocal()){alert(t('alert_selecciona_local'));return;}updateHeader();buildTurnosConfig();renderTurnosConfigGrid();goStep(2);}
  else if(from===2){goStep(3);cargarEmpleadosBD();renderLorenaHorario();}
  else if(from===3){if(!empleados.length){alert('A\u00f1ade al menos un empleado');return;}empleados.forEach(function(e){if(!e.nombre)e.nombre='Empleado '+e.id;});if(!turnosConfig.length)buildTurnosConfig();sugerirYRenderizar();goStep(4);}
  else if(from===4){initPaso5();goStep(5);}
}

async function cargarEmpleadosBD(){
  var local = getLocal();
  var localId = localIdMap[local];
  if(!localId && local === 'La Cala') localId = 1;
  if(!localId && local === "Roto's Burguer") localId = 2;
  if(!localId){ 
    // Sin conexión BD — usar empleados por defecto
    if(empleados.length===0) initDef(local);
    renderEmpleados();
    return;
  }
  try{
    showToast(t('toast_cargando_equipo'),'orange');
    var emps = await sbGet('empleados','local_id=eq.'+localId+'&activo=eq.true&order=id.asc');
    if(emps.length){
      empleados=[];
      empCounter=0;
      // Cargar salarios de una vez
      var sals = await sbGet('salarios','order=id.asc');
      var salMap={};
      sals.forEach(function(s){ salMap[s.empleado_id]=s; });

      var EXCLUIR_DIRS = ['LORENA','MIRIAM','MIRYAM'];
      window._empleadosBDNombres = emps
        .filter(function(e){ return EXCLUIR_DIRS.indexOf((e.nombre||'').toUpperCase())<0; })
        .map(function(e){ return e.nombre; });
      // Mapa nombre → datos BD para auto-rellenar turno/rol al seleccionar
      window._empleadosBDDatos = {};
      emps.forEach(function(e){
        window._empleadosBDDatos[e.nombre] = {
          turno: e.turno_habitual||'manana',
          rol: e.rol||'Cam. Mañana',
          telefono: e.telefono||''
        };
      });
      emps.forEach(function(e){
        empCounter++;
        var sal = salMap[e.id]||null;
        empleados.push({
          id:empCounter,
          bdId:e.id,
          nombre:e.nombre,
          rol:e.rol||'Cam. Ma\u00f1ana',
          turno:e.turno_habitual||'manana',
          turnos:Array(7).fill(e.turno_habitual||'manana'),
          telefono:e.telefono||'',
          email:e.email||''
        });
        // Cargar salario si existe
        if(sal){
          salariosBrutos[empCounter]={
            brutoMes:sal.bruto_mes||'',
            hContrato:sal.horas_contrato||40
          };
        }
        // Mapear id local → id BD
        empIdMap[empCounter]=e.id;
      });
      showToast(t('toast_equipo_cargado')+'('+emps.length+')','green');
    } else {
      // No hay empleados en BD — usar por defecto
      if(empleados.length===0) initDef(local);
      showToast(t('toast_sin_empleados'),'orange');
    }
  } catch(err){
    console.error(err);
    if(empleados.length===0) initDef(local);
    showToast(t('toast_error_bd'),'orange');
  }
  renderEmpleados();
}

function buildTurnosConfig(){
  var ap=document.getElementById('hora-apertura').value;
  var ci=document.getElementById('hora-cierre').value;
  var local=getLocal();
  // Horarios predeterminados por local
  if(local==='La Cala'){
    turnosConfig=[
      {id:'manana',   nome:'Ma\u00f1ana',   emoji:'\u2600\ufe0f', ini:'07:30',fin:'16:30',badge:'badge-manana',    color:'#2ecc71',active:true},
      {id:'tarde',    nome:'Tarde',          emoji:'\ud83c\udf05', ini:'15:00',fin:'00:00',badge:'badge-tarde',     color:'#e67e22',active:true},
      {id:'noche',    nome:'Noche',          emoji:'\ud83c\udf19', ini:'18:00',fin:'03:00',badge:'badge-noche',     color:'#3498db',active:true},
      {id:'intermedio',nome:'Intermedio',    emoji:'\ud83d\udd04', ini:'12:00',fin:'21:00',badge:'badge-intermedio',color:'#9b59b6',active:true},
      {id:'partido',  nome:'Partido',        emoji:'\u2702\ufe0f', ini:'11:00',fin:'16:00',ini2:'20:00',fin2:'23:00',badge:'badge-partido',color:'#ffa040',active:true,esPartido:true},
    ];
  } else if(local==="Roto's Burguer"){
    turnosConfig=[
      {id:'manana',   nome:'Ma\u00f1ana',   emoji:'\u2600\ufe0f', ini:'11:00',fin:'19:00',badge:'badge-manana',    color:'#2ecc71',active:true},
      {id:'tarde',    nome:'Tarde',          emoji:'\ud83c\udf05', ini:'14:00',fin:'23:00',badge:'badge-tarde',     color:'#e67e22',active:true},
      {id:'noche',    nome:'Noche',          emoji:'\ud83c\udf19', ini:'16:00',fin:'00:00',badge:'badge-noche',     color:'#3498db',active:true},
      {id:'intermedio',nome:'Intermedio',    emoji:'\ud83d\udd04', ini:'12:00',fin:'20:00',badge:'badge-intermedio',color:'#9b59b6',active:false},
      {id:'partido',  nome:'Partido',        emoji:'\u2702\ufe0f', ini:'11:00',fin:'16:00',ini2:'20:00',fin2:'00:00',badge:'badge-partido',color:'#ffa040',active:true,esPartido:true},
    ];
  } else {
    var s=toMin(ap),e=toMin(ci);if(e<=s)e+=1440;
    var third=Math.round((e-s)/3/30)*30;
    var mid1=toStr(s+third),mid2=toStr(s+third*2);
    var iS=toStr(s+Math.round(third*0.7/30)*30),iE=toStr(s+Math.round(third*1.7/30)*30);
    turnosConfig=[
      {id:'manana',   nome:'Ma\u00f1ana',   emoji:'\u2600\ufe0f', ini:ap,   fin:mid1,badge:'badge-manana',    color:'#2ecc71',active:true},
      {id:'tarde',    nome:'Tarde',          emoji:'\ud83c\udf05', ini:mid1, fin:mid2,badge:'badge-tarde',     color:'#e67e22',active:false},
      {id:'noche',    nome:'Noche',          emoji:'\ud83c\udf19', ini:mid2, fin:ci,  badge:'badge-noche',     color:'#3498db',active:true},
      {id:'intermedio',nome:'Intermedio',    emoji:'\ud83d\udd04', ini:iS,   fin:iE,  badge:'badge-intermedio',color:'#9b59b6',active:false},
      {id:'partido',  nome:'Partido',        emoji:'\u2702\ufe0f', ini:ap,   fin:mid1,ini2:mid2,fin2:ci,badge:'badge-partido',color:'#ffa040',active:false,esPartido:true},
    ];
  }
}

function toggleTurno(id){
  var t=turnosConfig.find(function(x){return x.id===id;});
  if(t){t.active=!t.active;renderTurnosConfigGrid();}
}

function renderTurnosConfigGrid(){
  var ap=document.getElementById('hora-apertura').value;
  var ci=document.getElementById('hora-cierre').value;
  document.getElementById('info-box-turnos').innerHTML='&#10003; '+t('info_apertura')+' <strong>'+ap+'</strong> &middot; '+t('info_cierre')+' <strong>'+ci+'</strong> &middot; '+t('info_activa_turnos');
  var grid=document.getElementById('turnos-config-grid');grid.innerHTML='';
  turnosConfig.forEach(function(tc){
    var opts=function(def){return Array.from({length:48},function(_,i){
      var h=Math.floor(i/2),m=i%2===0?'00':'30';
      var str=String(h).padStart(2,'0')+':'+m;
      return '<option value="'+str+'"'+(str===def?' selected':'')+'>'+str+'</option>';
    }).join('');};
    var dis=tc.active?'':'opacity:0.45';
    var timeRow = tc.esPartido
      ? '<div class="turno-config-row" style="'+(tc.active?'':'pointer-events:none;opacity:0.5')+'">'
        +'<div><label>'+t('tc_tramo1_desde')+'</label><select onchange="updTC(\''+tc.id+'\',\'ini\',this.value)">'+opts(tc.ini)+'</select></div>'
        +'<div><label>'+t('tc_tramo1_hasta')+'</label><select onchange="updTC(\''+tc.id+'\',\'fin\',this.value)">'+opts(tc.fin)+'</select></div>'
        +'<div><label>'+t('tc_tramo2_desde')+'</label><select onchange="updTC(\''+tc.id+'\',\'ini2\',this.value)">'+opts(tc.ini2||'20:00')+'</select></div>'
        +'<div><label>'+t('tc_tramo2_hasta')+'</label><select onchange="updTC(\''+tc.id+'\',\'fin2\',this.value)">'+opts(tc.fin2||'23:00')+'</select></div>'
        +'</div>'
      : '<div class="turno-config-row" style="'+(tc.active?'':'pointer-events:none;opacity:0.5')+'">'
        +'<div><label>'+t('tc_desde')+'</label><select onchange="updTC(\''+tc.id+'\',\'ini\',this.value)">'+opts(tc.ini)+'</select></div>'
        +'<div><label>'+t('tc_hasta')+'</label><select onchange="updTC(\''+tc.id+'\',\'fin\',this.value)">'+opts(tc.fin)+'</select></div>'
        +'</div>';
    grid.innerHTML+='<div class="turno-config-item" style="'+dis+'">'
      +'<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:9px">'
      +'<div class="turno-config-label" style="color:'+tc.color+';margin-bottom:0">'+tc.emoji+' '+t('tc_turno')+' '+tc.nome+' <small style="color:var(--muted);font-weight:400">'+tc.ini+'\u2013'+tc.fin+(tc.esPartido&&tc.ini2?' / '+tc.ini2+'\u2013'+(tc.fin2||''):'')+'</small></div>'
      +'<button onclick="toggleTurno(\''+tc.id+'\')" class="toggle-btn '+(tc.active?'on':'')+'">'
      +'<div class="tog-dot"></div><span>'+(tc.active?t('tc_activo'):t('tc_inactivo'))+'</span></button></div>'
      +timeRow
      +'</div>';
  });
}

function updTC(id,f,v){var t=turnosConfig.find(function(x){return x.id===id;});if(t)t[f]=v;}

function initDef(local){
  empleados=[];
  var d=local==='La Cala'?[
    {nombre:'MARILYN',  rol:'Resp. Ma\u00f1ana', turno:'manana'},
    {nombre:'SONNY',    rol:'Cam. Ma\u00f1ana',  turno:'manana'},
    {nombre:'ALEX',     rol:'Cam. Ma\u00f1ana',  turno:'manana'},
    {nombre:'ZEUS',     rol:'Cam. Ma\u00f1ana',  turno:'partido', diasFiesta:1.5},
    {nombre:'CONNY',    rol:'Cam. Intermedio',   turno:'intermedio'},
    {nombre:'IRENE',    rol:'Resp. Noche',        turno:'noche'},
    {nombre:'SANTIAGO', rol:'Cam. Noche',         turno:'noche'},
    {nombre:'LENY',     rol:'Cam. Noche',         turno:'noche'},
  ]:local==="Roto's Burguer"?[
    {nombre:'ARTUR',rol:'Cam. Ma\u00f1ana',turno:'manana'},
    {nombre:'ALLAN (CAM.)',rol:'Cam. Tarde',turno:'tarde'},
    {nombre:'ALLAN (COC.)',rol:'Cocinero',turno:'manana'},
    {nombre:'ARLENE',rol:'Cam. Ma\u00f1ana',turno:'manana'},
  ]:[];
  d.forEach(function(x){empCounter++;empleados.push({id:empCounter,nombre:x.nombre,rol:x.rol,turno:x.turno,turnos:Array(7).fill(x.turno)});});
}

function addEmpleado(){empCounter++;empleados.push({id:empCounter,nombre:'',rol:'Cam. Ma\u00f1ana',turno:'manana',turnos:Array(7).fill('manana')});renderEmpleados();}
function removeEmpleado(id){empleados=empleados.filter(function(e){return e.id!==id;});renderEmpleados();}

function renderLorenaHorario(){
  var cont = document.getElementById('lorena-horario-list');
  if(!cont) return;
  var DIAS_S = DIAS_SHORT;
  var DIAS_L = DIAS;
  var TIPO_COLOR = {fiesta:'#ff6b6b', seguido:'var(--green)', partido:'#ffa040', apoyo:'#6b8fff'};
  var TIPO_ICON  = {fiesta:'\ud83c\udfd6', seguido:'\u23f0', partido:'\u2702\ufe0f', apoyo:'\ud83e\udd1d'};
  var TIPOS = ['fiesta','seguido','partido','apoyo'];

  var timeOpts = function(def){
    return Array.from({length:48}, function(_,i){
      var h=Math.floor(i/2), m=i%2===0?'00':'30';
      var str=String(h).padStart(2,'0')+':'+m;
      return '<option value="'+str+'"'+(str===def?' selected':'')+'>'+str+'</option>';
    }).join('');
  };

  var sel = function(id, def){
    return '<select id="'+id+'" onchange="updLorena('+id.replace(/\D/g,'')+')" style="background:var(--darker);border:1px solid var(--border);border-radius:5px;padding:3px 4px;color:var(--text);font-size:10px;width:58px">'+timeOpts(def)+'</select>';
  };

  // Diseño adaptativo: cards en móvil, tabla en escritorio
  var html = '';

  // === ESCRITORIO: tabla compacta ===
  html += '<div class="lorena-desktop">';
  html += '<table style="width:100%;border-collapse:collapse;font-size:11px">';
  html += '<thead><tr style="border-bottom:1px solid var(--border)">'
    +'<th style="padding:4px 6px;text-align:left;color:var(--muted);font-size:9px;font-weight:600">DÍA</th>'
    +'<th style="padding:4px 6px;text-align:left;color:var(--muted);font-size:9px;font-weight:600">TIPO</th>'
    +'<th style="padding:4px 6px;text-align:center;color:var(--muted);font-size:9px;font-weight:600">ENTRADA</th>'
    +'<th style="padding:4px 6px;text-align:center;color:var(--muted);font-size:9px;font-weight:600">SALIDA</th>'
    +'<th style="padding:4px 6px;text-align:center;color:var(--muted);font-size:9px;font-weight:600">ENT.2</th>'
    +'<th style="padding:4px 6px;text-align:center;color:var(--muted);font-size:9px;font-weight:600">SAL.2</th>'
    +'</tr></thead><tbody>';

  lorenaHorario.forEach(function(d, idx){
    var esFiesta  = d.tipo==='fiesta';
    var esPartido = d.tipo==='partido';
    var col = TIPO_COLOR[d.tipo] || 'var(--muted)';
    var tipoOpts = TIPOS.map(function(t){
      return '<option value="'+t+'"'+(d.tipo===t?' selected':'')+'>'+TIPO_ICON[t]+' '+t.charAt(0).toUpperCase()+t.slice(1)+'</option>';
    }).join('');
    var bg = idx%2===0 ? 'background:#ffffff06' : '';
    html += '<tr style="border-bottom:1px solid var(--border)10;'+bg+'">';
    html += '<td style="padding:5px 6px"><span style="font-weight:700;font-size:13px;color:'+col+'">'+DIAS_S[idx]+'</span><span style="font-size:13px;color:var(--muted);margin-left:5px">'+DIAS_L[idx]+'</span></td>';
    html += '<td style="padding:3px 6px"><select id="ltipo'+idx+'" onchange="updLorena('+idx+')" style="background:var(--darker);border:1px solid var(--border);border-radius:5px;padding:3px 4px;color:'+col+';font-size:10px;font-weight:600">'+tipoOpts+'</select></td>';
    if(esFiesta){
      html += '<td colspan="4" style="padding:3px 6px;text-align:center;color:#ff6b6b;font-size:10px">🏖 '+t('turno_fiesta')+'</td>';
    } else {
      html += '<td style="padding:3px 4px;text-align:center">'+sel('lini'+idx, d.ini||'12:00')+'</td>';
      html += '<td style="padding:3px 4px;text-align:center">'+sel('lfin'+idx, d.fin||'21:00')+'</td>';
      if(esPartido){
        html += '<td style="padding:3px 4px;text-align:center">'+sel('lini2'+idx, d.ini2||'20:00')+'</td>';
        html += '<td style="padding:3px 4px;text-align:center">'+sel('lfin2'+idx, d.fin2||'23:00')+'</td>';
      } else {
        html += '<td colspan="2" style="padding:3px 4px;text-align:center;color:var(--muted);font-size:10px">—</td>';
      }
    }
    html += '</tr>';
  });
  html += '</tbody></table></div>';

  // === MÓVIL: cards compactas ===
  html += '<div class="lorena-mobile">';
  lorenaHorario.forEach(function(d, idx){
    var esFiesta  = d.tipo==='fiesta';
    var esPartido = d.tipo==='partido';
    var col = TIPO_COLOR[d.tipo] || 'var(--muted)';
    var tipoOpts = TIPOS.map(function(t){
      return '<option value="'+t+'"'+(d.tipo===t?' selected':'')+'>'+TIPO_ICON[t]+' '+t.charAt(0).toUpperCase()+t.slice(1)+'</option>';
    }).join('');
    var bg = esFiesta ? '#2d1515' : '#ffffff06';
    html += '<div style="background:'+bg+';border-radius:7px;border:1px solid var(--border)40;padding:7px 8px;margin-bottom:5px">';
    // Fila 1: día + tipo
    html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:'+(esFiesta?'0':'6px')+'">';
    html += '<span style="font-weight:700;font-size:13px;color:'+col+';min-width:20px">'+DIAS_S[idx]+'</span>';
    html += '<span style="font-size:13px;color:var(--muted);flex:1">'+DIAS_L[idx]+'</span>';
    html += '<select id="mltipo'+idx+'" onchange="updLorenaMobile('+idx+')" style="background:var(--darker);border:1px solid var(--border);border-radius:5px;padding:3px 6px;color:'+col+';font-size:10px;font-weight:600">'+tipoOpts+'</select>';
    html += '</div>';
    if(!esFiesta){
      // Fila 2: horas en grid 2 col
      html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:5px">';
      html += '<div><div style="font-size:8px;color:var(--muted);margin-bottom:2px">Entrada'+(esPartido?' 1':'')+'</div>'
            + '<select id="mlini'+idx+'" onchange="updLorenaMobile('+idx+')" style="width:100%;background:var(--darker);border:1px solid var(--border);border-radius:5px;padding:4px;color:var(--text);font-size:11px">'+timeOpts(d.ini||'12:00')+'</select></div>';
      html += '<div><div style="font-size:8px;color:var(--muted);margin-bottom:2px">Salida'+(esPartido?' 1':'')+'</div>'
            + '<select id="mlfin'+idx+'" onchange="updLorenaMobile('+idx+')" style="width:100%;background:var(--darker);border:1px solid var(--border);border-radius:5px;padding:4px;color:var(--text);font-size:11px">'+timeOpts(d.fin||'21:00')+'</select></div>';
      if(esPartido){
        html += '<div><div style="font-size:8px;color:var(--muted);margin-bottom:2px">Entrada 2</div>'
              + '<select id="mlini2'+idx+'" onchange="updLorenaMobile('+idx+')" style="width:100%;background:var(--darker);border:1px solid var(--border);border-radius:5px;padding:4px;color:var(--text);font-size:11px">'+timeOpts(d.ini2||'20:00')+'</select></div>';
        html += '<div><div style="font-size:8px;color:var(--muted);margin-bottom:2px">Salida 2</div>'
              + '<select id="mlfin2'+idx+'" onchange="updLorenaMobile('+idx+')" style="width:100%;background:var(--darker);border:1px solid var(--border);border-radius:5px;padding:4px;color:var(--text);font-size:11px">'+timeOpts(d.fin2||'23:00')+'</select></div>';
      }
      html += '</div>';
    }
    html += '</div>';
  });
  html += '</div>';

  cont.innerHTML = html;
}
function updLorenaMobile(idx){
  var tipoEl = document.getElementById('mltipo'+idx);
  var iniEl  = document.getElementById('mlini'+idx);
  var finEl  = document.getElementById('mlfin'+idx);
  var ini2El = document.getElementById('mlini2'+idx);
  var fin2El = document.getElementById('mlfin2'+idx);
  if(tipoEl) lorenaHorario[idx].tipo = tipoEl.value;
  if(iniEl)  lorenaHorario[idx].ini  = iniEl.value;
  if(finEl)  lorenaHorario[idx].fin  = finEl.value;
  if(ini2El) lorenaHorario[idx].ini2 = ini2El.value;
  if(fin2El) lorenaHorario[idx].fin2 = fin2El.value;
  renderLorenaHorario();
}
function getLorenaLabel(d){
  if(d.tipo==='fiesta') return '🏖️ FIESTA';
  if(d.tipo==='partido') return (d.ini||'')+'–'+(d.fin||'')+' / '+(d.ini2||'')+'–'+(d.fin2||'');
  return (d.ini||'')+'–'+(d.fin||'');
}

function updLorena(idx){
  var tipoEl = document.getElementById('ltipo'+idx);
  var iniEl  = document.getElementById('lini'+idx);
  var finEl  = document.getElementById('lfin'+idx);
  var ini2El = document.getElementById('lini2'+idx);
  var fin2El = document.getElementById('lfin2'+idx);
  if(tipoEl) lorenaHorario[idx].tipo = tipoEl.value;
  if(iniEl)  lorenaHorario[idx].ini  = iniEl.value;
  if(finEl)  lorenaHorario[idx].fin  = finEl.value;
  if(ini2El) lorenaHorario[idx].ini2 = ini2El.value;
  if(fin2El) lorenaHorario[idx].fin2 = fin2El.value;
  renderLorenaHorario();
}

function renderEmpleados(){
  renderLorenaHorario();
  _fillEmpCont('empleados-list');
  _fillEmpCont('empleados-list-17');
}

function _fillEmpCont(contId){
  var cont = document.getElementById(contId);
  if(!cont) return;
  cont.innerHTML = '';
  var EXCLUIR = ['LORENA','MIRIAM','MIRYAM'];
  var nombresDisp = empleados.map(function(e){ return e.nombre; });
  var bdNombres = (window._empleadosBDNombres||[]).filter(function(n){
    return EXCLUIR.indexOf(n.toUpperCase())<0;
  });

  empleados.forEach(function(emp,idx){
    var color=COLORS[idx%COLORS.length];
    var init=emp.nombre?emp.nombre.substring(0,2).toUpperCase():'??';
    var rOpts=ROLES.map(function(r){return'<option value="'+r+'"'+(emp.rol===r?' selected':'')+'>'+r+'</option>';}).join('');
    var activeTurnos=turnosConfig.filter(function(t){return t.active;});
    var tOpts=activeTurnos.map(function(t){return'<option value="'+t.id+'"'+(emp.turno===t.id?' selected':'')+'>'+t.emoji+' '+t.nome+'</option>';}).join('');
    var allNames = bdNombres.length ? bdNombres : nombresDisp;
    if(emp.nombre && allNames.indexOf(emp.nombre)<0) allNames = [emp.nombre].concat(allNames);
    var nameOpts = '<option value="">'+t('sel_empleado')+'</option>'
      + allNames.map(function(n){
          return '<option value="'+n+'"'+(emp.nombre===n?' selected':'')+'>'+n+'</option>';
        }).join('');

    cont.innerHTML+='<div class="empleado-card" id="ec-'+emp.id+'">'
      +'<div class="empleado-header">'
      +'<div class="emp-avatar" style="background:'+color+'20;color:'+color+'" id="ea-'+emp.id+'">'+init+'</div>'
      +'<select class="emp-name-input" style="flex:1;background:var(--card);border:1px solid var(--border);border-radius:7px;padding:7px 10px;color:var(--text);font-size:13px;font-weight:600" onchange="updNom('+emp.id+',this.value)">'+nameOpts+'</select>'
      +'<button class="remove-btn" onclick="removeEmpleado('+emp.id+')">&#10005;</button></div>'
      +'<div class="form-row">'
      +'<div class="form-group"><label>'+t('lbl_rol')+'</label><select onchange="updEmp('+emp.id+',\'rol\',this.value)">'+rOpts+'</select></div>'
      +'<div class="form-group"><label>'+t('lbl_turno_hab')+'</label><select onchange="updEmp('+emp.id+',\'turno\',this.value)">'+tOpts+'</select></div>'
      +'<div class="form-group"><label>'+t('lbl_dias_fiesta')+'</label>'
      +'<select class="inp-sm" onchange="updEmp('+emp.id+',\'diasFiesta\',this.value)">'
      +'<option value="1"'+(emp.diasFiesta==1?' selected':'')+'>'+t('opt_1dia')+'</option>'
      +'<option value="1.5"'+(!emp.diasFiesta||emp.diasFiesta==1.5?' selected':'')+'>'+t('opt_15dias')+'</option>'
      +'<option value="2"'+(emp.diasFiesta==2?' selected':'')+'>'+t('opt_2dias')+'</option>'
      +'<option value="3"'+(emp.diasFiesta==3?' selected':'')+'>'+t('opt_3dias')+'</option>'
      +'</select></div>'
      +'</div>'
      +'<div style="font-size:10px;color:var(--muted);margin-top:3px">&#128161; '+t('p3_horas_auto')+'</div>'
      +'</div>';
  });
}

function updNom(id,v){
  var e=empleados.find(function(x){return x.id===id;});
  if(e){
    e.nombre=v;
    // Auto-rellenar turno y rol desde datos BD si están disponibles
    var bdDatos = window._empleadosBDDatos && window._empleadosBDDatos[v];
    if(bdDatos){
      e.turno = bdDatos.turno;
      e.telefono = bdDatos.telefono;
      // Re-render para reflejar el turno actualizado en el select
      renderEmpleados();
      return;
    }
  }
  var av=document.getElementById('ea-'+id);
  if(av) av.textContent=v?v.substring(0,2).toUpperCase():'??';
}
function updEmp(id,f,v){var e=empleados.find(function(x){return x.id===id;});if(e)e[f]=v;}


function syncDiasFlojos(){
  var checks = document.querySelectorAll('[onchange="syncDiasFlojos()"]');
  var sel = document.getElementById('dias-flojos');
  Array.from(sel.options).forEach(function(opt){
    var cb = Array.from(checks).find(function(c){return c.value===opt.value;});
    opt.selected = cb ? cb.checked : false;
  });
}
function getDiasFlojos(){return Array.from(document.getElementById('dias-flojos').selectedOptions).map(function(o){return+o.value;});}

// ========== LÓGICA FIESTAS v6.4 ==========
var DIAS_PRIORITARIOS_FIESTA = [0,1,2,3]; // L,M,X,J — primero intentar dar fiesta aquí
var DIAS_EVITAR_FIESTA = [4,5,6];          // V,S,D — evitar si es posible
var MINIMOS_TURNO = {manana:2, noche:2, tarde:1, intermedio:1}; // mínimos por turno

function toMinTurno(str){
  if(!str) return 0;
  var p=str.split(':');
  return parseInt(p[0])*60+(parseInt(p[1])||0);
}

function getTurnoFin(turnoId){
  var t=turnosConfig.find(function(x){return x.id===turnoId;});
  if(!t) return 0;
  var fin=toMinTurno(t.fin);
  var ini=toMinTurno(t.ini);
  if(fin<ini) fin+=1440; // cruza medianoche
  return fin;
}

function getTurnoIni(turnoId){
  var t=turnosConfig.find(function(x){return x.id===turnoId;});
  if(!t) return 0;
  return toMinTurno(t.ini);
}

// Cuenta cuántos empleados del mismo turno trabajan ese día
function contarTurnoEnDia(dia, turnoId, excluirEmpId){
  return empleados.filter(function(e){
    return e.id!==excluirEmpId && e.turno===turnoId && e.turnos && e.turnos[dia]!=='fiesta' && e.turnos[dia]!=='mediafiesta';
  }).length;
}

// Verifica si se puede dar fiesta a emp en ese día sin romper mínimos
function puedeTomarFiesta(emp, dia){
  var turno = emp.turno;
  var min = MINIMOS_TURNO[turno]||1;
  // Contar cuántos del mismo turno hay en total (incluyendo al propio empleado)
  var totalMismoTurno = empleados.filter(function(e){ return e.turno===turno; }).length;
  // Si es el único de su turno, el mínimo no aplica — siempre puede tomar fiesta
  if(totalMismoTurno <= 1) return true;
  var trabajando = contarTurnoEnDia(dia, turno, emp.id);
  return trabajando >= min;
}

// Verifica descanso 12h entre fin del turno anterior y inicio del siguiente
function respeta12h(emp, diaFiesta, tipoDiaFiesta){
  // diaFiesta = índice 0-6
  // tipoDiaFiesta = 'fiesta' o 'mediafiesta'
  var turno = emp.turno;
  var hJornada = +document.getElementById('horas-jornada').value||9;
  var hMF = +document.getElementById('horas-media-fiesta').value||5;

  // Día anterior: ¿a qué hora termina?
  var diaAnterior = diaFiesta - 1;
  var finAnterior = 0;
  if(diaAnterior >= 0){
    var tAnt = emp.turnos[diaAnterior];
    if(tAnt === 'fiesta') finAnterior = 0;
    else if(tAnt === 'mediafiesta'){
      // media fiesta: trabaja las últimas hMF horas
      finAnterior = getTurnoFin(turno);
    } else {
      finAnterior = getTurnoFin(turno);
    }
  }

  // Día siguiente: ¿a qué hora empieza?
  var diaSiguiente = diaFiesta + 1;
  var iniSiguiente = 9999;
  if(diaSiguiente <= 6){
    var tSig = emp.turnos[diaSiguiente];
    if(tSig === 'fiesta') iniSiguiente = 9999;
    else if(tSig === 'mediafiesta'){
      // media fiesta: trabaja las últimas hMF h → empieza al final del turno - hMF
      var finTurno = getTurnoFin(turno);
      iniSiguiente = finTurno - hMF*60 + 1440; // en minutos del día siguiente
    } else {
      iniSiguiente = getTurnoIni(turno) + 1440;
    }
  }

  // Si es media fiesta el día de "fiesta", trabaja la primera parte del turno
  // entonces finAnterior sería el fin del trabajo ese mismo día
  if(tipoDiaFiesta === 'mediafiesta'){
    finAnterior = getTurnoFin(turno) - hMF*60; // trabaja las hMF últimas → termina en finTurno
  }

  var descanso = iniSiguiente - finAnterior;
  return descanso >= 12*60;
}

// Fiestas fijas inamovibles por empleado
// formato: {nombre: [[dia, tipo, horaIni, horaFin], ...]}
// tipo: 'fiesta' = día completo, 'mediafiesta' = media jornada con horario especial
// Horario semanal de Lorena (directora) — editable desde paso 3
var lorenaHorario = [
  {dia:0, tipo:'fiesta',   ini:'',      fin:'',      label:'FIESTA'},       // Lunes - fijo
  {dia:1, tipo:'seguido',  ini:'12:00', fin:'21:00', label:'12:00–21:00'},  // Martes
  {dia:2, tipo:'seguido',  ini:'12:00', fin:'21:00', label:'12:00–21:00'},  // Miércoles
  {dia:3, tipo:'seguido',  ini:'12:00', fin:'21:00', label:'12:00–21:00'},  // Jueves
  {dia:4, tipo:'partido',  ini:'11:00', fin:'17:00', ini2:'20:00', fin2:'23:00', label:'11:00–17:00 / 20:00–23:00'}, // Viernes
  {dia:5, tipo:'partido',  ini:'11:00', fin:'17:00', ini2:'20:00', fin2:'23:00', label:'11:00–17:00 / 20:00–23:00'}, // Sábado
  {dia:6, tipo:'apoyo',    ini:'12:00', fin:'17:00', label:'12:00–17:00'},  // Domingo
];

var lorenaSalario = {brutoMes: 2300, hContrato: 40}; // Salario Lorena director/a

var FIESTAS_FIJAS = {
  'MARILYN': [
    [3, 'fiesta', null, null],           // Jueves - fiesta completa
    [4, 'mediafiesta', '07:30', '12:30'] // Viernes - solo mañana hasta 12:30
  ]
};

function getFiestasFijas(emp){
  // Busca por nombre (case insensitive)
  var nombre = (emp.nombre||'').toUpperCase().trim();
  for(var key in FIESTAS_FIJAS){
    if(key.toUpperCase() === nombre) return FIESTAS_FIJAS[key];
  }
  return null;
}

function sugerirTurnos(){
  if(!turnosConfig.length) buildTurnosConfig();
  var df = getDiasFlojos();

  // Inicializar todos con turno habitual
  empleados.forEach(function(emp){
    emp.turnos = Array(7).fill(emp.turno);
    if(!emp.diasFiesta) emp.diasFiesta = 1.5;
  });

  // Aplicar primero las fiestas fijas inamovibles
  empleados.forEach(function(emp){
    var fijas = getFiestasFijas(emp);
    if(!fijas) return;
    fijas.forEach(function(f){
      var dia=f[0], tipo=f[1], ini=f[2], fin=f[3];
      emp.turnos[dia] = tipo;
      // Si tiene horario especial en media fiesta, guardarlo
      if(tipo==='mediafiesta' && ini && fin){
        if(!emp.horarioEspecial) emp.horarioEspecial = {};
        emp.horarioEspecial[dia] = {ini:ini, fin:fin};
      }
    });
  });

  // Ordenar días: primero los flojos, luego los demás evitando V/S/D al final
  var diasOrdenados = [];
  df.forEach(function(d){ if(DIAS_EVITAR_FIESTA.indexOf(d)<0) diasOrdenados.push(d); });
  df.forEach(function(d){ if(DIAS_EVITAR_FIESTA.indexOf(d)>=0) diasOrdenados.push(d); });
  [0,1,2,3,4,5,6].forEach(function(d){
    if(df.indexOf(d)<0 && DIAS_EVITAR_FIESTA.indexOf(d)<0) diasOrdenados.push(d);
  });
  [0,1,2,3,4,5,6].forEach(function(d){
    if(df.indexOf(d)<0 && DIAS_EVITAR_FIESTA.indexOf(d)>=0) diasOrdenados.push(d);
  });

  // Asignar fiestas automáticas al resto (saltando empleados con fiestas fijas)
  empleados.forEach(function(emp, empIdx){
    // Si tiene fiestas fijas, no tocar — ya están asignadas
    if(getFiestasFijas(emp)) return;

    var diasFiesta = parseFloat(emp.diasFiesta)||1.5;
    var tieneMedia = (diasFiesta % 1) !== 0;
    var diasEnteros = Math.floor(diasFiesta);

    var offset = (empIdx + (emp._rotOffset||0)) % diasOrdenados.length;
    var diasCandidatos = diasOrdenados.slice(offset).concat(diasOrdenados.slice(0, offset));

    var asignados = [];
    var intentos = 0;

    for(var i=0; i<diasCandidatos.length && asignados.length<diasEnteros; i++){
      var dia = diasCandidatos[i];
      if(asignados.indexOf(dia)>=0) continue;
      if(puedeTomarFiesta(emp, dia)){
        asignados.push(dia);
      }
      intentos++;
      if(intentos>14) break;
    }

    asignados.forEach(function(d){ emp.turnos[d]='fiesta'; });

    if(tieneMedia && asignados.length>0){
      var diaFiesta = asignados[asignados.length-1];
      var candidatoMedia = -1;
      var diaAntes = diaFiesta - 1;
      if(diaAntes>=0 && emp.turnos[diaAntes]!=='fiesta' && puedeTomarFiesta(emp, diaAntes)){
        candidatoMedia = diaAntes;
      }
      if(candidatoMedia<0){
        var diaDespues = diaFiesta + 1;
        if(diaDespues<=6 && emp.turnos[diaDespues]!=='fiesta' && puedeTomarFiesta(emp, diaDespues)){
          candidatoMedia = diaDespues;
        }
      }
      if(candidatoMedia>=0) emp.turnos[candidatoMedia]='mediafiesta';
    }
  });
}

function sugerirYRenderizar(){
  sugerirTurnos();
  renderTurnosAsig();
}

function rotarFiestas(){
  // Rotar el offset de cada empleado +1 para cambiar qué día descansa
  empleados.forEach(function(emp, idx){
    emp._rotOffset = ((emp._rotOffset||0) + 1);
  });
  sugerirTurnosConOffset();
  renderTurnosAsig();
  showToast(t('toast_fiestas_rotadas'),'orange');
}

function sugerirTurnosConOffset(){
  if(!turnosConfig.length) buildTurnosConfig();
  var df = getDiasFlojos();
  var diasOrdenados = [];
  df.forEach(function(d){ if(DIAS_EVITAR_FIESTA.indexOf(d)<0) diasOrdenados.push(d); });
  df.forEach(function(d){ if(DIAS_EVITAR_FIESTA.indexOf(d)>=0) diasOrdenados.push(d); });
  [0,1,2,3,4,5,6].forEach(function(d){ if(df.indexOf(d)<0 && DIAS_EVITAR_FIESTA.indexOf(d)<0) diasOrdenados.push(d); });
  [0,1,2,3,4,5,6].forEach(function(d){ if(df.indexOf(d)<0 && DIAS_EVITAR_FIESTA.indexOf(d)>=0) diasOrdenados.push(d); });

  empleados.forEach(function(emp, empIdx){
    emp.turnos = Array(7).fill(emp.turno);
    if(!emp.diasFiesta) emp.diasFiesta = 1.5;
    var diasFiesta = parseFloat(emp.diasFiesta)||1.5;
    var tieneMedia = (diasFiesta % 1) !== 0;
    var diasEnteros = Math.floor(diasFiesta);
    var offset = (empIdx + (emp._rotOffset||0)) % Math.max(diasOrdenados.length,1);
    var diasCandidatos = diasOrdenados.slice(offset).concat(diasOrdenados.slice(0, offset));
    var asignados = [];
    for(var i=0; i<diasCandidatos.length && asignados.length<diasEnteros; i++){
      var dia = diasCandidatos[i];
      if(asignados.indexOf(dia)>=0) continue;
      if(puedeTomarFiesta(emp, dia)) asignados.push(dia);
    }
    asignados.forEach(function(d){ emp.turnos[d]='fiesta'; });
    if(tieneMedia && asignados.length>0){
      var diaFiesta = asignados[asignados.length-1];
      var candidatoMedia = -1;
      var diaAntes = diaFiesta - 1;
      if(diaAntes>=0 && emp.turnos[diaAntes]!=='fiesta' && puedeTomarFiesta(emp, diaAntes)) candidatoMedia = diaAntes;
      if(candidatoMedia<0){
        var diaDespues = diaFiesta + 1;
        if(diaDespues<=6 && emp.turnos[diaDespues]!=='fiesta' && puedeTomarFiesta(emp, diaDespues)) candidatoMedia = diaDespues;
      }
      if(candidatoMedia>=0) emp.turnos[candidatoMedia]='mediafiesta';
    }
  });
}

function renderTurnosAsig(){
  var df=getDiasFlojos();
  var activeTurnos=turnosConfig.filter(function(t){return t.active;});
  var leg=document.getElementById('turno-legend');
  leg.innerHTML=activeTurnos.map(function(tc){return'<span style="font-size:10px;display:flex;align-items:center;gap:3px"><span class="turno-badge '+tc.badge+'">'+tc.emoji+' '+tc.nome+'</span> '+tc.ini+'\u2013'+tc.fin+'</span>';}).join('')
    +'<span style="font-size:10px"><span class="turno-badge badge-mediafiesta">\u00bd '+t('turno_mediafiesta')+'</span></span>'
    +'<span style="font-size:10px"><span class="turno-badge badge-fiesta">\ud83c\udfd6 '+t('turno_fiesta')+'</span></span>';

  var html='<div class="dias-grid-header"><div></div>';
  DIAS_SHORT.forEach(function(d,i){html+='<div class="dia-label-top" style="'+(df.includes(i)?'color:var(--red)':'')+'">'+d+'</div>';});
  html+='</div>';
  empleados.forEach(function(emp,idx){
    var color=COLORS[idx%COLORS.length];
    html+='<div class="dias-grid-row"><div style="font-size:11px;font-weight:700;color:'+color+';overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+( emp.nombre||'Emp '+emp.id)+'</div>';
    DIAS.forEach(function(_,di){
      var tv=emp.turnos?emp.turnos[di]:emp.turno;
      var opts=activeTurnos.map(function(tc){return'<option value="'+tc.id+'"'+(tv===tc.id?' selected':'')+'>'+tc.emoji+' '+tc.nome+'</option>';}).join('')
        +'<option value="mediafiesta"'+(tv==='mediafiesta'?' selected':'')+'>\u00bd '+t('turno_mediafiesta')+'</option>'
        +'<option value="fiesta"'+(tv==='fiesta'?' selected':'')+'>🏖 '+t('turno_fiesta')+'</option>';
      html+='<div><select class="dia-select '+tv+'" onchange="updTurno('+emp.id+','+di+',this.value,this)">'+opts+'</select></div>';
    });
    html+='</div>';
  });
  document.getElementById('turnos-asignacion').innerHTML=html;
}

function updTurno(empId,di,v,el){var e=empleados.find(function(x){return x.id===empId;});if(e){if(!e.turnos)e.turnos=Array(7).fill(e.turno);e.turnos[di]=v;}el.className='dia-select '+v;}

function calcHorasRefuerzo(p){
  if(!p.desde||!p.hasta) return 0;
  var ini=toMinTurno(p.desde), fin=toMinTurno(p.hasta);
  if(fin<=ini) fin+=1440;
  return (fin-ini)/60;
}

function getCosteRefuerzos(){
  // Suma coste de todos los refuerzos de todos los eventos
  var total=0;
  eventos.forEach(function(ev){
    (ev.personas||[]).forEach(function(p){
      var h=calcHorasRefuerzo(p);
      total+=h*(parseFloat(p.precioHora)||10);
    });
  });
  return total;
}

function initPaso5(){refuerzoPersonas=[];refuerzoCounter=0;renderRefuerzoPersonas();}

function addRefuerzoPersona(){
  refuerzoCounter++;
  refuerzoPersonas.push({id:refuerzoCounter,nombre:'',desde:'18:00',hasta:'23:00',precioHora:10});
  renderRefuerzoPersonas();
}

function removeRefuerzoPersona(id){
  refuerzoPersonas=refuerzoPersonas.filter(function(p){return p.id!==id;});
  renderRefuerzoPersonas();
}

function updRefuerzoPersona(id,field,val){var p=refuerzoPersonas.find(function(x){return x.id===id;});if(p)p[field]=val;}

function renderRefuerzoPersonas(){
  var cont=document.getElementById('refuerzo-personas-list');if(!cont)return;
  if(refuerzoPersonas.length===0){
    cont.innerHTML='<div style="font-size:11px;color:var(--muted);margin-bottom:8px;padding:7px;background:var(--darker);border-radius:5px;border:1px dashed var(--border)">'+t('alert_añade_refuerzo')+'</div>';
    return;
  }
  var allOpts=function(def){return Array.from({length:48},function(_,i){var h=Math.floor(i/2),m=i%2===0?'00':'30';var str=String(h).padStart(2,'0')+':'+m;return'<option value="'+str+'"'+(str===def?' selected':'')+'>'+str+'</option>';}).join('');};
  cont.innerHTML=refuerzoPersonas.map(function(p){
    var horas=calcHorasRefuerzo(p);
    var coste=horas*(parseFloat(p.precioHora)||10);
    return'<div style="display:grid;grid-template-columns:1fr 80px 80px 70px 30px;gap:7px;align-items:end;margin-bottom:7px;background:var(--darker);padding:9px;border-radius:7px;border:1px solid #3d3000">'
      +'<div><label>Nombre</label><input type="text" placeholder="Ej: JUAN" value="'+p.nombre+'" oninput="updRefuerzoPersona('+p.id+',\'nombre\',this.value)" style="width:100%;background:var(--card);border:1px solid var(--border);border-radius:7px;padding:8px 10px;color:var(--text);font-family:Arial,sans-serif;font-size:13px;font-weight:600;outline:none"></div>'
      +'<div><label>Desde</label><select onchange="updRefuerzoPersona('+p.id+',\'desde\',this.value)">'+allOpts(p.desde)+'</select></div>'
      +'<div><label>Hasta</label><select onchange="updRefuerzoPersona('+p.id+',\'hasta\',this.value)">'+allOpts(p.hasta)+'</select></div>'
      +'<div><label>€/hora</label><input type="number" min="0" step="0.5" value="'+(p.precioHora||10)+'" oninput="updRefuerzoPersona('+p.id+',\'precioHora\',this.value)" class="inp-sm" style="padding:8px 6px"></div>'
      +'<div><button class="remove-btn" onclick="removeRefuerzoPersona('+p.id+')" style="margin-top:17px">&#10005;</button></div>'
      +'</div>'
      +(horas>0?'<div style="font-size:10px;color:var(--orange);margin:-4px 0 6px 0;padding:4px 9px;background:#2d1a00;border-radius:5px">'+p.nombre+': '+horas.toFixed(1)+'h × '+(p.precioHora||10)+'€ = <strong>'+coste.toFixed(2)+'€</strong></div>':'');
  }).join('');
}

function addEvento(){
  var tipo=document.getElementById('evento-tipo').value;
  var dia=+document.getElementById('evento-dia').value;
  var desc=document.getElementById('evento-desc-sel').value;
  if(!desc){alert(t('alert_selecciona_desc'));return;}
  if(refuerzoPersonas.length===0){alert('A\u00f1ade al menos una persona de refuerzo');return;}
  var inv=refuerzoPersonas.filter(function(p){return!p.nombre.trim();});
  if(inv.length>0){alert(t('alert_pon_nombre_refuerzo'));return;}
  eventos.push({tipo:tipo,dia:dia,desc:desc,personas:refuerzoPersonas.map(function(p){return{id:p.id,nombre:p.nombre,desde:p.desde,hasta:p.hasta};})});
  refuerzoPersonas=[];refuerzoCounter=0;
  document.getElementById('evento-desc-sel').value='';
  renderRefuerzoPersonas();renderEventos();
}

function removeEvento(i){eventos.splice(i,1);renderEventos();}

function renderEventos(){
  var cont=document.getElementById('eventos-list');
  cont.innerHTML=eventos.map(function(ev,i){
    return'<div class="evento-item">'
      +'<div style="font-size:18px">'+ev.tipo+'</div>'
      +'<div style="flex:1"><div style="font-size:12px;font-weight:600">'+ev.desc+' \u00b7 '+DIAS[ev.dia]+'</div>'
      +'<div style="font-size:10px;color:var(--muted);margin-top:2px">'+ev.personas.map(function(p){return p.nombre+' ('+p.desde+'\u2013'+p.hasta+')';}).join(' \u00b7 ')+'</div></div>'
      +'<button class="remove-btn" onclick="removeEvento('+i+')">&#10005;</button></div>';
  }).join('')+'<div id="no-eventos" style="display:'+(eventos.length?'none':'block')+';color:var(--muted);font-size:12px;padding:18px 0;text-align:center">No hay eventos a\u00f1adidos</div>';
}

function getTInfo(v){
  if(v==='fiesta')return{label:'\ud83c\udfd6 FIESTA',badge:'badge-fiesta',horas:0};
  var hMF=+document.getElementById('horas-media-fiesta').value;
  if(v==='mediafiesta')return{label:'\u00bd Media fiesta',badge:'badge-mediafiesta',horas:hMF};
  var t=turnosConfig.find(function(x){return x.id===v;});
  if(t){
    if(t.esPartido && t.ini2){
      var h1=diffH(t.ini,t.fin), h2=diffH(t.ini2,t.fin2||t.fin);
      return{label:t.emoji+' '+t.ini+'\u2013'+t.fin+' / '+t.ini2+'\u2013'+(t.fin2||t.fin),badge:t.badge,horas:h1+h2};
    }
    return{label:t.emoji+' '+t.ini+'\u2013'+t.fin,badge:t.badge,horas:diffH(t.ini,t.fin)};
  }
  return{label:v,badge:'badge-manana',horas:0};
}

function toggleHoras(){
  mostrarHoras = !mostrarHoras;
  var btn = document.getElementById('btn-toggle-horas');
  if(btn){
    var key = mostrarHoras ? 'p6_ocultar_horas' : 'p6_mostrar_horas';
    btn.textContent = t(key);
    btn.setAttribute('data-i18n', key);
  }
  // Aplicar directamente sobre el DOM generado
  var cont = document.getElementById('cuadrante-output');
  if(!cont) return;
  cont.querySelectorAll('.col-horas').forEach(function(el){
    el.style.setProperty('display', mostrarHoras ? '' : 'none', 'important');
  });
}

async function cargarCuadrantePrevio(){
  var local=getLocal();
  var localId=localIdMap[local];
  if(!localId) return null;
  var semana=getSemanaLabel();
  try{
    var cuads=await sbGet('cuadrantes','local_id=eq.'+localId+'&semana_label=eq.'+encodeURIComponent(semana)+'&order=id.desc&limit=1');
    if(!cuads.length) return null;
    var cuadId=cuads[0].id;
    currentCuadranteId=cuadId;
    // Cargar turnos
    var turnos=await sbGet('turnos_cuadrante','cuadrante_id=eq.'+cuadId+'&order=empleado_id.asc,dia.asc');
    // Mapear por empleado bdId
    var turnoMap={};
    turnos.forEach(function(t){
      if(!turnoMap[t.empleado_id]) turnoMap[t.empleado_id]=Array(7).fill('fiesta');
      turnoMap[t.empleado_id][t.dia]=(t.turno||'fiesta').toLowerCase();
    });
    // Aplicar a empleados
    empleados.forEach(function(emp){
      var bdId=empIdMap[emp.id];
      if(bdId && turnoMap[bdId]) emp.turnos=turnoMap[bdId];
    });
    // Cargar extras
    var extras=await sbGet('extras_dia','cuadrante_id=eq.'+cuadId);
    extrasDia=[];extraCounter=0;
    extras.forEach(function(ex){
      extraCounter++;
      // Buscar empId local desde bdId
      var localEmpId=null;
      Object.keys(empIdMap).forEach(function(k){if(empIdMap[k]===ex.empleado_id)localEmpId=parseInt(k);});
      extrasDia.push({id:extraCounter,empId:localEmpId||ex.empleado_id,dia:ex.dia,
                      horas:ex.horas||'',precioHora:ex.precio_hora||'',motivo:ex.motivo||''});
    });
    return cuadId;
  }catch(e){
    console.error('cargarCuadrantePrevio:',e);
    return null;
  }
}

function generarCuadrante(){
  updateHeader();
  var local=getLocal(),semana=getSemanaLabel();
  var ap=document.getElementById('hora-apertura').value;
  var ci=document.getElementById('hora-cierre').value;
  var minP = 2; // Mínimo por turno — gestionado por MINIMOS_TURNO en lógica fiestas
  var activeTurnos=turnosConfig.filter(function(t){return t.active;});
  var epd=Array(7).fill(null).map(function(_,i){return eventos.filter(function(ev){return ev.dia===i;});});
  var horasE=empleados.map(function(emp){return(emp.turnos||[]).reduce(function(s,t){return s+getTInfo(t).horas;},0);});
  var cob=Array(7).fill(0).map(function(_,di){return empleados.filter(function(e){return e.turnos&&e.turnos[di]!=='fiesta';}).length;});
  var totalH=horasE.reduce(function(a,b){return a+b;},0);
  var numEventos=eventos.length;

  var tbodyRows=empleados.map(function(emp,idx){
    var color=COLORS[idx%COLORS.length];
    var init=(emp.nombre||'?').substring(0,2).toUpperCase();
    var cells=(emp.turnos||[]).map(function(t,di){
      var info=getTInfo(t);
      return'<td><span class="turno-badge '+info.badge+'">'+info.label+'</span></td>';
    }).join('');
    return'<tr>'
      +'<td class="emp-name"><div style="display:flex;align-items:center;gap:6px">'
      +'<div style="width:24px;height:24px;border-radius:50%;background:'+color+'20;color:'+color+';display:flex;align-items:center;justify-content:center;font-weight:700;font-size:10px;flex-shrink:0">'+init+'</div>'
      +(emp.nombre||t('kpi_empleados')+' '+emp.id)
      +'<span onclick="enviarTurnoWA('+emp.id+')" title="Enviar turno por WhatsApp" style="cursor:pointer;font-size:13px;opacity:0.75;flex-shrink:0" class="wa-btn no-print">📲</span>'
      +'</div></td>'
      +'<td style="font-size:13px;color:var(--muted)">'+emp.rol+'</td>'
      +cells
      +'<td class="col-horas" style="font-weight:700;color:var(--accent);font-size:15px">'+horasE[idx].toFixed(1)+'h</td></tr>';
  }).join('');

  var refRows='';
  eventos.forEach(function(ev){
    (ev.personas||[]).forEach(function(p){
      var horas=diffH(p.desde,p.hasta);
      var cells=DIAS.map(function(_,di){
        if(di===ev.dia)return'<td><span class="turno-badge" style="background:#3d2d00;color:#ffd040;border:1px solid #6b5000">'+p.desde+'\u2013'+p.hasta+'</span><br><span style="font-size:8px;color:#aaa">'+ev.desc+'</span></td>';
        return'<td style="color:var(--muted);font-size:10px;text-align:center">\u2014</td>';
      }).join('');
      refRows+='<tr style="background:#1a1500">'
        +'<td class="emp-name"><div style="display:flex;align-items:center;gap:7px">'
        +'<div style="width:24px;height:24px;border-radius:50%;background:#ffd04020;color:#ffd040;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:10px;flex-shrink:0">\u26a1</div>'
        +(p.nombre||'REFUERZO')+'</div></td>'
        +'<td style="font-size:10px;color:#ffd040">'+ev.tipo+' Evento</td>'        +cells
        +'<td class="col-horas" style="font-weight:700;color:#ffd040;font-size:12px">'+horas.toFixed(1)+'h</td></tr>';
    });
  });

  var cobRow=cob.map(function(c){
    var cl=c>=minP?'cob-ok':c===minP-1?'cob-warn':'cob-low';
    return'<td style="border:1px solid var(--border);padding:5px;text-align:center"><span class="'+cl+'">'+c+'</span><br><span style="font-size:9px;color:var(--muted)">'+t('personas')+'</span></td>';
  }).join('');

  var eventosHtml='';
  if(numEventos>0){
    eventosHtml='<hr class="divider"><div style="font-size:12px;font-weight:700;margin-bottom:10px;color:var(--accent)">'+t('cuad_eventos')+'</div>'
      +eventos.map(function(ev){
        return'<div class="evento-item"><div style="font-size:18px">'+ev.tipo+'</div>'
          +'<div><div style="font-size:12px;font-weight:600">'+ev.desc+' \u00b7 '+DIAS[ev.dia]+'</div>'
          +'<div style="font-size:10px;color:var(--muted);margin-top:2px">'+(ev.personas||[]).map(function(p){return p.nombre+' \u00b7 '+p.desde+'\u2013'+p.hasta+' ('+diffH(p.desde,p.hasta).toFixed(1)+'h)';}).join(' &nbsp;\u00b7&nbsp; ')+'</div></div></div>';
      }).join('');
  }

  var legendaHtml=activeTurnos.map(function(t){return'<span style="font-size:10px"><span class="turno-badge '+t.badge+'">'+t.emoji+' '+t.nome+'</span> '+t.ini+'\u2013'+t.fin+'</span>';}).join(' ')
    +' <span style="font-size:10px"><span class="turno-badge badge-mediafiesta">\u00bd Media fiesta</span></span>';

  var html='<div class="card">'
    +'<div style="margin-bottom:16px"><div class="card-title">'+t('cuad_generado')+'</div>'
    +'<div class="card-sub">'+local+' \u00b7 '+semana+' \u00b7 '+ap+' \u2013 '+ci+'</div></div>'
    +'<div class="stats-grid">'
    +'<div class="stat-card"><div class="stat-val">'+empleados.length+'</div><div class="stat-label">'+t('kpi_empleados')+'</div></div>'
    +'<div class="stat-card"><div class="stat-val">'+totalH.toFixed(0)+'h</div><div class="stat-label">'+t('kpi_horas_tot')+'</div></div>'
    +'<div class="stat-card"><div class="stat-val">'+Math.min.apply(null,cob)+'\u2013'+Math.max.apply(null,cob)+'</div><div class="stat-label">'+t('kpi_cob_dia')+'</div></div>'
    +'<div class="stat-card"><div class="stat-val">'+numEventos+'</div><div class="stat-label">'+t('kpi_eventos')+'</div></div>'
    +'</div>'
    +'<div style="font-size:10px;color:var(--muted);margin-bottom:6px;display:none" class="mobile-scroll-hint">← Desliza para ver toda la tabla →</div>'
    +'<div class="cuadrante-scroll-wrap" style="overflow-x:auto"><table class="schedule-table">'
    +'<thead><tr><th class="emp-col">'+t('col_empleado')+'</th><th>'+t('col_rol')+'</th>'
    +DIAS_SHORT.map(function(d,i){return'<th>'+d+(epd[i].length?' '+epd[i].map(function(e){return e.tipo;}).join(''):'')+'</th>';}).join('')
    +'<th class="col-horas">'+t('col_horas')+'</th></tr></thead>'
    +'<tbody>'+tbodyRows+refRows+'</tbody>'
    +'<tfoot><tr style="background:var(--darker)">'
    +'<td colspan="2" style="padding:7px;font-weight:700;font-size:10px;color:var(--muted);border:1px solid var(--border)">'+t('cuad_cobertura')+'</td>'
    +cobRow
    +'<td class="col-horas" style="border:1px solid var(--border)"></td>'
    +'</tr></tfoot>'
    +'</table></div>'
    // Sección Lorena - Directora (fuera del cuadrante, apoyo operativo)
    +(function(){
      var lorenaHtml='';
      var LORENA_SEMANA = lorenaHorario;
      var TIPO_COLOR = {fiesta:'#e74c3c', seguido:'var(--green)', partido:'#ffa040', apoyo:'#6b8fff'};
      var TIPO_BG    = {fiesta:'#3d1515', seguido:'#153d15', partido:'#3d2a00', apoyo:'#151530'};
      lorenaHtml+='<div style="margin:10px 0;background:var(--darker);border:1px solid #c0a02040;border-radius:8px;padding:10px">';
      lorenaHtml+='<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">';
      lorenaHtml+='<div style="width:26px;height:26px;border-radius:50%;background:#c0a02020;color:#c0a020;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:10px;flex-shrink:0">LO</div>';
      lorenaHtml+='<div>';
      lorenaHtml+='<div style="font-weight:700;font-size:12px;color:#c0a020">LORENA <span style="font-size:9px;background:#2a2200;color:#c0a020;padding:1px 6px;border-radius:4px;margin-left:4px;border:1px solid #c0a02060">DIRECTORA</span></div>';
      lorenaHtml+='<div style="font-size:9px;color:#888">'+t('cuad_lorena_sub')+'</div>';
      lorenaHtml+='</div></div>';
      lorenaHtml+='<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px">';
      LORENA_SEMANA.forEach(function(d){
        var col = TIPO_COLOR[d.tipo] || 'var(--muted)';
        var bg  = TIPO_BG[d.tipo]   || 'transparent';
        var lbl, sub='';
        if(d.tipo==='fiesta'){ lbl='🏖'; sub='Fiesta'; }
        else if(d.tipo==='partido'){ lbl=(d.ini||'')+'–'+(d.fin||''); sub=(d.ini2||'')+'–'+(d.fin2||''); }
        else { lbl=(d.ini||'')+'–'+(d.fin||''); sub=d.tipo.charAt(0).toUpperCase()+d.tipo.slice(1); }
        lorenaHtml+='<div style="text-align:center;padding:4px 1px;border-radius:4px;background:'+bg+';border:1px solid '+col+'30">';
        lorenaHtml+='<div style="font-size:9px;font-weight:700;color:var(--muted);margin-bottom:1px">'+DIAS_SHORT[d.dia]+'</div>';
        lorenaHtml+='<div style="font-size:8.5px;font-weight:700;color:'+col+';white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+lbl+'</div>';
        if(sub) lorenaHtml+='<div style="font-size:7.5px;color:'+col+'80;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+sub+'</div>';
        lorenaHtml+='</div>';
      });
      lorenaHtml+='</div></div>';
      return lorenaHtml;
    })()
    +'<hr class="divider">'
    +'<div style="display:flex;gap:7px;flex-wrap:wrap">'+legendaHtml+'</div>'
    +eventosHtml
    +'<hr class="divider">'
    +'<div class="footer-credits">'+t('cuad_generado_por')+' <strong>RelojTurnos</strong> \u00b7 Grupo El Reloj \u00b7 '+new Date().toLocaleDateString('es-ES')+'<br>'
    +'Desarrollado por <strong>Raul H.B.</strong> \u00b7 <a href="mailto:raul.gestionlocal@gmail.com">raul.gestionlocal@gmail.com</a> \u00b7 '+t('cuad_derechos')+'</div>'
    +'</div>';

  // Vista móvil — tarjetas por empleado
  var mobileHtml='<div class="cuadrante-mobile">';
  mobileHtml+='<div style="font-size:11px;color:var(--muted);margin-bottom:10px;padding:8px;background:var(--darker);border-radius:7px;text-align:center">'+semana+'</div>';
  empleados.forEach(function(emp,idx){
    var color=COLORS[idx%COLORS.length];
    var init=(emp.nombre||'?').substring(0,2).toUpperCase();
    mobileHtml+='<div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;margin-bottom:8px">';
    mobileHtml+='<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">';
    mobileHtml+='<div style="width:32px;height:32px;border-radius:50%;background:'+color+'20;color:'+color+';display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px">'+init+'</div>';
    mobileHtml+='<div><div style="font-weight:700;font-size:13px;color:'+color+'">'+( emp.nombre||t('kpi_empleados')+' '+emp.id)+'</div><div style="font-size:10px;color:var(--muted)">'+emp.rol+'</div></div>';
    mobileHtml+='</div>';
    mobileHtml+='<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px">';
    DIAS_SHORT.forEach(function(dLabel,di){
      var t=emp.turnos?emp.turnos[di]:emp.turno;
      var info=getTInfo(t);
      var bg=t==='fiesta'?'#2d1515':t==='mediafiesta'?'#2d2015':'#0f2030';
      var col=t==='fiesta'?'#ff6b6b':t==='mediafiesta'?'#ffaa40':color;
      mobileHtml+='<div style="text-align:center;padding:5px 2px;border-radius:5px;background:'+bg+';border:1px solid '+col+'30">';
      mobileHtml+='<div style="font-size:8px;color:var(--muted);margin-bottom:2px">'+dLabel+'</div>';
      mobileHtml+='<div style="font-size:9px;font-weight:700;color:'+col+'">'+info.label.replace('🌅','M').replace('🌃','N').replace('🌆','T').replace('🔄','I').replace('🏖️ FIESTA','FES').replace('½ Media fiesta','½')+'</div>';
      mobileHtml+='</div>';
    });
    mobileHtml+='</div></div>';
  });
  mobileHtml+='</div>';

  document.getElementById('cuadrante-output').innerHTML=html+mobileHtml;
  // No resetear mostrarHoras aquí — respetar el estado actual
  if(!mostrarHoras){
    document.querySelectorAll('.col-horas').forEach(function(el){ el.style.setProperty('display','none','important'); });
  }
  var btn=document.getElementById('btn-toggle-horas');
  if(btn){ btn.textContent=t(mostrarHoras?'p6_ocultar_horas':'p6_mostrar_horas'); btn.setAttribute('data-i18n',mostrarHoras?'p6_ocultar_horas':'p6_mostrar_horas'); }
  goStep(6);
}

function guardarImagen(){
  var el=document.getElementById('cuadrante-output');
  var local=(getLocal()||'cuadrante').replace(/\s+/g,'_');
  var semana=getSemanaLabel().replace(/\s/g,'').replace(/\u2013/g,'-');
  var ventana=window.open('','_blank','width=1000,height=750');
  if(!ventana){alert(t('alert_permite_popups'));return;}
  ventana.document.write('<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">'
    +'<meta name="viewport" content="width=device-width,initial-scale=1.0">'
    +'<title>RelojTurnos_'+local+'_'+semana+'</title>'
    +'<style>'
    +'*{box-sizing:border-box;margin:0;padding:0}'
    +'body{font-family:Arial,sans-serif;background:#0f1923;color:#e8edf2;padding:14px}'
    +'.card{background:#162030;border:1px solid #1e3048;border-radius:10px;padding:18px}'
    +'.card-title{font-size:15px;font-weight:700;margin-bottom:3px}'
    +'.card-sub{font-size:11px;color:#6b8299;margin-bottom:14px}'
    +'.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px}'
    +'.stat-card{background:#080e14;border:1px solid #1e3048;border-radius:7px;padding:9px;text-align:center}'
    +'.stat-val{font-size:20px;font-weight:700;color:#e8a020}'
    +'.stat-label{font-size:9px;color:#6b8299;text-transform:uppercase;letter-spacing:1px;margin-top:2px}'
    +'table{width:100%;border-collapse:collapse;font-size:10px}'
    +'th{background:#080e14;padding:7px 4px;text-align:center;font-size:8px;font-weight:700;color:#6b8299;text-transform:uppercase;letter-spacing:1px;border:1px solid #1e3048}'
    +'th.emp-col{text-align:left}'
    +'td{padding:5px 4px;border:1px solid #1e3048;text-align:center;vertical-align:middle}'
    +'td.emp-name{text-align:left;font-weight:600;padding-left:7px}'
    +'.turno-badge{display:inline-block;padding:2px 5px;border-radius:4px;font-size:8px;font-weight:700;line-height:1.4}'
    +'.badge-fiesta{background:#3d1515;color:#ff6b6b}'
    +'.badge-mediafiesta{background:#3d2d10;color:#ffaa40}'
    +'.badge-manana{background:#152d15;color:#5ddb5d}'
    +'.badge-noche{background:#15152d;color:#6b8fff}'
    +'.badge-intermedio{background:#25152d;color:#c080ff}'
    +'.badge-tarde{background:#2d2515;color:#ffa040}'
    +'.cob-ok{color:#2ecc71;font-weight:700;font-size:12px}'
    +'.cob-warn{color:#e67e22;font-weight:700;font-size:12px}'
    +'.cob-low{color:#e74c3c;font-weight:700;font-size:12px}'
    +'.col-horas{}'
    +'.evento-item{display:flex;align-items:center;gap:7px;background:#1a1500;border:1px solid #3d3000;border-radius:6px;padding:7px 10px;margin-bottom:5px}'
    +'.footer-credits{font-size:9px;color:#6b8299;text-align:center;line-height:2;margin-top:8px}'
    +'.footer-credits strong,.footer-credits a{color:#e8a020;text-decoration:none}'
    +'hr{border:none;border-top:1px solid #1e3048;margin:10px 0}'
    +'.divider{border:none;border-top:1px solid #1e3048;margin:10px 0}'
    +'.hint{background:#1a2d1a;border:1px solid #2a5a2a;border-radius:7px;padding:10px;margin-bottom:14px;font-size:11px;color:#8ddb8d;text-align:center}'
    +'@media print{.hint{display:none}.cuadrante-mobile{display:none!important}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}'
    +'</style></head><body>'
    +'<div class="hint">&#128247; <strong>iOS Safari:</strong> Pulsa compartir &#10132; "A\u00f1adir a Fotos" o haz captura &nbsp;&nbsp; <strong>Android/PC:</strong> Men\u00fa &#10132; Guardar como PDF o captura</div>'
    +el.innerHTML
    +'</body></html>');
  ventana.document.close();
}

function imprimirCuadrante(){
  var original=document.getElementById('cuadrante-output');
  var clon=original.cloneNode(true);
  if(!mostrarHoras)clon.querySelectorAll('.col-horas').forEach(function(el){el.remove();});
  clon.querySelectorAll('.cuadrante-mobile').forEach(function(el){el.remove();});
  clon.querySelectorAll('[class*="mobile"]').forEach(function(el){el.remove();});
  var contenido=clon.innerHTML;
  var ventana=window.open('','_blank','width=1200,height=800');
  if(!ventana){alert(t('alert_permite_popups2'));return;}
  ventana.document.write('<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">'
    +'<title>RelojTurnos \u2013 Cuadrante</title>'
    +'<style>'
    +'@page{size:A4 landscape;margin:8mm 10mm}'
    +'*{box-sizing:border-box;margin:0;padding:0}'
    +'body{font-family:Arial,sans-serif;background:white;color:#111;font-size:10px}'
    +'.card{border:1px solid #ccc;border-radius:5px;padding:10px}'
    +'.card-title{font-size:14px;font-weight:700;margin-bottom:3px;color:#111}'
    +'.card-sub{font-size:10px;color:#666;margin-bottom:10px}'
    +'.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px}'
    +'.stat-card{background:#f5f5f5;border:1px solid #ddd;border-radius:5px;padding:7px;text-align:center}'
    +'.stat-val{font-size:18px;font-weight:700;color:#c07010}'
    +'.stat-label{font-size:8px;color:#666;text-transform:uppercase;letter-spacing:1px;margin-top:2px}'
    +'table{width:100%;border-collapse:collapse;font-size:9px}'
    +'th{background:#eee;padding:5px 3px;text-align:center;font-size:8px;font-weight:700;color:#444;text-transform:uppercase;letter-spacing:1px;border:1px solid #ccc}'
    +'th.emp-col{text-align:left}'
    +'td{padding:4px 3px;border:1px solid #ddd;text-align:center;vertical-align:middle}'
    +'td.emp-name{text-align:left;font-weight:600;padding-left:6px}'
    +'.turno-badge{display:inline-block;padding:2px 4px;border-radius:3px;font-size:8px;font-weight:700;line-height:1.4}'
    +'.badge-fiesta{background:#ffe0e0;color:#c00}'
    +'.badge-mediafiesta{background:#fff0d0;color:#a06000}'
    +'.badge-manana{background:#e0ffe0;color:#050}'
    +'.badge-noche{background:#e0e8ff;color:#003}'
    +'.badge-intermedio{background:#f0e0ff;color:#404}'
    +'.badge-tarde{background:#fff0e0;color:#840}'
    +'.cob-ok{color:#050;font-weight:700;font-size:11px}'
    +'.cob-warn{color:#840;font-weight:700;font-size:11px}'
    +'.cob-low{color:#c00;font-weight:700;font-size:11px}'
    +'.evento-item{display:flex;align-items:center;gap:6px;background:#fffbe0;border:1px solid #ddc000;border-radius:4px;padding:5px 8px;margin-bottom:4px}'
    +'.footer-credits{font-size:8px;color:#888;text-align:center;line-height:2;margin-top:7px}'
    +'.footer-credits strong,.footer-credits a{color:#c07010;text-decoration:none}'
    +'hr,.divider{border:none;border-top:1px solid #ddd;margin:8px 0}'
    +'[style*="background:#1a1500"]{background:#fffbe0!important}'
    +'[style*="color:#ffd040"]{color:#c07010!important}'
    +'[style*="background:#3d2d00"]{background:#fff0d0!important}'
    +'body{-webkit-print-color-adjust:exact;print-color-adjust:exact}'
    +'</style></head><body>'+contenido
    +'<script>window.onload=function(){setTimeout(function(){window.print();window.close();},350);};<\/script>'
    +'</body></html>');
  ventana.document.close();
}

// ========== PASO 7: COSTES v1.8 ==========
var salariosBrutos = {};
var extrasDia = [];
var extraCounter = 0;
var SS_EMPRESA = 0.39; // Hostelería: contingencias comunes 23.6% + desempleo 5.5% + FOGASA 0.2% + formación 0.6% + AT/EP ~9% ≈ 39%
var BRUTO_DEFAULT = 1800;      // Camarero/cocinero por defecto
var BRUTO_RESP = 1950;         // Responsable/encargado por defecto
var ROLES_RESP = ['Resp. Mañana','Resp. Noche','Encargado']; // roles que cobran más

var MOTIVOS_EXTRA = [
  '⚡ Evento especial',
  '🔄 Sustitución compañero',
  '🙋 Refuerzo ocasional',
  '⚽ Partido fútbol',
  '📅 Festivo / día especial',
  '🌧️ Mal tiempo / baja afluencia',
  '🎵 Concierto cercano',
  '🏃 Maratón / carrera popular',
  '📦 Recepción mercancía',
  '🔧 Otro motivo'
];

function getSalario(empId){
  if(salariosBrutos[empId]) return salariosBrutos[empId];
  // Precargar según rol del empleado
  var emp=empleados.find(function(e){return e.id===empId;});
  var esResp=emp&&ROLES_RESP.indexOf(emp.rol)>=0;
  return {brutoMes: esResp?BRUTO_RESP:BRUTO_DEFAULT, hContrato:40};
}

function updSalario(empId,campo,valor){
  if(!salariosBrutos[empId]) salariosBrutos[empId]={brutoMes:'',hContrato:40};
  if(campo==='hContrato') salariosBrutos[empId][campo]=parseInt(valor)||40;
  else salariosBrutos[empId][campo]=valor===''?'':parseFloat(valor);
  renderCostes();
}

function getHorasPactadas(emp){
  var hJornada=+document.getElementById('horas-jornada').value||9;
  var hMF=+document.getElementById('horas-media-fiesta').value||5;
  var hPact=0;
  (emp.turnos||[]).forEach(function(t){
    if(t==='fiesta') return;
    if(t==='mediafiesta'){hPact+=hMF;return;}
    hPact+=hJornada;
  });
  return hPact;
}

function getTotalExtrasEmp(empId){
  return extrasDia.filter(function(e){return e.empId===empId;})
    .reduce(function(s,e){return s+(parseFloat(e.horas)||0)*(parseFloat(e.precioHora)||0);},0);
}

function calcEmp(emp){
  var s=getSalario(emp.id);
  var hCuad=(emp.turnos||[]).reduce(function(sum,t){return sum+getTInfo(t).horas;},0);
  var hPact=getHorasPactadas(emp);
  var bruto=s.brutoMes!==''?parseFloat(s.brutoMes):null;
  var costeFijoSem=bruto!==null?(bruto*(1+SS_EMPRESA))/(DIVISOR_CUSTOM||4.33):null;
  var costeFijoMes=bruto!==null?bruto*(1+SS_EMPRESA):null;
  var costeExtras=getTotalExtrasEmp(emp.id);
  var totalSem=costeFijoSem!==null?costeFijoSem+costeExtras:null;
  return{hCuad:hCuad,hPact:hPact,bruto:bruto,
         costeFijoSem:costeFijoSem,costeFijoMes:costeFijoMes,
         costeExtras:costeExtras,totalSem:totalSem};
}

function switchTab(tab){
  ['planif','extras','salarios'].forEach(function(t){
    document.getElementById('tab-'+t).className='tab-btn'+(t===tab?' active':'');
    document.getElementById('panel-'+t).className='tab-panel'+(t===tab?' active':'');
  });
  renderCostes();
}

// ---- EXTRAS DEL DÍA ----
function addExtraDia(){
  extraCounter++;
  extrasDia.push({id:extraCounter,empId:empleados.length?empleados[0].id:0,
                  dia:0,horas:'',precioHora:'',motivo:MOTIVOS_EXTRA[1]});
  renderExtras();
}

function removeExtra(id){
  extrasDia=extrasDia.filter(function(e){return e.id!==id;});
  renderExtras(); renderCostes();
}

function updExtra(id,campo,valor){
  var e=extrasDia.find(function(x){return x.id===id;});
  if(e){if(campo==='empId')e[campo]=parseInt(valor);else e[campo]=valor;}
  renderCostes();
}

function renderExtras(){
  var cont=document.getElementById('extras-lista');
  if(!cont) return;
  if(!extrasDia.length){
    cont.innerHTML='<div style="color:var(--muted);font-size:12px;padding:14px;text-align:center;background:var(--darker);border-radius:8px;border:1px dashed var(--border)">'+t('sin_extras')+'</div>';
    renderResumenExtras(); return;
  }
  var empOpts=empleados.map(function(e){
    return'<option value="'+e.id+'">'+(e.nombre||t('lbl_empleado')+' '+e.id)+'</option>';
  }).join('');
  var diaOpts=DIAS.map(function(d,i){return'<option value="'+i+'">'+d+'</option>';}).join('');

  cont.innerHTML=extrasDia.map(function(ex){
    var motivoOpts=MOTIVOS_EXTRA.map(function(m){
      return'<option value="'+m+'"'+(m===ex.motivo?' selected':'')+'>'+m+'</option>';
    }).join('');
    var empOptsEx=empleados.map(function(e){
      return'<option value="'+e.id+'"'+(e.id===ex.empId?' selected':'')+'>'+( e.nombre||'Emp '+e.id)+'</option>';
    }).join('');
    var diaOptsEx=DIAS.map(function(d,i){
      return'<option value="'+i+'"'+(i===ex.dia?' selected':'')+'>'+d+'</option>';
    }).join('');
    var coste=(parseFloat(ex.horas)||0)*(parseFloat(ex.precioHora)||0);
    return'<div style="background:var(--darker);border:1px solid #4a2800;border-radius:9px;padding:13px;margin-bottom:9px">'
      +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">'
      +'<div><label>'+t('lbl_empleado')+'</label><select class="inp-sm" onchange="updExtra('+ex.id+',\'empId\',this.value)">'+empOptsEx+'</select></div>'
      +'<div><label>'+t('lbl_dia')+'</label><select class="inp-sm" onchange="updExtra('+ex.id+',\'dia\',this.value)">'+diaOptsEx+'</select></div>'
      +'</div>'
      +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">'
      +'<div><label>'+t('lbl_h_extra')+'</label><input type="number" min="0.5" step="0.5" placeholder="ej: 2" value="'+ex.horas+'" oninput="updExtra('+ex.id+',\'horas\',this.value)" class="inp-sm"></div>'
      +'<div><label>'+t('lbl_eur_h')+'</label><input type="number" min="0" step="0.5" placeholder="ej: 10" value="'+ex.precioHora+'" oninput="updExtra('+ex.id+',\'precioHora\',this.value)" class="inp-sm"></div>'
      +'</div>'
      +'<div style="display:grid;grid-template-columns:1fr 28px;gap:8px;align-items:end">'
      +'<div><label>'+t('lbl_motivo')+'</label><select class="inp-sm" onchange="updExtra('+ex.id+',\'motivo\',this.value)">'+motivoOpts+'</select></div>'
      +'<button class="remove-btn" onclick="removeExtra('+ex.id+')" style="margin-bottom:2px;font-size:18px">&#10005;</button>'
      +'</div>'
      +(coste>0?'<div style="margin-top:10px;padding:8px 12px;background:#2d1a00;border-radius:6px;font-size:13px;font-weight:700;color:var(--orange)">'+t('coste_extra_lbl')+' '+coste.toFixed(2)+' €</div>':'')
      +'</div>';
  }).join('');
  renderResumenExtras();
}

function renderResumenExtras(){
  var cont=document.getElementById('extras-resumen'); if(!cont) return;
  if(!extrasDia.length){cont.innerHTML='';return;}
  var totH=extrasDia.reduce(function(s,e){return s+(parseFloat(e.horas)||0);},0);
  var totE=extrasDia.reduce(function(s,e){return s+(parseFloat(e.horas)||0)*(parseFloat(e.precioHora)||0);},0);
  cont.innerHTML='<div style="background:#2d1a00;border:1px solid var(--orange);border-radius:8px;padding:12px 16px;display:flex;gap:24px;flex-wrap:wrap">'
    +'<div><div style="font-size:20px;font-weight:700;color:var(--orange)">'+totH.toFixed(1)+'h</div><div style="font-size:10px;color:var(--muted);text-transform:uppercase">'+t('h_extra_tot')+'</div></div>'
    +'<div><div style="font-size:20px;font-weight:700;color:var(--accent)">'+totE.toFixed(2)+' €</div><div style="font-size:10px;color:var(--muted);text-transform:uppercase">'+t('coste_extras_sem')+'</div></div>'
    +'</div>';
}

// ---- RENDER COSTES PRINCIPAL ----
function renderCostes(){
  renderExtras();
  var calcs=empleados.map(function(emp){return calcEmp(emp);});
  var faltanDatos=calcs.some(function(c){return c.bruto===null;});
  document.getElementById('costes-aviso').style.display=faltanDatos?'block':'none';

  var totHCuad=calcs.reduce(function(s,c){return s+c.hCuad;},0);
  var totHPact=calcs.reduce(function(s,c){return s+c.hPact;},0);
  var tieneDatos=calcs.some(function(c){return c.bruto!==null;});
  var totFijoSem=tieneDatos?calcs.reduce(function(s,c){return s+(c.costeFijoSem||0);},0):null;
  var totExtras=calcs.reduce(function(s,c){return s+c.costeExtras;},0);
  var totSem=totFijoSem!==null?totFijoSem+totExtras:null;
  var totMes=totSem!==null?totSem*4.33:null;

  // KPIs
  document.getElementById('costes-kpis').innerHTML=
    '<div class="stat-card"><div class="stat-val">'+empleados.length+'</div><div class="stat-label">'+t('kpi_empleados')+'</div></div>'
   +'<div class="stat-card"><div class="stat-val">'+totHPact.toFixed(0)+'h</div><div class="stat-label">'+t('kpi_h_pactadas')+'</div></div>'
   +'<div class="stat-card"><div class="stat-val">'+(totFijoSem!==null?totFijoSem.toFixed(0)+' €':'—')+'</div><div class="stat-label">'+t('kpi_coste_fijo')+'</div></div>'
   +'<div class="stat-card"><div class="stat-val">'+(totExtras>0?'+'+totExtras.toFixed(0)+' €':'0 €')+'</div><div class="stat-label">'+t('kpi_extras_sem')+'</div></div>'
   +'<div class="stat-card"><div class="stat-val">'+(totSem!==null?totSem.toFixed(0)+' €':'—')+'</div><div class="stat-label">'+t('kpi_total_sem')+'</div></div>'
   +'<div class="stat-card"><div class="stat-val">'+(totMes!==null?totMes.toFixed(0)+' €':'—')+'</div><div class="stat-label">'+t('kpi_total_mes')+'</div></div>'
   +'<div class="stat-card"><div class="stat-val">'+(totSem!==null&&totHCuad?(totSem/totHCuad).toFixed(2)+' €':'—')+'</div><div class="stat-label">'+t('kpi_eur_hora')+'</div></div>'
   +'<div class="stat-card"><div class="stat-val">'+extrasDia.length+'</div><div class="stat-label">'+t('kpi_extras_anotadas')+'</div></div>';

  // TARJETAS por empleado (sin tabla, sin desbordamiento)
  var cards=document.getElementById('costes-cards');
  if(cards){
    // Tarjeta Lorena — mismo formato que Salarios
    var lorColor = COLORS[0];
    var lorCard = (function(){
      var cSem = (lorenaSalario.brutoMes*(1+SS_EMPRESA)/4.33);
      var cMes = lorenaSalario.brutoMes*(1+SS_EMPRESA);
      return '<div class="costes-emp-card">'
        +'<div style="font-size:13px;font-weight:700;color:'+lorColor+';margin-bottom:12px">LORENA'
        +' <span style="font-size:10px;font-weight:400;color:var(--muted)">'+t('directora_lbl')+'</span></div>'
        +'<div class="form-row three">'
        +'<div class="form-group"><label>'+t('lbl_h_pactadas')+'</label>'
        +'<div style="background:var(--darker);border:1px solid var(--border);border-radius:7px;padding:9px 10px;font-size:13px;font-weight:700;color:var(--muted)">'+lorenaSalario.hContrato+'h</div></div>'
        +'<div class="form-group"><label>'+t('lbl_coste_sem')+'</label>'
        +'<div style="background:var(--darker);border:1px solid var(--border);border-radius:7px;padding:9px 10px;font-size:12px;line-height:1.7">'
        +'<span style="color:var(--green);font-weight:700">'+cSem.toFixed(2)+' € / sem</span>'
        +'</div></div>'
        +'<div class="form-group"><label>'+t('lbl_coste_mes_ss')+'</label>'
        +'<div style="background:var(--darker);border:1px solid var(--border);border-radius:7px;padding:9px 10px;font-size:12px;line-height:1.7">'
        +'<span style="color:var(--muted);font-size:11px">'+cMes.toFixed(0)+' €</span>'
        +'</div></div>'
        +'</div></div>';
    })();

    cards.innerHTML=lorCard+empleados.map(function(emp,idx){
      var c=calcs[idx], color=COLORS[idx%COLORS.length];
      var extrasEmp=extrasDia.filter(function(e){return e.empId===emp.id;});
      var costeSemVal = c.costeFijoSem!==null ? c.costeFijoSem.toFixed(2)+' € / sem' : t('sin_datos');
      var costeMesVal = c.costeFijoMes!==null ? c.costeFijoMes.toFixed(0)+' € / mes (con SS)' : '—';
      return'<div class="costes-emp-card">'
        +'<div style="font-size:13px;font-weight:700;color:'+color+';margin-bottom:12px">'+(emp.nombre||t('kpi_empleados')+' '+emp.id)
        +' <span style="font-size:10px;font-weight:400;color:var(--muted)">'+emp.rol+'</span></div>'
        +'<div class="form-row three">'
        +'<div class="form-group"><label>'+t('lbl_h_pactadas')+'</label>'
        +'<div style="background:var(--darker);border:1px solid var(--border);border-radius:7px;padding:9px 10px;font-size:13px;font-weight:700;color:var(--muted)">'+c.hPact.toFixed(0)+'h</div></div>'
        +'<div class="form-group"><label>'+t('lbl_coste_sem')+'</label>'
        +'<div style="background:var(--darker);border:1px solid var(--border);border-radius:7px;padding:9px 10px;font-size:12px;line-height:1.7">'
        +(c.costeFijoSem!==null
          ?'<span style="color:var(--green);font-weight:700">'+c.costeFijoSem.toFixed(2)+' € / sem</span>'
          :'<span style="color:var(--muted)">'+t('sin_datos_sal')+'</span>')
        +'</div></div>'
        +'<div class="form-group"><label>'+t('lbl_coste_mes_ss')+'</label>'
        +'<div style="background:var(--darker);border:1px solid var(--border);border-radius:7px;padding:9px 10px;font-size:12px;line-height:1.7">'
        +(c.costeFijoMes!==null
          ?'<span style="color:var(--muted);font-size:11px">'+c.costeFijoMes.toFixed(0)+' €</span>'
          :'<span style="color:var(--muted)">—</span>')
        +'</div></div>'
        +'</div>'
        // Extras de este empleado si las hay
        +(extrasEmp.length?
          '<div style="margin-top:9px;padding:8px 10px;background:#2d1a00;border:1px solid #6b3a00;border-radius:7px">'
          +'<div style="font-size:10px;font-weight:700;color:var(--orange);margin-bottom:5px">'+t('extras_registradas')+'</div>'
          +extrasEmp.map(function(ex){
            var coste=(parseFloat(ex.horas)||0)*(parseFloat(ex.precioHora)||0);
            return'<div style="font-size:11px;color:var(--text);display:flex;justify-content:space-between;margin-bottom:2px">'
              +'<span>'+DIAS[ex.dia]+' · '+ex.horas+'h · '+ex.motivo+'</span>'
              +'<span style="color:var(--orange);font-weight:700">'+coste.toFixed(2)+' €</span></div>';
          }).join('')
          +(c.costeExtras>0?'<div style="font-size:11px;font-weight:700;color:var(--orange);margin-top:4px;text-align:right">Total extras: '+c.costeExtras.toFixed(2)+' €</div>':'')
          +'</div>'
        :'')
        +(c.bruto===null?'<div style="margin-top:8px;font-size:11px;color:var(--red);padding:6px 10px;background:#2d1515;border-radius:6px">⚠ '+t('sin_datos_sal')+' — '+t('lbl_salario_bruto')+'</div>':'')
        +'</div>';
    }).join('');
  }

  // Refuerzos de evento
  var totRefuerzos = getCosteRefuerzos();
  var costeLorena = (lorenaSalario.brutoMes * (1+SS_EMPRESA)) / 4.33;
  var totSemConRef = totSem!==null ? totSem+totRefuerzos+costeLorena : totRefuerzos>0?totRefuerzos+costeLorena:costeLorena;
  var refCont = document.getElementById('costes-refuerzos');
  if(refCont){
    var refPersonas=[];
    eventos.forEach(function(ev){
      (ev.personas||[]).forEach(function(p){
        var h=calcHorasRefuerzo(p);
        var coste=h*(parseFloat(p.precioHora)||10);
        if(h>0) refPersonas.push({nombre:p.nombre,dia:DIAS[ev.dia]||'',horas:h,precioHora:p.precioHora||10,coste:coste,evento:ev.desc});
      });
    });
    if(refPersonas.length){
      refCont.innerHTML='<div style="background:var(--darker);border:1px solid #4a1a6a;border-radius:10px;padding:14px">'
        +'<div style="font-size:11px;font-weight:700;color:#c060ff;margin-bottom:10px">🎪 PERSONAL EXTERNO / REFUERZOS EVENTO</div>'
        +refPersonas.map(function(p){
          return'<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 10px;background:#1a0a2a;border-radius:6px;margin-bottom:5px;font-size:12px">'
            +'<div><span style="font-weight:700;color:#c060ff">'+p.nombre+'</span>'
            +' <span style="color:var(--muted);font-size:10px">'+p.dia+' · '+p.evento+'</span></div>'
            +'<div style="color:var(--muted);font-size:11px">'+p.horas.toFixed(1)+'h × '+p.precioHora+'€/h</div>'
            +'<div style="font-weight:700;color:#c060ff">'+p.coste.toFixed(2)+' €</div>'
            +'</div>';
        }).join('')
        +'<div style="margin-top:8px;padding:8px 10px;background:#2a0a3a;border-radius:6px;display:flex;justify-content:space-between">'
        +'<span style="font-size:11px;font-weight:700;color:#c060ff">TOTAL REFUERZOS</span>'
        +'<span style="font-size:16px;font-weight:700;color:#c060ff">'+totRefuerzos.toFixed(2)+' €</span>'
        +'</div></div>';
    } else {
      refCont.innerHTML='';
    }
  }

  // Totales

  var tot=document.getElementById('costes-totales');
  if(tot && tieneDatos){
    tot.innerHTML='<div style="background:var(--card);border:1px solid var(--accent);border-radius:10px;padding:14px;display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px">'
      +'<div style="text-align:center"><div style="font-size:11px;color:var(--muted);margin-bottom:4px">COSTE FIJO SEM.</div><div style="font-size:20px;font-weight:700;color:var(--green)">'+(totFijoSem!==null?totFijoSem.toFixed(2)+' €':'—')+'</div></div>'
      +'<div style="text-align:center"><div style="font-size:11px;color:var(--muted);margin-bottom:4px">EXTRAS DIARIAS</div><div style="font-size:20px;font-weight:700;color:var(--orange)">'+(totExtras>0?'+'+totExtras.toFixed(2)+' €':'0 €')+'</div></div>'
      +'<div style="text-align:center"><div style="font-size:11px;color:var(--muted);margin-bottom:4px">REFUERZOS</div><div style="font-size:20px;font-weight:700;color:#c060ff">'+(totRefuerzos>0?'+'+totRefuerzos.toFixed(2)+' €':'0 €')+'</div></div>'
      +'<div style="text-align:center"><div style="font-size:11px;color:var(--muted);margin-bottom:4px">TOTAL REAL SEM.</div><div style="font-size:24px;font-weight:700;color:var(--accent2)">'+(totSemConRef!==null?totSemConRef.toFixed(2)+' €':'—')+'</div></div>'
      +'</div>';
  }

  // Editor salarios — solo bruto/mes y horas contrato, sin más
  // Tarjeta Lorena directora en editor salarios
  var lorenaCardEditor = (function(){
    var lorColor = COLORS[0];
    var costeSem = (lorenaSalario.brutoMes*(1+SS_EMPRESA)/4.33);
    var costeMes = lorenaSalario.brutoMes*(1+SS_EMPRESA);
    return '<div class="costes-emp-card">'
      +'<div style="font-size:13px;font-weight:700;color:'+lorColor+';margin-bottom:12px">LORENA'
      +' <span style="font-size:10px;font-weight:400;color:var(--muted)">Director/a</span></div>'
      +'<div class="form-row three">'
      +'<div class="form-group"><label>Salario bruto / mes (€)</label>'
      +'<input type="number" min="0" step="50" value="'+lorenaSalario.brutoMes+'" oninput="lorenaSalario.brutoMes=+this.value;renderCostes()" class="inp-sm" style="padding:9px 10px;font-size:13px"></div>'
      +'<div class="form-group"><label>Horas contrato / semana</label>'
      +'<input type="number" min="1" max="48" step="1" value="'+lorenaSalario.hContrato+'" oninput="lorenaSalario.hContrato=+this.value;renderCostes()" class="inp-sm" style="padding:9px 10px;font-size:13px"></div>'
      +'<div class="form-group"><label>Resultado calculado</label>'
      +'<div style="background:var(--darker);border:1px solid var(--border);border-radius:7px;padding:9px 10px;font-size:12px;line-height:1.7">'
      +'<span style="color:var(--green);font-weight:700">'+costeSem.toFixed(2)+' € / sem</span><br>'
      +'<span style="color:var(--muted);font-size:11px">'+costeMes.toFixed(0)+' € / mes (con SS)</span>'
      +'</div></div>'
      +'</div></div>';
  })();

  document.getElementById('costes-editor').innerHTML=lorenaCardEditor+empleados.map(function(emp,idx){
    var color=COLORS[idx%COLORS.length], s=getSalario(emp.id), c=calcs[idx];
    return'<div class="costes-emp-card">'
      +'<div style="font-size:13px;font-weight:700;color:'+color+';margin-bottom:12px">'+(emp.nombre||t('kpi_empleados')+' '+emp.id)
      +' <span style="font-size:10px;font-weight:400;color:var(--muted)">'+emp.rol+'</span></div>'
      +'<div class="form-row three">'
      +'<div class="form-group"><label>Salario bruto / mes (€)</label>'
      +'<input type="number" min="0" step="50" placeholder="ej: 1800" value="'+(s.brutoMes||'')+'" oninput="updSalario('+emp.id+',\'brutoMes\',this.value)" class="inp-sm" style="padding:9px 10px;font-size:13px"></div>'
      +'<div class="form-group"><label>Horas contrato / semana</label>'
      +'<input type="number" min="1" max="48" step="1" value="'+s.hContrato+'" oninput="updSalario('+emp.id+',\'hContrato\',this.value)" class="inp-sm" style="padding:9px 10px;font-size:13px"></div>'
      +'<div class="form-group"><label>Resultado calculado</label>'
      +'<div style="background:var(--darker);border:1px solid var(--border);border-radius:7px;padding:9px 10px;font-size:12px;line-height:1.7">'
      +(c.costeFijoSem!==null
        ?'<span style="color:var(--green);font-weight:700">'+c.costeFijoSem.toFixed(2)+' € / sem</span><br>'
        +'<span style="color:var(--muted);font-size:11px">'+c.costeFijoMes.toFixed(0)+' € / mes (con SS)</span>'
        :'<span style="color:var(--muted)">Introduce el bruto</span>')
      +'</div></div>'
      +'</div>'
      +'</div>';
  }).join('');
}

// ===================== VISTA DIRECTOR GENERAL =====================

async function abrirVistaDirector(){
  // Navegar al paso 8 solo si no estamos ya en él
  var sc8 = document.getElementById('screen8');
  if(!sc8 || !sc8.classList.contains('active')) goStep(8);
  // Mostrar/ocultar audit log según rol
  var auditWrap = document.getElementById('director-audit-wrap');
  if(auditWrap) auditWrap.style.display = (currentUser && currentUser.rol==='directora_general') ? '' : 'none';
  await poblarSelectorSemanas();
  await cargarVistaDirector();
}

async function poblarSelectorSemanas(){
  var sel = document.getElementById('director-semana-sel');
  if(!sel) return;
  try{
    var cuads = await sbGet('cuadrantes','order=id.desc&limit=20');
    // Semanas únicas
    var vistas = {}, opts = '<option value="">Semana actual</option>';
    cuads.forEach(function(c){
      if(!vistas[c.semana_label]){
        vistas[c.semana_label] = true;
        opts += '<option value="'+c.semana_label+'">'+c.semana_label+'</option>';
      }
    });
    sel.innerHTML = opts;
  }catch(e){ console.log('Error semanas:', e); }
}

async function cargarVistaDirector(){
  var sel = document.getElementById('director-semana-sel');
  var semanaFiltro = sel ? sel.value : '';
  var kpisEl = document.getElementById('director-kpis');
  var localesEl = document.getElementById('director-locales');
  var compEl = document.getElementById('director-comparativa');
  var subtEl = document.getElementById('director-subtitulo');

  if(kpisEl) kpisEl.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--muted);padding:20px">'+t('director_cargando')+'</div>';

  try{
    // Cargar todos los locales
    var locales = await sbGet('locales','order=id.asc');

    // Si la tabla locales está vacía, usar fallback hardcoded
    if(!locales || !locales.length){
      locales = [{id:1, nombre:'La Cala'}, {id:2, nombre:"Roto's Burguer"}];
    }

    // Cargar cuadrantes — SIN doble order
    var filtroQ = semanaFiltro
      ? 'semana_label=eq.'+encodeURIComponent(semanaFiltro)+'&order=id.desc'
      : 'order=id.desc&limit=20';
    var cuads = await sbGet('cuadrantes', filtroQ);

    // Para cada local coger el cuadrante más reciente
    var datosLocales = [];
    for(var i=0; i<locales.length; i++){
      var loc = locales[i];
      var cuad = (cuads||[]).find(function(c){ return c.local_id === loc.id; });
      if(!cuad){
        datosLocales.push({local:loc, cuad:null, empleados:[], turnos:[], salarios:[]});
        continue;
      }

      // Cargar empleados del local
      var emps = [];
      var turnos = [];
      var sals = [];
      try{ emps  = await sbGet('empleados','local_id=eq.'+loc.id+'&activo=eq.true'); }catch(e2){ console.warn('empleados local '+loc.id, e2); }
      try{ turnos = await sbGet('turnos_cuadrante','cuadrante_id=eq.'+cuad.id); }catch(e2){ console.warn('turnos cuad '+cuad.id, e2); }
      try{ sals   = await sbGet('salarios','order=id.asc'); }catch(e2){ console.warn('salarios', e2); }

      datosLocales.push({local:loc, cuad:cuad, empleados:emps, turnos:turnos, salarios:sals});
    }

    renderVistaDirector(datosLocales, semanaFiltro, subtEl, kpisEl, localesEl, compEl);
    // Cargar audit log
    cargarAuditLog();
    console.log('[Director] Locales cargados:', locales.map(function(l){return l.id+':'+l.nombre;}));
    console.log('[Director] Cuadrantes encontrados:', (cuads||[]).map(function(c){return 'local'+c.local_id+' sem:'+c.semana_label;}));
    console.log('[Director] datosLocales:', datosLocales.map(function(d){return d.local.nombre+' cuad:'+(d.cuad?d.cuad.id:'null')+' emps:'+d.empleados.length;}));

  }catch(e){
    if(kpisEl) kpisEl.innerHTML = '<div style="grid-column:1/-1;background:#2d1515;border:1px solid #6b2020;border-radius:8px;padding:14px;color:#ff8080;font-size:12px">⚠️ Error cargando datos: '+e.message+'</div>';
    console.error('Error vista director:', e);
  }
}

function calcResumenLocal(datos){
  var emps = datos.empleados || [];
  var turnos = datos.turnos || [];
  var sals = datos.salarios || [];
  var totalHoras = 0, totalCoste = 0, coberturaMin = 99, coberturaMax = 0;
  var fiestas = 0;

  // Calcular horas y cobertura por día
  for(var d=0; d<7; d++){
    var trabajando = turnos.filter(function(t){ return t.dia===d && t.turno!=='fiesta' && t.turno!=='mediafiesta'; }).length;
    var mediaF = turnos.filter(function(t){ return t.dia===d && t.turno==='mediafiesta'; }).length;
    trabajando += mediaF * 0.5;
    if(trabajando < coberturaMin) coberturaMin = trabajando;
    if(trabajando > coberturaMax) coberturaMax = trabajando;
    fiestas += turnos.filter(function(t){ return t.dia===d && (t.turno==='fiesta'||t.turno==='mediafiesta'); }).length;
  }

  // Coste total
  emps.forEach(function(emp){
    var sal = sals.find(function(s){ return s.empleado_id===emp.id; });
    var bruto = sal ? sal.bruto_mes : 1800;
    totalCoste += (bruto * (1+SS_EMPRESA)) / 4.33;
  });
  // Añadir Lorena si es La Cala
  if(datos.local.nombre === 'La Cala'){
    totalCoste += (lorenaSalario.brutoMes*(1+SS_EMPRESA))/4.33;
  }

  return {
    numEmpleados: emps.length,
    cobMin: coberturaMin===99?0:coberturaMin,
    cobMax: coberturaMax,
    coste: totalCoste,
    fiestas: fiestas,
    semana: datos.cuad ? datos.cuad.semana_label : t('sin_datos')
  };
}

function renderVistaDirector(datosLocales, semanaFiltro, subtEl, kpisEl, localesEl, compEl){
  var semLabel = semanaFiltro || (datosLocales[0]&&datosLocales[0].cuad ? datosLocales[0].cuad.semana_label : t('sin_datos'));
  if(subtEl) subtEl.textContent = t('director_semana')+' '+semLabel+' · '+datosLocales.length+' '+t('locales_activos_lbl');

  var resúmenes = datosLocales.map(calcResumenLocal);
  var totEmps = resúmenes.reduce(function(s,r){ return s+r.numEmpleados; },0);
  var totCoste = resúmenes.reduce(function(s,r){ return s+r.coste; },0);
  var cobGlobal = resúmenes.reduce(function(s,r){ return s+r.cobMin; },0);

  // KPIs globales
  if(kpisEl){
    kpisEl.innerHTML = [
      {v: datosLocales.length, l: t('director_locales_activos'), c: '#c0a020'},
      {v: totEmps+' '+t('personas'), l: t('director_total_emps'), c: 'var(--green)'},
      {v: totCoste.toFixed(0)+' €', l: t('director_coste_total'), c: 'var(--accent2)'},
      {v: cobGlobal+' mín.', l: t('director_cob_min'), c: 'var(--orange)'},
    ].map(function(k){
      return '<div class="stat-card"><div class="stat-val" style="color:'+k.c+'">'+k.v+'</div><div class="stat-label">'+k.l+'</div></div>';
    }).join('');
  }

  // Cards por local
  if(localesEl){
    var COLORES_LOCAL = ['#e8a020','#3498db','#2ecc71','#e74c3c','#9b59b6'];
    localesEl.innerHTML = datosLocales.map(function(datos, idx){
      var r = resúmenes[idx];
      var col = COLORES_LOCAL[idx % COLORES_LOCAL.length];
      var tieneDatos = !!datos.cuad;
      return '<div style="background:var(--card);border:1px solid '+col+'40;border-radius:12px;padding:14px;margin-bottom:10px">'
        // Header local
        +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'
        +'<div style="font-size:15px;font-weight:700;color:'+col+'">'+datos.local.nombre+'</div>'
        +(tieneDatos
          ?'<span style="font-size:9px;background:'+col+'20;color:'+col+';padding:2px 8px;border-radius:10px">'+r.semana+'</span>'
          :'<span style="font-size:9px;background:#3d1515;color:#ff6b6b;padding:2px 8px;border-radius:10px">'+t('director_sin_cuad')+'</span>')
        +'</div>'
        // KPIs del local
        +(tieneDatos
          ?'<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px">'
          +[
            {v:r.numEmpleados, l:t('kpi_empleados')},
            {v:r.cobMin+'-'+r.cobMax, l:t('director_cob_dia')},
            {v:r.coste.toFixed(0)+' €', l:t('director_coste_sem')},
            {v:r.fiestas, l:t('director_fiestas_sem')},
          ].map(function(k){
            return '<div style="background:var(--darker);border-radius:6px;padding:7px;text-align:center">'
              +'<div style="font-size:14px;font-weight:700;color:'+col+'">'+k.v+'</div>'
              +'<div style="font-size:8px;color:var(--muted);margin-top:2px">'+k.l+'</div>'
              +'</div>';
          }).join('')+'</div>'
          :'<div style="font-size:11px;color:var(--muted);padding:10px;text-align:center">'+t('director_genera_cuad')+'</div>')
        // Mini cuadrante visual (cobertura por día)
        +(tieneDatos ? renderMiniCuadrante(datos, col) : '')
        +'</div>';
    }).join('');
  }

  // Comparativa entre locales
  if(compEl && datosLocales.length > 1){
    var maxCoste = Math.max.apply(null, resúmenes.map(function(r){ return r.coste; }));
    compEl.innerHTML = '<div style="background:var(--darker);border:1px solid var(--border);border-radius:10px;padding:14px">'
      +'<div style="font-size:11px;font-weight:700;color:var(--muted);margin-bottom:12px;text-transform:uppercase;letter-spacing:1px">'+t('director_comp')+'</div>'
      +datosLocales.map(function(datos, idx){
        var r = resúmenes[idx];
        var col = ['#e8a020','#3498db'][idx] || '#2ecc71';
        var pct = maxCoste > 0 ? (r.coste/maxCoste*100) : 0;
        return '<div style="margin-bottom:10px">'
          +'<div style="display:flex;justify-content:space-between;margin-bottom:4px">'
          +'<span style="font-size:11px;font-weight:700;color:'+col+'">'+datos.local.nombre+'</span>'
          +'<span style="font-size:11px;color:var(--text)">'+r.coste.toFixed(0)+' €</span>'
          +'</div>'
          +'<div style="background:#1a1a1a;border-radius:4px;height:8px;overflow:hidden">'
          +'<div style="background:'+col+';height:100%;width:'+pct+'%;border-radius:4px;transition:width 0.5s"></div>'
          +'</div></div>';
      }).join('')
      +'</div>';
  }
}

function renderMiniCuadrante(datos, col){
  var DIAS_M = ['L','M','X','J','V','S','D'];
  var bars = DIAS_M.map(function(d, di){
    var trabajando = (datos.turnos||[]).filter(function(t){ return t.dia===di && t.turno!=='fiesta' && t.turno!=='mediafiesta'; }).length;
    var total = datos.empleados.length || 1;
    var pct = Math.round(trabajando/total*100);
    var barCol = pct>=80?'var(--green)':pct>=50?'var(--orange)':'#e74c3c';
    return '<div style="text-align:center;flex:1">'
      +'<div style="font-size:8px;color:var(--muted);margin-bottom:3px">'+d+'</div>'
      +'<div style="background:#1a1a1a;border-radius:3px;height:30px;position:relative;overflow:hidden">'
      +'<div style="background:'+barCol+';position:absolute;bottom:0;width:100%;height:'+pct+'%;border-radius:3px;opacity:0.8"></div>'
      +'</div>'
      +'<div style="font-size:8px;color:var(--muted);margin-top:2px">'+trabajando+'p</div>'
      +'</div>';
  }).join('');
  return '<div style="display:flex;gap:3px;margin-top:4px">'+bars+'</div>';
}

function imprimirDirector(){
  var el = document.getElementById('screen8');
  if(!el){ alert(t('alert_no_datos_imprimir')); return; }
  var ventana = window.open('','_blank','width=900,height=700');
  if(!ventana){ alert(t('alert_permite_popups3')); return; }
  ventana.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Vista Director - Grupo El Reloj</title>'
    +'<style>body{font-family:Arial,sans-serif;background:#0f1923;color:#e8edf2;padding:20px}'
    +'*{box-sizing:border-box}</style></head><body>'
    +el.innerHTML+'</body></html>');
  ventana.document.close();
  ventana.print();
}

function imprimirCostes(){
  var local=getLocal()||'Local', semana=getSemanaLabel();
  var calcs=empleados.map(function(emp){return calcEmp(emp);});
  var totFijo=calcs.reduce(function(s,c){return s+(c.costeFijoSem||0);},0);
  var totExtras=calcs.reduce(function(s,c){return s+c.costeExtras;},0);
  var totSem=totFijo+totExtras, totMes=totSem*4.33;
  var totHCuad=calcs.reduce(function(s,c){return s+c.hCuad;},0);

  // Fila Lorena
  var lorSem = (lorenaSalario.brutoMes*(1+SS_EMPRESA))/4.33;
  var lorMes = lorenaSalario.brutoMes*(1+SS_EMPRESA);
  var rowLorena = '<tr style="background:#fffbe6">'
    +'<td><strong>LORENA</strong></td><td>Director/a</td>'
    +'<td>'+lorenaSalario.hContrato+'h</td><td>—</td>'
    +'<td>'+lorenaSalario.brutoMes+' €</td>'
    +'<td>'+lorSem.toFixed(2)+' €</td>'
    +'<td>'+lorMes.toFixed(0)+' €</td>'
    +'<td>—</td>'
    +'<td style="font-weight:700">'+lorSem.toFixed(2)+' €</td>'
    +'</tr>';

  var rows=empleados.map(function(emp,i){
    var c=calcs[i];
    return'<tr><td>'+(emp.nombre||t('lbl_empleado')+' '+emp.id)+'</td><td>'+emp.rol+'</td>'
      +'<td>'+c.hPact.toFixed(0)+'h</td><td>'+c.hCuad.toFixed(1)+'h</td>'
      +'<td>'+(c.bruto!==null?c.bruto.toFixed(0)+' €':'sin dato')+'</td>'
      +'<td>'+(c.costeFijoSem!==null?c.costeFijoSem.toFixed(2)+' €':'—')+'</td>'
      +'<td>'+(c.costeFijoMes!==null?c.costeFijoMes.toFixed(0)+' €':'—')+'</td>'
      +'<td>'+(c.costeExtras>0?c.costeExtras.toFixed(2)+' €':'—')+'</td>'
      +'<td style="font-weight:700">'+(c.totalSem!==null?c.totalSem.toFixed(2)+' €':'sin dato')+'</td>'
      +'</tr>';
  }).join('');

  var extrasRows=extrasDia.length?extrasDia.map(function(ex){
    var emp=empleados.find(function(e){return e.id===ex.empId;})||{};
    var coste=(parseFloat(ex.horas)||0)*(parseFloat(ex.precioHora)||0);
    return'<tr><td>'+(emp.nombre||'?')+'</td><td>'+(DIAS[ex.dia]||'')+'</td>'
      +'<td>'+ex.horas+'h</td><td>'+(ex.precioHora?ex.precioHora+' €/h':'—')+'</td>'
      +'<td>'+coste.toFixed(2)+' €</td><td>'+ex.motivo+'</td></tr>';
  }).join(''):'';

  var ventana=window.open('','_blank','width=1100,height=750');
  if(!ventana){alert(t('alert_permite_popups3'));return;}
  ventana.document.write('<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">'
    +'<title>Costes – '+local+' – '+semana+'</title>'
    +'<style>@page{size:A4 landscape;margin:12mm}*{box-sizing:border-box;margin:0;padding:0}'
    +'body{font-family:Arial,sans-serif;font-size:10px;color:#111;padding:14px}'
    +'h1{font-size:15px;margin-bottom:2px}h2{font-size:11px;color:#444;margin:14px 0 6px;border-bottom:1px solid #ccc;padding-bottom:3px}'
    +'p.sub{color:#666;font-size:10px;margin-bottom:12px}'
    +'.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-bottom:14px}'
    +'.stat{background:#f5f5f5;border:1px solid #ddd;border-radius:4px;padding:7px;text-align:center}'
    +'.sv{font-size:16px;font-weight:700;color:#c07010}.sl{font-size:8px;color:#666;text-transform:uppercase;margin-top:2px}'
    +'table{width:100%;border-collapse:collapse;margin-bottom:12px}'
    +'th{background:#eee;padding:5px;text-align:center;border:1px solid #ccc;font-size:8px;text-transform:uppercase}'
    +'th:first-child,th:nth-child(2){text-align:left}'
    +'td{padding:4px 5px;border:1px solid #ddd;font-size:9px;text-align:center}'
    +'td:first-child,td:nth-child(2){text-align:left}tfoot td{background:#f0f0f0;font-weight:700}'
    +'.footer{font-size:8px;color:#999;text-align:center;margin-top:10px}'
    +'body{-webkit-print-color-adjust:exact;print-color-adjust:exact}'
    +'</style></head><body>'
    +'<h1>&#128182; Informe de Costes · '+local+'</h1><p class="sub">'+semana+'</p>'
    +'<div class="stats">'
    +'<div class="stat"><div class="sv">'+empleados.length+'</div><div class="sl">Empleados</div></div>'
    +'<div class="stat"><div class="sv">'+totHCuad.toFixed(0)+'h</div><div class="sl">Horas cuadrante</div></div>'
    +'<div class="stat"><div class="sv">'+totSem.toFixed(0)+' €</div><div class="sl">Total semana</div></div>'
    +'<div class="stat"><div class="sv">'+totMes.toFixed(0)+' €</div><div class="sl">Estimado mes</div></div>'
    +'</div>'
    +'<h2>Personal</h2>'
    +'<table><thead><tr><th>Empleado</th><th>Rol</th><th>H.Pact</th><th>H.Cuad</th><th>Bruto/mes</th><th>Coste/sem</th><th>Coste/mes</th><th>Extras €</th><th>Total sem</th></tr></thead>'
    +'<tbody>'+rowLorena+rows+'</tbody>'
    +'<tfoot><tr><td colspan="2">TOTALES</td><td></td><td>'+totHCuad.toFixed(1)+'h</td><td></td>'
    +'<td>'+(totFijo+lorSem).toFixed(2)+' €</td><td></td>'
    +'<td>'+(totExtras>0?totExtras.toFixed(2)+' €':'—')+'</td>'
    +'<td>'+(totSem+lorSem).toFixed(2)+' €</td></tr></tfoot></table>'
    +(extrasRows?'<h2>Extras del día registradas</h2><table><thead><tr><th>Empleado</th><th>Día</th><th>Horas</th><th>€/hora</th><th>Coste</th><th>Motivo</th></tr></thead><tbody>'+extrasRows+'</tbody></table>':'')
    +'<p class="footer">RelojTurnos v6.7 · '+new Date().toLocaleDateString('es-ES')+' · Coste empresa = bruto × 1,33 ÷ 4,33 · Total mes = semana × 4,33</p>'
    +'<script>window.onload=function(){setTimeout(function(){window.print();},350);};<\/script>'
    +'</body></html>');
  ventana.document.close();
}


// ========== PERSONALIZACIÓN ==========
var TEMAS = {
  dark:  {dark:'#0f1923', darker:'#080e14', card:'#162030', border:'#1e3048', text:'#e8edf2', muted:'#6b8299'},
  light: {dark:'#f0f4f8', darker:'#e8edf2', card:'#ffffff', border:'#c5d0db', text:'#1a2530', muted:'#5a7080'},
  navy:  {dark:'#0a0f1e', darker:'#050810', card:'#0f1730', border:'#1a2848', text:'#d8e4f0', muted:'#5a7299'}
};

function aplicarColor(hex){
  document.documentElement.style.setProperty('--accent', hex);
  // calcular accent2 ligeramente más claro
  document.documentElement.style.setProperty('--accent2', hex);
  // actualizar input color
  var inp = document.getElementById('color-custom');
  if(inp) inp.value = hex;
  // guardar
  localStorage.setItem('rt_accent', hex);
  // preview
  renderPersonalizacion();
  showToast(t('toast_color'),'green');
}

function aplicarTema(tema){
  var t = TEMAS[tema];
  if(!t) return;
  Object.keys(t).forEach(function(k){ document.documentElement.style.setProperty('--'+k, t[k]); });
  localStorage.setItem('rt_tema', tema);
  ['dark','light','navy'].forEach(function(n){
    var btn = document.getElementById('btn-tema-'+n);
    if(btn) btn.className = 'btn btn-sm '+(n===tema?'btn-primary':'btn-ghost');
  });
  renderPersonalizacion();
  showToast(t('toast_tema'),'green');
}

function aplicarNombreEmpresa(nombre){
  if(!nombre.trim()) return;
  localStorage.setItem('rt_empresa', nombre);
  // actualizar todos los elementos con nombre empresa
  document.querySelectorAll('.logo-sub, #header-groupname').forEach(function(el){
    el.textContent = nombre.toUpperCase();
  });
  renderPersonalizacion();
  showToast(t('toast_nombre'),'green');
}

function renderPersonalizacion(){
  var prevNombre = document.getElementById('prev-nombre');
  var prevEmpresa = document.getElementById('prev-empresa');
  var empresa = localStorage.getItem('rt_empresa') || 'GRUPO EL RELOJ';
  if(prevNombre) prevNombre.textContent = 'RelojTurnos';
  if(prevEmpresa) prevEmpresa.textContent = empresa.toUpperCase();
}

function resetPersonalizacion(){
  localStorage.removeItem('rt_accent');
  localStorage.removeItem('rt_tema');
  localStorage.removeItem('rt_empresa');
  localStorage.removeItem('rt_logo');
  aplicarLogoGuardado(null);
  // Restaurar valores por defecto
  document.documentElement.style.setProperty('--accent','#e8a020');
  document.documentElement.style.setProperty('--accent2','#f0c060');
  aplicarTema('dark');
  document.querySelectorAll('.logo-sub, #header-groupname').forEach(function(el){
    el.textContent = 'GRUPO EL RELOJ';
  });
  var inp = document.getElementById('custom-empresa');
  if(inp) inp.value = '';
  renderPersonalizacion();
  showToast(t('toast_restablecido'),'green');
}

function cargarPersonalizacionGuardada(){
  var accent = localStorage.getItem('rt_accent');
  var tema = localStorage.getItem('rt_tema');
  var empresa = localStorage.getItem('rt_empresa');
  if(accent) aplicarColor(accent);
  if(tema) aplicarTema(tema);
  if(empresa){
    document.querySelectorAll('.logo-sub, #header-groupname').forEach(function(el){
      el.textContent = empresa.toUpperCase();
    });
    var inp = document.getElementById('custom-empresa');
    if(inp) inp.value = empresa;
  }
}

function abrirPersonalizacion(){
  goStep(10);
}

// Muestra botón Ajustes para director/a
// ========== GESTIÓN USUARIOS ==========
async function cargarUsuarios(){
  var lista = document.getElementById('usuarios-lista');
  if(!lista) return;
  lista.innerHTML = '<div style="color:var(--muted);font-size:12px;text-align:center;padding:20px">⏳ Cargando...</div>';
  try{
    var rows = await sbGet('usuarios','order=id.asc');
    if(!rows || !rows.length){
      lista.innerHTML = '<div style="color:var(--muted);font-size:12px;text-align:center;padding:20px">No hay usuarios registrados aún</div>';
      return;
    }
    var ROLES = {empleado:'Empleado', directora:'Director/a', directora_general:'Dirección General', admin:'Admin'};
    var LOCALES = {1:'La Cala', 2:"Roto's Burguer"};
    var html = rows.map(function(u){
      var col = u.rol==='directora'?'var(--accent)':u.rol==='directora_general'?'#c0a020':'var(--green)';
      var init = (u.nombre||'?').substring(0,2).toUpperCase();
      var subInfo;
      if(u.rol==='directora_general' || u.rol==='admin'){
        subInfo = (ROLES[u.rol]||u.rol) + ' · DNI: '+(u.dni||'—');
      } else {
        var localLabel = !u.local_id ? "La Cala · Roto's Burguer" : (LOCALES[u.local_id]||'Local '+u.local_id);
        subInfo = (ROLES[u.rol]||u.rol)+' · DNI: '+(u.dni||'—')+' · '+localLabel;
      }
      return '<div style="display:flex;align-items:center;gap:10px;background:var(--darker);border:1px solid var(--border);border-radius:9px;padding:10px 12px;margin-bottom:7px">'
        +'<div style="width:32px;height:32px;border-radius:50%;background:'+col+'20;color:'+col+';display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;flex-shrink:0">'+init+'</div>'
        +'<div style="flex:1;min-width:0">'
        +'<div style="font-weight:700;font-size:13px;color:'+col+';white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+(u.nombre||t('p3_nombre_empleado'))+'</div>'
        +'<div style="font-size:10px;color:var(--muted)">'+subInfo+'</div>'
        +'</div>'
        +'<span style="font-size:9px;padding:2px 7px;border-radius:10px;background:'+(u.activo?'#15351520':'#35151520')+';color:'+(u.activo?'var(--green)':'var(--red)')+';border:1px solid '+(u.activo?'var(--green)':'var(--red)')+'40;flex-shrink:0">'+(u.activo?'ACTIVO':'INACTIVO')+'</span>'
        +'<button onclick="abrirEditarUsuario('+u.id+')" style="background:none;border:1px solid var(--border);border-radius:7px;padding:4px 9px;color:var(--muted);font-size:11px;cursor:pointer;flex-shrink:0">✏️</button>'
        +'</div>';
    }).join('');

    // Empleados sin usuario (creados directamente en Supabase)
    try{
      var nombresConUsuario = rows.map(function(u){ return (u.nombre||'').toLowerCase().trim(); });
      var emps = await sbGet('empleados','order=nombre.asc');
      var empsSinUser = (emps||[]).filter(function(e){
        return nombresConUsuario.indexOf((e.nombre||'').toLowerCase().trim()) < 0;
      });
      if(empsSinUser.length){
        html += '<div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin:14px 0 6px;padding-left:4px">📋 Empleados sin usuario (solo teléfono)</div>';
        html += empsSinUser.map(function(e){
          var localLabel = LOCALES[e.local_id]||'Local '+e.local_id;
          var tel = e.telefono ? '📱 '+e.telefono : '<span style="color:var(--red);font-style:italic">sin teléfono</span>';
          return '<div style="display:flex;align-items:center;gap:10px;background:var(--darker);border:1px solid var(--border);border-radius:9px;padding:8px 12px;margin-bottom:5px;opacity:0.85">'
            +'<div style="width:32px;height:32px;border-radius:50%;background:#55555520;color:var(--muted);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;flex-shrink:0">'+((e.nombre||'?').substring(0,2).toUpperCase())+'</div>'
            +'<div style="flex:1;min-width:0">'
            +'<div style="font-weight:700;font-size:13px;color:var(--text)">'+(e.nombre||'—')+'</div>'
            +'<div style="font-size:10px;color:var(--muted)">'+localLabel+' · '+tel+'</div>'
            +'</div>'
            +'<button onclick="abrirEditarTelefonoEmpleado('+e.id+',\''+((e.nombre||'').replace(/'/g,"\\'"))+'\',\''+((e.telefono||'').replace(/'/g,"\\'"))+'\')" style="background:none;border:1px solid #25d36640;border-radius:7px;padding:4px 9px;color:#25d366;font-size:11px;cursor:pointer;flex-shrink:0">📱 Tel.</button>'
            +'</div>';
        }).join('');
      }
    }catch(e3){ console.warn('emps sin usuario:',e3); }

    lista.innerHTML = html;
  }catch(e){
    lista.innerHTML = '<div style="color:var(--red);font-size:12px;text-align:center;padding:20px">⚠ Error cargando usuarios: '+e.message+'</div>';
    console.error('cargarUsuarios error:',e);
  }
}

async function crearUsuario(){
  var nombre = (document.getElementById('nu-nombre').value||'').trim();
  var dni    = (document.getElementById('nu-dni').value||'').trim().toUpperCase();
  var ss     = (document.getElementById('nu-ss').value||'').trim();
  var rol    = document.getElementById('nu-rol').value;
  var errEl  = document.getElementById('nu-error');
  var okEl   = document.getElementById('nu-ok');
  errEl.style.display='none'; okEl.style.display='none';

  if(!nombre||!dni||!ss){ errEl.textContent='Rellena todos los campos'; errEl.style.display='block'; return; }
  if(ss.length < 4){ errEl.textContent=t('err_ss_min'); errEl.style.display='block'; return; }

  var pass = ss.slice(-4);
  var passHash = await hashPass(pass);
  try{
    // Comprobar si ya existe
    var existing = await sbGet('usuarios','dni=eq.'+encodeURIComponent(dni));
    if(existing && existing.length){ errEl.textContent=t('err_dni_existe'); errEl.style.display='block'; return; }

  var localId = rol === 'directora_general' ? null : parseInt(document.getElementById('nu-local').value);
  var telefono  = (document.getElementById('nu-telefono')||{}).value||'';
  var email     = (document.getElementById('nu-email')||{}).value||'';
  var direccion = (document.getElementById('nu-direccion')||{}).value||'';
  var nuevo = { nombre: nombre, dni: dni, password_hash: passHash, rol: rol, local_id: localId, activo: true };
  await sbPost('usuarios', nuevo);
  logAccion('CREAR_USUARIO', nombre+' · DNI: '+dni+' · Rol: '+rol, localId||null);
  // Si hay datos de contacto y tiene local, guardar/actualizar en empleados
  if(localId && (telefono||email||direccion)){
    try{
      var empEx = await sbGet('empleados','local_id=eq.'+localId+'&nombre=eq.'+encodeURIComponent(nombre));
      if(empEx && empEx.length){
        await sbPatch('empleados', empEx[0].id, {telefono:telefono||null, email:email||null, direccion:direccion||null});
      }
    }catch(e2){ console.warn('empleados contacto update:', e2); }
  }
    okEl.textContent = '✓ Usuario '+nombre+' creado · Contraseña inicial: '+pass;
    okEl.style.display = 'block';
    // Limpiar form
    ['nu-nombre','nu-dni','nu-ss','nu-telefono','nu-email','nu-direccion'].forEach(function(id){ var el=document.getElementById(id); if(el) el.value=''; });
    cargarUsuarios();
  }catch(e){
    errEl.textContent = t('err_crear_usuario')+e.message;
    errEl.style.display='block';
    console.error('crearUsuario error:',e);
  }
}

function checkMostrarBtnUsuarios(){
  var u = currentUser;
  if(!u) return;
  var esDir = u.rol==='directora'||u.rol==='directora_general'||u.rol==='admin';
  // Controlar visibilidad en el sidebar
  ['snav-9','snav-10','snav-12'].forEach(function(id){
    var el = document.getElementById(id);
    if(el) el.style.display = esDir ? '' : 'none';
  });
  // snav-8 (Dirección Gral.) solo para directora_general y admin
  var sn8 = document.getElementById('snav-8');
  if(sn8) sn8.style.display = (u.rol==='directora_general'||u.rol==='admin') ? '' : 'none';
}

// showStep alias
function showStep(n){ goStep(n); }

// ========== LOGO EMPRESA ==========
function subirLogo(input){
  var file = input.files[0];
  if(!file) return;
  if(file.size > 500000){ showToast(t('toast_logo_grande'),'orange'); return; }
  var reader = new FileReader();
  reader.onload = function(e){
    var dataUrl = e.target.result;
    localStorage.setItem('rt_logo', dataUrl);
    aplicarLogoGuardado(dataUrl);
    showToast(t('toast_logo_ok'),'green');
  };
  reader.readAsDataURL(file);
}

function quitarLogo(){
  localStorage.removeItem('rt_logo');
  aplicarLogoGuardado(null);
  showToast(t('toast_logo_quitado'),'green');
}

function aplicarLogoGuardado(dataUrl){
  // Preview en Ajustes
  var img = document.getElementById('logo-preview-img');
  var ph  = document.getElementById('logo-preview-placeholder');
  if(img && ph){
    if(dataUrl){ img.src=dataUrl; img.style.display=''; ph.style.display='none'; }
    else { img.src=''; img.style.display='none'; ph.style.display=''; }
  }
  // Header — sustituir el icono ⏱ por la imagen si hay logo
  var headerIcon = document.getElementById('header-logo-icon');
  if(headerIcon){
    if(dataUrl){ headerIcon.innerHTML='<img src="'+dataUrl+'" style="width:32px;height:32px;object-fit:contain;border-radius:6px">'; }
    else { headerIcon.innerHTML='⏱'; }
  }
  // Login — igual
  var loginIcon = document.getElementById('login-logo-icon');
  if(loginIcon){
    if(dataUrl){ loginIcon.innerHTML='<img src="'+dataUrl+'" style="width:48px;height:48px;object-fit:contain;border-radius:10px">'; }
    else { loginIcon.innerHTML='⏱'; }
  }
}

// ========== WHATSAPP ==========
function getNumGrupoLocal(){
  var local = getLocal();
  if(local === 'La Cala') return localStorage.getItem('rt_wa_lacala') || '';
  if(local === "Roto's Burguer") return localStorage.getItem('rt_wa_rotos') || '';
  return '';
}

function formatMsgTurno(emp){
  var semana = getSemanaLabel();
  var DIAS_WA = ['Lunes','Martes','Mi\u00e9rcoles','Jueves','Viernes','S\u00e1bado','Domingo'];
  var lineas = (emp.turnos||[]).map(function(t, di){
    var info = getTInfo(t);
    return DIAS_WA[di]+': '+(t==='fiesta'?'\ud83c\udfd6 FIESTA':info.label);
  }).join('\n');
  return '\ud83d\udcc5 *Tu horario - '+semana+'*\n\ud83d\udccd '+( getLocal()||'el restaurante')+'\n\n'+lineas+'\n\n_Enviado desde RelojTurnos_';
}

// ========== VISTA PÚBLICA CUADRANTE ==========
async function cargarVistaPublica(cuadId){
  document.getElementById('login-screen').style.display='none';
  document.getElementById('vista-publica').style.display='block';
  var loading = document.getElementById('vp-loading');
  var content = document.getElementById('vp-content');
  var errEl   = document.getElementById('vp-error');
  try{
    var cuads = await sbGet('cuadrantes','id=eq.'+cuadId);
    if(!cuads||!cuads.length){ loading.style.display='none'; errEl.style.display='block'; return; }
    var cuad = cuads[0];
    var localNombre = cuad.local_id===1?'La Cala':"Roto's Burguer";

    var turnos = await sbGet('turnos_cuadrante','cuadrante_id=eq.'+cuadId+'&order=empleado_id.asc,dia.asc');
    var emps   = await sbGet('empleados','local_id=eq.'+cuad.local_id+'&activo=eq.true&order=id.asc');

    // Horarios por local y turno
    var HORARIOS = cuad.local_id===1 ? {
      manana:'07:30–16:30', noche:'18:00–03:00', tarde:'15:00–00:00',
      intermedio:'12:00–21:00', partido:'11:00–16:00 / 20:00–23:00',
      fiesta:'FIESTA', mediafiesta:'½ FIESTA'
    } : {
      manana:'11:00–19:00', noche:'16:00–00:00', tarde:'14:00–23:00',
      intermedio:'12:00–20:00', partido:'11:00–16:00 / 20:00–00:00',
      fiesta:'FIESTA', mediafiesta:'½ FIESTA'
    };

    var TURNO_STYLE = {
      manana:   {bg:'#0d2e12', color:'#2ecc71', border:'#1a5a22'},
      tarde:    {bg:'#2e1e00', color:'#f39c12', border:'#5a3a00'},
      noche:    {bg:'#0d0d2e', color:'#5b9bd5', border:'#1a2a5a'},
      intermedio:{bg:'#1e0d2e',color:'#9b59b6', border:'#3a1a5a'},
      partido:  {bg:'#2e1e00', color:'#ffa040', border:'#5a3a00'},
      fiesta:   {bg:'#2e0d0d', color:'#e74c3c', border:'#5a1a1a'},
      mediafiesta:{bg:'#2e0d0d',color:'#e74c3c',border:'#5a1a1a'}
    };

    var turnoMap = {};
    turnos.forEach(function(t){
      if(!turnoMap[t.empleado_id]) turnoMap[t.empleado_id]={};
      turnoMap[t.empleado_id][t.dia]=t.turno;
    });

    var DIAS_C = ['LUN','MAR','MIÉ','JUE','VIE','SÁB','DOM'];
    var COLORS_VP = ['#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6','#1abc9c','#e67e22','#e91e63','#00bcd4'];

    var html = '';

    // Header del cuadrante
    html += '<div style="background:var(--darker);border:1px solid var(--border);border-radius:12px;padding:14px 16px;margin-bottom:16px">';
    html += '<div style="font-size:20px;font-weight:800;color:var(--accent);margin-bottom:4px">📅 '+cuad.semana_label+'</div>';
    html += '<div style="font-size:13px;color:var(--muted)">📍 '+localNombre+' · '+emps.length+' empleados</div>';
    html += '</div>';

    // Tarjeta por empleado — formato móvil
    emps.forEach(function(emp, idx){
      var color = COLORS_VP[idx%COLORS_VP.length];
      var tMap  = turnoMap[emp.id]||{};
      var init  = (emp.nombre||'?').substring(0,2).toUpperCase();
      var totalDias = 0;

      html += '<div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px 14px;margin-bottom:10px">';
      // Nombre empleado
      html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">';
      html += '<div style="width:30px;height:30px;border-radius:50%;background:'+color+'20;color:'+color+';display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;flex-shrink:0">'+init+'</div>';
      html += '<div style="font-weight:700;font-size:14px;color:var(--text)">'+emp.nombre+'</div>';
      html += '<div style="font-size:10px;color:var(--muted);margin-left:auto">'+emp.rol+'</div>';
      html += '</div>';

      // Grid días
      html += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px">';
      for(var d=0;d<7;d++){
        var t  = tMap[d]||'fiesta';
        var st = TURNO_STYLE[t]||TURNO_STYLE['fiesta'];
        var hr = HORARIOS[t]||t;
        var isF= t==='fiesta'||t==='mediafiesta';
        if(!isF) totalDias++;

        // Para turno partido, mostrar en dos líneas
        var lines = hr.split(' / ');
        html += '<div style="text-align:center;padding:4px 2px;border-radius:6px;background:'+st.bg+';border:1px solid '+st.border+'">';
        html += '<div style="font-size:8px;font-weight:700;color:var(--muted);margin-bottom:2px">'+DIAS_C[d]+'</div>';
        if(isF){
          html += '<div style="font-size:11px">🏖</div>';
        } else {
          lines.forEach(function(l){
            html += '<div style="font-size:7.5px;font-weight:700;color:'+st.color+';white-space:nowrap">'+l+'</div>';
          });
        }
        html += '</div>';
      }
      html += '</div>';

      // Total días trabajados
      html += '<div style="margin-top:8px;font-size:10px;color:var(--muted);text-align:right">'+totalDias+' días trabajados</div>';
      html += '</div>';
    });

    // Leyenda
    html += '<div style="margin-top:6px;padding:12px;background:var(--darker);border-radius:10px;border:1px solid var(--border)">';
    html += '<div style="font-size:10px;font-weight:700;color:var(--muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:1px">Leyenda</div>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:6px">';
    var leg=[
      {t:'Mañana',c:'#2ecc71',b:'#0d2e12'},
      {t:'Tarde',c:'#f39c12',b:'#2e1e00'},
      {t:'Noche',c:'#5b9bd5',b:'#0d0d2e'},
      {t:'Intermedio',c:'#9b59b6',b:'#1e0d2e'},
      {t:'Partido',c:'#ffa040',b:'#2e1e00'},
      {t:'🏖 Fiesta',c:'#e74c3c',b:'#2e0d0d'}
    ];
    leg.forEach(function(x){
      html+='<span style="font-size:10px;padding:3px 9px;border-radius:12px;background:'+x.b+';color:'+x.c+'">'+x.t+'</span>';
    });
    html += '</div></div>';

    loading.style.display='none';
    content.innerHTML = html;
    content.style.display='block';

  }catch(e){
    console.error(e);
    loading.style.display='none';
    errEl.style.display='block';
    errEl.textContent='⚠ Error cargando cuadrante: '+e.message;
  }
}

// Enviar cuadrante completo al grupo del local
function enviarCuadranteGrupoWA(){
  var numGrupo = getNumGrupoLocal();
  if(!numGrupo){
    showToast(t('toast_wa_configura'),'orange');
    return;
  }
  if(!currentCuadranteId){
    showToast(t('toast_wa_guarda_bd'),'orange');
    return;
  }
  var semana = getSemanaLabel();
  var local = getLocal() || 'el restaurante';
  var link = 'https://raul79bcn.github.io/relojturnos/dev/?cuadrante='+currentCuadranteId;
  var msg = '📅 *Cuadrante semanal*\n'
    +'*'+semana+'*\n'
    +'📍 '+local+'\n\n'
    +'👇 Pulsa para ver tu horario:\n'
    +link;
  window.open('https://wa.me/'+numGrupo+'?text='+encodeURIComponent(msg), '_blank');
}

// Enviar turno individual — al empleado + al grupo
function enviarTurnoWA(empId){
  var emp = empleados.find(function(e){ return e.id===empId; });
  if(!emp){ showToast(t('toast_empleado_no_encontrado'),'orange'); return; }
  var msg = formatMsgTurno(emp);
  var numEmp = (emp.telefono||'').replace(/\s+/g,'');
  var numGrupo = getNumGrupoLocal();
  var abierto = false;
  if(numEmp){
    window.open('https://wa.me/'+numEmp+'?text='+encodeURIComponent(msg), '_blank');
    abierto = true;
  }
  if(numGrupo){
    setTimeout(function(){
      window.open('https://wa.me/'+numGrupo+'?text='+encodeURIComponent(msg), '_blank');
    }, abierto ? 600 : 0);
    abierto = true;
  }
  if(!abierto){
    showToast(t('toast_wa_sin_telefono'),'orange');
  }
}

// Enviar WA a TODOS los empleados — secuencial con delays
function enviarWATodos(){
  var conTelefono = empleados.filter(function(e){ return (e.telefono||'').replace(/\s+/g,'').length >= 9; });
  var sinTelefono = empleados.filter(function(e){ return !(e.telefono||'').replace(/\s+/g,'').length >= 9; });

  if(!conTelefono.length){
    showToast(t('toast_wa_sin_telefonos'),'orange');
    return;
  }

  var msg = t('wa_confirm_prefix')+conTelefono.length+t('wa_confirm_pax')
    + (sinTelefono.length ? t('wa_confirm_sin_tel')+sinTelefono.map(function(e){return e.nombre;}).join(', ') : '')
    + t('wa_confirm_nota');

  if(!confirm(msg)) return;

  conTelefono.forEach(function(emp, i){
    setTimeout(function(){
      var mensaje = formatMsgTurno(emp);
      var num = (emp.telefono||'').replace(/\s+/g,'');
      window.open('https://wa.me/'+num+'?text='+encodeURIComponent(mensaje), '_blank');
    }, i * 800); // 800ms entre cada uno para no saturar
  });

  showToast(t('toast_wa_enviando')+conTelefono.length+t('toast_wa_empleados'),'green');
}

function guardarConfigWA(){
  var lacala = (document.getElementById('cfg-wa-lacala')||{}).value || '';
  var rotos  = (document.getElementById('cfg-wa-rotos')||{}).value  || '';
  localStorage.setItem('rt_wa_lacala', lacala.replace(/\s+/g,''));
  localStorage.setItem('rt_wa_rotos',  rotos.replace(/\s+/g,''));
  showToast(t('toast_wa_numeros'),'green');
}

// ========== PARÁMETROS COSTE ==========
var SS_EMPRESA_CUSTOM = null;
var DIVISOR_CUSTOM = null;

function aplicarParamsCoste(){
  var ssVal = parseFloat((document.getElementById('cfg-ss')||{}).value);
  var divVal = parseFloat((document.getElementById('cfg-divisor')||{}).value);
  if(!isNaN(ssVal) && ssVal>0){ SS_EMPRESA = ssVal/100; SS_EMPRESA_CUSTOM = ssVal; localStorage.setItem('rt_ss', ssVal); }
  if(!isNaN(divVal) && divVal>0){ DIVISOR_CUSTOM = divVal; localStorage.setItem('rt_div', divVal); }
  // Preview
  var div = (!isNaN(divVal)&&divVal>0)?divVal:4.33;
  var ss = (!isNaN(ssVal)&&ssVal>0)?ssVal/100:0.39;
  var ej = (1800*(1+ss)/div).toFixed(2);
  var ejEl = document.getElementById('cfg-coste-ej');
  if(ejEl) ejEl.textContent = ej+' €';
  if(typeof renderCostes==='function' && document.getElementById('screen7') && document.getElementById('screen7').classList.contains('active')) renderCostes();
  showToast(t('toast_params'),'green');
}

function cargarParamsCosteGuardados(){
  var ss = localStorage.getItem('rt_ss');
  var div = localStorage.getItem('rt_div');
  var waLacala = localStorage.getItem('rt_wa_lacala');
  var waRotos  = localStorage.getItem('rt_wa_rotos');
  if(ss){ SS_EMPRESA = parseFloat(ss)/100; }
  if(div){ DIVISOR_CUSTOM = parseFloat(div); }
  var elSS=document.getElementById('cfg-ss'); if(elSS&&ss) elSS.value=ss;
  var elDiv=document.getElementById('cfg-divisor'); if(elDiv&&div) elDiv.value=div;
  var elWaL=document.getElementById('cfg-wa-lacala'); if(elWaL&&waLacala) elWaL.value=waLacala;
  var elWaR=document.getElementById('cfg-wa-rotos'); if(elWaR&&waRotos) elWaR.value=waRotos;
  var ejEl = document.getElementById('cfg-coste-ej');
  if(ejEl){ var div2=div?parseFloat(div):4.33; var ss2=ss?parseFloat(ss)/100:0.39; ejEl.textContent=(1800*(1+ss2)/div2).toFixed(2)+' €'; }
}

// ========== IDIOMA ==========
// ========== SISTEMA i18n COMPLETO ==========
var LANG_ACTUAL = 'es';

var I18N = {
  es: {
    // Días
    dias: ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'],
    diasShort: ['LUN','MAR','MIÉ','JUE','VIE','SÁB','DOM'],
    // Turnos
    turno_manana:'Mañana', turno_noche:'Noche', turno_tarde:'Tarde',
    turno_intermedio:'Intermedio', turno_partido:'Partido', turno_fiesta:'Fiesta', turno_mediafiesta:'½ Media fiesta',
    // Nav pasos
    nav_local:'Local', nav_turnos:'Turnos', nav_equipo:'Equipo', nav_asignar:'Asignar',
    nav_eventos:'Eventos', nav_cuadrante:'Cuadrante', nav_costes:'Costes',
    nav_direccion:'Dirección General', nav_usuarios:'Usuarios', nav_ajustes:'Ajustes', nav_arqueo:'Arqueo', nav_compras:'Compras',
    // Paso 1
    p1_titulo:'¿Qué local y semana vamos a planificar?',
    p1_sub:'Selecciona el restaurante, la semana y la configuración básica',
    p1_local:'Local', p1_semana:'Semana que empieza el',
    p1_apertura:'Hora apertura', p1_cierre:'Hora cierre',
    p1_diasflojos:'Días de menor afluencia (fiesta sugerida)',
    p1_siguiente:'Siguiente → Configurar turnos',
    opt_selecciona_local:'Selecciona local...',
    // Paso 2
    p2_titulo:'Configura los turnos del local',
    p2_sub:'Turnos calculados automáticamente. Activa solo los que usa este local.',
    p2_media_fiesta:'Duración media fiesta (horas trabajadas)',
    p2_jornada:'Horas jornada completa',
    p2_atras:'← Atrás', p2_siguiente:'Siguiente → Equipo',
    // Paso 3
    p3_titulo:'¿Quién trabaja en este local?',
    p3_sub:'Empleados y su turno habitual. Las horas se calculan solas según los turnos asignados.',
    p3_añadir:'+ Añadir empleado',
    p3_lorena_sub:'Horario orientativo · No computa en cobertura de sala · Sí computa en costes',
    p3_siguiente:'Siguiente → Asignar turnos',
    p3_horas_auto:'Las horas semanales se calculan automáticamente según los turnos asignados',
    p3_nombre_empleado:'Nombre empleado',
    p3_turno_habitual:'Turno habitual',
    // Paso 4
    p4_titulo:'Asigna los turnos de la semana',
    p4_sub:'Fiestas asignadas automáticamente según días flojos y mínimos de personal. Ajusta lo que necesites.',
    p4_recalcular:'⚡ Recalcular fiestas', p4_rotar:'🔀 Rotar días (+1)',
    p4_hint_recalcular:'<strong style="color:var(--green)">Recalcular</strong> — borra las fiestas actuales y las vuelve a asignar desde cero según días flojos y mínimos de personal.',
    p4_hint_rotar:'<strong style="color:var(--purple)">Rotar días</strong> — desplaza los días de descanso de cada empleado +1 día, útil para que no descansen siempre el mismo día.',
    p4_siguiente:'Siguiente → Eventos',
    // Paso 5
    p5_titulo:'¿Hay eventos especiales esta semana?',
    p5_sub:'Partidos, eventos, festivos que necesiten refuerzo de personal',
    p5_no_eventos:'No hay eventos añadidos',
    p5_tipo:'Tipo', p5_dia:'Día', p5_descripcion:'Descripción',
    p5_refuerzo:'Personas de refuerzo',
    p5_añadir_refuerzo:'+ Añadir persona de refuerzo',
    p5_confirmar:'✓ Confirmar y añadir evento',
    p5_generar:'⚡ Generar cuadrante',
    // Paso 6 (botones)
    p6_ocultar_horas:'👁 Ocultar horas', p6_mostrar_horas:'👁 Mostrar horas',
    p6_enviar_grupo:'📲 Enviar grupo WA', p6_wa_todos:'📲 WA a todos',
    p6_imprimir:'🖨 Imprimir', p6_guardar_bd:'💾 Guardar en BD',
    p6_ver_costes:'💰 Ver costes', p6_nueva_semana:'+ Nueva semana',
    p6_editar:'← Editar',
    // Paso 7
    p7_titulo:'💰 Costes de personal',
    p7_sub:'Cuadrante · Bruto nómina + SS empresa + Extras reales',
    p7_atras:'← Cuadrante', p7_dir_gral:'📋 Dirección General',
    // Paso 8
    p8_titulo:'📋 Dirección General',
    p8_sub:'Resumen semanal de todos los locales',
    p8_actualizar:'🔄 Actualizar',
    p8_imprimir:'🖨 Imprimir resumen', p8_arqueo:'💰 Arqueo de caja',
    p8_audit_titulo:'🗂 Registro de actividad',
    // Paso 9
    p9_titulo:'👥 Gestión de Usuarios',
    p9_sub:'Crea y gestiona los accesos del personal',
    p9_nuevo_usuario:'+ Nuevo usuario',
    p9_nombre:'Nombre completo', p9_dni:'DNI / NIE',
    p9_ss:'Nº Afiliación Seg. Social', p9_ss_hint:'Los últimos 4 dígitos serán la contraseña inicial',
    p9_rol:'Rol en la app', p9_local:'Local',
    p9_contacto:'Datos de contacto (opcionales)',
    p9_telefono:'📱 Teléfono / WhatsApp', p9_email:'✉️ Email', p9_direccion:'🏠 Dirección',
    p9_crear:'🔒 Crear usuario',
    p9_lista:'Usuarios registrados', p9_actualizar:'🔄 Actualizar lista',
    // Paso 10
    p10_titulo:'🎨 Personalización',
    p10_sub:'Adapta la apariencia de RelojTurnos a tu empresa',
    p10_color:'✨ Color principal', p10_color_custom:'Personalizado:',
    p10_tema:'🌙 Tema', p10_tema_dark:'🌑 Oscuro', p10_tema_light:'☀️ Claro', p10_tema_navy:'⚓ Marino',
    p10_logo:'🖼️ Logo empresa', p10_logo_sub:'Header, login y documentos impresos',
    p10_logo_subir:'📁 Subir imagen', p10_logo_quitar:'🗑',
    p10_empresa:'🏢 Nombre empresa',
    p10_preview:'👁 Vista previa',
    p10_costes_titulo:'💰 Parámetros de coste', p10_costes_sub:'Afectan a todos los cálculos de nómina y SS',
    p10_ss_pct:'% SS empresa', p10_divisor:'Divisor mensual',
    p10_ss_hint2:'Estándar hostelería: 39%', p10_divisor_hint:'Estándar: 4,33',
    p10_wa_titulo:'📲 WhatsApp grupos', p10_wa_sub:'Número del grupo de WhatsApp de cada local',
    p10_wa_hint:'💡 Teléfonos individuales de empleados se configuran en Gestión Usuarios',
    p10_idioma:'🌍 Idioma',
    p10_nota:'ⓘ Los cambios se guardan en tu navegador al instante.',
    p10_aviso_parcial:'⚠ Cambio parcial en esta versión',
    p10_btn_usuarios:'← Usuarios', p10_btn_reset:'↺ Restablecer por defecto',
    p10_ejemplo:'Ejemplo: 1.800€ →', p10_sem:'/ sem',
    prev_activo:'Activo', prev_normal:'Normal',
    arq_edit_banner:'✏️ Modo edición — Estás modificando un arqueo guardado. Pulsa Guardar para confirmar o Limpiar para cancelar.',
    arq_lbl_local:'Local', arq_lbl_turno:'Turno', arq_lbl_fecha:'Fecha', arq_lbl_resp:'Responsable',
    arq_sec_efectivo:'💰 Efectivo inicial', arq_lbl_fondo:'Fondo de caja (€)', arq_hint_fondo:'Importe fijo siempre en caja',
    arq_lbl_cambio:'Cambio extra añadido (€)', arq_hint_cambio:'Sacado de caja fuerte si faltaba',
    arq_sec_ingresos:'↑ Ingresos del turno', arq_lbl_venta:'Venta total del turno (€)',
    arq_lbl_visa:'Cobrado por VISA/TPV (€)', arq_hint_visa:'Se descuenta del efectivo',
    arq_sec_pagos:'↓ Pagos a proveedores', arq_btn_anadir:'＋ Añadir',
    arq_sin_pagos:'Sin pagos a proveedores este turno', arq_total_pagos_lbl:'Total pagos:',
    arq_sec_resultado:'📊 Resultado del turno', arq_total_caja:'Total entradas (venta + extracambio)', arq_total_salidas:'Total salidas (VISA + proveedores)',
    arq_ef_recaud:'💵 EFECTIVO RECAUDACIÓN → CAJA FUERTE', arq_hint_ingresar:'A ingresar en caja fuerte (descontando fondo',
    arq_hint_fuerte:'El fondo queda en el cajón para el siguiente turno',
    arq_lbl_notas:'Notas / Incidencias',
    arq_btn_volver:'← Volver', arq_btn_limpiar:'↺ Limpiar', arq_btn_imprimir:'🖨 Imprimir', arq_btn_guardar:'💾 Guardar arqueo',
    arq_historico_titulo:'📅 Últimos arqueos guardados',
    // Paso 11 - Arqueo
    p11_titulo:'💰 Arqueo de Caja',
    p11_sub:'Registro de cierre de turno',
    p11_fecha:'📅 Fecha', p11_turno:'Turno',
    p11_turno_m:'Mañana', p11_turno_n:'Noche', p11_turno_t:'Tarde',
    p11_responsable:'Responsable',
    p11_fondo:'💵 Fondo inicial caja', p11_venta:'🧾 Venta total declarada',
    p11_visa:'💳 VISA / TPV', p11_efectivo:'💵 Efectivo (Venta - VISA)',
    p11_entregado:'💰 Efectivo entregado', p11_diferencia:'⚖️ Diferencia',
    p11_proveedores:'📦 Pagos a proveedores',
    p11_añadir_prov:'+ Añadir proveedor',
    p11_notas:'📝 Notas / incidencias',
    p11_guardar:'💾 Guardar arqueo', p11_limpiar:'🗑 Limpiar', p11_imprimir:'🖨 Imprimir',
    p11_historico:'📋 Histórico de arqueos',
    p11_editar_banner:'✏️ Editando arqueo ID ',
    p11_cancelar:'Cancelar edición',
    // Paso 12 - Compras
    p12_titulo:'🛒 Gestión de Compras', p12_sub:'Artículos, proveedores, precios y análisis de rentabilidad',
    p12_tab_articulos:'📦 Artículos', p12_tab_proveedores:'🏭 Proveedores',
    p12_tab_precios:'💶 Precios', p12_tab_analisis:'📊 Análisis',
    p12_nuevo_art:'+ Artículo', p12_nuevo_prov:'+ Proveedor', p12_nuevo_precio:'+ Precio',
    // Login
    login_dni:'DNI / NIE', login_password:'Contraseña', login_btn:'Entrar',
    login_demo:'DEMO', login_error:'Usuario o contraseña incorrectos',
    login_footer:'Gestión de turnos para hostelería',
    // Portal empleado
    portal_cuadrante:'📅 Cuadrante', portal_contrato:'📄 Mi contrato',
    portal_actividad:'🗂 Mi actividad', portal_password:'🔒 Contraseña',
    portal_cambiar_pass:'Cambiar contraseña',
    portal_pass_actual:'Contraseña actual', portal_pass_nueva:'Nueva contraseña',
    portal_pass_repite:'Repetir nueva contraseña',
    portal_pass_btn:'🔒 Cambiar contraseña',
    portal_cerrar:'← Cerrar sesión',
    // Toasts
    toast_bienvenida:'✓ Bienvenida/o ',
    toast_conectado:'✓ Conectado a base de datos',
    toast_conectado_default:'✓ Conectado (locales por defecto)',
    toast_sin_tabla:'⚠ Sin tabla locales — modo local',
    toast_local_no_encontrado:'Local no encontrado en BD',
    toast_actualizando_cuad:'⏳ Actualizando cuadrante existente...',
    toast_cuad_guardado:'✓ Cuadrante guardado en base de datos',
    toast_cuad_error:'Error al guardar: ',
    toast_cargando_equipo:'⏳ Cargando equipo...',
    toast_equipo_cargado:'✓ Equipo cargado desde BD ',
    toast_sin_empleados:'ℹ Sin empleados en BD — usando equipo por defecto',
    toast_error_bd:'⚠ Error cargando BD — usando equipo por defecto',
    toast_fiestas_rotadas:'🔀 Fiestas rotadas — revisa el cuadrante',
    toast_color:'✓ Color aplicado', toast_tema:'✓ Tema aplicado',
    toast_nombre:'✓ Nombre actualizado', toast_restablecido:'✓ Ajustes restablecidos',
    toast_logo_grande:'⚠ Imagen muy grande (máx 500KB)',
    toast_logo_ok:'✓ Logo actualizado', toast_logo_quitado:'✓ Logo eliminado',
    toast_wa_configura:'⚠ Configura el número del grupo en Ajustes → WhatsApp',
    toast_wa_guarda_bd:'⚠ Primero guarda el cuadrante en BD (botón 💾)',
    toast_empleado_no_encontrado:'Empleado no encontrado',
    toast_wa_sin_telefono:'⚠ Añade el teléfono del empleado en Usuarios',
    toast_wa_sin_telefonos:'⚠ Ningún empleado tiene teléfono configurado en Usuarios',
    toast_wa_enviando:'📲 Enviando a ',
    toast_wa_empleados:' empleados...',
    toast_wa_numeros:'✓ Números guardados',
    toast_params:'✓ Parámetros actualizados',
    toast_idioma:'✓ Idioma aplicado',
    toast_arq_invalido:'ID de arqueo inválido',
    toast_arq_no_encontrado:'Arqueo no encontrado',
    toast_arq_cargado:'✏️ Arqueo cargado para edición',
    toast_arq_error_carga:'Error cargando arqueo: ',
    toast_edicion_cancelada:'Edición cancelada — formulario limpio',
    toast_pass_cambiada:'✓ Contraseña cambiada correctamente',
    toast_usuario_creado:'✓ Usuario creado',
    toast_password_incorrecta:'La contraseña actual es incorrecta',
    // Misc
    cobertura:'COBERTURA', personas:'pers.',
    turno_m_label:'Mañana', turno_n_label:'Noche', turno_t_label:'Tarde',
    turno_i_label:'Intermedio', turno_p_label:'Partido', turno_mf_label:'½ Media fiesta',
    apoyo_operativo:'Apoyo operativo · No computa en cobertura',
    generado_por:'Generado por', todos_derechos:'Todos los derechos reservados',
    wa_confirm_prefix:'¿Enviar turno individual por WhatsApp a ',
    wa_confirm_pax:' empleado(s)?',
    wa_confirm_sin_tel:'\n\nSin teléfono (no se enviarán): ',
    wa_confirm_nota:'\n\nEl navegador abrirá una ventana por cada empleado.',
    horas_short:'h', fiestas_btn:'Fiestas', eventos_btn:'Eventos',
    opt_selecciona:'Selecciona...',
    err_rellena:'Rellena todos los campos',
    err_pass_min:'La contraseña debe tener al menos 4 caracteres',
    err_pass_no_coincide:'Las contraseñas no coinciden',
    err_ss_min:'El nº de afiliación debe tener al menos 4 dígitos',
    err_dni_existe:'Ya existe un usuario con ese DNI',
    err_crear_usuario:'Error al crear usuario: ',
    err_cambiar_pass:'Error al cambiar la contraseña. Inténtalo de nuevo.',
    lbl_salario_bruto:'Salario bruto/mes', lbl_horas_contrato:'Horas contrato/semana',
    nominas_proximamente:'Las nóminas digitales estarán disponibles próximamente',
    sin_datos_contrato:'No hay datos de contrato disponibles',
    err_datos_contrato:'No se pudieron cargar los datos',
    audit_sin_registros:'Sin registros',
    audit_cargando:'⏳ Cargando...',
    vacaciones:'VACACIONES',
    // Alerts
    alert_selecciona_local:'Selecciona un local',
    alert_selecciona_desc:'Selecciona una descripción del evento',
    alert_pon_nombre_refuerzo:'Pon el nombre de cada persona de refuerzo',
    alert_añade_empleado:'Añade al menos un empleado',
    alert_añade_refuerzo:'Añade al menos una persona de refuerzo',
    alert_no_datos_imprimir:'No hay datos que imprimir',
    alert_permite_popups:'Permite las ventanas emergentes para esta página y vuelve a intentarlo.',
    alert_permite_popups2:'Permite las ventanas emergentes y vuelve a intentarlo.',
    alert_permite_popups3:'Permite ventanas emergentes',
    // Cuadrante generado
    cuad_generado:'📋 Cuadrante generado',
    cuad_cobertura:'COBERTURA',
    cuad_lorena_sub:'Apoyo operativo · No computa en cobertura',
    cuad_eventos:'⚡ Eventos especiales de la semana',
    cuad_generado_por:'Generado por',
    cuad_desarrollado:'Desarrollado por',
    cuad_derechos:'Todos los derechos reservados',
    // Dynamic render strings
    tc_activo:'Activo', tc_inactivo:'Inactivo',
    tc_turno:'Turno', tc_tramo1_desde:'Tramo 1 desde', tc_tramo1_hasta:'Tramo 1 hasta',
    tc_tramo2_desde:'Tramo 2 desde', tc_tramo2_hasta:'Tramo 2 hasta',
    tc_desde:'Desde', tc_hasta:'Hasta',
    lbl_rol:'Rol', lbl_turno_hab:'Turno habitual',
    lbl_dias_fiesta:'Días fiesta / semana',
    opt_1dia:'1 día', opt_15dias:'1,5 días (recomendado)', opt_2dias:'2 días', opt_3dias:'3 días',
    sel_empleado:'— Seleccionar empleado —',
    col_empleado:'EMPLEADO', col_rol:'ROL', col_horas:'HORAS',
    kpi_empleados:'Empleados', kpi_horas_tot:'Horas totales', kpi_cob_dia:'Cobertura/día', kpi_eventos:'Eventos',
    kpi_h_pactadas:'H. pactadas', kpi_coste_fijo:'Coste fijo sem.', kpi_extras_sem:'Extras sem.',
    kpi_total_sem:'Total semana', kpi_total_mes:'Total mes est.', kpi_eur_hora:'€/hora real', kpi_extras_anotadas:'Extras anotadas',
    lbl_h_pactadas:'H. Pactadas / semana', lbl_coste_sem:'Coste / semana', lbl_coste_mes_ss:'Coste / mes (con SS)',
    sin_datos_sal:'Sin datos salariales', extras_registradas:'⚡ EXTRAS REGISTRADAS',
    coste_extra_lbl:'⚡ Coste extra:',
    sin_extras:'Sin extras registradas esta semana',
    h_extra_tot:'Total h. extra', coste_extras_sem:'Coste extras semana',
    lbl_empleado:'Empleado', lbl_dia:'Día', lbl_h_extra:'Horas extra', lbl_eur_h:'€ / hora extra', lbl_motivo:'Motivo',
    director_locales_activos:'LOCALES ACTIVOS', director_total_emps:'TOTAL EMPLEADOS',
    director_coste_total:'COSTE TOTAL SEMANA', director_cob_min:'COBERTURA MÍNIMA',
    director_semana:'Semana:', director_sin_cuad:'Sin cuadrante esta semana',
    director_genera_cuad:'Genera el cuadrante para ver datos',
    director_cob_dia:'COBERTURA/DÍA', director_coste_sem:'COSTE/SEM', director_fiestas_sem:'FIESTAS SEM',
    director_comp:'Comparativa de coste semanal',
    director_cargando:'⏳ Cargando datos...',
    portal_cargando_cuad:'⏳ Cargando cuadrante...',
    portal_no_cuad:'No hay cuadrante disponible esta semana',
    portal_error_cuad:'No se pudo cargar el cuadrante',
    portal_mis_datos:'📄 Mis datos de contrato',
    portal_nombre:'Nombre:', portal_rol_lbl:'Rol:',
    portal_sal_bruto:'Salario bruto/mes:', portal_h_contrato:'Horas contrato/semana:',
    portal_no_contrato:'No hay datos de contrato disponibles',
    portal_error_contrato:'No se pudieron cargar los datos',
    portal_mi_actividad:'🗂 Mi actividad reciente',
    arq_sin_arqueos:'Sin arqueos guardados aún',
    arq_venta:'Venta:', arq_a_ingresar:'A ingresar',
    arq_editar:'✏️ Editar',
    arq_print_titulo:'💰 Arqueo de Caja',
    arq_print_turno:'Turno', arq_print_cierre:'Cierre', arq_print_resp:'Responsable:',
    arq_print_ef_inicial:'Efectivo inicial', arq_print_fondo:'Fondo de caja',
    arq_print_cambio:'Cambio extra añadido', arq_print_total_disp:'Total disponible',
    arq_print_ingresos:'Ingresos del turno', arq_print_venta:'Venta total',
    arq_print_visa:'Cobrado por VISA/TPV', arq_print_pagos_prov:'Pagos a proveedores',
    arq_print_total_pagos:'Total pagos', arq_print_total_caja:'Total en caja:',
    arq_print_total_sal:'Total salidas:', arq_print_ef_recaud:'Efectivo recaudación',
    arq_print_fondo_queda:'Fondo que queda en caja:',
    arq_print_a_ingresar:'▶ A ingresar en caja fuerte:',
    arq_print_notas:'Notas:', arq_print_sin_prov:'Sin pagos a proveedores',
    arq_audit_line:'⚠ Registro creado por Dirección General:',
    info_apertura:'✓ Apertura', info_cierre:'Cierre', info_activa_turnos:'Activa solo los turnos que usa este local.',
    sin_datos:'Sin datos', locales_activos_lbl:'locales',
    lbl_nombre_emp:'Nombre:', directora_lbl:'Director/a',
    arq_modificado:'Modificado por Dirección General',
  },

  ca: {
    dias: ['Dilluns','Dimarts','Dimecres','Dijous','Divendres','Dissabte','Diumenge'],
    diasShort: ['DLL','DIM','DMC','DIJ','DIV','DIS','DIU'],
    turno_manana:'Matí', turno_noche:'Nit', turno_tarde:'Tarda',
    turno_intermedio:'Intermedi', turno_partido:'Partit', turno_fiesta:'Festa', turno_mediafiesta:'½ Mitja festa',
    nav_local:'Local', nav_turnos:'Torns', nav_equipo:'Equip', nav_asignar:'Assignar',
    nav_eventos:'Esdeveniments', nav_cuadrante:'Quadrant', nav_costes:'Costos',
    nav_direccion:'Dirección General', nav_usuarios:'Usuaris', nav_ajustes:'Ajustos', nav_arqueo:'Arqueig', nav_compras:'Compres',
    p1_titulo:'Quin local i setmana planificarem?',
    p1_sub:'Selecciona el restaurant, la setmana i la configuració bàsica',
    p1_local:'Local', p1_semana:'Setmana que comença el',
    p1_apertura:'Hora obertura', p1_cierre:'Hora tancament',
    p1_diasflojos:'Dies de menor afluència (festa suggerida)',
    p1_siguiente:'Següent → Configurar torns',
    opt_selecciona_local:'Selecciona local...',
    p2_titulo:'Configura els torns del local',
    p2_sub:'Torns calculats automàticament. Activa només els que usa aquest local.',
    p2_media_fiesta:'Durada mitja festa (hores treballades)',
    p2_jornada:'Hores jornada completa',
    p2_atras:'← Enrere', p2_siguiente:'Següent → Equip',
    p3_titulo:'Qui treballa en aquest local?',
    p3_sub:'Empleats i el seu torn habitual. Les hores es calculen soles.',
    p3_añadir:'+ Afegir empleat',
    p3_lorena_sub:'Horari orientatiu · No computa en cobertura de sala · Sí computa en costos',
    p3_siguiente:'Següent → Assignar torns',
    p3_horas_auto:'Les hores setmanals es calculen automàticament segons els torns assignats',
    p3_nombre_empleado:'Nom empleat',
    p3_turno_habitual:'Torn habitual',
    p4_titulo:'Assigna els torns de la setmana',
    p4_sub:'Festes assignades automàticament. Ajusta el que necessitis.',
    p4_recalcular:'⚡ Recalcular festes', p4_rotar:'🔀 Rotar dies (+1)',
    p4_hint_recalcular:'<strong style="color:var(--green)">Recalcular</strong> — esborra les festes actuals i les torna a assignar des de zero.',
    p4_hint_rotar:'<strong style="color:var(--purple)">Rotar dies</strong> — desplaça els dies de descans de cada empleat +1 dia.',
    p4_siguiente:'Següent → Esdeveniments',
    p5_titulo:'Hi ha esdeveniments especials aquesta setmana?',
    p5_sub:'Partits, events, festius que necessitin reforç de personal',
    p5_no_eventos:'No hi ha esdeveniments afegits',
    p5_tipo:'Tipus', p5_dia:'Dia', p5_descripcion:'Descripció',
    p5_refuerzo:'Persones de reforç',
    p5_añadir_refuerzo:'+ Afegir persona de reforç',
    p5_confirmar:'✓ Confirmar i afegir esdeveniment',
    p5_generar:'⚡ Generar quadrant',
    p6_ocultar_horas:'👁 Ocultar hores', p6_mostrar_horas:'👁 Mostrar hores',
    p6_enviar_grupo:'📲 Enviar grup WA', p6_wa_todos:'📲 WA a tots',
    p6_imprimir:'🖨 Imprimir', p6_guardar_bd:'💾 Guardar a BD',
    p6_ver_costes:'💰 Veure costos', p6_nueva_semana:'+ Nova setmana',
    p6_editar:'← Editar',
    p7_titulo:'💰 Costos de personal',
    p7_sub:'Quadrant · Brut nòmina + SS empresa + Extres reals',
    p7_atras:'← Quadrant', p7_dir_gral:'📋 Direcció General',
    p8_titulo:'📋 Direcció General',
    p8_sub:'Resum setmanal de tots els locals',
    p8_actualizar:'🔄 Actualitzar',
    p8_imprimir:'🖨 Imprimir resum', p8_arqueo:'💰 Arqueig de caixa',
    p8_audit_titulo:'🗂 Registre d\'activitat',
    p9_titulo:'👥 Gestió d\'Usuaris',
    p9_sub:'Crea i gestiona els accessos del personal',
    p9_nuevo_usuario:'+ Nou usuari',
    p9_nombre:'Nom complet', p9_dni:'DNI / NIE',
    p9_ss:'Nº Afiliació Seg. Social', p9_ss_hint:'Els últims 4 dígits seran la contrasenya inicial',
    p9_rol:'Rol a l\'app', p9_local:'Local',
    p9_contacto:'Dades de contacte (opcionals)',
    p9_telefono:'📱 Telèfon / WhatsApp', p9_email:'✉️ Email', p9_direccion:'🏠 Adreça',
    p9_crear:'🔒 Crear usuari',
    p9_lista:'Usuaris registrats', p9_actualizar:'🔄 Actualitzar llista',
    p10_titulo:'🎨 Personalització',
    p10_sub:'Adapta l\'aparença de RelojTurnos a la teva empresa',
    p10_color:'✨ Color principal', p10_color_custom:'Personalitzat:',
    p10_tema:'🌙 Tema', p10_tema_dark:'🌑 Fosc', p10_tema_light:'☀️ Clar', p10_tema_navy:'⚓ Marí',
    p10_logo:'🖼️ Logo empresa', p10_logo_sub:'Capçalera, login i documents impresos',
    p10_logo_subir:'📁 Pujar imatge', p10_logo_quitar:'🗑',
    p10_empresa:'🏢 Nom empresa',
    p10_preview:'👁 Previsualització',
    p10_costes_titulo:'💰 Paràmetres de cost', p10_costes_sub:'Afecten tots els càlculs de nòmina i SS',
    p10_ss_pct:'% SS empresa', p10_divisor:'Divisor mensual',
    p10_ss_hint2:'Estàndard hostaleria: 39%', p10_divisor_hint:'Estàndard: 4,33',
    p10_wa_titulo:'📲 WhatsApp grups', p10_wa_sub:'Número del grup de WhatsApp de cada local',
    p10_wa_hint:'💡 Telèfons individuals d\'empleats es configuren a Gestió d\'Usuaris',
    p10_idioma:'🌍 Idioma',
    p10_nota:'ⓘ Els canvis es guarden al navegador al instant.',
    p10_aviso_parcial:'⚠ Canvi parcial en aquesta versió',
    p10_btn_usuarios:'← Usuaris', p10_btn_reset:'↺ Restablir per defecte',
    p10_ejemplo:'Exemple: 1.800€ →', p10_sem:'/ set.',
    prev_activo:'Actiu', prev_normal:'Normal',
    arq_edit_banner:'✏️ Mode edició — Estàs modificant un arqueig guardat. Prem Guardar per confirmar o Netejar per cancel·lar.',
    arq_lbl_local:'Local', arq_lbl_turno:'Torn', arq_lbl_fecha:'Data', arq_lbl_resp:'Responsable',
    arq_sec_efectivo:'💰 Efectiu inicial', arq_lbl_fondo:'Fons de caixa (€)', arq_hint_fondo:'Import fix sempre a caixa',
    arq_lbl_cambio:'Canvi extra afegit (€)', arq_hint_cambio:'Tret de la caixa forta si faltava',
    arq_sec_ingresos:'↑ Ingressos del torn', arq_lbl_venta:'Venda total del torn (€)',
    arq_lbl_visa:'Cobrat per VISA/TPV (€)', arq_hint_visa:'Es descompta de l\'efectiu',
    arq_sec_pagos:'↓ Pagaments a proveïdors', arq_btn_anadir:'＋ Afegir',
    arq_sin_pagos:'Sense pagaments a proveïdors aquest torn', arq_total_pagos_lbl:'Total pagaments:',
    arq_sec_resultado:'📊 Resultat del torn', arq_total_caja:'Total entrades (venda + extracambi)', arq_total_salidas:'Total sortides (VISA + proveïdors)',
    arq_ef_recaud:'💵 EFECTIU RECAPTACIÓ → CAIXA FORTA', arq_hint_ingresar:'A ingressar a la caixa forta (descomptant fons',
    arq_hint_fuerte:'El fons queda al calaix per al torn següent',
    arq_lbl_notas:'Notes / Incidències',
    arq_btn_volver:'← Tornar', arq_btn_limpiar:'↺ Netejar', arq_btn_imprimir:'🖨 Imprimir', arq_btn_guardar:'💾 Guardar arqueig',
    arq_historico_titulo:'📅 Últims arqueigs guardats',
    p11_titulo:'💰 Arqueig de Caixa',
    p11_sub:'Registre de tancament de torn',
    p11_fecha:'📅 Data', p11_turno:'Torn',
    p11_turno_m:'Matí', p11_turno_n:'Nit', p11_turno_t:'Tarda',
    p11_responsable:'Responsable',
    p11_fondo:'💵 Fons inicial caixa', p11_venta:'🧾 Venda total declarada',
    p11_visa:'💳 VISA / TPV', p11_efectivo:'💵 Efectiu (Venda - VISA)',
    p11_entregado:'💰 Efectiu lliurat', p11_diferencia:'⚖️ Diferència',
    p11_proveedores:'📦 Pagaments a proveïdors',
    p11_añadir_prov:'+ Afegir proveïdor',
    p11_notas:'📝 Notes / incidències',
    p11_guardar:'💾 Guardar arqueig', p11_limpiar:'🗑 Netejar', p11_imprimir:'🖨 Imprimir',
    p11_historico:'📋 Historial d\'arqueigs',
    p11_editar_banner:'✏️ Editant arqueig ID ',
    p11_cancelar:'Cancel·lar edició',
    login_dni:'DNI / NIE', login_password:'Contrasenya', login_btn:'Entrar',
    login_demo:'DEMO', login_error:'Usuari o contrasenya incorrectes',
    login_footer:'Gestió de torns per a hostaleria',
    portal_cuadrante:'📅 Quadrant', portal_contrato:'📄 El meu contracte',
    portal_actividad:'🗂 La meva activitat', portal_password:'🔒 Contrasenya',
    portal_cambiar_pass:'Canviar contrasenya',
    portal_pass_actual:'Contrasenya actual', portal_pass_nueva:'Nova contrasenya',
    portal_pass_repite:'Repetir nova contrasenya',
    portal_pass_btn:'🔒 Canviar contrasenya',
    portal_cerrar:'← Tancar sessió',
    toast_bienvenida:'✓ Benvinguda/ut ',
    toast_conectado:'✓ Connectat a base de dades',
    toast_conectado_default:'✓ Connectat (locals per defecte)',
    toast_sin_tabla:'⚠ Sense taula locals — mode local',
    toast_local_no_encontrado:'Local no trobat a BD',
    toast_actualizando_cuad:'⏳ Actualitzant quadrant existent...',
    toast_cuad_guardado:'✓ Quadrant guardat a la base de dades',
    toast_cuad_error:'Error en guardar: ',
    toast_cargando_equipo:'⏳ Carregant equip...',
    toast_equipo_cargado:'✓ Equip carregat des de BD ',
    toast_sin_empleados:'ℹ Sense empleats a BD — usant equip per defecte',
    toast_error_bd:'⚠ Error carregant BD — usant equip per defecte',
    toast_fiestas_rotadas:'🔀 Festes rotades — revisa el quadrant',
    toast_color:'✓ Color aplicat', toast_tema:'✓ Tema aplicat',
    toast_nombre:'✓ Nom actualitzat', toast_restablecido:'✓ Ajustos restablerts',
    toast_logo_grande:'⚠ Imatge massa gran (màx 500KB)',
    toast_logo_ok:'✓ Logo actualitzat', toast_logo_quitado:'✓ Logo eliminat',
    toast_wa_configura:'⚠ Configura el número del grup a Ajustos → WhatsApp',
    toast_wa_guarda_bd:'⚠ Primer guarda el quadrant a BD (botó 💾)',
    toast_empleado_no_encontrado:'Empleat no trobat',
    toast_wa_sin_telefono:'⚠ Afegeix el telèfon de l\'empleat a Usuaris',
    toast_wa_sin_telefonos:'⚠ Cap empleat té telèfon configurat a Usuaris',
    toast_wa_enviando:'📲 Enviant a ',
    toast_wa_empleados:' empleats...',
    toast_wa_numeros:'✓ Números guardats',
    toast_params:'✓ Paràmetres actualitzats',
    toast_idioma:'✓ Idioma aplicat',
    toast_arq_invalido:'ID d\'arqueig invàlid',
    toast_arq_no_encontrado:'Arqueig no trobat',
    toast_arq_cargado:'✏️ Arqueig carregat per editar',
    toast_arq_error_carga:'Error carregant arqueig: ',
    toast_edicion_cancelada:'Edició cancel·lada — formulari net',
    toast_pass_cambiada:'✓ Contrasenya canviada correctament',
    toast_usuario_creado:'✓ Usuari creat',
    toast_password_incorrecta:'La contrasenya actual és incorrecta',
    err_rellena:'Omple tots els camps',
    err_pass_min:'La contrasenya ha de tenir almenys 4 caràcters',
    err_pass_no_coincide:'Les contrasenyes no coincideixen',
    err_ss_min:'El nº d\'afiliació ha de tenir almenys 4 dígits',
    err_dni_existe:'Ja existeix un usuari amb aquest DNI',
    err_crear_usuario:'Error en crear usuari: ',
    err_cambiar_pass:'Error en canviar la contrasenya. Torna-ho a intentar.',
    cobertura:'COBERTURA', personas:'pers.',
    turno_m_label:'Matí', turno_n_label:'Nit', turno_t_label:'Tarda',
    turno_i_label:'Intermedi', turno_p_label:'Partit', turno_mf_label:'½ Mitja festa',
    apoyo_operativo:'Horari orientatiu · No computa en cobertura',
    generado_por:'Generat per', todos_derechos:'Tots els drets reservats',
    wa_confirm_prefix:'Enviar torn individual per WhatsApp a ',
    wa_confirm_pax:' empleat(s)?',
    wa_confirm_sin_tel:'\n\nSense telèfon (no s\'enviaran): ',
    wa_confirm_nota:'\n\nEl navegador obrirà una finestra per a cada empleat.',
    horas_short:'h', opt_selecciona:'Selecciona...',
    lbl_salario_bruto:'Salari brut/mes', lbl_horas_contrato:'Hores contracte/setmana',
    nominas_proximamente:'Les nòmines digitals estaran disponibles aviat',
    sin_datos_contrato:'No hi ha dades de contracte disponibles',
    err_datos_contrato:'No s\'han pogut carregar les dades',
    audit_sin_registros:'Sense registres',
    audit_cargando:'⏳ Carregant...',
    vacaciones:'VACANCES',
    alert_selecciona_local:'Selecciona un local',
    alert_selecciona_desc:'Selecciona una descripció de l\'esdeveniment',
    alert_pon_nombre_refuerzo:'Posa el nom de cada persona de reforç',
    alert_añade_empleado:'Afegeix almenys un empleat',
    alert_añade_refuerzo:'Afegeix almenys una persona de reforç',
    alert_no_datos_imprimir:'No hi ha dades per imprimir',
    alert_permite_popups:'Permet les finestres emergents per a aquesta pàgina i torna-ho a intentar.',
    alert_permite_popups2:'Permet les finestres emergents i torna-ho a intentar.',
    alert_permite_popups3:'Permet les finestres emergents',
    cuad_generado:'📋 Quadrant generat',
    cuad_cobertura:'COBERTURA',
    cuad_lorena_sub:'Horari orientatiu · No computa en cobertura',
    cuad_eventos:'⚡ Esdeveniments especials de la setmana',
    cuad_generado_por:'Generat per', cuad_desenvolupado:'Desenvolupat per',
    cuad_derechos:'Tots els drets reservats',
    tc_activo:'Actiu', tc_inactivo:'Inactiu',
    tc_turno:'Torn', tc_tramo1_desde:'Tram 1 des de', tc_tramo1_hasta:'Tram 1 fins a',
    tc_tramo2_desde:'Tram 2 des de', tc_tramo2_hasta:'Tram 2 fins a',
    tc_desde:'Des de', tc_hasta:'Fins a',
    lbl_rol:'Rol', lbl_turno_hab:'Torn habitual',
    lbl_dias_fiesta:'Dies festa / setmana',
    opt_1dia:'1 dia', opt_15dias:'1,5 dies (recomanat)', opt_2dias:'2 dies', opt_3dias:'3 dies',
    sel_empleado:'— Seleccionar empleat —',
    col_empleado:'EMPLEAT', col_rol:'ROL', col_horas:'HORES',
    kpi_empleados:'Empleats', kpi_horas_tot:'Hores totals', kpi_cob_dia:'Cobertura/dia', kpi_eventos:'Esdeveniments',
    kpi_h_pactadas:'H. pactades', kpi_coste_fijo:'Cost fix set.', kpi_extras_sem:'Extres set.',
    kpi_total_sem:'Total setmana', kpi_total_mes:'Total mes est.', kpi_eur_hora:'€/hora real', kpi_extras_anotadas:'Extres anotades',
    lbl_h_pactadas:'H. Pactades / setmana', lbl_coste_sem:'Cost / setmana', lbl_coste_mes_ss:'Cost / mes (amb SS)',
    sin_datos_sal:'Sense dades salarials', extras_registradas:'⚡ EXTRES REGISTRADES',
    coste_extra_lbl:'⚡ Cost extra:',
    sin_extras:'Sense extres registrades aquesta setmana',
    h_extra_tot:'Total h. extra', coste_extras_sem:'Cost extres setmana',
    lbl_empleado:'Empleat', lbl_dia:'Dia', lbl_h_extra:'Hores extra', lbl_eur_h:'€ / hora extra', lbl_motivo:'Motiu',
    director_locales_activos:'LOCALS ACTIUS', director_total_emps:'TOTAL EMPLEATS',
    director_coste_total:'COST TOTAL SETMANA', director_cob_min:'COBERTURA MÍNIMA',
    director_semana:'Setmana:', director_sin_cuad:'Sense quadrant aquesta setmana',
    director_genera_cuad:'Genera el quadrant per veure dades',
    director_cob_dia:'COBERTURA/DIA', director_coste_sem:'COST/SET', director_fiestas_sem:'FESTES SET',
    director_comp:'Comparativa de cost setmanal',
    director_cargando:'⏳ Carregant dades...',
    portal_cargando_cuad:'⏳ Carregant quadrant...',
    portal_no_cuad:'No hi ha quadrant disponible aquesta setmana',
    portal_error_cuad:'No s\'ha pogut carregar el quadrant',
    portal_mis_datos:'📄 Les meves dades de contracte',
    portal_nombre:'Nom:', portal_rol_lbl:'Rol:',
    portal_sal_bruto:'Salari brut/mes:', portal_h_contrato:'Hores contracte/setmana:',
    portal_no_contrato:'No hi ha dades de contracte disponibles',
    portal_error_contrato:'No s\'han pogut carregar les dades',
    portal_mi_actividad:'🗂 La meva activitat recent',
    arq_sin_arqueos:'Sense arqueigs guardats encara',
    arq_venta:'Venda:', arq_a_ingresar:'A ingressar',
    arq_editar:'✏️ Editar',
    arq_print_titulo:'💰 Arqueig de Caixa',
    arq_print_turno:'Torn', arq_print_cierre:'Tancament', arq_print_resp:'Responsable:',
    arq_print_ef_inicial:'Efectiu inicial', arq_print_fondo:'Fons de caixa',
    arq_print_cambio:'Canvi extra afegit', arq_print_total_disp:'Total disponible',
    arq_print_ingresos:'Ingressos del torn', arq_print_venta:'Venda total',
    arq_print_visa:'Cobrat per VISA/TPV', arq_print_pagos_prov:'Pagaments a proveïdors',
    arq_print_total_pagos:'Total pagaments', arq_print_total_caja:'Total a caixa:',
    arq_print_total_sal:'Total sortides:', arq_print_ef_recaud:'Efectiu recaptació',
    arq_print_fondo_queda:'Fons que queda a caixa:',
    arq_print_a_ingresar:'▶ A ingressar a caixa forta:',
    arq_print_notas:'Notes:', arq_print_sin_prov:'Sense pagaments a proveïdors',
    arq_audit_line:'⚠ Registre creat per Direcció General:',
    info_apertura:'✓ Obertura', info_cierre:'Tancament', info_activa_turnos:'Activa només els torns que usa aquest local.',
    sin_datos:'Sense dades', locales_activos_lbl:'locals',
    lbl_nombre_emp:'Nom:', directora_lbl:'Director/a',
    arq_modificado:'Modificat per Direcció General',
    fiestas_btn:'Festes', eventos_btn:'Esdeveniments',
  },

  en: {
    dias: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
    diasShort: ['MON','TUE','WED','THU','FRI','SAT','SUN'],
    turno_manana:'Morning', turno_noche:'Night', turno_tarde:'Afternoon',
    turno_intermedio:'Split', turno_partido:'Split shift', turno_fiesta:'Day off', turno_mediafiesta:'½ Half day off',
    nav_local:'Venue', nav_turnos:'Shifts', nav_equipo:'Team', nav_asignar:'Assign',
    nav_eventos:'Events', nav_cuadrante:'Schedule', nav_costes:'Costs',
    nav_direccion:'Head Office', nav_usuarios:'Users', nav_ajustes:'Settings', nav_arqueo:'Cash', nav_compras:'Purchasing',
    p1_titulo:'Which venue and week are we planning?',
    p1_sub:'Select the restaurant, week and basic configuration',
    p1_local:'Venue', p1_semana:'Week starting on',
    p1_apertura:'Opening time', p1_cierre:'Closing time',
    p1_diasflojos:'Slow days (suggested day off)',
    p1_siguiente:'Next → Configure shifts',
    opt_selecciona_local:'Select venue...',
    p2_titulo:'Configure venue shifts',
    p2_sub:'Shifts calculated automatically. Only enable the ones this venue uses.',
    p2_media_fiesta:'Half day off duration (hours worked)',
    p2_jornada:'Full shift hours',
    p2_atras:'← Back', p2_siguiente:'Next → Team',
    p3_titulo:'Who works at this venue?',
    p3_sub:'Employees and their usual shift. Hours are calculated automatically.',
    p3_añadir:'+ Add employee',
    p3_lorena_sub:'Guide schedule · Not counted in floor coverage · Counted in costs',
    p3_siguiente:'Next → Assign shifts',
    p3_horas_auto:'Weekly hours are calculated automatically based on assigned shifts',
    p3_nombre_empleado:'Employee name',
    p3_turno_habitual:'Usual shift',
    p4_titulo:'Assign this week\'s shifts',
    p4_sub:'Days off assigned automatically based on slow days and minimum staffing. Adjust as needed.',
    p4_recalcular:'⚡ Recalculate days off', p4_rotar:'🔀 Rotate days (+1)',
    p4_hint_recalcular:'<strong style="color:var(--green)">Recalculate</strong> — clears current days off and reassigns from scratch based on slow days and minimum staff.',
    p4_hint_rotar:'<strong style="color:var(--purple)">Rotate days</strong> — shifts each employee\'s day off by +1 day, so they don\'t always rest on the same day.',
    p4_siguiente:'Next → Events',
    p5_titulo:'Any special events this week?',
    p5_sub:'Matches, events, public holidays that need extra staff',
    p5_no_eventos:'No events added',
    p5_tipo:'Type', p5_dia:'Day', p5_descripcion:'Description',
    p5_refuerzo:'Reinforcement staff',
    p5_añadir_refuerzo:'+ Add reinforcement person',
    p5_confirmar:'✓ Confirm and add event',
    p5_generar:'⚡ Generate schedule',
    p6_ocultar_horas:'👁 Hide hours', p6_mostrar_horas:'👁 Show hours',
    p6_enviar_grupo:'📲 Send to WA group', p6_wa_todos:'📲 WA to all',
    p6_imprimir:'🖨 Print', p6_guardar_bd:'💾 Save to DB',
    p6_ver_costes:'💰 View costs', p6_nueva_semana:'+ New week',
    p6_editar:'← Edit',
    p7_titulo:'💰 Staff costs',
    p7_sub:'Schedule · Gross salary + Social Security + Real extras',
    p7_atras:'← Schedule', p7_dir_gral:'📋 Head Office',
    p8_titulo:'📋 Head Office',
    p8_sub:'Weekly summary of all venues',
    p8_actualizar:'🔄 Refresh',
    p8_imprimir:'🖨 Print summary', p8_arqueo:'💰 Cash register',
    p8_audit_titulo:'🗂 Activity log',
    p9_titulo:'👥 User Management',
    p9_sub:'Create and manage staff access',
    p9_nuevo_usuario:'+ New user',
    p9_nombre:'Full name', p9_dni:'ID number',
    p9_ss:'Social Security affiliation number', p9_ss_hint:'Last 4 digits will be the initial password',
    p9_rol:'App role', p9_local:'Venue',
    p9_contacto:'Contact details (optional)',
    p9_telefono:'📱 Phone / WhatsApp', p9_email:'✉️ Email', p9_direccion:'🏠 Address',
    p9_crear:'🔒 Create user',
    p9_lista:'Registered users', p9_actualizar:'🔄 Refresh list',
    p10_titulo:'🎨 Customisation',
    p10_sub:'Adapt the look of RelojTurnos to your business',
    p10_color:'✨ Main colour', p10_color_custom:'Custom:',
    p10_tema:'🌙 Theme', p10_tema_dark:'🌑 Dark', p10_tema_light:'☀️ Light', p10_tema_navy:'⚓ Navy',
    p10_logo:'🖼️ Company logo', p10_logo_sub:'Header, login and printed documents',
    p10_logo_subir:'📁 Upload image', p10_logo_quitar:'🗑',
    p10_empresa:'🏢 Company name',
    p10_preview:'👁 Preview',
    p10_costes_titulo:'💰 Cost parameters', p10_costes_sub:'Affect all payroll and SS calculations',
    p10_ss_pct:'% Employer SS', p10_divisor:'Monthly divisor',
    p10_ss_hint2:'Standard hospitality: 39%', p10_divisor_hint:'Standard: 4.33',
    p10_wa_titulo:'📲 WhatsApp groups', p10_wa_sub:'WhatsApp group number for each venue',
    p10_wa_hint:'💡 Individual employee phones are set in User Management',
    p10_idioma:'🌍 Language',
    p10_nota:'ⓘ Changes are saved to your browser instantly.',
    p10_aviso_parcial:'⚠ Partial change in this version',
    p10_btn_usuarios:'← Users', p10_btn_reset:'↺ Reset to defaults',
    p10_ejemplo:'Example: 1,800€ →', p10_sem:'/ wk',
    prev_activo:'Active', prev_normal:'Normal',
    arq_edit_banner:'✏️ Edit mode — You are modifying a saved cash register. Press Save to confirm or Clear to cancel.',
    arq_lbl_local:'Venue', arq_lbl_turno:'Shift', arq_lbl_fecha:'Date', arq_lbl_resp:'Responsible',
    arq_sec_efectivo:'💰 Opening cash', arq_lbl_fondo:'Cash float (€)', arq_hint_fondo:'Fixed amount always in register',
    arq_lbl_cambio:'Extra change added (€)', arq_hint_cambio:'Taken from safe if short',
    arq_sec_ingresos:'↑ Shift income', arq_lbl_venta:'Total shift sales (€)',
    arq_lbl_visa:'Paid by VISA/POS (€)', arq_hint_visa:'Deducted from cash',
    arq_sec_pagos:'↓ Supplier payments', arq_btn_anadir:'＋ Add',
    arq_sin_pagos:'No supplier payments this shift', arq_total_pagos_lbl:'Total payments:',
    arq_sec_resultado:'📊 Shift result', arq_total_caja:'Total inputs (sales + extra change)', arq_total_salidas:'Total outgoings (VISA + suppliers)',
    arq_ef_recaud:'💵 CASH COLLECTED → SAFE', arq_hint_ingresar:'To deposit in safe (deducting float',
    arq_hint_fuerte:'Float stays in the till for the next shift',
    arq_lbl_notas:'Notes / Incidents',
    arq_btn_volver:'← Back', arq_btn_limpiar:'↺ Clear', arq_btn_imprimir:'🖨 Print', arq_btn_guardar:'💾 Save register',
    arq_historico_titulo:'📅 Latest saved registers',
    p11_titulo:'💰 Cash Register',
    p11_sub:'End of shift report',
    p11_fecha:'📅 Date', p11_turno:'Shift',
    p11_turno_m:'Morning', p11_turno_n:'Night', p11_turno_t:'Afternoon',
    p11_responsable:'Responsible',
    p11_fondo:'💵 Opening float', p11_venta:'🧾 Total declared sales',
    p11_visa:'💳 Card / POS', p11_efectivo:'💵 Cash (Sales - Card)',
    p11_entregado:'💰 Cash handed over', p11_diferencia:'⚖️ Difference',
    p11_proveedores:'📦 Supplier payments',
    p11_añadir_prov:'+ Add supplier',
    p11_notas:'📝 Notes / incidents',
    p11_guardar:'💾 Save', p11_limpiar:'🗑 Clear', p11_imprimir:'🖨 Print',
    p11_historico:'📋 Cash register history',
    p11_editar_banner:'✏️ Editing cash register ID ',
    p11_cancelar:'Cancel edit',
    login_dni:'ID number', login_password:'Password', login_btn:'Log in',
    login_demo:'DEMO', login_error:'Incorrect username or password',
    login_footer:'Shift management for hospitality',
    portal_cuadrante:'📅 Schedule', portal_contrato:'📄 My contract',
    portal_actividad:'🗂 My activity', portal_password:'🔒 Password',
    portal_cambiar_pass:'Change password',
    portal_pass_actual:'Current password', portal_pass_nueva:'New password',
    portal_pass_repite:'Repeat new password',
    portal_pass_btn:'🔒 Change password',
    portal_cerrar:'← Log out',
    toast_bienvenida:'✓ Welcome ',
    toast_conectado:'✓ Connected to database',
    toast_conectado_default:'✓ Connected (default venues)',
    toast_sin_tabla:'⚠ No venues table — local mode',
    toast_local_no_encontrado:'Venue not found in DB',
    toast_actualizando_cuad:'⏳ Updating existing schedule...',
    toast_cuad_guardado:'✓ Schedule saved to database',
    toast_cuad_error:'Error saving: ',
    toast_cargando_equipo:'⏳ Loading team...',
    toast_equipo_cargado:'✓ Team loaded from DB ',
    toast_sin_empleados:'ℹ No employees in DB — using default team',
    toast_error_bd:'⚠ Error loading DB — using default team',
    toast_fiestas_rotadas:'🔀 Days off rotated — review the schedule',
    toast_color:'✓ Colour applied', toast_tema:'✓ Theme applied',
    toast_nombre:'✓ Name updated', toast_restablecido:'✓ Settings reset',
    toast_logo_grande:'⚠ Image too large (max 500KB)',
    toast_logo_ok:'✓ Logo updated', toast_logo_quitado:'✓ Logo removed',
    toast_wa_configura:'⚠ Set the group number in Settings → WhatsApp',
    toast_wa_guarda_bd:'⚠ First save the schedule to DB (💾 button)',
    toast_empleado_no_encontrado:'Employee not found',
    toast_wa_sin_telefono:'⚠ Add employee phone in User Management',
    toast_wa_sin_telefonos:'⚠ No employees have a phone configured',
    toast_wa_enviando:'📲 Sending to ',
    toast_wa_empleados:' employees...',
    toast_wa_numeros:'✓ Numbers saved',
    toast_params:'✓ Parameters updated',
    toast_idioma:'✓ Language applied',
    toast_arq_invalido:'Invalid cash register ID',
    toast_arq_no_encontrado:'Cash register not found',
    toast_arq_cargado:'✏️ Cash register loaded for editing',
    toast_arq_error_carga:'Error loading cash register: ',
    toast_edicion_cancelada:'Edit cancelled — form cleared',
    toast_pass_cambiada:'✓ Password changed successfully',
    toast_usuario_creado:'✓ User created',
    toast_password_incorrecta:'Current password is incorrect',
    err_rellena:'Please fill in all fields',
    err_pass_min:'Password must be at least 4 characters',
    err_pass_no_coincide:'Passwords do not match',
    err_ss_min:'Affiliation number must be at least 4 digits',
    err_dni_existe:'A user with that ID already exists',
    err_crear_usuario:'Error creating user: ',
    err_cambiar_pass:'Error changing password. Please try again.',
    cobertura:'COVERAGE', personas:'staff',
    turno_m_label:'Morning', turno_n_label:'Night', turno_t_label:'Afternoon',
    turno_i_label:'Split', turno_p_label:'Split shift', turno_mf_label:'½ Half day off',
    apoyo_operativo:'Guide schedule · Not counted in floor coverage',
    generado_por:'Generated by', todos_derechos:'All rights reserved',
    wa_confirm_prefix:'Send individual WhatsApp to ',
    wa_confirm_pax:' employee(s)?',
    wa_confirm_sin_tel:'\n\nNo phone (will not be sent): ',
    wa_confirm_nota:'\n\nThe browser will open one window per employee.',
    horas_short:'h', opt_selecciona:'Select...',
    lbl_salario_bruto:'Gross salary/month', lbl_horas_contrato:'Contract hours/week',
    nominas_proximamente:'Digital payslips coming soon',
    sin_datos_contrato:'No contract data available',
    err_datos_contrato:'Could not load data',
    audit_sin_registros:'No records',
    audit_cargando:'⏳ Loading...',
    vacaciones:'ON LEAVE',
    alert_selecciona_local:'Select a venue',
    alert_selecciona_desc:'Select an event description',
    alert_pon_nombre_refuerzo:'Enter the name of each reinforcement person',
    alert_añade_empleado:'Add at least one employee',
    alert_añade_refuerzo:'Add at least one reinforcement person',
    alert_no_datos_imprimir:'No data to print',
    alert_permite_popups:'Allow pop-ups for this page and try again.',
    alert_permite_popups2:'Allow pop-ups and try again.',
    alert_permite_popups3:'Allow pop-ups',
    cuad_generado:'📋 Generated schedule',
    cuad_cobertura:'COVERAGE',
    cuad_lorena_sub:'Guide schedule · Not counted in floor coverage',
    cuad_eventos:'⚡ Special events this week',
    cuad_generado_por:'Generated by', cuad_desarrollado:'Developed by',
    cuad_derechos:'All rights reserved',
    tc_activo:'Active', tc_inactivo:'Inactive',
    tc_turno:'Shift', tc_tramo1_desde:'Leg 1 from', tc_tramo1_hasta:'Leg 1 until',
    tc_tramo2_desde:'Leg 2 from', tc_tramo2_hasta:'Leg 2 until',
    tc_desde:'From', tc_hasta:'Until',
    lbl_rol:'Role', lbl_turno_hab:'Usual shift',
    lbl_dias_fiesta:'Days off / week',
    opt_1dia:'1 day', opt_15dias:'1.5 days (recommended)', opt_2dias:'2 days', opt_3dias:'3 days',
    sel_empleado:'— Select employee —',
    col_empleado:'EMPLOYEE', col_rol:'ROLE', col_horas:'HOURS',
    kpi_empleados:'Employees', kpi_horas_tot:'Total hours', kpi_cob_dia:'Coverage/day', kpi_eventos:'Events',
    kpi_h_pactadas:'Contracted h.', kpi_coste_fijo:'Fixed cost wk.', kpi_extras_sem:'Extras wk.',
    kpi_total_sem:'Total week', kpi_total_mes:'Total month est.', kpi_eur_hora:'€/real hour', kpi_extras_anotadas:'Extras logged',
    lbl_h_pactadas:'Contracted hrs / week', lbl_coste_sem:'Cost / week', lbl_coste_mes_ss:'Cost / month (incl. SS)',
    sin_datos_sal:'No salary data', extras_registradas:'⚡ LOGGED EXTRAS',
    coste_extra_lbl:'⚡ Extra cost:',
    sin_extras:'No extras logged this week',
    h_extra_tot:'Total extra h.', coste_extras_sem:'Extra cost this week',
    lbl_empleado:'Employee', lbl_dia:'Day', lbl_h_extra:'Extra hours', lbl_eur_h:'€ / extra hour', lbl_motivo:'Reason',
    director_locales_activos:'ACTIVE VENUES', director_total_emps:'TOTAL EMPLOYEES',
    director_coste_total:'TOTAL WEEKLY COST', director_cob_min:'MINIMUM COVERAGE',
    director_semana:'Week:', director_sin_cuad:'No schedule this week',
    director_genera_cuad:'Generate schedule to see data',
    director_cob_dia:'COVERAGE/DAY', director_coste_sem:'COST/WK', director_fiestas_sem:'DAYS OFF WK',
    director_comp:'Weekly cost comparison',
    director_cargando:'⏳ Loading data...',
    portal_cargando_cuad:'⏳ Loading schedule...',
    portal_no_cuad:'No schedule available this week',
    portal_error_cuad:'Could not load schedule',
    portal_mis_datos:'📄 My contract details',
    portal_nombre:'Name:', portal_rol_lbl:'Role:',
    portal_sal_bruto:'Gross salary/month:', portal_h_contrato:'Contract hours/week:',
    portal_no_contrato:'No contract data available',
    portal_error_contrato:'Could not load data',
    portal_mi_actividad:'🗂 My recent activity',
    arq_sin_arqueos:'No cash records saved yet',
    arq_venta:'Sales:', arq_a_ingresar:'To deposit',
    arq_editar:'✏️ Edit',
    arq_print_titulo:'💰 Cash Register',
    arq_print_turno:'Shift', arq_print_cierre:'Close', arq_print_resp:'Responsible:',
    arq_print_ef_inicial:'Opening cash', arq_print_fondo:'Opening float',
    arq_print_cambio:'Extra change added', arq_print_total_disp:'Total available',
    arq_print_ingresos:'Shift takings', arq_print_venta:'Total sales',
    arq_print_visa:'Paid by card/POS', arq_print_pagos_prov:'Supplier payments',
    arq_print_total_pagos:'Total payments', arq_print_total_caja:'Total in till:',
    arq_print_total_sal:'Total outgoings:', arq_print_ef_recaud:'Cash takings',
    arq_print_fondo_queda:'Float remaining in till:',
    arq_print_a_ingresar:'▶ To deposit in safe:',
    arq_print_notas:'Notes:', arq_print_sin_prov:'No supplier payments',
    arq_audit_line:'⚠ Record created by Head Office:',
    info_apertura:'✓ Opening', info_cierre:'Closing', info_activa_turnos:'Only enable shifts this venue uses.',
    sin_datos:'No data', locales_activos_lbl:'venues',
    lbl_nombre_emp:'Name:', directora_lbl:'Manager',
    arq_modificado:'Modified by Head Office',
    fiestas_btn:'Days off', eventos_btn:'Events',
  }
};

// Función de traducción — t('clave')
function t(key){ return (I18N[LANG_ACTUAL]||I18N.es)[key] || (I18N.es[key] || key); }

// Aplica todas las traducciones al DOM via data-i18n
function aplicarTraducciones(){
  var l = I18N[LANG_ACTUAL] || I18N.es;
  // Actualizar arrays globales
  DIAS = l.dias;
  DIAS_SHORT = l.diasShort;

  // Todos los elementos con data-i18n="clave"
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var key = el.getAttribute('data-i18n');
    var val = t(key);
    if(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'){
      el.placeholder = val;
    } else if(el.tagName === 'OPTION'){
      el.textContent = val;
    } else {
      el.innerHTML = val;
    }
  });

  // data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el){
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });

  // Corregir botón ocultar/mostrar horas según estado actual (no sobreescribir con valor estático)
  var btnH = document.getElementById('btn-toggle-horas');
  if(btnH){
    var keyH = mostrarHoras ? 'p6_ocultar_horas' : 'p6_mostrar_horas';
    btnH.textContent = t(keyH);
    btnH.setAttribute('data-i18n', keyH);
  }
}

function aplicarIdioma(lang){
  if(!I18N[lang]) return;
  LANG_ACTUAL = lang;
  localStorage.setItem('rt_lang', lang);
  aplicarTraducciones();
  // Actualizar botones activos
  ['es','ca','en'].forEach(function(n){
    var btn = document.getElementById('btn-lang-'+n);
    if(btn) btn.className = 'btn btn-sm '+(n===lang?'btn-primary':'btn-ghost');
  });
  showToast(t('toast_idioma'),'green');
  // Re-render secciones dinámicas
  if(empleados.length){
    renderEmpleados();
    renderTurnosConfigGrid();
    renderCostes();
  }
  renderLorenaHorario();
  renderEventos();
  // Re-render cuadrante si está activo
  var sc6 = document.getElementById('screen6');
  if(sc6 && sc6.classList.contains('active') && empleados.length){
    generarCuadrante();
  }
  // Re-render director si está activo
  var sc8 = document.getElementById('screen8');
  if(sc8 && sc8.classList.contains('active')){
    cargarVistaDirector();
  }
  // Re-render histórico arqueo si visible
  var arqHist = document.getElementById('arq-historico');
  if(arqHist && arqHist.innerHTML && arqHist.innerHTML.length > 50){
    cargarHistoricoArqueos();
  }
}

function cargarIdiomaGuardado(){
  var lang = localStorage.getItem('rt_lang') || 'es';
  LANG_ACTUAL = lang;
  var l = I18N[lang] || I18N.es;
  DIAS = l.dias;
  DIAS_SHORT = l.diasShort;
  aplicarTraducciones();
  ['es','ca','en'].forEach(function(n){
    var btn = document.getElementById('btn-lang-'+n);
    if(btn) btn.className = 'btn btn-sm '+(n===lang?'btn-primary':'btn-ghost');
  });
}

// ========== INIT ==========
(function(){
  // Detectar vista pública por parámetro URL
  var urlParams = new URLSearchParams(window.location.search);
  var cuadParam = urlParams.get('cuadrante');
  if(cuadParam){
    // Modo vista pública — ocultar TODO excepto vista-publica
    document.getElementById('login-screen').style.display='none';
    var hdr = document.querySelector('header'); if(hdr) hdr.style.display='none';
    var cnt = document.querySelector('.container'); if(cnt) cnt.style.display='none';
    var pe  = document.getElementById('portal-empleado'); if(pe) pe.style.display='none';
    document.body.style.background='#0f1117';
    document.body.style.margin='0';
    document.body.style.minHeight='100vh';
    var vp = document.getElementById('vista-publica');
    if(vp){ vp.style.background='#0f1117'; vp.style.color='#e0e0e0'; }
    cargarPersonalizacionGuardada();
    cargarVistaPublica(parseInt(cuadParam));
    return;
  }
  buildFechas();
  horaOpts('hora-apertura','07:30');
  horaOpts('hora-cierre','02:30');
  cargarPersonalizacionGuardada();
  cargarParamsCosteGuardados();
  cargarIdiomaGuardado();
  var savedLogo = localStorage.getItem('rt_logo');
  if(savedLogo) setTimeout(function(){ aplicarLogoGuardado(savedLogo); }, 100);
  initSupabase();
})();

// ========== DASHBOARD v7.0 ==========
function abrirDashboard(){
  goStep(0);
  initDashboard();
  if(!apiKeyValida(getClaudeApiKey())) mostrarModalApiKey();
}

function initDashboard(){
  var hora = new Date().getHours();
  var saludo = hora < 13 ? 'Buenos días' : hora < 21 ? 'Buenas tardes' : 'Buenas noches';
  var nombre = currentUser ? (currentUser.nombre || 'Lorena') : 'Lorena';
  var primerNombre = nombre.split(' ')[0];
  primerNombre = primerNombre.charAt(0) + primerNombre.slice(1).toLowerCase();

  var el = document.getElementById('dash-saludo');
  if(el) el.textContent = saludo + ', ' + primerNombre + ' 👋';

  var fechaEl = document.getElementById('dash-fecha');
  if(fechaEl){
    var hoy = new Date();
    var opciones = {weekday:'long', year:'numeric', month:'long', day:'numeric'};
    var fechaTxt = hoy.toLocaleDateString('es-ES', opciones);
    fechaEl.textContent = fechaTxt.charAt(0).toUpperCase() + fechaTxt.slice(1);
  }

  var localEl = document.getElementById('dash-local');
  if(localEl){
    var localNombre = '—';
    if(currentUser && currentUser.local_id){
      localNombre = ({1:'Restaurante La Cala', 2:"Roto's Burguer"})[currentUser.local_id] || '—';
    }
    localEl.textContent = localNombre !== '—' ? '📍 ' + localNombre : '';
  }
}

// ========== API KEY MANAGER ==========
// La key se guarda en localStorage — nunca en el repositorio
var CLAUDE_MODEL = 'claude-sonnet-4-6';

function getClaudeApiKey(){
  return localStorage.getItem('rt_claude_key') || '';
}

function setClaudeApiKey(key){
  localStorage.setItem('rt_claude_key', key.trim());
}

function apiKeyValida(key){
  return typeof key === 'string' && key.trim().startsWith('sk-ant-');
}

function mostrarModalApiKey(){
  var modal = document.getElementById('modal-apikey');
  if(modal){
    modal.style.display = 'flex';
    var inp = document.getElementById('apikey-input');
    if(inp){ inp.value = ''; setTimeout(function(){ inp.focus(); }, 100); }
    document.getElementById('apikey-error').style.display = 'none';
  }
}

function cerrarModalApiKey(){
  var modal = document.getElementById('modal-apikey');
  if(modal) modal.style.display = 'none';
}

function toggleApiKeyVisible(){
  var inp = document.getElementById('apikey-input');
  var btn = document.getElementById('apikey-eye-btn');
  if(!inp) return;
  inp.type = inp.type === 'password' ? 'text' : 'password';
  if(btn) btn.textContent = inp.type === 'password' ? '👁' : '🙈';
}

function guardarApiKey(){
  var inp = document.getElementById('apikey-input');
  var errEl = document.getElementById('apikey-error');
  var key = inp ? inp.value.trim() : '';
  if(!apiKeyValida(key)){
    if(errEl) errEl.style.display = 'block';
    if(inp) inp.focus();
    return;
  }
  if(errEl) errEl.style.display = 'none';
  setClaudeApiKey(key);
  cerrarModalApiKey();
  showToast('✓ Clave guardada correctamente', 'green');
}


// ========== ASISTENTE IA v7.0 (screen14) ==========

var IA_CATS = {
  redactar: {
    label: '✍️ Redactar',
    system: 'Eres un asistente experto en comunicación para hostelería y restauración. Redactas textos profesionales, claros y correctos en español para restaurantes del Grupo El Reloj (La Cala y Roto\'s Burguer, Barcelona).',
    opciones: [
      { texto: 'Comunicado interno para el equipo', prompt: 'Redacta un comunicado interno profesional para el equipo de restaurante.' },
      { texto: 'Aviso de cambio de horario', prompt: 'Redacta un aviso formal de cambio de horario laboral para los empleados.' },
      { texto: 'Carta de bienvenida a cliente VIP', prompt: 'Redacta una carta de bienvenida para un cliente VIP de un restaurante de nivel.' },
      { texto: 'Nota informativa sobre nueva normativa', prompt: 'Redacta una nota informativa para el equipo explicando una nueva normativa interna del restaurante.' },
      { texto: 'Mensaje de felicitación al equipo', prompt: 'Redacta un mensaje de felicitación y agradecimiento al equipo de sala y cocina por los resultados obtenidos.' },
      { texto: 'Comunicado de cierre temporal / vacaciones', prompt: 'Redacta un comunicado de cierre temporal del restaurante por vacaciones, tanto para clientes como para el equipo.' },
      { texto: 'Protocolo de atención al cliente', prompt: 'Redacta un protocolo breve de atención al cliente para el equipo de sala de un restaurante.' },
      { texto: 'Texto libre — describe lo que necesitas', prompt: '' }
    ]
  },
  legal: {
    label: '⚖️ Duda legal',
    system: 'Eres un asesor laboral y legal especializado en hostelería y restauración en España. Conoces el Convenio Colectivo de Hostelería de Cataluña, la legislación laboral española y las normativas del sector. Ofreces orientación práctica y clara, siempre recomendando consultar con un abogado para casos específicos.',
    opciones: [
      { texto: '¿Cuántos días de vacaciones corresponden?', prompt: '¿Cuántos días de vacaciones anuales corresponden a un empleado de hostelería según el convenio de Cataluña? ¿Cómo se calculan y cuándo se disfrutan?' },
      { texto: 'Horas extra: cálculo y compensación', prompt: 'Explica cómo se calculan y compensan las horas extra en hostelería en España. ¿Cuándo se pagan y cuándo se compensan con descanso?' },
      { texto: 'Baja médica: derechos y obligaciones', prompt: '¿Cuáles son los derechos y obligaciones del empleado y del empleador ante una baja médica en hostelería? ¿Qué documentación se necesita?' },
      { texto: 'Contrato temporal vs indefinido', prompt: '¿Cuándo se puede usar un contrato temporal en hostelería? ¿Qué limites hay? ¿Cuándo pasa a ser indefinido automáticamente?' },
      { texto: 'Despido disciplinario: causas y procedimiento', prompt: '¿Cuáles son las causas justificadas para un despido disciplinario en hostelería? ¿Qué procedimiento se debe seguir para que sea válido?' },
      { texto: 'APPCC: obligaciones del local', prompt: '¿Cuáles son las obligaciones legales en materia de APPCC (Análisis de Peligros y Puntos de Control Crítico) para un restaurante en Cataluña?' },
      { texto: 'Contrato a tiempo parcial: horas y complementos', prompt: '¿Cómo funciona el contrato a tiempo parcial en hostelería? ¿Qué son las horas complementarias y cuántas se pueden hacer?' },
      { texto: 'Texto libre — describe tu duda', prompt: '' }
    ]
  },
  carta: {
    label: '🍽️ Carta y precios',
    system: 'Eres un experto en gastronomía, hostelería y gestión de restaurantes con experiencia en diseño de menús, fichas técnicas de cocina, análisis de costes y estrategia de precios para restaurantes en España.',
    opciones: [
      { texto: 'Sugerencia de platos de temporada', prompt: 'Sugiere 6 platos de temporada (primavera/verano) para incluir en la carta de un restaurante de cocina mediterránea en Barcelona.' },
      { texto: 'Calcular precio de venta de un plato', prompt: 'Explica cómo calcular el precio de venta de un plato de restaurante considerando food cost, mano de obra y margen objetivo. Pon un ejemplo práctico.' },
      { texto: 'Descripción de platos para la carta', prompt: 'Redacta descripciones atractivas para la carta para 3 platos: un entrante, un principal y un postre de cocina mediterránea moderna.' },
      { texto: 'Menú del día: estructura y precio', prompt: '¿Cómo estructurar un menú del día rentable para un restaurante en Barcelona? ¿Cuál es el precio orientativo y qué debe incluir?' },
      { texto: 'Análisis de rentabilidad de carta', prompt: 'Explica cómo hacer un análisis de rentabilidad (ingeniería de menú) para identificar los platos estrella, rentables, incógnita y perro de una carta.' },
      { texto: 'Adaptación de menú para alérgenos', prompt: 'Explica las obligaciones legales sobre información de alérgenos en la carta de un restaurante en España y cómo adaptarla correctamente.' },
      { texto: 'Ideas para menú de grupo / evento', prompt: 'Propón 3 opciones de menú cerrado para grupos de 15-30 personas en un restaurante de nivel medio-alto en Barcelona.' },
      { texto: 'Texto libre — describe lo que necesitas', prompt: '' }
    ]
  },
  gestoria: {
    label: '📋 Gestoría',
    system: 'Eres un experto en relaciones laborales, Seguridad Social y gestión de RRHH para hostelería en España. Ayudas a gestores de restaurantes a redactar comunicaciones formales para su gestoría: altas, bajas, contratos, incidencias y documentación laboral. Respondes de forma profesional, clara y estructurada.',
    opciones: [
      { texto: 'Alta de nuevo trabajador en SS', prompt: 'Redacta un mensaje formal para la gestoría comunicando el alta de un nuevo trabajador en la Seguridad Social. Incluye los datos que hay que proporcionar: nombre completo, DNI, fecha de inicio, categoría profesional, tipo de contrato y jornada.' },
      { texto: 'Baja de trabajador en SS', prompt: 'Redacta un mensaje formal para la gestoría comunicando la baja de un trabajador en la Seguridad Social. Indica los datos necesarios, la causa de baja y los plazos legales de comunicación.' },
      { texto: 'Comunicar baja médica', prompt: 'Redacta un mensaje formal para la gestoría comunicando que un trabajador está de baja médica. Incluye qué documentación hay que enviar (parte de baja), en qué plazos y cómo afecta a la nómina.' },
      { texto: 'Comunicar sanción disciplinaria', prompt: 'Redacta un mensaje formal para la gestoría comunicando que se va a aplicar una sanción disciplinaria a un trabajador. Indica los pasos legales previos (audiencia, comunicación escrita) y la documentación necesaria.' },
      { texto: 'Envío de documentos (DNI, contrato, etc.)', prompt: 'Redacta un mensaje formal para la gestoría acompañando el envío de documentación de un trabajador. Especifica qué documentos se incluyen (DNI, contrato firmado, titulación, etc.) y para qué trámite concreto se envían.' },
      { texto: 'Cambio de jornada o categoría', prompt: 'Redacta un mensaje formal para la gestoría comunicando un cambio de jornada laboral o de categoría profesional de un trabajador. Indica los datos del cambio, la fecha de efectividad y el tipo de anexo o novación contractual necesario.' },
      { texto: 'Solicitar finiquito', prompt: 'Redacta un mensaje formal para la gestoría solicitando la elaboración del finiquito de un trabajador que causa baja voluntaria. Incluye los datos del trabajador, fecha de baja y los conceptos habituales del finiquito en hostelería (vacaciones pendientes, parte proporcional de pagas extras).' },
      { texto: 'Consulta de nómina', prompt: 'Redacta un mensaje formal para la gestoría haciendo una consulta sobre una nómina concreta. Explica cómo estructurar la consulta indicando: nombre del trabajador, mes al que corresponde, concepto en duda y qué resultado se esperaba.' },
      { texto: 'Texto libre — describe tu consulta', prompt: '' }
    ]
  },
  otro: {
    label: '💬 Otro',
    system: 'Eres un asistente experto en gestión de restaurantes, hostelería, RRHH, operaciones y servicio al cliente. Tienes amplio conocimiento del sector en España y Catalunya. Respondes de forma práctica, concisa y útil.',
    opciones: [
      { texto: 'Cómo motivar al equipo de sala', prompt: '¿Cuáles son las mejores estrategias para motivar y retener al equipo de sala en un restaurante? Dame 5 ideas prácticas y aplicables.' },
      { texto: 'Gestión de conflictos entre empleados', prompt: '¿Cómo gestionar un conflicto entre dos empleados de sala de un restaurante? Explica el proceso paso a paso desde la dirección.' },
      { texto: 'Reducir el food waste (desperdicio)', prompt: 'Dame 6 estrategias prácticas para reducir el desperdicio alimentario (food waste) en un restaurante sin afectar la calidad.' },
      { texto: 'Cómo responder a una reseña negativa', prompt: 'Escribe una respuesta profesional y empática a una reseña negativa en Google que dice que el servicio fue lento y la comida llegó fría.' },
      { texto: 'Plan de formación para nuevo empleado', prompt: 'Crea un plan de formación de 5 días para incorporar a un nuevo camarero en un restaurante de nivel medio-alto.' },
      { texto: 'Check de apertura/cierre del restaurante', prompt: 'Crea un checklist completo de apertura y otro de cierre para el responsable de turno de un restaurante.' },
      { texto: 'Estrategias para aumentar el ticket medio', prompt: 'Dame 5 técnicas de venta cruzada y upselling para aumentar el ticket medio en un restaurante sin resultar agresivo.' },
      { texto: 'Texto libre — escribe tu pregunta', prompt: '' }
    ]
  }
};

var iaEstado = { cat: null, opcionIdx: null, promtBase: '', catKey: '', canal: null };

function initAsistenteIA(){
  iaEstado = { cat: null, opcionIdx: null, promtBase: '', catKey: '', canal: null };
  document.getElementById('ia-paso1').style.display = '';
  var canalEl = document.getElementById('ia-paso-canal');
  if(canalEl) canalEl.style.display = 'none';
  document.getElementById('ia-paso2').style.display = 'none';
  document.getElementById('ia-paso3').style.display = 'none';
  document.getElementById('ia-respuesta').style.display = 'none';
  document.getElementById('ia-loading').style.display = 'none';
}

function iaSelCat(catKey){
  var cat = IA_CATS[catKey];
  if(!cat) return;
  iaEstado.catKey = catKey;
  iaEstado.cat = cat;
  iaEstado.canal = null;

  document.getElementById('ia-paso1').style.display = 'none';

  if(catKey === 'redactar'){
    var canalEl = document.getElementById('ia-paso-canal');
    if(canalEl) canalEl.style.display = '';
    return;
  }

  document.getElementById('ia-cat-label').textContent = cat.label;
  var grid = document.getElementById('ia-subcats');
  grid.innerHTML = '';
  cat.opciones.forEach(function(op, idx){
    var div = document.createElement('div');
    div.className = 'av-tipo-btn';
    div.style.cursor = 'pointer';
    div.textContent = op.texto;
    div.onclick = function(){ iaSelOpcion(idx); };
    grid.appendChild(div);
  });
  document.getElementById('ia-paso2').style.display = '';
}

function iaSelCanal(canal){
  iaEstado.canal = canal;
  var canalEl = document.getElementById('ia-paso-canal');
  if(canalEl) canalEl.style.display = 'none';

  var cat = iaEstado.cat;
  if(!cat) return;
  document.getElementById('ia-cat-label').textContent = cat.label + ' · ' + (canal === 'email' ? '📧 Email' : '💬 WhatsApp');
  var grid = document.getElementById('ia-subcats');
  grid.innerHTML = '';
  cat.opciones.forEach(function(op, idx){
    var div = document.createElement('div');
    div.className = 'av-tipo-btn';
    div.style.cursor = 'pointer';
    div.textContent = op.texto;
    div.onclick = function(){ iaSelOpcion(idx); };
    grid.appendChild(div);
  });
  document.getElementById('ia-paso2').style.display = '';
}

function iaSelOpcion(idx){
  var cat = iaEstado.cat;
  if(!cat) return;
  var op = cat.opciones[idx];
  iaEstado.opcionIdx = idx;
  iaEstado.promtBase = op.prompt;

  var canalLabel = iaEstado.canal === 'email' ? ' · 📧 Email' : (iaEstado.canal === 'whatsapp' ? ' · 💬 WhatsApp' : '');
  document.getElementById('ia-subcat-label').textContent = cat.label + canalLabel + ' › ' + op.texto;
  var ctx = document.getElementById('ia-contexto');
  if(ctx){ ctx.value = ''; ctx.placeholder = op.prompt ? 'Añade contexto específico (opcional)...' : 'Escribe tu pregunta o solicitud...'; }

  document.getElementById('ia-paso2').style.display = 'none';
  document.getElementById('ia-paso3').style.display = '';
}

function iaVolver(paso){
  if(paso === 1){
    var canalEl = document.getElementById('ia-paso-canal');
    if(canalEl) canalEl.style.display = 'none';
    document.getElementById('ia-paso2').style.display = 'none';
    document.getElementById('ia-paso3').style.display = 'none';
    document.getElementById('ia-paso1').style.display = '';
    iaEstado.canal = null;
  } else if(paso === 2){
    document.getElementById('ia-paso3').style.display = 'none';
    document.getElementById('ia-paso2').style.display = '';
  }
}

async function iaEnviar(){
  if(!apiKeyValida(getClaudeApiKey())){
    mostrarModalApiKey();
    return;
  }
  var cat = iaEstado.cat;
  if(!cat) return;

  var contexto = (document.getElementById('ia-contexto').value || '').trim();
  var prompt = iaEstado.promtBase || '';

  if(!prompt && !contexto){
    showToast('Escribe tu consulta antes de enviar', 'red');
    return;
  }

  var msgFinal = prompt;
  if(contexto){
    msgFinal = prompt ? prompt + '\n\nContexto adicional: ' + contexto : contexto;
  }

  // Añadir contexto de restaurante
  var localInfo = '';
  if(currentUser && currentUser.local_id){
    var nombres = {1:'Restaurante La Cala (Barcelona)', 2:"Roto's Burguer (Barcelona)"};
    localInfo = nombres[currentUser.local_id] || '';
  }
  if(localInfo) msgFinal += '\n\n[Contexto: ' + localInfo + ', Grupo El Reloj]';

  // Ajustar system prompt según canal para categoría Redactar
  var systemPrompt = cat.system;
  if(iaEstado.catKey === 'redactar' && iaEstado.canal){
    if(iaEstado.canal === 'email'){
      systemPrompt += ' El texto debe enviarse por EMAIL: usa un tono formal, profesional y estructurado, con saludo y despedida apropiados.';
    } else if(iaEstado.canal === 'whatsapp'){
      systemPrompt += ' El texto debe enviarse por WHATSAPP entre compañeros de trabajo: usa un tono cercano, directo y amigable. Sin formalidades excesivas. Puede incluir algún emoji si encaja. Mensaje conciso.';
    }
  }

  // Mostrar loading
  document.getElementById('ia-paso3').style.display = 'none';
  document.getElementById('ia-loading').style.display = '';

  var btn = document.getElementById('ia-btn-enviar');
  if(btn){ btn.disabled = true; btn.textContent = '⏳ Consultando...'; }

  try{
    var resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': getClaudeApiKey(),
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: msgFinal }]
      })
    });

    if(!resp.ok){
      var errData = await resp.json().catch(function(){ return {}; });
      throw new Error(errData.error ? errData.error.message : 'Error ' + resp.status);
    }

    var data = await resp.json();
    var texto = (data.content && data.content[0] && data.content[0].text) ? data.content[0].text : 'Sin respuesta';

    document.getElementById('ia-loading').style.display = 'none';
    document.getElementById('ia-respuesta-texto').textContent = texto;
    document.getElementById('ia-respuesta').style.display = '';

  }catch(e){
    document.getElementById('ia-loading').style.display = 'none';
    document.getElementById('ia-paso3').style.display = '';
    if(btn){ btn.disabled = false; btn.textContent = '🤖 Consultar a Claude'; }
    showToast('Error al contactar con la IA: ' + e.message, 'red');
  }
}

function iaNuevaConsulta(){
  initAsistenteIA();
}

function iaCopiar(){
  var txt = (document.getElementById('ia-respuesta-texto') || {}).textContent || '';
  if(!txt) return;
  navigator.clipboard.writeText(txt).then(function(){
    showToast('Copiado al portapapeles', 'green');
    var btn = document.getElementById('ia-btn-copiar');
    if(btn){ btn.textContent = '✓ Copiado'; setTimeout(function(){ btn.textContent = '📋 Copiar'; }, 2000); }
  }).catch(function(){
    showToast('No se pudo copiar automáticamente', 'orange');
  });
}

// ========== AVISOS TRABAJADORES v7.0 (screen15) ==========
var avEstado = { empleadoNombre: '', empleadoId: null, tipo: '', icono: '', nivel: 0, textoGenerado: '' };

var AV_NIVEL_LABELS = { 1: 'Leve (Nivel 1)', 2: 'Moderado (Nivel 2)', 3: 'Grave (Nivel 3)' };
var AV_NIVEL_DESCRIPCIONES = {
  1: 'primer aviso verbal / advertencia informal por escrito',
  2: 'aviso escrito formal / segundo apercibimiento',
  3: 'expediente disciplinario / tercer aviso con posibles consecuencias'
};

function initAvisos(){
  avEstado = { empleadoNombre: '', empleadoId: null, tipo: '', icono: '', nivel: 0, textoGenerado: '' };
  avMostrarPaso(1);
  avCargarEmpleados();
  avCargarHistorico();
}

function avMostrarPaso(n){
  [1,2,3].forEach(function(i){
    var el = document.getElementById('av-paso'+i);
    if(el) el.style.display = (i===n) ? '' : 'none';
  });
  var res = document.getElementById('av-resultado');
  var load = document.getElementById('av-loading');
  if(res) res.style.display = 'none';
  if(load) load.style.display = 'none';
}

async function avCargarEmpleados(){
  var sel = document.getElementById('av-empleado-sel');
  if(!sel) return;

  // Intentar cargar desde Supabase; si falla, usar empleados en memoria
  var lista = [];
  try{
    var localId = currentUser ? currentUser.local_id : null;
    if(localId){
      var emps = await sbGet('empleados', 'local_id=eq.'+localId+'&activo=eq.true&order=nombre.asc');
      lista = emps.map(function(e){ return { id: e.id, nombre: e.nombre }; });
    }
  }catch(e){ /* fallback */ }

  // Fallback: empleados en memoria (cargados en el cuadrante)
  if(!lista.length && empleados.length){
    lista = empleados.map(function(e){ return { id: e.bdId || e.id, nombre: e.nombre }; });
  }

  // Opciones hardcoded como último recurso
  if(!lista.length){
    lista = [
      {id:null, nombre:'MARILYN'}, {id:null, nombre:'SONNY'},
      {id:null, nombre:'ALEX'}, {id:null, nombre:'IRENE'},
      {id:null, nombre:'ZEUS'}, {id:null, nombre:'CONNY'},
      {id:null, nombre:'SANTIAGO'}, {id:null, nombre:'LENY'}
    ];
  }

  sel.innerHTML = '<option value="">— Selecciona empleado —</option>';
  lista.forEach(function(e){
    var opt = document.createElement('option');
    opt.value = e.id || e.nombre;
    opt.textContent = e.nombre;
    opt.dataset.nombre = e.nombre;
    sel.appendChild(opt);
  });
}

function avSelEmpleado(){
  var sel = document.getElementById('av-empleado-sel');
  var sig = document.getElementById('av-paso1-siguiente');
  if(!sel || !sig) return;
  var opt = sel.options[sel.selectedIndex];
  if(sel.value){
    avEstado.empleadoNombre = opt.dataset.nombre || opt.textContent;
    avEstado.empleadoId = sel.value;
    sig.style.display = '';
  } else {
    sig.style.display = 'none';
  }
}

function avIrPaso2(){
  if(!avEstado.empleadoNombre){ showToast('Selecciona un empleado primero', 'red'); return; }
  // Limpiar selección previa de tipos
  document.querySelectorAll('.av-tipo-btn').forEach(function(b){ b.classList.remove('selected'); });
  avMostrarPaso(2);
}

function avVolver(paso){
  avMostrarPaso(paso);
  if(paso === 1){
    var res = document.getElementById('av-resultado');
    if(res) res.style.display = 'none';
  }
}

function avSelTipo(tipo, icono){
  avEstado.tipo = tipo;
  avEstado.icono = icono;
  document.querySelectorAll('.av-tipo-btn').forEach(function(b){ b.classList.remove('selected'); });
  event.currentTarget.classList.add('selected');
  setTimeout(function(){ avMostrarPaso(3); }, 180);
}

function avSelNivel(nivel){
  avEstado.nivel = nivel;
  [1,2,3].forEach(function(n){
    var btn = document.getElementById('av-nivel-'+n);
    if(!btn) return;
    btn.style.background = (n===nivel) ? 'var(--accent)20' : 'var(--darker)';
    btn.style.borderWidth = (n===nivel) ? '3px' : '2px';
  });
}

async function avGenerarAviso(){
  if(!apiKeyValida(getClaudeApiKey())){
    mostrarModalApiKey();
    return;
  }
  if(!avEstado.empleadoNombre || !avEstado.tipo || !avEstado.nivel){
    showToast('Completa todos los pasos antes de generar', 'red'); return;
  }

  var descripcion = (document.getElementById('av-descripcion').value || '').trim();
  var localNombre = '';
  if(currentUser && currentUser.local_id){
    localNombre = ({1:'Restaurante La Cala', 2:"Roto's Burguer"})[currentUser.local_id] || 'el restaurante';
  } else {
    localNombre = 'el restaurante';
  }

  var nivelLabel = AV_NIVEL_LABELS[avEstado.nivel];
  var nivelDesc  = AV_NIVEL_DESCRIPCIONES[avEstado.nivel];
  var fecha = new Date().toLocaleDateString('es-ES', {day:'2-digit', month:'long', year:'numeric'});

  var prompt = 'Redacta un aviso formal de ' + nivelLabel + ' para el empleado '
    + avEstado.empleadoNombre + ' de ' + localNombre + '.\n'
    + 'Motivo de la incidencia: ' + avEstado.tipo + '.\n'
    + 'Nivel de gravedad: ' + nivelLabel + ' (' + nivelDesc + ').\n'
    + (descripcion ? 'Detalles adicionales: ' + descripcion + '.\n' : '')
    + 'Fecha: ' + fecha + '.\n\n'
    + 'El aviso debe:\n'
    + '- Tener formato de documento formal (con cabecera, cuerpo y pie de firma)\n'
    + '- Incluir la descripción de los hechos de forma objetiva y sin juicios de valor\n'
    + '- Mencionar el artículo del convenio colectivo de hostelería aplicable si procede\n'
    + '- Indicar las consecuencias de reincidencia según el nivel\n'
    + '- Terminar con espacio para firma del empleado y firma de la dirección\n'
    + '- Tono: profesional, formal, pero respetuoso';

  var systemPrompt = 'Eres un experto en RRHH y relaciones laborales especializado en hostelería en España. '
    + 'Redactas documentos laborales formales: avisos, apercibimientos y expedientes disciplinarios '
    + 'ajustados al Convenio Colectivo de Hostelería y la legislación laboral española vigente.';

  // Mostrar loading
  document.getElementById('av-loading').style.display = '';
  document.getElementById('av-paso3').style.display = 'none';
  var btn = document.getElementById('av-btn-generar');
  if(btn){ btn.disabled = true; }

  try{
    var resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': getClaudeApiKey(),
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 1200,
        system: systemPrompt,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if(!resp.ok){
      var errData = await resp.json().catch(function(){ return {}; });
      throw new Error(errData.error ? errData.error.message : 'Error ' + resp.status);
    }

    var data = await resp.json();
    var texto = (data.content && data.content[0] && data.content[0].text) ? data.content[0].text : 'Sin respuesta';
    avEstado.textoGenerado = texto;

    document.getElementById('av-loading').style.display = 'none';
    document.getElementById('av-texto-generado').textContent = texto;
    document.getElementById('av-resultado').style.display = '';

    if(btn){ btn.disabled = false; }

  }catch(e){
    document.getElementById('av-loading').style.display = 'none';
    document.getElementById('av-paso3').style.display = '';
    if(btn){ btn.disabled = false; }
    showToast('Error al generar el aviso: ' + e.message, 'red');
  }
}

function avCopiar(){
  var txt = avEstado.textoGenerado || '';
  if(!txt) return;
  navigator.clipboard.writeText(txt).then(function(){
    showToast('Aviso copiado al portapapeles', 'green');
  }).catch(function(){
    showToast('No se pudo copiar automáticamente', 'orange');
  });
}

function avImprimir(){
  var txt = avEstado.textoGenerado || '';
  if(!txt){ showToast('No hay aviso generado', 'red'); return; }
  var w = window.open('', '_blank');
  w.document.write(
    '<!DOCTYPE html><html><head><meta charset="UTF-8">'
    + '<title>Aviso ' + avEstado.empleadoNombre + '</title>'
    + '<style>body{font-family:Arial,sans-serif;padding:40px;max-width:700px;margin:auto;font-size:14px;line-height:1.7}'
    + 'h1{font-size:16px;border-bottom:2px solid #000;padding-bottom:8px}'
    + 'pre{white-space:pre-wrap;font-family:inherit;font-size:14px}'
    + '@media print{body{padding:20px}}'
    + '</style></head><body>'
    + '<h1>AVISO LABORAL — ' + avEstado.empleadoNombre.toUpperCase() + '</h1>'
    + '<pre>' + txt.replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</pre>'
    + '<p style="margin-top:30px;font-size:11px;color:#888">Generado con RelojTurnos v7.0 · Grupo El Reloj · '
    + new Date().toLocaleString('es-ES') + '</p>'
    + '<script>window.onload=function(){setTimeout(function(){window.print();},300);};<\/script>'
    + '</body></html>'
  );
  w.document.close();
}

async function avGuardar(){
  var txt = avEstado.textoGenerado;
  if(!txt){ showToast('No hay aviso generado', 'red'); return; }

  var btn = document.getElementById('av-btn-guardar');
  if(btn){ btn.textContent = '⏳ Guardando...'; btn.disabled = true; }

  var localId = currentUser ? currentUser.local_id : null;
  var registro = {
    empleado_nombre: avEstado.empleadoNombre,
    tipo_incidencia:  avEstado.tipo,
    nivel:            avEstado.nivel,
    texto_aviso:      txt,
    local_id:         localId,
    creado_por:       currentUser ? (currentUser.nombre || currentUser.dni) : 'Dirección',
    fecha_aviso:      new Date().toISOString().split('T')[0]
  };
  if(avEstado.empleadoId && !isNaN(parseInt(avEstado.empleadoId))){
    registro.empleado_id = parseInt(avEstado.empleadoId);
  }

  try{
    await sbPost('avisos_trabajadores', registro);
    showToast('Aviso guardado correctamente', 'green');
    if(btn){ btn.textContent = '✓ Guardado'; btn.style.background = 'var(--green)'; btn.style.color = 'var(--darker)'; }
    avCargarHistorico();
  }catch(e){
    if(btn){ btn.textContent = '💾 Guardar en BD'; btn.disabled = false; }
    if(e.message && (e.message.includes('does not exist') || e.message.includes('42P01') || e.message.includes('relation'))){
      showToast('⚠ Tabla no creada en BD. Ejecuta el SQL de inicialización en Supabase → SQL Editor.', 'red');
    } else {
      showToast('Error al guardar: ' + e.message, 'red');
    }
  }
}

function avNuevoAviso(){
  avEstado = { empleadoNombre: '', empleadoId: null, tipo: '', icono: '', nivel: 0, textoGenerado: '' };
  document.querySelectorAll('.av-tipo-btn').forEach(function(b){ b.classList.remove('selected'); });
  [1,2,3].forEach(function(n){
    var btn = document.getElementById('av-nivel-'+n);
    if(btn){ btn.style.background = 'var(--darker)'; btn.style.borderWidth = '2px'; }
  });
  var desc = document.getElementById('av-descripcion');
  if(desc) desc.value = '';
  var btnG = document.getElementById('av-btn-guardar');
  if(btnG){ btnG.textContent = '💾 Guardar en BD'; btnG.disabled = false; btnG.style.background = ''; btnG.style.color = ''; }
  var paso1sig = document.getElementById('av-paso1-siguiente');
  if(paso1sig) paso1sig.style.display = 'none';
  var sel = document.getElementById('av-empleado-sel');
  if(sel) sel.value = '';
  avMostrarPaso(1);
}

async function avCargarHistorico(){
  var cont = document.getElementById('av-historico');
  if(!cont) return;
  cont.innerHTML = '<div style="color:var(--muted);font-size:12px;text-align:center;padding:14px">Cargando...</div>';

  try{
    var filtros = 'order=id.desc&limit=20';
    if(currentUser && currentUser.local_id){
      filtros = 'local_id=eq.' + currentUser.local_id + '&' + filtros;
    }
    var rows = await sbGet('avisos_trabajadores', filtros);

    if(!rows || !rows.length){
      cont.innerHTML = '<div style="color:var(--muted);font-size:12px;text-align:center;padding:14px">No hay avisos registrados aún</div>';
      return;
    }

    var AV_NIVEL_COLOR = {1:'#ffa040', 2:'#e67e22', 3:'#e74c3c'};
    var AV_NIVEL_TEXTO = {1:'Leve', 2:'Moderado', 3:'Grave'};

    cont.innerHTML = rows.map(function(r){
      var col = AV_NIVEL_COLOR[r.nivel] || 'var(--muted)';
      var niv = AV_NIVEL_TEXTO[r.nivel] || 'N'+r.nivel;
      var fecha = r.fecha_aviso || (r.created_at ? r.created_at.split('T')[0] : '—');
      var preview = (r.texto_aviso || '').substring(0, 120).replace(/\n/g,' ') + '...';
      return '<div style="border:1px solid var(--border);border-radius:9px;padding:12px 14px;margin-bottom:8px;background:var(--darker)">'
        + '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap">'
        + '<span style="font-weight:700;font-size:14px;color:var(--text)">' + (r.empleado_nombre||'—') + '</span>'
        + '<span style="font-size:11px;padding:2px 8px;border-radius:10px;font-weight:700;background:'+col+'20;color:'+col+'">'+niv+'</span>'
        + '<span style="font-size:11px;color:var(--muted)">'+r.tipo_incidencia+'</span>'
        + '<span style="font-size:10px;color:var(--muted);margin-left:auto">'+fecha+'</span>'
        + '</div>'
        + '<div style="font-size:12px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+preview+'</div>'
        + '</div>';
    }).join('');

  }catch(e){
    if(e.message && (e.message.includes('does not exist') || e.message.includes('42P01') || e.message.includes('relation'))){
      cont.innerHTML = '<div style="color:var(--red);font-size:13px;padding:14px;border:1px solid var(--red);border-radius:8px;background:#e74c3c10">'
        + '<b>⚠ Tabla no encontrada en la BD</b><br><br>'
        + 'Ejecuta este SQL en <b>Supabase → SQL Editor</b>:<br><br>'
        + '<code style="font-size:11px;display:block;background:#00000030;padding:10px;border-radius:6px;white-space:pre-wrap">'
        + 'CREATE TABLE IF NOT EXISTS avisos_trabajadores (\n'
        + '  id bigserial primary key,\n'
        + '  fecha timestamp default now(),\n'
        + '  empleado_nombre text,\n'
        + '  empleado_id int,\n'
        + '  tipo_incidencia text,\n'
        + '  nivel int,\n'
        + '  texto_aviso text,\n'
        + '  local_id int,\n'
        + '  creado_por text,\n'
        + '  fecha_aviso date\n'
        + ');'
        + '</code></div>';
    } else {
      cont.innerHTML = '<div style="color:var(--red);font-size:12px;text-align:center;padding:14px">⚠ Error al cargar: ' + e.message + '</div>';
    }
  }
}

// ========== CHECKLIST ROTATIVO v7.0 (screen16) ==========

var CL_TAREAS_BASE = [
  // BARRA
  { texto: 'Limpiar la barra y zona de trabajo',          grupo: 'Barra', tipo: 'check' },
  { texto: 'Revisar stock de bebidas y comunicar roturas', grupo: 'Barra', tipo: 'check' },
  { texto: 'Temperatura cámara frigorífica de barra',      grupo: 'Barra', tipo: 'temperatura' },
  { texto: 'Estado del equipo de barra (cafetera, etc.)',  grupo: 'Barra', tipo: 'equipo' },
  // SALA
  { texto: 'Revisar y limpiar todas las mesas y sillas',   grupo: 'Sala', tipo: 'check' },
  { texto: 'Reponer servilletas, palilleros y salsas',     grupo: 'Sala', tipo: 'check' },
  { texto: 'Barrer y fregar el suelo de sala y terraza',   grupo: 'Sala', tipo: 'check' },
  { texto: 'Limpiar cristales y espejos de la entrada',    grupo: 'Sala', tipo: 'check' },
  { texto: 'Comprobar y limpiar baños (papel, jabón)',     grupo: 'Sala', tipo: 'check' },
  { texto: 'Montar mise en place para el servicio',        grupo: 'Sala', tipo: 'check' },
  { texto: 'Comprobar funcionamiento de TPV y caja',       grupo: 'Sala', tipo: 'check' },
  // COCINA
  { texto: 'Temperatura cámara frigorífica de cocina',     grupo: 'Cocina', tipo: 'temperatura' },
  { texto: 'Estado del equipo de cocina (horno, freidora)', grupo: 'Cocina', tipo: 'equipo' },
  { texto: 'Vaciar papeleras y gestionar residuos',        grupo: 'Cocina', tipo: 'check' }
];

// Estado en memoria para el día actual
var clTareasHoy = [];      // [{id, texto, hecha, hora_completado, extra}]
var clFechaActual = '';
var clResponsableActual = '';
var clGuardandoNota = false;

function initChecklist(){
  var fechaEl = document.getElementById('cl-fecha');
  if(fechaEl && !fechaEl.value){
    fechaEl.value = new Date().toISOString().split('T')[0];
  }
  clCargarDia();
}

function clFechaISO(){
  var el = document.getElementById('cl-fecha');
  return el ? el.value : new Date().toISOString().split('T')[0];
}

// Determina qué empleado toca hoy por rotación (índice del día desde epoch % nEmpleados)
function clResponsableDelDia(fecha){
  var listaEmps = [];

  // Usar empleados en memoria si hay
  if(empleados.length){
    listaEmps = empleados.map(function(e){ return e.nombre; });
  } else {
    listaEmps = ['MARILYN','SONNY','ALEX','IRENE','ZEUS','CONNY','SANTIAGO','LENY'];
  }

  if(!listaEmps.length) return '—';

  // Calcular número de día desde una fecha base fija (01/01/2024)
  var base = new Date('2024-01-01');
  var d    = new Date(fecha + 'T12:00:00');
  var diff = Math.round((d - base) / 86400000);
  var idx  = ((diff % listaEmps.length) + listaEmps.length) % listaEmps.length;
  return listaEmps[idx];
}

async function clCargarDia(){
  var fecha = clFechaISO();
  clFechaActual = fecha;
  clResponsableActual = clResponsableDelDia(fecha);

  // Mostrar responsable
  var nomEl = document.getElementById('cl-responsable-nombre');
  if(nomEl) nomEl.textContent = clResponsableActual;

  // Intentar cargar desde Supabase
  var tareasGuardadas = null;
  try{
    var localId = currentUser ? currentUser.local_id : null;
    var filtros = 'fecha=eq.' + fecha + '&order=posicion.asc';
    if(localId) filtros = 'local_id=eq.' + localId + '&' + filtros;
    var rows = await sbGet('checklist_diario', filtros);
    if(rows && rows.length) tareasGuardadas = rows;
  }catch(e){ /* sin conexión — modo local */ }

  if(tareasGuardadas && tareasGuardadas.length){
    // Reconstruir desde BD
    clTareasHoy = tareasGuardadas.map(function(r, i){
      var base = CL_TAREAS_BASE[r.posicion] || CL_TAREAS_BASE[i] || {};
      return {
        id:             r.id,
        texto:          r.tarea,
        grupo:          r.grupo || base.grupo || 'Sala',
        tipo:           r.tipo  || base.tipo  || 'check',
        hecha:          !!r.completada,
        hora_completado:r.hora_completado || '',
        valorExtra:     r.valor_extra || '',
        extra:          !!r.extra,
        posicion:       r.posicion || 0
      };
    });
    // Cargar nota del día
    var notaEl = document.getElementById('cl-nota-dia');
    if(notaEl && tareasGuardadas[0] && tareasGuardadas[0].nota_dia){
      notaEl.value = tareasGuardadas[0].nota_dia || '';
    }
  } else {
    // Crear tareas base para hoy
    clTareasHoy = CL_TAREAS_BASE.map(function(tarea, i){
      return { id: null, texto: tarea.texto, grupo: tarea.grupo, tipo: tarea.tipo, hecha: false, hora_completado: '', valorExtra: '', extra: false, posicion: i };
    });
    var notaEl = document.getElementById('cl-nota-dia');
    if(notaEl) notaEl.value = '';
  }

  clRenderTareas();
}

function clRenderTareas(){
  var cont = document.getElementById('cl-tareas-lista');
  if(!cont) return;

  cont.innerHTML = '';
  var hechas = clTareasHoy.filter(function(t){ return t.hecha; }).length;
  var total  = clTareasHoy.length;

  var GRUPOS = ['Barra', 'Sala', 'Cocina'];
  var GRUPO_ICONS = { Barra: '🍹', Sala: '🪑', Cocina: '👨‍🍳' };

  GRUPOS.forEach(function(grupo){
    var grupoTareas = clTareasHoy.filter(function(t){ return t.grupo === grupo || (!t.grupo && grupo === 'Sala'); });
    if(!grupoTareas.length) return;

    // Header de grupo
    var header = document.createElement('div');
    header.style.cssText = 'font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:1px;padding:8px 0 4px 0;margin-top:8px;border-bottom:1px solid var(--border)';
    header.textContent = (GRUPO_ICONS[grupo] || '') + ' ' + grupo;
    cont.appendChild(header);

    grupoTareas.forEach(function(tarea){
      var idx = clTareasHoy.indexOf(tarea);
      var div = document.createElement('div');
      div.className = 'cl-tarea-item' + (tarea.hecha ? ' done' : '');

      if(tarea.tipo === 'temperatura'){
        div.innerHTML =
          '<div class="cl-tarea-check ' + (tarea.hecha ? 'checked' : '') + '" onclick="clToggleTarea(' + idx + ')">' + (tarea.hecha ? '✓' : '') + '</div>'
          + '<div class="cl-tarea-texto" style="flex:1">' + tarea.texto + '</div>'
          + '<div style="display:flex;align-items:center;gap:4px;flex-shrink:0">'
          + '<input type="number" step="0.1" placeholder="°C" value="' + (tarea.valorExtra || '') + '" style="width:64px;background:var(--darker);border:1px solid var(--border);border-radius:6px;padding:4px 6px;color:var(--text);font-size:13px;outline:none" onchange="clSetValorExtra(' + idx + ',this.value)">'
          + '<span style="font-size:11px;color:var(--muted)">°C</span>'
          + '</div>'
          + '<div class="cl-tarea-hora">' + (tarea.hora_completado || '') + '</div>';
      } else if(tarea.tipo === 'equipo'){
        var esIncidencia = tarea.valorExtra && tarea.valorExtra !== 'ok';
        div.innerHTML =
          '<div class="cl-tarea-check ' + (tarea.hecha ? 'checked' : '') + '" onclick="clToggleTarea(' + idx + ')">' + (tarea.hecha ? '✓' : '') + '</div>'
          + '<div style="flex:1">'
          + '<div class="cl-tarea-texto">' + tarea.texto + '</div>'
          + '<div style="display:flex;gap:6px;align-items:center;margin-top:4px;flex-wrap:wrap">'
          + '<select style="background:var(--darker);border:1px solid var(--border);border-radius:6px;padding:3px 8px;color:var(--text);font-size:12px;outline:none" onchange="clSetEquipoEstado(' + idx + ',this.value)">'
          + '<option value="ok"' + (!tarea.valorExtra || tarea.valorExtra === 'ok' ? ' selected' : '') + '>✅ Todo OK</option>'
          + '<option value="incidencia"' + (esIncidencia ? ' selected' : '') + '>⚠ Hay incidencia</option>'
          + '</select>'
          + (esIncidencia ? '<input type="text" placeholder="Describe la incidencia..." value="' + (tarea.notaIncidencia || '').replace(/"/g, '&quot;') + '" style="flex:1;min-width:120px;background:var(--darker);border:1px solid var(--red);border-radius:6px;padding:3px 8px;color:var(--text);font-size:12px;outline:none" onchange="clSetNotaIncidencia(' + idx + ',this.value)">' : '')
          + '</div>'
          + '</div>'
          + '<div class="cl-tarea-hora">' + (tarea.hora_completado || '') + '</div>';
      } else {
        div.innerHTML =
          '<div class="cl-tarea-check ' + (tarea.hecha ? 'checked' : '') + '" onclick="clToggleTarea(' + idx + ')">' + (tarea.hecha ? '✓' : '') + '</div>'
          + '<div class="cl-tarea-texto">' + tarea.texto + (tarea.extra ? ' <span style="font-size:10px;color:var(--accent);font-weight:700">EXTRA</span>' : '') + '</div>'
          + '<div class="cl-tarea-hora">' + (tarea.hora_completado || '') + '</div>';
      }
      cont.appendChild(div);
    });
  });

  // Tareas extra sin grupo
  var sinGrupo = clTareasHoy.filter(function(t){ return t.extra && !GRUPOS.includes(t.grupo); });
  sinGrupo.forEach(function(tarea){
    var idx = clTareasHoy.indexOf(tarea);
    var div = document.createElement('div');
    div.className = 'cl-tarea-item' + (tarea.hecha ? ' done' : '');
    div.innerHTML =
      '<div class="cl-tarea-check ' + (tarea.hecha ? 'checked' : '') + '" onclick="clToggleTarea(' + idx + ')">' + (tarea.hecha ? '✓' : '') + '</div>'
      + '<div class="cl-tarea-texto">' + tarea.texto + ' <span style="font-size:10px;color:var(--accent);font-weight:700">EXTRA</span></div>'
      + '<div class="cl-tarea-hora">' + (tarea.hora_completado || '') + '</div>';
    cont.appendChild(div);
  });

  // Actualizar barra de progreso
  var pct = total > 0 ? Math.round((hechas / total) * 100) : 0;
  var bar = document.getElementById('cl-progreso-bar');
  var txt = document.getElementById('cl-progreso-txt');
  if(bar) bar.style.width = pct + '%';
  if(txt) txt.textContent = hechas + ' / ' + total;
}

function clSetValorExtra(idx, val){
  var tarea = clTareasHoy[idx];
  if(!tarea) return;
  tarea.valorExtra = val;
  clGuardarTarea(idx);
}

function clSetEquipoEstado(idx, val){
  var tarea = clTareasHoy[idx];
  if(!tarea) return;
  tarea.valorExtra = val;
  clRenderTareas();
  clGuardarTarea(idx);
}

function clSetNotaIncidencia(idx, val){
  var tarea = clTareasHoy[idx];
  if(!tarea) return;
  tarea.notaIncidencia = val;
  clGuardarTarea(idx);
}

async function clToggleTarea(idx){
  var tarea = clTareasHoy[idx];
  if(!tarea) return;

  tarea.hecha = !tarea.hecha;
  tarea.hora_completado = tarea.hecha
    ? new Date().toLocaleTimeString('es-ES', {hour:'2-digit', minute:'2-digit'})
    : '';

  clRenderTareas();
  await clGuardarTarea(idx);
}

async function clGuardarTarea(idx){
  var tarea = clTareasHoy[idx];
  if(!tarea) return;

  var localId = currentUser ? currentUser.local_id : null;
  var nota    = (document.getElementById('cl-nota-dia') || {}).value || '';

  var registro = {
    fecha:           clFechaActual,
    tarea:           tarea.texto,
    completada:      tarea.hecha,
    hora_completado: tarea.hora_completado || null,
    responsable:     clResponsableActual,
    posicion:        tarea.posicion,
    extra:           tarea.extra,
    local_id:        localId,
    nota_dia:        nota,
    grupo:           tarea.grupo || null,
    tipo:            tarea.tipo  || 'check',
    valor_extra:     tarea.valorExtra || null,
    nota_incidencia: tarea.notaIncidencia || null
  };

  try{
    if(tarea.id){
      await sbPatch('checklist_diario', tarea.id, {
        completada:      tarea.hecha,
        hora_completado: tarea.hora_completado || null,
        nota_dia:        nota,
        valor_extra:     tarea.valorExtra || null,
        nota_incidencia: tarea.notaIncidencia || null
      });
    } else {
      var result = await sbPost('checklist_diario', registro);
      if(result && result[0]) tarea.id = result[0].id;
    }
  }catch(e){
    // Silencioso — modo offline funciona sin BD
    console.warn('checklist_diario save error:', e.message);
  }
}

async function clAnadirTarea(){
  var inp = document.getElementById('cl-tarea-nueva');
  if(!inp) return;
  var txt = (inp.value || '').trim();
  if(!txt){ showToast('Escribe el nombre de la tarea', 'orange'); return; }

  var nueva = {
    id:             null,
    texto:          txt,
    hecha:          false,
    hora_completado:'',
    extra:          true,
    posicion:       clTareasHoy.length
  };
  clTareasHoy.push(nueva);
  inp.value = '';
  clRenderTareas();

  // Guardar en BD
  var idx = clTareasHoy.length - 1;
  await clGuardarTarea(idx);
  showToast('Tarea añadida', 'green');
}

var clNotaTimer = null;
function clGuardarNota(){
  // Debounce: guardar la nota 1.5s después del último cambio
  clearTimeout(clNotaTimer);
  clNotaTimer = setTimeout(async function(){
    if(!clTareasHoy.length) return;
    var nota = (document.getElementById('cl-nota-dia') || {}).value || '';
    // Actualizar la primera tarea (o cualquiera) con la nota
    for(var i = 0; i < clTareasHoy.length; i++){
      if(clTareasHoy[i].id){
        try{
          await sbPatch('checklist_diario', clTareasHoy[i].id, { nota_dia: nota });
        }catch(e){ /* silencioso */ }
        break;
      }
    }
  }, 1500);
}

// ========== WORKER CHECKLIST v7.2 — acceso sin login via URL ==========
var wclTareas = [];
var wclFecha  = '';
var wclEmpleado = '';

function checkWorkerChecklistUrl(){
  var params = new URLSearchParams(window.location.search);
  var cl  = params.get('cl');
  var emp = params.get('emp');
  if(!cl || !emp) return;
  emp = decodeURIComponent(emp);
  var loginEl = document.getElementById('login-screen');
  if(loginEl) loginEl.style.display = 'none';
  var view = document.getElementById('worker-cl-view');
  if(view) view.style.display = '';
  wclInit(cl, emp);
}

async function wclInit(fecha, empleado){
  wclFecha    = fecha;
  wclEmpleado = empleado;
  var tEl = document.getElementById('wcl-titulo');
  var eEl = document.getElementById('wcl-empleado-txt');
  var fEl = document.getElementById('wcl-fecha-txt');
  if(tEl) tEl.textContent = '✅ Checklist de ' + empleado;
  if(eEl) eEl.textContent = '👤 ' + empleado;
  if(fEl){
    var d = new Date(fecha + 'T12:00:00');
    fEl.textContent = d.toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  }
  try{
    var rows = await sbGet('checklist_diario',
      'fecha=eq.'+fecha+'&responsable=eq.'+encodeURIComponent(empleado)+'&order=posicion.asc');
    if(rows && rows.length){
      wclTareas = rows.map(function(r,i){
        var base = CL_TAREAS_BASE[r.posicion] || CL_TAREAS_BASE[i] || {};
        return {id:r.id, texto:r.tarea, grupo:r.grupo||base.grupo||'Sala', tipo:r.tipo||base.tipo||'check',
                hecha:!!r.completada, hora:r.hora_completado||'', posicion:r.posicion||0};
      });
    } else {
      wclTareas = CL_TAREAS_BASE.map(function(tarea,i){
        return {id:null, texto:tarea.texto, grupo:tarea.grupo, tipo:tarea.tipo, hecha:false, hora:'', posicion:i};
      });
    }
  }catch(e){
    wclTareas = CL_TAREAS_BASE.map(function(tarea,i){
      return {id:null, texto:tarea.texto, grupo:tarea.grupo, tipo:tarea.tipo, hecha:false, hora:'', posicion:i};
    });
  }
  wclRender();
}

function wclRender(){
  var cont = document.getElementById('wcl-tareas');
  if(!cont) return;
  cont.innerHTML = '';
  var hechas = wclTareas.filter(function(t){return t.hecha;}).length;
  var total  = wclTareas.length;
  wclTareas.forEach(function(tarea, idx){
    var div = document.createElement('div');
    div.className = 'cl-tarea-item' + (tarea.hecha ? ' done' : '');
    div.style.cursor = 'pointer';
    div.style.marginBottom = '8px';
    div.addEventListener('click', function(){ wclToggle(idx); });
    div.innerHTML =
      '<div class="cl-tarea-check '+(tarea.hecha?'checked':'')+'">'+( tarea.hecha?'✓':'')+'</div>'
      +'<div class="cl-tarea-texto">'+tarea.texto+'</div>'
      +'<div class="cl-tarea-hora">'+(tarea.hora||'')+'</div>';
    cont.appendChild(div);
  });
  var pct = total > 0 ? Math.round((hechas/total)*100) : 0;
  var bar = document.getElementById('wcl-prog-bar');
  var txt = document.getElementById('wcl-prog-txt');
  if(bar) bar.style.width = pct + '%';
  if(txt) txt.textContent = hechas + ' / ' + total;
  var ok = document.getElementById('wcl-completo');
  if(ok) ok.style.display = (hechas===total && total>0) ? '' : 'none';
}

async function wclToggle(idx){
  var tarea = wclTareas[idx];
  if(!tarea) return;
  tarea.hecha = !tarea.hecha;
  tarea.hora  = tarea.hecha
    ? new Date().toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'}) : '';
  wclRender();
  try{
    if(tarea.id){
      await sbPatch('checklist_diario', tarea.id, {
        completada: tarea.hecha, hora_completado: tarea.hora || null
      });
    } else {
      var result = await sbPost('checklist_diario',{
        fecha:wclFecha, tarea:tarea.texto, completada:tarea.hecha,
        hora_completado:tarea.hora||null, responsable:wclEmpleado,
        posicion:tarea.posicion, local_id:null, nota_dia:null
      });
      if(result && result[0]) tarea.id = result[0].id;
    }
  }catch(e){ console.warn('wcl save:', e); }
}

function clEnviarWA(){
  var fecha = clFechaISO();
  var emp   = clResponsableActual || '';
  if(!emp || emp === '—'){ showToast('Carga primero el checklist del día', 'orange'); return; }

  var url = location.origin + location.pathname + '?cl=' + fecha + '&emp=' + encodeURIComponent(emp);
  var msg = 'Hola ' + emp + '! Aquí tienes el checklist de hoy:\n' + url;

  // Intentar usar teléfono del empleado
  var telefono = '';
  if(window._empleadosBDDatos && window._empleadosBDDatos[emp]){
    telefono = (window._empleadosBDDatos[emp].telefono || '').replace(/\D/g, '');
  }
  var waUrl = telefono
    ? 'https://wa.me/' + telefono + '?text=' + encodeURIComponent(msg)
    : 'https://wa.me/?text=' + encodeURIComponent(msg);

  window.open(waUrl, '_blank');
  showToast('Abriendo WhatsApp para ' + emp, 'green');
}

// ========== COMPRAS v7.10 (screen12) ==========

function cmpCargarDatos(){
  try{ cmpFamilias    = JSON.parse(localStorage.getItem('rt_cmp_familias')    || '[]'); }catch(e){ cmpFamilias=[]; }
  try{ cmpArticulos   = JSON.parse(localStorage.getItem('rt_cmp_articulos')   || '[]'); }catch(e){ cmpArticulos=[]; }
  try{ cmpProveedores = JSON.parse(localStorage.getItem('rt_cmp_proveedores') || '[]'); }catch(e){ cmpProveedores=[]; }
  try{ cmpPrecios     = JSON.parse(localStorage.getItem('rt_cmp_precios')     || '[]'); }catch(e){ cmpPrecios=[]; }
}

function cmpGuardarDatos(){
  localStorage.setItem('rt_cmp_familias',    JSON.stringify(cmpFamilias));
  localStorage.setItem('rt_cmp_articulos',   JSON.stringify(cmpArticulos));
  localStorage.setItem('rt_cmp_proveedores', JSON.stringify(cmpProveedores));
  localStorage.setItem('rt_cmp_precios',     JSON.stringify(cmpPrecios));
}

function initCompras(){
  cmpCargarDatos();
  cmpTabActual = 'articulos';
  document.querySelectorAll('.cmp-tab').forEach(function(b){ b.classList.remove('active'); });
  var tabBtn = document.getElementById('cmp-tab-articulos');
  if(tabBtn) tabBtn.classList.add('active');
  document.querySelectorAll('.cmp-panel').forEach(function(p){ p.classList.remove('active'); });
  var panel = document.getElementById('cmp-panel-articulos');
  if(panel) panel.classList.add('active');
  cmpRenderArticulos();
}

function cmpTab(tab){
  cmpTabActual = tab;
  document.querySelectorAll('.cmp-tab').forEach(function(b){ b.classList.remove('active'); });
  var btn = document.getElementById('cmp-tab-' + tab);
  if(btn) btn.classList.add('active');
  document.querySelectorAll('.cmp-panel').forEach(function(p){ p.classList.remove('active'); });
  var panel = document.getElementById('cmp-panel-' + tab);
  if(panel) panel.classList.add('active');
  if(tab === 'articulos')   cmpRenderArticulos();
  if(tab === 'proveedores') cmpRenderProveedores();
  if(tab === 'precios')     cmpRenderPrecios();
  if(tab === 'analisis')    cmpRenderAnalisis();
}

function cmpNombreFamilia(id){
  var f = cmpFamilias.find(function(x){ return x.id === id; });
  return f ? (f.emoji ? f.emoji + ' ' + f.nombre : f.nombre) : '—';
}

function cmpNombreProveedor(id){
  var p = cmpProveedores.find(function(x){ return x.id === id; });
  return p ? p.nombre : '—';
}

function cmpRenderArticulos(){
  var cont = document.getElementById('cmp-articulos-list');
  if(!cont) return;

  var busq   = (document.getElementById('cmp-art-search')         || {}).value || '';
  var famFil = (document.getElementById('cmp-art-familia-filter') || {}).value || '';
  var locFil = (document.getElementById('cmp-art-local-filter')   || {}).value || '';

  var lista = cmpArticulos.filter(function(a){
    if(busq   && a.nombre.toLowerCase().indexOf(busq.toLowerCase()) < 0) return false;
    if(famFil && String(a.familia_id) !== famFil) return false;
    if(locFil && String(a.local_id)   !== locFil) return false;
    return true;
  });

  // Rellenar selector de familias del filtro
  var famSel = document.getElementById('cmp-art-familia-filter');
  if(famSel){
    var curFam = famSel.value;
    famSel.innerHTML = '<option value="">Todas las familias</option>'
      + cmpFamilias.map(function(f){
          return '<option value="'+f.id+'"'+(String(curFam)===String(f.id)?' selected':'')+'>'+
                 (f.emoji||'')+(f.emoji?' ':'')+f.nombre+'</option>';
        }).join('');
  }

  if(!lista.length){
    cont.innerHTML = '<div style="text-align:center;color:var(--muted);font-size:13px;padding:32px">'+
      (cmpArticulos.length ? 'Sin resultados para esa búsqueda' : 'No hay artículos. Pulsa <b>+ Artículo</b> para añadir el primero.')+'</div>';
    return;
  }

  cont.innerHTML = '<table class="cmp-table" style="width:100%;border-collapse:collapse;font-size:13px;margin-top:8px">'
    + '<thead><tr style="color:var(--muted);font-size:11px;text-transform:uppercase">'
    + '<th style="padding:8px 6px;text-align:left">Artículo</th>'
    + '<th style="padding:8px 6px;text-align:left">Familia</th>'
    + '<th style="padding:8px 6px;text-align:left">Proveedor</th>'
    + '<th style="padding:8px 6px;text-align:right">Coste</th>'
    + '<th style="padding:8px 6px;text-align:right">PVP</th>'
    + '<th style="padding:8px 6px;text-align:right">Margen</th>'
    + '<th style="padding:8px 6px;text-align:center">Acciones</th>'
    + '</tr></thead><tbody>'
    + lista.map(function(a){
        var coste  = parseFloat(a.precio_compra) || 0;
        var pvp    = parseFloat(a.pvp)           || 0;
        var margen = pvp > 0 ? Math.round(((pvp - coste) / pvp) * 100) : null;
        var mColor = margen === null ? 'var(--muted)' : (margen >= 60 ? '#2ecc71' : margen >= 40 ? '#f39c12' : '#e74c3c');
        return '<tr style="border-top:1px solid var(--border)">'
          + '<td style="padding:8px 6px;font-weight:600">'+a.nombre+'</td>'
          + '<td style="padding:8px 6px;color:var(--muted)">'+cmpNombreFamilia(a.familia_id)+'</td>'
          + '<td style="padding:8px 6px;color:var(--muted)">'+cmpNombreProveedor(a.proveedor_id)+'</td>'
          + '<td style="padding:8px 6px;text-align:right;color:var(--red)">'+(coste ? coste.toFixed(2)+' €' : '—')+'</td>'
          + '<td style="padding:8px 6px;text-align:right">'+(pvp ? pvp.toFixed(2)+' €' : '—')+'</td>'
          + '<td style="padding:8px 6px;text-align:right;font-weight:700;color:'+mColor+'">'+(margen !== null ? margen+'%' : '—')+'</td>'
          + '<td style="padding:8px 6px;text-align:center;white-space:nowrap">'
          + '<button class="btn btn-ghost btn-sm" style="padding:3px 8px;font-size:11px" onclick="cmpAbrirModalArticulo('+a.id+')">✏️</button> '
          + '<button class="btn btn-ghost btn-sm" style="padding:3px 8px;font-size:11px;color:var(--red);border-color:var(--red)" onclick="cmpEliminarArticulo('+a.id+')">🗑</button>'
          + '</td></tr>';
      }).join('')
    + '</tbody></table>';
}

function cmpRenderProveedores(){
  var cont = document.getElementById('cmp-proveedores-list');
  if(!cont) return;

  var busq  = (document.getElementById('cmp-prov-search') || {}).value || '';
  var lista = cmpProveedores.filter(function(p){
    return !busq || p.nombre.toLowerCase().indexOf(busq.toLowerCase()) >= 0;
  });

  if(!lista.length){
    cont.innerHTML = '<div style="text-align:center;color:var(--muted);font-size:13px;padding:32px">'+
      (cmpProveedores.length ? 'Sin resultados' : 'No hay proveedores. Pulsa <b>+ Proveedor</b> para añadir el primero.')+'</div>';
    return;
  }

  cont.innerHTML = '<table class="cmp-table" style="width:100%;border-collapse:collapse;font-size:13px;margin-top:8px">'
    + '<thead><tr style="color:var(--muted);font-size:11px;text-transform:uppercase">'
    + '<th style="padding:8px 6px;text-align:left">Nombre</th>'
    + '<th style="padding:8px 6px;text-align:left">CIF</th>'
    + '<th style="padding:8px 6px;text-align:left">Teléfono</th>'
    + '<th style="padding:8px 6px;text-align:left">Email</th>'
    + '<th style="padding:8px 6px;text-align:left">Contacto</th>'
    + '<th style="padding:8px 6px;text-align:center">Acciones</th>'
    + '</tr></thead><tbody>'
    + lista.map(function(p){
        return '<tr style="border-top:1px solid var(--border)">'
          + '<td style="padding:8px 6px;font-weight:600">'+p.nombre+'</td>'
          + '<td style="padding:8px 6px;color:var(--muted)">'+(p.cif||'—')+'</td>'
          + '<td style="padding:8px 6px">'+(p.tel ? '<a href="tel:'+p.tel+'" style="color:var(--accent)">'+p.tel+'</a>' : '—')+'</td>'
          + '<td style="padding:8px 6px">'+(p.email ? '<a href="mailto:'+p.email+'" style="color:var(--accent)">'+p.email+'</a>' : '—')+'</td>'
          + '<td style="padding:8px 6px;color:var(--muted)">'+(p.contacto||'—')+'</td>'
          + '<td style="padding:8px 6px;text-align:center;white-space:nowrap">'
          + '<button class="btn btn-ghost btn-sm" style="padding:3px 8px;font-size:11px" onclick="cmpAbrirModalProveedor('+p.id+')">✏️</button> '
          + '<button class="btn btn-ghost btn-sm" style="padding:3px 8px;font-size:11px;color:var(--red);border-color:var(--red)" onclick="cmpEliminarProveedor('+p.id+')">🗑</button>'
          + '</td></tr>';
      }).join('')
    + '</tbody></table>';
}

function cmpRenderPrecios(){
  var cont = document.getElementById('cmp-precios-list');
  if(!cont) return;

  // Rellenar selector de artículo del filtro
  var artSel = document.getElementById('cmp-precio-art');
  if(artSel){
    var curVal = artSel.value;
    artSel.innerHTML = '<option value="">— Todos los artículos —</option>'
      + cmpArticulos.map(function(a){
          return '<option value="'+a.id+'"'+(String(curVal)===String(a.id)?' selected':'')+'>'+a.nombre+'</option>';
        }).join('');
  }

  var artFil = artSel ? artSel.value : '';
  var lista  = artFil
    ? cmpPrecios.filter(function(p){ return String(p.articulo_id) === artFil; })
    : cmpPrecios;

  lista = lista.slice().sort(function(a,b){ return (b.fecha||'') > (a.fecha||'') ? 1 : -1; });

  if(!lista.length){
    cont.innerHTML = '<div style="text-align:center;color:var(--muted);font-size:13px;padding:32px">'+
      (cmpPrecios.length ? 'Sin resultados para ese artículo' : 'No hay precios registrados. Pulsa <b>+ Precio</b> para añadir el primero.')+'</div>';
    return;
  }

  cont.innerHTML = '<table class="cmp-table" style="width:100%;border-collapse:collapse;font-size:13px;margin-top:8px">'
    + '<thead><tr style="color:var(--muted);font-size:11px;text-transform:uppercase">'
    + '<th style="padding:8px 6px;text-align:left">Artículo</th>'
    + '<th style="padding:8px 6px;text-align:left">Proveedor</th>'
    + '<th style="padding:8px 6px;text-align:right">Precio compra</th>'
    + '<th style="padding:8px 6px;text-align:right">Margen</th>'
    + '<th style="padding:8px 6px;text-align:left">Fecha</th>'
    + '<th style="padding:8px 6px;text-align:left">Notas</th>'
    + '<th style="padding:8px 6px;text-align:center">Acc.</th>'
    + '</tr></thead><tbody>'
    + lista.map(function(pr){
        var art    = cmpArticulos.find(function(a){ return a.id === pr.articulo_id; });
        var pvp    = art ? (parseFloat(art.pvp) || 0) : 0;
        var coste  = parseFloat(pr.precio) || 0;
        var margen = pvp > 0 ? Math.round(((pvp - coste) / pvp) * 100) : null;
        var mColor = margen === null ? 'var(--muted)' : (margen >= 60 ? '#2ecc71' : margen >= 40 ? '#f39c12' : '#e74c3c');
        return '<tr style="border-top:1px solid var(--border)">'
          + '<td style="padding:8px 6px;font-weight:600">'+(art ? art.nombre : '—')+'</td>'
          + '<td style="padding:8px 6px;color:var(--muted)">'+cmpNombreProveedor(pr.proveedor_id)+'</td>'
          + '<td style="padding:8px 6px;text-align:right;color:var(--red)">'+(coste ? coste.toFixed(2)+' €' : '—')+'</td>'
          + '<td style="padding:8px 6px;text-align:right;font-weight:700;color:'+mColor+'">'+(margen !== null ? margen+'%' : '—')+'</td>'
          + '<td style="padding:8px 6px;color:var(--muted)">'+(pr.fecha||'—')+'</td>'
          + '<td style="padding:8px 6px;color:var(--muted);max-width:160px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+(pr.notas||'—')+'</td>'
          + '<td style="padding:8px 6px;text-align:center">'
          + '<button class="btn btn-ghost btn-sm" style="padding:3px 8px;font-size:11px;color:var(--red);border-color:var(--red)" onclick="cmpEliminarPrecio('+pr.id+')">🗑</button>'
          + '</td></tr>';
      }).join('')
    + '</tbody></table>';
}

function cmpRenderAnalisis(){
  cmpRenderKpis();
  cmpAnTab(cmpAnTabActual || 'margen');
}

function cmpRenderKpis(){
  var cont = document.getElementById('cmp-kpis');
  if(!cont) return;
  var totalArts  = cmpArticulos.length;
  var totalProvs = cmpProveedores.length;
  var artsConPvp = cmpArticulos.filter(function(a){ return parseFloat(a.pvp) > 0 && parseFloat(a.precio_compra) > 0; });
  var margenMedio = artsConPvp.length
    ? Math.round(artsConPvp.reduce(function(s,a){
        var pvp = parseFloat(a.pvp), c = parseFloat(a.precio_compra);
        return s + ((pvp - c) / pvp) * 100;
      }, 0) / artsConPvp.length)
    : null;
  var kpis = [
    { label: 'Artículos', valor: totalArts, color: 'var(--accent)' },
    { label: 'Proveedores', valor: totalProvs, color: '#3498db' },
    { label: 'Margen medio', valor: margenMedio !== null ? margenMedio + '%' : '—',
      color: margenMedio === null ? 'var(--muted)' : margenMedio >= 60 ? '#2ecc71' : margenMedio >= 40 ? '#f39c12' : '#e74c3c' },
    { label: 'Precios registrados', valor: cmpPrecios.length, color: '#9b59b6' }
  ];
  cont.innerHTML = kpis.map(function(k){
    return '<div style="background:var(--darker);border:1px solid var(--border);border-radius:10px;padding:14px;text-align:center">'
      + '<div style="font-size:22px;font-weight:700;color:'+k.color+'">'+k.valor+'</div>'
      + '<div style="font-size:11px;color:var(--muted);margin-top:4px">'+k.label+'</div>'
      + '</div>';
  }).join('');
}

function cmpAnTab(tab){
  cmpAnTabActual = tab;
  ['margen','familia','prov','evol','top'].forEach(function(t){
    var btn = document.getElementById('cmp-an-tab-'+t);
    if(btn){ btn.className = t === tab ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-ghost'; }
  });
  var cont = document.getElementById('cmp-analisis-content');
  if(!cont) return;

  if(tab === 'margen'){
    var arts = cmpArticulos.filter(function(a){ return parseFloat(a.pvp) > 0 && parseFloat(a.precio_compra) > 0; })
      .map(function(a){
        var pvp = parseFloat(a.pvp), c = parseFloat(a.precio_compra);
        return { nombre: a.nombre, margen: Math.round(((pvp-c)/pvp)*100), pvp: pvp, coste: c };
      }).sort(function(a,b){ return b.margen - a.margen; });
    if(!arts.length){ cont.innerHTML = '<div style="color:var(--muted);font-size:13px;padding:20px">Añade artículos con precio compra y PVP para ver el análisis.</div>'; return; }
    cont.innerHTML = arts.map(function(a){
      var col = a.margen >= 60 ? '#2ecc71' : a.margen >= 40 ? '#f39c12' : '#e74c3c';
      return '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">'
        + '<div style="flex:1;font-size:13px">'+a.nombre+'</div>'
        + '<div style="width:120px;background:var(--border);border-radius:4px;height:8px;overflow:hidden">'
        + '<div style="width:'+Math.min(a.margen,100)+'%;height:100%;background:'+col+'"></div></div>'
        + '<div style="width:44px;text-align:right;font-weight:700;color:'+col+'">'+a.margen+'%</div>'
        + '</div>';
    }).join('');

  } else if(tab === 'familia'){
    var grupos = {};
    cmpArticulos.forEach(function(a){
      var fam = cmpNombreFamilia(a.familia_id);
      if(!grupos[fam]) grupos[fam] = { count: 0, margens: [] };
      grupos[fam].count++;
      if(parseFloat(a.pvp) > 0 && parseFloat(a.precio_compra) > 0){
        var pvp = parseFloat(a.pvp), c = parseFloat(a.precio_compra);
        grupos[fam].margens.push(((pvp-c)/pvp)*100);
      }
    });
    var rows = Object.keys(grupos).map(function(fam){
      var g = grupos[fam];
      var med = g.margens.length ? Math.round(g.margens.reduce(function(s,v){return s+v;},0)/g.margens.length) : null;
      return { fam: fam, count: g.count, margen: med };
    }).sort(function(a,b){ return b.count - a.count; });
    cont.innerHTML = '<table style="width:100%;border-collapse:collapse;font-size:13px">'
      + '<thead><tr style="color:var(--muted);font-size:11px;text-transform:uppercase">'
      + '<th style="padding:8px 6px;text-align:left">Familia</th>'
      + '<th style="padding:8px 6px;text-align:right">Artículos</th>'
      + '<th style="padding:8px 6px;text-align:right">Margen medio</th>'
      + '</tr></thead><tbody>'
      + rows.map(function(r){
          var col = r.margen === null ? 'var(--muted)' : r.margen >= 60 ? '#2ecc71' : r.margen >= 40 ? '#f39c12' : '#e74c3c';
          return '<tr style="border-top:1px solid var(--border)">'
            + '<td style="padding:8px 6px">'+r.fam+'</td>'
            + '<td style="padding:8px 6px;text-align:right">'+r.count+'</td>'
            + '<td style="padding:8px 6px;text-align:right;font-weight:700;color:'+col+'">'+(r.margen !== null ? r.margen+'%' : '—')+'</td>'
            + '</tr>';
        }).join('')
      + '</tbody></table>';

  } else if(tab === 'prov'){
    var provData = {};
    cmpArticulos.forEach(function(a){
      var pnombre = cmpNombreProveedor(a.proveedor_id);
      if(!provData[pnombre]) provData[pnombre] = { count: 0, costeTotal: 0 };
      provData[pnombre].count++;
      provData[pnombre].costeTotal += parseFloat(a.precio_compra) || 0;
    });
    var provRows = Object.keys(provData).sort(function(a,b){ return provData[b].count - provData[a].count; });
    if(!provRows.length){ cont.innerHTML = '<div style="color:var(--muted);font-size:13px;padding:20px">Sin datos de proveedores todavía.</div>'; return; }
    cont.innerHTML = '<table style="width:100%;border-collapse:collapse;font-size:13px">'
      + '<thead><tr style="color:var(--muted);font-size:11px;text-transform:uppercase">'
      + '<th style="padding:8px 6px;text-align:left">Proveedor</th>'
      + '<th style="padding:8px 6px;text-align:right">Artículos</th>'
      + '<th style="padding:8px 6px;text-align:right">Coste total</th>'
      + '</tr></thead><tbody>'
      + provRows.map(function(pn){
          var d = provData[pn];
          return '<tr style="border-top:1px solid var(--border)">'
            + '<td style="padding:8px 6px">'+pn+'</td>'
            + '<td style="padding:8px 6px;text-align:right">'+d.count+'</td>'
            + '<td style="padding:8px 6px;text-align:right;color:var(--red)">'+d.costeTotal.toFixed(2)+' €</td>'
            + '</tr>';
        }).join('')
      + '</tbody></table>';

  } else if(tab === 'evol'){
    if(!cmpPrecios.length){ cont.innerHTML = '<div style="color:var(--muted);font-size:13px;padding:20px">Registra precios históricos para ver la evolución.</div>'; return; }
    var porArt = {};
    cmpPrecios.forEach(function(pr){
      var art = cmpArticulos.find(function(a){ return a.id === pr.articulo_id; });
      var nombre = art ? art.nombre : 'Art. #'+pr.articulo_id;
      if(!porArt[nombre]) porArt[nombre] = [];
      porArt[nombre].push({ fecha: pr.fecha||'', precio: parseFloat(pr.precio)||0 });
    });
    cont.innerHTML = Object.keys(porArt).map(function(nombre){
      var entries = porArt[nombre].sort(function(a,b){ return a.fecha > b.fecha ? 1 : -1; });
      var ultimo = entries[entries.length-1];
      var primero = entries[0];
      var diff = entries.length > 1 ? ((ultimo.precio - primero.precio) / primero.precio * 100).toFixed(1) : null;
      var col = diff === null ? 'var(--muted)' : parseFloat(diff) > 0 ? '#e74c3c' : '#2ecc71';
      return '<div style="padding:10px 0;border-bottom:1px solid var(--border)">'
        + '<div style="font-size:13px;font-weight:600">'+nombre+'</div>'
        + '<div style="font-size:11px;color:var(--muted);margin-top:3px">'
        + entries.map(function(e){ return e.fecha+': <b>'+e.precio.toFixed(2)+' €</b>'; }).join(' → ')
        + (diff !== null ? ' <span style="color:'+col+';font-weight:700">('+( parseFloat(diff)>0 ? '+':'')+diff+'%)</span>' : '')
        + '</div></div>';
    }).join('');

  } else if(tab === 'top'){
    var arts = cmpArticulos.filter(function(a){ return parseInt(a.ventas_semana) > 0; })
      .sort(function(a,b){ return parseInt(b.ventas_semana) - parseInt(a.ventas_semana); });
    if(!arts.length){ cont.innerHTML = '<div style="color:var(--muted);font-size:13px;padding:20px">Añade unidades vendidas/semana a los artículos para ver el ranking.</div>'; return; }
    cont.innerHTML = arts.map(function(a, i){
      var pvp = parseFloat(a.pvp)||0, v = parseInt(a.ventas_semana)||0;
      var ingSem = (pvp * v).toFixed(2);
      return '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">'
        + '<div style="width:24px;text-align:center;font-weight:700;color:var(--muted)">'+(i+1)+'</div>'
        + '<div style="flex:1;font-size:13px;font-weight:600">'+a.nombre+'</div>'
        + '<div style="font-size:12px;color:var(--muted)">'+v+' ud/sem</div>'
        + '<div style="font-size:12px;color:#2ecc71;font-weight:700">'+ingSem+' €/sem</div>'
        + '</div>';
    }).join('');
  }
}

// ========== Detectar modo trabajador al cargar la página
(function(){
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', checkWorkerChecklistUrl);
  } else {
    checkWorkerChecklistUrl();
  }
})();
