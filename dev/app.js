var DIAS=['Lunes','Martes','Mi\u00e9rcoles','Jueves','Viernes','S\u00e1bado','Domingo'];
var DIAS_SHORT=['LUN','MAR','MI\u00c9','JUE','VIE','S\u00c1B','DOM'];
var COLORS=['#e74c3c','#3498db','#2ecc71','#9b59b6','#e67e22','#1abc9c','#e91e63','#ff9800'];
var ROLES=['Resp. Ma\u00f1ana','Resp. Noche','Cam. Ma\u00f1ana','Cam. Noche','Cam. Tarde','Cam. Intermedio','Cocinero','Ayud. Cocina','Encargado','Barman'];

// ========== LOCAL ACTIVO (persiste en localStorage) ==========
var localActivoId = parseInt(localStorage.getItem('rt_local_activo_id')) || 1;

function setLocalActivo(id){
  localActivoId = parseInt(id) || 1;
  localStorage.setItem('rt_local_activo_id', localActivoId);
  precargarTurnos();
  initDashboardLocal();
  // Sincronizar el selector del cuadrante si existe
  var sel = document.getElementById('local-select');
  if(sel) sel.value = (localActivoId === 2 ? "Roto's Burguer" : 'La Cala');
}

function initDashboardLocal(){
  var nombres = {1:'\ud83c\udf7d La Cala', 2:"\ud83c\udf54 Roto's Burguer"};
  var lbl = document.getElementById('dash-local-nombre');
  if(lbl) lbl.textContent = nombres[localActivoId] || '\u2014';
  // Resaltar bot\u00f3n activo
  [1,2].forEach(function(i){
    var btn = document.getElementById('dash-local-btn-' + i);
    if(!btn) return;
    btn.className = i === localActivoId
      ? 'btn btn-sm btn-primary'
      : 'btn btn-sm btn-ghost';
  });
}

function precargarTurnos(){
  if(localActivoId === 1){
    turnosConfig=[
      {id:'manana',     nome:'Mañana',    emoji:'☀️', ini:'07:30',fin:'16:30',badge:'badge-manana',    color:'#2ecc71',active:true},
      {id:'manana2',    nome:'Mañana 2',  emoji:'🌤', ini:'08:30',fin:'17:30',badge:'badge-manana2',   color:'#58d68d',active:false},
      {id:'tarde',      nome:'Tarde',     emoji:'🌅', ini:'15:00',fin:'00:00',badge:'badge-tarde',     color:'#e67e22',active:true},
      {id:'tarde2',     nome:'Tarde 2',   emoji:'🌆', ini:'16:00',fin:'01:00',badge:'badge-tarde2',    color:'#ff9040',active:false},
      {id:'noche',      nome:'Noche',     emoji:'🌙', ini:'18:00',fin:'03:00',badge:'badge-noche',     color:'#3498db',active:true},
      {id:'noche2',     nome:'Noche 2',   emoji:'🌃', ini:'19:00',fin:'04:00',badge:'badge-noche2',    color:'#1a78c2',active:false},
      {id:'intermedio', nome:'Intermedio',emoji:'🔄', ini:'12:00',fin:'21:00',badge:'badge-intermedio',color:'#9b59b6',active:true},
      {id:'intermedio2',nome:'Intermedio 2',emoji:'🔁',ini:'13:00',fin:'22:00',badge:'badge-intermedio2',color:'#a070e0',active:false},
      {id:'seguido1',   nome:'Seguido 1', emoji:'⏩', ini:'09:00',fin:'18:00',badge:'badge-seguido1',  color:'#20b0a0',active:false},
      {id:'seguido2',   nome:'Seguido 2', emoji:'⏭', ini:'10:00',fin:'19:00',badge:'badge-seguido2',  color:'#10c080',active:false},
      {id:'seguido3',   nome:'Seguido 3', emoji:'⏫', ini:'11:00',fin:'20:00',badge:'badge-seguido3',  color:'#00d4b0',active:false},
      {id:'intermedio3',nome:'Intermedio 3',emoji:'🔃',ini:'14:00',fin:'23:00',badge:'badge-intermedio3',color:'#8050d0',active:false},
      {id:'partido',    nome:'Partido',   emoji:'✂️', ini:'11:00',fin:'16:00',ini2:'20:00',fin2:'23:00',badge:'badge-partido',color:'#ffa040',active:true,esPartido:true},
    ];
  } else {
    turnosConfig=[
      {id:'manana',     nome:'Mañana',    emoji:'☀️', ini:'11:00',fin:'19:00',badge:'badge-manana',    color:'#2ecc71',active:true},
      {id:'manana2',    nome:'Mañana 2',  emoji:'🌤', ini:'12:00',fin:'20:00',badge:'badge-manana2',   color:'#58d68d',active:false},
      {id:'tarde',      nome:'Tarde',     emoji:'🌅', ini:'14:00',fin:'23:00',badge:'badge-tarde',     color:'#e67e22',active:true},
      {id:'tarde2',     nome:'Tarde 2',   emoji:'🌆', ini:'15:00',fin:'00:00',badge:'badge-tarde2',    color:'#ff9040',active:false},
      {id:'noche',      nome:'Noche',     emoji:'🌙', ini:'16:00',fin:'00:00',badge:'badge-noche',     color:'#3498db',active:true},
      {id:'noche2',     nome:'Noche 2',   emoji:'🌃', ini:'17:00',fin:'01:00',badge:'badge-noche2',    color:'#1a78c2',active:false},
      {id:'intermedio', nome:'Intermedio',emoji:'🔄', ini:'12:00',fin:'20:00',badge:'badge-intermedio',color:'#9b59b6',active:false},
      {id:'seguido1',   nome:'Seguido 1', emoji:'⏩', ini:'11:00',fin:'19:00',badge:'badge-seguido1',  color:'#20b0a0',active:false},
      {id:'seguido2',   nome:'Seguido 2', emoji:'⏭', ini:'12:00',fin:'20:00',badge:'badge-seguido2',  color:'#10c080',active:false},
      {id:'seguido3',   nome:'Seguido 3', emoji:'⏫', ini:'13:00',fin:'21:00',badge:'badge-seguido3',  color:'#00d4b0',active:false},
      {id:'intermedio2',nome:'Intermedio 2',emoji:'🔁',ini:'13:00',fin:'21:00',badge:'badge-intermedio2',color:'#a070e0',active:false},
      {id:'intermedio3',nome:'Intermedio 3',emoji:'🔃',ini:'14:00',fin:'22:00',badge:'badge-intermedio3',color:'#8050d0',active:false},
      {id:'partido',    nome:'Partido',   emoji:'✂️', ini:'11:00',fin:'16:00',ini2:'20:00',fin2:'00:00',badge:'badge-partido',color:'#ffa040',active:true,esPartido:true},
    ];
  }
}
precargarTurnos();

var cmpFamilias=[], cmpArticulos=[], cmpProveedores=[], cmpPrecios=[];
var cmpTabActual='articulos', cmpAnTabActual='margen';

// ========== SUPABASE CONFIG ==========
const SUPA_URL = 'https://ttewezdnroiqtetmgyrh.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0ZXdlemRucm9pcXRldG1neXJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3OTExMDIsImV4cCI6MjA4ODM2NzEwMn0.mA5tWItknmHmBe7-8AZpN9579RRwEaM3ZybYpQBc2Pw';

