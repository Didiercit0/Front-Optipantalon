const BASE_URL   = "http://localhost:8000";
const TIMEOUT_MS = 300_000; 

function fetchConTimeout(url, opciones) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  return fetch(url, { ...opciones, signal: controller.signal })
    .finally(() => clearTimeout(timer));
}

export async function getPiezas() {
  const res = await fetchConTimeout(`${BASE_URL}/piezas`);
  if (!res.ok) throw new Error("Error al obtener el catálogo de piezas");
  return res.json();
}

export async function optimizar(config) {
  const body = {
    rollo_ancho:        config.ancho,
    rollo_largo_maximo: config.largoMaximo,
    tam_poblacion:      config.poblacion,
    generaciones:       config.generaciones,
    tasa_cruza:         config.tasaCruza,
    tasa_mutacion_ind:  config.tasaMutacionInd, 
    tasa_mutacion_gen:  config.tasaMutacionGen, 
    tam_elite:          2,
    alpha:              0.5,
    beta:               0.3,
    gamma:              0.2,
    freq_fragmentacion: 5,
    ...(config.piezasActivas ? { piezas_activas: config.piezasActivas } : {}),
  };

  let res;
  try {
    res = await fetchConTimeout(`${BASE_URL}/optimizar`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
    });
  } catch (e) {
    if (e.name === "AbortError") {
      throw new Error(
        "El algoritmo tardó demasiado (más de 5 minutos). Intenta reducir la población o el número de generaciones."
      );
    }
    throw new Error("No se pudo conectar con el servidor. Verifica que el backend esté corriendo.");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? "Error al ejecutar el AG");
  }

  return res.json();
}