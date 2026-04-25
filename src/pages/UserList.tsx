import React, { useState, useEffect } from 'react';
import { userApi } from '../services/api';
import { User } from '../types';
import UserForm from '../components/UserForm';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      if (searchKeyword) {
        const res = await userApi.searchUsers(searchKeyword);
        setUsers(res.data.data || []);
        setTotal(Array.isArray(res.data.data) ? res.data.data.length : 0);
      } else {
        const res = await userApi.getUsers({ page, pageSize });
        const data = res.data.data;
        if (data && data.list) {
          setUsers(data.list);
          setTotal(data.total);
        } else {
          setUsers([]);
          setTotal(0);
        }
      }
    } catch (error) {
      console.error('获取用户列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, searchKeyword]);

  const handleAdd = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('确定要删除该用户吗？')) {
      try {
        await userApi.deleteUser(id);
        fetchUsers();
      } catch (error) {
        console.error('删除用户失败:', error);
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchUsers();
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="搜索用户名..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #d9d9d9', borderRadius: '4px', width: '200px' }}
          />
          <button type="submit" style={{ padding: '8px 16px', background: '#1890ff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            搜索
          </button>
        </form>
        <button onClick={handleAdd} style={{ padding: '8px 16px', background: '#52c41a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          添加用户
        </button>
        <button onClick={() => { setSearchKeyword(''); setPage(1); }} style={{ padding: '8px 16px', background: '#faad14', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          重置
        </button>
      </div>

      {showForm && (
        <UserForm user={editingUser} onSuccess={handleFormSuccess} onCancel={() => setShowForm(false)} />
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>姓名</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>年龄</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>性别</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>电话</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={6} style={{ padding: '20px', textAlign: 'center' }}>加载中...</td></tr>
          ) : users.length === 0 ? (
            <tr><td colSpan={6} style={{ padding: '20px', textAlign: 'center' }}>暂无数据</td></tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid #e8e8e8' }}>
                <td style={{ padding: '12px' }}>{user.id}</td>
                <td style={{ padding: '12px' }}>{user.name}</td>
                <td style={{ padding: '12px' }}>{user.age || '-'}</td>
                <td style={{ padding: '12px' }}>{user.gender || '-'}</td>
                <td style={{ padding: '12px' }}>{user.phone || '-'}</td>
                <td style={{ padding: '12px' }}>
                  <button onClick={() => handleEdit(user)} style={{ marginRight: '8px', padding: '4px 12px', background: '#1890ff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>编辑</button>
                  <button onClick={() => handleDelete(user.id!)} style={{ padding: '4px 12px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>删除</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {!searchKeyword && total > pageSize && (
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px 16px', background: page === 1 ? '#d9d9d9' : '#1890ff', color: '#fff', border: 'none', borderRadius: '4px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>
            上一页
          </button>
          <span style={{ padding: '8px 16px' }}>第 {page} / {Math.ceil(total / pageSize)} 页</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page * pageSize >= total} style={{ padding: '8px 16px', background: page * pageSize >= total ? '#d9d9d9' : '#1890ff', color: '#fff', border: 'none', borderRadius: '4px', cursor: page * pageSize >= total ? 'not-allowed' : 'pointer' }}>
            下一页
          </button>
        </div>
      )}
    </div>
  );
};

export default UserList;
