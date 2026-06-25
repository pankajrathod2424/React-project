import axios from 'axios'
import React, { useEffect, useState } from 'react'

const ToDos = () => {
  const [todos, setToDos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController() // Cancel request if component unmounts
    
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await axios.get(
          'https://jsonplaceholder.typicode.com/todos?_limit=10',
          { signal: controller.signal }
        )
        setToDos(res.data)
        setError(null)
      } catch (err) {
        if (err.name !== 'CanceledError') {
          setError('Failed to fetch todos')
          console.error(err)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    return () => controller.abort() // Cleanup
  }, [])

  if (loading) return <div className="text-center p-4">Loading todos...</div>
  if (error) return <div className="text-danger p-4">{error}</div>

  return (
    <div className="container mt-4">
      <h2 className="mb-3">ToDo List</h2>
      <ul className="list-group">
        {todos.map((todo) => (
          <li 
            key={todo.id} // Use todo.id, not index - prevents bugs on re-renders
            className={`list-group-item ${todo.completed ? 'text-success' : 'text-danger'}`}
          >
            {todo.completed ? '✅' : '❌'} {todo.title}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ToDos