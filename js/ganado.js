/**
 * @author Jorge Enrique Parra Garcia
 *Modelo de datos de especies ganaderas, ubicaciones, lugares optimos de compra y consumo activo de la api.
 */

const STORAGE_KEY = "ganado_reproduccion_db";

// Catálogo inicial de especies ganaderas orientadas a reproducción
const ESPECIES_INICIALES = [
    {
        id: 1,
        nombre: "Brahman Rojo",
        especie: "Bovino",
        proposito: "Reproducción y pie de cría cárnico",
        ubicacion: "Tabasco, Veracruz y Chiapas (Trópico húmedo)",
        estadoPrincipal: "Veracruz",
        climaOptimo: "Cálido húmedo y subhúmedo",
        lugarCompraOptimo: "Asociación Mexicana de Criadores de Cebú (AMCC) - Tampico / Veracruz",
        tipoProveedor: "Subasta ganadera certificada y ranchos de registro genealógico",
        precioEstimado: "$42,000 - $65,000 MXN por semental joven",
        parametrosReproductivos: "Alta fertilidad en clima caluroso, facilidad de parto y gran habilidad materna.",
        faoItemCode: "866", // Código FAOSTAT para ganado bovino
        imagen: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        nombre: "Holstein Friesian",
        especie: "Bovino Toro",
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
        proposito: "Reproducción ovina para carne",
        ubicacion: "Querétaro, Hidalgo, Estado de México y Guanajuato",
        estadoPrincipal: "Querétaro",
        climaOptimo: "Templado y semiárido",
        lugarCompraOptimo: "Exposición Nacional Ovina y Criadores Registrados en Querétaro y Bajío",
        tipoProveedor: "Apriscos de pie de cría con certificado sanitario libre de brucelosis",
        precioEstimado: "$9,500 - $18,000 MXN por semental",
        parametrosReproductivos: "Poliéstrica anual (reproducción todo el año), alta prolificidad y rápido destete.",
        faoItemCode: "976", // Código FAOSTAT para ovinos
        imagen: "https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 4,
        nombre: "Boer",
        especie: "Caprino",
        proposito: "Reproducción caprina cárnica",
        ubicacion: "Coahuila, Nuevo León, San Luis Potosí y Guanajuato",
        estadoPrincipal: "San Luis Potosí",
        climaOptimo: "Árido y semiárido",
        lugarCompraOptimo: "Centros de Mejoramiento Genético Caprino en Matehuala y Comarca Lagunera",
        tipoProveedor: "Granjas caprinas registradas con control genealógico",
        precioEstimado: "$8,000 - $15,000 MXN por ejemplar reproductor",
        parametrosReproductivos: "Tasa de parición superior al 180% (partos gemelares frecuentes) y excelente adaptación al pastoreo.",
        faoItemCode: "1016", // Código FAOSTAT para caprinos
        imagen: "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 5,
        nombre: "Duroc",
        especie: "Porcino",
        proposito: "Línea paterna para reproducción porcina",
        ubicacion: "Sonora, Jalisco, Yucatán y Guanajuato",
        estadoPrincipal: "Jalisco",
        climaOptimo: "Adaptable en granjas tecnificadas",
        lugarCompraOptimo: "Granjas Núcleo de Genética Porcina en Tepatitlán (Jalisco) y Ciudad Obregón (Sonora)",
        tipoProveedor: "Centros de transferencia genética y granjas certificadas TIF",
        precioEstimado: "$14,000 - $24,000 MXN por verraco",
        parametrosReproductivos: "Excelente vigor híbrido al cruzar con Landrace o Yorkshire; alta velocidad de crecimiento.",
        faoItemCode: "1034", // Código FAOSTAT para porcinos
        imagen: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80"
    }
];

// Inicializa los datos en localStorage si aún no existen
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

/* Consumo activo de API pública para enriquecer datos geográficos y de mercado*/
async function consultarDatosApiSector(pais = "mexico") {
    try {
        const respuesta = await fetch(`https://restcountries.com/v3.1/name/${pais}?fields=name,region,subregion,population,currencies`);
        if (!respuesta.ok) {
            throw new Error("No se pudo conectar con el servicio externo");
        }
        const datos = await respuesta.json();
        return datos[0];
    } catch (error) {
        console.error("Error al consultar API externa:", error);
        return null;
    }
}