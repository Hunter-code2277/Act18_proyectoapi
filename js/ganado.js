/**
 * @author Jorge Enrique Parra Garcia
 * Modelo de datos de especies ganaderas (localStorage) y consumo de API Ninjas Animals API (/v1/animals).
 */

const STORAGE_KEY = "ganado_reproduccion_db";
const API_NINJAS_KEY = "Vhz70xxlnv2ElWkn59o2P9SB5DgkVrbBSQ5qRINx";
const NINJAS_CACHE_PREFIX = "agro_ninjas_cache_";

const ESPECIES_INICIALES = [
    {
        id: 1,
        nombre: "Brahman Rojo",
        especie: "Bovino",
        queryApi: "cattle",
        proposito: "Reproducción y pie de cría cárnico",
        ubicacion: "Tabasco, Veracruz y Chiapas (Trópico húmedo)",
        estadoPrincipal: "Veracruz",
        climaOptimo: "Cálido húmedo y subhúmedo",
        lugarCompraOptimo: "Asociación Mexicana de Criadores de Cebú (AMCC) - Tampico / Veracruz",
        tipoProveedor: "Subasta ganadera certificada y ranchos de registro genealógico",
        precioEstimado: "$42,000 - $65,000 MXN por semental joven",
        parametrosReproductivos: "Alta fertilidad en clima caluroso, facilidad de parto y gran habilidad materna.",
        faoItemCode: "866",
        imagen: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        nombre: "Holstein Friesian",
        especie: "Bovino",
        queryApi: "cattle",
        proposito: "Reproducción lechera especializada",
        ubicacion: "Jalisco (Los Altos), Guanajuato y Coahuila (Comarca Lagunera)",
        estadoPrincipal: "Guanajuato",
        climaOptimo: "Templado a semiárido con manejo tecnificado",
        lugarCompraOptimo: "Cuenca Lechera de Los Altos de Jalisco y Establos Certificados del Bajío (León / Irapuato)",
        tipoProveedor: "Establos de alta genética y centros de mejoramiento genético",
        precioEstimado: "$35,000 - $55,000 MXN por vaquilla cargada",
        parametrosReproductivos: "Primer parto entre 24 y 26 meses; alta producción láctea y disponibilidad de semen sexado.",
        faoItemCode: "866",
        imagen: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        nombre: "Dorper",
        especie: "Ovino",
        queryApi: "sheep",
        proposito: "Reproducción ovina para carne",
        ubicacion: "Querétaro, Hidalgo, Estado de México y Guanajuato",
        estadoPrincipal: "Querétaro",
        climaOptimo: "Templado y semiárido",
        lugarCompraOptimo: "Exposición Nacional Ovina y Criadores Registrados en Querétaro y Bajío",
        tipoProveedor: "Apriscos de pie de cría con certificado sanitario libre de brucelosis",
        precioEstimado: "$9,500 - $18,000 MXN por semental",
        parametrosReproductivos: "Poliéstrica anual (reproducción todo el año), alta prolificidad y rápido destete.",
        faoItemCode: "976",
        imagen: "https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 4,
        nombre: "Boer",
        especie: "Caprino",
        queryApi: "goat",
        proposito: "Reproducción caprina cárnica",
        ubicacion: "Coahuila, Nuevo León, San Luis Potosí y Guanajuato",
        estadoPrincipal: "San Luis Potosí",
        climaOptimo: "Árido y semiárido",
        lugarCompraOptimo: "Centros de Mejoramiento Genético Caprino en Matehuala y Comarca Lagunera",
        tipoProveedor: "Granjas caprinas registradas con control genealógico",
        precioEstimado: "$8,000 - $15,000 MXN por ejemplar reproductor",
        parametrosReproductivos: "Tasa de parición superior al 180% (partos gemelares frecuentes) y excelente adaptación al pastoreo.",
        faoItemCode: "1016",
        imagen: "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 5,
        nombre: "Duroc",
        especie: "Porcino",
        queryApi: "pig",
        proposito: "Línea paterna para reproducción porcina",
        ubicacion: "Sonora, Jalisco, Yucatán y Guanajuato",
        estadoPrincipal: "Jalisco",
        climaOptimo: "Adaptable en granjas tecnificadas",
        lugarCompraOptimo: "Granjas Núcleo de Genética Porcina en Tepatitlán (Jalisco) y Ciudad Obregón (Sonora)",
        tipoProveedor: "Centros de transferencia genética y granjas certificadas TIF",
        precioEstimado: "$14,000 - $24,000 MXN por verraco",
        parametrosReproductivos: "Excelente vigor híbrido al cruzar con Landrace o Yorkshire; alta velocidad de crecimiento.",
        faoItemCode: "1034",
        imagen: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80"
    }
];

function obtenerGanado() {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (!guardado) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ESPECIES_INICIALES));
        return ESPECIES_INICIALES;
    }
    return JSON.parse(guardado);
}

function obtenerSoloEspecie(textoEspecie) {
    if (!textoEspecie) return "";
    return textoEspecie.split("(")[0].trim();
}

function guardarGanado(lista) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

function resolverQueryNinjas(itemEspecie) {
    if (itemEspecie && itemEspecie.queryApi) {
        return itemEspecie.queryApi.trim().toLowerCase();
    }
    const t = (itemEspecie?.especie || "").toLowerCase();
    if (t.includes("bovino") || t.includes("vaca") || t.includes("toro")) return "cattle";
    if (t.includes("ovino") || t.includes("oveja")) return "sheep";
    if (t.includes("caprino") || t.includes("cabra")) return "goat";
    if (t.includes("porcino") || t.includes("cerdo")) return "pig";
    return "cattle";
}

/**
 * Consulta API Ninjas Animals API (/v1/animals) enviando la clave en X-Api-Key.
 * Guarda el resultado en sessionStorage para optimizar peticiones.
 */
async function consultarApiNinjasAnimal(nombreComun) {
    const consulta = (nombreComun || "cattle").trim().toLowerCase();
    const claveCache = `${NINJAS_CACHE_PREFIX}${consulta}`;
    const cacheGuardado = sessionStorage.getItem(claveCache);

    if (cacheGuardado) {
        return JSON.parse(cacheGuardado);
    }

    try {
        const url = `https://api.api-ninjas.com/v1/animals?name=${encodeURIComponent(consulta)}`;
        const respuesta = await fetch(url, {
            method: "GET",
            headers: {
                "X-Api-Key": API_NINJAS_KEY
            }
        });

        if (!respuesta.ok) {
            throw new Error(`Error HTTP ${respuesta.status} al consultar API Ninjas`);
        }

        const datos = await respuesta.json();
        if (Array.isArray(datos) && datos.length > 0) {
            sessionStorage.setItem(claveCache, JSON.stringify(datos[0]));
            return datos[0];
        }
        return null;
    } catch (error) {
        console.error("Error al consultar API Ninjas Animals:", error);
        return null;
    }
}