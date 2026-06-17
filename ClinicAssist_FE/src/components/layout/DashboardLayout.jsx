import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../Auth/AuthContext';

export default function DashboardLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { logout, user } = useAuthContext();
    const location = useLocation();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        
        // Set initial state
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    
    const closeSidebarMobile = () => {
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <div className="flex h-screen bg-surface text-on-surface overflow-hidden">
            {/* Mobile backdrop */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity" 
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside 
                className={`fixed md:relative z-50 h-full bg-surface-container-low border-outline-variant transition-all duration-300 overflow-hidden ${
                    isSidebarOpen 
                        ? 'w-[240px] translate-x-0 border-r' 
                        : 'w-[240px] -translate-x-full md:w-0 md:translate-x-0 md:border-r-0'
                }`}
            >
                <div className="flex flex-col h-full w-[240px] p-md">
                    <div className="mb-xl px-sm flex justify-between items-center">
                        <div>
                            <h1 className="font-headline-md text-headline-md font-bold text-primary">ClinicAssist</h1>
                            <p className="font-body-sm text-on-surface-variant opacity-70">Provider Portal</p>
                        </div>
                        <button className="md:hidden text-on-surface-variant flex items-center cursor-pointer" onClick={() => setIsSidebarOpen(false)}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    
                    <nav className="flex-1 space-y-base overflow-y-auto">
                        <Link onClick={closeSidebarMobile} to="/dashboard" className={`flex items-center gap-md px-md py-sm rounded-lg transition-all group ${location.pathname === '/dashboard' ? 'text-primary font-bold bg-secondary-container/30' : 'text-on-tertiary-fixed-variant hover:bg-surface-container-highest'}`}>
                            <span className="material-symbols-outlined text-primary">dashboard</span>
                            <span className="font-body-md">Dashboard</span>
                        </Link>
                        
                        <Link onClick={closeSidebarMobile} to="/consultations" className={`flex items-center gap-md px-md py-sm rounded-lg transition-all group ${location.pathname.startsWith('/consultations') ? 'text-primary font-bold bg-secondary-container/30' : 'text-on-tertiary-fixed-variant hover:bg-surface-container-highest'}`}>
                            <span className="material-symbols-outlined text-primary">medical_services</span>
                            <span className="font-body-md">Consultations</span>
                        </Link>

                        <Link onClick={closeSidebarMobile} to="/patients" className={`flex items-center gap-md px-md py-sm rounded-lg transition-all ${location.pathname.startsWith('/patients') ? 'text-primary font-bold bg-secondary-container/30' : 'text-on-tertiary-fixed-variant hover:bg-surface-container-highest'}`}>
                            <span className="material-symbols-outlined text-primary">group</span>
                            <span className="font-body-md">Patients</span>
                        </Link>

                        <Link onClick={closeSidebarMobile} to="/settings" className={`flex items-center gap-md px-md py-sm rounded-lg transition-all ${location.pathname.startsWith('/settings') ? 'text-primary font-bold bg-secondary-container/30' : 'text-on-tertiary-fixed-variant hover:bg-surface-container-highest'}`}>
                            <span className="material-symbols-outlined text-primary">settings_applications</span>
                            <span className="font-body-md">Clinic Settings</span>
                        </Link>

                        <Link onClick={closeSidebarMobile} to="/analytics" className={`flex items-center gap-md px-md py-sm rounded-lg transition-all ${location.pathname.startsWith('/analytics') ? 'text-primary font-bold bg-secondary-container/30' : 'text-on-tertiary-fixed-variant hover:bg-surface-container-highest'}`}>
                            <span className="material-symbols-outlined text-primary">monitoring</span>
                            <span className="font-body-md">Analytics</span>
                        </Link>
                    </nav>

                    <div className="mt-auto pt-md border-t border-outline-variant space-y-base">
                        <Link onClick={closeSidebarMobile} to="/support" className="flex items-center gap-md px-md py-sm rounded-lg text-on-tertiary-fixed-variant hover:bg-surface-container-highest">
                            <span className="material-symbols-outlined">contact_support</span>
                            <span className="font-body-md">Support</span>
                        </Link>
                        <button onClick={() => { closeSidebarMobile(); logout(); }} className="w-full flex items-center gap-md px-md py-sm rounded-lg text-on-tertiary-fixed-variant hover:bg-surface-container-highest cursor-pointer">
                            <span className="material-symbols-outlined">logout</span>
                            <span className="font-body-md">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full w-full min-w-0 transition-all duration-300 bg-surface">
                {/* TopAppBar */}
                <header className="flex justify-between items-center px-lg h-16 w-full sticky top-0 z-30 bg-surface shadow-sm shrink-0">
                    <div className="flex items-center gap-md">
                        <span className="material-symbols-outlined cursor-pointer" onClick={toggleSidebar}>menu</span>      
                    </div>
                    
                    <div className="flex items-center gap-lg">
                        <div className="flex gap-md text-on-surface-variant">
                            <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">settings</span>
                        </div>
                        
                        <div className="flex items-center gap-sm pl-md border-l border-outline-variant cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant overflow-hidden">
                                <span className="material-symbols-outlined text-outline">account_circle</span>
                            </div>
                            <span className="hidden lg:block font-label-md text-on-surface">{user?.name || "User"}</span>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-md lg:p-lg">
                    <div className="max-w-6xl mx-auto space-y-lg">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
