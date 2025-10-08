// src/components/ui/KanbanBoard.tsx
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useKanban, TaskStatus } from "@/contexts/KanbanContext";

const ORDER: TaskStatus[] = ["todo", "doing", "done"];
const LABEL: Record<TaskStatus, string> = {
  todo: "To Do",
  doing: "Doing",
  done: "Done",
};

export default function KanbanBoard() {
  const { tasks, addTask, moveTask, deleteTask } = useKanban();
  const [newText, setNewText] = useState("");

  const handleAdd = () => {
    const t = newText.trim();
    if (t) {
      addTask(t);
      setNewText("");
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return; // dropped outside any list
    const from = source.droppableId as TaskStatus;
    const to   = destination.droppableId as TaskStatus;
    if (from === to) return; // no column change
    moveTask(draggableId, to);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ORDER.map((status) => {
          const columnTasks = tasks.filter((t) => t.status === status);
          return (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <Card className="border border-gray-200 rounded-lg flex flex-col">
                  <CardHeader className="bg-gray-100 px-4 py-2 rounded-t-lg">
                    <CardTitle className="text-sm font-medium">
                      {LABEL[status]}
                    </CardTitle>
                  </CardHeader>

                  <CardContent
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-1 flex flex-col px-4 py-3 space-y-2 overflow-auto"
                  >
                    {/* only show “add” on the first column */}
                    {status === "todo" && (
                      <div className="flex space-x-2 mb-2">
                        <Input
                          placeholder="New task…"
                          value={newText}
                          onChange={(e) => setNewText(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), handleAdd())
                          }
                        />
                        <Button
                          type="button"
                          onClick={handleAdd}
                          className="bg-purple-600 hover:bg-purple-700 text-white p-2"
                        >
                          <Plus className="h-5 w-5" />
                        </Button>
                      </div>
                    )}

                    {columnTasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(draggableProvided, snapshot) => (
                          <div
                            ref={draggableProvided.innerRef}
                            {...draggableProvided.draggableProps}
                            {...draggableProvided.dragHandleProps}
                            className={`
                              bg-white border border-gray-200 rounded p-3 flex items-center justify-between
                              ${snapshot.isDragging ? "shadow-lg bg-purple-50" : ""}
                            `}
                          >
                            <span
                              className={
                                status === "done"
                                  ? "line-through text-gray-400"
                                  : "text-gray-800"
                              }
                            >
                              {task.text}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteTask(task.id)}
                              >
                                🗑️
                              </Button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}
                  </CardContent>
                </Card>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
}
