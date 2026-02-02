import { useEffect } from "react";

export default function Apoiar() {
  useEffect(() => {
    // Redirecionar automaticamente para a página de apoio
    window.location.href = "https://livepix.gg/oyh";
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mb-4 inline-flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground">Redirecionando para página de apoio...</p>
      </div>
    </div>
  );
}
