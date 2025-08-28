// Update this page (the content is just a fallback if you fail to update the page)

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Bienvenido a la Prueba Técnica de Armando Rico</h1>
        <p className="text-xl text-muted-foreground">
          Este es un proyecto de prueba técnica para Master Inter.
        </p>
        <Button>
          <Link to="/dashboard">
            Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
