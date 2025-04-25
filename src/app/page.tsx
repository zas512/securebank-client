import Link from "next/link";
import { Shield, CreditCard, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Shield className="h-6 w-6" />
            <span>SecureBank</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link href="#features" className="text-sm font-medium underline-offset-4 hover:underline">
              Features
            </Link>
            <Link href="#security" className="text-sm font-medium underline-offset-4 hover:underline">
              Security
            </Link>
            <Link href="#about" className="text-sm font-medium underline-offset-4 hover:underline">
              About
            </Link>
          </nav>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full bg-gray-50 py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Secure Banking for Everyone
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Experience banking with enhanced security features, easy account management, and seamless
                  transactions.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg">Get Started</Button>
                  </Link>
                  <Link href="#features">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative flex aspect-video w-full max-w-[500px] items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100">
                  <Shield className="h-24 w-24 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our banking system provides everything you need for secure financial management.
                </p>
              </div>
            </div>
            <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <Shield className="h-12 w-12 text-blue-600" />
                <h3 className="text-xl font-bold">Secure Authentication</h3>
                <p className="text-center text-sm text-gray-500">
                  Multi-factor authentication with secure PIN for enhanced security.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <CreditCard className="h-12 w-12 text-blue-600" />
                <h3 className="text-xl font-bold">Account Management</h3>
                <p className="text-center text-sm text-gray-500">
                  Easily manage multiple accounts and track your finances.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <BarChart3 className="h-12 w-12 text-blue-600" />
                <h3 className="text-xl font-bold">Secure Transactions</h3>
                <p className="text-center text-sm text-gray-500">
                  Transfer funds and pay bills with confidence and security.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="security" className="w-full bg-gray-50 py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Security First</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We prioritize the security of your financial data with industry-leading practices.
                </p>
              </div>
            </div>
            <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-12">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Data Encryption</h3>
                <p className="text-gray-500">
                  All your data is encrypted using industry-standard protocols to ensure maximum security.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Secure PIN</h3>
                <p className="text-gray-500">
                  Your PIN is securely hashed and stored, never visible to anyone, including our staff.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Fraud Detection</h3>
                <p className="text-gray-500">
                  Advanced algorithms monitor transactions to detect and prevent fraudulent activities.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Regular Audits</h3>
                <p className="text-gray-500">
                  Our systems undergo regular security audits to identify and address potential vulnerabilities.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-white">
        <div className="container flex flex-col gap-4 px-4 py-10 md:flex-row md:gap-8 md:px-6 md:py-12">
          <div className="flex flex-col gap-2 md:flex-1 md:gap-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <Shield className="h-6 w-6" />
              <span>SecureBank</span>
            </Link>
            <p className="text-sm text-gray-500">
              Secure banking solutions for everyone. © 2025 SecureBank. All rights reserved.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:flex-1">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-500 hover:underline">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:underline">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:underline">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Help</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-500 hover:underline">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:underline">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:underline">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-500 hover:underline">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:underline">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:underline">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
