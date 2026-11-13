<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

mysqli_report(MYSQLI_REPORT_OFF);

$host = "127.0.0.1";
$port = "3306";
$db_user = "root";
$db_pass = "root";
$db_name = "reality_sports";

$conn = new mysqli($host, $db_user, $db_pass, $db_name, $port);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error de conexión a BD: " . $conn->connect_error]);
    exit();
}

$action = $_GET['action'] ?? '';
$inputData = file_get_contents("php://input");
$data = json_decode($inputData, true);

function guardarImagenFisica($base64String, $prefix = 'jugador_') {
    if (empty($base64String)) return '';
    if (strpos($base64String, 'data:image') === false) {
        return $base64String;
    }

    $dir = __DIR__ . '/uploads/';
    if (!file_exists($dir)) {
        mkdir($dir, 0777, true);
    }

    $image_parts = explode(";base64,", $base64String);
    if (count($image_parts) < 2) return '';

    $image_base64 = base64_decode($image_parts[1]);
    $fileName = $prefix . uniqid() . '.jpg';
    $filePath = $dir . $fileName;

    if (file_put_contents($filePath, $image_base64)) {
        return 'http://localhost/uploads/' . $fileName;
    }
    return '';
}

// 1. REGISTRO DE USUARIOS
if ($action === 'register') {
    if (empty($data['usuario']) || empty($data['password'])) {
        echo json_encode(["success" => false, "message" => "Datos incompletos."]);
        exit();
    }
    $user = trim($data['usuario']);
    $pass = password_hash($data['password'], PASSWORD_DEFAULT);
    $rol = $data['rol'] ?? 'acudiente';

    $stmt = $conn->prepare("INSERT INTO usuarios (usuario, password, rol) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $user, $pass, $rol);
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "userId" => $stmt->insert_id, "rol" => $rol, "message" => "Usuario creado."]);
    } else {
        echo json_encode(["success" => false, "message" => "El usuario ya existe."]);
    }
    exit();
}

