import Image from "next/image";

export default function UnderDevelopment() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 text-center dark:bg-gray-800">
      <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-gray-100">
        Under Development
      </h1>
      <p className="mb-6 text-xl text-gray-600 dark:text-gray-300">
        Our website is currently under development. Thank you for your patience
        as we work to improve your experience.
      </p>
      <div className="animate-pulse">
        <Image
          alt="Under construction icon"
          className="mx-auto"
          height="200"
          src="/ForHostsLogoWithoutSlug.svg"
          style={{
            objectFit: "cover",
          }}
          width="200"
        />
      </div>
    </div>
  );
}
