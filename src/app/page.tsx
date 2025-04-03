import Image from "next/image";
import { profilesCards } from "../../constants";
import ProfileCards from "../../lib/profileCards";
import Footer from "../../lib/footer";

export default function Home() {
  return (
    <div className="p-2 bg-secondary-900 relative min-h-screen">
      <Image
        src={"/vanditkalaText.png"}
        alt="logo"
        width={100}
        height={50}
        className="rounded-full cursor-pointer invert-100"
      />

      <div className="my-4 w-fit mx-auto text-4xl font-semibold">
        Who&apos;s watching?
      </div>

      <div className="flex gap-24 flex-wrap items-center justify-center">
        {profilesCards.map((card, index) => {
          return (
            <div key={index} className="my-4">
              <ProfileCards {...card} />
            </div>
          );
        })}

        <div className="group flex flex-col gap-4 xs:mb-4 cursor-pointer">
          <div className="rounded-full w-[200px] bg-alert-purple-light/90 text-7xl font-bold h-[200px] flex text-secondary-400 items-center justify-center object-cover group-hover:border-2 border-white">
             +
          </div>
        <div className="flex gap-2 items-center justify-center max-w-[200px]">
        <p className="text-lg text-center font-bold text-secondary-400 group-hover:text-primary-25">
          Add New
        </p>
      </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
