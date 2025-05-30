

// // export default LoginPage;
// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { login } from '../../app/features/auth/authThunks';
// import { reset } from '../../app/features/auth/authSlice';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');
  
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
  
//   const { user, isLoading, isSuccess, isError, message } = useSelector(
//     (state) => state.auth
//   );

//   // Theme colors
//   const colors = {
//     background: '#0a0e1a',
//     cardBackground: '#121824',
//     primary: '#3c8ce5',
//     primaryLight: '#5c98e8',
//     accent: '#35B778',
//     textLight: '#ffffff',
//     textMedium: '#8f9195',
//     error: '#ff4d4f',
//     inputBackground: '#1a1e2a'
//   };

//   useEffect(() => {
//     // Only handle success state if we're not already in the process of redirecting
//     if (isSuccess && user && !sessionStorage.getItem('isRedirecting')) {
//       // Set a flag to prevent multiple redirects
//       sessionStorage.setItem('isRedirecting', 'true');
      
//       toast.success('Login successful!');
      
//       // Redirect based on user role
//       setTimeout(() => {
//         if (user && user.role) {
//           navigate(`/${user.role}/dashboard`);
//         } else {
//           navigate('/dashboard');
//         }
        
//         // Clean up
//         sessionStorage.removeItem('isRedirecting');
//         dispatch(reset());
//       }, 500);
//     }
    
//     // Handle errors separately to avoid mixing state updates
//     if (isError) {
//       setError(message);
//       toast.error(message || 'Login failed. Please try again.');
//       dispatch(reset());
//     }
    
//     // Return cleanup function to handle component unmounting
//     return () => {
//       if (isSuccess || isError) {
//         dispatch(reset());
//       }
//     };
//   }, [isSuccess, isError, user, message, navigate, dispatch]);

//   // Dot pattern for background
//   const DotPattern = () => (
//     <div className="absolute inset-0 overflow-hidden pointer-events-none">
//       {Array.from({ length: 20 }).map((_, i) => (
//         <div
//           key={i}
//           className="absolute rounded-full opacity-10 border border-gray-400"
//           style={{
//             width: Math.random() * 100 + 40 + 'px',
//             height: Math.random() * 100 + 40 + 'px',
//             top: Math.random() * 100 + '%',
//             left: Math.random() * 100 + '%',
//           }}
//         />
//       ))}
//     </div>
//   );

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');

//     if (!email.trim()) {
//       setError('Email is required');
//       return;
//     }
    
//     if (!password) {
//       setError('Password is required');
//       return;
//     }

//     const resultAction = dispatch(login({ email, password })).then(navigate(`/${user.role}/dashboard`))
    
//   };

//   const SocialButton = ({ icon, text, color }) => (
//     <button
//       className="flex items-center justify-center gap-2 w-full p-3 rounded-lg mb-3 text-white transition-opacity hover:opacity-90"
//       style={{ backgroundColor: color }}
//       type="button"
//     >
//       {icon}
//       <span>{text}</span>
//     </button>
//   );

//   return (
//     <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: colors.background }}>
//       <ToastContainer />
//       <DotPattern />
      
//       <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center relative z-10">
//         <div className="bg-opacity-70 p-6 rounded-lg max-w-md w-full" style={{ backgroundColor: colors.cardBackground }}>
//           <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: colors.textLight }}>
//             Sign In to Platform
//           </h2>
          
//           {error && (
//             <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: 'rgba(255, 77, 79, 0.1)', color: colors.error }}>
//               {error}
//             </div>
//           )}
          
//           <form onSubmit={handleLogin} className="mb-6">
//             <div className="mb-4">
//               <label htmlFor="email" className="block mb-2 text-sm font-medium" style={{ color: colors.textMedium }}>
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
//                 style={{
//                   backgroundColor: colors.inputBackground,
//                   color: colors.textLight,
//                   borderColor: error && !email ? colors.error : 'transparent',
//                   borderWidth: error && !email ? '1px' : '0',
//                 }}
//                 placeholder="your@email.com"
//               />
//             </div>
            
