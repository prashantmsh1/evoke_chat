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
        <div className="min-h-screen flex items-center w-screen justify-center bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.1)_1px,_transparent_0)] bg-[length:24px_24px] opacity-20"></div>

            <div className="relative max-w-md w-full space-y-8">
                {/* Dark mode card */}
                <div className="bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center">
                        <div className="mx-auto h-16 w-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                            <img src="/evoke.svg" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                        <p className="text-gray-400 text-sm font-medium">
                            Sign in to continue to Evoke AI
                        </p>
                    </div>

                    {error && (
                        <Alert
                            variant="destructive"
                            className="mt-6 bg-red-950/50 border-red-800/50 backdrop-blur-sm">
                            <AlertDescription className="text-red-300">{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="mt-8">
                        <Button
                            onClick={() => handleGoogleSignIn()}
                            disabled={isLoading}
                            className="group relative w-full bg-white hover:bg-gray-100 text-gray-900 border-0 rounded-xl py-4 px-6 font-medium transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl shadow-lg disabled:opacity-50 disabled:hover:scale-100">
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"></div>

                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <Loader2 className="animate-spin mr-3 h-5 w-5" />
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                <div className="flex items-center font-medium justify-center">
                                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
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
                                    <span className=" font-semibol text-md">
                                        Continue with Google
                                    </span>
                                </div>
                            )}
                        </Button>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-500">
                            By continuing, you agree to our{" "}
                            <span className="text-blue-400 hover:text-blue-300 cursor-pointer transition-colors">
                                Terms of Service
                            </span>{" "}
                            and{" "}
                            <span className="text-blue-400 hover:text-blue-300 cursor-pointer transition-colors">
                                Privacy Policy
                            </span>
                        </p>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
            </div>
        </div>
    );
};

export default LoginForm;
