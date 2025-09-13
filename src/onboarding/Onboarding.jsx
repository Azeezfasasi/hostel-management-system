import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '@/config/api';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import StepFour from './StepFour';
import HeaderSection from '@/assets/components/home-components/HeaderSection';
import FooterSection from '@/assets/components/home-components/FooterSection';
import { Helmet } from 'react-helmet';
import DashboardHeader from '@/assets/components/dashboard-components/DashboardHeader';

const steps = [StepOne, StepTwo, StepThree, StepFour];


export default function Onboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  // Try to prefill from localStorage (from registration)
  const prefill = (() => {
    try {
      return JSON.parse(localStorage.getItem('onboardingPrefill')) || {};
    } catch {
      return {};
    }
  })();
  const [formData, setFormData] = useState(prefill);
  const [profileLoaded, setProfileLoaded] = useState(false);
  // Fetch user profile on mount and merge with local prefill
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await axios.get(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Merge backend profile with local prefill, preferring local prefill for in-progress fields
        setFormData(prev => ({ ...res.data, ...prev }));
      } catch {
        // ignore error, fallback to local prefill
      } finally {
        setProfileLoaded(true);
      }
    };
    fetchProfile();
  }, []);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const StepComponent = steps[currentStep];

  const handleNext = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(s => s + 1);
  };

  const handleBack = () => {
    setCurrentStep(s => s - 1);
  };

  const handleFinish = async (data) => {
    setFormData(prev => ({ ...prev, ...data }));
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      // Send all onboarding data to backend (update profile)
      await axios.put(`${API_BASE_URL}/users/me`, { ...formData, ...data, onboardingCompleted: true }, config);
      setLoading(false);
      if (onComplete) onComplete({ ...formData, ...data });
      navigate("/account/dashboard");
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError("Failed to complete onboarding. Please try again.");
    }
  };

  if (!profileLoaded) {
    return (
      <div className="pt-8 w-full max-w-lg mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 animate-pulse">Loading...</h1>
        <p className="text-lg text-gray-600">Loading your onboarding data...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Welcome - Hostel Management</title>
      </Helmet>
      <DashboardHeader />
      <div className="md:max-w-xl mx-auto p-6 mt-[70px] mb-[40px] md:mt-[100px] md:mb-[40px] bg-gray-100 rounded shadow">
        <div className="mb-4 text-center font-bold text-lg">Onboarding ({currentStep + 1} / 4)</div>
        {error && <div className="text-red-600 text-center mb-4">{error}</div>}
        <StepComponent
          data={formData}
          onNext={currentStep < 3 ? handleNext : handleFinish}
          onBack={currentStep > 0 ? handleBack : null}
          isLast={currentStep === 3}
          loading={loading}
        />
      </div>
      <FooterSection />
    </>
  );
}
