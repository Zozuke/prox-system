import type { BlockType, BlockConfig } from './types';

export const BLOCK_LIBRARY: { type: BlockType; label: string; icon: string; defaultConfig: BlockConfig }[] = [
  { type: 'heading', label: 'Título / subtítulo', icon: '🔤', defaultConfig: { title: 'Nuevo título', subtitle: '' } },
  { type: 'text', label: 'Texto', icon: '📝', defaultConfig: { body: 'Escribe aquí tu texto…' } },
  { type: 'card', label: 'Tarjeta', icon: '🗂️', defaultConfig: { title: 'Título de la tarjeta', body: 'Descripción breve.', color: 'brand' } },
  { type: 'button', label: 'Botón', icon: '🔘', defaultConfig: { buttonText: 'Ver más', buttonUrl: '/', color: 'brand' } },
  { type: 'image', label: 'Imagen', icon: '🖼️', defaultConfig: { imageUrl: '', title: '' } },
  { type: 'input', label: 'Entrada de texto', icon: '✍️', defaultConfig: { inputLabel: 'Tu nombre', inputPlaceholder: 'Escribe aquí…' } },
  { type: 'form', label: 'Formulario', icon: '🧾', defaultConfig: { title: 'Formulario', fields: [{ name: 'nombre', label: 'Nombre', type: 'text', required: true }], submitText: 'Enviar' } },
  { type: 'notification', label: 'Notificación / alerta', icon: '🔔', defaultConfig: { title: 'Importante', body: 'Este es un aviso.', color: 'yellow' } },
  { type: 'divider', label: 'Divisor', icon: '➖', defaultConfig: {} },
];
