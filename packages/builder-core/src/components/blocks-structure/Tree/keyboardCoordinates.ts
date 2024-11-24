import {
  closestCorners,
  getFirstCollision,
  KeyboardCode,
  KeyboardCoordinateGetter,
  DroppableContainer,
} from '@dnd-kit/core';

import type { SensorContext } from './types';
import { getProjection } from './utilities';

const directions: string[] = [
  KeyboardCode.Down,
  KeyboardCode.Right,
  KeyboardCode.Up,
  KeyboardCode.Left,
];

const horizontal: string[] = [KeyboardCode.Left, KeyboardCode.Right];

export const sortableTreeKeyboardCoordinates: (
  context: SensorContext,
  indicator: boolean,
  indentationWidth: number
) => KeyboardCoordinateGetter = (context, indicator, indentationWidth) => (
  event,
  {
    currentCoordinates,
    context: { active, over, collisionRect, droppableRects, droppableContainers },
  }
) => {
  if (directions.includes(event.code)) {
    if (!active || !collisionRect) {
      return;
    }

    event.preventDefault();

    const {
      current: { items, offset },
    } = context;

    // Handle horizontal movement (Left/Right for nesting)
    if (horizontal.includes(event.code) && over?.id) {
      const { depth, maxDepth, minDepth, parentId } = getProjection(
        items,
        active.id,
        over.id,
        offset,
        indentationWidth
      );

      // Only allow nesting indicators if parentId is valid (inside a group block)
      // Explicitly suppress nesting if parentId is null or invalid
      if (parentId !== null) {
        switch (event.code) {
          case KeyboardCode.Left:
            if (depth > minDepth) {
              return {
                ...currentCoordinates,
                x: currentCoordinates.x - indentationWidth,
              };
            }
            break;
          case KeyboardCode.Right:
            if (depth < maxDepth) {
              return {
                ...currentCoordinates,
                x: currentCoordinates.x + indentationWidth,
              };
            }
            break;
        }
      }

      return undefined; // Prevent nesting indicators in invalid cases
    }

    // Handle vertical movement (Up/Down for placement)
    const containers: DroppableContainer[] = [];

    droppableContainers.forEach((container) => {
      if (container?.disabled || container.id === over?.id) {
        return;
      }

      const rect = droppableRects.get(container.id);

      if (!rect) {
        return;
      }

      switch (event.code) {
        case KeyboardCode.Down:
          if (collisionRect.top < rect.top) {
            containers.push(container);
          }
          break;
        case KeyboardCode.Up:
          if (collisionRect.top > rect.top) {
            containers.push(container);
          }
          break;
      }
    });

    const collisions = closestCorners({
      active,
      collisionRect,
      pointerCoordinates: null,
      droppableRects,
      droppableContainers: containers,
    });
    let closestId = getFirstCollision(collisions, 'id');

    if (closestId === over?.id && collisions.length > 1) {
      closestId = collisions[1].id;
    }

    if (closestId && over?.id) {
      const activeRect = droppableRects.get(active.id);
      const newRect = droppableRects.get(closestId);
      const newDroppable = droppableContainers.get(closestId);

      if (activeRect && newRect && newDroppable) {
        const newIndex = items.findIndex(({ id }) => id === closestId);
        const newItem = items[newIndex];
        const activeIndex = items.findIndex(({ id }) => id === active.id);
        const activeItem = items[activeIndex];

        if (newItem && activeItem) {
          const { depth, parentId } = getProjection(
            items,
            active.id,
            closestId,
            (newItem.depth - activeItem.depth) * indentationWidth,
            indentationWidth
          );

          const isBelow = newIndex > activeIndex;
          const modifier = isBelow ? 1 : -1;

          // --- Placement Indicator: Always Visible ---
          const placementOffset = indicator
            ? (collisionRect.height - activeRect.height) / 2
            : 0;

          const placementCoordinates = {
            x: newRect.left, // Vertical placement line
            y: newRect.top + modifier * placementOffset,
          };

          // --- Nesting Indicator: Only for Valid Nesting ---
          // Check if the parentId is valid (inside a group block)
          if (parentId !== null) {
            const nestingCoordinates = {
              x: newRect.left + depth * indentationWidth, // Horizontal nesting line
              y: newRect.top + modifier * placementOffset,
            };

            return nestingCoordinates; // Show nesting indicator
          }

          return placementCoordinates; // Show placement indicator only (no nesting)
        }
      }
    }
  }

  return undefined;
};