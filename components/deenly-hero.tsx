import { Badge } from "./ui/badge";

export default function DeenlyHero() {
  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Deenly
        </h1>
        <p className="text-xl text-muted-foreground mt-2">
          Die Moschee Khutba App
        </p>
      </div>
      
      <p className="text-2xl lg:text-3xl !leading-tight mx-auto max-w-xl text-center">
        Bleiben Sie informiert über{" "}
        <span className="font-semibold">Khutbas</span>{" "}
        und{" "}
        <span className="font-semibold">Aktivitäten</span>{" "}
        in Moscheen in Ihrer Nähe
      </p>
      
      <div className="flex flex-wrap gap-2 justify-center">
        <Badge variant="outline" className="px-4 py-2 text-base">Freitagspredigten</Badge>
        <Badge variant="outline" className="px-4 py-2 text-base">Vorträge</Badge>
        <Badge variant="outline" className="px-4 py-2 text-base">Gebetszeiten</Badge>
        <Badge variant="outline" className="px-4 py-2 text-base">Veranstaltungen</Badge>
      </div>
      
      <div className="flex gap-4 mt-4">
        <a 
          href="/moscheen" 
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium"
        >
          Moscheen entdecken
        </a>
      </div>
      
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
