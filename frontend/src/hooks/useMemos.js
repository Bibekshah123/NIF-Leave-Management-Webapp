import { useState, useCallback } from 'react';
import { memoService } from '../services/memoService';

export const useMemos = () => {
  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMemos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await memoService.getAll();
      setMemos(response.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch memos');
    } finally {
      setLoading(false);
    }
  }, []);

  const createMemo = async (data) => {
    setLoading(true);
    try {
      const response = await memoService.create(data);
      await fetchMemos();
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to create memo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMemoStatus = async (id, action, note, user) => {
    setLoading(true);
    try {
      const response = await memoService.updateStatus(id, action, note, user);
      await fetchMemos();
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to update memo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { memos, loading, error, fetchMemos, createMemo, updateMemoStatus };
};
