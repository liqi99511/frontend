import React, { useState } from 'react';
import UserList from './pages/UserList';
import BowelRecord from './pages/BowelRecord';

function App() {
  const [activeTab, setActiveTab] = useState<'users' | 'records'>('users');

  return (
    <div className="app">
      <nav style={{
        background: '#1890ff',
        padding: '16px',
        display: 'flex',
        gap: '24px'
      }}>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            background: activeTab === 'users' ? '#fff' : 'transparent',
            color: activeTab === 'users' ? '#1890ff' : '#fff',
            border: 'none',
            padding: '8px 24px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          用户管理
        </button>
        <button
          onClick={() => setActiveTab('records')}
          style={{
            background: activeTab === 'records' ? '#fff' : 'transparent',
            color: activeTab === 'records' ? '#1890ff' : '#fff',
            border: 'none',
            padding: '8px 24px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          排便记录
        </button>
      </nav>
      <main style={{ padding: '24px' }}>
        {activeTab === 'users' ? <UserList /> : <BowelRecord />}
      </main>
    </div>
  );
}

export default App;
