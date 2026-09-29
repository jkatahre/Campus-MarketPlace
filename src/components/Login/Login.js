import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { uploadImageToCloudinary } from '../../utils/cloudinary';

const DEPARTMENTS = [
    "Computer Science",
    "Information Technology",
    "Electronics & Communication",
    "Electrical",
    "Mechanical",
    "Civil",
    "Chemical",
    "Management",
    "Science",
    "Arts & Humanities",
    "Other",
];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "Postgraduate"];

const EMPTY_SIGNUP = {
    name: '',
    enrollmentNumber: '',
    email: '',
    phone: '',
    department: '',
    year: '',
    password: '',
    confirmPassword: '',
};

function validateSignup(form, avatarFile) {
    if (!avatarFile) return "Please upload a profile photo (avatar).";
    if (form.name.trim().length < 2) return "Please enter your full name.";
    if (!/^[A-Za-z0-9]{5,20}$/.test(form.enrollmentNumber.trim())) {
        return "Enrollment number must be 5-20 letters or digits, with no spaces or symbols.";
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return "Please enter a valid email address.";
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) return "Please enter a valid 10-digit mobile number.";
    if (!form.department) return "Please select your department.";
    if (!form.year) return "Please select your year of study.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    return "";
}

const inputClass = "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400";
const labelClass = "block text-sm font-medium mb-1";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, signup } = useAuth();
    const redirectTo = location.state?.from || "/";

    const [isSignup, setIsSignup] = useState(false);
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [signupForm, setSignupForm] = useState(EMPTY_SIGNUP);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Free the preview URL when the avatar changes or the form closes.
    useEffect(() => {
        return () => {
            if (avatarPreview) URL.revokeObjectURL(avatarPreview);
        };
    }, [avatarPreview]);

    const updateSignupField = (e) => {
        const { name, value } = e.target;
        setSignupForm((prev) => ({ ...prev, [name]: value }));
    };

    const avatarHandler = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file for your avatar.");
            e.target.value = "";
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("Please choose an avatar smaller than 5 MB.");
            e.target.value = "";
            return;
        }
        setError('');
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const switchMode = (signupMode) => {
        setIsSignup(signupMode);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (isSignup) {
            const validationError = validateSignup(signupForm, avatarFile);
            if (validationError) {
                setError(validationError);
                return;
            }
        }

        setIsLoading(true);
        try {
            if (isSignup) {
                const { confirmPassword, ...details } = signupForm;
                const avatarUrl = await uploadImageToCloudinary(avatarFile);
                await signup({ ...details, avatarUrl });
            } else {
                await login(identifier, password);
            }
            navigate(redirectTo, { replace: true });
        } catch (authError) {
            setError(authError.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-y-auto relative">

                {/* Header */}
                <div className="bg-indigo-600 px-6 py-4">
                    <h2 className="text-2xl font-bold text-white">
                        {isSignup ? "Create Account" : "Welcome Back"}
                    </h2>
                    <p className="text-indigo-100 text-sm">
                        {isSignup ? "Sign up with your student details to start using Campus Market" : "Sign in to your Campus Market account"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>

                    {location.state?.message && !error && (
                        <p className="text-sm text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg p-2 text-center">
                            {location.state.message}
                        </p>
                    )}

                    {isSignup ? (
                        <>
                            {/* Avatar */}
                            <div className="flex flex-col items-center">
                                <label htmlFor="avatar" className="cursor-pointer group">
                                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-indigo-300 overflow-hidden flex items-center justify-center bg-indigo-50 group-hover:border-indigo-500">
                                        {avatarPreview ? (
                                            <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-3xl text-indigo-300">👤</span>
                                        )}
                                    </div>
                                    <span className="block text-center text-sm text-indigo-600 font-medium mt-2">
                                        {avatarPreview ? "Change photo" : "Upload photo *"}
                                    </span>
                                </label>
                                <input id="avatar" type="file" accept="image/*" onChange={avatarHandler} className="hidden" />
                            </div>

                            <div>
                                <label className={labelClass} htmlFor="name">Full Name *</label>
                                <input id="name" name="name" type="text" value={signupForm.name} onChange={updateSignupField} className={inputClass} placeholder="Rahul Sharma" autoComplete="name" />
                            </div>

                            <div>
                                <label className={labelClass} htmlFor="enrollmentNumber">Enrollment Number *</label>
                                <input id="enrollmentNumber" name="enrollmentNumber" type="text" value={signupForm.enrollmentNumber} onChange={updateSignupField} className={`${inputClass} uppercase`} placeholder="0801CS211001" />
                            </div>

                            <div>
                                <label className={labelClass} htmlFor="signupEmail">College Email *</label>
                                <input id="signupEmail" name="email" type="email" value={signupForm.email} onChange={updateSignupField} className={inputClass} placeholder="student@university.edu" autoComplete="email" />
                            </div>

                            <div>
                                <label className={labelClass} htmlFor="phone">Mobile Number *</label>
                                <input id="phone" name="phone" type="tel" inputMode="numeric" maxLength={10} value={signupForm.phone} onChange={updateSignupField} className={inputClass} placeholder="9876543210" autoComplete="tel" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass} htmlFor="department">Department *</label>
                                    <select id="department" name="department" value={signupForm.department} onChange={updateSignupField} className={inputClass}>
                                        <option value="">Select</option>
                                        {DEPARTMENTS.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass} htmlFor="year">Year *</label>
                                    <select id="year" name="year" value={signupForm.year} onChange={updateSignupField} className={inputClass}>
                                        <option value="">Select</option>
                                        {YEARS.map((year) => <option key={year} value={year}>{year}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className={labelClass} htmlFor="signupPassword">Password *</label>
                                <input id="signupPassword" name="password" type="password" value={signupForm.password} onChange={updateSignupField} className={inputClass} placeholder="At least 6 characters" autoComplete="new-password" />
                            </div>

                            <div>
                                <label className={labelClass} htmlFor="confirmPassword">Confirm Password *</label>
                                <input id="confirmPassword" name="confirmPassword" type="password" value={signupForm.confirmPassword} onChange={updateSignupField} className={inputClass} placeholder="Re-enter password" autoComplete="new-password" />
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <label className={labelClass} htmlFor="identifier">Email or Enrollment Number</label>
                                <input id="identifier" type="text" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} className={inputClass} placeholder="student@university.edu" autoComplete="username" />
                            </div>

                            <div>
                                <label className={labelClass} htmlFor="password">Password</label>
                                <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="••••••••" autoComplete="current-password" />
                            </div>
                        </>
                    )}

                    {error && <p className="text-sm text-red-600 text-center" role="alert">{error}</p>}

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={isLoading || (!isSignup && (!identifier || !password))}
                            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (isSignup ? "Creating account..." : "Signing in...") : isSignup ? "Sign Up" : "Sign In"}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="w-full bg-gray-300 text-black font-bold py-3 rounded-lg hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>

                    {/* Toggle Login / Signup */}
                    <div className="text-center text-sm mt-2">
                        {isSignup ? (
                            <p>
                                Already have an account?{" "}
                                <button type="button" onClick={() => switchMode(false)} className="text-indigo-600 font-semibold">
                                    Login
                                </button>
                            </p>
                        ) : (
                            <p>
                                Don’t have an account?{" "}
                                <button type="button" onClick={() => switchMode(true)} className="text-indigo-600 font-semibold">
                                    Sign Up
                                </button>
                            </p>
                        )}
                    </div>

                </form>
            </div>
        </div>
    );
}

export default Login;
