import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PASSWORD = '행복한도요새';

const PasswordGate = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password === PASSWORD) {
      localStorage.setItem('pgm_authenticated', 'true');
      navigate('/app');
    } else {
      setError('암호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-pgm-base flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold text-gray-900 text-center mb-6">평가몬</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">암호</label>
            <input
              type="text"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="암호를 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-pgm-primary focus:border-transparent"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-pgm-primary text-white font-medium rounded-md hover:bg-pgm-primary/90 transition-colors cursor-pointer"
          >
            입장
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordGate;
