import React, { useState } from 'react';
import { bowelRecordApi } from '../services/api';

const BRISTOL_TYPES = [
  { value: 1, label: '1型 - 硬便' },
  { value: 2, label: '2型 - 块状便' },
  { value: 3, label: '3型 - 干裂条状' },
  { value: 4, label: '4型 - 柔软光滑条状' },
  { value: 5, label: '5型 - 软团块状' },
  { value: 6, label: '6型 - 糊状便' },
  { value: 7, label: '7型 - 水样便' },
];

interface BowelFormProps {
  userId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const BowelForm: React.FC<BowelFormProps> = ({ userId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    recordTime: new Date().toISOString().slice(0, 16),
    stoolType: 4,
    color: '',
    amount: '',
    symptom: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await bowelRecordApi.addRecord({
        userId,
        recordTime: formData.recordTime,
        stoolType: formData.stoolType,
        color: formData.color,
        amount: formData.amount,
        symptom: formData.symptom,
      });
      onSuccess();
    } catch (error) {
      console.error('添加失败:', error);
      alert('添加失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: '20px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
      <h3 style={{ marginBottom: '16px' }}>添加排便记录</h3>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', maxWidth: '800px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '4px' }}>记录时间 *</label>
          <input
            type="datetime-local"
            value={formData.recordTime}
            onChange={(e) => setFormData({ ...formData, recordTime: e.target.value })}
            style={{ width: '100%', padding: '8px', border: '1px solid #d9d9d9', borderRadius: '4px' }}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '4px' }}>大便类型 (Bristol) *</label>
          <select
            value={formData.stoolType}
            onChange={(e) => setFormData({ ...formData, stoolType: parseInt(e.target.value) })}
            style={{ width: '100%', padding: '8px', border: '1px solid #d9d9d9', borderRadius: '4px' }}
            required
          >
            {BRISTOL_TYPES.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '4px' }}>颜色</label>
          <input
            type="text"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            placeholder="如：黄色、棕色、绿色"
            style={{ width: '100%', padding: '8px', border: '1px solid #d9d9d9', borderRadius: '4px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '4px' }}>量</label>
          <input
            type="text"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="如：少量、中等、大量"
            style={{ width: '100%', padding: '8px', border: '1px solid #d9d9d9', borderRadius: '4px' }}
          />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>症状</label>
          <textarea
            value={formData.symptom}
            onChange={(e) => setFormData({ ...formData, symptom: e.target.value })}
            placeholder="如：腹痛、腹胀、便血等"
            rows={2}
            style={{ width: '100%', padding: '8px', border: '1px solid #d9d9d9', borderRadius: '4px', resize: 'vertical' }}
          />
        </div>
        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px' }}>
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

export default BowelForm;
