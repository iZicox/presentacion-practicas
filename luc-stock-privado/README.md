# LUC Stock Privado

Plugin de WordPress + WooCommerce que muestra el inventario disponible de
un producto **solo a usuarios con sesión iniciada**. A los visitantes les
muestra un aviso con enlaces para **iniciar sesión** o **registrarse**.

Se inserta en la plantilla de página de producto con el shortcode:

```
[luc_stock_privado]
```

La estructura base del HTML es la misma con sesión y sin sesión; solo
cambian las clases modificadoras y el contenido de `.luc-stock__valor`,
pensados para aplicar CSS personalizado (por ejemplo, desde Elementor Pro).

## Requisitos

- WordPress 5.8 o superior
- PHP 7.4 o superior
- WooCommerce activo

## Instalación

1. Copia la carpeta `luc-stock-privado` en `wp-content/plugins/`
   (o instala `luc-stock-privado.zip` desde Plugins → Añadir nuevo → Subir plugin).
2. Activa el plugin.

## Cómo usarlo

1. Activa el plugin y comprueba que WooCommerce está activo.
2. Si quieres que aparezca el enlace **Registrarse**, activa la opción
   "Permitir a los clientes crear una cuenta en la página Mi cuenta" en
   **WooCommerce → Ajustes → Cuentas y privacidad**. Si usas una página de
   registro propia, pásala con el atributo `url_registro`.
3. Edita la plantilla de la página de producto (con Elementor Pro o con el
   editor de plantillas del tema) y añade un widget **Shortcode** donde
   quieras mostrar el stock.
4. Pega el shortcode:
   ```
   [luc_stock_privado]
   ```
5. Guarda, purga la caché si la tienes activada y prueba en una ventana de
   incógnito: los enlaces solo se muestran a los visitantes sin sesión.

Para un visitante sin sesión, el shortcode pinta:

```
DISPONIBILIDAD
Inicia sesión o regístrate para ver stock disponible
Iniciar sesión  ·  Registrarse
```

Para un usuario con sesión iniciada, pinta la cantidad y el estado:

```
DISPONIBILIDAD
12 unidades disponibles
```

### En Elementor Pro

1. Plantillas → Plantilla de producto (Producto individual).
2. Añade un widget **Shortcode** donde quieras mostrar el stock.
3. Pega `[luc_stock_privado]`.

### Personalizar los enlaces

```
[luc_stock_privado enlace_registro="no"]
[luc_stock_privado enlace_login="no"]
[luc_stock_privado texto_login="Entrar" texto_registro="Crear cuenta"]
[luc_stock_privado url_registro="https://tusitio.com/registro/"]
```

