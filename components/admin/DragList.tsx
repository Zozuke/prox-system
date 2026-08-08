'use client';

import { useState } from 'react';

interface Props<T> {
  items: T[];
  getId: (item: T) => string;
  onReorder: (newItems: T[]) => void;
  renderItem: (item: T, dragHandleProps: { draggable: boolean; onDragStart: () => void }) => React.ReactNode;
}

/**
 * Lista con arrastrar-y-soltar hecha con la API nativa de HTML5 Drag & Drop
 * (sin dependencias externas, para máxima compatibilidad).
 */
export default function DragList<T>({ items, getId, onReorder, renderItem }: Props<T>) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  function handleDrop(targetId: string) {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      setOverId(null);
      return;
    }
    const fromIndex = items.findIndex((i) => getId(i) === draggedId);
    const toIndex = items.findIndex((i) => getId(i) === targetId);
    const reordered = [...items];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    onReorder(reordered);
    setDraggedId(null);
    setOverId(null);
  }

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const id = getId(item);
        return (
          <div
            key={id}
            onDragOver={(e) => {
              e.preventDefault();
              if (overId !== id) setOverId(id);
            }}
            onDrop={() => handleDrop(id)}
            onDragEnd={() => {
              setDraggedId(null);
              setOverId(null);
            }}
            className={`transition ${overId === id && draggedId && draggedId !== id ? 'translate-y-0.5 ring-2 ring-[var(--brand-300)]' : ''} ${draggedId === id ? 'opacity-40' : ''}`}
          >
            {renderItem(item, { draggable: true, onDragStart: () => setDraggedId(id) })}
          </div>
        );
      })}
    </div>
  );
}
