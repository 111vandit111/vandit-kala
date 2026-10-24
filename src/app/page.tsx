import Image from "next/image";
import { profilesCards } from "../../constants";
import Footer from "../../lib/footer";
import AddProfileTile from "../../lib/AddProfileTile";
import ProfileCards from "../../lib/profileCards";


export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div className="p-2">
      <Image
        src={"/vanditkalaText.png"}
        alt="logo"
        width={100}
        height={100}
        className="rounded-full cursor-pointer invert-100"
      />

      <h1 className="sr-only">Vandit Kala – Software Engineer &amp; Problem Solver</h1>
      <p className="sr-only">
        Portfolio of Vandit Kala, a software engineer building scalable web apps and AI
        integrations with React.js, Next.js, TypeScript, Node.js and MongoDB.
      </p>
      <div className="my-4 w-fit mx-auto text-4xl font-semibold">
        Who&apos;s watching?
      </div>

      <div className="flex gap-24 gap-y-8 flex-wrap items-center justify-center">
        {profilesCards.map((card, index) => {
          return (
            <div key={index} className="my-4">
              <ProfileCards {...card } />
            </div>
          );
        })}

        <AddProfileTile />
      </div>
      </div>

      <Footer />
    </div>
  );
}
