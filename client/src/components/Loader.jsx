export default function Loader({ label = "Loading..." }) {
  return (
    <div className="grid place-items-center py-16">
      <div className="relative h-9 w-9">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-gray-200 border-t-blue-500" />
      </div>
      <p className="mt-4 text-sm font-medium text-gray-500">{label}</p>
    </div>
  );
}
