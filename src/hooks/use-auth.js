import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp } from '../lib/auth';

export function useAuth() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await signIn(email, password);
      if (error) throw new Error(error);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await signUp(email, password);
      if (error) throw new Error(error);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    handleSignIn,
    handleSignUp,
  };
}