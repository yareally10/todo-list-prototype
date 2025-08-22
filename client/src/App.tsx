import { useState } from 'react';
import UserManager from './components/UserManager';
import ListManager from './components/ListManager';
import TaskManager from './components/TaskManager';
import './App.css';

type Tab = 'users' | 'lists' | 'tasks';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('users');

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManager />;
      case 'lists':
        return <ListManager />;
      case 'tasks':
        return <TaskManager />;
      default:
        return <UserManager />;
    }
  };

  return (
    <div className="App">
      <header style={{ backgroundColor: '#f8f9fa', padding: '20px', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, textAlign: 'center', color: '#333' }}>Todo List Management</h1>
        <nav style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '10px 20px',
              margin: '0 10px',
              backgroundColor: activeTab === 'users' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('lists')}
            style={{
              padding: '10px 20px',
              margin: '0 10px',
              backgroundColor: activeTab === 'lists' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Lists
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            style={{
              padding: '10px 20px',
              margin: '0 10px',
              backgroundColor: activeTab === 'tasks' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Tasks
          </button>
        </nav>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
