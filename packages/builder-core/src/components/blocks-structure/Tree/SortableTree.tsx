import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Announcements,
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverlay,
  DragMoveEvent,
  DragEndEvent,
  DragOverEvent,
  MeasuringStrategy,
  DropAnimation,
  Modifier,
  defaultDropAnimation,
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import {
  buildTree,
  flattenTree,
  getProjection,
  getChildCount,
  removeItem,
  removeChildrenOf,
  setProperty,
} from './utilities';
import type { FlattenedItem, SensorContext, FormBlocks } from './types';
import { sortableTreeKeyboardCoordinates } from './keyboardCoordinates';
import { SortableTreeItem } from './components';
import { CSS } from '@dnd-kit/utilities';
import ThankYouScreensDnDContext from '../ThankyouScreensTree';

// --- Initial Items ---
const initialItems = [
  {
    id: 'welcome',
    name: 'welcome-screen',
    attributes: { label: 'Welcome Screen' },
  },
  {
    id: 'group1',
    name: 'group',
    attributes: { label: 'Group 1' },
    innerBlocks: [
      {
        id: 'Home',
        name: 'page',
        attributes: { label: 'Home' },
      },
      {
        id: 'About Us',
        name: 'page',
        attributes: { label: 'About Us' },
      },
    ],
  },
  {
    id: 'thank1',
    name: 'thank-you-screen',
    attributes: { label: 'Thank You Screen 1' },
  },
  {
    id: 'thank2',
    name: 'thank-you-screen',
    attributes: { label: 'Thank You Screen 2' },
  },
];

// --- Measuring Strategy ---
const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

// --- Drop Animation Config ---
const dropAnimationConfig: DropAnimation = {
  keyframes({ transform }) {
    return [
      { opacity: 1, transform: CSS.Transform.toString(transform.initial) },
      {
        opacity: 0,
        transform: CSS.Transform.toString({
          ...transform.final,
          x: transform.final.x + 5,
          y: transform.final.y + 5,
        }),
      },
    ];
  },
  easing: 'ease-out',
  sideEffects({ active }) {
    active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: defaultDropAnimation.duration,
      easing: defaultDropAnimation.easing,
    });
  },
};

interface Props {
  collapsible?: boolean;
  defaultItems?: FormBlocks;
  indentationWidth?: number;
  indicator?: boolean;
  removable?: boolean;
}

