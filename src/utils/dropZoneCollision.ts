import type { CollisionDetection } from "@dnd-kit/core";
import type { DropZone, SortableItemData } from "../types";

export const dropZoneCollision: CollisionDetection = ({
  active,
  droppableContainers,
  pointerCoordinates,
}) => {
  if (!pointerCoordinates) return [];

  for (const container of droppableContainers) {
    if (container.id === active.id) continue;

    const rect = container.rect.current;
    if (!rect) continue;

    const { top, left, width, height } = rect;
    const { x, y } = pointerCoordinates;

    // Check if pointer is within the container rect
    if (x < left || x > left + width || y < top || y > top + height) continue;

    // Compute vertical position ratio within the container
    const ratio = (y - top) / height;

    let zone: DropZone;
    if (ratio < 0.25) {
      zone = "before";
    } else if (ratio > 0.75) {
      zone = "after";
    } else {
      zone = "nest";
    }

    return [
      {
        id: container.id,
        data: { droppableContainer: container, value: zone },
      },
    ];
  }

  return [];
};

function computeZone(y: number, top: number, height: number): DropZone {
  const ratio = (y - top) / height;
  if (ratio < 0.25) return "before";
  if (ratio > 0.75) return "after";
  return "nest";
}

/** Cross-card collision: when cards overlap, pick the container with the highest levelIndex (topmost card). */
export const crossCardCollision: CollisionDetection = ({
  active,
  droppableContainers,
  pointerCoordinates,
}) => {
  if (!pointerCoordinates) return [];

  const { x, y } = pointerCoordinates;

  let bestContainer: (typeof droppableContainers)[number] | null = null;
  let bestLevelIndex = -1;
  let bestZone: DropZone = "after";

  for (const container of droppableContainers) {
    if (container.id === active.id) continue;

    const rect = container.rect.current;
    if (!rect) continue;

    const { top, left, width, height } = rect;
    if (x < left || x > left + width || y < top || y > top + height) continue;

    const data = container.data.current as SortableItemData | undefined;
    const levelIndex = data?.levelIndex ?? 0;

    if (levelIndex > bestLevelIndex) {
      bestLevelIndex = levelIndex;
      bestContainer = container;
      bestZone = computeZone(y, top, height);
    }
  }

  if (!bestContainer) return [];

  return [
    {
      id: bestContainer.id,
      data: { droppableContainer: bestContainer, value: bestZone },
    },
  ];
};
