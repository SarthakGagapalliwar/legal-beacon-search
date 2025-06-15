
import Header from "@/components/Header";
import UploadCase from "@/components/UploadCase";

const Upload = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-slate-800">Upload New Case</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Contribute to our legal database by uploading new case law. Help fellow legal professionals access comprehensive case information.
            </p>
          </div>
          
          <UploadCase />
        </div>
      </main>
    </div>
  );
};

export default Upload;
