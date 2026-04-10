import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
    ArrowLeft, CheckCircle, Clock, Star, Zap,
    Wrench, Paintbrush, Wind, Hammer, Home,
    Droplets, ShieldCheck
} from 'lucide-react';
import { db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';

const skillsData = [
    {
        category: 'Cleaning',
        icon: Home,
        color: 'bg-blue-100 text-blue-600',
        skills: [
            'Deep Home Cleaning',
            'Bathroom Cleaning',
            'Kitchen Cleaning',
            'Sofa/Carpet Cleaning',
            'Move-in/Move-out Cleaning',
            'Office Cleaning',
        ],
    },
    {
        category: 'Plumbing',
        icon: Droplets,
        color: 'bg-purple-100 text-purple-600',
        skills: [
            'Pipe Repair & Fitting',
            'Tap & Faucet Repair',
            'Drain Cleaning',
            'Water Heater Installation',
            'Bathroom Fitting',
            'Tank Cleaning',
        ],
    },
    {
        category: 'Electrical',
        icon: Zap,
        color: 'bg-yellow-100 text-yellow-600',
        skills: [
            'Wiring & Rewiring',
            'Switch & Socket Repair',
            'Fan Installation',
            'Light Fitting',
            'MCB & Fuse Repair',
            'Inverter Installation',
        ],
    },
    {
        category: 'Painting',
        icon: Paintbrush,
        color: 'bg-green-100 text-green-600',
        skills: [
            'Interior Painting',
            'Exterior Painting',
            'Waterproofing',
            'Texture Painting',
            'Wood Polishing',
            'Wall Putty',
        ],
    },
    {
        category: 'AC Repair',
        icon: Wind,
        color: 'bg-cyan-100 text-cyan-600',
        skills: [
            'AC Installation',
            'AC Service & Cleaning',
            'Gas Refilling',
            'AC Repair',
            'AC Uninstallation',
            'Stabilizer Installation',
        ],
    },
    {
        category: 'Carpentry',
        icon: Hammer,
        color: 'bg-orange-100 text-orange-600',
        skills: [
            'Furniture Assembly',
            'Door & Window Repair',
            'Cabinet Making',
            'False Ceiling',
            'Wooden Flooring',
            'Wardrobe Installation',
        ],
    },
];

const experienceLevels = [
    { id: 'beginner', label: 'Beginner', desc: '0-1 years', icon: '🌱' },
    { id: 'intermediate', label: 'Intermediate', desc: '1-3 years', icon: '⚡' },
    { id: 'expert', label: 'Expert', desc: '3+ years', icon: '🌟' },
];

const availabilityOptions = [
    { id: 'fulltime', label: 'Full Time', desc: 'Mon-Sun, 8am-8pm' },
    { id: 'parttime', label: 'Part Time', desc: 'Flexible hours' },
    { id: 'weekends', label: 'Weekends Only', desc: 'Sat-Sun only' },
];

export default function ProviderSkillSelection() {
    const navigate = useNavigate();
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [experience, setExperience] = useState('');
    const [availability, setAvailability] = useState('');
    const [hourlyRate, setHourlyRate] = useState('');
    const [loading, setLoading] = useState(false);

    // Get provider category from previous step
    const userCategory = localStorage.getItem('userCategory') || '';

    // Find matching category data
    const categoryData = skillsData.find(
        s => s.category.toLowerCase() === userCategory.toLowerCase()
    ) || skillsData[0];

    const toggleSkill = (skill: string) => {
        setSelectedSkills(prev =>
            prev.includes(skill)
                ? prev.filter(s => s !== skill)
                : [...prev, skill]
        );
    };

    const handleSubmit = async () => {
        if (selectedSkills.length === 0) {
            alert('Please select at least one skill');
            return;
        }
        if (!experience) {
            alert('Please select your experience level');
            return;
        }
        if (!availability) {
            alert('Please select your availability');
            return;
        }

        setLoading(true);

        try {
            // Save to localStorage
            localStorage.setItem('userSkills', JSON.stringify(selectedSkills));
            localStorage.setItem('userExperience', experience);
            localStorage.setItem('userAvailability', availability);
            localStorage.setItem('userHourlyRate', hourlyRate);

            // Save to Firestore
            const phone = localStorage.getItem('userPhone');
            if (phone) {
                await setDoc(doc(db, 'users', phone), {
                    skills: selectedSkills,
                    experience,
                    availability,
                    hourlyRate: hourlyRate || 'Negotiable',
                    updatedAt: new Date().toISOString(),
                }, { merge: true });
            }

            navigate('/provider-dashboard');
        } catch (err) {
            console.error(err);
            navigate('/provider-dashboard');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="size-full flex flex-col bg-gray-50">

            {/* Header */}
            <div className="bg-white px-4 py-4 flex items-center gap-3 border-b border-gray-100">
                <button onClick={() => navigate(-1)} className="p-1">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="font-bold text-lg">Select Your Skills</h1>
                    <p className="text-xs text-gray-500">Step 2 of 2</p>
                </div>
            </div>

            {/* Progress bar */}
            <div className="bg-white px-6 py-3">
                <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full w-full transition-all" />
                    </div>
                </div>
                <p className="text-xs text-gray-500">Almost done! Tell us your skills.</p>
            </div>

            <div className="flex-1 overflow-y-auto pb-32 px-6 py-4 space-y-6">

                {/* Skills Selection */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-xl ${categoryData.color} flex items-center justify-center`}>
                            <categoryData.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">{categoryData.category} Skills</h2>
                            <p className="text-xs text-gray-500">Select all that apply</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {categoryData.skills.map((skill) => (
                            <button
                                key={skill}
                                onClick={() => toggleSkill(skill)}
                                className={`p-3 rounded-xl text-left text-sm font-medium border-2 transition-all ${selectedSkills.includes(skill)
                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 bg-gray-50 text-gray-700'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    {selectedSkills.includes(skill) ? (
                                        <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                    ) : (
                                        <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                                    )}
                                    <span className="leading-tight">{skill}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {selectedSkills.length > 0 && (
                        <p className="text-xs text-blue-600 font-semibold mt-3">
                            ✅ {selectedSkills.length} skill{selectedSkills.length > 1 ? 's' : ''} selected
                        </p>
                    )}
                </div>

                {/* Experience Level */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <h2 className="font-bold text-lg">Experience Level</h2>
                    </div>

                    <div className="space-y-3">
                        {experienceLevels.map((level) => (
                            <button
                                key={level.id}
                                onClick={() => setExperience(level.id)}
                                className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${experience === level.id
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200 bg-gray-50'
                                    }`}
                            >
                                <span className="text-2xl">{level.icon}</span>
                                <div className="flex-1">
                                    <p className={`font-bold ${experience === level.id ? 'text-blue-700' : 'text-gray-800'}`}>
                                        {level.label}
                                    </p>
                                    <p className="text-xs text-gray-500">{level.desc}</p>
                                </div>
                                {experience === level.id && (
                                    <CheckCircle className="w-5 h-5 text-blue-600" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Availability */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <h2 className="font-bold text-lg">Availability</h2>
                    </div>

                    <div className="space-y-3">
                        {availabilityOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => setAvailability(option.id)}
                                className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${availability === option.id
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200 bg-gray-50'
                                    }`}
                            >
                                <div className="flex-1">
                                    <p className={`font-bold ${availability === option.id ? 'text-blue-700' : 'text-gray-800'}`}>
                                        {option.label}
                                    </p>
                                    <p className="text-xs text-gray-500">{option.desc}</p>
                                </div>
                                {availability === option.id && (
                                    <CheckCircle className="w-5 h-5 text-blue-600" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Hourly Rate */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <ShieldCheck className="w-5 h-5 text-green-600" />
                        <h2 className="font-bold text-lg">Your Rate (Optional)</h2>
                    </div>

                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                        <input
                            type="number"
                            value={hourlyRate}
                            onChange={(e) => setHourlyRate(e.target.value)}
                            placeholder="Enter amount per hour"
                            className="w-full pl-8 pr-20 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">/hr</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Leave empty to show as "Negotiable"</p>
                </div>

                {/* Selected Skills Summary */}
                {selectedSkills.length > 0 && (
                    <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                        <h3 className="font-bold text-blue-800 mb-3">Your Profile Summary</h3>
                        <div className="space-y-2">
                            <div className="flex gap-2 flex-wrap">
                                {selectedSkills.map(skill => (
                                    <span key={skill} className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                            {experience && (
                                <p className="text-sm text-blue-700">
                                    Experience: <span className="font-semibold capitalize">{experience}</span>
                                </p>
                            )}
                            {availability && (
                                <p className="text-sm text-blue-700">
                                    Availability: <span className="font-semibold capitalize">{availability}</span>
                                </p>
                            )}
                            {hourlyRate && (
                                <p className="text-sm text-blue-700">
                                    Rate: <span className="font-semibold">₹{hourlyRate}/hr</span>
                                </p>
                            )}
                        </div>
                    </div>
                )}

            </div>

            {/* Submit Button */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
                <button
                    onClick={handleSubmit}
                    disabled={loading || selectedSkills.length === 0 || !experience || !availability}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${!loading && selectedSkills.length > 0 && experience && availability
                            ? 'bg-gray-900 text-white hover:bg-gray-800'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    {loading ? 'Saving...' : 'Complete Setup 🎉'}
                </button>
                <p className="text-center text-xs text-gray-400 mt-2">
                    You can update skills anytime from your profile
                </p>
            </div>
        </div>
    );
}