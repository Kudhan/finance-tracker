import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../libs/firebaseConfig';
import useStore from '../../store';
import { toast } from 'react-hot-toast';
import Input from '../../components/ui/input';
import { Button } from '../../components/ui/buttons';
import SocialAuth from '../../components/ui/socialAuth';
import { BiLoader, BiShow, BiHide } from 'react-icons/bi';
import { MdInsights } from 'react-icons/md';
import api from '../../libs/apiCall';

const RegisterSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  firstname: z.string().min(2, { message: 'Full name must be at least 2 characters' }).max(50, { message: 'Full name must be less than 50 characters' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
});

const Signup = () => {
  const { user } = useStore((state) => state);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(RegisterSchema) });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const { data: res } = await api.post("/auth/signup", data);

      toast.success("Account created successfully! Please login.");
      setTimeout(() => {
        navigate("/signin");
      }, 1500);

    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side - Visuals */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 flex items-center justify-center bg-white rounded-xl">
              <MdInsights className="text-indigo-600 text-2xl" />
            </div>
            <span className="text-2xl font-bold text-white">Finance Glance</span>
          </div>
        </div>

        <div className="relative z-10 text-white max-w-lg">
          <h2 className="text-4xl font-bold mb-6">Join thousands of smart investors.</h2>
          <p className="text-indigo-100 text-lg leading-relaxed">
            "I never realized how much I was overspending until I started using Finance Glance. It's an absolute game-changer for personal finance."
          </p>
          <div className="mt-8 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-400 border-2 border-indigo-300"></div>
            <div>
              <p className="font-semibold">Sarah Jenkins</p>
              <p className="text-sm text-indigo-200">Financial Analyst</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Create an account</h2>
            <p className="mt-2 text-slate-600">Start your journey to financial freedom today.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              id="firstname"
              label="Full Name"
              type="text"
              placeholder="John Doe"
              error={errors.firstname?.message}
              {...register("firstname")}
              disabled={loading}
            />

            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="name@company.com"
              {...register("email")}
              error={errors.email?.message}
              disabled={loading}
            />

            <Input
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
              disabled={loading}
              rightIcon={showPassword ? BiHide : BiShow}
              onRightIconClick={() => setShowPassword((prev) => !prev)}
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {loading ? <BiLoader className="text-2xl animate-spin mx-auto" /> : 'Create Account'}
            </Button>

            <p className="text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/signin" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-80 transition-opacity">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
