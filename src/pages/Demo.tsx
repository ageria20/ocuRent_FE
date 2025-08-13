import Layout from "@/components/layout/Layout";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

const Demo = () => {
  useEffect(() => {
    document.title = "Demo VR 360 | VR Tours";
    const desc = document.querySelector('meta[name="description"]');
    const content = "Guarda una demo VR 360 e scopri l'esperienza immersiva di VR Tours.";
    if (desc) desc.setAttribute("content", content);
  }, []);

  return (
    <Layout>
      <header className="sr-only">
        <h1>Demo VR 360</h1>
        <link rel="canonical" href={window.location.href} />
      </header>

      <section className="container mx-auto px-4 py-10">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">Guarda la Demo</h2>
          <p className="text-muted-foreground">Un assaggio delle nostre esperienze immersive.</p>
        </div>

        <Card className="vr-glass border-white/10">
          <CardContent className="p-0">
            <div className="aspect-video w-full">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/1bhUWrJZ3Hg"
                title="Demo VR 360"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
};

export default Demo;