En la tabla de [atributos del shortcode](#atributos-del-shortcode) tienes
todas las opciones.

## Atributos del shortcode

| Atributo | Por defecto | Descripción |
| --- | --- | --- |
| `id` | producto actual | ID del producto a consultar |
| `etiqueta` | `Disponibilidad` | Texto de la etiqueta superior. Vacío para ocultarla |
| `texto_invitado` | `Inicia sesión o regístrate para ver stock disponible` | Mensaje para visitantes sin sesión |
| `enlace_login` | `si` | `si` muestra el enlace "Iniciar sesión" |
| `enlace_registro` | `si` | `si` muestra el enlace "Registrarse" |
| `url_registro` | vacío | URL personalizada para el registro. Tiene prioridad sobre la detección automática y activa el enlace aunque `enlace_registro="no"` |
| `texto_login` | `Iniciar sesión` | Texto del enlace de acceso |
| `texto_registro` | `Registrarse` | Texto del enlace de registro |
| `cantidad` | `si` | `no` muestra solo el estado, sin la cifra exacta |
| `icono` | automático | `oculto` para quitarlo, o HTML propio (por ejemplo un emoji) |

Ejemplos:

```
[luc_stock_privado]
[luc_stock_privado texto_invitado="Para ver el stock, inicia sesión o crea una cuenta"]
[luc_stock_privado url_registro="https://tusitio.com/registro/"]
[luc_stock_privado texto_login="Entrar" texto_registro="Crear cuenta"]
[luc_stock_privado enlace_registro="no"]
[luc_stock_privado enlace_login="no" enlace_registro="si"]
[luc_stock_privado etiqueta="Unidades" cantidad="si"]
[luc_stock_privado icono="oculto"]
```

## Estructura HTML

La estructura base en los dos casos (el visitante añade los enlaces):

```html
<div class="luc-stock luc-stock--invitado" data-luc-stock data-producto="123" data-estado="invitado">
    <div class="luc-stock__contenido">
        <span class="luc-stock__icono" aria-hidden="true">…</span>
        <div class="luc-stock__texto">
            <span class="luc-stock__etiqueta">Disponibilidad</span>
            <span class="luc-stock__valor">
                <span class="luc-stock__mensaje">Inicia sesión o regístrate para ver stock disponible</span>
                <span class="luc-stock__acciones">
                    <a class="luc-stock__enlace luc-stock__enlace--login" href="…">Iniciar sesión</a>
                    <span class="luc-stock__separador" aria-hidden="true">·</span>
                    <a class="luc-stock__enlace luc-stock__enlace--registro" href="…">Registrarse</a>
                </span>
            </span>
        </div>
    </div>
</div>
```

Con sesión iniciada se mantiene la estructura base y cambia la clase del contenedor:

```html
<div class="luc-stock luc-stock--logueado luc-stock--disponible" data-luc-stock data-producto="123" data-estado="disponible">
    <!-- … misma estructura … -->
</div>
```

Dentro de `.luc-stock__valor` cambia el contenido según el caso:

| Caso | Clases del contenedor | Contenido de `.luc-stock__valor` |
| --- | --- | --- |
| Visitante | `luc-stock--invitado` | `span.luc-stock__mensaje` + `span.luc-stock__acciones` con los enlaces `a.luc-stock__enlace--login` y `a.luc-stock__enlace--registro` |
| Con sesión y cifra | `luc-stock--logueado luc-stock--con-cantidad` | `span.luc-stock__cantidad` + `span.luc-stock__unidad` |
| Con sesión, disponible | `luc-stock--logueado luc-stock--disponible` | `span.luc-stock__estado` con modificador `--disponible` |
| Con sesión, bajo pedido | `luc-stock--logueado luc-stock--bajo-pedido` | `span.luc-stock__estado` con modificador `--bajo-pedido` |
| Con sesión, agotado | `luc-stock--logueado luc-stock--agotado` | `span.luc-stock__estado` con modificador `--agotado` |

El atributo `data-estado` repite el estado para selectores CSS o JavaScript.

## CSS

Ejemplos (para el CSS personalizado de Elementor Pro):

```css
.luc-stock--invitado .luc-stock__valor { color: #6b7280; }
.luc-stock__enlace--registro { color: #16a34a; }
.luc-stock__enlace--login { color: #2563eb; }
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
| `luc_stock_texto_login` | Cambiar el texto del enlace de acceso |
| `luc_stock_texto_registro` | Cambiar el texto del enlace de registro |
| `luc_stock_texto_estado` | Cambiar los textos de estado |
| `luc_stock_clases` | Añadir o quitar clases del contenedor |
| `luc_stock_html` | Reemplazar por completo el HTML |
| `luc_stock_cargar_css` | Activar o desactivar los estilos base |

## Notas

- El dato de stock solo se genera en el servidor para usuarios con permiso:
  los visitantes nunca lo reciben en el HTML.
- Los enlaces solo se muestran a visitantes sin sesión. Si estás conectado
  como administrador verás el stock, no el aviso; prueba en una ventana de
  incógnito. En el editor de Elementor los enlaces tampoco son clicables:
  usa la vista previa.
- El enlace "Iniciar sesión" usa `wp_login_url()` y vuelve al producto
  después de acceder.
- El enlace "Registrarse" lleva a la página **Mi cuenta** de WooCommerce
  cuando está activada la opción "Permitir a los clientes crear una cuenta
  en la página Mi cuenta" (WooCommerce → Ajustes → Cuentas y privacidad)
  o, si no, al registro nativo de WordPress. Si no hay ningún registro
  disponible y no se indica una URL propia en `url_registro`, el enlace
  se oculta.
- Tras registrarse en WooCommerce, el usuario queda en Mi cuenta. Si se
  usa el registro nativo de WordPress, se añade `redirect_to` para volver
  al producto.
- Con caché de página completa (WP Rocket, LiteSpeed, APO de Cloudflare),
  excluye a los usuarios con sesión de la caché para no servirles la
  versión de visitante.
- En productos variables se suman las cantidades de las variaciones que
  gestionan stock.
- El plugin no oculta el stock que WooCommerce muestra por defecto en la
  plantilla; eso se ajusta por CSS o en la propia plantilla.
