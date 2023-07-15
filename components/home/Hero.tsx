import Link from "next/link";
import Image from "next/image";
import { Quicksand } from 'next/font/google'

const quicksand = Quicksand({
  weight: '700',
  subsets: ['latin'],
})
const quicksand2 = Quicksand({
  weight: '400',
  subsets: ['latin'],
})
const Hero: React.FC = () => {
  return (
    <div className="h-[600px] bg-gray-300 flex items-center justify-center">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-center">
        <div className="text-center w-full md:w-1/2">
          <h2 className="font-bold text-4xl text-gray-800 md:text-5xl">Direct Booking Made Simple.</h2>

          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">ForHosts is the simplest way for short term rental owners to create a fully functional direct booking website without any technical skills required.</p>
          <Link href="/get-started">
            <button className={`${quicksand
              .className} mt-4 px-10 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-500 ease-in-out transform hover:scale-105`}>



              Get Started

            </button>
          </Link>
        </div>
        <div className="hidden md:flex md:w-1/2 justify-center">
          <Image src="/heroHome2.svg" alt="Home" width={400} height={200} />
        </div>
      </div>
    </div>
  );
};

export default Hero;
