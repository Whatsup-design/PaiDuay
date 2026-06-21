import { otopCategories } from "@/app/(main)/otop/data";
import { OtopDataLoader } from "@/components/otop/otop-data-loader";

export const dynamic = "force-dynamic";

export default function OtopPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white px-4 py-5 sm:px-5 lg:px-8 lg:py-6">
      <div className="mx-auto max-w-7xl">
        <OtopDataLoader categories={otopCategories} />
      </div>
    </main>
  );
}
