import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthContext } from '../../Auth/AuthContext';
import { doctorProfileSchema, passwordUpdateSchema, doctorProfileDefaultValues, passwordUpdateDefaultValues } from './doctorProfileSchema';
import { useGetDoctorProfile, useUpdateDoctorProfile, useUpdateDoctorPassword } from './useDoctorProfile';

export default function DoctorProfile() {
	const { user, login } = useAuthContext(); // Assuming user object contains doctor's ID
	const doctorId = user?.roleId; // Use actual user ID or a mock ID for testing

	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const { data: doctorProfile, isLoading: isProfileLoading, isError: isProfileError } = useGetDoctorProfile(doctorId);
	const updateProfileMutation = useUpdateDoctorProfile();
	const updatePasswordMutation = useUpdateDoctorPassword();

	const {
		register: profileRegister,
		handleSubmit: handleProfileSubmit,
		formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
		reset: resetProfileForm,
	} = useForm({ // Form for personal and professional details
		resolver: zodResolver(doctorProfileSchema),
		defaultValues: doctorProfileDefaultValues,
	});

	const {
		register: passwordRegister,
		handleSubmit: handlePasswordSubmit,
		formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
		reset: resetPasswordForm,
	} = useForm({ // Form for password update
		resolver: zodResolver(passwordUpdateSchema),
		defaultValues: passwordUpdateDefaultValues,
	});

	useEffect(() => {
		if (doctorProfile) {
			resetProfileForm({
				name: doctorProfile.name,
				email: doctorProfile.email,
				contactNo: doctorProfile.contactNo,
				specialization: doctorProfile.specialization,
			});
			// Reset password form fields to empty when profile loads
			resetPasswordForm(passwordUpdateDefaultValues);
		}
	}, [doctorProfile, resetProfileForm, resetPasswordForm]);

	const onProfileSubmit = async (data) => {
		updateProfileMutation.mutate({ doctorId, doctorData: data }, {
			onSuccess: () => {
				login({
					...user,
					name: data.name,
					email: data.email,
					contactNo: data.contactNo
				})
			}
		});
	};

	const onPasswordSubmit = async (data) => {
		const userId = user?.userId
		updatePasswordMutation.mutate({ userId, password: data.newPassword }, {
			onSuccess: () => {
				resetPasswordForm(passwordUpdateDefaultValues); // Clear password fields on success
			}
		});
	};

	const handleCancel = () => {
		resetProfileForm(doctorProfile); // Reset profile form to fetched data
		resetPasswordForm(passwordUpdateDefaultValues); // Clear password fields
	};

	if (isProfileLoading) {
		return (
			<div className="flex justify-center items-center h-full">
				<p className="text-on-surface-variant">Loading profile...</p>
			</div>
		);
	}

	if (isProfileError) {
		return (
			<div className="flex justify-center items-center h-full text-error">
				<p>Error loading profile. Please try again later.</p>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto">
			{/* Page Header */}
			<div className="mb-xl flex justify-between items-end">
				<div>
					<h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Profile Settings</h1>
					<p className="text-on-surface-variant font-body-md">Manage your account preferences and professional credentials.</p>
				</div>
				<div className="flex gap-md">
					<button
						type="button"
						onClick={handleCancel}
						className="px-gutter py-2 border border-outline-variant rounded-lg font-body-md text-on-surface-variant hover:bg-surface-container transition-colors"
					>
						Cancel
					</button>
					<button
						type="submit"
						form="profile-form" // Associate with the profile form
						className="px-gutter py-2 bg-primary text-white rounded-lg font-body-md font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
						disabled={isProfileSubmitting || updateProfileMutation.isPending}
					>
						{isProfileSubmitting || updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
					</button>
				</div>
			</div>

			{/* Settings Grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
				{/* Sidebar Navigation (Sub-navigation) */}
				<div className="md:col-span-1">
					{/* Profile Summary Card */}
					<div className="bg-white p-lg rounded-xl border border-outline-variant shadow-sm">
						<div className="flex flex-col items-center text-center">
							<div className="relative mb-md">
								<div className="w-24 h-24 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant overflow-hidden">
									<span className="material-symbols-outlined text-outline" style={{ fontSize: "80px" }}>
										account_circle
									</span>
								</div>
							</div>
							<h3 className="font-headline-md text-body-lg font-bold">{doctorProfile?.name}</h3>
							<div className="mt-md pt-md border-t border-surface-variant w-full flex justify-around">
								<div className="text-center">
									<span className="block text-headline-md font-bold text-on-surface">{doctorProfile.totalPatient}</span>
									<span className="text-[10px] text-outline-variant uppercase">Total patient</span>
								</div>
								<div className="text-center">
									<span className="block text-headline-md font-bold text-on-surface">{doctorProfile.totalClinic}</span>
									<span className="text-[10px] text-outline-variant uppercase">clinics</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Main Form Sections */}
				<div className="md:col-span-2 space-y-lg"> {/* This div now contains two forms */}
					<form id="profile-form" onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-lg">
						{/* Personal Information Section */}
						<section className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden" id="personal">
							<div className="border-l-4 border-primary p-lg">
								<h2 className="font-headline-md text-headline-md text-on-surface mb-lg flex items-center gap-sm">
									<span className="material-symbols-outlined text-primary">person</span>
									Personal Information
								</h2>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
									<div className="space-y-xs">
										<label className="font-label-md text-on-surface-variant">Full Name</label>
										<input
											className="w-full p-md border border-outline-variant rounded-lg font-body-md form-input-focus transition-all text-on-surface"
											type="text"
											{...profileRegister("name")}
										/>
										{profileErrors.name && <p className="text-red-500 text-xs mt-1">{profileErrors.name.message}</p>}
									</div>
									<div className="space-y-xs">
										<label className="font-label-md text-on-surface-variant">Email Address</label>
										<input
											className="w-full p-md border border-outline-variant rounded-lg font-body-md form-input-focus transition-all text-on-surface"
											type="email"
											{...profileRegister("email")}
										/>
										{profileErrors.email && <p className="text-red-500 text-xs mt-1">{profileErrors.email.message}</p>}
									</div>
									<div className="space-y-xs">
										<label className="font-label-md text-on-surface-variant">Contact Number</label>
										<input
											className="w-full p-md border border-outline-variant rounded-lg font-body-md form-input-focus transition-all text-on-surface"
											type="tel"
											{...profileRegister("contactNo")} // Changed to contactNo
										/>
										{profileErrors.contactNo && <p className="text-red-500 text-xs mt-1">{profileErrors.contactNo.message}</p>}
									</div>
								</div>
							</div>
						</section>

						{/* Professional Details Section */}
						<section className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden" id="professional">
							<div className="border-l-4 border-secondary p-lg">
								<h2 className="font-headline-md text-headline-md text-on-surface mb-lg flex items-center gap-sm">
									<span className="material-symbols-outlined text-secondary">medical_services</span>
									Professional Details
								</h2>
								<div className="space-y-lg">
									<div className="space-y-xs">
										<label className="font-label-md text-on-surface-variant">Specialization</label>
										<input
											className="w-full p-md border border-outline-variant rounded-lg font-body-md form-input-focus transition-all text-on-surface"
											type="text"
											{...profileRegister("specialization")}
										/>
										{profileErrors.specialization && <p className="text-red-500 text-xs mt-1">{profileErrors.specialization.message}</p>}
									</div>
								</div>
							</div>
						</section>
					</form>

					{/* Account Security Section - Now its own form */}
					<form id="password-form" onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-lg">

						{/* Account Security Section */}
						<section className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden" id="security">
							<div className="border-l-4 border-error p-lg">
								<h2 className="font-headline-md text-headline-md text-on-surface mb-lg flex items-center gap-sm">
									<span className="material-symbols-outlined text-error">security</span>
									Account Security
								</h2>
								<div className="space-y-lg">
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-lg border-t border-surface-variant pt-lg">
										<div className="space-y-xs">
											<label className="font-label-md text-on-surface-variant">New Password</label>
											<div className="relative">
												<input
													className="w-full p-md border border-outline-variant rounded-lg font-body-md form-input-focus transition-all text-on-surface pr-10"
													placeholder="••••••••"
													type={showNewPassword ? "text" : "password"}
													{...passwordRegister("newPassword")}
												/>
												<button
													type="button"
													className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary"
													onClick={() => setShowNewPassword(!showNewPassword)}
												>
													<span className="material-symbols-outlined text-[20px]">{showNewPassword ? "visibility_off" : "visibility"}</span>
												</button>
											</div>
											{passwordErrors.newPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword.message}</p>}
										</div>
										<div className="space-y-xs">
											<label className="font-label-md text-on-surface-variant">Confirm Password</label>
											<div className="relative">
												<input
													className="w-full p-md border border-outline-variant rounded-lg font-body-md form-input-focus transition-all text-on-surface pr-10"
													placeholder="••••••••"
													type={showConfirmPassword ? "text" : "password"}
													{...passwordRegister("confirmPassword")}
												/>
												<button
													type="button"
													className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary"
													onClick={() => setShowConfirmPassword(!showConfirmPassword)}
												>
													<span className="material-symbols-outlined text-[20px]">{showConfirmPassword ? "visibility_off" : "visibility"}</span>
												</button>
											</div>
											{passwordErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword.message}</p>}
										</div>
									</div>
									<div className="p-md bg-surface-container-low border border-outline-variant border-dashed rounded-lg">
										<p className="text-body-sm text-on-surface-variant italic">
											Password must be at least 12 characters and contain a mix of uppercase letters, numbers, and special symbols.
										</p>
									</div>
									<div className="flex gap-md pt-sm">
										<button
											type="button"
											onClick={() => resetPasswordForm(passwordUpdateDefaultValues)}
											className="flex-1 py-md rounded-lg font-bold shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-sm text-on-surface-variant bg-surface-container-high hover:bg-surface-container-highest"
										>
											<span className="material-symbols-outlined">refresh</span> Reset Password
										</button>
										<button
											type="submit"
											className="flex-1 py-md bg-error text-white rounded-lg font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
											disabled={isPasswordSubmitting || updatePasswordMutation.isPending}
										>
											{isPasswordSubmitting || updatePasswordMutation.isPending ? "Updating Password..." : "Update Password"}
										</button>
									</div>
								</div>
							</div>
						</section>
					</form>
					{/* Mobile Footer Action (Duplicate of Top for reachability) */}
					<div className="md:hidden flex flex-col gap-md pt-xl">
						<button
							type="submit"
							form="profile-form"
							className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg"
							disabled={isProfileSubmitting || updateProfileMutation.isPending}
						>
							{isProfileSubmitting || updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
						</button>
						<button
							type="button"
							onClick={handleCancel}
							className="w-full py-4 border border-outline-variant rounded-xl text-on-surface-variant"
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</div >
	);
}