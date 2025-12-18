import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import useStore from '../../store';
import { toast } from 'react-hot-toast';
import Input from '../../components/ui/input';
import { Button } from '../../components/ui/buttons';
import SocialAuth from '../../components/ui/socialAuth';
import { BiLoader, BiShow, BiHide } from 'react-icons/bi';
import { MdInsights } from 'react-icons/md';
import api from '../../libs/apiCall';

const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

const Signin = () => {
  const { user, setCredentials } = useStore((state) => state);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(LoginSchema) });

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const { data: res } = await api.post('/auth/signin', data);

      if (res?.user) {
        toast.success("Welcome back!");
        const userInfo = { ...res?.user, token: res.token };
        localStorage.setItem('user', JSON.stringify(userInfo));
        setCredentials(userInfo);
        setTimeout(() => {
          navigate('/overview');
        }, 1500);
      }
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side - Visuals */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1951&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 flex items-center justify-center bg-white rounded-xl">
              <MdInsights className="text-indigo-600 text-2xl" />
            </div>
            <span className="text-2xl font-bold text-white">Finance Glance</span>
          </div>
        </div>

        <div className="relative z-10 text-white max-w-lg">
          <h2 className="text-4xl font-bold mb-6">Take control of your financial future.</h2>
          <p className="text-indigo-100 text-lg leading-relaxed">
            "Finance Glance has completely transformed how I manage my expenses. The insights are invaluable and the interface is a joy to use."
          </p>
          <div className="mt-8 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-400 border-2 border-indigo-300"></div>
            <p> #Finance Glance</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
            <p className="mt-2 text-slate-600">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              onRightIconClick={() => setShowPassword(prev => !prev)}
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {loading ? <BiLoader className="text-2xl animate-spin mx-auto" /> : 'Sign In'}
            </Button>

            <p className="text-center text-sm text-slate-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-80 transition-opacity">
                Sign up for free
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
