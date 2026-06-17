import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, loginDefaultValues } from "./loginSchema";
import { doctorRegisterSchema, doctorRegisterDefaultValues } from "./doctorRegisterSchema";
import { patientRegisterSchema, patientRegisterDefaultValues } from "./patientRegisterSchema";
import { useLogin, useRegisterDoctor, useRegisterPatient } from "./useAuth";
import { useAuthContext } from "./AuthContext";

export default function Login() {
	const [activeTab, setActiveTab] = useState("login");
	const [registrationType, setRegistrationType] = useState("patient"); // 'patient' or 'doctor'
	
	const navigate = useNavigate();
	const { login, isAuthenticated } = useAuthContext();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: zodResolver(
			activeTab === "login"
				? loginSchema
				: registrationType === "doctor"
					? doctorRegisterSchema
					: patientRegisterSchema
		),
		defaultValues: activeTab === "login" ? loginDefaultValues : {}, // Reset default values when switching tabs
	}); 

	const loginMutation = useLogin({
		onSuccess: (data) => {
			// Assuming backend returns a token or sets it in cookies. 
			// We call login to update the context and navigate to dashboard.
			login(data);
			navigate("/dashboard");
		}
	});
	const registerDoctorMutation = useRegisterDoctor({
		onSuccess: () => setActiveTab("login")
	});
	const registerPatientMutation = useRegisterPatient({
		onSuccess: () => setActiveTab("login")
	});

	const onSubmit = async (data) => {
		if (activeTab === "login") {
			loginMutation.mutate(data);
		} else if (registrationType === "doctor") {
			registerDoctorMutation.mutate(data);
		} else if (registrationType === "patient") {
			registerPatientMutation.mutate(data);
		}
	};

	// Effect to reset form when activeTab or registrationType changes
	useEffect(() => {
		if (activeTab === "login") {
			reset(loginDefaultValues);
		} else if (registrationType === "doctor") {
			reset(doctorRegisterDefaultValues);
		} else if (registrationType === "patient") {
			reset(patientRegisterDefaultValues);
		} else {
			// If no registration type is selected, clear the form or set a default
			reset({});
		}
	}, [activeTab, registrationType, reset]);

	// Redirect if already authenticated
	if (isAuthenticated) {
		return <Navigate to="/dashboard" replace />;
	}

	return (
		<div className="min-h-screen flex w-full font-sans bg-white">

			{/* Left Side - Image/Branding (Hidden on mobile, visible on large screens) */}
			<div className="hidden lg:flex lg:w-1/2 bg-blue-900 relative items-center justify-center overflow-hidden">
				{/* Decorative background elements */}
				<div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-blue-400 via-blue-800 to-transparent"></div>

				<div className="relative z-10 text-center px-12">
					<div className="w-20 h-20 mx-auto bg-white rounded-2xl flex items-center justify-center text-4xl shadow-xl mb-8">
						🏥
					</div>
					<h1 className="text-5xl font-bold text-white mb-6 tracking-tight">
						ClinicAssist
					</h1>
					<p className="text-blue-100 text-lg mx-auto leading-relaxed">
						Streamlining patient care, prescriptions, and clinic management through secure, QR-driven workflows.
					</p>
				</div>
			</div>

			{/* Right Side - Login Form */}
			<div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 h-full">
				<div className="w-full bg-white rounded-2xl shadow-lg p-8 max-h-full overflow-y-auto">

					{/* Mobile Header (Only shows on small screens) */}
					<div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
						<div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-lg shadow-md">
							🏥
						</div>
						<h1 className="text-2xl font-bold text-blue-900">
							ClinicAssist
						</h1>
					</div>

					{/* Form Header */}
					<div className="mb-8">
						<h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
						<p className="text-gray-500">Please enter your details to sign in.</p>
					</div>

					{/* Tabs (Login / Register) */}
					<div className="flex mb-8 border-b border-gray-200">
						<button
							type="button"
							onClick={() => setActiveTab("login")}
							className={`flex-1 pb-3 text-sm text-center transition-all ${activeTab === "login"
								? "border-b-2 border-blue-600 text-blue-600 font-semibold"
								: "text-gray-500 hover:text-gray-700"
								}`}
						>
							Login
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("register")}
							className={`flex-1 pb-3 text-sm text-center transition-all ${activeTab === "register"
								? "border-b-2 border-blue-600 text-blue-600 font-semibold"
								: "text-gray-500 hover:text-gray-700"
								}`}
						>
							Register
						</button>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
						{activeTab === "login" ? (
							<>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1.5">
										Email Address
									</label>
									<input type="email"
										placeholder="Enter email"
										{...register("email")}
										className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-900 placeholder-gray-400 
												   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
												   transition-all shadow-sm"
									/>
									{errors.email && (
										<p className="text-red-500 text-xs mt-1">
											{errors.email.message}
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1.5">
										Password
									</label>
									<input type="password"
										placeholder="••••••••"
										{...register("password")}
										className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-900 placeholder-gray-400 
												   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
												   transition-all shadow-sm"
									/>
									{errors.password && (
										<p className="text-red-500 text-xs mt-1">
											{errors.password.message}
										</p>
									)}
								</div>

								{/* Remember Me & Forgot Password */}
								<div className="flex items-center justify-between pt-1">
									<a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
										Forgot Password?
									</a>
								</div>

								<button
									type="submit"
									className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3 rounded-xl font-medium transition-all shadow-sm hover:shadow mt-4" disabled={loginMutation.isPending}
								>
									{loginMutation.isPending ? "Signing In..." : "Sign In"}
								</button>
								{loginMutation.isError && (
									<p className="text-red-500 text-xs mt-1 text-center">
										Login failed: {loginMutation.error.message || "Unknown error"}
									</p>
								)}
							</>
						) : (
							<>
								{/* Full Name (Common for both patient and doctor registration) */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
									<input type="text"
										placeholder="John Doe"
										{...register("name")}
										className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm" />
									{errors.name && (
										<p className="text-red-500 text-xs mt-1">
											{errors.name.message}
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1.5">
										Email Address
									</label>
									<input type="email"
										placeholder="Enter email"
										{...register("email")}
										className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-900 placeholder-gray-400 
												   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
												   transition-all shadow-sm"
									/>
									{errors.email && (
										<p className="text-red-500 text-xs mt-1">
											{errors.email.message}
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1.5">
										Contact No.
									</label>
									<input type="text" // Changed to text for better handling of phone numbers
										placeholder="Enter contact info"
										{...register("contactNumber")}
										className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-900 placeholder-gray-400 
												   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
												   transition-all shadow-sm"
									/>
									{errors.contactNumber && (
										<p className="text-red-500 text-xs mt-1">
											{errors.contactNumber.message}
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1.5">
										Password
									</label>
									<input type="password"
										placeholder="••••••••"
										{...register("password")}
										className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-900 placeholder-gray-400 
												   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
												   transition-all shadow-sm"
									/>
									{errors.password && (
										<p className="text-red-500 text-xs mt-1">
											{errors.password.message}
										</p>
									)}
								</div>

								{/* Confirm Password */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1.5">
										Confirm Password
									</label>
									<input type="password"
										placeholder="••••••••"
										{...register("confirmPassword")}
										className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
									/>
									{errors.confirmPassword && (
										<p className="text-red-500 text-xs mt-1">
											{errors.confirmPassword.message}
										</p>
									)}
								</div>

								<div className="mt-6">
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Register as:
									</label>
									<div className="flex gap-4">
										<label className="inline-flex items-center">
											<input
												type="radio"
												className="form-radio text-blue-600"
												name="registrationType"
												value="patient"
												checked={registrationType === "patient"}
												onChange={() => setRegistrationType("patient")}
											/>
											<span className="ml-2 text-gray-700">Patient</span>
										</label>
										<label className="inline-flex items-center">
											<input
												{...register("registrationType")}
												type="radio"
												className="form-radio text-blue-600"
												name="registrationType"
												value="doctor"
												checked={registrationType === "doctor"}
												onChange={() => setRegistrationType("doctor")}
											/>
											<span className="ml-2 text-gray-700">Doctor</span>
										</label>
									</div>
									{errors.registrationType && (
										<p className="text-red-500 text-xs mt-1">
											{errors.registrationType.message}
										</p>
									)}
								</div>

								{/* Removed p-1 from here and added to inner content wrapper. Added overflow-visible when expanded. */}
								<div className={`transition-all duration-300 ease-in-out ${registrationType === "patient" ? "max-h-[9999px] opacity-100 overflow-visible" : "max-h-0 opacity-0 overflow-hidden"}`}>
									<>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
											<input type="date" {...register("dob")} className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm" />
											{errors.dob && (
												<p className="text-red-500 text-xs mt-1">
													{errors.dob.message}
												</p>
											)}
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1.5">Blood Group</label>
											<select {...register("bloodGroup")} className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm">
												<option value="">Select Blood Group</option>
												<option value="A+">A+</option>
												<option value="A-">A-</option>
												<option value="B+">B+</option>
												<option value="B-">B-</option>
												<option value="AB+">AB+</option>
												<option value="AB-">AB-</option>
												<option value="O+">O+</option>
												<option value="O-">O-</option>
											</select>
											{errors.bloodGroup && (
												<p className="text-red-500 text-xs mt-1">
													{errors.bloodGroup.message}
												</p>
											)}
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1.5">Weight (kg)</label>
											<input type="number" placeholder="e.g., 70" {...register("weight")} className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm" />
											{errors.weight && (
												<p className="text-red-500 text-xs mt-1">
													{errors.weight.message}
												</p>
											)}
										</div>
									</>
								</div>

								{/* Removed p-1 from here and added to inner content wrapper. Added overflow-visible when expanded. */}
								<div className={`transition-all duration-300 ease-in-out ${registrationType === "doctor" ? "max-h-[9999px] opacity-100 overflow-visible" : "max-h-0 opacity-0 overflow-hidden"}`}>
									<div className="p-1"> {/* Added p-1 to an inner div to maintain consistent padding */}
									<label className="block text-sm font-medium text-gray-700 mb-1.5">Specialization</label>
									<textarea rows={3} placeholder="Cardiology" {...register("specialization")} className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"></textarea>
									{errors.specialization && (
										<p className="text-red-500 text-xs mt-1">
											{errors.specialization.message}
										</p>
									)}
									</div>
								</div>

								<button
									type="submit"
									className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3 rounded-xl font-medium transition-all shadow-sm hover:shadow mt-4" disabled={registerDoctorMutation.isPending || registerPatientMutation.isPending}
								>
									{registerDoctorMutation.isPending || registerPatientMutation.isPending ? "Registering..." : "Register"}
								</button>
								{(registerDoctorMutation.isError || registerPatientMutation.isError) && (
									<p className="text-red-500 text-xs mt-1 text-center">
										Registration failed: {(registerDoctorMutation.error || registerPatientMutation.error)?.message || "Unknown error"}
									</p>
								)}
							</>
						)}
					</form>

					<div className="mt-8 pt-6 border-t border-gray-100 text-center flex items-center justify-center gap-2 text-xs text-gray-400">
						<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
						</svg>
						End-to-end encrypted connection
					</div>
				</div>
			</div>
		</div>
	);
}