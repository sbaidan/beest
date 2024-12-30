import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
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
        <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
      </div>
    );
  }

  if (!profile && !showAuth) {
    return (
    
      <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section */}
      {/* <div className="flex flex-col items-center justify-center flex-1 px-6 py-12 text-center text-gray-600 bg-gradient-to-b from-white-400 to-gray-600">
        <h1 className="mb-4 text-6xl font-extrabold">Beest</h1>
        <p className="mb-8 text-lg font-medium">
          Your strongest partner to plan and achieve your sport & health objectives.
        </p>

        <div className="flex space-x-4">
          <button
            onClick={() => setShowAuth(true)}
            className="px-8 py-4 font-semibold text-indigo-600 transition duration-200 bg-white rounded-lg shadow-lg hover:bg-gray-100"
          >
            Get Started
          </button>
        </div>
      </div> */}

      <section className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center flex-1 px-6 py-12 text-center text-gray-700 bg-gradient-to-r from-slate-100 to-emerald-600">
        <h1 className="mb-4 text-5xl font-extrabold text-gray-900 sm:text-6xl">
          Beest
        </h1>
        <p className="max-w-2xl mb-8 text-lg font-medium">
          Your strongest partner to plan and achieve your sport &amp; health objectives.
        </p>

        <div className="flex space-x-4">
          <button
            onClick={() => setShowAuth(true)}
            className="px-8 py-4 font-semibold text-white transition-colors duration-200 bg-gray-600 rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            aria-label="Get Started"
          >
            Get Started
          </button>
        </div>
      </div>
    </section>


   
    <section className="py-12 text-gray-800 bg-white">
      {/* Container for centering and setting max width */}
      <div className="container px-6 mx-auto">
        {/* Title & Subtitle */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Features
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Explore how <strong>Beest</strong> helps coaches and athletes stay on track.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* FEATURE 1: Create Workout Plans */}
          <div className="flex flex-col items-center p-6 space-y-4 transition-shadow duration-200 rounded-lg shadow-sm bg-gray-50 hover:shadow-md">
            {/* Icon placeholder. If you use an icon library, place an <Icon /> here */}
            <div className="flex items-center justify-center w-16 h-16 text-white bg-indigo-600 rounded-full">
              {/* <FaDumbbell size={32} /> */} 
              {/* Example: Uncomment above if you import FaDumbbell from react-icons */}
              <span className="text-xl font-bold">A</span> 
              {/* Remove once you use a real icon */}
            </div>
            <h3 className="text-xl font-semibold">Create Workout Plans</h3>
            <p className="text-center text-gray-600">
              Design personalized exercises and routines for your athletes. Customize their
              schedules, track improvements, and ensure each plan is catered to individual goals.
            </p>
          </div>

          {/* FEATURE 2: Nutrition Plans */}
          <div className="flex flex-col items-center p-6 space-y-4 transition-shadow duration-200 rounded-lg shadow-sm bg-gray-50 hover:shadow-md">
            <div className="flex items-center justify-center w-16 h-16 text-white bg-green-600 rounded-full">
              {/* <GiMeal size={32} /> */}
              <span className="text-xl font-bold">B</span> 
              {/* Remove once you use a real icon */}
            </div>
            <h3 className="text-xl font-semibold">Nutrition Plans</h3>
            <p className="text-center text-gray-600">
              Craft balanced meal plans to support performance and recovery. 
              Provide dietary guidelines and track compliance for optimum results.
            </p>
          </div>

          {/* FEATURE 3: Chat with Athletes */}
          <div className="flex flex-col items-center p-6 space-y-4 transition-shadow duration-200 rounded-lg shadow-sm bg-gray-50 hover:shadow-md">
            <div className="flex items-center justify-center w-16 h-16 text-white bg-blue-600 rounded-full">
              {/* <BsFillChatDotsFill size={32} /> */}
              <span className="text-xl font-bold">C</span>
              {/* Remove once you use a real icon */}
            </div>
            <h3 className="text-xl font-semibold">Chat with Them</h3>
            <p className="text-center text-gray-600">
              Stay connected in real time. Chat features make it easy to answer 
              questions, provide immediate feedback, or share motivational updates.
            </p>
          </div>

          {/* FEATURE 4: Track Progress */}
          <div className="flex flex-col items-center p-6 space-y-4 transition-shadow duration-200 rounded-lg shadow-sm bg-gray-50 hover:shadow-md">
            <div className="flex items-center justify-center w-16 h-16 text-white bg-red-600 rounded-full">
              {/* <MdTrackChanges size={32} /> */}
              <span className="text-xl font-bold">D</span>
              {/* Remove once you use a real icon */}
            </div>
            <h3 className="text-xl font-semibold">Track Their Progress</h3>
            <p className="text-center text-gray-600">
              Monitor every step of your athletes’ journey with analytics dashboards 
              and progress charts. Empower them with visible milestones and achievements.
            </p>
          </div>
        </div>
      </div>
    </section>
  

        {/* Feature Highlights Section */}
        <div className="py-16 bg-white">
          <h2 className="mb-12 text-3xl font-bold text-center">Why Choose Beest?</h2>
          <div className="grid grid-cols-1 gap-12 px-6 mx-auto max-w-7xl md:grid-cols-3">
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
                className="flex flex-col items-center p-8 text-center bg-gray-100 rounded-lg shadow-lg"
              >
                <div className="mb-4 text-5xl">{feature.icon}</div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="py-16 bg-indigo-50">
          <h2 className="mb-12 text-3xl font-bold text-center">Our Pricing</h2>
          <div className="grid max-w-4xl grid-cols-1 gap-12 px-6 mx-auto md:grid-cols-2">
            {[
              {
                title: "Athletes",
                price: "$0/month",
                description: "Access your personalized training and nutrition plans for free.",
                features: [
                  "View training plans",
                  "Track your progress",
                  "Stay connected with your coach",
                ],
              },
              {
                title: "Coaches",
                price: "$5/month",
                description: "Create and manage training plans for your athletes.",
                features: [
                  "Create custom training plans",
                  "Assign nutrition plans",
                  "Real-time chat with athletes",
                ],
              },
            ].map((plan, index) => (
              <div
                key={index}
                className="p-8 text-center bg-white border border-gray-200 rounded-lg shadow-lg"
              >
                <h3 className="mb-4 text-xl font-bold text-gray-900">{plan.title}</h3>
                <p className="mb-4 text-2xl font-bold text-indigo-600">{plan.price}</p>
                <p className="mb-6 text-gray-600">{plan.description}</p>
                <ul className="mb-6 space-y-2 text-gray-600">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center justify-center space-x-2">
                      <span className="text-green-500">✔</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="px-6 py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                  Get Started
                </button>
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
