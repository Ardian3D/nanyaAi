import Spinner from "@/components/Spinner";

const Loading = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="flex flex-col items-center gap-4">
      <Spinner size={32} />
      <p className="text-light-100">Memuat...</p>
    </div>
  </div>
);

export default Loading;
