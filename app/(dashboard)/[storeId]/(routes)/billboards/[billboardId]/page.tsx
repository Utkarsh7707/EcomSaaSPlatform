import prismadb from "@/lib/prismadb";
import { BillboardForm } from "./components/Billboard-form";

interface BillBoardPageProps {
  params: Promise<{
    billboardId: string;
  }>;
}

export default async function BillBoardPage({ params }: BillBoardPageProps) {
  const { billboardId } = await params;

  const billboard = await prismadb.billboard.findUnique({
    where: {
      id: billboardId,
    },
  });

  return (
    <div className="flex-1 space-y-4 pt-6 p-8">
      <BillboardForm initialData={billboard} />
    </div>
  );
}