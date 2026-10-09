let arr = [...document.querySelectorAll("div[role=\"feed\"] > div")]
let contactos = arr.filter((ele) => ele.className === "")
let nombre = contactos[0].firstElementChild.firstChild.firstElementChild.textContent
let arr = [...document.querySelectorAll("div[role=\"feed\"] > div")];
let contactos = arr.filter((ele) => ele.className === "");

(() => {
  const texto = (elemento) =>
    elemento?.textContent?.replace(/\s+/g, " ").trim() || "";

  const datos = contactos.map((contenedor) => {
    const ficha = contenedor.matches('[role="article"]')
      ? contenedor
      : contenedor.querySelector('[role="article"]');

    if (!ficha) return null;

    const enlaceMaps = ficha.querySelector(
      'a[aria-label][href*="/maps/place/"]'
    );

    const enlaceWeb = ficha.querySelector(
      'a[data-value="Website"]'
    );

    const telefonoNodo = [...ficha.querySelectorAll("span")].find(
      (span) =>
        span.childElementCount === 0 &&
        /^(?:\+\d{1,3}[\s.-]?)?(?:\d[\s.-]?){8,14}\d$/.test(texto(span))
    );

    const filaContacto = telefonoNodo?.closest("div");
    const filaUbicacion = filaContacto?.previousElementSibling;

    const partesUbicacion = filaUbicacion
      ? [...filaUbicacion.children].filter(
          (elemento) => elemento.tagName === "SPAN"
        )
      : [];

    const categoriaNodo = partesUbicacion[0];

    const direccionNodo = partesUbicacion.length > 1
      ? partesUbicacion.at(-1)?.lastElementChild
      : null;

    const valoracionNodo = [
      ...ficha.querySelectorAll('[role="img"][aria-label]')
    ].find((elemento) =>
      /^\s*[\d.,]+\s+stars?\s+[\d.,]+\s+Reviews?\s*$/i.test(
        elemento.getAttribute("aria-label") || ""
      )
    );

    const valoracion = valoracionNodo
      ?.getAttribute("aria-label")
      ?.match(/^\s*([\d.,]+)\s+stars?\s+([\d.,]+)\s+Reviews?\s*$/i);

    return {
      Nombre: enlaceMaps?.getAttribute("aria-label") || "",
      Telefono: texto(telefonoNodo),
      Pagina: enlaceWeb?.getAttribute("href") || "",
      GoogleMaps: enlaceMaps?.getAttribute("href") || "",
      Categoria: texto(categoriaNodo),
      Direccion: texto(direccionNodo),
      Horario: texto(filaContacto?.firstElementChild),
      Puntuacion: valoracion?.[1] || "",
      Resenas: valoracion?.[2] || ""
    };
  }).filter(Boolean);

  if (!datos.length) {
    console.warn("No se encontraron fichas en el array contactos.");
    return;
  }

  // Mostrar la tabla en la consola.
  console.table(datos);

  // Crear el CSV con separador de punto y coma.
  const columnas = Object.keys(datos[0]);

  const escaparCSV = (valor) => {
    let contenido = String(valor ?? "");

    // Evitar que un contenido se interprete como fórmula.
    if (/^\s*[=+\-@]/.test(contenido)) {
      contenido = "'" + contenido;
    }

    return `"${contenido.replace(/"/g, '""')}"`;
  };

  const csv = [
    columnas.map(escaparCSV).join(";"),
    ...datos.map((fila) =>
      columnas.map((columna) => escaparCSV(fila[columna])).join(";")
    )
  ].join("\r\n");

  // BOM UTF-8 para conservar tildes y caracteres especiales.
  const archivo = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(archivo);
  const enlace = document.createElement("a");

  enlace.href = url;
  enlace.download = "contactos_google_maps.csv";

  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();

  setTimeout(() => URL.revokeObjectURL(url), 10000);

  console.log(`Exportados ${datos.length} contactos.`);
})();
