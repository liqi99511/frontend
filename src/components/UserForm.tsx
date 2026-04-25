import React, { useState } from 'react';
import { User } from '../types';
import { userApi } from '../services/api';

interface UserFormProps {
  user: User | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<Partial<User>>({
    name: user?.name || '',
    age: user?.age,
    gender: user?.gender || '',
    phone: user?.phone || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('请输入姓名');
      return;
    }
    setLoading(true);
    try {
      if (user?.id) {
        await userApi.updateUser(user.id, formData);
      } else {
        await userApi.addUser(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: '20px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
      <h3 style={{ marginBottom: '16px' }}>{user ? '编辑用户' : '添加用户'}</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '4px' }}>姓名 *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{ width: '100%', padding: '8px', border: '1px solid #d9d9d9', borderRadius: '4px' }}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '4px' }}>年龄</label>
          <input
            type="number"
            value={formData.age || ''}
            onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || undefined })}
            style={{ width: '100%', padding: '8px', border: '1px solid #d9d9d9', borderRadius: '4px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '4px' }}>性别</label>
          <select
            value={formData.gender || ''}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            style={{ width: '100%', padding: '8px', border: '1px solid #d9d9d9', borderRadius: '4px' }}
          >
            <option value="">请选择</option>
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '4px' }}>电话</label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            style={{ width: '100%', padding: '8px', border: '1px solid #d9d9d9', borderRadius: '4px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          <button type="submit" disabled={loading} style={{ padding: '8px 24px', background: '#1890ff', color: '#fff', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? '保存中...' : '保存'}
          </button>
          <button type="button" onClick={onCancel} style={{ padding: '8px 24px', background: '#d9d9d9', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            取消
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
