import { VerticalFeatureRow } from "./vertical-feature-row";
import { Section } from "./Section"
import ThirdPartyLogos from "./third-party-logos";
const VerticalFeatures = () => (
  <section className="bg-white dark:bg-gray-900 mb-12">
    <div className="container px-6 py-10 mx-auto">
      <div className="lg:flex lg:items-center">
        <div className="w-full space-y-12 lg:w-1/2 ">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 capitalize lg:text-3xl dark:text-white">Deploy as many websites with as many listings as you want. No extra charge.</h1>
            <div className="mt-2">
              <span className="inline-block w-40 h-1 bg-blue-500 rounded-full"></span>
            </div>
          </div>

          <div className="md:flex md:items-start md:-mx-4">
            <span className="inline-block p-2 text-blue-500 bg-blue-100 rounded-xl md:mx-4 dark:text-white dark:bg-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </span>

            <div className="mt-4 md:mx-4 md:mt-0">
              <h1 className="text-xl font-semibold text-gray-700 capitalize dark:text-white">Bring your domain(s) or use ours.</h1>

              <p className="mt-3 text-gray-500 dark:text-gray-300">
                By default when you create a website, you will get your own subdomain of ours (example.forhosts.com) fully customizable by you, or you can bring your own domain name.
              </p>
            </div>
          </div>

          <div className="md:flex md:items-start md:-mx-4">
            <span className="inline-block p-2 text-blue-500 bg-blue-100 rounded-xl md:mx-4 dark:text-white dark:bg-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </span>

            <div className="mt-4 md:mx-4 md:mt-0">
              <h1 className="text-xl font-semibold text-gray-700 capitalize dark:text-white">Completely free for hosts!</h1>

              <p className="mt-3 text-gray-500 dark:text-gray-300">
                Our service is completely free for hosts, we can do this by charging a small 5% fee to the guest.
              </p>
            </div>
          </div>

          <div className="md:flex md:items-start md:-mx-4">
            <span className="inline-block p-2 text-blue-500 bg-blue-100 rounded-xl md:mx-4 dark:text-white dark:bg-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
              </svg>
            </span>

            <div className="mt-4 md:mx-4 md:mt-0">
              <h1 className="text-xl font-semibold text-gray-700 capitalize dark:text-white">User Friendly Interface</h1>

              <p className="mt-3 text-gray-500 dark:text-gray-300">
                Our tool was built with the user in mind. Thats why we kept things simple and familiar to what hosts are used to.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex lg:items-center lg:w-1/2 lg:justify-center">
          <img className="w-[28rem] h-[28rem] object-cover xl:w-[34rem] xl:h-[34rem] rounded-full" src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=755&q=80" alt="" />
        </div>
      </div>
    </div>
  </section>
);

export { VerticalFeatures };