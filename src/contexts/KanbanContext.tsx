import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
  } from "react";
  
  export type TaskStatus = "todo" | "doing" | "done";
  
  export interface KanbanTask {
    id: string;
    text: string;
    status: TaskStatus;
  }
  
  interface KanbanContextType {
    tasks: KanbanTask[];
    addTask: (text: string) => void;
    moveTask: (id: string, to: TaskStatus) => void;
    deleteTask: (id: string) => void;
  }
  
  const KanbanContext = createContext<KanbanContextType | undefined>(undefined);
  
  export const KanbanProvider: React.FC<{ children: ReactNode }> = ({
    children,
  }) => {
    const [tasks, setTasks] = useState<KanbanTask[]>([]);
  
    // Load from localStorage
    useEffect(() => {
      const raw = window.localStorage.getItem("kanban-tasks");
      if (raw) setTasks(JSON.parse(raw));
    }, []);
  
    // Persist on change
    useEffect(() => {
      window.localStorage.setItem("kanban-tasks", JSON.stringify(tasks));
    }, [tasks]);
  
    const addTask = (text: string) => {
      setTasks((t) => [
        ...t,
        { id: `task-${Date.now()}`, text, status: "todo" },
      ]);
    };
  
    const moveTask = (id: string, to: TaskStatus) => {
      setTasks((t) =>
        t.map((task) =>
          task.id === id ? { ...task, status: to } : task
        )
      );
    };
  
    const deleteTask = (id: string) => {
      setTasks((t) => t.filter((task) => task.id !== id));
    };
  
    return (
      <KanbanContext.Provider
        value={{ tasks, addTask, moveTask, deleteTask }}
      >
        {children}
      </KanbanContext.Provider>
    );
  };
  
  export const useKanban = (): KanbanContextType => {
    const ctx = useContext(KanbanContext);
    if (!ctx) {
      throw new Error("useKanban must be used within a KanbanProvider");
    }
    return ctx;
  };
  