import React, { useState, useEffect } from 'react';
import { userApi, bowelRecordApi } from '../services/api';
import { User, BowelRecord } from '../types';
import BowelForm from '../components/BowelForm';

const BRISTOL_TYPES = [
  { value: 1, label: '1型 - 硬便（分离硬块）' },
  { value: 2, label: '2型 - 块状便（香肠状硬块）' },
  { value: 3, label: '3型 - 干裂条状' },
  { value: 4, label: '4型 - 柔软光滑条状' },
  { value: 5, label: '5型 - 软团块状' },
  { value: 6, label: '6型 - 糊状便' },
  { value: 7, label: '7型 - 水样便' },
];

const BowelRecordPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [records, setRecords] = useState<BowelRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      fetchRecords();
    }
  }, [selectedUserId]);

  const fetchUsers = async () => {
    try {
      const res = await userApi.getUsers({ page: 1, pageSize: 100 });
      const data = res.data.data;
      if (data && data.list) {
        setUsers(data.list);
      }
    } catch (error) {
      console.error('获取用户列表失败:', error);
    }
  };

  const fetchRecords = async () => {
    if (!selectedUserId) return;
    setLoading(true);
    try {
      const res = await bowelRecordApi.getHistory({ userId: selectedUserId, page: 1, pageSize: 50 });
      const data = res.data.data;
      if (data && data.list) {
        setRecords(data.list);
      } else if (Array.isArray(data)) {
        setRecords(data);
      } else {
        setRecords([]);
      }
    } catch (error) {
      console.error('获取记录失败:', error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('确定要删除该记录吗？')) {
      try {
        await bowelRecordApi.deleteRecord(id);
        fetchRecords();
      } catch (error) {
        console.error('删除失败:', error);
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchRecords();
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label>选择用户：</label>
        <select
          value={selectedUserId || ''}
          onChange={(e) => setSelectedUserId(parseInt(e.target.value) || null)}
          style={{ padding: '8px 12px', border: '1px solid #d9d9d9', borderRadius: '4px', minWidth: '200px' }}
        >
          <option value="">请选择用户</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
        {selectedUserId && (
          <button onClick={() => setShowForm(true)} style={{ padding: '8px 16px', background: '#52c41a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            添加记录
          </button>
        )}
      </div>

      {showForm && selectedUserId && (
        <BowelForm userId={selectedUserId} onSuccess={handleFormSuccess} onCancel={() => setShowForm(false)} />
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>记录时间</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>大便类型</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>颜色</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>量</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>症状</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={7} style={{ padding: '20px', textAlign: 'center' }}>加载中...</td></tr>
          ) : !selectedUserId ? (
            <tr><td colSpan={7} style={{ padding: '20px', textAlign: 'center' }}>请先选择用户</td></tr>
          ) : records.length === 0 ? (
            <tr><td colSpan={7} style={{ padding: '20px', textAlign: 'center' }}>暂无记录</td></tr>
          ) : (
            records.map((record) => (
              <tr key={record.id} style={{ borderBottom: '1px solid #e8e8e8' }}>
                <td style={{ padding: '12px' }}>{record.id}</td>
                <td style={{ padding: '12px' }}>{record.recordTime || record.createdAt}</td>
                <td style={{ padding: '12px' }}>{BRISTOL_TYPES.find(t => t.value === record.stoolType)?.label || record.stoolType}</td>
                <td style={{ padding: '12px' }}>{record.color || '-'}</td>
                <td style={{ padding: '12px' }}>{record.amount || '-'}</td>
                <td style={{ padding: '12px' }}>{record.symptom || '-'}</td>
                <td style={{ padding: '12px' }}>
                  <button onClick={() => handleDelete(record.id!)} style={{ padding: '4px 12px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    删除
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BowelRecordPage;
