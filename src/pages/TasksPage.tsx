import React, { useMemo, useState } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useData } from '../contexts/DataContext'
import { Task, TaskStatus } from '../types'

const statusColumns: { key: TaskStatus; label: string }[] = [
  { key: 'todo', label: 'To Do' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
]

const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const [, drag] = useDrag(() => ({ type: 'task', item: { id: task.id } }))
  return (
    <div ref={drag} className="card-surface rounded-lg p-3 shadow-sm">
      <p className="font-semibold text-sm">{task.title}</p>
      <p className="text-xs text-[var(--muted)]">Owner: {task.owner}</p>
    </div>
  )
}

const Column: React.FC<{ status: TaskStatus; tasks: Task[] }> = ({ status, tasks }) => {
  const { moveTask } = useData()
  const [, drop] = useDrop({
    accept: 'task',
    drop: (item: { id: string }) => moveTask(item.id, status),
  })
  return (
    <div ref={drop} className="flex flex-col gap-3 bg-[var(--border)]/40 rounded-xl p-3 min-h-[200px]">
      <p className="text-sm font-semibold">{statusColumns.find((c) => c.key === status)?.label}</p>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  )
}

export const TasksPage: React.FC = () => {
  const { data, addTask } = useData()
  const [title, setTitle] = useState('')

  const grouped = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = { 'todo': [], 'in-progress': [], done: [] }
    data?.tasks.forEach((task) => map[task.status].push(task))
    return map
  }, [data?.tasks])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    addTask(title)
    setTitle('')
  }

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-lg px-3 py-2 flex-1"
          placeholder="Add task"
        />
        <button type="submit" className="bg-[var(--accent)] text-white px-4 rounded-lg hover:bg-[var(--accent-strong)]">
          Add
        </button>
      </form>
      <DndProvider backend={HTML5Backend}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statusColumns.map((col) => (
            <Column key={col.key} status={col.key} tasks={grouped[col.key] || []} />
          ))}
        </div>
      </DndProvider>
    </div>
  )
}
