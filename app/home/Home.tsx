/**
 * v0 by Vercel.
 * @see https://v0.dev/t/DTwJVR7SvSk
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-gray-900 text-white py-4 px-6 md:px-12 flex items-center justify-between">
                <Link href="#">
                    <div className="flex items-center gap-2">
                        <HomeIcon className="h-6 w-6" />
                        <span className="text-xl font-semibold">ForHosts</span>
                    </div>
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                    <Link className="hover:underline" href="#">
                        Features
                    </Link>
                    <Link className="hover:underline" href="#">
                        Pricing
                    </Link>
                    <Link className="hover:underline" href="#">
                        Testimonials
                    </Link>
                    <Link className="hover:underline" href="#">
                        Contact
                    </Link>
                    <Button variant="secondary">Sign Up</Button>
                </nav>
                <Button className="md:hidden" size="icon" variant="outline">
                    <MenuIcon className="h-6 w-6" />
                </Button>
            </header>
            <main className="flex-1">
                <section className="bg-gray-900 text-white py-2 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-lg space-y-4">
                        <h1 className="text-3xl font-bold">Take Control of Your Short-Term Rental Business</h1>
                        <p className="text-md">
                            ForHosts empowers you to create your own branded website for direct bookings, with lower fees, payment
                            control, and detailed analytics.
                        </p>
                        <div className="flex gap-4">
                            <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg">Get Started</Button>
                            {/* <Link className="text-gray-400 hover:text-gray-300" href="#">
                                Learn More
                            </Link> */}
                        </div>
                    </div>
                    <img
                        alt="ForHosts"
                        className="rounded-lg shadow-lg"
                        height={300}
                        src="/placeholder.svg"
                        style={{
                            aspectRatio: "600/400",
                            objectFit: "cover",
                        }}
                        width={450}
                    />
                </section>
                <section className="bg-white py-2 px-6 md:px-12" id="features">
                    <div className="max-w-5xl mx-auto space-y-12">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl font-bold">Key Features</h2>
                            <p className="text-gray-500 text-lg">Streamline your short-term rental business with ForHosts.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 space-y-4">
                                <WalletIcon className="h-10 w-10 text-primary" />
                                <h3 className="text-xl font-semibold">Lower Fees</h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Avoid the high commissions of third-party platforms and keep more of your earnings.
                                </p>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 space-y-4">
                                <CreditCardIcon className="h-10 w-10 text-primary" />
                                <h3 className="text-xl font-semibold">Payment Control</h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Manage your payments through Stripe Connect and have full control over your finances.
                                </p>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 space-y-4">
                                <BrushIcon className="h-10 w-10 text-primary" />
                                <h3 className="text-xl font-semibold">Customization</h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Personalize your website with your own branding and design to create a unique guest experience.
                                </p>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 space-y-4">
                                <BarChartIcon className="h-10 w-10 text-primary" />
                                <h3 className="text-xl font-semibold">Analytics</h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Gain valuable insights into your business with detailed performance analytics.
                                </p>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 space-y-4">
                                <BadgeIcon className="h-10 w-10 text-primary" />
                                <h3 className="text-xl font-semibold">Guest Loyalty</h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Retain and engage your guests with loyalty programs, discounts, and marketing tools.
                                </p>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 space-y-4">
                                <FolderSyncIcon className="h-10 w-10 text-primary" />
                                <h3 className="text-xl font-semibold">Seamless Integration</h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Easily integrate your ForHosts website with platforms like Airbnb and VRBO to prevent double bookings.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                    <div className="relative items-center w-full mx-auto md:px-12 lg:px-16 max-w-7xl">
                        <div className="max-w-2xl px-4 py-24 mx-auto sm:px-6 lg:px-8">
                            <div className="justify-center mx-auto space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:mx-auto xl:max-w-2xl xl:mx-0 xl:grid-cols-2">
                                <div className="bg-gray-50 rounded-xl">
                                    <div className="p-6 text-center">
                                        <h2 className="text-lg font-medium leading-6 text-neutral-600">Starter</h2>
                                        <p className="mt-8 text-4xl">
                                            <span className="font-black text-blue-600 uppercase">Free</span>
                                            <span className="font-medium text-gray-500">/mo</span>
                                        </p>
                                        <span className="text-xs text-neutral-600">4.5% booking fee</span>
                                        <ul className="mt-4 space-y-2 text-left list-disc list-inside">
                                            <li>Unlimited Listings</li>
                                            <li>Guest Messaging</li>
                                            <li>Email support within 48 hours</li>
                                        </ul>
                                        <div className="mt-6">
                                            <a href="#" className="flex items-center justify-center w-full px-10 py-4 text-base font-medium text-center text-white transition duration-500 ease-in-out transform bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Get Started</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl">
                                    <div className="p-6 text-center">
                                        <h2 className="text-lg font-medium leading-6 text-neutral-600">Professional</h2>
                                        <p className="mt-8 text-4xl">
                                            <span className="font-black text-gray-500 uppercase">$25</span>
                                            <span className="font-medium text-gray-500">/mo</span>
                                        </p>
                                        <span className="text-xs text-neutral-600">0% booking fee</span>
                                        <ul className="mt-4 space-y-2 text-left list-disc list-inside">
                                            <li>Advanced Site Analytics</li>
                                            <li>24/7 Live Support</li>
                                            <li>Marketing tools</li>
                                            <li>Custom Website Builder</li>
                                        </ul>
                                        <div className="mt-6">
                                            <button className="w-full items-center block px-10 py-3.5 text-base font-medium text-center text-blue-600 transition duration-500 ease-in-out transform border-2 border-white shadow-md rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-not-allowed opacity-50" disabled>Coming Soon</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-white py-2 px-6 md:px-12" id="testimonials">
                    <div className="max-w-5xl mx-auto space-y-12">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl font-bold">What Our Hosts Say</h2>
                            <p className="text-gray-500 text-lg">Hear from real short-term rental owners who use ForHosts.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <Card>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-4 mt-2">
                                        <Avatar>
                                            <AvatarImage alt="John Doe" src="/avatar-1.jpg" />
                                            <AvatarFallback>JD</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-semibold">John Doe</h3>
                                            <p className="text-gray-500 dark:text-gray-400">Superhost, Airbnb</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        &ldquo;ForHosts has been a game-changer for my short-term rental business. The lower fees and payment
                                        control have made a huge difference to my bottom line.&ldquo;
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-4 mt-2">
                                        <Avatar>
                                            <AvatarImage alt="Jane Smith" src="/avatar-2.jpg" />
                                            <AvatarFallback>JS</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-semibold">Jane Smith</h3>
                                            <p className="text-gray-500 dark:text-gray-400">Superhost, VRBO</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        &ldquo;The customization options on ForHosts have allowed me to create a truly unique and branded
                                        experience for my guests. It has been a game-changer for my business.&ldquo;
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-4 mt-2">
                                        <Avatar>
                                            <AvatarImage alt="Michael Johnson" src="/avatar-3.jpg" />
                                            <AvatarFallback>MJ</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-semibold">Michael Johnson</h3>
                                            <p className="text-gray-500 dark:text-gray-400">Superhost, Airbnb</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        &ldquo;The analytics and marketing tools on ForHosts have been invaluable in helping me understand my
                                        guests and optimize my business. It is a must-have for any short-term rental owner.&ldquo;
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
                <section className="bg-gray-100 dark:bg-gray-800 py-20 px-6 md:px-12" id="contact">
                    <div className="max-w-5xl mx-auto space-y-12">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl font-bold">Get in Touch</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-lg">
                                Have questions or need help getting started? Contact us today.
                            </p>
                        </div>
                        <form className="bg-white dark:bg-gray-950 rounded-lg p-8 space-y-6 shadow-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                </div>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
        </div>
    )
}

function BadgeIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
        </svg>
    )
}


function BarChartIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="12" x2="12" y1="20" y2="10" />
            <line x1="18" x2="18" y1="20" y2="4" />
            <line x1="6" x2="6" y1="20" y2="16" />
        </svg>
    )
}


function BrushIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
            <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
        </svg>
    )
}


function CheckIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    )
}


function CreditCardIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
        </svg>
    )
}


function FolderSyncIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v1" />
            <path d="M12 10v4h4" />
            <path d="m12 14 1.5-1.5c.9-.9 2.2-1.5 3.5-1.5s2.6.6 3.5 1.5c.4.4.8 1 1 1.5" />
            <path d="M22 22v-4h-4" />
            <path d="m22 18-1.5 1.5c-.9.9-2.1 1.5-3.5 1.5s-2.6-.6-3.5-1.5c-.4-.4-.8-1-1-1.5" />
        </svg>
    )
}


function HomeIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    )
}


function MenuIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
    )
}


function WalletIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
            <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
        </svg>
    )
}