// 2. INICIO DE SESIÓN
if ($action === 'login') {
    if (empty($data['usuario']) || empty($data['password'])) {
        echo json_encode(["success" => false, "message" => "Ingresa credenciales."]);
        exit();
    }
    $user = trim($data['usuario']);
    $pass = trim($data['password']);

    $stmt = $conn->prepare("SELECT id, password, rol FROM usuarios WHERE usuario = ?");
    $stmt->bind_param("s", $user);
    $stmt->execute();
    $res = $stmt->get_result()->fetch_assoc();

    if ($res && password_verify($pass, $res['password'])) {
        $userId = $res['id'];
        $rol = $res['rol'];
        $jugadorData = null;
        $evaluacionData = null;

        if ($rol === 'acudiente') {
            $stmtJ = $conn->prepare("SELECT * FROM jugadores WHERE usuario_id = ?");
            $stmtJ->bind_param("i", $userId);
            $stmtJ->execute();
            $jugadorData = $stmtJ->get_result()->fetch_assoc();

            if ($jugadorData) {
                $jugadorId = $jugadorData['id'];
                $stmtE = $conn->prepare("SELECT *, (control_orientado + pase_corto_largo + remate_definicion + regate_1v1 + vision_juego + posicionamiento + resistencia_aerobica + velocidad_explosiva + fuerza_duelos + disciplina_tactica) as nota_final FROM evaluaciones WHERE jugador_id = ? ORDER BY fecha_evaluacion DESC LIMIT 1");
                $stmtE->bind_param("i", $jugadorId);
                $stmtE->execute();
                $evaluacionData = $stmtE->get_result()->fetch_assoc();
            }
        }

        echo json_encode([
            "success" => true,
            "userId" => $userId,
            "rol" => $rol,
            "jugador" => $jugadorData,
            "evaluacion" => $evaluacionData,
            "message" => "Sesión iniciada."
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Credenciales incorrectas."]);
    }
    exit();
}

// 3. GUARDAR / ACTUALIZAR FICHA JUGADOR
if ($action === 'save_player') {
    $foto_url = guardarImagenFisica($data['foto_url'] ?? '');

    $stmt = $conn->prepare("INSERT INTO jugadores (
        usuario_id, acudiente_nombre, acudiente_apellido, acudiente_cedula, acudiente_telefono, 
        acudiente_correo, acudiente_direccion, ciudad, acepta_politicas, jugador_nombre, jugador_apellido, 
        jugador_edad, jugador_telefono, jugador_correo, posicion, foto_url, peso_kg, altura_cm
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
        peso_kg=VALUES(peso_kg), altura_cm=VALUES(altura_cm), posicion=VALUES(posicion), 
        ciudad=VALUES(ciudad), foto_url=VALUES(foto_url), jugador_telefono=VALUES(jugador_telefono)");

    $acepta = !empty($data['acepta_politicas']) ? 1 : 0;
    $peso = floatval($data['peso_kg']);
    $altura = floatval($data['altura_cm']);
    $edad = intval($data['jugador_edad']);
    $posicion = !empty($data['posicion']) ? trim($data['posicion']) : 'Delantero Centro';

    $stmt->bind_param(
        "isssssssississssdd",
        $data['usuario_id'], $data['acudiente_nombre'], $data['acudiente_apellido'],
        $data['acudiente_cedula'], $data['acudiente_telefono'], $data['acudiente_correo'],
        $data['acudiente_direccion'], $data['ciudad'], $acepta, $data['jugador_nombre'], $data['jugador_apellido'],
        $edad, $data['jugador_telefono'], $data['jugador_correo'], $posicion,
        $foto_url, $peso, $altura
    );

    if ($stmt->execute()) {
        $stmtJ = $conn->prepare("SELECT * FROM jugadores WHERE usuario_id = ?");
        $stmtJ->bind_param("i", $data['usuario_id']);
        $stmtJ->execute();
        $jugadorData = $stmtJ->get_result()->fetch_assoc();

        echo json_encode(["success" => true, "jugador" => $jugadorData, "message" => "Ficha guardada."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al guardar: " . $stmt->error]);
    }
    exit();
}

// 4. OBTENER LISTA DE TODOS LOS USUARIOS (ADMIN)
if ($action === 'get_all_users') {
    $res = $conn->query("SELECT id, usuario, rol FROM usuarios ORDER BY id DESC");
    $users = [];
    while ($row = $res->fetch_assoc()) {
        $users[] = $row;
    }
    echo json_encode(["success" => true, "users" => $users]);
    exit();
}

// 5. RESTABLECER CONTRASEÑA (ADMIN)
if ($action === 'admin_update_password') {
    if (empty($data['usuario_id']) || empty($data['new_password'])) {
        echo json_encode(["success" => false, "message" => "Datos incompletos."]);
        exit();
    }
    $newPass = password_hash($data['new_password'], PASSWORD_DEFAULT);
    $stmt = $conn->prepare("UPDATE usuarios SET password = ? WHERE id = ?");
    $stmt->bind_param("si", $newPass, $data['usuario_id']);
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Contraseña restablecida exitosamente."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al actualizar contraseña."]);
    }
    exit();
}

// 6. EDITAR JUGADOR DESDE ADMIN (CORREGIDO ORDEN DE CAMPOS Y POSICIÓN)
if ($action === 'admin_update_player') {
    try {
        if (empty($data['id'])) {
            echo json_encode(["success" => false, "message" => "ID de futbolista no proporcionado."]);
            exit();
        }

        $id = intval($data['id']);
        $nombre = trim($data['jugador_nombre'] ?? '');
        $apellido = trim($data['jugador_apellido'] ?? '');
        $edad = intval($data['jugador_edad'] ?? 0);
        $telefono_j = trim($data['jugador_telefono'] ?? '');
        $posicion = (!empty($data['posicion']) && $data['posicion'] !== '0') ? trim($data['posicion']) : 'Delantero Centro';
        $peso = floatval($data['peso_kg'] ?? 0);
        $altura = floatval($data['altura_cm'] ?? 0);
        $ciudad = trim($data['ciudad'] ?? '');
        $foto_url = guardarImagenFisica($data['foto_url'] ?? '');

        $acudiente_n = trim($data['acudiente_nombre'] ?? '');
        $acudiente_a = trim($data['acudiente_apellido'] ?? '');
        $acudiente_t = trim($data['acudiente_telefono'] ?? '');

        $stmt = $conn->prepare("UPDATE jugadores SET 
            jugador_nombre = ?, 
            jugador_apellido = ?, 
            jugador_edad = ?, 
            jugador_telefono = ?,
            posicion = ?, 
            peso_kg = ?, 
            altura_cm = ?, 
            ciudad = ?, 
            foto_url = ?,
            acudiente_nombre = ?, 
            acudiente_apellido = ?, 
            acudiente_telefono = ?
            WHERE id = ?");

        if (!$stmt) {
            echo json_encode(["success" => false, "message" => "Error al preparar SQL: " . $conn->error]);
            exit();
        }

        // s s i s s d d s s s s s i (13 tipos)
        $stmt->bind_param(
            "ssisddssssssi",
            $nombre, $apellido, $edad, $telefono_j,
            $posicion, $peso, $altura, $ciudad, $foto_url,
            $acudiente_n, $acudiente_a, $acudiente_t,
            $id
        );

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "¡Ficha guardada correctamente en el servidor!"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error MySQL: " . $stmt->error]);
        }
    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Excepción PHP: " . $e->getMessage()]);
    }
    exit();
}

// 7. OBTENER JUGADORES CON ÚLTIMA EVALUACIÓN
if ($action === 'get_players') {
    $res = $conn->query("
        SELECT j.*, u.usuario, 
               e.control_orientado, e.pase_corto_largo, e.remate_definicion, 
               e.regate_1v1, e.vision_juego, e.posicionamiento, 
               e.resistencia_aerobica, e.velocidad_explosiva, e.fuerza_duelos, e.disciplina_tactica,
               (e.control_orientado + e.pase_corto_largo + e.remate_definicion + e.regate_1v1 + e.vision_juego + e.posicionamiento + e.resistencia_aerobica + e.velocidad_explosiva + e.fuerza_duelos + e.disciplina_tactica) as nota_final
        FROM jugadores j 
        JOIN usuarios u ON j.usuario_id = u.id
        LEFT JOIN evaluaciones e ON e.id = (
            SELECT id FROM evaluaciones WHERE jugador_id = j.id ORDER BY fecha_evaluacion DESC LIMIT 1
        )
    ");
    
    $players = [];
    while ($row = $res->fetch_assoc()) {
        $players[] = $row;
    }
    echo json_encode(["success" => true, "players" => $players]);
    exit();
}

// 8. GUARDAR EVALUACIÓN DE ENTRENADOR
if ($action === 'save_evaluation') {
    $stmt = $conn->prepare("INSERT INTO evaluaciones (
        jugador_id, entrenador_id, control_orientado, pase_corto_largo, remate_definicion, 
        regate_1v1, vision_juego, posicionamiento, resistencia_aerobica, velocidad_explosiva, 
        fuerza_duelos, disciplina_tactica
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $c1 = floatval($data['control_orientado'] ?? 0);
    $c2 = floatval($data['pase_corto_largo'] ?? 0);
    $c3 = floatval($data['remate_definicion'] ?? 0);
    $c4 = floatval($data['regate_1v1'] ?? 0);
    $c5 = floatval($data['vision_juego'] ?? 0);
    $c6 = floatval($data['posicionamiento'] ?? 0);
    $c7 = floatval($data['resistencia_aerobica'] ?? 0);
    $c8 = floatval($data['velocidad_explosiva'] ?? 0);
    $c9 = floatval($data['fuerza_duelos'] ?? 0);
    $c10 = floatval($data['disciplina_tactica'] ?? 0);

    $stmt->bind_param("iidddddddddd", $data['jugador_id'], $data['entrenador_id'], $c1, $c2, $c3, $c4, $c5, $c6, $c7, $c8, $c9, $c10);
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Evaluación guardada exitosamente."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error guardando la evaluación: " . $stmt->error]);
    }
    exit();
}

echo json_encode(["success" => false, "message" => "Acción no válida."]);
?>