import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div className="min-h-screen bg-amber-50 text-gray-900">
      {/* USE COMMON NAVBAR */}
      <Navbar />

      <main>
        {/* HERO + FEATURES SECTION - SIDE BY SIDE */}
        <section className="py-16 sm:py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              {/* HERO SECTION - LEFT HALF */}
              <div>
                <div className="mb-6 inline-block rounded-full bg-amber-100 px-4 py-1 text-xs sm:text-sm font-semibold text-amber-800">
                  ✨ Cloud Storage Simplified
                </div>

                <h1 className="mb-6 text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-amber-950">
                  Organize Your Digital
                  <br />
                  <span className="text-amber-700">Workspace</span>
                </h1>

                <p className="mb-8 text-base sm:text-lg text-gray-700 leading-relaxed">
                  Store files, organize folders, and keep your workspace clean
                  with a minimal interface designed for speed, clarity, and
                  security.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <Link
                    to="/signup"
                    className="rounded-lg bg-linear-to-r from-amber-700 to-amber-900 px-6 sm:px-8 py-3 text-center text-sm sm:text-base font-semibold text-white transition-all hover:shadow-lg hover:shadow-amber-700/40"
                  >
                    Start Free Today
                  </Link>
                  <Link
                    to="/login"
                    className="rounded-lg border-2 border-amber-300 bg-white px-6 sm:px-8 py-3 text-center text-sm sm:text-base font-semibold text-amber-900 transition-all hover:border-amber-400 hover:bg-amber-50"
                  >
                    Already have an account?
                  </Link>
                </div>
              </div>

              {/* FEATURES SECTION - RIGHT HALF */}
              <div>
                <div className="mb-8">
                  <h2 className="mb-2 text-2xl sm:text-3xl font-bold text-amber-950">
                    Powerful Features
                  </h2>
                  <p className="text-sm sm:text-base text-gray-700">
                    Everything you need in one place
                  </p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {[
                    {
                      icon: "📁",
                      title: "Organized Workspaces",
                      desc: "Create clean folder structures effortlessly.",
                    },
                    {
                      icon: "⚡",
                      title: "Lightning Fast Access",
                      desc: "Find and manage content with speed.",
                    },
                    {
                      icon: "📸",
                      title: "Image Uploading",
                      desc: "Seamlessly upload and organize images.",
                    },
                    {
                      icon: "🔒",
                      title: "Secure & Private",
                      desc: "Enterprise-grade security standards.",
                    },
                  ].map((feature) => (
                    <div
                      key={feature.title}
                      className="flex gap-4 rounded-xl border border-amber-200 bg-white p-4 transition-all hover:border-amber-300 hover:shadow-md"
                    >
                      <div className="shrink-0 text-xl sm:text-2xl">
                        {feature.icon}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-amber-950 text-sm sm:text-base">
                          {feature.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section className="bg-white py-16 sm:py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 sm:mb-16 text-center">
              <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-amber-950">
                Have Questions?
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-700">
                Get in touch with our support team
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: "📧",
                  title: "Email Support",
                  contact: "support@dobbydrive.com",
                },
                {
                  icon: "💬",
                  title: "Live Chat",
                  contact: "Available 24/7",
                },
                {
                  icon: "📞",
                  title: "Phone",
                  contact: "+1 (555) 123-4567",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-amber-200 bg-amber-50 p-6 sm:p-8 text-center transition-all hover:shadow-md"
                >
                  <div className="mb-4 text-3xl sm:text-4xl">{item.icon}</div>
                  <h3 className="mb-2 text-base sm:text-lg font-semibold text-amber-950">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 break-all">
                    {item.contact}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* MINIMAL FOOTER */}
      <footer className="border-t border-amber-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 sm:py-8 text-center">
          <p className="mb-2 text-xs sm:text-sm text-gray-600">
            &copy; 2026 Dobby Drive. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Built with React • Tailwind CSS • Node.js • MongoDB
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
