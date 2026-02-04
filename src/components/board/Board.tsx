"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useAppState } from "@/context/AppContext";
import { COLUMNS, PRIORITY_CONFIG } from "@/lib/constants";
import { KanbanStatus } from "@/lib/types";
import Column from "./Column";

export default function Board() {
  const { state, dispatch } = useAppState();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function getColumnTasks(status: KanbanStatus) {
    return state.tasks
      .filter((t) => t.status === status)
      .sort((a, b) => {
        // Primary sort: priority (Critical > High > Medium > Low)
        const priorityDiff = PRIORITY_CONFIG[a.priority].order - PRIORITY_CONFIG[b.priority].order;
        if (priorityDiff !== 0) return priorityDiff;
        // Secondary sort: manual order within same priority
        return a.order - b.order;
      });
  }

  function findTaskColumn(taskId: string): KanbanStatus | undefined {
    return state.tasks.find((t) => t.id === taskId)?.status;
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeCol = findTaskColumn(activeId);
    const overCol = COLUMNS.find((c) => c.id === overId)
      ? (overId as KanbanStatus)
      : findTaskColumn(overId);

    if (!activeCol || !overCol || activeCol === overCol) return;

    const overTasks = getColumnTasks(overCol);
    const overIndex = overTasks.findIndex((t) => t.id === overId);
    const newOrder = overIndex === -1 ? overTasks.length : overIndex;

    dispatch({
      type: "MOVE_TASK",
      payload: { taskId: activeId, status: overCol, order: newOrder },
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeCol = findTaskColumn(activeId);
    const overCol = COLUMNS.find((c) => c.id === overId)
      ? (overId as KanbanStatus)
      : findTaskColumn(overId);

    if (!activeCol || !overCol) return;

    if (COLUMNS.find((c) => c.id === overId)) {
      dispatch({
        type: "MOVE_TASK",
        payload: {
          taskId: activeId,
          status: overCol,
          order: getColumnTasks(overCol).filter((t) => t.id !== activeId).length,
        },
      });
      return;
    }

    const columnTasks = getColumnTasks(overCol);
    const oldIndex = columnTasks.findIndex((t) => t.id === activeId);
    const newIndex = columnTasks.findIndex((t) => t.id === overId);

    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      const ids = columnTasks.map((t) => t.id);
      ids.splice(oldIndex, 1);
      ids.splice(newIndex, 0, activeId);
      dispatch({
        type: "REORDER_TASKS",
        payload: { status: overCol, orderedIds: ids },
      });
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 h-[calc(100vh-180px)]">
        {COLUMNS.map((col, index) => (
          <div
            key={col.id}
            style={{
              animation: 'fadeSlideIn 0.4s ease-out forwards',
              animationDelay: `${index * 0.1}s`,
              opacity: 0,
            }}
            className="flex-1"
          >
            <Column
              id={col.id}
              label={col.label}
              tasks={getColumnTasks(col.id)}
            />
          </div>
        ))}
      </div>
    </DndContext>
  );
}