//             <div className="mb-6">
//               <label htmlFor="password" className="block mb-2 text-sm font-medium" style={{ color: colors.textMedium }}>
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   id="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition-all pr-10"
//                   style={{
//                     backgroundColor: colors.inputBackground,
//                     color: colors.textLight,
//                     borderColor: error && !password ? colors.error : 'transparent',
//                     borderWidth: error && !password ? '1px' : '0',
//                   }}
//                   placeholder="••••••••"
//                 />
//                 <button
//                   type="button"
//                   className="absolute inset-y-0 right-0 flex items-center px-3"
//                   onClick={() => setShowPassword(!showPassword)}
//                   style={{ color: colors.textMedium }}
//                 >
//                   {showPassword ? (
//                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                       <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
//                       <circle cx="12" cy="12" r="3"/>
//                       <path d="m3 3 18 18"/>
//                     </svg>
//                   ) : (
//                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                       <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
//                       <circle cx="12" cy="12" r="3"/>
//                     </svg>
//                   )}
//                 </button>
//               </div>
//             </div>
            
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center">
//                 <input
//                   id="remember"
//                   type="checkbox"
//                   className="w-4 h-4 rounded"
//                   style={{ accentColor: colors.primary }}
//                 />
//                 <label htmlFor="remember" className="ml-2 text-sm" style={{ color: colors.textMedium }}>
//                   Remember me
//                 </label>
//               </div>
//               <a href="#" className="text-sm font-medium" style={{ color: colors.primary }}>
//                 Forgot password?
//               </a>
//             </div>
            
//             <button
//               type="submit"
//               className="w-full p-3 rounded-lg font-medium text-white transition-opacity hover:opacity-90 flex items-center justify-center"
//               style={{ backgroundColor: colors.primary }}
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//               ) : null}
//               {isLoading ? 'Signing in...' : 'Sign in'}
//             </button>
//           </form>
          
//           <div className="flex items-center my-4">
//             <div className="flex-grow h-px bg-gray-600"></div>
//             <div className="px-3 text-sm" style={{ color: colors.textMedium }}>or continue with</div>
//             <div className="flex-grow h-px bg-gray-600"></div>
//           </div>
          
//           {/* <div className="mb-6">
//             <SocialButton
//               icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>}
//               text="Continue with Google"
//               color="#4285F4"
//             />
            
//             <SocialButton
//               icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>}
//               text="Continue with Twitter"
//               color="#1DA1F2"
//             />
            
//             <SocialButton
//               icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>}
//               text="Continue with Github"
//               color="#333"
//             />
//           </div> */}
          
