import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  increment,
} from "firebase/firestore";
import { db } from "./config";

// ============================================
// TYPE DEFINITIONS
// ============================================

// Priority levels for todos
export type TodoPriority = "low" | "medium" | "high";

// Status of a todo
export type TodoStatus = "pending" | "in_progress" | "completed";

// TodoList schema - represents a collection of todos
export interface TodoList {
  id: string;
  userId: string;
  name: string;
  description?: string;
  todoCount: number;
  completedCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Todo item schema - individual tasks within a list
export interface Todo {
  id: string;
  listId: string;
  userId: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate?: Timestamp;
  completedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Type for creating a new todo list
export interface CreateTodoListData {
  userId: string;
  name: string;
  description?: string;
}

// Type for updating a todo list
export interface UpdateTodoListData {
  name?: string;
  description?: string;
}

// Type for creating a new todo
export interface CreateTodoData {
  listId: string;
  userId: string;
  title: string;
  description?: string;
  priority?: TodoPriority;
  dueDate?: Date;
}

// Type for updating a todo
export interface UpdateTodoData {
  title?: string;
  description?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  dueDate?: Date | null;
}

// ============================================
// TODO LIST FUNCTIONS
// ============================================

// Generate a unique ID for documents
function generateId(): string {
  return doc(collection(db, "_")).id;
}

// Create a new todo list
export async function createTodoList(data: CreateTodoListData): Promise<string> {
  const id = generateId();
  await setDoc(doc(db, "todoLists", id), {
    id,
    userId: data.userId,
    name: data.name,
    description: data.description || null,
    todoCount: 0,
    completedCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return id;
}

// Get a todo list by ID
export async function getTodoList(id: string): Promise<TodoList | null> {
  const docRef = doc(db, "todoLists", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as TodoList;
  }

  return null;
}

// Get all todo lists for a user
export async function getUserTodoLists(userId: string): Promise<TodoList[]> {
  const q = query(
    collection(db, "todoLists"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as TodoList);
}

// Update a todo list
export async function updateTodoList(id: string, data: UpdateTodoListData): Promise<void> {
  const docRef = doc(db, "todoLists", id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Delete a todo list and all its todos
export async function deleteTodoList(id: string): Promise<void> {
  // First, delete all todos in the list
  const todosQuery = query(collection(db, "todos"), where("listId", "==", id));
  const todosSnapshot = await getDocs(todosQuery);

  const deletePromises = todosSnapshot.docs.map((todoDoc) =>
    deleteDoc(doc(db, "todos", todoDoc.id))
  );
  await Promise.all(deletePromises);

  // Then delete the list itself
  await deleteDoc(doc(db, "todoLists", id));
}

// ============================================
// TODO ITEM FUNCTIONS
// ============================================

// Create a new todo
export async function createTodo(data: CreateTodoData): Promise<string> {
  const id = generateId();
  await setDoc(doc(db, "todos", id), {
    id,
    listId: data.listId,
    userId: data.userId,
    title: data.title,
    description: data.description || null,
    status: "pending" as TodoStatus,
    priority: data.priority || "medium",
    dueDate: data.dueDate ? Timestamp.fromDate(data.dueDate) : null,
    completedAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Increment the todo count on the list
  await updateDoc(doc(db, "todoLists", data.listId), {
    todoCount: increment(1),
    updatedAt: serverTimestamp(),
  });

  return id;
}

// Get a todo by ID
export async function getTodo(id: string): Promise<Todo | null> {
  const docRef = doc(db, "todos", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as Todo;
  }

  return null;
}

// Get all todos for a specific list
export async function getListTodos(listId: string): Promise<Todo[]> {
  const q = query(
    collection(db, "todos"),
    where("listId", "==", listId),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as Todo);
}

// Get all todos for a user (across all lists)
export async function getUserTodos(userId: string): Promise<Todo[]> {
  const q = query(
    collection(db, "todos"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as Todo);
}

// Update a todo
export async function updateTodo(id: string, data: UpdateTodoData): Promise<void> {
  const todo = await getTodo(id);
  if (!todo) return;

  const updateData: Record<string, unknown> = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  // Handle dueDate conversion
  if (data.dueDate !== undefined) {
    updateData.dueDate = data.dueDate ? Timestamp.fromDate(data.dueDate) : null;
  }

  // Handle completion status changes
  if (data.status === "completed" && todo.status !== "completed") {
    updateData.completedAt = serverTimestamp();
    // Increment completed count
    await updateDoc(doc(db, "todoLists", todo.listId), {
      completedCount: increment(1),
      updatedAt: serverTimestamp(),
    });
  } else if (data.status && data.status !== "completed" && todo.status === "completed") {
    updateData.completedAt = null;
    // Decrement completed count
    await updateDoc(doc(db, "todoLists", todo.listId), {
      completedCount: increment(-1),
      updatedAt: serverTimestamp(),
    });
  }

  await updateDoc(doc(db, "todos", id), updateData);
}

// Delete a todo
export async function deleteTodo(id: string): Promise<void> {
  const todo = await getTodo(id);
  if (!todo) return;

  // Update the list counts
  const decrements: Record<string, unknown> = {
    todoCount: increment(-1),
    updatedAt: serverTimestamp(),
  };

  if (todo.status === "completed") {
    decrements.completedCount = increment(-1);
  }

  await updateDoc(doc(db, "todoLists", todo.listId), decrements);

  // Delete the todo
  await deleteDoc(doc(db, "todos", id));
}

// Toggle todo completion status
export async function toggleTodoComplete(id: string): Promise<void> {
  const todo = await getTodo(id);
  if (!todo) return;

  const newStatus: TodoStatus = todo.status === "completed" ? "pending" : "completed";
  await updateTodo(id, { status: newStatus });
}

