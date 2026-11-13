import React, { useState } from 'react';

export default function AuthAndRegistration({ onBack }) {
  const API_URL = "http://localhost/api.php";

  const [mode, setMode] = useState('login'); 
  const [authData, setAuthData] = useState({ usuario: '', password: '' });
  const [userId, setUserId] = useState(null);
  const [userRol, setUserRol] = useState('acudiente');
  
  const [jugadorProfile, setJugadorProfile] = useState(null);
  const [evaluacionData, setEvaluacionData] = useState(null);
  const [playersList, setPlayersList] = useState([]);
  const [allUsersList, setAllUsersList] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const [adminTab, setAdminTab] = useState('create_trainer');
  const [newTrainer, setNewTrainer] = useState({ usuario: '', password: '' });
  const [resetPassData, setResetPassData] = useState({ usuario_id: '', new_password: '' });
  const [editPlayerData, setEditPlayerData] = useState(null);

  const [formData, setFormData] = useState({
    acudiente_nombre: '', acudiente_apellido: '', acudiente_cedula: '',
    acudiente_telefono: '', acudiente_correo: '', acudiente_direccion: '',
    ciudad: 'Cali', acepta_politicas: false, jugador_nombre: '', jugador_apellido: '',
    jugador_edad: '', jugador_telefono: '', jugador_correo: '',
    posicion: 'Delantero Centro', foto_url: '', peso_kg: '', altura_cm: ''
  });

  const [ratings, setRatings] = useState({
    control_orientado: 8, pase_corto_largo: 7, remate_definicion: 8,
    regate_1v1: 9, vision_juego: 7, posicionamiento: 8,
    resistencia_aerobica: 8, velocidad_explosiva: 9, fuerza_duelos: 7, disciplina_tactica: 9
  });

  const METRIC_LABELS = {
    control_orientado: 'Control Orientado',
    pase_corto_largo: 'Pase Corto / Largo',
    remate_definicion: 'Remate y Definición',
    regate_1v1: 'Regate 1v1',
    vision_juego: 'Visión de Juego',
    posicionamiento: 'Posicionamiento Táctico',
    resistencia_aerobica: 'Resistencia Aeróbica',
    velocidad_explosiva: 'Velocidad Explosiva',
    fuerza_duelos: 'Fuerza en Duelos',
    disciplina_tactica: 'Disciplina Táctica'
  };

  // Muestra el apellido solo si es un texto válido (diferente a "0" o vacíos)
  const obtenerApellidoValido = (apellido) => {
    if (!apellido || apellido === '0' || apellido === 0 || String(apellido).trim() === '') {
      return '';
    }
    return apellido;
  };

  // Muestra la ciudad válida
  const obtenerCiudadValida = (ciudad) => {
    if (!ciudad || ciudad === '0' || ciudad === 0 || String(ciudad).trim() === '') {
      return 'No especificada';
    }
    return ciudad;
  };

  const calcularIMC = (pesoIn, alturaIn) => {
    const peso = parseFloat(pesoIn || formData.peso_kg);
    let alturaInput = parseFloat(alturaIn || formData.altura_cm);
    if (peso > 0 && alturaInput > 0) {
      if (alturaInput < 3) alturaInput = alturaInput * 100;
      const alturaM = alturaInput / 100;
      const imcVal = peso / (alturaM * alturaM);
      if (imcVal > 99.99 || isNaN(imcVal)) return { imc: "--", estado: "Fuera de rango" };
      const imc = imcVal.toFixed(2);
      let estado = imc < 18.5 ? "Bajo peso" : imc < 24.9 ? "Peso normal" : imc < 29.9 ? "Sobrepeso" : "Obesidad";
      return { imc, estado };
    }
    return { imc: "--", estado: "Sin datos" };
  };

  const handleImageUpload = (e, setTarget) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 250;
          const MAX_HEIGHT = 250;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.7);

          setTarget(prev => ({ ...prev, foto_url: resizedDataUrl }));
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const endpoint = mode === 'register' ? '?action=register' : '?action=login';

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authData)
      });
      const data = await res.json();

      if (data.success) {
        setUserId(data.userId);
        setUserRol(data.rol);

        if (data.rol === 'admin') {
          loadAdminData();
          setMode('admin');
        } else if (data.rol === 'entrenador') {
          loadPlayersList();
          setMode('eval');
        } else {
          if (data.jugador) {
            setJugadorProfile(data.jugador);
            setEvaluacionData(data.evaluacion);
            setMode('dashboard');
          } else {
            setMode('form');
          }
        }
      } else {
        alert(data.message || 'Error de autenticación.');
      }
    } catch (err) {
      alert('Error al conectar con la API PHP.');
    }
  };

  const loadAdminData = async () => {
    loadPlayersList();
    try {
      const res = await fetch(`${API_URL}?action=get_all_users`);
      const data = await res.json();
      if (data.success) setAllUsersList(data.users);
    } catch (err) {
      console.error("Error cargando usuarios", err);
    }
  };

  const loadPlayersList = async () => {
    try {
      const res = await fetch(`${API_URL}?action=get_players`);
      const data = await res.json();
      if (data.success) setPlayersList(data.players);
    } catch (err) {
      console.error("Error cargando jugadores", err);
    }
  };

  const handleSelectPlayerToEval = (playerId) => {
    const player = playersList.find(p => p.id == playerId);
    setSelectedPlayer(player);
    if (player && player.control_orientado !== null) {
      setRatings({
        control_orientado: player.control_orientado || 0,
        pase_corto_largo: player.pase_corto_largo || 0,
        remate_definicion: player.remate_definicion || 0,
        regate_1v1: player.regate_1v1 || 0,
        vision_juego: player.vision_juego || 0,
        posicionamiento: player.posicionamiento || 0,
        resistencia_aerobica: player.resistencia_aerobica || 0,
        velocidad_explosiva: player.velocidad_explosiva || 0,
        fuerza_duelos: player.fuerza_duelos || 0,
        disciplina_tactica: player.disciplina_tactica || 0,
      });
    }
  };

  const handleCreateTrainer = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}?action=register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newTrainer, rol: 'entrenador' })
      });
      const data = await res.json();
      if (data.success) {
        alert('Entrenador profesional registrado con éxito.');
        setNewTrainer({ usuario: '', password: '' });
        loadAdminData();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Error registrando entrenador.');
    }
  };

  const handleAdminResetPassword = async (e) => {
    e.preventDefault();
    if (!resetPassData.usuario_id || !resetPassData.new_password) {
      alert('Selecciona un usuario e ingresa la nueva clave.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}?action=admin_update_password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resetPassData)
      });
      const data = await res.json();
      if (data.success) {
        alert('¡Contraseña restablecida exitosamente!');
        setResetPassData({ usuario_id: '', new_password: '' });
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Error restableciendo contraseña.');
    }
  };

  const handleAdminUpdatePlayer = async (e) => {
    e.preventDefault();
    if (!editPlayerData) return;
    try {
      const res = await fetch(`${API_URL}?action=admin_update_player`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editPlayerData)
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        loadAdminData();
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      alert('Error al conectar con la API al actualizar.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.acepta_politicas) {
      alert('Debes aceptar el tratamiento de datos personales.');
      return;
    }

    let alturaNormal = parseFloat(formData.altura_cm);
    if (alturaNormal < 3) alturaNormal = alturaNormal * 100;

    try {
      const res = await fetch(`${API_URL}?action=save_player`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, altura_cm: alturaNormal, usuario_id: userId })
      });
      const data = await res.json();

      if (data.success) {
        alert('Ficha deportiva guardada.');
        setJugadorProfile(data.jugador);
        setMode('dashboard');
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Error guardando la ficha.');
    }
  };

  const handleSaveEval = async (e) => {
    e.preventDefault();
    if (!selectedPlayer) {
      alert('Selecciona un jugador.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}?action=save_evaluation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...ratings, jugador_id: selectedPlayer.id, entrenador_id: userId })
      });
      const data = await res.json();
      if (data.success) {
        alert('Evaluación guardada exitosamente.');
        loadPlayersList();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Error enviando la evaluación.');
    }
  };

  const calcularNotaTotal = (fuenteRatings) => {
    const target = fuenteRatings || ratings;
    return Object.values(target).reduce((acc, val) => acc + parseFloat(val || 0), 0).toFixed(1);
  };

  const clasificarMétricas = (fuenteRatings) => {
    const target = fuenteRatings || ratings;
    const fortalezas = [];
    const porMejorar = [];

    Object.keys(target).forEach((key) => {
      if (METRIC_LABELS[key]) {
        const val = parseFloat(target[key] || 0);
        const item = { key, label: METRIC_LABELS[key], val };
        if (val >= 7.0) {
          fortalezas.push(item);
        } else {
          porMejorar.push(item);
        }
      }
    });

    fortalezas.sort((a, b) => b.val - a.val);
    porMejorar.sort((a, b) => a.val - b.val);

    return { fortalezas, porMejorar };
  };

  return (
    <div className="rss-auth-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Barlow+Condensed:wght@500;600;700&display=swap');

        .rss-auth-wrapper {
          --bg-0: #5C1D06;
          --bg-1: #7A2A0C;
          --bg-card: #2B1206;
          --input-bg: #1A0A03;
          --ink: #FFF3E8;
          --ink-dim: #F3C9A6;
          --accent: #FFC24B;
          --border: rgba(255, 194, 75, 0.25);
          --green-badge: #10B981;
          --red-badge: #EF4444;

          min-height: 100vh;
          width: 100%;
          background: radial-gradient(120% 140% at 15% -10%, var(--bg-1) 0%, var(--bg-0) 100%);
          font-family: 'Barlow Condensed', system-ui, sans-serif;
          color: var(--ink);
          padding: 3rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .rss-auth-container {
          width: 100%;
          max-width: 950px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          box-shadow: 0 20px 40px rgba(0,0,0,0.6);
          padding: 2.5rem;
        }

        .rss-back-btn {
          background: transparent;
          color: var(--ink-dim);
          border: 1px solid var(--ink-dim);
          padding: 0.5rem 1.2rem;
          font-weight: 700;
          text-transform: uppercase;
          cursor: pointer;
          margin-bottom: 2rem;
        }

        .rss-title-sports {
          font-family: 'Anton', sans-serif;
          font-size: 2.4rem;
          text-transform: uppercase;
          color: var(--accent);
          letter-spacing: 0.05em;
          text-align: center;
          margin-bottom: 1.5rem;
          border-bottom: 2px solid var(--border);
          padding-bottom: 0.5rem;
        }

        .rss-form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-bottom: 1.2rem;
        }

        .rss-form-group label {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--ink-dim);
          text-transform: uppercase;
        }

        .rss-input, .rss-select {
          background: var(--input-bg);
          border: 1px solid var(--border);
          color: var(--ink);
          padding: 0.8rem 1rem;
          font-size: 1.1rem;
          outline: none;
        }

        .rss-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.2rem;
        }

        @media (max-width: 640px) {
          .rss-grid-2 {
            grid-template-columns: 1fr;
          }
        }

        .rss-submit-btn {
          width: 100%;
          background: var(--accent);
          color: var(--bg-card);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.3rem;
          font-weight: 700;
          text-transform: uppercase;
          padding: 1rem;
          border: none;
          cursor: pointer;
          clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
          margin-top: 1rem;
        }

        .rss-section-box {
          background: rgba(0,0,0,0.25);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .rss-section-title {
          font-size: 1.4rem;
          color: var(--accent);
          text-transform: uppercase;
          margin-bottom: 1rem;
          border-left: 4px solid var(--accent);
          padding-left: 0.6rem;
        }

        .rss-metric-bar {
          background: var(--input-bg);
          border: 1px solid var(--border);
          padding: 0.8rem 1rem;
          margin-bottom: 0.8rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chart-container {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          height: 200px;
          padding: 10px;
          background: #110502;
          border: 1px solid var(--border);
          margin-top: 1rem;
        }

        .chart-bar-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          justify-content: flex-end;
        }

        .chart-bar {
          width: 100%;
          border-radius: 3px 3px 0 0;
          transition: height 0.4s ease;
        }

        .chart-label {
          font-size: 0.75rem;
          color: var(--ink-dim);
          text-align: center;
          margin-top: 5px;
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          height: 50px;
        }

        .badge-card {
          background: var(--input-bg);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.8rem 1rem;
          margin-bottom: 0.6rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 4px;
        }

        .badge-green {
          color: var(--green-badge);
          border-left: 4px solid var(--green-badge);
        }

        .badge-red {
          color: var(--red-badge);
          border-left: 4px solid var(--red-badge);
        }

        .admin-tab-btn {
          background: transparent;
          color: var(--ink);
          border: 1px solid var(--border);
          padding: 0.8rem 1.2rem;
          font-weight: 700;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }

        .admin-tab-btn.active {
          background: var(--accent);
          color: var(--bg-card);
        }

        .player-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid var(--accent);
          background: #1A0A03;
        }
      `}</style>

      <div className="rss-auth-container">
        <button className="rss-back-btn" onClick={onBack}>← Volver al Inicio</button>

        {/* 1. LOGIN / REGISTRO */}
        {(mode === 'login' || mode === 'register') && (
          <div style={{ maxWidth: '420px', margin: '0 auto' }}>
            <h2 className="rss-title-sports">{mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
            <form onSubmit={handleAuthSubmit}>
              <div className="rss-form-group">
                <label>Usuario</label>
                <input required className="rss-input" value={authData.usuario} onChange={e => setAuthData({...authData, usuario: e.target.value})} />
              </div>
              <div className="rss-form-group">
                <label>Contraseña</label>
                <input type="password" required className="rss-input" value={authData.password} onChange={e => setAuthData({...authData, password: e.target.value})} />
              </div>
              <button type="submit" className="rss-submit-btn">{mode === 'login' ? 'Ingresar' : 'Registrar Cuenta'}</button>
            </form>
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              {mode === 'login' ? (
                <p>¿No tienes cuenta? <button style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setMode('register')}>Regístrate aquí</button></p>
              ) : (
                <p>¿Ya estás registrado? <button style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setMode('login')}>Inicia Sesión</button></p>
              )}
            </div>
          </div>
        )}

        {/* 2. DASHBOARD JUGADOR / ACUDIENTE */}
        {mode === 'dashboard' && jugadorProfile && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
              {jugadorProfile.foto_url ? (
                <img src={jugadorProfile.foto_url} alt="Foto de perfil" className="player-avatar" />
              ) : (
                <div className="player-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>⚽</div>
              )}
              <div>
                <h2 className="rss-title-sports" style={{ textAlign: 'left', marginBottom: '0.2rem', border: 'none', padding: 0 }}>
                  {jugadorProfile.jugador_nombre} {obtenerApellidoValido(jugadorProfile.jugador_apellido)}
                </h2>
                <p style={{ color: 'var(--accent)', fontSize: '1.2rem', fontWeight: '600', margin: 0 }}>
                  📍 Municipio / Ciudad: {obtenerCiudadValida(jugadorProfile.ciudad)}
                </p>
              </div>
            </div>
            
            <div className="rss-grid-2" style={{ marginBottom: '2rem' }}>
              <div className="rss-section-box">
                <h3 className="rss-section-title">Ficha Técnica</h3>
                <p><strong>Posición:</strong> {(!jugadorProfile.posicion || jugadorProfile.posicion === '0') ? 'Delantero Centro' : jugadorProfile.posicion}</p>
                <p><strong>Edad:</strong> {jugadorProfile.jugador_edad} años</p>
                <p><strong>Municipio / Ciudad:</strong> {obtenerCiudadValida(jugadorProfile.ciudad)}</p>
                <p><strong>Teléfono Jugador:</strong> {jugadorProfile.jugador_telefono || 'No registrado'}</p>
                <p><strong>Peso:</strong> {jugadorProfile.peso_kg} kg | <strong>Altura:</strong> {jugadorProfile.altura_cm} cm</p>
                <p><strong>IMC:</strong> {calcularIMC(jugadorProfile.peso_kg, jugadorProfile.altura_cm).imc} ({calcularIMC(jugadorProfile.peso_kg, jugadorProfile.altura_cm).estado})</p>
                <p><strong>Acudiente:</strong> {jugadorProfile.acudiente_nombre} {obtenerApellidoValido(jugadorProfile.acudiente_apellido)} ({jugadorProfile.acudiente_telefono})</p>
              </div>
              <div className="rss-section-box">
                <h3 className="rss-section-title">Nota Global del Entrenador</h3>
                {evaluacionData ? (
                  <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <span style={{ fontFamily: 'Anton', fontSize: '3.5rem', color: 'var(--accent)' }}>
                      {evaluacionData.nota_final}%
                    </span>
                    <p style={{ color: 'var(--ink-dim)' }}>Calificación alcanzada sobre 100%</p>
                  </div>
                ) : (
                  <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--ink-dim)' }}>
                    <p>🕒 En espera de evaluación por parte del cuerpo técnico.</p>
                  </div>
                )}
              </div>
            </div>

            {evaluacionData && (
              <>
                <div className="rss-section-box">
                  <h3 className="rss-section-title">Diagnóstico Deportivo por Rangos</h3>
                  <div className="rss-grid-2">
                    <div>
                      <h4 style={{ color: '#10B981', textTransform: 'uppercase', marginBottom: '0.8rem', fontSize: '1.2rem' }}>
                        💪 Fortalezas (≥ 7.0 pts)
                      </h4>
                      {clasificarMétricas(evaluacionData).fortalezas.length > 0 ? (
                        clasificarMétricas(evaluacionData).fortalezas.map(item => (
                          <div key={item.key} className="badge-card badge-green">
                            <span style={{ fontWeight: '600' }}>{item.label}</span>
                            <strong>{item.val} / 10 pts</strong>
                          </div>
                        ))
                      ) : (
                        <p style={{ color: 'var(--ink-dim)', fontSize: '0.95rem' }}>Aún no registras ítems en este rango.</p>
                      )}
                    </div>

                    <div>
                      <h4 style={{ color: '#EF4444', textTransform: 'uppercase', marginBottom: '0.8rem', fontSize: '1.2rem' }}>
                        📌 Ítems por Mejorar (&lt; 7.0 pts)
                      </h4>
                      {clasificarMétricas(evaluacionData).porMejorar.length > 0 ? (
                        clasificarMétricas(evaluacionData).porMejorar.map(item => (
                          <div key={item.key} className="badge-card badge-red">
                            <span style={{ fontWeight: '600' }}>{item.label}</span>
                            <strong>{item.val} / 10 pts</strong>
                          </div>
                        ))
                      ) : (
                        <p style={{ color: 'var(--ink-dim)', fontSize: '0.95rem' }}>¡Felicidades! Todos tus aspectos superan los 7.0 pts.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rss-section-box">
                  <h3 className="rss-section-title">Gráfico de Rendimiento Global</h3>
                  <div className="chart-container">
                    {[
                      ['Control', evaluacionData.control_orientado],
                      ['Pase', evaluacionData.pase_corto_largo],
                      ['Remate', evaluacionData.remate_definicion],
                      ['Regate', evaluacionData.regate_1v1],
                      ['Visión', evaluacionData.vision_juego],
                      ['Posición', evaluacionData.posicionamiento],
                      ['Resistencia', evaluacionData.resistencia_aerobica],
                      ['Velocidad', evaluacionData.velocidad_explosiva],
                      ['Fuerza', evaluacionData.fuerza_duelos],
                      ['Táctica', evaluacionData.disciplina_tactica]
                    ].map(([lbl, val]) => (
                      <div key={lbl} className="chart-bar-col">
                        <span style={{ fontSize: '0.8rem', color: val >= 7 ? '#10B981' : '#EF4444', fontWeight: 'bold' }}>{val}</span>
                        <div 
                          className="chart-bar" 
                          style={{ 
                            height: `${(val / 10) * 100}%`,
                            background: val >= 7 
                              ? 'linear-gradient(180deg, #10B981 0%, #047857 100%)' 
                              : 'linear-gradient(180deg, #EF4444 0%, #B91C1C 100%)'
                          }}
                        ></div>
                        <span className="chart-label">{lbl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* 3. PANEL ADMINISTRADOR */}
        {mode === 'admin' && (
          <div>
            <h2 className="rss-title-sports">Panel de Control Administrador</h2>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <button className={`admin-tab-btn ${adminTab === 'create_trainer' ? 'active' : ''}`} onClick={() => setAdminTab('create_trainer')}>Registrar Entrenador</button>
              <button className={`admin-tab-btn ${adminTab === 'reset_pass' ? 'active' : ''}`} onClick={() => setAdminTab('reset_pass')}>Restablecer Contraseñas</button>
              <button className={`admin-tab-btn ${adminTab === 'edit_player' ? 'active' : ''}`} onClick={() => setAdminTab('edit_player')}>Editar Ficha Futbolista</button>
            </div>

            {adminTab === 'create_trainer' && (
              <div className="rss-section-box" style={{ maxWidth: '500px', margin: '0 auto' }}>
                <h3 className="rss-section-title">Registrar Nuevo Entrenador</h3>
                <form onSubmit={handleCreateTrainer}>
                  <div className="rss-form-group">
                    <label>Usuario Entrenador</label>
                    <input required className="rss-input" value={newTrainer.usuario} onChange={e => setNewTrainer({...newTrainer, usuario: e.target.value})} />
                  </div>
                  <div className="rss-form-group">
                    <label>Contraseña</label>
                    <input type="password" required className="rss-input" value={newTrainer.password} onChange={e => setNewTrainer({...newTrainer, password: e.target.value})} />
                  </div>
                  <button type="submit" className="rss-submit-btn">Crear Cuenta Entrenador</button>
                </form>
              </div>
            )}

            {adminTab === 'reset_pass' && (
              <div className="rss-section-box" style={{ maxWidth: '500px', margin: '0 auto' }}>
                <h3 className="rss-section-title">Cambiar Contraseña de Usuario</h3>
                <form onSubmit={handleAdminResetPassword}>
                  <div className="rss-form-group">
                    <label>Seleccionar Usuario:</label>
                    <select className="rss-select" value={resetPassData.usuario_id} onChange={e => setResetPassData({...resetPassData, usuario_id: e.target.value})}>
                      <option value="">-- Seleccionar --</option>
                      {allUsersList.map(u => (
                        <option key={u.id} value={u.id}>{u.usuario} ({u.rol.toUpperCase()})</option>
                      ))}
                    </select>
                  </div>
                  <div className="rss-form-group">
                    <label>Nueva Contraseña</label>
                    <input type="password" required className="rss-input" placeholder="Escribe la nueva contraseña" value={resetPassData.new_password} onChange={e => setResetPassData({...resetPassData, new_password: e.target.value})} />
                  </div>
                  <button type="submit" className="rss-submit-btn">Actualizar Contraseña</button>
                </form>
              </div>
            )}

            {adminTab === 'edit_player' && (
              <div>
                <div className="rss-form-group" style={{ marginBottom: '1.5rem' }}>
                  <label>Seleccionar Futbolista a Editar:</label>
                  <select className="rss-select" onChange={e => {
                    const selected = playersList.find(pl => pl.id == e.target.value);
                    if (selected) {
                      setEditPlayerData({
                        ...selected,
                        jugador_nombre: selected.jugador_nombre || '',
                        jugador_apellido: (selected.jugador_apellido === '0' || !selected.jugador_apellido) ? '' : selected.jugador_apellido,
                        ciudad: (selected.ciudad === '0' || !selected.ciudad) ? 'guacari' : selected.ciudad,
                        posicion: (!selected.posicion || selected.posicion === '0') ? 'Delantero Centro' : selected.posicion
                      });
                    } else {
                      setEditPlayerData(null);
                    }
                  }}>
                    <option value="">-- Seleccionar Futbolista --</option>
                    {playersList.map(p => (
                      <option key={p.id} value={p.id}>{p.jugador_nombre} {obtenerApellidoValido(p.jugador_apellido)} ({obtenerCiudadValida(p.ciudad)})</option>
                    ))}
                  </select>
                </div>

                {editPlayerData && (
                  <form onSubmit={handleAdminUpdatePlayer}>
                    <div className="rss-section-box">
                      <h3 className="rss-section-title">Editar Ficha Deportiva</h3>
                      <div className="rss-grid-2">
                        <div className="rss-form-group">
                          <label>Nombre Futbolista</label>
                          <input className="rss-input" value={editPlayerData.jugador_nombre || ''} onChange={e => setEditPlayerData({...editPlayerData, jugador_nombre: e.target.value})} />
                        </div>
                        <div className="rss-form-group">
                          <label>Apellido Futbolista</label>
                          <input className="rss-input" placeholder="Escribe el apellido aquí" value={editPlayerData.jugador_apellido || ''} onChange={e => setEditPlayerData({...editPlayerData, jugador_apellido: e.target.value})} />
                        </div>
                        <div className="rss-form-group">
                          <label>Municipio / Ciudad</label>
                          <input className="rss-input" value={editPlayerData.ciudad || ''} onChange={e => setEditPlayerData({...editPlayerData, ciudad: e.target.value})} />
                        </div>
                        <div className="rss-form-group">
                          <label>Teléfono Futbolista</label>
                          <input className="rss-input" value={editPlayerData.jugador_telefono || ''} onChange={e => setEditPlayerData({...editPlayerData, jugador_telefono: e.target.value})} />
                        </div>
                        <div className="rss-form-group">
                          <label>Subir Nueva Foto de Perfil</label>
                          <input type="file" accept="image/*" className="rss-input" onChange={e => handleImageUpload(e, setEditPlayerData)} />
                        </div>
                        <div className="rss-form-group">
                          <label>Edad</label>
                          <input type="number" className="rss-input" value={editPlayerData.jugador_edad || ''} onChange={e => setEditPlayerData({...editPlayerData, jugador_edad: e.target.value})} />
                        </div>
                        <div className="rss-form-group">
                          <label>Posición</label>
                          <select className="rss-select" value={(!editPlayerData.posicion || editPlayerData.posicion === '0') ? 'Delantero Centro' : editPlayerData.posicion} onChange={e => setEditPlayerData({...editPlayerData, posicion: e.target.value})}>
                            <option value="Portero">Portero</option>
                            <option value="Defensa Central">Defensa Central</option>
                            <option value="Lateral">Lateral</option>
                            <option value="Volante">Volante</option>
                            <option value="Extremo">Extremo</option>
                            <option value="Delantero Centro">Delantero Centro</option>
                          </select>
                        </div>
                        <div className="rss-form-group">
                          <label>Peso (kg)</label>
                          <input type="number" step="0.1" className="rss-input" value={editPlayerData.peso_kg || ''} onChange={e => setEditPlayerData({...editPlayerData, peso_kg: e.target.value})} />
                        </div>
                        <div className="rss-form-group">
                          <label>Altura (cm)</label>
                          <input type="number" step="0.1" className="rss-input" value={editPlayerData.altura_cm || ''} onChange={e => setEditPlayerData({...editPlayerData, altura_cm: e.target.value})} />
                        </div>
                      </div>
                    </div>

                    <div className="rss-section-box">
                      <h3 className="rss-section-title">Editar Datos del Acudiente</h3>
                      <div className="rss-grid-2">
                        <div className="rss-form-group">
                          <label>Nombre Acudiente</label>
                          <input className="rss-input" value={editPlayerData.acudiente_nombre || ''} onChange={e => setEditPlayerData({...editPlayerData, acudiente_nombre: e.target.value})} />
                        </div>
                        <div className="rss-form-group">
                          <label>Apellido Acudiente</label>
                          <input className="rss-input" value={editPlayerData.acudiente_apellido || ''} onChange={e => setEditPlayerData({...editPlayerData, acudiente_apellido: e.target.value})} />
                        </div>
                        <div className="rss-form-group">
                          <label>Teléfono Acudiente</label>
                          <input className="rss-input" value={editPlayerData.acudiente_telefono || ''} onChange={e => setEditPlayerData({...editPlayerData, acudiente_telefono: e.target.value})} />
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="rss-submit-btn">Guardar Cambios como Admin</button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}

        {/* 4. PANEL ENTRENADOR */}
        {mode === 'eval' && (
          <div>
            <h2 className="rss-title-sports">Evaluación Técnica de Futbolistas</h2>
            <div className="rss-form-group" style={{ marginBottom: '2rem' }}>
              <label>Seleccionar Futbolista a Calificar:</label>
              <select className="rss-select" onChange={e => handleSelectPlayerToEval(e.target.value)}>
                <option value="">-- Seleccionar Jugador --</option>
                {playersList.map(p => (
                  <option key={p.id} value={p.id}>{p.jugador_nombre} {obtenerApellidoValido(p.jugador_apellido)} ({obtenerCiudadValida(p.ciudad)})</option>
                ))}
              </select>
            </div>

            {selectedPlayer && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  {selectedPlayer.foto_url ? (
                    <img src={selectedPlayer.foto_url} alt="Foto" className="player-avatar" />
                  ) : (
                    <div className="player-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>⚽</div>
                  )}
                  <div>
                    <h3 style={{ color: 'var(--accent)', fontSize: '1.8rem', margin: 0 }}>
                      {selectedPlayer.jugador_nombre} {obtenerApellidoValido(selectedPlayer.jugador_apellido)}
                    </h3>
                    <p style={{ margin: 0, color: 'var(--ink-dim)', fontSize: '1.2rem', fontWeight: '600' }}>
                      📍 Municipio / Ciudad: {obtenerCiudadValida(selectedPlayer.ciudad)}
                    </p>
                  </div>
                </div>

                <div className="rss-grid-2" style={{ marginBottom: '1.5rem' }}>
                  <div className="rss-section-box">
                    <h3 className="rss-section-title">Ficha del Futbolista</h3>
                    <p><strong>Posición:</strong> {(!selectedPlayer.posicion || selectedPlayer.posicion === '0') ? 'Delantero Centro' : selectedPlayer.posicion}</p>
                    <p><strong>Edad:</strong> {selectedPlayer.jugador_edad} años</p>
                    <p><strong>Municipio / Ciudad:</strong> {obtenerCiudadValida(selectedPlayer.ciudad)}</p>
                    <p><strong>Teléfono Jugador:</strong> {selectedPlayer.jugador_telefono || 'No registrado'}</p>
                    <p><strong>Acudiente:</strong> {selectedPlayer.acudiente_nombre} {obtenerApellidoValido(selectedPlayer.acudiente_apellido)} ({selectedPlayer.acudiente_telefono})</p>
                  </div>
                  <div className="rss-section-box">
                    <h3 className="rss-section-title">Métricas Físicas e IMC</h3>
                    <p><strong>Peso:</strong> {selectedPlayer.peso_kg} kg | <strong>Altura:</strong> {selectedPlayer.altura_cm} cm</p>
                    <p><strong>IMC:</strong> {calcularIMC(selectedPlayer.peso_kg, selectedPlayer.altura_cm).imc}</p>
                    <p><strong>Estado Físico:</strong> <span style={{ color: 'var(--accent)' }}>{calcularIMC(selectedPlayer.peso_kg, selectedPlayer.altura_cm).estado}</span></p>
                  </div>
                </div>

                <div className="rss-section-box">
                  <h3 className="rss-section-title">Diagnóstico del Desempeño</h3>
                  <div className="rss-grid-2">
                    <div>
                      <h4 style={{ color: '#10B981', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                        💪 Fortalezas (≥ 7.0 pts)
                      </h4>
                      {clasificarMétricas().fortalezas.length > 0 ? (
                        clasificarMétricas().fortalezas.map(item => (
                          <div key={item.key} className="badge-card badge-green">
                            <span>{item.label}</span>
                            <strong>{item.val} / 10</strong>
                          </div>
                        ))
                      ) : (
                        <p style={{ color: 'var(--ink-dim)', fontSize: '0.9rem' }}>Sin fortalezas registradas.</p>
                      )}
                    </div>

                    <div>
                      <h4 style={{ color: '#EF4444', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                        ⚠️ Ítems por Mejorar (&lt; 7.0 pts)
                      </h4>
                      {clasificarMétricas().porMejorar.length > 0 ? (
                        clasificarMétricas().porMejorar.map(item => (
                          <div key={item.key} className="badge-card badge-red">
                            <span>{item.label}</span>
                            <strong>{item.val} / 10</strong>
                          </div>
                        ))
                      ) : (
                        <p style={{ color: 'var(--ink-dim)', fontSize: '0.9rem' }}>No hay ítems críticos por debajo de 7.0 pts.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rss-section-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 className="rss-section-title">Gráfico de Rendimiento</h3>
                    <span style={{ fontFamily: 'Anton', fontSize: '1.8rem', color: 'var(--accent)' }}>{calcularNotaTotal()}% / 100%</span>
                  </div>
                  
                  <div className="chart-container">
                    {[
                      ['Control', ratings.control_orientado],
                      ['Pase', ratings.pase_corto_largo],
                      ['Remate', ratings.remate_definicion],
                      ['Regate', ratings.regate_1v1],
                      ['Visión', ratings.vision_juego],
                      ['Posición', ratings.posicionamiento],
                      ['Resistencia', ratings.resistencia_aerobica],
                      ['Velocidad', ratings.velocidad_explosiva],
                      ['Fuerza', ratings.fuerza_duelos],
                      ['Táctica', ratings.disciplina_tactica]
                    ].map(([lbl, val]) => (
                      <div key={lbl} className="chart-bar-col">
                        <span style={{ fontSize: '0.8rem', color: val >= 7 ? '#10B981' : '#EF4444', fontWeight: 'bold' }}>{val}</span>
                        <div 
                          className="chart-bar" 
                          style={{ 
                            height: `${(val / 10) * 100}%`,
                            background: val >= 7 
                              ? 'linear-gradient(180deg, #10B981 0%, #047857 100%)' 
                              : 'linear-gradient(180deg, #EF4444 0%, #B91C1C 100%)'
                          }}
                        ></div>
                        <span className="chart-label">{lbl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSaveEval}>
                  <div className="rss-grid-2">
                    {Object.keys(ratings).map(item => (
                      <div key={item} className="rss-metric-bar">
                        <span style={{ textTransform: 'capitalize' }}>{item.replace(/_/g, ' ')}</span>
                        <input type="number" min="0" max="10" step="0.5" value={ratings[item]} onChange={e => setRatings({...ratings, [item]: e.target.value})} className="rss-input" style={{ width: '70px', textAlign: 'center', fontWeight: 'bold' }} />
                      </div>
                    ))}
                  </div>
                  <button type="submit" className="rss-submit-btn">Guardar y Enviar Calificación</button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* 5. FORMULARIO FICHA NUEVO JUGADOR */}
        {mode === 'form' && (
          <div>
            <h2 className="rss-title-sports">Ficha Deportiva del Futbolista</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="rss-section-box">
                <h3 className="rss-section-title">Datos de Ubicación y Foto</h3>
                <div className="rss-grid-2">
                  <div className="rss-form-group">
                    <label>Municipio / Ciudad de Origen</label>
                    <input placeholder="Ej. Cali, Jamundí, Guacarí" required className="rss-input" value={formData.ciudad} onChange={e => setFormData({...formData, ciudad: e.target.value})} />
                  </div>
                  <div className="rss-form-group">
                    <label>Foto de Perfil del Futbolista</label>
                    <input type="file" accept="image/*" className="rss-input" onChange={e => handleImageUpload(e, setFormData)} />
                  </div>
                </div>
              </div>

              <div className="rss-section-box">
                <h3 className="rss-section-title">Datos del Acudiente</h3>
                <div className="rss-grid-2">
                  <input placeholder="Nombre Acudiente" required className="rss-input" onChange={e => setFormData({...formData, acudiente_nombre: e.target.value})} />
                  <input placeholder="Apellido Acudiente" required className="rss-input" onChange={e => setFormData({...formData, acudiente_apellido: e.target.value})} />
                  <input placeholder="Cédula" required className="rss-input" onChange={e => setFormData({...formData, acudiente_cedula: e.target.value})} />
                  <input placeholder="Teléfono Acudiente" required className="rss-input" onChange={e => setFormData({...formData, acudiente_telefono: e.target.value})} />
                  <input type="email" placeholder="Correo Acudiente" required className="rss-input" onChange={e => setFormData({...formData, acudiente_correo: e.target.value})} />
                  <input placeholder="Dirección" required className="rss-input" onChange={e => setFormData({...formData, acudiente_direccion: e.target.value})} />
                </div>
              </div>

              <div className="rss-section-box">
                <h3 className="rss-section-title">Datos del Jugador</h3>
                <div className="rss-grid-2">
                  <input placeholder="Nombre Jugador" required className="rss-input" onChange={e => setFormData({...formData, jugador_nombre: e.target.value})} />
                  <input placeholder="Apellido Jugador" required className="rss-input" onChange={e => setFormData({...formData, jugador_apellido: e.target.value})} />
                  <input type="number" placeholder="Edad" required className="rss-input" onChange={e => setFormData({...formData, jugador_edad: e.target.value})} />
                  <input placeholder="Teléfono Jugador (Opcional)" className="rss-input" onChange={e => setFormData({...formData, jugador_telefono: e.target.value})} />
                  <select className="rss-select" value={formData.posicion} onChange={e => setFormData({...formData, posicion: e.target.value})}>
                    <option value="Portero">Portero</option>
                    <option value="Defensa Central">Defensa Central</option>
                    <option value="Lateral">Lateral</option>
                    <option value="Volante">Volante</option>
                    <option value="Extremo">Extremo</option>
                    <option value="Delantero Centro">Delantero Centro</option>
                  </select>
                  <input type="number" step="0.1" placeholder="Peso (kg)" required className="rss-input" onChange={e => setFormData({...formData, peso_kg: e.target.value})} />
                  <input type="number" step="0.1" placeholder="Altura (cm)" required className="rss-input" onChange={e => setFormData({...formData, altura_cm: e.target.value})} />
                </div>
              </div>

              <div className="rss-section-box">
                <label style={{ display: 'flex', gap: '0.8rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.acepta_politicas} onChange={e => setFormData({...formData, acepta_politicas: e.target.checked})} />
                  <span>Acepto el tratamiento de datos e imagen del jugador.</span>
                </label>
              </div>

              <button type="submit" className="rss-submit-btn">Guardar y Ver Dashboard</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}