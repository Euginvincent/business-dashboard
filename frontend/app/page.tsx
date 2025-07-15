export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Business Dashboard</h1>
      <a href="/auth/login" className="text-blue-600 underline">Login</a>
      <a href="/auth/register" className="text-blue-600 underline mt-2">Register</a>
    </div>
  );
}