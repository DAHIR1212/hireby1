import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Job {
  id: number;
  service: string;
  customer: string;
  distance: string;
  time: string;
  icon: any;
  color: string;
  amount: number;
  location: string;
  locationDetail: string;
  description: string;
  status: 'pending' | 'active' | 'ongoing' | 'completed';
  startTime?: string;
  completedTime?: string;
  duration?: string;
  rating?: number;
  feedback?: string;
}

interface ProviderJobsContextType {
  pendingRequests: Job[];
  activeJobs: Job[];
  completedJobs: Job[];
  totalEarnings: number;
  acceptJob: (job: Job) => void;
  declineJob: (jobId: number) => void;
  startJob: (jobId: number) => void;
  completeJob: (jobId: number, rating: number, feedback: string) => void;
  currentJob: Job | null;
}

const ProviderJobsContext = createContext<ProviderJobsContextType | undefined>(undefined);

export function ProviderJobsProvider({ children }: { children: ReactNode }) {
  const [pendingRequests, setPendingRequests] = useState<Job[]>([
    {
      id: 1,
      service: 'Pipe Leakage Repair',
      customer: 'Rahul Sharma',
      distance: '2.4 km',
      time: 'Today, 4:30 PM - 5:30 PM',
      icon: null,
      color: 'bg-purple-100 text-purple-600',
      amount: 850,
      location: 'Flat 301, Sunshine Apartments',
      locationDetail: 'Andheri West, Mumbai 400058',
      description: 'Kitchen sink is leaking. Water is dripping from the pipe underneath. Need urgent repair.',
      status: 'pending',
    },
    {
      id: 2,
      service: 'Fan Installation',
      customer: 'Priya V.',
      distance: '1.1 km',
      time: 'Tomorrow, 10:00 AM',
      icon: null,
      color: 'bg-blue-100 text-blue-600',
      amount: 650,
      location: 'Sai Residency, Flat 102',
      locationDetail: 'Borivali East, Mumbai 400066',
      description: 'Need ceiling fan installation in living room.',
      status: 'pending',
    },
  ]);
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);
  const [completedJobs, setCompletedJobs] = useState<Job[]>([
    {
      id: 101,
      service: 'AC Repair',
      customer: 'Sneha Patel',
      distance: '1.8 km',
      time: 'Oct 18, 2023',
      icon: null,
      color: 'bg-green-100 text-green-600',
      amount: 1200,
      location: 'Malad West',
      locationDetail: 'Building A, 5th Floor',
      description: 'AC not cooling properly',
      status: 'completed',
      completedTime: '3:45 PM',
      duration: '2 hours',
      rating: 5,
      feedback: 'Excellent service! Very professional.',
    },
    {
      id: 102,
      service: 'Electrical Wiring',
      customer: 'Vikram Singh',
      distance: '3.2 km',
      time: 'Oct 15, 2023',
      icon: null,
      color: 'bg-yellow-100 text-yellow-600',
      amount: 850,
      location: 'Goregaon East',
      locationDetail: 'Flat 203',
      description: 'New wiring for bedroom',
      status: 'completed',
      completedTime: '5:30 PM',
      duration: '1.5 hours',
      rating: 4,
      feedback: 'Good work, arrived on time.',
    },
  ]);
  const [totalEarnings, setTotalEarnings] = useState<number>(78700);
  const [currentJob, setCurrentJob] = useState<Job | null>(null);

  const acceptJob = (job: Job) => {
    setPendingRequests(prev => prev.filter(j => j.id !== job.id));
    const acceptedJob = { ...job, status: 'active' as const };
    setActiveJobs(prev => [...prev, acceptedJob]);
    setCurrentJob(acceptedJob);
  };

  const declineJob = (jobId: number) => {
    setPendingRequests(prev => prev.filter(j => j.id !== jobId));
  };

  const startJob = (jobId: number) => {
    setActiveJobs(prev =>
      prev.map(job =>
        job.id === jobId
          ? { ...job, status: 'ongoing' as const, startTime: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) }
          : job
      )
    );
    const job = activeJobs.find(j => j.id === jobId);
    if (job) {
      setCurrentJob({ ...job, status: 'ongoing', startTime: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) });
    }
  };

  const completeJob = (jobId: number, rating: number, feedback: string) => {
    const job = activeJobs.find(j => j.id === jobId);
    if (job) {
      const platformFee = Math.round(job.amount * 0.1);
      const actualEarnings = job.amount - platformFee;
      const completedJob = {
        ...job,
        status: 'completed' as const,
        completedTime: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        rating,
        feedback,
      };
      setActiveJobs(prev => prev.filter(j => j.id !== jobId));
      setCompletedJobs(prev => [completedJob, ...prev]);
      setTotalEarnings(prev => prev + actualEarnings);
      setCurrentJob(null);
    }
  };

  return (
    <ProviderJobsContext.Provider
      value={{
        pendingRequests,
        activeJobs,
        completedJobs,
        totalEarnings,
        acceptJob,
        declineJob,
        startJob,
        completeJob,
        currentJob,
      }}
    >
      {children}
    </ProviderJobsContext.Provider>
  );
}

export function useProviderJobs() {
  const context = useContext(ProviderJobsContext);
  if (context === undefined) {
    throw new Error('useProviderJobs must be used within a ProviderJobsProvider');
  }
  return context;
}
