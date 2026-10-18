# LUC Stock Privado

Plugin de WordPress + WooCommerce que muestra el inventario disponible de
un producto **solo a usuarios con sesión iniciada**. A los visitantes les
muestra un aviso para iniciar sesión.

Se inserta en la plantilla de página de producto con el shortcode:

```
[luc_stock_privado]
```

El HTML es el mismo con sesión y sin sesión; solo cambian las clases
modificadoras, pensadas para aplicar CSS personalizado (por ejemplo,
desde Elementor Pro).

## Requisitos

- WordPress 5.8 o superior
- PHP 7.4 o superior
- WooCommerce activo

## Instalación

1. Copia la carpeta `luc-stock-privado` en `wp-content/plugins/`
   (o instala `luc-stock-privado.zip` desde Plugins → Añadir nuevo → Subir plugin).
2. Activa el plugin.

## Uso en Elementor Pro

1. Plantillas → Plantilla de producto (Producto individual).
2. Añade un widget **Shortcode** donde quieras mostrar el stock.
3. Pega `[luc_stock_privado]`.

## Atributos del shortcode

| Atributo | Por defecto | Descripción |
| --- | --- | --- |
| `id` | producto actual | ID del producto a consultar |
| `etiqueta` | `Disponibilidad` | Texto de la etiqueta superior. Vacío para ocultarla |
| `texto_invitado` | `Inicia sesión para ver stock disponible` | Mensaje para visitantes sin sesión |
| `enlace_login` | `no` | `si` convierte el mensaje en enlace a la página de acceso |
| `cantidad` | `si` | `no` muestra solo el estado, sin la cifra exacta |
| `icono` | automático | `oculto` para quitarlo, o HTML propio (por ejemplo un emoji) |

Ejemplos:

```
[luc_stock_privado]
[luc_stock_privado enlace_login="si"]
[luc_stock_privado etiqueta="Unidades" cantidad="si"]
[luc_stock_privado icono="oculto" texto_invitado="Regístrate para consultar disponibilidad"]
```

## Estructura HTML

La misma estructura en los dos casos:

```html
<div class="luc-stock luc-stock--invitado" data-luc-stock data-producto="123" data-estado="invitado">
    <div class="luc-stock__contenido">
        <span class="luc-stock__icono" aria-hidden="true">…</span>
        <div class="luc-stock__texto">
            <span class="luc-stock__etiqueta">Disponibilidad</span>
            <span class="luc-stock__valor">…</span>
        </div>
    </div>
</div>
```

Con sesión iniciada solo cambia la clase del contenedor:

```html
<div class="luc-stock luc-stock--logueado luc-stock--disponible" data-luc-stock data-producto="123" data-estado="disponible">
    <!-- … misma estructura … -->
</div>
```

Dentro de `.luc-stock__valor` cambia el contenido según el caso:

| Caso | Clases del contenedor | Contenido de `.luc-stock__valor` |
| --- | --- | --- |
| Visitante | `luc-stock--invitado` | `span.luc-stock__mensaje` (con `a.luc-stock__enlace` si `enlace_login="si"`) |
| Con sesión y cifra | `luc-stock--logueado luc-stock--con-cantidad` | `span.luc-stock__cantidad` + `span.luc-stock__unidad` |
| Con sesión, disponible | `luc-stock--logueado luc-stock--disponible` | `span.luc-stock__estado` con modificador `--disponible` |
| Con sesión, bajo pedido | `luc-stock--logueado luc-stock--bajo-pedido` | `span.luc-stock__estado` con modificador `--bajo-pedido` |
| Con sesión, agotado | `luc-stock--logueado luc-stock--agotado` | `span.luc-stock__estado` con modificador `--agotado` |

El atributo `data-estado` repite el estado para selectores CSS o JavaScript.

## CSS

Ejemplos (para el CSS personalizado de Elementor Pro):

```css
.luc-stock--invitado .luc-stock__valor { color: #6b7280; }
.luc-stock--con-cantidad .luc-stock__cantidad { color: #16a34a; }
.luc-stock--agotado .luc-stock__valor { color: #dc2626; }
.luc-stock--bajo-pedido .luc-stock__valor { color: #b45309; }
```

Los estilos base del plugin se pueden desactivar:

```php
add_filter('luc_stock_cargar_css', '__return_false');
```

## Filtros

| Filtro | Descripción |
| --- | --- |
| `luc_stock_usuario_puede_ver` | Decidir quién puede ver el stock (por ejemplo, un rol B2B) |
| `luc_stock_cantidad` | Sustituir la fuente del dato (por ejemplo, el stock del ERP) |
| `luc_stock_etiqueta` | Cambiar la etiqueta |
| `luc_stock_texto_invitado` | Cambiar el mensaje para visitantes |
| `luc_stock_texto_estado` | Cambiar los textos de estado |
| `luc_stock_clases` | Añadir o quitar clases del contenedor |
| `luc_stock_html` | Reemplazar por completo el HTML |
| `luc_stock_cargar_css` | Activar o desactivar los estilos base |

## Notas

- El dato de stock solo se genera en el servidor para usuarios con permiso:
  los visitantes nunca lo reciben en el HTML.
- Con caché de página completa (WP Rocket, LiteSpeed, APO de Cloudflare),
  excluye a los usuarios con sesión de la caché para no servirles la
  versión de visitante.
- En productos variables se suman las cantidades de las variaciones que
  gestionan stock.
- El plugin no oculta el stock que WooCommerce muestra por defecto en la
  plantilla; eso se ajusta por CSS o en la propia plantilla.
