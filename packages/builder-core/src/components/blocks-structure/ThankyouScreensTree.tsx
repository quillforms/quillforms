import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function DraggableItem({ id, name }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {name}
        </div>
    );
}
export default function ThankYouScreensDnDContext({ thankYouScreens, setThankYouScreens }) {
    const handleDragEnd = ({ active, over }) => {
        if (!over) return;

        const activeIndex = thankYouScreens.findIndex((screen) => screen.id === active.id);
        const overIndex = thankYouScreens.findIndex((screen) => screen.id === over.id);

        if (activeIndex !== overIndex) {
            const newScreens = arrayMove(thankYouScreens, activeIndex, overIndex);
            setThankYouScreens(newScreens);
        }
    };

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={thankYouScreens.map((screen) => screen.id)}>
                {thankYouScreens.map((screen) => (
                    <DraggableItem key={screen.id} id={screen.id} name={screen.name} />
                ))}
            </SortableContext>
        </DndContext>
    );
}