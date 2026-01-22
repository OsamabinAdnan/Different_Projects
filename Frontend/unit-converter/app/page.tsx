import UnitConverter from "@/components/Unit-Converter";
import Image from "next/image";
import bgImage from '../public/bg.jpeg'

export default function Home() {

    return (
        <main className="relative min-h-screen ">
            <Image src={bgImage} alt="background" fill className="object-cover" />
            <div className="relative z-10">
                <UnitConverter /> 
            </div>
        </main>
    );
}