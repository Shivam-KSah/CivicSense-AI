import { useState, useEffect } from 'react';

// Mock data store with localStorage persistence
const STORAGE_KEY = 'civicsense_issues';

const SAMPLE_ISSUES = [
  {
    id: 'issue-001',
    title: 'Large pothole blocking traffic on main road',
    description: 'A deep pothole approximately 2 feet wide has formed on the main road near the bus stop, causing vehicles to swerve dangerously.',
    category: 'Pothole',
    severity: 4,
    urgency: 'High',
    status: 'In Progress',
    location: { lat: 28.5355, lng: 77.3910, address: 'Sector 15, Noida, UP' },
    imageUrl: null,
    reportedBy: 'Shivam Kumar',
    reportedById: 'demo-user-001',
    votes: 23,
    comments: 5,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    department: 'Public Works',
    aiConfidence: 92,
    verified: true,
    verifyCount: 18,
  },
  {
    id: 'issue-002',
    title: 'Broken streetlight creating safety hazard at night',
    description: 'The streetlight near park entrance has been non-functional for 3 days. Area is very dark at night, raising safety concerns.',
    category: 'Streetlight',
    severity: 3,
    urgency: 'Medium',
    status: 'Open',
    location: { lat: 28.5362, lng: 77.3925, address: 'Park Road, Sector 15, Noida' },
    imageUrl: null,
    reportedBy: 'Priya Sharma',
    reportedById: 'user-002',
    votes: 15,
    comments: 3,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    department: 'Electricity Board',
    aiConfidence: 88,
    verified: false,
    verifyCount: 7,
  },
  {
    id: 'issue-003',
    title: 'Water pipeline burst flooding residential street',
    description: 'Water is gushing from a broken pipeline at the intersection. Multiple homes are being affected and road has become waterlogged.',
    category: 'Water Leakage',
    severity: 5,
    urgency: 'Critical',
    status: 'Open',
    location: { lat: 28.5348, lng: 77.3898, address: 'Block B, Sector 15, Noida' },
    imageUrl: null,
    reportedBy: 'Rahul Gupta',
    reportedById: 'user-003',
    votes: 41,
    comments: 12,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    department: 'Water Authority',
    aiConfidence: 95,
    verified: true,
    verifyCount: 35,
  },
  {
    id: 'issue-004',
    title: 'Overflowing garbage bin near market area',
    description: 'The municipal garbage bin has not been emptied in 5 days. Waste is spilling onto the footpath attracting pests.',
    category: 'Garbage',
    severity: 2,
    urgency: 'Medium',
    status: 'Resolved',
    location: { lat: 28.5370, lng: 77.3935, address: 'Market Area, Sector 15, Noida' },
    imageUrl: null,
    reportedBy: 'Anita Singh',
    reportedById: 'user-004',
    votes: 8,
    comments: 2,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    department: 'Sanitation',
    aiConfidence: 90,
    verified: false,
    verifyCount: 5,
  },
  {
    id: 'issue-005',
    title: 'Damaged road divider causing traffic accidents',
    description: 'The road divider on the highway entry point is broken and leaning into the road. Two minor accidents have already occurred.',
    category: 'Road Damage',
    severity: 4,
    urgency: 'High',
    status: 'Verified',
    location: { lat: 28.5340, lng: 77.3885, address: 'Highway Entry, Sector 14-15 Junction, Noida' },
    imageUrl: null,
    reportedBy: 'Vikram Mehta',
    reportedById: 'user-005',
    votes: 29,
    comments: 7,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    department: 'Traffic',
    aiConfidence: 87,
    verified: true,
    verifyCount: 22,
  },
];

function loadIssues() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : SAMPLE_ISSUES;
  } catch {
    return SAMPLE_ISSUES;
  }
}

function saveIssues(issues) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
}

export function useIssues() {
  const [issues, setIssues] = useState(loadIssues);
  const [loading, setLoading] = useState(false);

  const addIssue = (issue) => {
    const newIssue = {
      id: `issue-${Date.now()}`,
      ...issue,
      status: 'Open',
      votes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      verified: false,
      verifyCount: 0,
    };
    setIssues(prev => {
      const updated = [newIssue, ...prev];
      saveIssues(updated);
      return updated;
    });
    return newIssue;
  };

  const voteIssue = (issueId, userId) => {
    setIssues(prev => {
      const updated = prev.map(i => i.id === issueId ? { ...i, votes: i.votes + 1 } : i);
      saveIssues(updated);
      return updated;
    });
  };

  const verifyIssue = (issueId) => {
    setIssues(prev => {
      const updated = prev.map(i => i.id === issueId 
        ? { ...i, verifyCount: i.verifyCount + 1, verified: i.verifyCount + 1 >= 5 }
        : i);
      saveIssues(updated);
      return updated;
    });
  };

  const updateStatus = (issueId, status) => {
    setIssues(prev => {
      const updated = prev.map(i => i.id === issueId 
        ? { ...i, status, updatedAt: new Date().toISOString() }
        : i);
      saveIssues(updated);
      return updated;
    });
  };

  const getStats = () => {
    const total = issues.length;
    const open = issues.filter(i => i.status === 'Open').length;
    const inProgress = issues.filter(i => i.status === 'In Progress').length;
    const resolved = issues.filter(i => i.status === 'Resolved').length;
    const verified = issues.filter(i => i.verified).length;
    const critical = issues.filter(i => i.urgency === 'Critical').length;

    const byCategory = issues.reduce((acc, i) => {
      acc[i.category] = (acc[i.category] || 0) + 1;
      return acc;
    }, {});

    return { total, open, inProgress, resolved, verified, critical, byCategory };
  };

  return { issues, loading, addIssue, voteIssue, verifyIssue, updateStatus, getStats };
}
