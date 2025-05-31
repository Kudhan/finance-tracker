import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import useStore from '../../store';
import { toast } from 'react-hot-toast';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../../components/ui/card';
import Input from '../../components/ui/input';
import { Button } from '../../components/ui/buttons';
import SocialAuth from '../../components/ui/socialAuth';
import { BiLoader, BiShow, BiHide } from 'react-icons/bi';
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

  const handleAuthClick = () => {
    console.log("Clicked Social Auth");
    toast.error("Server Error - Please try Manually");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-amber-50 via-amber-100 to-amber-50 p-6">
      <Card className="max-w-md w-full bg-white rounded-xl shadow-lg border border-amber-200">
        <CardHeader className="p-8 border-b border-amber-300 bg-amber-100 rounded-t-xl">
          <CardTitle className="text-3xl font-extrabold text-amber-900 text-center">
            Sign In
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <CardContent className="space-y-5">
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="sample@gmail.com"
              {...register("email")}
              error={errors.email?.message}
              className="bg-amber-50 border-amber-300 focus:border-amber-400 focus:ring-amber-300"
              disabled={loading}
            />
            <Input
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
                {...register('password')}
                error={errors.password?.message}
                className="bg-amber-50 border-amber-300 focus:border-amber-400 focus:ring-amber-300"
                disabled={loading}
                rightIcon={showPassword ? BiHide : BiShow}
                onRightIconClick={() => setShowPassword(prev => !prev)}
/>
          </CardContent>
          <CardFooter className="pt-0 flex flex-col gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition duration-300 disabled:opacity-60"
            >
              {loading ? <BiLoader className="text-2xl text-white animate-spin" /> : 'Sign In'}
            </Button>
            <div className="text-center text-gray-500 text-sm">OR</div>
            <SocialAuth isLoading={loading} setLoading={setLoading} onClick={handleAuthClick} />
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-amber-600 hover:text-amber-800 font-semibold">
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Signin;