//           <p className="text-center text-sm" style={{ color: colors.textMedium }}>
//             Don't have an account? <Link to="/signup" className="font-medium" style={{ color: colors.primary }}>Sign up</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../app/features/auth/authThunks';
import { reset } from '../../app/features/auth/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import theme context
import { useTheme } from './../../context/ThemeProvider';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Use theme context
  const { theme, toggleTheme, themeConfig, isDark } = useTheme();
  
  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Only handle success state if we're not already in the process of redirecting
    if (isSuccess && user && !sessionStorage.getItem('isRedirecting')) {
      // Set a flag to prevent multiple redirects
      sessionStorage.setItem('isRedirecting', 'true');
      
      toast.success('Login successful!');
      
      // Redirect based on user role
      setTimeout(() => {
        if (user && user.role) {
          navigate(`/${user.role}/dashboard`);
        } else {
          navigate('/dashboard');
        }
        
        // Clean up
        sessionStorage.removeItem('isRedirecting');
        dispatch(reset());
      }, 500);
    }
    
    // Handle errors separately to avoid mixing state updates
    if (isError) {
      setError(message);
      toast.error(message || 'Login failed. Please try again.');
      dispatch(reset());
    }
    
    // Return cleanup function to handle component unmounting
    return () => {
      if (isSuccess || isError) {
        dispatch(reset());
      }
    };
  }, [isSuccess, isError, user, message, navigate, dispatch]);

  // Dot pattern for background
  const DotPattern = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className={`absolute rounded-full opacity-10 border ${theme === 'dark' ? 'border-gray-400' : 'border-slate-300'}`}
          style={{
            width: Math.random() * 100 + 40 + 'px',
            height: Math.random() * 100 + 40 + 'px',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
          }}
        />
      ))}
    </div>
  );

  // Theme Toggle Component
  const ThemeToggle = () => (
    <button
      onClick={toggleTheme}
      className={`fixed top-4 right-4 z-50 p-3 rounded-full transition-all duration-300 ${themeConfig[theme].button.secondary}`}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!password) {
      setError('Password is required');
      return;
    }

    const resultAction = dispatch(login({ email, password })).then(navigate(`/${user.role}/dashboard`))
  };

  const SocialButton = ({ icon, text, color }) => (
    <button
      className={`flex items-center justify-center gap-2 w-full p-3 rounded-lg mb-3 text-white transition-opacity hover:opacity-90`}
      style={{ backgroundColor: color }}
      type="button"
    >
      {icon}
      <span>{text}</span>
    </button>
  );

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden ${themeConfig[theme].background}`}>
      <ToastContainer 
        theme={isDark ? 'dark' : 'light'}
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <ThemeToggle />
      <DotPattern />
      
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center relative z-10">
        <div className={`bg-opacity-70 p-6 rounded-lg max-w-md w-full ${themeConfig[theme].card}`}>
          <h2 className={`text-2xl font-bold mb-6 text-center ${themeConfig[theme].text}`}>
            Sign In to Platform
          </h2>
          
          {error && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${theme === 'dark' 
              ? 'bg-red-900/20 text-red-400 border border-red-800/30' 
              : 'bg-red-50 text-red-600 border border-red-200'
            }`}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="mb-6">
            <div className="mb-4">
              <label htmlFor="email" className={`block mb-2 text-sm font-medium ${themeConfig[theme].secondaryText}`}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition-all ${themeConfig[theme].input} ${
                  error && !email ? (theme === 'dark' ? 'border-red-500 ring-red-500/50' : 'border-red-300 ring-red-300/50') : ''
                }`}
                placeholder="your@email.com"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className={`block mb-2 text-sm font-medium ${themeConfig[theme].secondaryText}`}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition-all pr-10 ${themeConfig[theme].input} ${
                    error && !password ? (theme === 'dark' ? 'border-red-500 ring-red-500/50' : 'border-red-300 ring-red-300/50') : ''
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className={`absolute inset-y-0 right-0 flex items-center px-3 ${themeConfig[theme].secondaryText}`}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                      <circle cx="12" cy="12" r="3"/>
                      <path d="m3 3 18 18"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className={`w-4 h-4 rounded ${theme === 'dark' ? 'accent-blue-500' : 'accent-blue-600'}`}
                />
                <label htmlFor="remember" className={`ml-2 text-sm ${themeConfig[theme].secondaryText}`}>
                  Remember me
                </label>
              </div>
              <a href="#" className={`text-sm font-medium ${themeConfig[theme].gradient.text} hover:opacity-80`}>
                Forgot password?
              </a>
            </div>
            
            <button
              type="submit"
              className={`w-full p-3 rounded-lg font-medium text-white transition-all hover:opacity-90 flex items-center justify-center ${themeConfig[theme].button.primary}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          
          <div className="flex items-center my-4">
            <div className={`flex-grow h-px ${theme === 'dark' ? 'bg-gray-600' : 'bg-slate-300'}`}></div>
            <div className={`px-3 text-sm ${themeConfig[theme].secondaryText}`}>or continue with</div>
            <div className={`flex-grow h-px ${theme === 'dark' ? 'bg-gray-600' : 'bg-slate-300'}`}></div>
          </div>
          
          <p className={`text-center text-sm ${themeConfig[theme].secondaryText}`}>
            Don't have an account? <Link to="/signup" className={`font-medium ${themeConfig[theme].gradient.text} hover:opacity-80`}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;