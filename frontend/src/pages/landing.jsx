import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { MdInsights, MdSecurity, MdTrendingUp, MdSpeed } from 'react-icons/md';
import { BsArrowRight } from 'react-icons/bs';
import useStore from '../store';

const LandingPage = () => {
    const { user } = useStore((state) => state);

    if (user) {
        return <Navigate to="/overview" replace />;
    }

    return (
        <div className="w-full min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Navbar */}
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-lg">
                                <MdInsights className="text-white text-xl" />
                            </div>
                            <span className="text-xl font-bold text-slate-900">Finance Glance</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/signin" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Sign In</Link>
                            <Link to="/signup" className="text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm">Get Started</Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
                        Master Your Finances <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">With Confidence</span>
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600 mb-10">
                        Track expenses, visualize trends, and achieve your financial goals with an intuitive, professional dashboard designed for modern life.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/signup" className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-8 py-3.5 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-indigo-500/30">
                            Start for Free <BsArrowRight />
                        </Link>
                        <Link to="#features" className="px-8 py-3.5 rounded-xl font-semibold text-lg text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                            Everything you need to grow
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: <MdTrendingUp />,
                                title: "Smart Analytics",
                                desc: "Visualize your income and expenses with beautiful, interactive charts that help you make better decisions."
                            },
                            {
                                icon: <MdSecurity />,
                                title: "Bank-Grade Security",
                                desc: "Your financial data is encrypted and secure. We prioritize your privacy above everything else."
                            },
                            {
                                icon: <MdSpeed />,
                                title: "Real-time Tracking",
                                desc: "Instant updates across all your devices. Add transactions on the go and see your balance update immediately."
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg hover:border-indigo-100 transition-all duration-300">
                                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-2xl mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed text-sm">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto bg-indigo-900 rounded-3xl overflow-hidden shadow-2xl relative">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-800 rounded-full opacity-50 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-indigo-600 rounded-full opacity-50 blur-3xl"></div>

                    <div className="relative py-16 px-10 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">Ready to take control?</h2>
                        <p className="text-indigo-200 text-lg mb-8 max-w-2xl mx-auto">
                            Join thousands of users who are already managing their finances smarter with Finance Glance.
                        </p>
                        <Link to="/signup" className="inline-block bg-white text-indigo-900 font-bold px-8 py-3 rounded-lg hover:bg-indigo-50 transition-colors shadow-lg">
                            Get Started Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-50 border-t border-slate-200 py-12">
                <div className="max-w-7xl mx-auto px-4 text-center text-slate-500">
                    <p>&copy; {new Date().getFullYear()} Finance Glance. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
