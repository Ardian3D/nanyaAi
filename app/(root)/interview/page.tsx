import GenerateForm from "@/components/GenerateForm";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <>
      <h3>Buat Pertanyaan Wawancara</h3>

      <p className="text-light-100 mt-2">
        Isi detail di bawah ini dan AI kami akan membuat pertanyaan wawancara
        yang dipersonalisasi untuk kamu.
      </p>

      <GenerateForm userId={user?.id} />
    </>
  );
};

export default Page;
