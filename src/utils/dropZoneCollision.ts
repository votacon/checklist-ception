import type { CollisionDetection } from "@dnd-kit/core";
import type { DropZone } from "../types";

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
