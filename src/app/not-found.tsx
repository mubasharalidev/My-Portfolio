import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main id="main" className="relative grid min-h-[100svh] place-items-center overflow-hidden">
      <div aria-hidden className="absolute inset-0 grid-field fade-edges opacity-60" />
      <div className="shell relative text-center">
        <p className="label text-cyan">Error 404 · Route not found</p>
        <h1 className="display mt-6 text-[clamp(5rem,22vw,16rem)] text-outline">404</h1>
        <p className="mx-auto mt-6 max-w-md text-mist">This node isn’t connected to anything. Let’s get you back into the system.</p>
        <div className="mt-10 flex justify-center">
          <Button href="/" icon={<ArrowLeft className="size-4" />}>
            Return home
          </Button>
        </div>
      </div>
    </main>
  );
}
