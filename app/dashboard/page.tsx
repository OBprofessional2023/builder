export default function DashboardHome() {
    return (
        <div className="flex justify-center items-center min-h-screen">
            {/* Welcome Banner */}
            <div className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 
                      rounded-xl shadow-lg overflow-hidden 
                      h-[500px] w-[700px] flex flex-col justify-center items-center text-center">

                {/* Animated SVG Waves - Top */}
                <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
                    <svg
                        className="relative block w-full h-16"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                        viewBox="0 0 1200 120"
                    >
                        <path
                            d="M321.39,56.44c58-10.79,114-30.13,172-41.9C626.16-1.1,684.39,2.61,741.86,15.26c56.08,12.23,108.57,33.43,163.56,45.26,118.48,25.22,252.1,8.05,294.94-7.17V120H0V0C61.23,17.74,164,67.23,321.39,56.44Z"
                            className="fill-black opacity-20 animate-pulse"
                        ></path>
                    </svg>
                </div>

                {/* Animated SVG Waves - Bottom */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                    <svg
                        className="relative block w-full h-16"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                        viewBox="0 0 1200 120"
                    >
                        <path
                            d="M321.39,56.44c58-10.79,114-30.13,172-41.9C626.16-1.1,684.39,2.61,741.86,15.26c56.08,12.23,108.57,33.43,163.56,45.26,118.48,25.22,252.1,8.05,294.94-7.17V120H0V0C61.23,17.74,164,67.23,321.39,56.44Z"
                            className="fill-black opacity-20 animate-pulse"
                        ></path>
                    </svg>
                </div>

                {/* Content */}
                <h1 className="text-4xl font-bold text-black drop-shadow-lg mb-2">
                    Welcome Back!
                </h1>
                <p className="text-black/90 text-lg max-w-md">
                    Ready to build something amazing today? Explore your dashboard and make it yours.
                </p>
            </div>
        </div>
    );
}
