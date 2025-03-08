import React, { useState } from 'react';
import AddProblem from './components/AddProblem';
import ProblemList from './components/ProblemList';
import ProblemAI from './components/ProblemAI';
import Login from './components/Login';
import AddLesson from './components/AddLesson';
import LessonList from './components/LessonList';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogin = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="dashboard">
      <h1>Problem Admin Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
      <AddProblem />
      <ProblemAI />
      <ProblemList />
      <AddLesson />
      <LessonList />
    </div>
  );
}

export default App;