import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

const LoginForm = () => {
    const { signInWithGoogle, isLoading, isAuthenticated, error, clearAuthError } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/chatpage");
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        // Clear any existing errors when component mounts
        clearAuthError();
    }, [clearAuthError]);

    const handleGoogleSignIn = async () => {
        await signInWithGoogle();
    };

    return (
        <div className="min-h-screen flex items-center w-screen justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/20 to-black"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.05)_1px,_transparent_0)] bg-[length:32px_32px] opacity-30"></div>

            <div className="relative max-w-md w-full space-y-8">
                {/* Clean card design matching homepage theme */}
                <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center">
                        <div className="mx-auto h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 shadow-lg border border-white/10">
                            <img src="/evoke.svg" className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-light text-white mb-2 gradient-text">
                            Welcome Back
                        </h2>
                        <p className="text-white/60 text-sm font-light">
                            Sign in to continue to Evoke AI
                        </p>
                    </div>

                    {error && (
                        <Alert
                            variant="destructive"
                            className="mt-6 bg-red-950/30 border-red-800/30 backdrop-blur-sm">
                            <AlertDescription className="text-red-300">{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="mt-8">
                        <Button
                            onClick={() => handleGoogleSignIn()}
                            disabled={isLoading}
                            className="group relative w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 rounded-xl py-4 px-6 font-light transition-all duration-300 transform hover:scale-[1.02] backdrop-blur-sm disabled:opacity-50 disabled:hover:scale-100">
                            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <Loader2 className="animate-spin mr-3 h-5 w-5 text-white" />
                                    <span className="text-white">Signing in...</span>
                                </div>
                            ) : (
                                <div className="flex items-center font-light justify-center">
                                    <svg className="w-5 h-5 mr-3 text-white" viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    <span className="text-white font-light text-md">
                                        Continue with Google
                                    </span>
                                </div>
                            )}
                        </Button>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-white/40 font-light">
                            By continuing, you agree to our{" "}
                            <span className="text-white/60 hover:text-white cursor-pointer transition-colors">
                                Terms of Service
                            </span>{" "}
                            and{" "}
                            <span className="text-white/60 hover:text-white cursor-pointer transition-colors">
                                Privacy Policy
                            </span>
                        </p>
                    </div>
                </div>

                {/* Subtle decorative elements */}
                <div className="absolute -top-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
};

export default LoginForm;
