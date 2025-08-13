import React from "react";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {year} Associazione Artistico Culturale Eventi. Tutti i diritti riservati.
          </p>
          <address className="not-italic text-sm text-muted-foreground text-center md:text-right">
            Sede legale: Via Enzo Misefari, 16, Reggio Calabria
          </address>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
