import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import ListSection from './components/ListSection';
import AddTask from './components/AddTask';
import Header from './components/Header';

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <Router>
          <div className="min-h-screen font-sans antialiased">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <div className="sm:px-16 px-8 flex flex-col min-h-screen">
                      <Header />
                      <main className="flex-1 overflow-y-auto">
                        <div className="pb-16">
                          <ListSection />
                        </div>
                      </main>
                      <div className="fixed bottom-0 left-0 w-full bg-white-100">
                        <div className="mx-auto sm:px-16 px-8 py-4">
                          <AddTask />
                        </div>
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
