import React, { useState, useEffect } from 'react';
import type { Task, TaskCreate, List } from '../types';
import { taskAPI, listAPI } from '../api';

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const [newTask, setNewTask] = useState<TaskCreate>({
    title: '',
    description: '',
    completed: false,
    priority: 0,
    list_id: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchLists();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getAll();
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLists = async () => {
    try {
      const response = await listAPI.getAll();
      setLists(response.data);
    } catch (error) {
      console.error('Error fetching lists:', error);
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.list_id === 0) return;
    
    try {
      await taskAPI.create(newTask);
      setNewTask({
        title: '',
        description: '',
        completed: false,
        priority: 0,
        list_id: 0
      });
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const toggleTaskComplete = async (task: Task) => {
    try {
      await taskAPI.update(task.id, { completed: !task.completed });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await taskAPI.delete(id);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const getListName = (listId: number) => {
    const list = lists.find(l => l.id === listId);
    return list ? list.name : 'Unknown';
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 3) return '#dc3545'; // High - red
    if (priority >= 1) return '#ffc107'; // Medium - yellow
    return '#28a745'; // Low - green
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Task Management</h2>
      
      <form onSubmit={createTask} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3>Create New Task</h3>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
            style={{ padding: '8px', marginRight: '10px', width: '200px' }}
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            style={{ padding: '8px', marginRight: '10px', width: '200px' }}
          />
          <select
            value={newTask.priority}
            onChange={(e) => setNewTask({ ...newTask, priority: parseInt(e.target.value) })}
            style={{ padding: '8px', marginRight: '10px', width: '100px' }}
          >
            <option value={0}>Low</option>
            <option value={1}>Medium</option>
            <option value={2}>High</option>
            <option value={3}>Critical</option>
          </select>
          <select
            value={newTask.list_id}
            onChange={(e) => setNewTask({ ...newTask, list_id: parseInt(e.target.value) })}
            required
            style={{ padding: '8px', marginRight: '10px', width: '150px' }}
          >
            <option value={0}>Select List</option>
            {lists.map(list => (
              <option key={list.id} value={list.id}>{list.name}</option>
            ))}
          </select>
          <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px' }}>
            Create Task
          </button>
        </div>
      </form>

      <div>
        <h3>Existing Tasks</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Title</th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Description</th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Priority</th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>List</th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Created</th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} style={{ opacity: task.completed ? 0.6 : 1 }}>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskComplete(task)}
                      style={{ transform: 'scale(1.2)' }}
                    />
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    border: '1px solid #ddd',
                    textDecoration: task.completed ? 'line-through' : 'none'
                  }}>
                    {task.title}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {task.description || 'N/A'}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    <span style={{ 
                      padding: '4px 8px',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '12px',
                      backgroundColor: getPriorityColor(task.priority)
                    }}>
                      {['Low', 'Medium', 'High', 'Critical'][task.priority] || 'Low'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {getListName(task.list_id)}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {new Date(task.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    <button
                      onClick={() => deleteTask(task.id)}
                      style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TaskManager;