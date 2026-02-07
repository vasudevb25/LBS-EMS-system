import Loader from "./loader";

export default function LoaderOverlay() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center animate-in fade-in duration-200">
      {/* Blur + dim background */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />

      {/* Loader on top */}
      <div className="relative z-10">
        <Loader />
      </div>
    </div>
  );
}