async function sbGet(table, filters){
  var url = SUPA_URL+'/rest/v1/'+table+'?'+(filters||'order=id.asc');
  var r = await fetch(url,{headers:{'apikey':SUPA_KEY,'Authorization':'Bearer '+SUPA_KEY,'Content-Type':'application/json'}});
  if(!r.ok){
    var body = await r.json().catch(function(){ return {}; });
    throw new Error('GET '+table+' '+r.status+': '+(body.message||body.hint||body.code||JSON.stringify(body)));
  }
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
  if(!r.ok){
    var errBody = await r.json().catch(function(){ return {}; });
    console.error('[sbPatch] Error', r.status, table, errBody);
    throw new Error('PATCH '+table+' error '+r.status+': '+(errBody.message||errBody.hint||JSON.stringify(errBody)));
  }
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
  var TURNO_LABEL = {manana:'M',manana2:'M2',noche:'N',noche2:'N2',tarde:'T',tarde2:'T2',intermedio:'I',intermedio2:'I2',intermedio3:'I3',seguido1:'S1',seguido2:'S2',seguido3:'S3',fiesta:'🏖',mediafiesta:'½'};
  var TURNO_COLOR = {manana:'var(--green)',manana2:'#58d68d',noche:'#6b8fff',noche2:'#1a78c2',tarde:'#ffa040',tarde2:'#ff9040',intermedio:'#c080ff',intermedio2:'#a070e0',intermedio3:'#8050d0',seguido1:'#20b0a0',seguido2:'#10c080',seguido3:'#00d4b0',fiesta:'#ff6b6b',mediafiesta:'#ffaa40'};

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
  [{l:'M',c:'var(--green)',tk:'turno_m_label'},{l:'M2',c:'#58d68d',tk:'turno_m2_label'},{l:'N',c:'#6b8fff',tk:'turno_n_label'},{l:'N2',c:'#1a78c2',tk:'turno_n2_label'},{l:'T',c:'#ffa040',tk:'turno_t_label'},{l:'T2',c:'#ff9040',tk:'turno_t2_label'},{l:'I',c:'#c080ff',tk:'turno_i_label'},{l:'I2',c:'#a070e0',tk:'turno_i2_label'},{l:'I3',c:'#8050d0',tk:'turno_i3_label'},{l:'S1',c:'#20b0a0',tk:'turno_s1_label'},{l:'S2',c:'#10c080',tk:'turno_s2_label'},{l:'S3',c:'#00d4b0',tk:'turno_s3_label'},{l:'🏖',c:'#ff6b6b',tk:'turno_fiesta'},{l:'½',c:'#ffaa40',tk:'turno_mediafiesta'}]
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

    // 2. Vincular empleados a sus registros en BD (sin crear nuevos)
    var empsFaltantes = [];
    for(var i=0;i<empleados.length;i++){
      var emp = empleados[i];
      var existing = await sbGet('empleados','local_id=eq.'+localId+'&nombre=eq.'+encodeURIComponent(emp.nombre));
      var empBdId;
      if(existing && existing.length){
        empBdId = existing[0].id;
        await sbPatch('empleados', empBdId, {rol:emp.rol, turno_habitual:emp.turno, telefono:emp.telefono||null});
      } else {
        empsFaltantes.push(emp.nombre);
        continue; // saltar — no crear empleados desde el cuadrante
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

    if(empsFaltantes.length){
      showToast('⚠ Sin BD: '+empsFaltantes.join(', ')+'. Créalos en Gestión Usuarios primero.','orange');
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

function getSemanaLabelForDate(isoDate){
  if(!isoDate) return '';
  var d=new Date(isoDate+'T12:00:00');
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
  for(var i=0;i<=20;i++){
    var sc=document.getElementById('screen'+i),st=document.getElementById('step'+i);
    if(sc)sc.className='screen'+(i===n?' active':'');
    if(st){st.className='step'+(i===n?' active':i<n?' done':'');}
  }
  // Mostrar barra de pasos solo en el flujo Cuadrante (screens 1-6)
  var stepsBar=document.getElementById('steps-bar');
  if(stepsBar) stepsBar.style.display=(n>=1&&n<=6)?'flex':'none';
  // Marcar item activo en sidebar
  var snavMap={0:0,1:1,2:1,3:1,4:1,5:1,6:1,7:7,8:8,9:9,10:10,12:12,13:13,14:14,15:15,16:16,17:17};
  [0,1,7,8,9,10,12,13,14,15,16,17].forEach(function(i){
    var el=document.getElementById('snav-'+i);
    if(el) el.classList.toggle('active', snavMap[n]===i);
  });
  if(n===0) initDashboardLocal();
  if(n===7) renderCostes();
  if(n===9) cargarUsuarios();
  if(n===10){ renderPersonalizacion(); cargarParamsCosteGuardados(); var sl=localStorage.getItem('rt_logo'); aplicarLogoGuardado(sl||null); }
  if(n===12){ initCompras(); }
  if(n===14){ initAsistenteIA(); }
  if(n===15){ initAvisos(); }
  if(n===16){ initChecklist(); }
  if(n===18){ initInventarioCocina(); }
  if(n===19){ /* próximamente */ }
  if(n===20){ /* próximamente */ }
  if(n===17){ initEquipo17(); }
  window.scrollTo(0,0);
}

async function initEquipo17(){
  await cargarEmpleadosBD();
  if(!turnosConfig.length) buildTurnosConfig();
  renderEmpleados();
  renderLorenaHorario();
}

async function empDarDeBaja(bdId, nombre){
  if(!confirm('¿Dar de baja a ' + nombre + '? Se marcará como inactivo en la BD (no se elimina).')) return;
  try{
    await sbPatch('empleados', bdId, { activo: false });
    showToast(nombre + ' dado de baja', 'orange');
    // Refrescar lista
    empleados = [];
    await cargarEmpleadosBD();
  }catch(e){
    showToast('Error al dar de baja: ' + e.message, 'red');
  }
}

async function empEliminar(bdId, nombre){
  if(!confirm('¿ELIMINAR DEFINITIVAMENTE a ' + nombre + '? Esta acción no se puede deshacer.')) return;
  try{
    await _borrarEmpleadoConDependientes(bdId, nombre);
    showToast(nombre + ' eliminado definitivamente', 'red');
    empleados = [];
    await cargarEmpleadosBD();
  }catch(e){
    showToast('Error al eliminar: ' + e.message, 'red');
  }
}

function nextStep(from){
  if(from===1){if(!getLocal()){alert(t('alert_selecciona_local'));return;}updateHeader();buildTurnosConfig();cargarConfigTurnosGuardada();renderTurnosConfigGrid();goStep(2);}
  else if(from===2){goStep(3);cargarEmpleadosBD();renderLorenaHorario();}
  else if(from===3){if(!empleados.length){alert('A\u00f1ade al menos un empleado');return;}empleados.forEach(function(e){if(!e.nombre)e.nombre='Empleado '+e.id;});if(!turnosConfig.length)buildTurnosConfig();sugerirYRenderizar();goStep(4);}
  else if(from===4){initPaso5();goStep(5);}
}

async function cargarEmpleadosBD(){
  // Usar localActivoId del dashboard si está disponible; si no, intentar desde el selector del cuadrante
  var localId = window.localActivoId || null;
  if(!localId){
    var local = getLocal();
    localId = localIdMap[local];
    if(!localId && local === 'La Cala') localId = 1;
    if(!localId && local === "Roto's Burguer") localId = 2;
  }
  if(!localId){
    if(empleados.length===0) initDef('');
    renderEmpleados();
    return;
  }
  try{
    showToast(t('toast_cargando_equipo'),'orange');
    var emps = await sbGet('empleados','local_id=eq.'+localId+'&activo=neq.false&order=id.asc');
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
      {id:'manana',    nome:'Ma\u00f1ana',   emoji:'\u2600\ufe0f', ini:'07:30',fin:'16:30',badge:'badge-manana',    color:'#2ecc71',active:true},
      {id:'manana2',   nome:'Ma\u00f1ana 2', emoji:'\ud83c\udf24', ini:'08:30',fin:'17:30',badge:'badge-manana2',   color:'#58d68d',active:false},
      {id:'tarde',     nome:'Tarde',          emoji:'\ud83c\udf05', ini:'15:00',fin:'00:00',badge:'badge-tarde',     color:'#e67e22',active:true},
      {id:'tarde2',    nome:'Tarde 2',        emoji:'\ud83c\udf06', ini:'16:00',fin:'01:00',badge:'badge-tarde2',    color:'#ff9040',active:false},
      {id:'noche',     nome:'Noche',          emoji:'\ud83c\udf19', ini:'18:00',fin:'03:00',badge:'badge-noche',     color:'#3498db',active:true},
      {id:'noche2',    nome:'Noche 2',        emoji:'\ud83c\udf03', ini:'19:00',fin:'04:00',badge:'badge-noche2',    color:'#1a78c2',active:false},
      {id:'intermedio',  nome:'Intermedio',   emoji:'\ud83d\udd04', ini:'12:00',fin:'21:00',badge:'badge-intermedio',color:'#9b59b6',active:true},
      {id:'intermedio2', nome:'Intermedio 2', emoji:'\ud83d\udd01', ini:'13:00',fin:'22:00',badge:'badge-intermedio2',color:'#a070e0',active:false},
      {id:'seguido1',    nome:'Seguido 1',    emoji:'\u23e9',       ini:'09:00',fin:'18:00',badge:'badge-seguido1',  color:'#20b0a0',active:false},
      {id:'seguido2',    nome:'Seguido 2',    emoji:'\u23ed',       ini:'10:00',fin:'19:00',badge:'badge-seguido2',  color:'#10c080',active:false},
      {id:'seguido3',    nome:'Seguido 3',    emoji:'\u23eb',       ini:'11:00',fin:'20:00',badge:'badge-seguido3',  color:'#00d4b0',active:false},
      {id:'intermedio3', nome:'Intermedio 3', emoji:'\ud83d\udd03', ini:'14:00',fin:'23:00',badge:'badge-intermedio3',color:'#8050d0',active:false},
      {id:'partido',     nome:'Partido',      emoji:'\u2702\ufe0f', ini:'11:00',fin:'16:00',ini2:'20:00',fin2:'23:00',badge:'badge-partido',color:'#ffa040',active:true,esPartido:true},
    ];
  } else if(local==="Roto's Burguer"){
    turnosConfig=[
      {id:'manana',    nome:'Ma\u00f1ana',   emoji:'\u2600\ufe0f', ini:'11:00',fin:'19:00',badge:'badge-manana',    color:'#2ecc71',active:true},
      {id:'manana2',   nome:'Ma\u00f1ana 2', emoji:'\ud83c\udf24', ini:'12:00',fin:'20:00',badge:'badge-manana2',   color:'#58d68d',active:false},
      {id:'tarde',     nome:'Tarde',          emoji:'\ud83c\udf05', ini:'14:00',fin:'23:00',badge:'badge-tarde',     color:'#e67e22',active:true},
      {id:'tarde2',    nome:'Tarde 2',        emoji:'\ud83c\udf06', ini:'15:00',fin:'00:00',badge:'badge-tarde2',    color:'#ff9040',active:false},
      {id:'noche',     nome:'Noche',          emoji:'\ud83c\udf19', ini:'16:00',fin:'00:00',badge:'badge-noche',     color:'#3498db',active:true},
      {id:'noche2',    nome:'Noche 2',        emoji:'\ud83c\udf03', ini:'17:00',fin:'01:00',badge:'badge-noche2',    color:'#1a78c2',active:false},
      {id:'intermedio',  nome:'Intermedio',   emoji:'\ud83d\udd04', ini:'12:00',fin:'20:00',badge:'badge-intermedio', color:'#9b59b6',active:false},
      {id:'intermedio2', nome:'Intermedio 2', emoji:'\ud83d\udd01', ini:'13:00',fin:'21:00',badge:'badge-intermedio2',color:'#a070e0',active:false},
      {id:'intermedio3', nome:'Intermedio 3', emoji:'\ud83d\udd03', ini:'14:00',fin:'22:00',badge:'badge-intermedio3',color:'#8050d0',active:false},
      {id:'seguido1',    nome:'Seguido 1',    emoji:'\u23e9',       ini:'11:00',fin:'19:00',badge:'badge-seguido1',  color:'#20b0a0',active:false},
      {id:'seguido2',    nome:'Seguido 2',    emoji:'\u23ed',       ini:'12:00',fin:'20:00',badge:'badge-seguido2',  color:'#10c080',active:false},
      {id:'seguido3',    nome:'Seguido 3',    emoji:'\u23eb',       ini:'13:00',fin:'21:00',badge:'badge-seguido3',  color:'#00d4b0',active:false},
      {id:'partido',     nome:'Partido',      emoji:'\u2702\ufe0f', ini:'11:00',fin:'16:00',ini2:'20:00',fin2:'00:00',badge:'badge-partido',color:'#ffa040',active:true,esPartido:true},
    ];
  } else {
    var s=toMin(ap),e=toMin(ci);if(e<=s)e+=1440;
    var third=Math.round((e-s)/3/30)*30;
    var mid1=toStr(s+third),mid2=toStr(s+third*2);
    var iS=toStr(s+Math.round(third*0.7/30)*30),iE=toStr(s+Math.round(third*1.7/30)*30);
    turnosConfig=[
      {id:'manana',    nome:'Ma\u00f1ana',   emoji:'\u2600\ufe0f', ini:ap,   fin:mid1,badge:'badge-manana',    color:'#2ecc71',active:true},
      {id:'manana2',   nome:'Ma\u00f1ana 2', emoji:'\ud83c\udf24', ini:ap,   fin:mid1,badge:'badge-manana2',   color:'#58d68d',active:false},
      {id:'tarde',     nome:'Tarde',    emoji:'\ud83c\udf05', ini:mid1, fin:mid2,badge:'badge-tarde',     color:'#e67e22',active:false},
      {id:'tarde2',    nome:'Tarde 2',  emoji:'\ud83c\udf06', ini:mid1, fin:mid2,badge:'badge-tarde2',    color:'#ff9040',active:false},
      {id:'noche',     nome:'Noche',    emoji:'\ud83c\udf19', ini:mid2, fin:ci,  badge:'badge-noche',     color:'#3498db',active:true},
      {id:'noche2',    nome:'Noche 2',  emoji:'\ud83c\udf03', ini:mid2, fin:ci,  badge:'badge-noche2',    color:'#1a78c2',active:false},
      {id:'intermedio',  nome:'Intermedio',   emoji:'\ud83d\udd04', ini:iS,  fin:iE,badge:'badge-intermedio', color:'#9b59b6',active:false},
      {id:'intermedio2', nome:'Intermedio 2', emoji:'\ud83d\udd01', ini:iS,  fin:iE,badge:'badge-intermedio2',color:'#a070e0',active:false},
      {id:'intermedio3', nome:'Intermedio 3', emoji:'\ud83d\udd03', ini:iS,  fin:iE,badge:'badge-intermedio3',color:'#8050d0',active:false},
      {id:'seguido1',    nome:'Seguido 1',    emoji:'\u23e9', ini:ap,  fin:mid2,badge:'badge-seguido1',  color:'#20b0a0',active:false},
      {id:'seguido2',    nome:'Seguido 2',    emoji:'\u23ed', ini:mid1,fin:ci,  badge:'badge-seguido2',  color:'#10c080',active:false},
      {id:'seguido3',    nome:'Seguido 3',    emoji:'\u23eb', ini:ap,  fin:ci,  badge:'badge-seguido3',  color:'#00d4b0',active:false},
      {id:'partido',     nome:'Partido',      emoji:'\u2702\ufe0f', ini:ap,  fin:mid1,ini2:mid2,fin2:ci,badge:'badge-partido',color:'#ffa040',active:false,esPartido:true},
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

function guardarConfigTurnos(){
  var key='rt_turnos_config_'+localActivoId;
  var data=turnosConfig.map(function(tc){
    var obj={id:tc.id,ini:tc.ini,fin:tc.fin,active:tc.active};
    if(tc.ini2) obj.ini2=tc.ini2;
    if(tc.fin2) obj.fin2=tc.fin2;
    return obj;
  });
  localStorage.setItem(key,JSON.stringify(data));
  showToast('✅ Configuración de turnos guardada','green');
}

function cargarConfigTurnosGuardada(){
  var key='rt_turnos_config_'+localActivoId;
  var saved=localStorage.getItem(key);
  if(!saved) return false;
  try{
    var data=JSON.parse(saved);
    data.forEach(function(s){
      var tc=turnosConfig.find(function(x){return x.id===s.id;});
      if(!tc) return;
      tc.ini=s.ini; tc.fin=s.fin; tc.active=s.active;
      if(s.ini2) tc.ini2=s.ini2;
      if(s.fin2) tc.fin2=s.fin2;
    });
    return true;
  }catch(e){ return false; }
}

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
    var tOpts=activeTurnos.map(function(t){return'<option value="'+t.id+'"'+(emp.turno===t.id?' selected':'')+'>'+t.emoji+' '+t.nome+' '+t.ini+'–'+t.fin+'</option>';}).join('');
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
      +(contId==='empleados-list-17'?(function(){
          var bd=window._empleadosBDDatos&&window._empleadosBDDatos[emp.nombre];
          var bid=bd?bd.bdId:null;
          if(!bid) return '';
          var ns=emp.nombre.replace(/'/g,"\\'");
          return '<div style="display:flex;gap:8px;margin-top:8px">'
            +'<button onclick="empDarDeBaja('+bid+',\''+ns+'\')" style="flex:1;padding:7px;background:#ff9800;color:#fff;border:none;border-radius:7px;cursor:pointer;font-size:12px">📴 Dar de baja</button>'
            +'<button onclick="empEliminar('+bid+',\''+ns+'\')" style="flex:1;padding:7px;background:#e53935;color:#fff;border:none;border-radius:7px;cursor:pointer;font-size:12px">🗑 Eliminar</button>'
            +'</div>';
        })():'')
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
var MINIMOS_TURNO = {manana:2, manana2:1, noche:2, noche2:1, tarde:1, tarde2:1, intermedio:1, intermedio2:1, intermedio3:1, seguido1:1, seguido2:1, seguido3:1};

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
  var MIN_COB = 5;
  var hMFel = document.getElementById('horas-media-fiesta');
  var hMF = hMFel ? (+hMFel.value||5) : 5;

  empleados.forEach(function(emp){
    emp.turnos = Array(7).fill(emp.turno);
    if(!emp.diasFiesta) emp.diasFiesta = 1.5;
    emp._mediaGap = -1;
  });

  empleados.forEach(function(emp){
    var fijas = getFiestasFijas(emp);
    if(!fijas) return;
    fijas.forEach(function(f){
      var dia=f[0], tipo=f[1], ini=f[2], fin=f[3];
      emp.turnos[dia]=tipo;
      if(tipo==='mediafiesta' && ini && fin){
        if(!emp.horarioEspecial) emp.horarioEspecial={};
        emp.horarioEspecial[dia]={ini:ini,fin:fin};
      }
    });
  });

  function calcCovSlots(dia){
    var slots = new Array(48).fill(0);
    var acts = turnosConfig.filter(function(tc){ return tc.active; });
    empleados.forEach(function(emp){
      var tv = emp.turnos[dia];
      if(tv==='fiesta') return;
      var tc = acts.find(function(x){ return x.id===emp.turno; });
      if(!tc) return;
      var a, b;
      if(tv==='mediafiesta'){
        a = toMinTurno(tc.ini);
        b = a + hMF*60;
      } else if(tc.esPartido){
        a=toMinTurno(tc.ini); b=toMinTurno(tc.fin);
        if(b<=a) b+=1440;
        for(var s=Math.floor(a/30);s<Math.ceil(b/30);s++) slots[s%48]++;
        a=toMinTurno(tc.ini2); b=toMinTurno(tc.fin2);
        if(b<=a) b+=1440;
        for(var s2=Math.floor(a/30);s2<Math.ceil(b/30);s2++) slots[s2%48]++;
        return;
      } else {
        a=toMinTurno(tc.ini); b=toMinTurno(tc.fin);
        if(b<=a) b+=1440;
      }
      for(var s=Math.floor(a/30);s<Math.ceil(b/30);s++) slots[s%48]++;
    });
    return slots;
  }

  function causariaGap(emp, dia){
    if(emp.turnos[dia]==='fiesta'||emp.turnos[dia]==='mediafiesta') return false;
    var acts = turnosConfig.filter(function(tc){ return tc.active; });
    var tc = acts.find(function(x){ return x.id===emp.turno; });
    if(!tc||tc.esPartido) return false;
    var slots = calcCovSlots(dia);
    var a=toMinTurno(tc.ini), b=toMinTurno(tc.fin);
    if(b<=a) b+=1440;
    for(var s=Math.floor(a/30);s<Math.ceil(b/30);s++){
      if(slots[s%48]-1 < MIN_COB) return true;
    }
    return false;
  }

  // FASE 1: gap-fill — asignar mediafiesta en días con franjas < MIN_COB
  for(var dGap=0; dGap<7; dGap++){
    var slotsDia = calcCovSlots(dGap);
    var actsGap = turnosConfig.filter(function(tc){ return tc.active; });
    for(var gs=0; gs<48; gs++){
      if(slotsDia[gs]>=MIN_COB) continue;
      var filled = false;
      for(var ei=0; ei<empleados.length && !filled; ei++){
        var emp = empleados[ei];
        if(getFiestasFijas(emp)) continue;
        if(emp._mediaGap>=0) continue;
        if((parseFloat(emp.diasFiesta)||1.5)<1) continue;
        if(emp.turnos[dGap]==='fiesta'||emp.turnos[dGap]==='mediafiesta') continue;
        var tc = actsGap.find(function(x){ return x.id===emp.turno; });
        if(!tc||tc.esPartido) continue;
        var a=toMinTurno(tc.ini), b=toMinTurno(tc.fin);
        if(b<=a) b+=1440;
        var rel=(gs*30 - a%1440 + 1440)%1440;
        if(rel < hMF*60 && rel < (b-a)){
          emp.turnos[dGap]='mediafiesta';
          emp._mediaGap=dGap;
          slotsDia=calcCovSlots(dGap);
          filled=true;
        }
      }
    }
  }

  var candidatePairs=[], seenPairs={}, i, d;
  for(i=0;i<df.length;i++){
    d=df[i];
    if(df.indexOf(d+1)>=0 && !seenPairs[d+','+(d+1)]){
      candidatePairs.push({d1:d,d2:d+1,score:0});
      seenPairs[d+','+(d+1)]=true;
    }
  }
  for(i=0;i<df.length;i++){
    d=df[i];
    if(d+1<=6 && df.indexOf(d+1)<0 && !seenPairs[d+','+(d+1)]){
      candidatePairs.push({d1:d,d2:d+1,score:1});
      seenPairs[d+','+(d+1)]=true;
    }
    if(d-1>=0 && df.indexOf(d-1)<0 && !seenPairs[(d-1)+','+d]){
      candidatePairs.push({d1:d-1,d2:d,score:1});
      seenPairs[(d-1)+','+d]=true;
    }
  }
  for(d=0;d<=5;d++){
    if(!seenPairs[d+','+(d+1)]){
      candidatePairs.push({d1:d,d2:d+1,score:2});
    }
  }

  var diasOrdenados=df.slice().concat([0,1,2,3,4,5,6].filter(function(x){return df.indexOf(x)<0;}));

  var turnoGroups={};
  empleados.forEach(function(emp){
    if(getFiestasFijas(emp)) return;
    if(!turnoGroups[emp.turno]) turnoGroups[emp.turno]=[];
    turnoGroups[emp.turno].push(emp);
  });

  // FASE 2: asignar fiestas con conciencia de cobertura
  empleados.forEach(function(emp){
    if(getFiestasFijas(emp)) return;

    var diasFiesta=parseFloat(emp.diasFiesta)||1.5;
    var tieneMedia=(diasFiesta%1)!==0;
    var diasEnteros=Math.floor(diasFiesta);
    var grupoTurno=turnoGroups[emp.turno]||[emp];
    var turnoIdx=grupoTurno.indexOf(emp);
    var rotBase=turnoIdx+(emp._rotOffset||0);
    var nPairs=candidatePairs.length;
    var preMed=emp._mediaGap;
    var pairOk, d1, d2, k, dd, par, attempt, nDias, asignados;

    if(tieneMedia && diasEnteros===1){
      if(preMed>=0){
        var fiestaDay=-1;
        var cands=[];
        if(preMed-1>=0 && emp.turnos[preMed-1]!=='fiesta' && emp.turnos[preMed-1]!=='mediafiesta') cands.push(preMed-1);
        if(preMed+1<=6 && emp.turnos[preMed+1]!=='fiesta' && emp.turnos[preMed+1]!=='mediafiesta') cands.push(preMed+1);
        for(k=0;k<cands.length;k++){
          if(!causariaGap(emp,cands[k])&&puedeTomarFiesta(emp,cands[k])){fiestaDay=cands[k];break;}
        }
        if(fiestaDay<0){
          for(k=0;k<cands.length;k++){
            if(puedeTomarFiesta(emp,cands[k])){fiestaDay=cands[k];break;}
          }
        }
        if(fiestaDay<0){
          nDias=diasOrdenados.length;
          for(k=0;k<nDias;k++){
            dd=diasOrdenados[k];
            if(dd!==preMed&&emp.turnos[dd]!=='fiesta'&&emp.turnos[dd]!=='mediafiesta'&&puedeTomarFiesta(emp,dd)){
              fiestaDay=dd;break;
            }
          }
        }
        if(fiestaDay>=0) emp.turnos[fiestaDay]='fiesta';
      } else {
        pairOk=null;
        for(attempt=0;attempt<nPairs;attempt++){
          par=candidatePairs[(rotBase+attempt)%nPairs];
          d1=par.d1;d2=par.d2;
          if(emp.turnos[d1]!=='fiesta'&&emp.turnos[d1]!=='mediafiesta'&&
             emp.turnos[d2]!=='fiesta'&&emp.turnos[d2]!=='mediafiesta'&&
             puedeTomarFiesta(emp,d1)&&puedeTomarFiesta(emp,d2)&&
             !causariaGap(emp,d1)&&!causariaGap(emp,d2)){
            pairOk=par;break;
          }
        }
        if(!pairOk){
          for(attempt=0;attempt<nPairs;attempt++){
            par=candidatePairs[(rotBase+attempt)%nPairs];
            d1=par.d1;d2=par.d2;
            if(emp.turnos[d1]!=='fiesta'&&emp.turnos[d1]!=='mediafiesta'&&
               emp.turnos[d2]!=='fiesta'&&emp.turnos[d2]!=='mediafiesta'&&
               puedeTomarFiesta(emp,d1)&&puedeTomarFiesta(emp,d2)){
              pairOk=par;break;
            }
          }
        }
        if(pairOk){
          d1=pairOk.d1;d2=pairOk.d2;
          if(df.indexOf(d2)>=0&&df.indexOf(d1)<0){
            emp.turnos[d1]='mediafiesta';emp.turnos[d2]='fiesta';
          } else {
            emp.turnos[d1]='fiesta';emp.turnos[d2]='mediafiesta';
          }
        } else {
          nDias=diasOrdenados.length;
          for(k=0;k<nDias;k++){
            dd=diasOrdenados[(rotBase+k)%nDias];
            if(emp.turnos[dd]!=='fiesta'&&emp.turnos[dd]!=='mediafiesta'&&puedeTomarFiesta(emp,dd)){
              emp.turnos[dd]='fiesta';break;
            }
          }
        }
      }
    } else if(!tieneMedia&&diasEnteros===1){
      nDias=diasOrdenados.length;
      var assigned=false;
      for(k=0;k<nDias;k++){
        dd=diasOrdenados[(rotBase+k)%nDias];
        if(emp.turnos[dd]!=='fiesta'&&emp.turnos[dd]!=='mediafiesta'&&puedeTomarFiesta(emp,dd)&&!causariaGap(emp,dd)){
          emp.turnos[dd]='fiesta';assigned=true;break;
        }
      }
      if(!assigned){
        for(k=0;k<nDias;k++){
          dd=diasOrdenados[(rotBase+k)%nDias];
          if(emp.turnos[dd]!=='fiesta'&&emp.turnos[dd]!=='mediafiesta'&&puedeTomarFiesta(emp,dd)){
            emp.turnos[dd]='fiesta';break;
          }
        }
      }
    } else if(diasEnteros>=2){
      asignados=[];
      for(attempt=0;attempt<nPairs&&asignados.length<diasEnteros;attempt++){
        par=candidatePairs[(rotBase+attempt)%nPairs];
        d1=par.d1;d2=par.d2;
        if(asignados.indexOf(d1)<0&&asignados.indexOf(d2)<0&&
           emp.turnos[d1]!=='fiesta'&&emp.turnos[d2]!=='fiesta'&&
           puedeTomarFiesta(emp,d1)&&puedeTomarFiesta(emp,d2)&&
           !causariaGap(emp,d1)&&!causariaGap(emp,d2)){
          asignados.push(d1,d2);
        }
      }
      if(asignados.length<diasEnteros){
        for(attempt=0;attempt<nPairs&&asignados.length<diasEnteros;attempt++){
          par=candidatePairs[(rotBase+attempt)%nPairs];
          d1=par.d1;d2=par.d2;
          if(asignados.indexOf(d1)<0&&asignados.indexOf(d2)<0&&
             emp.turnos[d1]!=='fiesta'&&emp.turnos[d2]!=='fiesta'&&
             puedeTomarFiesta(emp,d1)&&puedeTomarFiesta(emp,d2)){
            asignados.push(d1,d2);
          }
        }
      }
      if(asignados.length<diasEnteros){
        nDias=diasOrdenados.length;
        for(k=0;k<nDias&&asignados.length<diasEnteros;k++){
          dd=diasOrdenados[k];
          if(asignados.indexOf(dd)<0&&emp.turnos[dd]!=='fiesta'&&emp.turnos[dd]!=='mediafiesta'&&puedeTomarFiesta(emp,dd))
            asignados.push(dd);
        }
      }
      asignados.slice(0,diasEnteros).forEach(function(dd){emp.turnos[dd]='fiesta';});
      if(tieneMedia&&asignados.length>0){
        var dLast=asignados[asignados.length-1];
        var cMedia=-1;
        if(dLast-1>=0&&asignados.indexOf(dLast-1)<0&&emp.turnos[dLast-1]!=='fiesta'&&emp.turnos[dLast-1]!=='mediafiesta'&&puedeTomarFiesta(emp,dLast-1)) cMedia=dLast-1;
        if(cMedia<0&&dLast+1<=6&&asignados.indexOf(dLast+1)<0&&emp.turnos[dLast+1]!=='fiesta'&&emp.turnos[dLast+1]!=='mediafiesta'&&puedeTomarFiesta(emp,dLast+1)) cMedia=dLast+1;
        if(cMedia>=0) emp.turnos[cMedia]='mediafiesta';
      }
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
  sugerirTurnos();
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
      var opts=activeTurnos.map(function(tc){return'<option value="'+tc.id+'"'+(tv===tc.id?' selected':'')+'>'+tc.emoji+' '+tc.nome+' '+tc.ini+'–'+tc.fin+'</option>';}).join('')
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
  var localId = localActivoId;
  if(!localId) return null;
  try{
    // Cargar el último cuadrante guardado para este local, sin filtrar por semana
    var cuads=await sbGet('cuadrantes','local_id=eq.'+localId+'&order=id.desc&limit=1');
    if(!cuads.length) return null;
    var cuadId=cuads[0].id;
    currentCuadranteId=cuadId;
    // Sincronizar la semana en el selector para que el header y los cálculos sean correctos
    var fi=document.getElementById('fecha-inicio');
    if(fi && cuads[0].semana_label){
      for(var oi=0;oi<fi.options.length;oi++){
        if(getSemanaLabelForDate(fi.options[oi].value)===cuads[0].semana_label){
          fi.selectedIndex=oi; break;
        }
      }
    }
    updateHeader();
    // Cargar turnos
    var turnos=await sbGet('turnos_cuadrante','cuadrante_id=eq.'+cuadId+'&order=empleado_id.asc,dia.asc');
    var turnoMap={};
    turnos.forEach(function(t){
      if(!turnoMap[t.empleado_id]) turnoMap[t.empleado_id]=Array(7).fill('fiesta');
      turnoMap[t.empleado_id][t.dia]=(t.turno||'fiesta').toLowerCase();
    });
    empleados.forEach(function(emp){
      var bdId=empIdMap[emp.id];
      if(bdId && turnoMap[bdId]) emp.turnos=turnoMap[bdId];
    });
    // Cargar extras
    var extras=await sbGet('extras_dia','cuadrante_id=eq.'+cuadId);
    extrasDia=[];extraCounter=0;
    extras.forEach(function(ex){
      extraCounter++;
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
    +'.badge-manana2{background:#1a3520;color:#58d68d}'
    +'.badge-noche{background:#15152d;color:#6b8fff}'
    +'.badge-noche2{background:#0f1a2d;color:#1a78c2}'
    +'.badge-intermedio{background:#25152d;color:#c080ff}'
    +'.badge-intermedio2{background:#1e1030;color:#a070e0}'
    +'.badge-tarde{background:#2d2515;color:#ffa040}'
    +'.badge-tarde2{background:#2d1e0a;color:#ff9040}'
    +'.badge-seguido1{background:#0a2520;color:#20b0a0}'
    +'.badge-seguido2{background:#0a2018;color:#10c080}'
    +'.badge-seguido3{background:#002a28;color:#00d4b0}'
    +'.badge-intermedio3{background:#180d30;color:#8050d0}'
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
    +'.badge-manana2{background:#d0f5d8;color:#0a5020}'
    +'.badge-noche{background:#e0e8ff;color:#003}'
    +'.badge-noche2{background:#c8daf5;color:#0a2050}'
    +'.badge-intermedio{background:#f0e0ff;color:#404}'
    +'.badge-intermedio2{background:#e8d0ff;color:#503}'
    +'.badge-tarde{background:#fff0e0;color:#840}'
    +'.badge-tarde2{background:#ffe8d0;color:#960}'
    +'.badge-seguido1{background:#d0f0ec;color:#0a6050}'
    +'.badge-seguido2{background:#c0f0d8;color:#0a5030}'
    +'.badge-seguido3{background:#a0ffe8;color:#005040}'
    +'.badge-intermedio3{background:#e0d0ff;color:#401060}'
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
    +'<p class="footer">RelojTurnos v7.70 · '+new Date().toLocaleDateString('es-ES')+' · Coste empresa = bruto × 1,33 ÷ 4,33 · Total mes = semana × 4,33</p>'
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
  var temaData = TEMAS[tema];
  if(!temaData) return;
  Object.keys(temaData).forEach(function(k){ document.documentElement.style.setProperty('--'+k, temaData[k]); });
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
async function crearEmpleadoSinAcceso(){
  var nombre  = (document.getElementById('ea-nombre').value||'').trim();
  var local   = parseInt(document.getElementById('ea-local').value);
  var turno   = document.getElementById('ea-turno').value||'manana';
  var tel     = (document.getElementById('ea-telefono').value||'').trim();
  var errEl   = document.getElementById('ea-error');
  var okEl    = document.getElementById('ea-ok');
  errEl.style.display='none'; okEl.style.display='none';
  if(!nombre){ errEl.textContent='El nombre es obligatorio'; errEl.style.display='block'; return; }
  try{
    var ex = await sbGet('empleados','local_id=eq.'+local+'&nombre=eq.'+encodeURIComponent(nombre));
    if(ex && ex.length){ errEl.textContent='Ya existe un empleado con ese nombre en este local'; errEl.style.display='block'; return; }
    await sbPost('empleados',{ nombre:nombre, local_id:local, activo:true, rol:'Cam. Mañana', turno_habitual:turno, telefono:tel||null });
    okEl.textContent='✓ Empleado '+nombre+' añadido';
    okEl.style.display='block';
    ['ea-nombre','ea-telefono'].forEach(function(id){ var el=document.getElementById(id); if(el) el.value=''; });
    setTimeout(function(){ okEl.style.display='none'; cargarUsuarios(); }, 1200);
  }catch(e){ errEl.textContent='Error: '+e.message; errEl.style.display='block'; }
}

function _poblarSelectTurnos(selectId){
  var sel = document.getElementById(selectId);
  if(!sel || !turnosConfig.length) return;
  var current = sel.value;
  sel.innerHTML = turnosConfig.map(function(tc){
    return '<option value="'+tc.id+'"'+(tc.id===current?' selected':'')+'>'+tc.emoji+' '+tc.nome+' '+tc.ini+'–'+tc.fin+'</option>';
  }).join('');
}

async function cargarUsuarios(){
  var lista = document.getElementById('usuarios-lista');
  if(!lista) return;
  _poblarSelectTurnos('nu-turno');
  _poblarSelectTurnos('ea-turno');
  lista.innerHTML = '<div style="color:var(--muted);font-size:12px;text-align:center;padding:20px">⏳ Cargando...</div>';
  var ROLES = {empleado:'Empleado', directora:'Director/a', directora_general:'Dirección General', admin:'Admin'};
  var LOCALES = {1:'La Cala', 2:"Roto's Burguer"};
  var PROTEGIDOS = ['LORENA','MIRIAM','MIRYAM'];

  // Auto-borrar YANIRA de empleados si no tiene usuario
  try{
    var yaniras = await sbGet('empleados','nombre=eq.YANIRA');
    if(yaniras && yaniras.length){
      var usersYanira = await sbGet('usuarios','nombre=eq.YANIRA');
      if(!usersYanira || !usersYanira.length){
        for(var yi=0;yi<yaniras.length;yi++){
          try{ await _borrarEmpleadoConDependientes(yaniras[yi].id,'YANIRA'); }catch(_){}
        }
      }
    }
  }catch(_){}

  try{
    var rows = await sbGet('usuarios','order=id.asc');
    rows = rows || [];
    if(!rows.length){
      lista.innerHTML = '<div style="color:var(--muted);font-size:12px;text-align:center;padding:20px">No hay usuarios registrados aún</div>';
      return;
    }
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
      var nombreUp = (u.nombre||'').toUpperCase().trim();
      var esProtegido = PROTEGIDOS.indexOf(nombreUp) >= 0;
      return '<div style="display:flex;align-items:center;gap:10px;background:var(--darker);border:1px solid var(--border);border-radius:9px;padding:10px 12px;margin-bottom:7px">'
        +'<div style="width:32px;height:32px;border-radius:50%;background:'+col+'20;color:'+col+';display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;flex-shrink:0">'+init+'</div>'
        +'<div style="flex:1;min-width:0">'
        +'<div style="font-weight:700;font-size:13px;color:'+col+';white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+(u.nombre||t('p3_nombre_empleado'))+'</div>'
        +'<div style="font-size:10px;color:var(--muted)">'+subInfo+'</div>'
        +'</div>'
        +'<span style="font-size:9px;padding:2px 7px;border-radius:10px;background:'+(u.activo?'#15351520':'#35151520')+';color:'+(u.activo?'var(--green)':'var(--red)')+';border:1px solid '+(u.activo?'var(--green)':'var(--red)')+'40;flex-shrink:0">'+(u.activo?'ACTIVO':'INACTIVO')+'</span>'
        +'<button onclick="abrirEditarUsuario('+u.id+')" style="background:none;border:1px solid var(--border);border-radius:7px;padding:4px 9px;color:var(--muted);font-size:11px;cursor:pointer;flex-shrink:0">✏️</button>'
        +(esProtegido?'':'<button onclick="eliminarUsuario('+u.id+',\''+nombreUp+'\')" style="background:none;border:1px solid #e5393540;border-radius:7px;padding:4px 9px;color:#e53935;font-size:11px;cursor:pointer;flex-shrink:0">🗑</button>')
        +'</div>';
    }).join('');
    lista.innerHTML = html;
  }catch(e){
    lista.innerHTML = '<div style="color:var(--red);font-size:12px;text-align:center;padding:20px">⚠ Error cargando usuarios: '+e.message+'</div>';
    console.error('cargarUsuarios error:',e);
  }
}

function prefillNuevoUsuario(nombre){
  var el = document.getElementById('nu-nombre');
  if(el){ el.value = nombre; el.dispatchEvent(new Event('input')); }
  // Scroll al formulario de nuevo usuario
  var form = document.querySelector('#screen9 .card');
  if(form) form.scrollIntoView({behavior:'smooth', block:'start'});
  var inp = document.getElementById('nu-dni');
  if(inp) setTimeout(function(){ inp.focus(); }, 400);
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
  var telefono = (document.getElementById('nu-telefono')||{}).value||'';
  var turno    = (document.getElementById('nu-turno')||{}).value||'manana';
  var nuevo = { nombre: nombre, dni: dni, password_hash: passHash, rol: rol, local_id: localId, activo: true };
  await sbPost('usuarios', nuevo);
  logAccion('CREAR_USUARIO', nombre+' · DNI: '+dni+' · Rol: '+rol, localId||null);
  // Insertar/actualizar también en tabla empleados
  if(localId){
    try{
      var empEx = await sbGet('empleados','local_id=eq.'+localId+'&nombre=eq.'+encodeURIComponent(nombre));
      var rolEmpleado = rol === 'directora' ? 'Encargado' : 'Cam. Mañana';
      if(empEx && empEx.length){
        await sbPatch('empleados', empEx[0].id, { activo:true, rol:rolEmpleado, turno_habitual:turno, telefono:telefono||null });
      } else {
        await sbPost('empleados', { nombre:nombre, local_id:localId, activo:true, rol:rolEmpleado, turno_habitual:turno, telefono:telefono||null });
      }
    }catch(e2){ console.warn('empleados insert/update:', e2); }
  }
    okEl.textContent = '✓ Usuario '+nombre+' creado · Contraseña inicial: '+pass;
    okEl.style.display = 'block';
    // Limpiar form
    ['nu-nombre','nu-dni','nu-ss','nu-telefono'].forEach(function(id){ var el=document.getElementById(id); if(el) el.value=''; });
    cargarUsuarios();
  }catch(e){
    errEl.textContent = t('err_crear_usuario')+e.message;
    errEl.style.display='block';
    console.error('crearUsuario error:',e);
  }
}

// ===== EDITAR USUARIO REGISTRADO =====
var _euUsuarios = [];
var _euEmpleadoId = null;
async function abrirEditarUsuario(id){
  try{
    var rows = await sbGet('usuarios','id=eq.'+id);
    if(!rows||!rows.length){ showToast('Usuario no encontrado','red'); return; }
    var u = rows[0];
    _euEmpleadoId = u.empleado_id || null;
    // Cargar datos personales desde empleados (fuente de verdad) si existe FK
    var emp = null;
    if(_euEmpleadoId){
      try{
        var eRows = await sbGet('empleados','id=eq.'+_euEmpleadoId);
        emp = (eRows && eRows.length) ? eRows[0] : null;
      }catch(_){}
    }
    document.getElementById('eu-id').value       = u.id;
    document.getElementById('eu-nombre').value   = u.nombre||'';
    document.getElementById('eu-dni').value      = u.dni||'';
    document.getElementById('eu-rol').value      = u.rol||'empleado';
    document.getElementById('eu-local').value    = u.local_id||1;
    document.getElementById('eu-activo').value   = u.activo ? '1' : '0';
    document.getElementById('eu-pass').value     = '';
    document.getElementById('eu-ss').value       = (emp&&emp.nss)       || u.nss       || '';
    document.getElementById('eu-telefono').value = (emp&&emp.telefono)  || u.telefono  || '';
    document.getElementById('eu-email').value    = (emp&&emp.email)     || u.email     || '';
    document.getElementById('eu-direccion').value= (emp&&emp.direccion) || u.direccion || '';
    euRolChange();
    document.getElementById('eu-error').style.display='none';
    document.getElementById('eu-ok').style.display='none';
    var m = document.getElementById('modal-editar-usuario');
    m.style.display='flex';
  }catch(e){ showToast('Error al cargar usuario: '+e.message,'red'); }
}
function euRolChange(){
  var rol = document.getElementById('eu-rol').value;
  var lg = document.getElementById('eu-local-group');
  if(lg) lg.style.display = rol==='directora_general' ? 'none' : '';
}
function cerrarEditarUsuario(){
  document.getElementById('modal-editar-usuario').style.display='none';
}
async function guardarEditarUsuario(){
  var id      = parseInt(document.getElementById('eu-id').value);
  var nombre  = (document.getElementById('eu-nombre').value||'').trim();
  var dni     = (document.getElementById('eu-dni').value||'').trim().toUpperCase();
  var rol     = document.getElementById('eu-rol').value;
  var localId = rol==='directora_general' ? null : parseInt(document.getElementById('eu-local').value);
  var activo  = document.getElementById('eu-activo').value==='1';
  var pass    = (document.getElementById('eu-pass').value||'').trim();
  var ss      = (document.getElementById('eu-ss').value||'').trim();
  var tel     = (document.getElementById('eu-telefono').value||'').trim();
  var email   = (document.getElementById('eu-email').value||'').trim();
  var dir     = (document.getElementById('eu-direccion').value||'').trim();
  var errEl   = document.getElementById('eu-error');
  var okEl    = document.getElementById('eu-ok');
  errEl.style.display='none'; okEl.style.display='none';
  if(!nombre||!dni){ errEl.textContent='Nombre y DNI son obligatorios'; errEl.style.display='block'; return; }
  var datos = { nombre:nombre, dni:dni, rol:rol, local_id:localId, activo:activo, nss:ss, telefono:tel, email:email, direccion:dir };
  if(pass){ datos.password_hash = await hashPass(pass); }
  try{
    await sbPatch('usuarios', id, datos);
    // Dual-write: también actualizar empleados mientras completamos la migración
    if(_euEmpleadoId){
      var empPatch = { nombre:nombre, telefono:tel||null, email:email||null, direccion:dir||null, nss:ss||null };
      if(pass){ empPatch.password_hash = datos.password_hash; empPatch.dni = dni; }
      try{ await sbPatch('empleados', _euEmpleadoId, empPatch); }catch(e2){ console.warn('[dual-write empleados]', e2.message); }
    }
    logAccion('EDITAR_USUARIO', nombre+' · DNI: '+dni, localId||null);
    okEl.textContent = '✓ Cambios guardados';
    okEl.style.display = 'block';
    setTimeout(function(){ cerrarEditarUsuario(); cargarUsuarios(); }, 1000);
  }catch(e){ errEl.textContent='Error: '+e.message; errEl.style.display='block'; }
}

// ===== EDITAR / ELIMINAR EMPLEADO SIN USUARIO =====
async function abrirEditarEmpleado(id){
  try{
    var rows = await sbGet('empleados','id=eq.'+id);
    if(!rows||!rows.length){ showToast('Empleado no encontrado','red'); return; }
    var e = rows[0];
    document.getElementById('ee-id').value = e.id;
    document.getElementById('ee-nombre').value = e.nombre||'';
    document.getElementById('ee-telefono').value = e.telefono||'';
    document.getElementById('ee-local').value = e.local_id||1;
    // Rebuild turno select dynamically from turnosConfig
    var eeTurno = document.getElementById('ee-turno');
    if(turnosConfig.length){
      eeTurno.innerHTML = turnosConfig.map(function(tc){
        var sel = (e.turno_habitual===tc.id)?' selected':'';
        return '<option value="'+tc.id+'"'+sel+'>'+tc.emoji+' '+tc.nome+' '+tc.ini+'–'+tc.fin+'</option>';
      }).join('');
    } else {
      eeTurno.value = e.turno_habitual||'manana';
    }
    document.getElementById('ee-activo').value = e.activo===false ? '0' : '1';
    document.getElementById('ee-error').style.display='none';
    document.getElementById('ee-ok').style.display='none';
    document.getElementById('modal-editar-empleado').style.display='flex';
  }catch(ex){ showToast('Error: '+ex.message,'red'); }
}
function cerrarEditarEmpleado(){
  document.getElementById('modal-editar-empleado').style.display='none';
}
async function guardarEditarEmpleado(){
  var id     = parseInt(document.getElementById('ee-id').value);
  var nombre = (document.getElementById('ee-nombre').value||'').trim().toUpperCase();
  var tel    = (document.getElementById('ee-telefono').value||'').trim();
  var local  = parseInt(document.getElementById('ee-local').value);
  var turno  = document.getElementById('ee-turno').value;
  var activo = document.getElementById('ee-activo').value==='1';
  var errEl  = document.getElementById('ee-error');
  var okEl   = document.getElementById('ee-ok');
  errEl.style.display='none'; okEl.style.display='none';
  if(!nombre){ errEl.textContent='El nombre es obligatorio'; errEl.style.display='block'; return; }
  try{
    await sbPatch('empleados', id, { nombre:nombre, telefono:tel||null, local_id:local, turno_habitual:turno, activo:activo });
    okEl.textContent='✓ Datos guardados'; okEl.style.display='block';
    setTimeout(function(){ cerrarEditarEmpleado(); cargarUsuarios(); }, 1000);
  }catch(e){ errEl.textContent='Error: '+e.message; errEl.style.display='block'; }
}
async function _borrarEmpleadoConDependientes(empId, nombre){
  // Borrar registros dependientes primero para evitar 409
  try{ await sbDelete('turnos_cuadrante','empleado_id=eq.'+empId); }catch(_){}
  try{ await sbDelete('salarios','empleado_id=eq.'+empId); }catch(_){}
  try{
    await sbDelete('empleados','id=eq.'+empId);
  }catch(e){
    // Si sigue fallando por FK, soft-delete
    await sbPatch('empleados', empId, {activo: false});
    throw new Error('No se pudo eliminar definitivamente, marcado como inactivo');
  }
}

async function eliminarEmpleadoSinUser(id, nombre){
  if(!confirm('¿ELIMINAR DEFINITIVAMENTE a '+nombre+'? Esta acción no se puede deshacer.')) return;
  try{
    await _borrarEmpleadoConDependientes(id, nombre);
    showToast(nombre+' eliminado','red');
    cargarUsuarios();
  }catch(e){ showToast(e.message,'orange'); cargarUsuarios(); }
}

async function eliminarUsuario(id, nombre){
  var PROTEGIDOS = ['LORENA','MIRIAM','MIRYAM'];
  if(PROTEGIDOS.indexOf((nombre||'').toUpperCase().trim()) >= 0){
    showToast('Este usuario está protegido y no puede eliminarse', 'red');
    return;
  }
  if(!confirm('¿ELIMINAR DEFINITIVAMENTE al usuario '+nombre+'? Se borrará de usuarios y empleados.')) return;
  try{
    await sbDelete('usuarios','id=eq.'+id);
    // También borrar de empleados si existe
    try{
      var empRows = await sbGet('empleados','nombre=eq.'+encodeURIComponent(nombre));
      for(var i=0;i<(empRows||[]).length;i++){
        await _borrarEmpleadoConDependientes(empRows[i].id, nombre);
      }
    }catch(_){}
    showToast(nombre+' eliminado','red');
    cargarUsuarios();
  }catch(e){ showToast('Error al eliminar: '+e.message,'red'); }
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
      manana:     {bg:'#d4f5d4', color:'#145214', border:'#7ec87e'},
      manana2:    {bg:'#ddf8e4', color:'#1a6030', border:'#8ed898'},
      tarde:      {bg:'#fff0d4', color:'#7a4500', border:'#d4a050'},
      noche:      {bg:'#d4e8f8', color:'#1a3d6a', border:'#6a9bc0'},
      noche2:     {bg:'#c8daf5', color:'#0a2458', border:'#5070c0'},
      intermedio: {bg:'#ead4f5', color:'#541a7a', border:'#a06abf'},
      partido:    {bg:'#ffe8c8', color:'#7a3800', border:'#d4905a'},
      seguido1:   {bg:'#c8f5ee', color:'#0a5a50', border:'#5abfb0'},
      seguido2:   {bg:'#c8f5e0', color:'#0a5a30', border:'#5abf80'},
      seguido3:   {bg:'#b0ffe8', color:'#004838', border:'#30a880'},
      intermedio3:{bg:'#ddd4f5', color:'#3a1060', border:'#8060c0'},
      fiesta:     {bg:'#f5d4d4', color:'#7a1a1a', border:'#d47a7a'},
      mediafiesta:{bg:'#f5d4d4', color:'#7a1a1a', border:'#d47a7a'}
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
    html += '<div style="background:#f0f4f0;border:1px solid #cccccc;border-radius:12px;padding:14px 16px;margin-bottom:16px">';
    html += '<div style="font-size:20px;font-weight:800;color:#145214;margin-bottom:4px">📅 '+cuad.semana_label+'</div>';
    html += '<div style="font-size:13px;color:#555555">📍 '+localNombre+' · '+emps.length+' empleados</div>';
    html += '</div>';

    // Tarjeta por empleado — formato móvil
    emps.forEach(function(emp, idx){
      var color = COLORS_VP[idx%COLORS_VP.length];
      var tMap  = turnoMap[emp.id]||{};
      var init  = (emp.nombre||'?').substring(0,2).toUpperCase();
      var totalDias = 0;

      html += '<div style="background:#ffffff;border:1px solid #cccccc;border-radius:12px;padding:12px 14px;margin-bottom:10px">';
      // Nombre empleado
      html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">';
      html += '<div style="width:30px;height:30px;border-radius:50%;background:'+color+'20;color:'+color+';display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;flex-shrink:0">'+init+'</div>';
      html += '<div style="font-weight:700;font-size:14px;color:#111111">'+emp.nombre+'</div>';
      html += '<div style="font-size:10px;color:#666666;margin-left:auto">'+emp.rol+'</div>';
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
        html += '<div style="font-size:8px;font-weight:700;color:#555555;margin-bottom:2px">'+DIAS_C[d]+'</div>';
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
      html += '<div style="margin-top:8px;font-size:10px;color:#666666;text-align:right">'+totalDias+' días trabajados</div>';
      html += '</div>';
    });

    // Leyenda
    html += '<div style="margin-top:6px;padding:12px;background:#f0f4f0;border-radius:10px;border:1px solid #cccccc">';
    html += '<div style="font-size:10px;font-weight:700;color:#555555;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px">Leyenda</div>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:6px">';
    var leg=[
      {t:'Mañana',    c:'#145214',b:'#d4f5d4'},
      {t:'Tarde',     c:'#7a4500',b:'#fff0d4'},
      {t:'Noche',     c:'#1a3d6a',b:'#d4e8f8'},
      {t:'Intermedio',c:'#541a7a',b:'#ead4f5'},
      {t:'Partido',   c:'#7a3800',b:'#ffe8c8'},
      {t:'🏖 Fiesta', c:'#7a1a1a',b:'#f5d4d4'}
    ];
    leg.forEach(function(x){
      html+='<span style="font-size:10px;padding:3px 9px;border-radius:12px;background:'+x.b+';color:'+x.c+';border:1px solid '+x.c+'40">'+x.t+'</span>';
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
  var lacala  = (document.getElementById('cfg-wa-lacala') ||{}).value || '';
  var rotos   = (document.getElementById('cfg-wa-rotos')  ||{}).value || '';
  var lorena  = (document.getElementById('cfg-wa-lorena') ||{}).value || '';
  localStorage.setItem('rt_wa_lacala', lacala.replace(/\s+/g,''));
  localStorage.setItem('rt_wa_rotos',  rotos.replace(/\s+/g,''));
  localStorage.setItem('rt_wa_lorena', lorena.replace(/\s+/g,''));
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
  var waLorena = localStorage.getItem('rt_wa_lorena');
  if(ss){ SS_EMPRESA = parseFloat(ss)/100; }
  if(div){ DIVISOR_CUSTOM = parseFloat(div); }
  var elSS=document.getElementById('cfg-ss'); if(elSS&&ss) elSS.value=ss;
  var elDiv=document.getElementById('cfg-divisor'); if(elDiv&&div) elDiv.value=div;
  var elWaL=document.getElementById('cfg-wa-lacala'); if(elWaL&&waLacala) elWaL.value=waLacala;
  var elWaR=document.getElementById('cfg-wa-rotos'); if(elWaR&&waRotos) elWaR.value=waRotos;
  var elWaLor=document.getElementById('cfg-wa-lorena'); if(elWaLor&&waLorena) elWaLor.value=waLorena;
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
    turno_m_label:'Mañana', turno_m2_label:'Mañana 2', turno_n_label:'Noche', turno_n2_label:'Noche 2', turno_t_label:'Tarde', turno_t2_label:'Tarde 2',
    turno_i_label:'Intermedio', turno_i2_label:'Intermedio 2', turno_i3_label:'Intermedio 3', turno_s1_label:'Seguido 1', turno_s2_label:'Seguido 2', turno_s3_label:'Seguido 3', turno_p_label:'Partido', turno_mf_label:'½ Media fiesta',
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
    turno_m_label:'Matí', turno_m2_label:'Matí 2', turno_n_label:'Nit', turno_n2_label:'Nit 2', turno_t_label:'Tarda', turno_t2_label:'Tarda 2',
    turno_i_label:'Intermedi', turno_i2_label:'Intermedi 2', turno_i3_label:'Intermedi 3', turno_s1_label:'Seguit 1', turno_s2_label:'Seguit 2', turno_s3_label:'Seguit 3', turno_p_label:'Partit', turno_mf_label:'½ Mitja festa',
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
    turno_m_label:'Morning', turno_m2_label:'Morning 2', turno_n_label:'Night', turno_n2_label:'Night 2', turno_t_label:'Afternoon', turno_t2_label:'Afternoon 2',
    turno_i_label:'Split', turno_i2_label:'Split 2', turno_i3_label:'Split 3', turno_s1_label:'Straight 1', turno_s2_label:'Straight 2', turno_s3_label:'Straight 3', turno_p_label:'Split shift', turno_mf_label:'½ Half day off',
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
    document.body.style.background='#ffffff';
    document.body.style.margin='0';
    document.body.style.minHeight='100vh';
    var vp = document.getElementById('vista-publica');
    if(vp){ vp.style.background='#ffffff'; vp.style.color='#111111'; }
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
  // Si la URL tiene ?inv=cocina, ir directo a Inventario Cocina
  var urlParams = new URLSearchParams(window.location.search);
  var invParam = urlParams.get('inv');
  if(invParam === 'cocina'){
    goStep(18);
    return;
  }
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
var CLAUDE_MODEL = 'claude-sonnet-4-5';

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

var iaEstado = { cat: null, opcionIdx: null, promtBase: '', catKey: '', canal: null, imagen: null };

function initAsistenteIA(){
  iaEstado = { cat: null, opcionIdx: null, promtBase: '', catKey: '', canal: null, imagen: null };
  document.getElementById('ia-paso1').style.display = '';
  var canalEl = document.getElementById('ia-paso-canal');
  if(canalEl) canalEl.style.display = 'none';
  document.getElementById('ia-paso2').style.display = 'none';
  document.getElementById('ia-paso3').style.display = 'none';
  document.getElementById('ia-respuesta').style.display = 'none';
  document.getElementById('ia-loading').style.display = 'none';
  var preview = document.getElementById('ia-imagen-preview');
  if(preview) preview.style.display = 'none';
  var fi = document.getElementById('ia-file-input');
  if(fi) fi.value = '';
}

function iaSelCat(catKey){
  console.log('[IA] iaSelCat:', catKey, '| IA_CATS:', typeof IA_CATS, IA_CATS ? Object.keys(IA_CATS) : 'undefined');
  if(!IA_CATS || !IA_CATS[catKey]){ console.warn('[IA] Categoría no encontrada:', catKey); return; }
  var cat = IA_CATS[catKey];
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
  var _iaKey = getClaudeApiKey();
  console.log('[IA] API key state:', _iaKey ? 'ok ('+_iaKey.substring(0,12)+'...)' : 'NOT SET');
  if(!apiKeyValida(_iaKey)){
    showToast('⚠️ Configura tu clave API de Claude para usar el asistente', 'red');
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

  // System prompt según canal
  var systemPrompt;
  if(iaEstado.canal === 'whatsapp'){
    systemPrompt = 'Eres Lorena, directora del restaurante La Cala en Barcelona. Responde SIEMPRE en primera persona, como si fueras tú quien escribe. Tono cercano y natural, como un mensaje entre compañeros. SIN asteriscos, SIN markdown, SIN tablas, SIN headers con #. Frases cortas. Máximo 6-8 líneas en total. Firma siempre: Lorena';
  } else if(iaEstado.canal === 'email'){
    systemPrompt = 'Eres Lorena, directora del restaurante La Cala en Barcelona. Responde SIEMPRE en primera persona. Tono humano y directo, sin tecnicismos ni lenguaje legal. SIN markdown, SIN tablas, SIN headers con #. Máximo 15 líneas. Estructura: situación + qué se necesita + gracias. Firma: Lorena, Directora, La Cala';
  } else {
    systemPrompt = 'Eres el asistente de Lorena, directora de restaurante. Da respuestas CORTAS y PRÁCTICAS, máximo 8 líneas, sin markdown, sin tecnicismos, en lenguaje cotidiano';
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
        messages: [{ role: 'user', content: iaEstado.imagen
          ? [{ type:'image', source:{ type:'base64', media_type:iaEstado.imagen.mediaType, data:iaEstado.imagen.base64 }}, { type:'text', text:msgFinal }]
          : msgFinal }]
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
    console.error('[IA] Error en llamada a Claude:', e);
    document.getElementById('ia-loading').style.display = 'none';
    document.getElementById('ia-paso3').style.display = '';
    if(btn){ btn.disabled = false; btn.textContent = '🤖 Consultar a Claude'; }
    showToast('Error IA: ' + e.message, 'red');
  }
}

function iaNuevaConsulta(){
  initAsistenteIA();
}

function iaAdjuntarImagen(){
  var fi = document.getElementById('ia-file-input');
  if(fi) fi.click();
}

function iaImagenSeleccionada(event){
  var file = event.target.files && event.target.files[0];
  if(!file) return;
  if(!file.type.startsWith('image/')){ showToast('Solo se permiten imágenes', 'red'); return; }
  if(file.size > 10 * 1024 * 1024){ showToast('La imagen no puede superar 10MB', 'red'); return; }
  var reader = new FileReader();
  reader.onload = function(e){
    var base64 = e.target.result.split(',')[1];
    iaEstado.imagen = { base64: base64, mediaType: file.type };
    var thumb = document.getElementById('ia-imagen-thumb');
    var preview = document.getElementById('ia-imagen-preview');
    if(thumb) thumb.src = e.target.result;
    if(preview) preview.style.display = 'flex';
  };
  reader.readAsDataURL(file);
}

function iaQuitarImagen(){
  iaEstado.imagen = null;
  var preview = document.getElementById('ia-imagen-preview');
  if(preview) preview.style.display = 'none';
  var fi = document.getElementById('ia-file-input');
  if(fi) fi.value = '';
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
var avEstado = { empleadoNombre: '', empleadoId: null, tipo: '', icono: '', nivel: 0, canal: '', textoGenerado: '' };

var AV_NIVEL_LABELS = { 1: 'Leve (Nivel 1)', 2: 'Moderado (Nivel 2)', 3: 'Grave (Nivel 3)' };
var AV_NIVEL_DESCRIPCIONES = {
  1: 'primer aviso verbal / advertencia informal por escrito',
  2: 'aviso escrito formal / segundo apercibimiento',
  3: 'expediente disciplinario / tercer aviso con posibles consecuencias'
};

function initAvisos(){
  avEstado = { empleadoNombre: '', empleadoId: null, tipo: '', icono: '', nivel: 0, canal: '', textoGenerado: '' };
  avMostrarPaso(1);
  avCargarEmpleados();
  avCargarHistorico();
}

function avMostrarPaso(n){
  [1,2,3].forEach(function(i){
    var el = document.getElementById('av-paso'+i);
    if(el) el.style.display = (i===n) ? '' : 'none';
  });
  var canalEl = document.getElementById('av-paso-canal');
  if(canalEl) canalEl.style.display = (n==='canal') ? '' : 'none';
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
  avEstado.canal = '';
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

function avIrPasoCanal(){
  if(!avEstado.nivel){
    showToast('Selecciona el nivel de gravedad primero', 'red'); return;
  }
  // Actualizar etiqueta de contexto
  var ctx = document.getElementById('av-canal-contexto');
  if(ctx) ctx.textContent = (avEstado.icono||'') + ' ' + avEstado.tipo + ' — ' + (AV_NIVEL_LABELS[avEstado.nivel]||'') + ' — ' + avEstado.empleadoNombre;
  avMostrarPaso('canal');
}

function avSelCanalYGenerar(canal){
  avEstado.canal = canal;
  // Marcar botón seleccionado
  ['email','whatsapp'].forEach(function(c){
    var btn = document.getElementById('av-canal-btn-'+c);
    if(btn) btn.style.outline = (c===canal) ? '3px solid var(--accent)' : 'none';
  });
  setTimeout(function(){ avGenerarAviso(); }, 150);
}

async function avGenerarAviso(){
  var _avKey = getClaudeApiKey();
  console.log('[Avisos IA] API key state:', _avKey ? 'ok ('+_avKey.substring(0,12)+'...)' : 'NOT SET');
  if(!apiKeyValida(_avKey)){
    showToast('⚠️ Configura tu clave API de Claude para generar avisos', 'red');
    mostrarModalApiKey();
    return;
  }
  if(!avEstado.empleadoNombre || !avEstado.tipo || !avEstado.nivel){
    showToast('Completa todos los pasos antes de generar', 'red'); return;
  }
  var nivel = parseInt(avEstado.nivel) || 0;
  if(!AV_NIVEL_LABELS || !AV_NIVEL_LABELS[nivel]){
    showToast('Nivel de aviso no válido: ' + nivel, 'red'); return;
  }

  var descripcion = (document.getElementById('av-descripcion').value || '').trim();
  var localNombre = '';
  if(currentUser && currentUser.local_id){
    localNombre = ({1:'Restaurante La Cala', 2:"Roto's Burguer"})[currentUser.local_id] || 'el restaurante';
  } else {
    localNombre = 'el restaurante';
  }

  var nivelLabel = AV_NIVEL_LABELS[nivel] || 'Aviso';
  var nivelDesc  = (AV_NIVEL_DESCRIPCIONES && AV_NIVEL_DESCRIPCIONES[nivel]) ? AV_NIVEL_DESCRIPCIONES[nivel] : nivelLabel;
  var fecha = new Date().toLocaleDateString('es-ES', {day:'2-digit', month:'long', year:'numeric'});
  var canal = avEstado.canal || 'email';

  var systemPrompt, prompt;

  if(canal === 'whatsapp'){
    systemPrompt = 'Eres Lorena, directora del restaurante La Cala en Barcelona. Responde SIEMPRE en primera persona, como si fueras tú quien escribe. Tono cercano y natural, como un mensaje entre compañeros. SIN asteriscos, SIN markdown, SIN tablas, SIN headers con #. Frases cortas. Máximo 6-8 líneas en total. Firma siempre: Lorena';
    prompt = 'Escríbele un WhatsApp a ' + avEstado.empleadoNombre
      + ' sobre lo siguiente: ' + avEstado.tipo + '.\n'
      + 'Nivel de gravedad: ' + nivelLabel + '.\n'
      + (descripcion ? 'Detalles: ' + descripcion + '.\n' : '')
      + 'Fecha: ' + fecha + '.\n'
      + 'Recuerda: sin markdown, máximo 5-6 líneas, firma "Lorena" al final.';
  } else {
    systemPrompt = 'Eres Lorena, directora del restaurante La Cala en Barcelona. Responde SIEMPRE en primera persona. Tono humano y directo, sin tecnicismos ni lenguaje legal. SIN markdown, SIN tablas, SIN headers con #. Máximo 15 líneas. Estructura: situación + qué se necesita + gracias. Firma: Lorena, Directora, La Cala';
    prompt = 'Escríbele un email de aviso a ' + avEstado.empleadoNombre
      + ' sobre: ' + avEstado.tipo + '.\n'
      + 'Nivel: ' + nivelLabel + ' (' + nivelDesc + ').\n'
      + (descripcion ? 'Detalles: ' + descripcion + '.\n' : '')
      + 'Fecha: ' + fecha + '.\n'
      + 'Recuerda: tono humano, sin legalismo, estructura en tres partes, media página máximo.';
  }

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
    console.error('[Avisos IA] Error en llamada a Claude:', e);
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
    + '<p style="margin-top:30px;font-size:11px;color:#888">Generado con RelojTurnos v7.70 · Grupo El Reloj · '
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

  var localId = currentUser ? currentUser.local_id : (window.localActivoId || null);
  var registro = {
    empleado: avEstado.empleadoNombre,
    tipo:     avEstado.tipo,
    nivel:    String(avEstado.nivel),
    texto:    txt,
    local_id: localId
  };

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
  avEstado = { empleadoNombre: '', empleadoId: null, tipo: '', icono: '', nivel: 0, canal: '', textoGenerado: '' };
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
    var lid = (currentUser && currentUser.local_id) || window.localActivoId;
    if(lid) filtros = 'local_id=eq.' + lid + '&' + filtros;
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
      var fecha = r.created_at ? r.created_at.split('T')[0] : '—';
      var preview = (r.texto || '').substring(0, 120).replace(/\n/g,' ') + '...';
      return '<div style="border:1px solid var(--border);border-radius:9px;padding:12px 14px;margin-bottom:8px;background:var(--darker)">'
        + '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap">'
        + '<span style="font-weight:700;font-size:14px;color:var(--text)">' + (r.empleado||'—') + '</span>'
        + '<span style="font-size:11px;padding:2px 8px;border-radius:10px;font-weight:700;background:'+col+'20;color:'+col+'">'+niv+'</span>'
        + '<span style="font-size:11px;color:var(--muted)">'+(r.tipo||'')+'</span>'
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
  { texto: 'Limpiar la barra y zona de trabajo',            grupo: 'Barra',   tipo: 'check' },
  { texto: 'Revisar stock de bebidas y comunicar roturas',  grupo: 'Barra',   tipo: 'check' },
  { texto: 'Temperatura cámara frigorífica de barra',       grupo: 'Barra',   tipo: 'temperatura' },
  { texto: 'Estado del equipo de barra (cafetera, etc.)',   grupo: 'Barra',   tipo: 'equipo' },
  // SALA
  { texto: 'Revisar y limpiar todas las mesas y sillas',    grupo: 'Sala',    tipo: 'check' },
  { texto: 'Reponer servilletas, palilleros y salsas',      grupo: 'Sala',    tipo: 'check' },
  { texto: 'Barrer y fregar el suelo de sala y terraza',    grupo: 'Sala',    tipo: 'check' },
  { texto: 'Limpiar cristales y espejos de la entrada',     grupo: 'Sala',    tipo: 'check' },
  { texto: 'Comprobar y limpiar baños (papel, jabón)',      grupo: 'Sala',    tipo: 'check' },
  { texto: 'Montar mise en place para el servicio',         grupo: 'Sala',    tipo: 'check' },
  { texto: 'Comprobar funcionamiento de TPV y caja',        grupo: 'Sala',    tipo: 'check' },
  // COCINA
  { texto: 'Temperatura cámara frigorífica de cocina',      grupo: 'Cocina',  tipo: 'temperatura' },
  { texto: 'Estado del equipo de cocina (horno, freidora)', grupo: 'Cocina',  tipo: 'equipo' },
  { texto: 'Vaciar papeleras y gestionar residuos',         grupo: 'Cocina',  tipo: 'check' },

  // ALMACÉN
  { texto: 'Revisar stock y anotar roturas de almacén',     grupo: 'Almacen', tipo: 'check' },
  { texto: 'Orden y limpieza del almacén',                  grupo: 'Almacen', tipo: 'check' },
  { texto: 'Verificar fechas de caducidad',                 grupo: 'Almacen', tipo: 'check' },
  { texto: 'Recepción y ubicación de mercancía',            grupo: 'Almacen', tipo: 'check' }
];

// Estado en memoria
var clTareasHoy = [];
var clFechaActual = '';
var clResponsablesGrupo = { Barra:'', Sala:'', Cocina:'', Almacen:'' };
var clListaEmpleados = [];
var clGuardandoNota = false;

async function clCargarEmpleados(){
  clListaEmpleados = [];
  try{
    var localId = currentUser ? currentUser.local_id : null;
    if(localId){
      var rows = await sbGet('empleados','local_id=eq.'+localId+'&activo=eq.true&order=nombre.asc');
      clListaEmpleados = rows.map(function(e){ return e.nombre; });
    }
  }catch(e){}
  if(!clListaEmpleados.length && empleados.length){
    clListaEmpleados = empleados.map(function(e){ return e.nombre; });
  }
  if(!clListaEmpleados.length){
    clListaEmpleados = ['MARILYN','SONNY','ALEX','IRENE','ZEUS','CONNY','SANTIAGO','LENY'];
  }
}

function initChecklist(){
  var fechaEl = document.getElementById('cl-fecha');
  if(fechaEl && !fechaEl.value){
    fechaEl.value = new Date().toISOString().split('T')[0];
  }
  clCargarEmpleados().then(function(){ clCargarDia(); });
}

function clFechaISO(){
  var el = document.getElementById('cl-fecha');
  return el ? el.value : new Date().toISOString().split('T')[0];
}

function clSetResponsableGrupo(grupo, nombre){
  clResponsablesGrupo[grupo] = nombre;
  clTareasHoy.forEach(function(t){
    if(t.grupo === grupo){
      t.responsable = nombre;
      if(t.id) sbPatch('checklist_diario', t.id, {responsable: nombre}).catch(function(){});
    }
  });
}

async function clCargarDia(){
  var fecha = clFechaISO();
  clFechaActual = fecha;
  clResponsablesGrupo = { Barra:'', Sala:'', Cocina:'', Almacen:'' };

  var loadEl = document.getElementById('cl-cargando');
  if(loadEl) loadEl.style.display = '';

  var tareasGuardadas = null;
  var sbError = null;
  try{
    var localId = currentUser ? currentUser.local_id : null;
    var filtros = 'fecha=eq.'+fecha+'&order=posicion.asc';
    if(localId) filtros += '&or=(local_id.eq.'+localId+',local_id.is.null)';
    var rows = await sbGet('checklist_diario', filtros);
    if(rows && rows.length) tareasGuardadas = rows;
  }catch(e){
    sbError = e;
    console.error('[Checklist] Supabase error:', e.message);
  }

  if(sbError){
    var errMsg = sbError.message || '';
    var tablaFalta = errMsg.includes('does not exist') || errMsg.includes('42P01') || errMsg.includes('relation');
    if(tablaFalta){
      var crearSQL = 'CREATE TABLE IF NOT EXISTS public.checklist_diario (\n'
        +'  id bigserial primary key,\n'
        +'  fecha date not null,\n'
        +'  tarea text,\n'
        +'  completada boolean default false,\n'
        +'  hora_completado text,\n'
        +'  responsable text,\n'
        +'  posicion int,\n'
        +'  extra boolean default false,\n'
        +'  local_id int,\n'
        +'  nota_dia text,\n'
        +'  grupo text,\n'
        +'  tipo text default \'check\',\n'
        +'  valor_extra text,\n'
        +'  nota_incidencia text\n'
        +');';
      var cont2 = document.getElementById('cl-tareas-lista');
      if(cont2) cont2.innerHTML =
        '<div style="background:var(--darker);border:1px solid var(--red);border-radius:10px;padding:16px">'
        +'<div style="color:var(--red);font-weight:700;margin-bottom:8px">⚠️ Tabla checklist_diario no existe en Supabase</div>'
        +'<div style="font-size:12px;color:var(--muted);margin-bottom:8px">Ejecuta este SQL en Supabase → SQL Editor → New query:</div>'
        +'<pre style="background:var(--dark);border-radius:6px;padding:10px;font-size:11px;color:#2ecc71;overflow-x:auto;white-space:pre-wrap">'+crearSQL+'</pre>'
        +'<div style="font-size:11px;color:var(--muted);margin-top:8px">Error exacto: '+errMsg+'</div>'
        +'</div>';
      if(loadEl) loadEl.style.display = 'none';
      return;
    }
    showToast('Error BD: ' + errMsg, 'red');
  }

  try{
    if(!Array.isArray(CL_TAREAS_BASE)) CL_TAREAS_BASE = [];
    if(tareasGuardadas && Array.isArray(tareasGuardadas) && tareasGuardadas.length){
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
          notaIncidencia: r.nota_incidencia || '',
          extra:          !!r.extra,
          posicion:       r.posicion || 0,
          responsable:    r.responsable || ''
        };
      });
      // Restaurar responsable por grupo desde las tareas guardadas
      clTareasHoy.forEach(function(t){
        if(t.responsable && clResponsablesGrupo.hasOwnProperty(t.grupo) && !clResponsablesGrupo[t.grupo]){
          clResponsablesGrupo[t.grupo] = t.responsable;
        }
      });
      var notaEl = document.getElementById('cl-nota-dia');
      if(notaEl && tareasGuardadas[0] && tareasGuardadas[0].nota_dia){
        notaEl.value = tareasGuardadas[0].nota_dia || '';
      }
    } else {
      clTareasHoy = CL_TAREAS_BASE.map(function(tarea, i){
        return { id:null, texto:tarea.texto, grupo:tarea.grupo, tipo:tarea.tipo,
                 hecha:false, hora_completado:'', valorExtra:'', notaIncidencia:'',
                 extra:false, posicion:i, responsable:'' };
      });
      var notaEl = document.getElementById('cl-nota-dia');
      if(notaEl) notaEl.value = '';
    }
    clRenderTareas();
    if(loadEl) loadEl.style.display = 'none';
    showToast('✓ Actualizado', 'green');
  }catch(e){
    console.error('[Checklist] Error al cargar tareas:', e);
    var cont = document.getElementById('cl-tareas-lista');
    if(cont) cont.innerHTML = '<div style="color:var(--red);padding:16px;text-align:center">⚠️ Error al cargar el checklist: '+e.message+'</div>';
    if(loadEl) loadEl.style.display = 'none';
  }
}

function clRenderTareas(){
  var cont = document.getElementById('cl-tareas-lista');
  if(!cont) return;
  if(!Array.isArray(clTareasHoy)) clTareasHoy = [];

  cont.innerHTML = '';
  var hechas = clTareasHoy.filter(function(t){ return t.hecha; }).length;
  var total  = clTareasHoy.length;

  var GRUPOS       = ['Barra', 'Sala', 'Cocina', 'Almacen'];
  var GRUPO_ICONS  = { Barra:'🍹', Sala:'🪑', Cocina:'👨‍🍳', Almacen:'📦' };
  var GRUPO_LABELS = { Barra:'Barra', Sala:'Sala', Cocina:'Cocina', Almacen:'Almacén' };

  GRUPOS.forEach(function(grupo){
    var grupoTareas = clTareasHoy.filter(function(t){ return t.grupo === grupo || (!t.grupo && grupo === 'Sala'); });

    var section = document.createElement('div');
    section.style.cssText = 'background:var(--darker);border:1px solid var(--border);border-radius:10px;padding:12px 14px;margin-bottom:14px';

    // Header con selector de responsable
    var optsHtml = '<option value="">— Sin asignar —</option>';
    clListaEmpleados.forEach(function(n){
      optsHtml += '<option value="'+n+'"'+(clResponsablesGrupo[grupo]===n?' selected':'')+'>'+n+'</option>';
    });
    var header = document.createElement('div');
    header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--border)';
    header.innerHTML =
      '<div style="font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:1px">'+(GRUPO_ICONS[grupo]||'')+' '+(GRUPO_LABELS[grupo]||grupo)+'</div>'
      +'<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">'
      +'<span style="font-size:11px;color:var(--muted)">Responsable:</span>'
      +'<select style="background:var(--card);border:1px solid var(--border);border-radius:6px;padding:3px 8px;color:var(--text);font-size:12px;outline:none" onchange="clSetResponsableGrupo(\''+grupo+'\',this.value)">'
      +optsHtml+'</select>'
      +'<button onclick="clEnviarWAGrupo(\''+grupo+'\')" title="Enviar checklist de esta sección por WhatsApp" style="background:none;border:1px solid #25d366;border-radius:6px;color:#25d366;font-size:11px;padding:2px 7px;cursor:pointer;flex-shrink:0">💬 WA</button>'
      +'</div>';
    section.appendChild(header);

    // Tareas
    grupoTareas.forEach(function(tarea){
      var idx = clTareasHoy.indexOf(tarea);
      var div = document.createElement('div');
      div.className = 'cl-tarea-item'+(tarea.hecha?' done':'');

      if(tarea.tipo === 'temperatura'){
        div.innerHTML =
          '<div class="cl-tarea-check '+(tarea.hecha?'checked':'')+'" onclick="clToggleTarea('+idx+')">'+(tarea.hecha?'✓':'')+'</div>'
          +'<div class="cl-tarea-texto" style="flex:1">'+tarea.texto+'</div>'
          +'<div style="display:flex;align-items:center;gap:4px;flex-shrink:0">'
          +'<input type="number" step="0.5" placeholder="°C" value="'+(tarea.valorExtra||'')+'" style="width:64px;background:var(--darker);border:1px solid var(--border);border-radius:6px;padding:4px 6px;color:var(--text);font-size:13px;outline:none" onchange="clSetValorExtra('+idx+',this.value)">'
          +'<span style="font-size:11px;color:var(--muted)">°C</span></div>'
          +'<div class="cl-tarea-hora">'+(tarea.hora_completado||'')+'</div>';
      } else if(tarea.tipo === 'equipo'){
        var esIncidencia = tarea.valorExtra && tarea.valorExtra !== 'ok';
        div.innerHTML =
          '<div class="cl-tarea-check '+(tarea.hecha?'checked':'')+'" onclick="clToggleTarea('+idx+')">'+(tarea.hecha?'✓':'')+'</div>'
          +'<div style="flex:1"><div class="cl-tarea-texto">'+tarea.texto+'</div>'
          +'<div style="display:flex;gap:6px;align-items:center;margin-top:4px;flex-wrap:wrap">'
          +'<select style="background:var(--darker);border:1px solid var(--border);border-radius:6px;padding:3px 8px;color:var(--text);font-size:12px;outline:none" onchange="clSetEquipoEstado('+idx+',this.value)">'
          +'<option value="ok"'+(!tarea.valorExtra||tarea.valorExtra==='ok'?' selected':'')+'>✅ Todo OK</option>'
          +'<option value="incidencia"'+(esIncidencia?' selected':'')+'>⚠ Hay incidencia</option>'
          +'</select>'
          +(esIncidencia?'<input type="text" placeholder="Describe la incidencia..." value="'+(tarea.notaIncidencia||'').replace(/"/g,'&quot;')+'" style="flex:1;min-width:120px;background:var(--darker);border:1px solid var(--red);border-radius:6px;padding:3px 8px;color:var(--text);font-size:12px;outline:none" onchange="clSetNotaIncidencia('+idx+',this.value)">':'')
          +'</div></div>'
          +'<div class="cl-tarea-hora">'+(tarea.hora_completado||'')+'</div>';
      } else if(tarea.tipo === 'inventario'){
        var artCountInv = 0;
        try{ artCountInv = tarea.valorExtra ? Object.keys(JSON.parse(tarea.valorExtra)).length : 0; }catch(e){}
        var invResp = tarea.responsableInventario || '';
        var invOptsHtml = '<option value="">— Responsable —</option>';
        clListaEmpleados.forEach(function(n){
          invOptsHtml += '<option value="'+n+'"'+(invResp===n?' selected':'')+'>'+n+'</option>';
        });
        div.style.flexWrap = 'wrap';
        div.innerHTML =
          '<div class="cl-tarea-check '+(tarea.hecha?'checked':'')+'" onclick="clToggleTarea('+idx+')">'+(tarea.hecha?'✓':'')+'</div>'
          +'<div class="cl-tarea-texto" style="flex:1">'+tarea.texto+(artCountInv?' <span style="font-size:10px;color:var(--green);font-weight:700">'+artCountInv+' artículos</span>':'')+'</div>'
          +'<button onclick="clAbrirModalInventario('+idx+')" style="background:var(--accent);border:none;border-radius:6px;color:#fff;font-size:11px;font-weight:600;padding:4px 12px;cursor:pointer;flex-shrink:0">📋 Inventario</button>'
          +'<div class="cl-tarea-hora">'+(tarea.hora_completado||'')+'</div>'
          +'<div style="width:100%;display:flex;align-items:center;gap:8px;margin-top:6px;padding-left:32px">'
          +'<span style="font-size:11px;color:var(--muted)">Enviar a:</span>'
          +'<select id="inv-resp-'+idx+'" onchange="clInvSetResponsable('+idx+',this.value)" style="flex:1;background:var(--card);border:1px solid var(--border);border-radius:6px;padding:3px 8px;color:var(--text);font-size:12px;outline:none">'+invOptsHtml+'</select>'
          +'<button onclick="clInvEnviarWA('+idx+')" style="background:none;border:1px solid #25d366;border-radius:6px;color:#25d366;font-size:11px;padding:2px 8px;cursor:pointer;white-space:nowrap">💬 WA</button>'
          +'</div>';
      } else {
        div.innerHTML =
          '<div class="cl-tarea-check '+(tarea.hecha?'checked':'')+'" onclick="clToggleTarea('+idx+')">'+(tarea.hecha?'✓':'')+'</div>'
          +'<div class="cl-tarea-texto">'+tarea.texto+(tarea.extra?' <span style="font-size:10px;color:var(--accent);font-weight:700">EXTRA</span>':'')+'</div>'
          +'<div class="cl-tarea-hora">'+(tarea.hora_completado||'')+'</div>';
      }
      section.appendChild(div);
    });

    // Fila añadir tarea
    var addRow = document.createElement('div');
    addRow.style.cssText = 'display:flex;gap:8px;margin-top:10px;align-items:center';
    addRow.innerHTML =
      '<input type="text" id="cl-nueva-'+grupo+'" placeholder="+ Tarea adicional..." style="flex:1;font-size:12px;background:var(--card);border:1px solid var(--border);border-radius:6px;padding:5px 10px;color:var(--text);outline:none">'
      +'<button class="btn btn-ghost btn-sm" style="font-size:11px;flex-shrink:0" onclick="clAnadirTareaGrupo(\''+grupo+'\')">+ Añadir</button>';
    section.appendChild(addRow);
    cont.appendChild(section);
  });

  var pct = total > 0 ? Math.round((hechas/total)*100) : 0;
  var bar = document.getElementById('cl-progreso-bar');
  var txt = document.getElementById('cl-progreso-txt');
  if(bar) bar.style.width = pct+'%';
  if(txt) txt.textContent = hechas+' / '+total;
  clRenderResumen();
}

function clRenderResumen(){
  var cont = document.getElementById('cl-resumen');
  if(!cont) return;
  if(!clTareasHoy.length){ cont.innerHTML = ''; return; }

  var GRUPOS      = ['Barra', 'Sala', 'Cocina', 'Almacen'];
  var GRUPO_ICONS = { Barra:'🍹', Sala:'🪑', Cocina:'👨‍🍳', Almacen:'📦' };
  var GRUPO_LBL   = { Barra:'Barra', Sala:'Sala', Cocina:'Cocina', Almacen:'Almacén' };
  var rowsHtml = '';

  GRUPOS.forEach(function(grupo){
    var tareas = clTareasHoy.filter(function(t){ return t.grupo === grupo; });
    if(!tareas.length) return;
    var resp   = clResponsablesGrupo[grupo] || '—';
    var total  = tareas.length;
    var hechas = tareas.filter(function(t){ return t.hecha; }).length;
    var pct    = total > 0 ? Math.round(hechas/total*100) : 0;
    var horas  = tareas.filter(function(t){ return t.hecha && t.hora_completado; }).map(function(t){ return t.hora_completado; });
    var horaFin = horas.length ? horas.sort().pop() : '';
    var incids  = tareas.filter(function(t){ return t.notaIncidencia; });
    var color   = pct === 100 ? 'var(--green)' : 'var(--accent)';
    rowsHtml +=
      '<div style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:10px 12px;margin-bottom:8px">'
      +'<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;flex-wrap:wrap;gap:4px">'
      +'<div style="font-size:12px;font-weight:700;color:var(--text)">'+(GRUPO_ICONS[grupo]||'')+' '+(GRUPO_LBL[grupo]||grupo)+'</div>'
      +'<div style="font-size:11px;color:var(--muted)">👤 '+resp+'</div>'
      +'</div>'
      +'<div style="display:flex;gap:12px;font-size:12px;flex-wrap:wrap;align-items:center">'
      +'<span style="font-weight:700;color:'+color+'">'+hechas+'/'+total+(pct===100?' ✅':'')+'</span>'
      +(horaFin ? '<span style="color:var(--muted)">⏱ '+horaFin+'</span>' : '')
      +(incids.length ? '<span style="color:var(--red)">⚠ '+incids.length+' incidencia'+(incids.length>1?'s':'')+'</span>' : '')
      +'</div>'
      +'<div style="margin-top:8px;background:var(--border);border-radius:3px;height:4px;overflow:hidden">'
      +'<div style="height:100%;background:'+color+';width:'+pct+'%;border-radius:3px;transition:width .3s"></div>'
      +'</div>'
      +'</div>';
  });

  if(!rowsHtml){ cont.innerHTML = ''; return; }
  cont.innerHTML =
    '<div style="background:var(--darker);border:1px solid var(--border);border-radius:10px;padding:14px;margin-top:4px">'
    +'<div style="font-size:13px;font-weight:700;color:var(--accent);margin-bottom:12px">📊 Resumen del día</div>'
    +rowsHtml
    +'</div>';
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
    responsable:     clResponsablesGrupo[tarea.grupo] || '',
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

async function clAnadirTareaGrupo(grupo){
  var inp = document.getElementById('cl-nueva-'+grupo);
  if(!inp) return;
  var txt = (inp.value || '').trim();
  if(!txt){ showToast('Escribe el nombre de la tarea', 'orange'); return; }

  var nueva = {
    id:             null,
    texto:          txt,
    hecha:          false,
    hora_completado:'',
    extra:          true,
    grupo:          grupo,
    tipo:           'check',
    posicion:       clTareasHoy.length
  };
  clTareasHoy.push(nueva);
  inp.value = '';
  clRenderTareas();

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

// ========== COMPRAS - MÓDULO FACTURAS ==========

function cmpFacturaSeleccionada(input){
  var file = input.files[0];
  if(!file) return;

  var cont = document.getElementById('cmp-facturas-content');
  cont.innerHTML = '<div style="text-align:center;padding:32px;color:var(--muted)">Analizando factura con IA...</div>';

  var reader = new FileReader();
  reader.onload = function(e){
    var base64 = e.target.result.split(',')[1];
    var mediaType = file.type || 'image/jpeg';
    cmpAnalizarFactura(base64, mediaType);
  };
  reader.readAsDataURL(file);
}

async function cmpAnalizarFactura(base64, mediaType){
  var cont = document.getElementById('cmp-facturas-content');
  var apiKey = getClaudeApiKey ? getClaudeApiKey() : localStorage.getItem('rt_claude_key');

  if(!apiKey){
    cont.innerHTML = '<div style="color:var(--red);padding:16px;text-align:center">No hay clave API configurada. Configúrala en Ajustes.</div>';
    return;
  }

  var systemPrompt = 'Analiza la factura y extrae:\n' +
    '1. Del proveedor (quien emite la factura, no el cliente): nombre comercial, CIF/NIF, teléfono, email, dirección completa, persona de contacto. Busca estos datos en el membrete o cabecera de la factura.\n' +
    '2. Los artículos/productos con nombre, cantidad, unidad y precio unitario sin IVA.\n\n' +
    'Responde SOLO con este JSON, comenzando con { y terminando con }:\n' +
    '{"proveedor":{"nombre":"...","cif":"...","telefono":"...","email":"...","direccion":"...","contacto":"..."},' +
    '"articulos":[{"nombre":"...","cantidad":0,"unidad":"...","precio_unitario":0}]}\n' +
    'Si un campo no aparece en la factura, pon null.';

  try{
    var response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 }},
            { type: 'text', text: 'Analiza esta factura y extrae los artículos en el formato JSON especificado.' }
          ]
        }],
        system: systemPrompt
      })
    });

    var data = await response.json();
    if(!response.ok){
      var errMsg = (data.error && data.error.message) ? data.error.message : ('HTTP ' + response.status);
      throw new Error(errMsg);
    }
    var text = data.content && data.content[0] ? data.content[0].text : '';
    if(!text) throw new Error('La IA no devolvió contenido');
    var first = text.indexOf('{');
    var last  = text.lastIndexOf('}');
    if(first === -1 || last === -1){
      console.warn('[cmpAnalizarFactura] texto raw sin JSON:', text);
      throw new Error('La IA no devolvió JSON válido');
    }
    var clean = text.slice(first, last + 1);
    var parsed;
    try{ parsed = JSON.parse(clean); }
    catch(jsonErr){
      console.warn('[cmpAnalizarFactura] fallo JSON.parse. texto raw:', text, '| clean:', clean);
      throw new Error('No se pudo parsear el JSON: ' + jsonErr.message);
    }
    cmpMostrarPreviaFactura(parsed);

  }catch(e){
    cont.innerHTML = '<div style="color:var(--red);padding:16px;text-align:center">Error analizando la factura: '+e.message+'<br><br><button onclick="cmpTab(\'facturas\')" style="background:var(--accent);border:none;border-radius:8px;padding:8px 16px;color:#fff;cursor:pointer">Intentar de nuevo</button></div>';
  }
}

function cmpMostrarPreviaFactura(datos){
  var cont = document.getElementById('cmp-facturas-content');
  if(!datos || !datos.articulos || !datos.articulos.length){
    cont.innerHTML = '<div style="color:var(--red);padding:16px;text-align:center">No se han podido extraer artículos de la factura.</div>';
    return;
  }

  // Compatibilidad: proveedor puede ser string (formato antiguo) u objeto (nuevo)
  var provData = datos.proveedor || {};
  if(typeof provData === 'string') provData = {nombre: provData};
  var provNombre = provData.nombre || 'Desconocido';

  var provMatch = (cmpProveedores||[]).find(function(p){
    return p.nombre.toLowerCase().indexOf(provNombre.toLowerCase().substring(0,6)) >= 0;
  });

  // Líneas de detalle del proveedor (solo las que tienen valor)
  var provInfoParts = [];
  if(provData.cif)       provInfoParts.push('CIF: <strong>'+provData.cif+'</strong>');
  if(provData.telefono)  provInfoParts.push('📞 '+provData.telefono);
  if(provData.email)     provInfoParts.push('✉ '+provData.email);
  if(provData.direccion) provInfoParts.push('📍 '+provData.direccion);
  if(provData.contacto)  provInfoParts.push('👤 '+provData.contacto);
  var provInfoHtml = provInfoParts.length
    ? '<div style="font-size:11px;color:var(--muted);margin-top:4px;display:flex;flex-wrap:wrap;gap:10px">'+provInfoParts.join(' &nbsp;·&nbsp; ')+'</div>'
    : '';

  var familiaOptions = '<option value="">Sin familia</option>'
    + (cmpFamilias||[]).map(function(f){
        return '<option value="'+f.id+'">'+f.emoji+' '+f.nombre+'</option>';
      }).join('');

  var rowsHtml = datos.articulos.map(function(a, i){
    var artMatch = (cmpArticulos||[]).find(function(x){
      return x.nombre.toLowerCase().indexOf(a.nombre.toLowerCase().substring(0,8)) >= 0;
    });
    var esNuevo = !artMatch;
    var badge = esNuevo
      ? '<span style="font-size:10px;background:var(--accent);color:#fff;border-radius:6px;padding:1px 6px;margin-left:6px">NUEVO</span>'
      : '<span style="font-size:10px;background:var(--green);color:#fff;border-radius:6px;padding:1px 6px;margin-left:6px">ACTUALIZAR</span>';

    var familiaCell;
    if(esNuevo){
      familiaCell = '<select id="fac-familia-'+i+'" style="font-size:12px;padding:4px 6px;border:1px solid var(--border);border-radius:6px;background:var(--card);color:var(--text);max-width:120px">'+familiaOptions+'</select>';
    } else {
      var famName = '';
      if(artMatch.familia_id){
        var fam = (cmpFamilias||[]).find(function(f){ return f.id === artMatch.familia_id; });
        if(fam) famName = fam.emoji+' '+fam.nombre;
      }
      familiaCell = '<span style="font-size:12px;color:var(--muted)">'+(famName||'—')+'</span>';
    }

    return '<tr style="border-top:1px solid var(--border)">'
      +'<td style="padding:8px 6px;font-size:13px;color:var(--text)">'+a.nombre+badge+'</td>'
      +'<td style="padding:8px 6px;text-align:center;font-size:13px;color:var(--muted)">'+a.cantidad+'</td>'
      +'<td style="padding:8px 6px;text-align:center;font-size:13px;color:var(--muted)">'+a.unidad+'</td>'
      +'<td style="padding:8px 6px;text-align:right;font-size:13px;font-weight:700;color:var(--accent)">'+parseFloat(a.precio_unitario).toFixed(2)+' €</td>'
      +'<td style="padding:8px 6px">'+familiaCell+'</td>'
      +'<td style="padding:8px 6px;text-align:center">'
      +'<input type="checkbox" id="fac-check-'+i+'" checked style="width:16px;height:16px;cursor:pointer">'
      +'</td>'
      +'</tr>';
  }).join('');

  // Guardar datos en referencias estables antes de renderizar
  cont._facturaData = datos;
  window._cmpFacturaDatos = datos;

  cont.innerHTML =
    '<div style="margin-bottom:16px">'
    +'<div style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:4px">🧾 Factura analizada</div>'
    +'<div style="font-size:12px;color:var(--muted)">Proveedor: <strong style="color:var(--text)">'+provNombre+'</strong>'+(provMatch?' ✓':' <span style="color:var(--accent)">(se creará nuevo proveedor)</span>')+'</div>'
    +provInfoHtml
    +'</div>'
    +'<table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px">'
    +'<thead><tr style="color:var(--muted);font-size:11px;text-transform:uppercase">'
    +'<th style="padding:8px 6px;text-align:left">Artículo</th>'
    +'<th style="padding:8px 6px;text-align:center">Cantidad</th>'
    +'<th style="padding:8px 6px;text-align:center">Unidad</th>'
    +'<th style="padding:8px 6px;text-align:right">Precio</th>'
    +'<th style="padding:8px 6px">Familia</th>'
    +'<th style="padding:8px 6px;text-align:center">✓</th>'
    +'</tr></thead>'
    +'<tbody>'+rowsHtml+'</tbody>'
    +'</table>'
    +'<div style="font-size:11px;color:var(--muted);margin-bottom:12px">Desmarca los artículos que no quieras actualizar. Los marcados como NUEVO se añadirán a la BD.</div>'
    +'<div style="display:flex;gap:10px;flex-wrap:wrap">'
    +'<button onclick="cmpTab(\'facturas\')" style="background:none;border:1px solid var(--border);border-radius:8px;padding:10px 18px;color:var(--muted);cursor:pointer;font-size:13px">Cancelar</button>'
    +'<button onclick="cmpAceptarFactura()" style="background:var(--accent);border:none;border-radius:8px;padding:10px 20px;color:#fff;font-size:13px;font-weight:700;cursor:pointer">✅ Aceptar y guardar</button>'
    +'</div>';
}

async function cmpAceptarFactura(datosArg, provNombreArg){
  var cont = document.getElementById('cmp-facturas-content');
  // Lee de argumentos (formato antiguo inline) o de referencia estable (nuevo formato)
  var datos = datosArg || cont._facturaData || window._cmpFacturaDatos || null;
  if(typeof datos === 'string') try{ datos = JSON.parse(datos.replace(/'/g,'"')); }catch(e){}
  if(!datos || !datos.articulos){ showToast('Error: no hay datos de factura', 'red'); return; }

  // Compatibilidad: proveedor puede ser string u objeto
  var provData = datos.proveedor || {};
  if(typeof provData === 'string') provData = {nombre: provData};
  var provNombre = (typeof provNombreArg === 'string' && provNombreArg) ? provNombreArg : (provData.nombre || 'Desconocido');

  var articulosDatos = datos.articulos || [];

  // Leer checkboxes y familia selects ANTES de sobreescribir el DOM
  var seleccionados = articulosDatos.reduce(function(acc, a, i){
    var cb = document.getElementById('fac-check-'+i);
    if(cb ? cb.checked : true){
      var famSel = document.getElementById('fac-familia-'+i);
      acc.push(Object.assign({}, a, {
        _origIdx: i,
        _familiaId: famSel ? (parseInt(famSel.value)||null) : null
      }));
    }
    return acc;
  }, []);

  console.log('[cmpAceptarFactura] artículos seleccionados:', seleccionados.length, seleccionados.map(function(a){ return a.nombre; }));

  if(!seleccionados.length){ showToast('No hay artículos seleccionados.','orange'); return; }

  cont.innerHTML = '<div style="text-align:center;padding:32px;color:var(--muted)">Guardando cambios...</div>';

  var localId = currentUser ? (currentUser.local_id||1) : 1;
  var provId = null;
  var provMatch = (cmpProveedores||[]).find(function(p){
    return p.nombre.toLowerCase().indexOf(provNombre.toLowerCase().substring(0,6)) >= 0;
  });
  console.log('[Facturas] provNombre:', provNombre, 'provMatch:', provMatch);
  if(provMatch){
    provId = provMatch.id;
    console.log('[cmpAceptarFactura] proveedor encontrado en BD: id='+provId+' nombre='+provMatch.nombre);
  } else if(provNombre && provNombre !== 'Desconocido'){
    console.log('[Facturas] Creando proveedor:', provNombre);
    console.log('[cmpAceptarFactura] proveedor NO encontrado, intentando insertar en Supabase:', provNombre);
    try{
      var provRows = await sbPost('cmp_proveedores', {
        nombre:      provNombre,
        razon_social: provNombre,
        cif:         provData.cif      || null,
        telefono:    provData.telefono || null,
        email:       provData.email    || null,
        contacto:    provData.contacto || null,
        direccion:   provData.direccion|| null,
        local_id:    localId
      });
      console.log('[Facturas] Proveedor creado:', provRows);
      console.log('[cmpAceptarFactura] sbPost proveedor resultado:', provRows);
      var newProv = Array.isArray(provRows) ? provRows[0] : provRows;
      if(newProv && newProv.id){
        provId = newProv.id;
        cmpProveedores.push(newProv);
        localStorage.setItem('rt_cmp_proveedores', JSON.stringify(cmpProveedores));
        console.log('[cmpAceptarFactura] proveedor insertado con id='+provId);
      } else {
        console.warn('[cmpAceptarFactura] sbPost proveedor devolvió respuesta inesperada:', provRows);
      }
    }catch(provErr){
      console.log('[Facturas] Error creando proveedor:', provErr);
      console.error('[cmpAceptarFactura] ERROR insertando proveedor:', provErr.message, provErr);
    }
  } else {
    console.log('[cmpAceptarFactura] proveedor no se inserta: provNombre=', provNombre);
  }

  var errores = 0;
  var actualizados = 0;
  var nuevos = 0;

  for(var i = 0; i < seleccionados.length; i++){
    var a = seleccionados[i];
    var precio = parseFloat(a.precio_unitario) || 0;
    var cantidad = parseFloat(a.cantidad) || 0;

    var artMatch = (cmpArticulos||[]).find(function(x){
      return x.nombre.toLowerCase().indexOf(a.nombre.toLowerCase().substring(0,8)) >= 0;
    });

    console.log('[cmpAceptarFactura] artículo['+i+']:', a.nombre, '| match:', artMatch ? ('id='+artMatch.id+' nombre='+artMatch.nombre) : 'NO ENCONTRADO', '| familia_id:', a._familiaId);

    try{
      if(artMatch){
        var stockMinNuevo = Math.floor(cantidad * 0.8);
        var patchData = {
          precio_compra: precio,
          stock_minimo: stockMinNuevo,
          stock_actual: (artMatch.stock_actual||0) + cantidad,
          ultima_actualizacion: new Date().toISOString(),
          ultima_actualizacion_por: currentUser ? currentUser.nombre : 'Lorena'
        };
        console.log('[cmpAceptarFactura] sbPatch id='+artMatch.id, patchData);
        var patchResult = await sbPatch('cmp_articulos', artMatch.id, patchData);
        console.log('[cmpAceptarFactura] sbPatch resultado:', patchResult);
        var idx = cmpArticulos.findIndex(function(x){ return x.id === artMatch.id; });
        if(idx >= 0){
          cmpArticulos[idx].precio_compra = precio;
          cmpArticulos[idx].stock_minimo = stockMinNuevo;
          cmpArticulos[idx].stock_actual = (cmpArticulos[idx].stock_actual||0) + cantidad;
        }
        actualizados++;
      } else {
        var nuevoArt = {
          nombre: a.nombre,
          unidad: a.unidad || 'ud',
          precio_compra: precio,
          stock_minimo: Math.floor(cantidad * 0.8),
          stock_actual: cantidad,
          local_id: localId,
          proveedor_id: provId,
          familia_id: a._familiaId,
          ultima_actualizacion: new Date().toISOString(),
          ultima_actualizacion_por: currentUser ? currentUser.nombre : 'Lorena'
        };
        console.log('[cmpAceptarFactura] sbPost nuevo artículo:', nuevoArt);
        var rows = await sbPost('cmp_articulos', nuevoArt);
        console.log('[cmpAceptarFactura] sbPost resultado:', rows);
        if(rows && rows[0]) cmpArticulos.push(rows[0]);
        nuevos++;
      }
    }catch(e){
      errores++;
      console.error('[cmpAceptarFactura] ERROR procesando "'+a.nombre+'":', e.message, e);
    }
  }

  localStorage.setItem('rt_cmp_articulos', JSON.stringify(cmpArticulos));

  var resumen = 'Factura procesada: '+actualizados+' actualizados, '+nuevos+' nuevos';
  if(errores) resumen += ', '+errores+' errores';
  showToast(resumen, errores ? 'orange' : 'green');

  cmpSincronizarDesdeSupabase();

  setTimeout(function(){ cmpTab('facturas'); }, 1500);
}


// ========== INVENTARIO COCINA (screen18) ==========

function initInventarioCocina(){
  var cont = document.getElementById('inv-cocina-content');
  if(!cont) return;

  // Cargar empleados si no están disponibles
  if(!clListaEmpleados || !clListaEmpleados.length){
    var localId = currentUser ? (currentUser.local_id||1) : 1;
    sbGet('empleados','activo=eq.true&local_id=eq.'+localId+'&order=nombre.asc&select=nombre').then(function(rows){
      if(rows && rows.length) clListaEmpleados = rows.map(function(e){ return e.nombre; });
      initInventarioCocina();
    }).catch(function(){ initInventarioCocina(); });
    return;
  }

  if(!cmpArticulos || !cmpArticulos.length){
    try{ cmpArticulos = JSON.parse(localStorage.getItem('rt_cmp_articulos') || '[]'); }catch(e){ cmpArticulos=[]; }
  }
  if(!cmpFamilias || !cmpFamilias.length){
    try{ cmpFamilias = JSON.parse(localStorage.getItem('rt_cmp_familias') || '[]'); }catch(e){ cmpFamilias=[]; }
  }
  if(!cmpArticulos.length || !cmpFamilias.length){
    cont.innerHTML = '<div style="text-align:center;padding:32px;color:var(--muted)">Cargando artículos...</div>';
    Promise.all([
      sbGet('cmp_articulos','order=nombre.asc'),
      sbGet('cmp_familias','order=nombre.asc')
    ]).then(function(res){
      if(res[0] && res[0].length){ cmpArticulos = res[0]; try{ localStorage.setItem('rt_cmp_articulos', JSON.stringify(res[0])); }catch(e){} }
      if(res[1] && res[1].length){ cmpFamilias  = res[1]; try{ localStorage.setItem('rt_cmp_familias',  JSON.stringify(res[1])); }catch(e){} }
      initInventarioCocina();
    }).catch(function(){ cont.innerHTML = '<div style="color:var(--red);padding:16px">Error cargando artículos.</div>'; });
    return;
  }

  var localId = currentUser ? (currentUser.local_id||1) : 1;
  var arts = cmpArticulos.filter(function(a){ return !a.local_id || String(a.local_id) === String(localId); });
  if(!arts.length) arts = cmpArticulos;

  var empleados = clListaEmpleados || [];
  var optsHtml = '<option value="">— Selecciona responsable —</option>';
  empleados.forEach(function(n){ optsHtml += '<option value="'+n+'">'+n+'</option>'; });

  var famMap = {};
  arts.forEach(function(a){
    var fam = cmpFamilias.find(function(f){ return f.id === a.familia_id; });
    var key = fam ? fam.nombre : 'Sin familia';
    var emoji = fam ? (fam.emoji||'📦') : '📦';
    if(!famMap[key]) famMap[key] = { emoji: emoji, count: 0 };
    famMap[key].count++;
  });

  var famGrid = Object.keys(famMap).sort().map(function(fn){
    var f = famMap[fn];
    return '<div onclick="invCocinaMostrarFamilia(\''+encodeURIComponent(fn)+'\')" style="background:var(--darker);border:1px solid var(--border);border-radius:10px;padding:14px 12px;cursor:pointer;display:flex;align-items:center;gap:10px"><span style="font-size:22px">'+f.emoji+'</span><div><div style="font-size:13px;font-weight:700;color:var(--text)">'+fn+'</div><div style="font-size:11px;color:var(--muted)">('+f.count+' artículos)</div></div><span style="margin-left:auto;color:var(--muted);font-size:18px">›</span></div>';
  }).join('');

  cont.innerHTML =
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap">'
    +'<span style="font-size:12px;color:var(--muted)">Responsable:</span>'
    +'<select id="inv-cocina-resp" style="flex:1;min-width:160px;background:var(--card);border:1px solid var(--border);border-radius:8px;padding:6px 10px;color:var(--text);font-size:13px;outline:none">'+optsHtml+'</select>'
    +'<button onclick="invCocinaEnviarWA()" style="background:none;border:1px solid #25d366;border-radius:8px;color:#25d366;font-size:12px;font-weight:600;padding:6px 14px;cursor:pointer;white-space:nowrap">💬 Enviar por WA</button>'
    +'</div>'
    +'<div style="margin-bottom:12px"><input type="text" id="inv-cocina-buscar" placeholder="🔍 Buscar artículo..." oninput="invCocinaFiltrar()" style="width:100%;box-sizing:border-box;background:var(--darker);border:1px solid var(--border);border-radius:8px;padding:8px 12px;color:var(--text);font-size:13px;outline:none"></div>'
    +'<div style="font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Selecciona una familia</div>'
    +'<div id="inv-cocina-grid" style="display:grid;gap:8px">'+famGrid+'</div>';
}

function invCocinaMostrarFamilia(famEnc){
  var famNombre = decodeURIComponent(famEnc);
  var localId = currentUser ? (currentUser.local_id||1) : 1;
  var arts = (cmpArticulos||[]).filter(function(a){
    if(a.local_id && String(a.local_id) !== String(localId)) return false;
    var fam = cmpFamilias.find(function(f){ return f.id === a.familia_id; });
    return (fam ? fam.nombre : 'Sin familia') === famNombre;
  });
  var grid = document.getElementById('inv-cocina-grid');
  if(!grid) return;

  var rowsHtml = arts.map(function(a){
    var sMin = a.stock_minimo != null ? parseFloat(a.stock_minimo) : null;
    return '<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)">'
      +'<div style="flex:1;font-size:13px;font-weight:600;color:var(--text)">'+a.nombre+'</div>'
      +'<div style="font-size:11px;color:var(--muted);width:36px;text-align:center">'+(a.unidad||'—')+'</div>'
      +'<div style="font-size:11px;color:var(--muted);width:54px;text-align:right">'+(sMin !== null ? 'min '+sMin : '')+'</div>'
      +'<input type="number" min="0" step="0.5" placeholder="0" id="inv18-stock-'+a.id+'" onchange="inv18CheckMin('+a.id+','+sMin+')" style="width:72px;background:var(--darker);border:1px solid var(--border);border-radius:6px;padding:5px 8px;color:var(--text);font-size:13px;outline:none;text-align:right">'
      +'<span style="width:20px;text-align:center;font-size:14px" id="inv18-flag-'+a.id+'"></span>'
      +'</div>';
  }).join('');

  grid.innerHTML =
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">'
    +'<button onclick="initInventarioCocina()" style="background:none;border:1px solid var(--border);border-radius:6px;padding:4px 10px;color:var(--muted);cursor:pointer;font-size:12px">← Volver</button>'
    +'<div style="font-size:13px;font-weight:700;color:var(--text)">'+famNombre+'</div>'
    +'<div style="font-size:11px;color:var(--muted)">('+arts.length+' articulos)</div>'
    +'</div>'
    +'<button onclick="inv18Guardar()" style="background:var(--accent);border:none;border-radius:8px;padding:8px 20px;color:#fff;font-size:13px;font-weight:700;cursor:pointer;margin-bottom:12px">Guardar stock</button>'
    +rowsHtml;
}

function inv18CheckMin(artId, sMin){
  var input = document.getElementById('inv18-stock-'+artId);
  var flag  = document.getElementById('inv18-flag-'+artId);
  if(!input || !flag) return;
  var val = parseFloat(input.value);
  var bajo = sMin !== null && !isNaN(val) && val <= sMin;
  flag.textContent = bajo ? '\u{1F534}' : (input.value !== '' ? '\u{1F7E2}' : '');
  input.style.borderColor = bajo ? 'var(--red)' : 'var(--border)';
}

async function inv18Guardar(){
  var localId = currentUser ? (currentUser.local_id||1) : 1;
  var arts = (cmpArticulos||[]).filter(function(a){ return !a.local_id || String(a.local_id) === String(localId); });
  var bajosDeMinimo = [];
  var promesas = [];
  arts.forEach(function(a){
    var input = document.getElementById('inv18-stock-'+a.id);
    if(input && input.value !== ''){
      var val = parseFloat(input.value);
      var sMin = a.stock_minimo != null ? parseFloat(a.stock_minimo) : null;
      if(sMin !== null && val <= sMin) bajosDeMinimo.push({nombre:a.nombre, unidad:a.unidad||'', actual:val, minimo:sMin});
      var artIdx = cmpArticulos.findIndex(function(x){ return x.id === a.id; });
      if(artIdx >= 0) cmpArticulos[artIdx].stock_actual = val;
      promesas.push(sbPatch('cmp_articulos', a.id, {stock_actual: val, ultima_actualizacion: new Date().toISOString(), ultima_actualizacion_por: currentUser ? currentUser.nombre : 'Inventario'}));
    }
  });
  try{
    await Promise.all(promesas);
    localStorage.setItem('rt_cmp_articulos', JSON.stringify(cmpArticulos));
    showToast('Stock guardado correctamente.', 'green');
  }catch(e){ showToast('Error guardando stock.', 'red'); }
  if(bajosDeMinimo.length){
    var fecha = new Date().toLocaleDateString('es-ES',{day:'numeric',month:'long'});
    var lineas = bajosDeMinimo.map(function(x){ return '• '+x.nombre+': '+x.actual+' '+x.unidad+' — stock mínimo '+x.minimo+' '+x.unidad+' en cámara'; }).join('\n');
    var msg = '⚠ STOCK BAJO — Inventario Cocina '+fecha+'\n\n'+lineas+'\n\nPor favor, reponer antes del próximo servicio.';
    var lorena  = (localStorage.getItem('rt_wa_lorena')||'').trim();
    sbGet('empleados','nombre=eq.DOMINGO&local_id=eq.1&select=telefono').then(function(rows){
      var domingo = rows && rows[0] && rows[0].telefono ? rows[0].telefono.replace(/\s+/g,'') : '';
      if(lorena)  window.open('https://wa.me/'+lorena+'?text='+encodeURIComponent(msg),'_blank');
      if(domingo) setTimeout(function(){ window.open('https://wa.me/'+domingo+'?text='+encodeURIComponent(msg),'_blank'); }, 800);
    }).catch(function(){
      if(lorena) window.open('https://wa.me/'+lorena+'?text='+encodeURIComponent(msg),'_blank');
    });
    showToast(bajosDeMinimo.length+' articulo(s) bajo minimo. Aviso a Lorena y Domingo.', 'red');
  }
}

function invCocinaFiltrar(){
  var q = ((document.getElementById('inv-cocina-buscar')||{}).value||'').trim().toLowerCase();
  var grid = document.getElementById('inv-cocina-grid');
  if(!grid) return;
  if(!q){ initInventarioCocina(); return; }
  var localId = currentUser ? (currentUser.local_id||1) : 1;
  var arts = (cmpArticulos||[]).filter(function(a){
    if(a.local_id && String(a.local_id) !== String(localId)) return false;
    return a.nombre.toLowerCase().indexOf(q) >= 0;
  });
  if(!arts.length){ grid.innerHTML = '<div style="text-align:center;color:var(--muted);padding:24px">Sin resultados</div>'; return; }
  var rowsHtml = arts.map(function(a){
    var sMin = a.stock_minimo != null ? parseFloat(a.stock_minimo) : null;
    return '<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)">'
      +'<div style="flex:1;font-size:13px;font-weight:600;color:var(--text)">'+a.nombre+'</div>'
      +'<div style="font-size:11px;color:var(--muted);width:36px;text-align:center">'+(a.unidad||'—')+'</div>'
      +'<input type="number" min="0" step="0.5" placeholder="0" id="inv18-stock-'+a.id+'" onchange="inv18CheckMin('+a.id+','+sMin+')" style="width:72px;background:var(--darker);border:1px solid var(--border);border-radius:6px;padding:5px 8px;color:var(--text);font-size:13px;outline:none;text-align:right">'
      +'<span style="width:20px;text-align:center;font-size:14px" id="inv18-flag-'+a.id+'"></span>'
      +'</div>';
  }).join('');
  grid.innerHTML = '<div style="font-size:11px;color:var(--muted);margin-bottom:8px">'+arts.length+' resultado(s)</div>'+rowsHtml
    +'<button onclick="inv18Guardar()" style="background:var(--accent);border:none;border-radius:8px;padding:8px 20px;color:#fff;font-size:13px;font-weight:700;cursor:pointer;margin-top:14px">Guardar stock</button>';
}

function invCocinaEnviarWA(){
  var resp = (document.getElementById('inv-cocina-resp')||{}).value || '';
  if(!resp){ showToast('Selecciona un responsable primero','red'); return; }
  var localId = currentUser ? (currentUser.local_id||1) : 1;
  var fecha = new Date().toISOString().split('T')[0];
  var fecha = new Date().toISOString().split('T')[0];
  var url = window.location.origin + window.location.pathname
    + '?inv=cocina&empleado='+encodeURIComponent(resp)+'&local='+localId;
  sbGet('empleados','nombre=eq.'+encodeURIComponent(resp)+'&local_id=eq.'+localId+'&select=telefono').then(function(rows){
    var tel = rows && rows[0] && rows[0].telefono ? rows[0].telefono.replace(/\s+/g,'') : '';
    var fechaFmt = new Date(fecha+'T12:00:00').toLocaleDateString('es-ES',{day:'numeric',month:'long'});
    var msg = 'Inventario Cocina '+fechaFmt+'\n\nHola '+resp+', por favor registra el stock al cierre:\n\n'+url;
    if(tel){
      window.open('https://wa.me/'+tel+'?text='+encodeURIComponent(msg),'_blank');
    } else {
      navigator.clipboard.writeText(url).catch(function(){});
      showToast(resp+' no tiene telefono. Enlace copiado.','orange');
    }
  }).catch(function(){
    navigator.clipboard.writeText(url).catch(function(){});
    showToast('Enlace copiado al portapapeles','green');
  });
}


// ========== MODAL INVENTARIO AL CIERRE (Checklist Cocina) ==========

function clCerrarModalInventario(){
  var m = document.getElementById('modal-inventario-cierre');
  if(m) m.remove();
}

function clCerrarModalInventario(){
  var m = document.getElementById('modal-inventario-cierre');
  if(m) m.remove();
}

function clAbrirModalInventario(tareaIdx){
  var prev = document.getElementById('modal-inventario-cierre');
  if(prev) prev.remove();

  var localId = currentUser ? (currentUser.local_id || 1) : 1;

  // Cargar artículos y familias si están vacíos
  if(!cmpArticulos || !cmpArticulos.length){
    try{ cmpArticulos = JSON.parse(localStorage.getItem('rt_cmp_articulos') || '[]'); }catch(e){ cmpArticulos=[]; }
  }
  if(!cmpFamilias || !cmpFamilias.length){
    try{ cmpFamilias = JSON.parse(localStorage.getItem('rt_cmp_familias') || '[]'); }catch(e){ cmpFamilias=[]; }
  }
  if(!cmpArticulos.length || !cmpFamilias.length){
    showToast('Cargando datos...', 'green');
    Promise.all([
      sbGet('cmp_articulos','order=nombre.asc'),
      sbGet('cmp_familias','order=nombre.asc')
    ]).then(function(res){
      if(res[0] && res[0].length){ cmpArticulos = res[0]; try{ localStorage.setItem('rt_cmp_articulos', JSON.stringify(res[0])); }catch(e){} }
      if(res[1] && res[1].length){ cmpFamilias  = res[1]; try{ localStorage.setItem('rt_cmp_familias',  JSON.stringify(res[1])); }catch(e){} }
      clAbrirModalInventario(tareaIdx);
    }).catch(function(){ showToast('Error cargando datos.','red'); });
    return;
  }

  var arts = (cmpArticulos || []).filter(function(a){
    if(!a.local_id) return true;
    return String(a.local_id) === String(localId);
  });
  if(!arts.length) arts = cmpArticulos || [];
  if(!arts.length){ showToast('No hay artículos en Compras. Añádelos primero.', 'red'); return; }

  var savedData = {};
  try{ if(clTareasHoy[tareaIdx] && clTareasHoy[tareaIdx].valorExtra) savedData = JSON.parse(clTareasHoy[tareaIdx].valorExtra); }catch(e){}

  var famMap = {};
  arts.forEach(function(a){
    var fam = cmpFamilias.find(function(f){ return f.id === a.familia_id; });
    var key = fam ? fam.nombre : 'Sin familia';
    var emoji = fam ? (fam.emoji||'📦') : '📦';
    if(!famMap[key]) famMap[key] = { emoji: emoji, arts: [] };
    famMap[key].arts.push(a);
  });

  var famGrid = Object.keys(famMap).sort().map(function(fn){
    var f = famMap[fn];
    var count = f.arts.length;
    var hecho = f.arts.filter(function(a){ return savedData[a.id] != null; }).length;
    var badge = hecho > 0
      ? '<span style="font-size:10px;background:var(--green);color:#fff;border-radius:10px;padding:1px 6px">'+hecho+'/'+count+'</span>'
      : '<span style="font-size:10px;color:var(--muted)">('+count+')</span>';
    return '<div data-fam="'+encodeURIComponent(fn)+'" onclick="clInvClickFamilia(this,'+tareaIdx+')" style="background:var(--darker);border:1px solid var(--border);border-radius:10px;padding:14px 12px;cursor:pointer;display:flex;align-items:center;gap:10px"><span style="font-size:22px">'+f.emoji+'</span><div><div style="font-size:13px;font-weight:700;color:var(--text)">'+fn+'</div><div style="font-size:11px;margin-top:2px">'+badge+'</div></div><span style="margin-left:auto;color:var(--muted);font-size:18px">›</span></div>';
  }).join('');

  var modal = document.createElement('div');
  modal.id = 'modal-inventario-cierre';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px';
  modal.innerHTML =
    '<div style="background:var(--card);border:1px solid var(--border);border-radius:14px;width:100%;max-width:520px;max-height:85vh;display:flex;flex-direction:column;overflow:hidden">'
    +'<div style="padding:16px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">'
    +'<div><div style="font-size:15px;font-weight:700;color:var(--text)">📦 Inventario al cierre</div>'
    +'<div style="font-size:11px;color:var(--muted);margin-top:2px">'+new Date().toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'})+'</div></div>'
    +'<button onclick="clCerrarModalInventario()" style="background:none;border:1px solid var(--border);border-radius:8px;padding:5px 11px;color:var(--muted);cursor:pointer;font-size:13px">✕</button>'
    +'</div>'
    +'<div style="padding:12px 18px;border-bottom:1px solid var(--border)">'
    +'<input type="text" id="inv-buscar" placeholder="🔍 Buscar artículo..." oninput="clInvFiltrarBusqueda('+tareaIdx+')" style="width:100%;box-sizing:border-box;background:var(--darker);border:1px solid var(--border);border-radius:8px;padding:8px 12px;color:var(--text);font-size:13px;outline:none">'
    +'</div>'
    +'<div id="inv-contenido" style="overflow-y:auto;flex:1;padding:14px 18px">'
    +'<div style="font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Selecciona una familia</div>'
    +'<div style="display:grid;gap:8px">'+famGrid+'</div>'
    +'</div>'
    +'<div style="padding:14px 18px;border-top:1px solid var(--border);display:flex;gap:10px;justify-content:flex-end">'
    +'<button onclick="clCerrarModalInventario()" style="background:none;border:1px solid var(--border);border-radius:8px;padding:8px 16px;color:var(--muted);cursor:pointer;font-size:13px">Cancelar</button>'
    +'<button onclick="clGuardarInventarioCierre('+tareaIdx+')" style="background:var(--accent);border:none;border-radius:8px;padding:8px 20px;color:#fff;font-size:13px;font-weight:700;cursor:pointer">💾 Guardar y cerrar</button>'
    +'</div>'
    +'</div>';

  document.body.appendChild(modal);
  modal._tareaIdx = tareaIdx;
  modal._arts = arts;
  modal._savedData = savedData;
}

function clInvClickFamilia(el, tareaIdx){
  var famNombre = decodeURIComponent(el.getAttribute('data-fam') || '');
  clInvMostrarFamilia(famNombre, tareaIdx);
}

function clInvMostrarFamilia(famNombre, tareaIdx){
  var modal = document.getElementById('modal-inventario-cierre');
  if(!modal) return;
  var arts = modal._arts || [];
  var savedData = modal._savedData || {};

  var famArts = arts.filter(function(a){
    var fam = cmpFamilias.find(function(f){ return f.id === a.familia_id; });
    var key = fam ? fam.nombre : 'Sin familia';
    return key === famNombre;
  });

  var cont = document.getElementById('inv-contenido');
  if(!cont) return;

  var rowsHtml = famArts.map(function(a){
    var sMin = a.stock_minimo != null ? parseFloat(a.stock_minimo) : null;
    var saved = savedData[a.id] != null ? savedData[a.id] : '';
    var bajo = (sMin !== null && saved !== '' && parseFloat(saved) <= sMin);
    return '<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)">'
      +'<div style="flex:1;font-size:13px;font-weight:600;color:var(--text)">'+a.nombre+'</div>'
      +'<div style="font-size:11px;color:var(--muted);width:36px;text-align:center">'+(a.unidad||'—')+'</div>'
      +'<div style="font-size:11px;color:var(--muted);width:54px;text-align:right">'+(sMin !== null ? 'mín '+sMin : '')+'</div>'
      +'<input type="number" min="0" step="0.5" placeholder="0" value="'+saved+'" id="inv-stock-'+a.id+'" onchange="clInvCheckMin('+a.id+','+sMin+')" style="width:72px;background:var(--darker);border:1px solid '+(bajo?'var(--red)':'var(--border)')+';border-radius:6px;padding:5px 8px;color:var(--text);font-size:13px;outline:none;text-align:right">'
      +'<span style="width:20px;text-align:center;font-size:14px" id="inv-flag-'+a.id+'">'+(bajo?'🔴':(saved!==''?'🟢':''))+'</span>'
      +'</div>';
  }).join('');

  cont.innerHTML =
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">'
    +'<button onclick="clInvVolverFamilias('+tareaIdx+')" style="background:none;border:1px solid var(--border);border-radius:6px;padding:4px 10px;color:var(--muted);cursor:pointer;font-size:12px">← Volver</button>'
    +'<div style="font-size:13px;font-weight:700;color:var(--text)">'+famNombre+'</div>'
    +'<div style="font-size:11px;color:var(--muted)">('+famArts.length+' artículos)</div>'
    +'</div>'
    +'<div style="font-size:11px;color:var(--muted);margin-bottom:8px">🔴 Por debajo del mínimo → aviso a Lorena</div>'
    +rowsHtml;
}

function clInvVolverFamilias(tareaIdx){
  var modal = document.getElementById('modal-inventario-cierre');
  if(!modal) return;
  var arts = modal._arts || [];
  arts.forEach(function(a){
    var input = document.getElementById('inv-stock-'+a.id);
    if(input && input.value !== '') modal._savedData[a.id] = parseFloat(input.value);
  });
  // limpiar buscador y redibujar
  clAbrirModalInventario(tareaIdx);
}

function clInvFiltrarBusqueda(tareaIdx){
  var modal = document.getElementById('modal-inventario-cierre');
  if(!modal) return;
  var q = (document.getElementById('inv-buscar')||{}).value || '';
  q = q.trim().toLowerCase();
  var arts = modal._arts || [];
  var savedData = modal._savedData || {};
  var cont = document.getElementById('inv-contenido');
  if(!cont) return;

  if(!q){
    // reconstruir grid familias sin reabrir modal
    var famMap = {};
    arts.forEach(function(a){
      var fam = cmpFamilias.find(function(f){ return f.id === a.familia_id; });
      var key = fam ? fam.nombre : 'Sin familia';
      var emoji = fam ? (fam.emoji||'📦') : '📦';
      if(!famMap[key]) famMap[key] = { emoji: emoji, arts: [] };
      famMap[key].arts.push(a);
    });
    var famGrid = Object.keys(famMap).sort().map(function(fn){
      var f = famMap[fn];
      var count = f.arts.length;
      var hecho = f.arts.filter(function(a){ return savedData[a.id] != null; }).length;
      var badge = hecho > 0
        ? '<span style="font-size:10px;background:var(--green);color:#fff;border-radius:10px;padding:1px 6px">'+hecho+'/'+count+'</span>'
        : '<span style="font-size:10px;color:var(--muted)">('+count+')</span>';
    return '<div data-fam="'+encodeURIComponent(fn)+'" onclick="clInvClickFamilia(this,'+tareaIdx+')" style="background:var(--darker);border:1px solid var(--border);border-radius:10px;padding:14px 12px;cursor:pointer;display:flex;align-items:center;gap:10px"><span style="font-size:22px">'+f.emoji+'</span><div><div style="font-size:13px;font-weight:700;color:var(--text)">'+fn+'</div><div style="font-size:11px;margin-top:2px">'+badge+'</div></div><span style="margin-left:auto;color:var(--muted);font-size:18px">›</span></div>';
    }).join('');
    cont.innerHTML = '<div style="font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Selecciona una familia</div><div style="display:grid;gap:8px">'+famGrid+'</div>';
    return;
  }

  var filtrados = arts.filter(function(a){ return a.nombre.toLowerCase().indexOf(q) >= 0; });
  if(!filtrados.length){
    cont.innerHTML = '<div style="text-align:center;color:var(--muted);padding:32px;font-size:13px">Sin resultados para "'+q+'"</div>';
    return;
  }

  var rowsHtml = filtrados.map(function(a){
    var sMin = a.stock_minimo != null ? parseFloat(a.stock_minimo) : null;
    var saved = savedData[a.id] != null ? savedData[a.id] : '';
    var bajo = (sMin !== null && saved !== '' && parseFloat(saved) <= sMin);
    return '<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)">'
      +'<div style="flex:1;font-size:13px;font-weight:600;color:var(--text)">'+a.nombre+'</div>'
      +'<div style="font-size:11px;color:var(--muted);width:36px;text-align:center">'+(a.unidad||'—')+'</div>'
      +'<div style="font-size:11px;color:var(--muted);width:54px;text-align:right">'+(sMin !== null ? 'mín '+sMin : '')+'</div>'
      +'<input type="number" min="0" step="0.5" placeholder="0" value="'+saved+'" id="inv-stock-'+a.id+'" onchange="clInvCheckMin('+a.id+','+sMin+')" style="width:72px;background:var(--darker);border:1px solid '+(bajo?'var(--red)':'var(--border)')+';border-radius:6px;padding:5px 8px;color:var(--text);font-size:13px;outline:none;text-align:right">'
      +'<span style="width:20px;text-align:center;font-size:14px" id="inv-flag-'+a.id+'">'+(bajo?'🔴':(saved!==''?'🟢':''))+'</span>'
      +'</div>';
  }).join('');

  cont.innerHTML = '<div style="font-size:11px;color:var(--muted);margin-bottom:10px">'+filtrados.length+' resultado(s)</div>'+rowsHtml;
}

function clInvSetResponsable(idx, nombre){
  if(clTareasHoy[idx]) clTareasHoy[idx].responsableInventario = nombre;
}

function clInvEnviarWA(idx){
  var tarea = clTareasHoy[idx];
  if(!tarea){ showToast('Error: tarea no encontrada','red'); return; }
  var resp = tarea.responsableInventario || '';
  if(!resp){ showToast('Selecciona un responsable primero','red'); return; }

  // Buscar teléfono del empleado en la BD
  var fecha = clFechaISO();
  var localId = currentUser ? (currentUser.local_id||1) : 1;
  var url = window.location.origin + window.location.pathname
    + '?checklist='+fecha+'&empleado='+encodeURIComponent(resp)+'&seccion=Cocina&local='+localId+'&solo=inventario';

  // Buscar número del empleado
  sbGet('empleados','nombre=eq.'+encodeURIComponent(resp)+'&local_id=eq.'+localId+'&select=telefono').then(function(rows){
    var tel = rows && rows[0] && rows[0].telefono ? rows[0].telefono.replace(/\s+/g,'') : '';
    var fechaFmt = new Date(fecha+'T12:00:00').toLocaleDateString('es-ES',{day:'numeric',month:'long'});
    var msg = '\u{1F4E6} Inventario al cierre '+fechaFmt+'\n\nHola '+resp+', por favor realiza el inventario de stock al cierre:\n\n'+url;
    if(tel){
      window.open('https://wa.me/'+tel+'?text='+encodeURIComponent(msg),'_blank');
    } else {
      navigator.clipboard.writeText(msg).catch(function(){});
      showToast(resp+' no tiene teléfono configurado. Enlace copiado.','orange');
    }
  }).catch(function(){
    var msg = '\u{1F4E6} Inventario al cierre\n\n'+url;
    navigator.clipboard.writeText(msg).catch(function(){});
    showToast('Enlace copiado al portapapeles','green');
  });
}

function clInvCheckMin(artId, sMin){
  var input = document.getElementById('inv-stock-'+artId);
  var flag  = document.getElementById('inv-flag-'+artId);
  if(!input || !flag) return;
  var val = parseFloat(input.value);
  var bajo = (sMin !== null && !isNaN(val) && val <= sMin);
  flag.textContent = bajo ? '🔴' : (input.value !== '' ? '🟢' : '');
  if(bajo){
    input.style.borderColor = 'var(--red)';
  } else {
    input.style.borderColor = 'var(--border)';
  }
}

async function clGuardarInventarioCierre(tareaIdx){
  var tarea = clTareasHoy[tareaIdx];
  if(!tarea) return;

  var localId = currentUser ? (currentUser.local_id || 1) : 1;
  var arts = (cmpArticulos || []).filter(function(a){
    return !a.local_id || String(a.local_id) === String(localId);
  });

  var datos = {};
  var bajosDeMinimo = [];

  arts.forEach(function(a){
    var input = document.getElementById('inv-stock-'+a.id);
    if(input && input.value !== ''){
      var val = parseFloat(input.value);
      datos[a.id] = val;
      var sMin = a.stock_minimo != null ? parseFloat(a.stock_minimo) : null;
      if(sMin !== null && val <= sMin){
        bajosDeMinimo.push({ nombre: a.nombre, unidad: a.unidad||'', actual: val, minimo: sMin });
      }
    }
  });

  // Guardar en la tarea como JSON
  tarea.valorExtra = JSON.stringify(datos);
  tarea.hecha = true;
  tarea.hora_completado = new Date().toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'});
  clGuardarTarea(tareaIdx);

  // Actualizar stock_actual en Supabase para cada artículo
  var promesas = Object.keys(datos).map(function(id){
    var artId = parseInt(id);
    var artIdx = cmpArticulos.findIndex(function(a){ return a.id === artId; });
    if(artIdx >= 0) cmpArticulos[artIdx].stock_actual = datos[id];
    return sbPatch('cmp_articulos', artId, { stock_actual: datos[id], ultima_actualizacion: new Date().toISOString(), ultima_actualizacion_por: currentUser ? currentUser.nombre : 'Checklist' });
  });

  try{
    await Promise.all(promesas);
    localStorage.setItem('rt_cmp_articulos', JSON.stringify(cmpArticulos));
  }catch(e){
    console.warn('[Inventario cierre] Error actualizando Supabase:', e);
  }

  // Cerrar modal
  var modal = document.getElementById('modal-inventario-cierre');
  if(modal) modal.remove();

  // Notificar por WhatsApp si hay artículos bajo mínimo
  if(bajosDeMinimo.length){
    var lorena = (localStorage.getItem('rt_wa_lorena') || '').trim();
    var fecha  = new Date().toLocaleDateString('es-ES',{day:'numeric',month:'long'});
    var lineas = bajosDeMinimo.map(function(x){
      return '• '+x.nombre+': '+x.actual+' '+x.unidad+' — stock mínimo '+x.minimo+' '+x.unidad+' en cámara';
    }).join('\n');
    var msg = '⚠ STOCK BAJO — Inventario Cocina '+fecha+'\n\n'+lineas+'\n\nPor favor, reponer antes del próximo servicio.';
    sbGet('empleados','nombre=eq.DOMINGO&local_id=eq.1&select=telefono').then(function(rows){
      var domingo = rows && rows[0] && rows[0].telefono ? rows[0].telefono.replace(/\s+/g,'') : '';
      if(lorena)  window.open('https://wa.me/'+lorena+'?text='+encodeURIComponent(msg),'_blank');
      if(domingo) setTimeout(function(){ window.open('https://wa.me/'+domingo+'?text='+encodeURIComponent(msg),'_blank'); }, 800);
      if(!lorena && !domingo){ navigator.clipboard.writeText(msg).catch(function(){}); showToast('Números no configurados. Mensaje copiado.','red'); }
    }).catch(function(){
      if(lorena) window.open('https://wa.me/'+lorena+'?text='+encodeURIComponent(msg),'_blank');
    });
    showToast('⚠ '+bajosDeMinimo.length+' artículo(s) bajo mínimo. Aviso a Lorena y Domingo.', 'red');
  } else {
    showToast('✅ Inventario guardado correctamente.', 'green');
  }

  clRenderTareas();
}


// ========== VISTA PÚBLICA INVENTARIO (sin login) ==========

// Memoria global de stocks introducidos por el cocinero
var winvStockData = {};

async function winvInit(tipo, empleado, localId){
  var tEl = document.getElementById('winv-titulo');
  var eEl = document.getElementById('winv-empleado-txt');
  var fEl = document.getElementById('winv-fecha-txt');
  var cont = document.getElementById('winv-contenido');

  if(tEl) tEl.textContent = 'Inventario Cocina al cierre';
  if(eEl) eEl.textContent = '👤 ' + empleado;
  if(fEl) fEl.textContent = new Date().toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long',year:'numeric'});

  if(!cont) return;
  cont.innerHTML = '<div style="text-align:center;color:var(--muted);padding:24px">Cargando artículos...</div>';

  try{
    var arts  = await sbGet('cmp_articulos', 'order=nombre.asc');
    var fams  = await sbGet('cmp_familias',  'order=nombre.asc');
    arts = (arts||[]).filter(function(a){ return !a.local_id || String(a.local_id) === String(localId); });
    if(!arts.length) arts = (await sbGet('cmp_articulos','order=nombre.asc')||[]);

    var famMap = {};
    arts.forEach(function(a){
      var fam = (fams||[]).find(function(f){ return f.id === a.familia_id; });
      var key = fam ? fam.nombre : 'Sin familia';
      var emoji = fam ? (fam.emoji||'📦') : '📦';
      if(!famMap[key]) famMap[key] = { emoji: emoji, arts: [] };
      famMap[key].arts.push(a);
    });

    var famGrid = Object.keys(famMap).sort().map(function(fn){
      var f = famMap[fn];
      var rellenados = f.arts.filter(function(a){ return winvStockData[a.id] != null; }).length;
      var badge = rellenados > 0
        ? '<span style="font-size:10px;background:var(--green);color:#fff;border-radius:10px;padding:1px 6px;margin-left:6px">'+rellenados+'/'+f.arts.length+'</span>'
        : '<span style="font-size:11px;color:var(--muted)"> ('+f.arts.length+' art.)</span>';
      return '<div data-fn="'+encodeURIComponent(fn)+'" onclick="winvClickFamilia(this)" data-arts="'+encodeURIComponent(JSON.stringify(f.arts))+'" style="background:var(--darker);border:1px solid var(--border);border-radius:10px;padding:14px 12px;cursor:pointer;display:flex;align-items:center;gap:10px;margin-bottom:8px"><span style="font-size:22px">'+f.emoji+'</span><div><div style="font-size:13px;font-weight:700;color:var(--text)">'+fn+badge+'</div></div><span style="margin-left:auto;color:var(--muted);font-size:18px">›</span></div>';
    }).join('');

    var totalRellenados = Object.keys(winvStockData).length;
    var btnEnviar = totalRellenados > 0
      ? '<button onclick="winvEnviarTodo()" style="display:block;width:100%;margin-top:16px;background:var(--green);border:none;border-radius:8px;padding:14px;color:#fff;font-size:14px;font-weight:700;cursor:pointer">📤 Enviar inventario ('+totalRellenados+' artículos)</button>'
      : '<div style="text-align:center;font-size:12px;color:var(--muted);margin-top:16px;padding:12px;border:1px dashed var(--border);border-radius:8px">Entra en cada familia, introduce el stock y pulsa Guardar. Luego aparecerá el botón de enviar.</div>';

    cont.innerHTML =
      '<div style="margin-bottom:12px"><input type="text" id="winv-buscar" placeholder="Buscar articulo..." oninput="winvFiltrar()" style="width:100%;box-sizing:border-box;background:var(--darker);border:1px solid var(--border);border-radius:8px;padding:8px 12px;color:var(--text);font-size:13px;outline:none"></div>'
      +'<div style="font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Selecciona una familia</div>'
      +'<div id="winv-grid">'+famGrid+'</div>'
      +btnEnviar;

    cont._arts = arts;
    cont._fams = fams;
    cont._empleado = empleado;
    cont._localId = localId;

  }catch(e){
    cont.innerHTML = '<div style="color:var(--red);padding:16px;text-align:center">Error cargando articulos. Comprueba tu conexion.</div>';
  }
}

function winvClickFamilia(el){
  var famEnc = el.getAttribute('data-fn') || el.getAttribute('data-fam') || '';
  winvMostrarFamilia(el, famEnc);
}

function winvMostrarFamilia(el, famEnc){
  var famNombre = decodeURIComponent(famEnc);
  var cont = document.getElementById('winv-contenido');
  var arts = [];
  try{ arts = JSON.parse(decodeURIComponent(el.getAttribute('data-arts')||'[]')); }catch(e){}
  var grid = document.getElementById('winv-grid');
  if(!grid) return;

  var rowsHtml = arts.map(function(a){
    var sMin = a.stock_minimo != null ? parseFloat(a.stock_minimo) : null;
    return '<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)">'
      +'<div style="flex:1;font-size:13px;font-weight:600;color:var(--text)">'+a.nombre+'</div>'
      +'<div style="font-size:11px;color:var(--muted);width:36px;text-align:center">'+(a.unidad||'')+'</div>'
      +'<div style="font-size:11px;color:var(--muted);width:54px;text-align:right">'+(sMin !== null ? 'min '+sMin : '')+'</div>'
      +'<input type="number" min="0" step="0.5" placeholder="0" id="winv-stock-'+a.id+'" onchange="winvCheckMin('+a.id+','+sMin+')" style="width:72px;background:var(--darker);border:1px solid var(--border);border-radius:6px;padding:5px 8px;color:var(--text);font-size:13px;outline:none;text-align:right">'
      +'<span style="width:20px;text-align:center;font-size:14px" id="winv-flag-'+a.id+'"></span>'
      +'</div>';
  }).join('');

  grid.innerHTML =
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">'
    +'<button onclick="winvVolverFamilias()" style="background:none;border:1px solid var(--border);border-radius:6px;padding:4px 10px;color:var(--muted);cursor:pointer;font-size:12px">← Volver</button>'
    +'<div style="font-size:13px;font-weight:700;color:var(--text)">'+famNombre+'</div>'
    +'<div style="font-size:11px;color:var(--muted)">('+arts.length+' art.)</div>'
    +'</div>'
    +'<div style="font-size:11px;color:var(--muted);margin-bottom:8px">Rojo = por debajo del minimo</div>'
    +rowsHtml
    +'<button onclick="winvGuardar('+JSON.stringify(arts).replace(/"/g,"'")+')" style="display:block;width:100%;margin-top:16px;background:var(--accent);border:none;border-radius:8px;padding:12px;color:#fff;font-size:14px;font-weight:700;cursor:pointer">Guardar stock</button>';

  // Guardar arts para el botón guardar
  grid._famArts = arts;
}

function winvCheckMin(artId, sMin){
  var input = document.getElementById('winv-stock-'+artId);
  var flag  = document.getElementById('winv-flag-'+artId);
  if(!input || !flag) return;
  var val = parseFloat(input.value);
  var bajo = sMin !== null && !isNaN(val) && val <= sMin;
  flag.textContent = bajo ? '🔴' : (input.value !== '' ? '🟢' : '');
  input.style.borderColor = bajo ? 'var(--red)' : 'var(--border)';
}

function winvVolverFamilias(){
  var cont = document.getElementById('winv-contenido');
  if(!cont) return;
  winvInit('cocina', cont._empleado||'', cont._localId||1);
}

function winvFiltrar(){
  var q = ((document.getElementById('winv-buscar')||{}).value||'').trim().toLowerCase();
  var cont = document.getElementById('winv-contenido');
  var grid = document.getElementById('winv-grid');
  if(!cont || !grid) return;
  if(!q){ winvInit('cocina', cont._empleado||'', cont._localId||1); return; }
  var arts = (cont._arts||[]).filter(function(a){ return a.nombre.toLowerCase().indexOf(q) >= 0; });
  if(!arts.length){ grid.innerHTML = '<div style="text-align:center;color:var(--muted);padding:24px">Sin resultados</div>'; return; }
  var rowsHtml = arts.map(function(a){
    var sMin = a.stock_minimo != null ? parseFloat(a.stock_minimo) : null;
    return '<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)">'
      +'<div style="flex:1;font-size:13px;font-weight:600;color:var(--text)">'+a.nombre+'</div>'
      +'<div style="font-size:11px;color:var(--muted);width:36px;text-align:center">'+(a.unidad||'')+'</div>'
      +'<input type="number" min="0" step="0.5" placeholder="0" id="winv-stock-'+a.id+'" onchange="winvCheckMin('+a.id+','+sMin+')" style="width:72px;background:var(--darker);border:1px solid var(--border);border-radius:6px;padding:5px 8px;color:var(--text);font-size:13px;outline:none;text-align:right">'
      +'<span style="width:20px;text-align:center;font-size:14px" id="winv-flag-'+a.id+'"></span>'
      +'</div>';
  }).join('');
  grid.innerHTML = '<div style="font-size:11px;color:var(--muted);margin-bottom:8px">'+arts.length+' resultado(s)</div>'+rowsHtml
    +'<button onclick="winvGuardarFiltrados()" style="display:block;width:100%;margin-top:16px;background:var(--accent);border:none;border-radius:8px;padding:12px;color:#fff;font-size:14px;font-weight:700;cursor:pointer">Guardar stock</button>';
  grid._famArts = arts;
}

async function winvGuardarFiltrados(){
  var grid = document.getElementById('winv-grid');
  var arts = grid ? (grid._famArts||[]) : [];
  await winvGuardarArts(arts);
}

async function winvGuardar(arts){
  if(typeof arts === 'string') try{ arts = JSON.parse(arts); }catch(e){ arts=[]; }
  var grid = document.getElementById('winv-grid');
  if(grid && grid._famArts) arts = grid._famArts;
  await winvGuardarArts(arts);
}

async function winvGuardarArts(arts){
  var cont = document.getElementById('winv-contenido');
  var empleado = cont ? (cont._empleado||'Cocinero') : 'Cocinero';
  var guardados = 0;

  // Guardar en memoria global (no enviar aún a Supabase)
  arts.forEach(function(a){
    var input = document.getElementById('winv-stock-'+a.id);
    if(input && input.value !== ''){
      winvStockData[a.id] = { val: parseFloat(input.value), nombre: a.nombre, unidad: a.unidad||'', stock_minimo: a.stock_minimo };
      guardados++;
    }
  });

  if(!guardados){ showToast('No has introducido ningún valor.','orange'); return; }
  showToast(guardados+' artículo(s) guardados en memoria. Pulsa Enviar cuando acabes.','green');

  // Volver al grid de familias para que vea el botón Enviar
  var tipo = 'cocina';
  winvInit(tipo, empleado, cont ? (cont._localId||1) : 1);
}

async function winvEnviarTodo(){
  var cont = document.getElementById('winv-contenido');
  var empleado = cont ? (cont._empleado||'Cocinero') : 'Cocinero';
  var localId = cont ? (cont._localId||1) : 1;

  var ids = Object.keys(winvStockData);
  if(!ids.length){ showToast('No hay datos que enviar.','orange'); return; }

  var bajosDeMinimo = [];
  var promesas = ids.map(function(id){
    var d = winvStockData[id];
    var sMin = d.stock_minimo != null ? parseFloat(d.stock_minimo) : null;
    if(sMin !== null && d.val <= sMin) bajosDeMinimo.push({nombre:d.nombre, unidad:d.unidad, actual:d.val, minimo:sMin});
    return sbPatch('cmp_articulos', parseInt(id), {
      stock_actual: d.val,
      ultima_actualizacion: new Date().toISOString(),
      ultima_actualizacion_por: empleado
    });
  });

  try{
    await Promise.all(promesas);
    showToast('✅ Inventario enviado correctamente.','green');
    winvStockData = {}; // limpiar memoria
    winvInit('cocina', empleado, localId);
  }catch(e){
    showToast('Error enviando. Comprueba tu conexión.','red');
    return;
  }

  if(bajosDeMinimo.length){
    var lorena = (localStorage.getItem('rt_wa_lorena')||'').trim();
    var fecha = new Date().toLocaleDateString('es-ES',{day:'numeric',month:'long'});
    var lineas = bajosDeMinimo.map(function(x){ return '• '+x.nombre+': '+x.actual+' '+x.unidad+' — stock mínimo '+x.minimo+' '+x.unidad+' en cámara'; }).join('\n');
    var msg = '⚠ STOCK BAJO — Inventario Cocina '+fecha+'\n\n'+lineas+'\n\nPor favor, reponer antes del próximo servicio.';
    sbGet('empleados','nombre=eq.DOMINGO&local_id=eq.1&select=telefono').then(function(rows){
      var domingo = rows && rows[0] && rows[0].telefono ? rows[0].telefono.replace(/\s+/g,'') : '';
      if(lorena)  window.open('https://wa.me/'+lorena+'?text='+encodeURIComponent(msg),'_blank');
      if(domingo) setTimeout(function(){ window.open('https://wa.me/'+domingo+'?text='+encodeURIComponent(msg),'_blank'); }, 800);
    }).catch(function(){
      if(lorena) window.open('https://wa.me/'+lorena+'?text='+encodeURIComponent(msg),'_blank');
    });
  }
}


// ========== WORKER CHECKLIST v7.2 — acceso sin login via URL ==========
var wclTareas = [];
var wclFecha  = '';
var wclEmpleado = '';
var wclSeccion  = null;
var wclLocalId  = null;
var wclNotificado = false;

function checkWorkerChecklistUrl(){
  var params = new URLSearchParams(window.location.search);

  // Vista pública inventario: ?inv=cocina&empleado=BENITO&local=1
  var invType = params.get('inv');
  if(invType){
    var empInv  = decodeURIComponent(params.get('empleado') || '');
    var lidInv  = params.get('local') ? parseInt(params.get('local')) : 1;
    var loginEl = document.getElementById('login-screen');
    if(loginEl) loginEl.style.display = 'none';
    var view = document.getElementById('worker-inv-view');
    if(view) view.style.display = '';
    winvInit(invType, empInv, lidInv);
    return;
  }

  // New format: ?checklist=FECHA&empleado=EMP&seccion=GRUPO
  var checklist = params.get('checklist');
  var empleado  = params.get('empleado');
  var seccion   = params.get('seccion');
  // Legacy format: ?cl=FECHA&emp=EMP
  var cl  = params.get('cl');
  var emp = params.get('emp');

  var fecha, nombre, sec, lid;
  if(checklist && empleado){
    fecha  = checklist;
    nombre = decodeURIComponent(empleado);
    sec    = seccion ? decodeURIComponent(seccion) : null;
    lid    = params.get('local_id') ? parseInt(params.get('local_id')) : null;
  } else if(cl && emp){
    fecha  = cl;
    nombre = decodeURIComponent(emp);
    sec    = null;
    lid    = null;
  } else {
    return;
  }

  var soloParam = params.get('solo') || null;

  var loginEl = document.getElementById('login-screen');
  if(loginEl) loginEl.style.display = 'none';
  var view = document.getElementById('worker-cl-view');
  if(view) view.style.display = '';
  wclInit(fecha, nombre, sec, lid, soloParam);
}

async function wclInit(fecha, empleado, seccion, localId, solo){
  wclFecha      = fecha;
  wclEmpleado   = empleado;
  wclSeccion    = seccion ? seccion.toLowerCase() : null;
  wclLocalId    = localId || null;
  wclNotificado = false;
  var soloInv   = (solo === 'inventario');
  var GRUPO_LABELS = { barra:'Barra', sala:'Sala', cocina:'Cocina', almacen:'Almacén' };
  var seccionLabel = soloInv ? 'Inventario' : (seccion ? (GRUPO_LABELS[seccion.toLowerCase()] || seccion) : null);

  var tEl = document.getElementById('wcl-titulo');
  var eEl = document.getElementById('wcl-empleado-txt');
  var fEl = document.getElementById('wcl-fecha-txt');
  if(tEl) tEl.textContent = (soloInv ? '📦 Inventario al cierre de ' : '✅ Checklist de ') + empleado + (seccionLabel && !soloInv ? ' — ' + seccionLabel : '');
  if(eEl) eEl.textContent = '👤 ' + empleado + ' · ' + (soloInv ? 'Inventario' : (seccionLabel||''));
  if(fEl){
    var d = new Date(fecha + 'T12:00:00');
    fEl.textContent = d.toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  }
  try{
    var wclFiltro = 'fecha=eq.'+fecha+'&responsable=eq.'+encodeURIComponent(empleado)+'&order=posicion.asc';
    if(wclLocalId) wclFiltro += '&or=(local_id.eq.'+wclLocalId+',local_id.is.null)';
    var rows = await sbGet('checklist_diario', wclFiltro);
    if(rows && rows.length){
      var filtered = seccion
        ? rows.filter(function(r){ return (r.grupo||'').toLowerCase() === seccion.toLowerCase(); })
        : rows;
      wclTareas = filtered.map(function(r,i){
        var base = CL_TAREAS_BASE[r.posicion] || CL_TAREAS_BASE[i] || {};
        return {id:r.id, texto:r.tarea, grupo:r.grupo||base.grupo||'Sala', tipo:r.tipo||base.tipo||'check',
                hecha:!!r.completada, hora:r.hora_completado||'', posicion:r.posicion||0};
      });
    } else {
      var baseTasks = seccion
        ? CL_TAREAS_BASE.filter(function(t){ return t.grupo.toLowerCase() === seccion.toLowerCase(); })
        : CL_TAREAS_BASE;
      wclTareas = baseTasks.map(function(tarea,i){
        return {id:null, texto:tarea.texto, grupo:tarea.grupo, tipo:tarea.tipo, hecha:false, hora:'', posicion:i};
      });
    }
    // Si solo=inventario, filtrar únicamente esa tarea
    if(soloInv) wclTareas = wclTareas.filter(function(t){ return t.tipo === 'inventario'; });
  }catch(e){
    var baseTasks = seccion
      ? CL_TAREAS_BASE.filter(function(t){ return t.grupo.toLowerCase() === seccion.toLowerCase(); })
      : CL_TAREAS_BASE;
    wclTareas = baseTasks.map(function(tarea,i){
      return {id:null, texto:tarea.texto, grupo:tarea.grupo, tipo:tarea.tipo, hecha:false, hora:'', posicion:i};
    });
    if(soloInv) wclTareas = wclTareas.filter(function(t){ return t.tipo === 'inventario'; });
  }
  wclRender();
}

function wclRender(){
  var cont = document.getElementById('wcl-tareas');
  if(!cont) return;
  if(!Array.isArray(wclTareas)) wclTareas = [];
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
  var allDone = (hechas === total && total > 0);
  var ok = document.getElementById('wcl-completo');
  if(ok) ok.style.display = allDone ? '' : 'none';
  var btnConf = document.getElementById('wcl-btn-confirmar');
  if(btnConf) btnConf.style.display = allDone ? '' : 'none';
}

function wclConfirmarYEnviar(){
  var btn = document.getElementById('wcl-btn-confirmar');
  if(btn){ btn.disabled = true; btn.textContent = '✅ Enviado'; }

  var lorena = (localStorage.getItem('rt_wa_lorena') || '').trim();
  console.log('[WA Lorena] rt_wa_lorena:', lorena || '(vacío)');
  if(!lorena){
    lorena = (localStorage.getItem('cfg-wa-lorena') || '').trim(); // fallback clave incorrecta
    if(lorena) console.log('[WA Lorena] encontrado en clave alternativa cfg-wa-lorena:', lorena);
  }
  if(!lorena){
    var inputLor = document.getElementById('cfg-wa-lorena');
    lorena = inputLor ? (inputLor.value || '').replace(/\s+/g,'') : '';
    if(lorena) console.log('[WA Lorena] encontrado en input DOM:', lorena);
  }
  console.log('[WA Lorena] número final:', lorena || '(no configurado)');
  var GRUPO_LABELS = { barra:'Barra', sala:'Sala', cocina:'Cocina', almacen:'Almacén' };
  var secLabel = wclSeccion ? (GRUPO_LABELS[wclSeccion] || wclSeccion) : 'su sección';
  var d = new Date(wclFecha + 'T12:00:00');
  var fechaFmt = d.toLocaleDateString('es-ES', { day:'numeric', month:'long' });
  var hora = new Date().toLocaleTimeString('es-ES', { hour:'2-digit', minute:'2-digit' });
  var msg = wclEmpleado + ' ha completado el checklist de ' + secLabel + ' ✅ — ' + fechaFmt + ' ' + hora;

  if(lorena){
    window.open('https://wa.me/' + lorena + '?text=' + encodeURIComponent(msg), '_blank');
  } else {
    // No Lorena number configured — copy message to clipboard as fallback
    navigator.clipboard.writeText(msg).catch(function(){});
    alert('Número de Lorena no configurado en Ajustes.\nMensaje copiado: ' + msg);
  }
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
        posicion:tarea.posicion, local_id:wclLocalId||null, nota_dia:null,
        grupo:tarea.grupo||null, tipo:tarea.tipo||'check'
      });
      if(result && result[0]) tarea.id = result[0].id;
    }
  }catch(e){ console.warn('wcl save:', e); }
}

function clEnviarWAGrupo(grupo){
  var fecha = clFechaISO();
  var emp = clResponsablesGrupo[grupo] || '';
  if(!emp){ showToast('Asigna primero un responsable a esta sección', 'orange'); return; }

  var GRUPO_LABELS = { Barra:'Barra', Sala:'Sala', Cocina:'Cocina', Almacen:'Almacén' };
  var seccion = grupo.toLowerCase();
  var localId = currentUser ? currentUser.local_id : '';
  var url = location.origin + location.pathname
    + '?checklist=' + fecha
    + '&empleado=' + encodeURIComponent(emp)
    + '&seccion=' + encodeURIComponent(seccion)
    + (localId ? '&local_id=' + localId : '');
  var msg = 'Hola ' + emp + '! 👋 Aquí tienes tu checklist de ' + (GRUPO_LABELS[grupo]||grupo) + ' para hoy:\n' + url;

  var telefono = '';
  if(window._empleadosBDDatos && window._empleadosBDDatos[emp]){
    telefono = (window._empleadosBDDatos[emp].telefono || '').replace(/[\s\-()]/g, '');
  }
  if(telefono && !telefono.startsWith('+') && /^[67]\d{8}$/.test(telefono)){
    telefono = '34' + telefono;
  }
  var waUrl = telefono
    ? 'https://wa.me/' + telefono + '?text=' + encodeURIComponent(msg)
    : 'https://wa.me/?text=' + encodeURIComponent(msg);

  window.open(waUrl, '_blank');
  showToast('Abriendo WhatsApp para ' + emp + ' (' + (GRUPO_LABELS[grupo]||grupo) + ')', 'green');
}

// ========== CUADRANTE AUTO-LOAD v7.11 ==========

async function abrirCuadrante(){
  // 1. Sincronizar local-select con localActivoId
  var nombreLocal = LOCALES_NOMBRE[localActivoId] || 'La Cala';
  var sel = document.getElementById('local-select');
  if(sel){
    sel.value = nombreLocal;
    onLocalChange();
  }

  // 2. Construir lista de semanas si está vacía y seleccionar la semana actual
  var fi = document.getElementById('fecha-inicio');
  if(fi && !fi.options.length) buildFechas();
  if(fi && fi.options.length){
    var today  = new Date();
    var monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    var mejor = null, mejorDiff = Infinity;
    for(var i = 0; i < fi.options.length; i++){
      var diff = Math.abs(new Date(fi.options[i].value) - monday);
      if(diff < mejorDiff){ mejorDiff = diff; mejor = i; }
    }
    if(mejor !== null) fi.selectedIndex = mejor;
  }

  updateHeader();

  // 3. Cargar empleados si no están
  if(!empleados.length) await cargarEmpleadosBD();
  if(!turnosConfig.length) buildTurnosConfig();

  // 4. Intentar cargar cuadrante guardado; si no hay, ir al wizard
  showToast('Cargando cuadrante...', 'orange');
  try{
    var cuadId = await cargarCuadrantePrevio();
    if(cuadId && empleados.length > 0){
      sugerirYRenderizar();
      generarCuadrante();
      goStep(6);
      showToast('Cuadrante cargado desde BD', 'green');
    } else {
      goStep(1);
      showToast(cuadId ? 'Cuadrante encontrado pero sin empleados — revisa Gestión Equipo' : 'No hay cuadrante guardado para este local — empieza uno nuevo', 'orange');
    }
  }catch(e){
    goStep(1);
    showToast('Error cargando cuadrante: ' + e.message, 'red');
  }
}




var CMP_FAMILIAS_DEFAULT = [
  {id:1, nombre:'Carnes',      emoji:'🥩'},
  {id:2, nombre:'Pescados',    emoji:'🐟'},
  {id:3, nombre:'Verduras',    emoji:'🥦'},
  {id:4, nombre:'Frutas',      emoji:'🍎'},
  {id:5, nombre:'Lácteos',     emoji:'🥛'},
  {id:6, nombre:'Secos',       emoji:'🌾'},
  {id:7, nombre:'Congelados',  emoji:'🧊'},
  {id:8, nombre:'Condimentos', emoji:'🧂'}
];

function cmpCargarDatos(){
  try{ cmpFamilias    = JSON.parse(localStorage.getItem('rt_cmp_familias')    || '[]'); }catch(e){ cmpFamilias=[]; }
  if(!cmpFamilias.length){
    cmpFamilias = CMP_FAMILIAS_DEFAULT.map(function(f){ return Object.assign({}, f); });
    localStorage.setItem('rt_cmp_familias', JSON.stringify(cmpFamilias));
  }
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
  cmpCargarDatos(); // carga localStorage como caché inicial
  cmpTabActual = 'articulos';
  document.querySelectorAll('.cmp-tab').forEach(function(b){ b.classList.remove('active'); });
  var tabBtn = document.getElementById('cmp-tab-articulos');
  if(tabBtn) tabBtn.classList.add('active');
  document.querySelectorAll('.cmp-panel').forEach(function(p){ p.classList.remove('active'); });
  var panel = document.getElementById('cmp-panel-articulos');
  if(panel) panel.classList.add('active');
  cmpRenderArticulos();
  // Sincronizar desde Supabase en segundo plano
  cmpSincronizarDesdeSupabase();
}

async function cmpSincronizarDesdeSupabase(){
  try{
    var arts  = await sbGet('cmp_articulos',  'order=nombre.asc');
    var provs = await sbGet('cmp_proveedores','order=nombre.asc');
    var fams  = await sbGet('cmp_familias',   'order=nombre.asc');
    if(arts  && arts.length)  { cmpArticulos   = arts;  localStorage.setItem('rt_cmp_articulos',   JSON.stringify(arts)); }
    if(provs && provs.length) { cmpProveedores = provs; localStorage.setItem('rt_cmp_proveedores', JSON.stringify(provs)); }
    if(fams  && fams.length)  { cmpFamilias    = fams;  localStorage.setItem('rt_cmp_familias',    JSON.stringify(fams)); }
    cmpRenderArticulos();
    cmpRenderProveedores();
  }catch(e){ console.warn('[Compras] Error sincronizando Supabase:', e); }
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
  if(tab === 'facturas')    cmpRenderFacturas();
}

function cmpRenderFacturas(){
  var cont = document.getElementById('cmp-facturas-content');
  if(!cont) return;
  cont.innerHTML =
    '<div style="text-align:center;padding:32px 16px">'
    +'<div style="font-size:40px;margin-bottom:12px">🧾</div>'
    +'<div style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:8px">Subir factura</div>'
    +'<div style="font-size:13px;color:var(--muted);margin-bottom:20px">Haz una foto o sube una imagen de la factura.<br>La IA extraerá los artículos y actualizará precios y stock automáticamente.</div>'
    +'<label for="cmp-factura-input" style="display:inline-block;background:var(--accent);color:#fff;border-radius:10px;padding:12px 24px;font-size:14px;font-weight:700;cursor:pointer">📷 Seleccionar factura</label>'
    +'<input type="file" id="cmp-factura-input" accept="image/*" capture="environment" style="display:none" onchange="cmpFacturaSeleccionada(this)">'
    +'</div>';
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
    + '<th style="padding:8px 6px;text-align:right">Stock mín.</th>'
    + '<th style="padding:8px 6px;text-align:right">Stock actual</th>'
    + '<th style="padding:8px 6px;text-align:center">Acciones</th>'
    + '</tr></thead><tbody>'
    + lista.map(function(a){
        var coste  = parseFloat(a.precio_compra) || 0;
        var pvp    = parseFloat(a.precio_venta)  || 0;
        var margen = pvp > 0 ? Math.round(((pvp - coste) / pvp) * 100) : null;
        var mColor = margen === null ? 'var(--muted)' : (margen >= 60 ? '#2ecc71' : margen >= 40 ? '#f39c12' : '#e74c3c');
        var sMin = a.stock_minimo != null ? parseFloat(a.stock_minimo) : null;
        var sAct = a.stock_actual  != null ? parseFloat(a.stock_actual)  : null;
        var sColor = (sMin !== null && sAct !== null) ? (sAct <= sMin ? '#e74c3c' : '#2ecc71') : 'inherit';
        return '<tr style="border-top:1px solid var(--border)">'
          + '<td style="padding:8px 6px;font-weight:600">'+a.nombre+'</td>'
          + '<td style="padding:8px 6px;color:var(--muted)">'+cmpNombreFamilia(a.familia_id)+'</td>'
          + '<td style="padding:8px 6px;color:var(--muted)">'+cmpNombreProveedor(a.proveedor_id)+'</td>'
          + '<td style="padding:8px 6px;text-align:right;color:var(--red)">'+(coste ? coste.toFixed(2)+' €' : '—')+'</td>'
          + '<td style="padding:8px 6px;text-align:right">'+(pvp ? pvp.toFixed(2)+' €' : '—')+'</td>'
          + '<td style="padding:8px 6px;text-align:right;font-weight:700;color:'+mColor+'">'+(margen !== null ? margen+'%' : '—')+'</td>'
          + '<td style="padding:8px 6px;text-align:right;color:var(--muted)">'+(sMin !== null ? sMin : '—')+'</td>'
          + '<td style="padding:8px 6px;text-align:right;font-weight:700;color:'+sColor+'">'+(sAct !== null ? sAct : '—')+'</td>'
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
          + '<td style="padding:8px 6px">'+(p.telefono ? '<a href="tel:'+p.telefono+'" style="color:var(--accent)">'+p.telefono+'</a>' : '—')+'</td>'
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
        var pvp    = art ? (parseFloat(art.precio_venta) || 0) : 0;
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
  var artsConPvp = cmpArticulos.filter(function(a){ return parseFloat(a.precio_venta) > 0 && parseFloat(a.precio_compra) > 0; });
  var margenMedio = artsConPvp.length
    ? Math.round(artsConPvp.reduce(function(s,a){
        var pvp = parseFloat(a.precio_venta), c = parseFloat(a.precio_compra);
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
    var arts = cmpArticulos.filter(function(a){ return parseFloat(a.precio_venta) > 0 && parseFloat(a.precio_compra) > 0; })
      .map(function(a){
        var pvp = parseFloat(a.precio_venta), c = parseFloat(a.precio_compra);
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
      if(parseFloat(a.precio_venta) > 0 && parseFloat(a.precio_compra) > 0){
        var pvp = parseFloat(a.precio_venta), c = parseFloat(a.precio_compra);
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
    var arts = cmpArticulos.filter(function(a){ return parseInt(a.unidades_semana) > 0; })
      .sort(function(a,b){ return parseInt(b.unidades_semana) - parseInt(a.unidades_semana); });
    if(!arts.length){ cont.innerHTML = '<div style="color:var(--muted);font-size:13px;padding:20px">Añade unidades vendidas/semana a los artículos para ver el ranking.</div>'; return; }
    cont.innerHTML = arts.map(function(a, i){
      var pvp = parseFloat(a.precio_venta)||0, v = parseInt(a.unidades_semana)||0;
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

function cmpCerrarModales(){
  ['cmp-modal-articulo','cmp-modal-proveedor','cmp-modal-precio','cmp-modal-familia','cmp-modal-import']
    .forEach(function(id){ var el=document.getElementById(id); if(el) el.style.display='none'; });
}

function cmpSiguienteId(arr){
  return arr.length ? Math.max.apply(null, arr.map(function(x){ return x.id||0; })) + 1 : 1;
}

// ---- FAMILIA ----
function cmpAbrirModalFamilia(){
  var el = document.getElementById('cmp-modal-familia');
  if(!el) return;
  document.getElementById('cmp-fam-nombre').value = '';
  document.getElementById('cmp-fam-emoji').value  = '';
  el.style.display = 'flex';
}

function cmpGuardarFamilia(){
  var nombre = (document.getElementById('cmp-fam-nombre').value||'').trim();
  if(!nombre){ showToast('Escribe el nombre de la familia', 'red'); return; }
  cmpFamilias.push({ id: cmpSiguienteId(cmpFamilias), nombre: nombre,
    emoji: (document.getElementById('cmp-fam-emoji').value||'').trim() });
  cmpGuardarDatos();
  cmpCerrarModales();
  cmpRenderArticulos();
  showToast('Familia guardada', 'green');
}

// ---- PROVEEDOR ----
function cmpAbrirModalProveedor(id){
  var el = document.getElementById('cmp-modal-proveedor');
  if(!el) return;
  var p = id ? cmpProveedores.find(function(x){ return x.id===id; }) : null;
  document.getElementById('cmp-prov-id').value       = p ? p.id : '';
  document.getElementById('cmp-prov-nombre').value   = p ? p.nombre    : '';
  document.getElementById('cmp-prov-razon').value    = p ? p.razon_social : '';
  document.getElementById('cmp-prov-cif').value      = p ? p.cif          : '';
  document.getElementById('cmp-prov-tel').value      = p ? p.telefono     : '';
  document.getElementById('cmp-prov-email').value    = p ? p.email     : '';
  document.getElementById('cmp-prov-contacto').value = p ? p.contacto  : '';
  document.getElementById('cmp-prov-direccion').value= p ? p.direccion : '';
  document.getElementById('cmp-prov-notas').value    = p ? p.notas     : '';
  document.getElementById('cmp-modal-prov-titulo').textContent = p ? '🏭 Editar Proveedor' : '🏭 Nuevo Proveedor';
  el.style.display = 'flex';
}

function cmpGuardarProveedor(){
  var nombre = (document.getElementById('cmp-prov-nombre').value||'').trim();
  if(!nombre){ showToast('El nombre del proveedor es obligatorio', 'red'); return; }
  var idVal = document.getElementById('cmp-prov-id').value;
  var obj = {
    id:        idVal ? parseInt(idVal) : cmpSiguienteId(cmpProveedores),
    nombre:    nombre,
    razon_social: (document.getElementById('cmp-prov-razon').value||'').trim(),
    cif:          (document.getElementById('cmp-prov-cif').value||'').trim(),
    telefono:     (document.getElementById('cmp-prov-tel').value||'').trim(),
    email:     (document.getElementById('cmp-prov-email').value||'').trim(),
    contacto:  (document.getElementById('cmp-prov-contacto').value||'').trim(),
    direccion: (document.getElementById('cmp-prov-direccion').value||'').trim(),
    notas:     (document.getElementById('cmp-prov-notas').value||'').trim()
  };
  if(idVal){
    var idx = cmpProveedores.findIndex(function(x){ return x.id===parseInt(idVal); });
    if(idx>=0) cmpProveedores[idx] = obj;
  } else {
    cmpProveedores.push(obj);
  }
  cmpGuardarDatos();
  cmpCerrarModales();
  cmpRenderProveedores();
  showToast('Proveedor guardado', 'green');
}

function cmpEliminarProveedor(id){
  if(!confirm('¿Eliminar este proveedor?')) return;
  cmpProveedores = cmpProveedores.filter(function(x){ return x.id!==id; });
  cmpGuardarDatos();
  cmpRenderProveedores();
  showToast('Proveedor eliminado', 'orange');
  sbDelete('cmp_proveedores', 'id=eq.'+id)
    .then(function(){ console.log('[cmpEliminarProveedor] eliminado de Supabase id='+id); })
    .catch(function(e){ console.error('[cmpEliminarProveedor] error Supabase:', e.message); });
}

// ---- ARTÍCULO ----
function cmpAbrirModalArticulo(id){
  var el = document.getElementById('cmp-modal-articulo');
  if(!el) return;
  var a = id ? cmpArticulos.find(function(x){ return x.id===id; }) : null;

  // Rellenar familias
  var famSel = document.getElementById('cmp-art-familia');
  famSel.innerHTML = '<option value="">— Sin familia —</option>'
    + cmpFamilias.map(function(f){
        return '<option value="'+f.id+'"'+(a && a.familia_id===f.id?' selected':'')+'>'+
               (f.emoji||'')+(f.emoji?' ':'')+f.nombre+'</option>';
      }).join('');

  // Rellenar proveedores
  var provSel = document.getElementById('cmp-art-proveedor');
  provSel.innerHTML = '<option value="">— Sin proveedor —</option>'
    + cmpProveedores.map(function(p){
        return '<option value="'+p.id+'"'+(a && a.proveedor_id===p.id?' selected':'')+'>'+p.nombre+'</option>';
      }).join('');

  document.getElementById('cmp-art-id').value             = a ? a.id : '';
  document.getElementById('cmp-art-nombre').value         = a ? a.nombre          : '';
  document.getElementById('cmp-art-precio-compra').value  = a ? a.precio_compra   : '';
  document.getElementById('cmp-art-unidad').value         = a ? (a.unidad||'ud')  : 'ud';
  document.getElementById('cmp-art-local').value          = a ? (a.local_id||'1') : (currentUser ? currentUser.local_id||'1' : '1');
  document.getElementById('cmp-art-pvp').value            = a ? a.precio_venta    : '';
  document.getElementById('cmp-art-ventas').value         = a ? a.unidades_semana : '';
  document.getElementById('cmp-art-stock-minimo').value   = a && a.stock_minimo != null ? a.stock_minimo : '';
  document.getElementById('cmp-art-stock-actual').value   = a && a.stock_actual  != null ? a.stock_actual  : '';
  document.getElementById('cmp-art-desc').value           = a ? a.descripcion     : '';
  document.getElementById('cmp-modal-art-titulo').textContent = a ? '📦 Editar Artículo' : '📦 Nuevo Artículo';
  document.getElementById('cmp-art-margen-preview').style.display = 'none';
  el.style.display = 'flex';
  cmpCalcMargenModal();
}

function cmpCalcMargenModal(){
  var coste = parseFloat(document.getElementById('cmp-art-precio-compra').value) || 0;
  var pvp   = parseFloat(document.getElementById('cmp-art-pvp').value)           || 0;
  var prev  = document.getElementById('cmp-art-margen-preview');
  if(!prev) return;
  if(coste > 0 && pvp > 0){
    var margen = ((pvp - coste) / pvp * 100).toFixed(1);
    var col    = parseFloat(margen) >= 60 ? '#2ecc71' : parseFloat(margen) >= 40 ? '#f39c12' : '#e74c3c';
    document.getElementById('cmp-am-pvp').textContent    = pvp.toFixed(2) + ' €';
    document.getElementById('cmp-am-coste').textContent  = coste.toFixed(2) + ' €';
    document.getElementById('cmp-am-margen').textContent = margen + '%';
    document.getElementById('cmp-am-margen').style.color = col;
    prev.style.display = '';
  } else {
    prev.style.display = 'none';
  }
}

function cmpGuardarArticulo(){
  var nombre = (document.getElementById('cmp-art-nombre').value||'').trim();
  if(!nombre){ showToast('El nombre del artículo es obligatorio', 'red'); return; }
  var idVal = document.getElementById('cmp-art-id').value;
  var famId  = document.getElementById('cmp-art-familia').value;
  var provId = document.getElementById('cmp-art-proveedor').value;
  var obj = {
    id:           idVal ? parseInt(idVal) : cmpSiguienteId(cmpArticulos),
    nombre:       nombre,
    familia_id:   famId  ? parseInt(famId)  : null,
    proveedor_id: provId ? parseInt(provId) : null,
    precio_compra:(document.getElementById('cmp-art-precio-compra').value||'').trim(),
    unidad:       document.getElementById('cmp-art-unidad').value,
    local_id:     parseInt(document.getElementById('cmp-art-local').value)||1,
    precio_venta:   (document.getElementById('cmp-art-pvp').value||'').trim(),
    unidades_semana:(document.getElementById('cmp-art-ventas').value||'').trim(),
    stock_minimo:   document.getElementById('cmp-art-stock-minimo').value !== '' ? parseFloat(document.getElementById('cmp-art-stock-minimo').value) : null,
    stock_actual:   document.getElementById('cmp-art-stock-actual').value  !== '' ? parseFloat(document.getElementById('cmp-art-stock-actual').value)  : null,
    descripcion:    (document.getElementById('cmp-art-desc').value||'').trim()
  };
  if(idVal){
    var idx = cmpArticulos.findIndex(function(x){ return x.id===parseInt(idVal); });
    if(idx>=0) cmpArticulos[idx] = obj;
  } else {
    cmpArticulos.push(obj);
  }
  cmpGuardarDatos();
  cmpCerrarModales();
  cmpRenderArticulos();
  showToast('Artículo guardado', 'green');
}

function cmpEliminarArticulo(id){
  if(!confirm('¿Eliminar este artículo?')) return;
  cmpArticulos = cmpArticulos.filter(function(x){ return x.id!==id; });
  cmpGuardarDatos();
  cmpRenderArticulos();
  showToast('Artículo eliminado', 'orange');
  sbDelete('cmp_articulos', 'id=eq.'+id)
    .then(function(){ console.log('[cmpEliminarArticulo] eliminado de Supabase id='+id); })
    .catch(function(e){ console.error('[cmpEliminarArticulo] error Supabase:', e.message); });
}

// ---- PRECIO ----
function cmpAbrirModalPrecio(id){
  var el = document.getElementById('cmp-modal-precio');
  if(!el) return;
  var pr = id ? cmpPrecios.find(function(x){ return x.id===id; }) : null;

  var artSel = document.getElementById('cmp-precio-art-sel');
  artSel.innerHTML = '<option value="">— Seleccionar artículo —</option>'
    + cmpArticulos.map(function(a){
        return '<option value="'+a.id+'"'+(pr && pr.articulo_id===a.id?' selected':'')+'>'+a.nombre+'</option>';
      }).join('');

  var provSel = document.getElementById('cmp-precio-prov-sel');
  provSel.innerHTML = '<option value="">— Seleccionar proveedor —</option>'
    + cmpProveedores.map(function(p){
        return '<option value="'+p.id+'"'+(pr && pr.proveedor_id===p.id?' selected':'')+'>'+p.nombre+'</option>';
      }).join('');

  document.getElementById('cmp-precio-id').value      = pr ? pr.id    : '';
  document.getElementById('cmp-precio-compra').value  = pr ? pr.precio : '';
  document.getElementById('cmp-precio-fecha').value   = pr ? pr.fecha  : new Date().toISOString().split('T')[0];
  document.getElementById('cmp-precio-notas').value   = pr ? pr.notas  : '';
  document.getElementById('cmp-precio-margen-preview').style.display = 'none';
  el.style.display = 'flex';
  cmpCalcMargen();
}

function cmpCalcMargen(){
  var artId = document.getElementById('cmp-precio-art-sel').value;
  var coste = parseFloat(document.getElementById('cmp-precio-compra').value) || 0;
  var art   = artId ? cmpArticulos.find(function(a){ return a.id===parseInt(artId); }) : null;
  var pvp   = art ? (parseFloat(art.precio_venta)||0) : 0;
  var prev  = document.getElementById('cmp-precio-margen-preview');
  if(!prev) return;
  if(pvp > 0 && coste > 0){
    var margen = ((pvp - coste) / pvp * 100).toFixed(1);
    var col    = parseFloat(margen) >= 60 ? '#2ecc71' : parseFloat(margen) >= 40 ? '#f39c12' : '#e74c3c';
    document.getElementById('cmp-pm-pvp').textContent    = pvp.toFixed(2) + ' €';
    document.getElementById('cmp-pm-coste').textContent  = coste.toFixed(2) + ' €';
    document.getElementById('cmp-pm-margen').textContent = margen + '%';
    document.getElementById('cmp-pm-margen').style.color = col;
    prev.style.display = '';
  } else {
    prev.style.display = 'none';
  }
}

function cmpGuardarPrecio(){
  var artId  = document.getElementById('cmp-precio-art-sel').value;
  var provId = document.getElementById('cmp-precio-prov-sel').value;
  var precio = (document.getElementById('cmp-precio-compra').value||'').trim();
  if(!artId || !precio){ showToast('Selecciona artículo y precio', 'red'); return; }
  var idVal = document.getElementById('cmp-precio-id').value;
  var obj = {
    id:          idVal ? parseInt(idVal) : cmpSiguienteId(cmpPrecios),
    articulo_id: parseInt(artId),
    proveedor_id:provId ? parseInt(provId) : null,
    precio:      precio,
    fecha:       document.getElementById('cmp-precio-fecha').value || new Date().toISOString().split('T')[0],
    notas:       (document.getElementById('cmp-precio-notas').value||'').trim()
  };
  if(idVal){
    var idx = cmpPrecios.findIndex(function(x){ return x.id===parseInt(idVal); });
    if(idx>=0) cmpPrecios[idx] = obj;
  } else {
    cmpPrecios.push(obj);
  }
  cmpGuardarDatos();
  cmpCerrarModales();
  cmpRenderPrecios();
  showToast('Precio guardado', 'green');
}

function cmpEliminarPrecio(id){
  if(!confirm('¿Eliminar este precio?')) return;
  cmpPrecios = cmpPrecios.filter(function(x){ return x.id!==id; });
  cmpGuardarDatos();
  cmpRenderPrecios();
  showToast('Precio eliminado', 'orange');
}

// ---- EXPORTAR ----
function cmpExportar(tipo){
  var rows, cols;
  if(tipo==='articulos'){
    cols = ['id','nombre','familia','proveedor','precio_compra','precio_venta','unidad','local_id','unidades_semana','descripcion'];
    rows = cmpArticulos.map(function(a){
      return [a.id, a.nombre, cmpNombreFamilia(a.familia_id), cmpNombreProveedor(a.proveedor_id),
              a.precio_compra, a.precio_venta, a.unidad, a.local_id, a.unidades_semana, a.descripcion].join(',');
    });
  } else {
    cols = ['id','nombre','cif','telefono','email','contacto','direccion','notas'];
    rows = cmpProveedores.map(function(p){
      return [p.id, p.nombre, p.cif, p.telefono, p.email, p.contacto, p.direccion, p.notas].join(',');
    });
  }
  var csv = cols.join(',') + '\n' + rows.join('\n');
  var blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  var url  = URL.createObjectURL(blob);
  var a    = document.createElement('a');
  a.href = url; a.download = 'compras_' + tipo + '_' + new Date().toISOString().split('T')[0] + '.csv';
  a.click(); URL.revokeObjectURL(url);
  showToast('Exportado como CSV', 'green');
}

// ---- IMPORTAR (CSV simple) ----
function cmpAbrirImport(tipo){
  var el = document.getElementById('cmp-modal-import');
  if(!el) return;
  el.dataset.tipo = tipo;
  document.getElementById('cmp-import-titulo').textContent = '📥 Importar ' + tipo;
  var colsMap = { articulos: 'nombre, precio_compra, pvp, unidad (opcional)', proveedores: 'nombre, tel, email (opcionales)' };
  document.getElementById('cmp-import-cols').textContent  = colsMap[tipo] || '';
  document.getElementById('cmp-import-preview').style.display = 'none';
  document.getElementById('cmp-import-btn-ok').style.display  = 'none';
  var fi = document.getElementById('cmp-import-file');
  if(fi) fi.value = '';
  el.style.display = 'flex';
}

function cmpDescargarPlantilla(){
  var tipo = (document.getElementById('cmp-modal-import')||{}).dataset && document.getElementById('cmp-modal-import').dataset.tipo;
  var csv  = tipo === 'proveedores'
    ? 'nombre,tel,email,contacto,cif,direccion,notas\nEjemplo S.L.,93 000 00 00,pedidos@ejemplo.com,Juan,B12345678,Calle Mayor 1,Reparte lunes'
    : 'nombre,precio_compra,pvp,unidad,ventas_semana\nAceite Oliva 5L,12.50,28.00,l,3';
  var blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  var url  = URL.createObjectURL(blob); var a = document.createElement('a');
  a.href = url; a.download = 'plantilla_' + (tipo||'articulos') + '.csv'; a.click(); URL.revokeObjectURL(url);
}

function cmpDropImport(ev){
  ev.preventDefault();
  var file = ev.dataTransfer && ev.dataTransfer.files && ev.dataTransfer.files[0];
  if(file) cmpLeerImport({ files: [file] });
}

function cmpLeerImport(input){
  var file = input.files && input.files[0];
  if(!file) return;
  var reader = new FileReader();
  reader.onload = function(e){
    var text  = e.target.result;
    var lines = text.split(/\r?\n/).filter(function(l){ return l.trim(); });
    if(lines.length < 2){ showToast('El archivo está vacío o sin datos', 'red'); return; }
    var headers = lines[0].split(',').map(function(h){ return h.trim().toLowerCase(); });
    var datos   = lines.slice(1).map(function(line){
      var vals = line.split(',');
      var obj  = {};
      headers.forEach(function(h,i){ obj[h] = (vals[i]||'').trim(); });
      return obj;
    }).filter(function(o){ return o.nombre; });

    document.getElementById('cmp-import-preview-titulo').textContent = datos.length + ' registros encontrados';
    var tipo = document.getElementById('cmp-modal-import').dataset.tipo;
    var cols = tipo === 'proveedores' ? ['nombre','tel','email'] : ['nombre','precio_compra','pvp','unidad'];
    var table = document.getElementById('cmp-import-preview-table');
    table.innerHTML = '<thead><tr>'+cols.map(function(c){ return '<th style="padding:4px 8px;font-size:11px;color:var(--muted)">'+c+'</th>'; }).join('')+'</tr></thead>'
      + '<tbody>'+datos.slice(0,10).map(function(d){
          return '<tr>'+cols.map(function(c){ return '<td style="padding:4px 8px;font-size:12px">'+( d[c]||'—')+'</td>'; }).join('')+'</tr>';
        }).join('')+'</tbody>';
    document.getElementById('cmp-import-preview').style.display = '';
    document.getElementById('cmp-import-count').textContent = datos.length;
    document.getElementById('cmp-import-btn-ok').style.display = '';
    document.getElementById('cmp-modal-import').dataset.pendiente = JSON.stringify(datos);
  };
  reader.readAsText(file);
}

function cmpEjecutarImport(){
  var tipo   = document.getElementById('cmp-modal-import').dataset.tipo;
  var datos  = JSON.parse(document.getElementById('cmp-modal-import').dataset.pendiente || '[]');
  if(!datos.length) return;
  datos.forEach(function(d){
    if(tipo === 'proveedores'){
      cmpProveedores.push({ id: cmpSiguienteId(cmpProveedores), nombre: d.nombre, telefono: d.telefono||'',
        email: d.email||'', cif: d.cif||'', contacto: d.contacto||'', direccion: d.direccion||'', notas: d.notas||'' });
    } else {
      cmpArticulos.push({ id: cmpSiguienteId(cmpArticulos), nombre: d.nombre, familia_id: null,
        proveedor_id: null, precio_compra: d.precio_compra||'', precio_venta: d.precio_venta||'',
        unidad: d.unidad||'ud', local_id: currentUser ? currentUser.local_id||1 : 1,
        unidades_semana: d.unidades_semana||'', descripcion: '' });
    }
  });
  cmpGuardarDatos();
  cmpCerrarModales();
  tipo === 'proveedores' ? cmpRenderProveedores() : cmpRenderArticulos();
  showToast(datos.length + ' registros importados', 'green');
}

// ========== Detectar modo trabajador al cargar la página
(function(){
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', checkWorkerChecklistUrl);
  } else {
    checkWorkerChecklistUrl();
  }
})();
