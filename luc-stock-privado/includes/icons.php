<?php

namespace LUC\StockPrivado;

defined('ABSPATH') || exit;

/**
 * Icono SVG de candado, para visitantes sin sesión.
 *
 * Usa stroke="currentColor" para que el color del icono se pueda
 * controlar por CSS (por ejemplo desde Elementor Pro).
 */
function icono_candado()
{
    return '<svg class="luc-stock__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
}

/**
 * Icono SVG de caja, para usuarios con sesión iniciada.
 */
function icono_caja()
{
    return '<svg class="luc-stock__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>';
}

/**
 * Icono automático según el estado de sesión.
 */
function icono_por_defecto($logueado)
{
    return $logueado ? icono_caja() : icono_candado();
}