export function SortableTree({
  collapsible,
  defaultItems = initialItems,
  indicator = true,
  indentationWidth = 50,
  removable,
}: Props) {
  const [items, setItems] = useState(() => defaultItems);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [currentPosition, setCurrentPosition] = useState<{
    parentId: UniqueIdentifier | null;
    overId: UniqueIdentifier;
  } | null>(null);
  const mainBlocks = items.filter((block) => block.name !== 'thank-you-screen');
  const thankYouScreens = items.filter((block) => block.name === 'thank-you-screen');

  const updateMainBlocks = (newMainBlocks) => {
    const newBlocks = [...newMainBlocks, ...thankYouScreens];
    setItems(newBlocks);
  };

  const updateThankYouScreens = (newThankYouScreens) => {
    const newBlocks = [...mainBlocks, ...newThankYouScreens];
    setItems(newBlocks);
  };
  const flattenedItems = useMemo(() => {
    const flattenedItems = flattenTree(mainBlocks);
    const collapsedItems = flattenedItems.reduce<string[]>(
      (acc, { innerBlocks, collapsed, id }) =>
        collapsed && innerBlocks?.length ? [...acc, id] : acc,
      []
    );

    return removeChildrenOf(
      flattenedItems,
      activeId ? [activeId, ...collapsedItems] : collapsedItems
    );
  }, [activeId, items]);

  // --- Validate Group Blocks ---
  const isValidGroupBlock = (parentId: UniqueIdentifier | null): boolean => {
    if (!parentId) return false;
    const parentItem = flattenedItems.find((item) => item.id === parentId);
    return !!parentItem && parentItem.name === 'group';
  };

  const projected =
    activeId && overId
      ? getProjection(
        flattenedItems,
        activeId,
        overId,
        offsetLeft,
        indentationWidth
      )
      : null;

  const sensorContext: SensorContext = useRef({
    items: flattenedItems,
    offset: offsetLeft,
  });

  const [coordinateGetter] = useState(() =>
    sortableTreeKeyboardCoordinates(sensorContext, indicator, indentationWidth)
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    })
  );

  const sortedIds = useMemo(() => flattenedItems.map(({ id }) => id), [
    flattenedItems,
  ]);

  const activeItem = activeId
    ? flattenedItems.find(({ id }) => id === activeId)
    : null;

  useEffect(() => {
    sensorContext.current = {
      items: flattenedItems,
      offset: offsetLeft,
    };
  }, [flattenedItems, offsetLeft]);

  const announcements: Announcements = {
    onDragStart({ active }) {
      return `Picked up ${active.id}.`;
    },
    onDragMove({ active, over }) {
      return getMovementAnnouncement('onDragMove', active.id, over?.id);
    },
    onDragOver({ active, over }) {
      return getMovementAnnouncement('onDragOver', active.id, over?.id);
    },
    onDragEnd({ active, over }) {
      return getMovementAnnouncement('onDragEnd', active.id, over?.id);
    },
    onDragCancel({ active }) {
      return `Moving was cancelled. ${active.id} was dropped in its original position.`;
    },
  };

  return (
    <>
      <DndContext
        accessibility={{ announcements }}
        sensors={sensors}
        collisionDetection={closestCenter}
        measuring={measuring}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
          {flattenedItems.map(({ id, innerBlocks, collapsed, depth }) => (
            <SortableTreeItem
              key={id}
              id={id}
              value={id}
              depth={
                id === activeId && projected
                  ? isValidGroupBlock(projected.parentId)
                    ? projected.depth
                    : depth
                  : depth
              }
              indentationWidth={indentationWidth}
              indicator={indicator}
              collapsed={Boolean(collapsed && innerBlocks?.length)}
              onCollapse={
                collapsible && innerBlocks?.length
                  ? () => handleCollapse(id)
                  : undefined
              }
              onRemove={removable ? () => handleRemove(id) : undefined}
            />
          ))}
          {createPortal(
            <DragOverlay
              dropAnimation={dropAnimationConfig}
              modifiers={indicator ? [adjustTranslate] : undefined}
            >
              {activeId && activeItem ? (
                <SortableTreeItem
                  id={activeId}
                  depth={activeItem.depth}
                  clone
                  childCount={getChildCount(items, activeId) + 1}
                  value={activeId.toString()}
                  indentationWidth={indentationWidth}
                />
              ) : null}
            </DragOverlay>,
            document.body
          )}
        </SortableContext>
      </DndContext>
      <ThankYouScreensDnDContext
        thankYouScreens={thankYouScreens}
        setThankYouScreens={updateThankYouScreens}
      />
    </>
  );

  function handleDragStart({ active: { id: activeId } }: DragStartEvent) {
    setActiveId(activeId);
    setOverId(activeId);

    const activeItem = flattenedItems.find(({ id }) => id === activeId);

    if (activeItem) {
      setCurrentPosition({
        parentId: activeItem.parentId,
        overId: activeId,
      });
    }

    document.body.style.setProperty('cursor', 'grabbing');
  }

  function handleDragMove({ delta }: DragMoveEvent) {
    setOffsetLeft(delta.x);
  }

  function handleDragOver({ over }: DragOverEvent) {
    setOverId(over?.id ?? null);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    resetState();

    if (!over) return; // If no valid drop target, do nothing.

    const { depth, parentId } = getProjection(
      flattenedItems,
      active.id,
      over.id,
      offsetLeft,
      indentationWidth
    );

    const activeIndex = flattenedItems.findIndex(({ id }) => id === active.id);
    const overIndex = flattenedItems.findIndex(({ id }) => id === over.id);

    if (activeIndex === -1 || overIndex === -1) {
      return;
    }

    const activeItem = flattenedItems[activeIndex];
    const overItem = flattenedItems[overIndex];

    // --- Restriction for Welcome Screen ---
    if (activeItem.name === 'welcome-screen') {
      console.log('Welcome Screen cannot be dragged or reordered.');
      return; // Prevent the Welcome Screen from being dragged.
    }

    // --- Restriction for other items being moved before Welcome Screen ---
    if (overIndex === 0 && overItem.name === 'welcome-screen') {
      console.log('No block can be placed before the Welcome Screen.');
      return; // Prevent any block from being placed before the Welcome Screen.
    }

    // --- Restriction for Thank You Screens ---
    const lastNonThankYouScreenIndex = flattenedItems
      .map((item, index) => (item.name !== 'thank-you-screen' ? index : null))
      .filter((index) => index !== null)
      .pop(); // Index of the last non-Thank You Screen block

    const firstThankYouScreenIndex = flattenedItems.findIndex(
      (item) => item.name === 'thank-you-screen'
    ); // Index of the first Thank You Screen

    if (activeItem.name === 'thank-you-screen') {
      // Prevent Thank You Screens from being dragged above non-Thank You Screens
      if (overIndex <= lastNonThankYouScreenIndex) {
        console.log('Thank You Screens must remain at the bottom.');
        return;
      }

      // Allow sorting among Thank You Screens themselves
      if (overItem.name === 'thank-you-screen') {
        // Allow reordering among Thank You Screens
      } else if (depth > 0) {
        console.log('Thank You Screens cannot be nested.');
        return;
      }
    }

    // Prevent other blocks from being inserted between or after Thank You Screens
    if (firstThankYouScreenIndex !== -1 && overIndex >= firstThankYouScreenIndex) {
      console.log('Blocks cannot be placed between or after Thank You Screens.');
      return;
    }

    // --- Restriction for Group Blocks ---
    if (activeItem.name === 'group') {
      if (overItem.name === 'welcome-screen') {
        console.log('Group blocks cannot be moved above the Welcome Screen.');
        return; // Prevent moving group blocks above the Welcome Screen.
      }

      // Ensure groups cannot be nested in other groups
      if (parentId) {
        const projectedParent = flattenedItems.find(({ id }) => id === parentId);
        if (projectedParent?.name === 'group') {
          console.log(
            `Cannot nest group "${activeItem.id}" inside another group "${projectedParent.id}".`
          );
          return;
        }
      }
    }

    // --- Restriction for Non-group Items ---
    if (depth > 0 && !isValidGroupBlock(parentId)) {
      console.log('Invalid nesting. Non-group blocks can only be nested under valid group blocks.');
      return;
    }

    // --- Perform Reordering ---
    const newTree = [...flattenedItems];

    if (overIndex === 0) {
      // Special case: Ensure items being reordered at the top respect Welcome Screen restrictions.
      newTree[activeIndex] = {
        ...activeItem,
        depth,
        parentId: flattenedItems[overIndex].parentId,
      };
    } else {
      // General case: Adjust item depth and parentId based on the drop target.
      newTree[activeIndex] = {
        ...activeItem,
        depth,
        parentId: depth > 0 ? parentId : null,
      };
    }

    const reorderedTree = arrayMove(newTree, activeIndex, overIndex);
    const newItems = buildTree(reorderedTree);

    updateMainBlocks(newItems);
  }
  function handleDragCancel() {
    resetState();
  }

  function resetState() {
    setOverId(null);
    setActiveId(null);
    setOffsetLeft(0);
    setCurrentPosition(null);

    document.body.style.setProperty('cursor', '');
  }

  function handleRemove(id: UniqueIdentifier) {
    setItems((items) => removeItem(items, id));
  }

  function handleCollapse(id: UniqueIdentifier) {
    setItems((items) =>
      setProperty(items, id, 'collapsed', (value) => !value)
    );
  }

  function getMovementAnnouncement(
    eventName: string,
    activeId: UniqueIdentifier,
    overId?: UniqueIdentifier
  ) {
    if (overId && projected) {
      if (eventName !== 'onDragEnd') {
        if (
          currentPosition &&
          projected.parentId === currentPosition.parentId &&
          overId === currentPosition.overId
        ) {
          return;
        } else {
          setCurrentPosition({
            parentId: projected.parentId,
            overId,
          });
        }
      }

      const clonedItems: FlattenedItem[] = JSON.parse(
        JSON.stringify(flattenTree(items))
      );
      const overIndex = clonedItems.findIndex(({ id }) => id === overId);
      const activeIndex = clonedItems.findIndex(({ id }) => id === activeId);
      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);

      const previousItem = sortedItems[overIndex - 1];

      let announcement;
      const movedVerb = eventName === 'onDragEnd' ? 'dropped' : 'moved';
      const nestedVerb = eventName === 'onDragEnd' ? 'dropped' : 'nested';

      if (!previousItem) {
        const nextItem = sortedItems[overIndex + 1];
        announcement = `${activeId} was ${movedVerb} before ${nextItem.id}.`;
      } else {
        if (projected.depth > previousItem.depth) {
          announcement = `${activeId} was ${nestedVerb} under ${previousItem.id}.`;
        } else {
          let previousSibling: FlattenedItem | undefined = previousItem;
          while (previousSibling && projected.depth < previousSibling.depth) {
            const parentId: UniqueIdentifier | null = previousSibling.parentId;
            previousSibling = sortedItems.find(({ id }) => id === parentId);
          }

          if (previousSibling) {
            announcement = `${activeId} was ${movedVerb} after ${previousSibling.id}.`;
          }
        }
      }

      return announcement;
    }

    return;
  }
}

const adjustTranslate: Modifier = ({ transform }) => {
  return {
    ...transform,
    y: transform.y - 25,
  };
};