import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 text-white flex flex-col">
            {/* Navigation */}
            <nav className="bg-white/10 backdrop-blur-md fixed w-full z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="font-bold text-xl">Music Bot</Link>
                        <div>
                            <Link href="/sign-in" className="text-gray-300 hover:bg-white/20 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                            <Link href="/sign-up" className="bg-purple-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-600 ml-2">Sign Up</Link>
                        </div>
                    </div>
                </div>
            </nav>
            
            {/* Sign In Content */}
            <div className="flex-grow flex items-center justify-center pt-20 pb-10">
                <div className="max-w-md w-full px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-extrabold text-center mb-6">Sign In</h1>
                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 flex justify-center">
                        <SignIn />
                    </div>
                </div>
            </div>
        </div>
    );
}