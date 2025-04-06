"use client";

import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import WorkSection from "../components/WorkSection";

export default function Trabaja() {
  const heroData = {
    title: "Encuentra tu próximo",
    subtitle: "proyecto profesional",
    description: [
      "Conecta con las mejores oportunidades",
      "de trabajo en América Latina.",
    ],
    imageSrc: "/images/work.png",
    buttonText: "Quiero trabajar",
    buttonText2: "Quiero contratar",
  };

  const workCards = [
    {
      imageSrc: "/images/developer.avif",
      title: "Quiero trabajar como",
      role: "DEVELOPER",
      description:
        "Trabaja en startups de Mexico y America Latina por un tiempo determinado, de forma remota o presencial, y con la tecnología que prefieras.",
    },
    {
      imageSrc: "/images/freelancer.png",
      title: "Quiero trabajar como",
      role: "FREELANCER",
      description:
        "Trabaja en proyectos freelance de tu preferencia, de forma remota o presencial, y con la tecnología que prefieras.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HeroSection {...heroData} />
      <WorkSection cards={workCards} />
    </div>
  );
}
