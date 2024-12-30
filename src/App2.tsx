import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Layout from './components/Layout';
import Exercises from './pages/Exercises';
import Workouts from './pages/Workouts';
import TrainingPlans from './pages/TrainingPlans';
import AthleteTrainingPlan from './pages/AthleteTrainingPlan';
import NutritionPlans from './pages/NutritionPlans';
import MyNutritionPlan from './pages/MyNutritionPlan';
import Chat from './pages/Chat';
import AuthModal from './components/auth/AuthModal';
import { useAuthStore } from './store/auth';

function ProtectedRoute({ 
  element: Element, 
  allowedRoles 
}: { 
  element: React.ComponentType; 
  allowedRoles?: ('coach' | 'athlete')[];
}) {
  const { profile, loading, initialized } = useAuthStore();

  if (!initialized || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    if (profile.role === 'athlete') {
      return <Navigate to="/my-plan" />;
    }
    return <Navigate to="/" />;
  }

  return <Element />;
}

export default function App() {
  const [showAuth, setShowAuth] = React.useState(false);
  const { profile, loading, initialized, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  if (!initialized || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!profile && !showAuth) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center flex-1 px-6 py-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">Welcome to Beest</h1>
          <p className="mb-8 text-lg text-gray-600">
            Your ultimate platform for personalized training and nutrition plans.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowAuth(true)}
              className="px-6 py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Sign In
            </button>
            <button
              onClick={() => setShowAuth(true)}
              className="px-6 py-3 text-indigo-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Feature Highlights Section */}
        <div className="py-12 bg-white">
          <div className="grid grid-cols-1 gap-8 px-6 mx-auto max-w-7xl md:grid-cols-3">
            {[
              {
                title: "For Coaches",
                description: "Create training plans with workouts and different exercises with details and assign them to Athletes along with a nutrition plan.",
                icon: "\ud83c\udfcb\ufe0f\u200d\u2642\ufe0f",
              },
              {
                title: "For Athletes",
                description: "Get your training plan and nutrition plan from your coach with details. Don't miss a thing!",
                icon: "\ud83e\udd57",
              },
              {
                title: "Real-Time Chat",
                description: "Stay connected with coaches and teammates.",
                icon: "\ud83d\udcac",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center p-6 space-x-4 rounded-lg shadow-sm bg-gray-50"
              >
                <div className="text-3xl">{feature.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={
                profile?.role === 'athlete' ? (
                  <Navigate to="/my-plan" />
                ) : (
                  <Navigate to="/training-plans" />
                )
              }
            />
            <Route
              path="exercises"
              element={<ProtectedRoute element={Exercises} allowedRoles={["coach"]} />}
            />
            <Route
              path="workouts"
              element={<ProtectedRoute element={Workouts} allowedRoles={["coach"]} />}
            />
            <Route
              path="training-plans"
              element={<ProtectedRoute element={TrainingPlans} allowedRoles={["coach"]} />}
            />
            <Route
              path="nutrition-plans"
              element={<ProtectedRoute element={NutritionPlans} allowedRoles={["coach"]} />}
            />
            <Route
              path="my-plan"
              element={<ProtectedRoute element={AthleteTrainingPlan} allowedRoles={["athlete"]} />}
            />
            <Route
              path="my-nutrition"
              element={<ProtectedRoute element={MyNutritionPlan} allowedRoles={["athlete"]} />}
            />
            <Route path="chat" element={<ProtectedRoute element={Chat} />} />
          </Route>
        </Routes>
      </BrowserRouter>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
