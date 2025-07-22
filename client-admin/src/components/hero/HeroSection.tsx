import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AnimatedText } from "@/components/ui/animated-text";

export default function HeroSection() {
  return (
    <section className="pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          <div className="lg:col-span-6 mb-12 lg:mb-0">
            <AnimatedText
              text="Build Your Perfect Professional Resume in Minutes"
              tag="h1"
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
              animation="fadeInUp"
              delay={0.2}
              staggerChildren
              highlightWords={["Professional", "Resume"]}
              highlightClass="text-primary"
            />
            <p className="mt-6 text-xl text-muted-foreground max-w-3xl animate-fade-in-delay-100">
              Create stunning, ATS-friendly resumes that help you stand out from
              the competition. Simply fill in your details and watch your
              professional resume take shape.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-fade-in-delay-200">
              <Link href="/package-selection">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  Create Your Resume
                </Button>
              </Link>
              <Link href="/templates">
                <Button size="lg" variant="outline">
                  Browse Templates
                </Button>
              </Link>
            </div>
            <div className="mt-8 animate-fade-in-delay-300">
              <p className="text-sm text-muted-foreground">
                Trusted by job-seekers from companies like:
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-6">
                <svg
                  className="h-8 opacity-60"
                  viewBox="0 0 120 30"
                  fill="currentColor"
                >
                  <path d="M39.7,15.9v9.2h-4.7V0h10.3c2.6,0,4.8,0.9,6.5,2.6c1.7,1.7,2.6,3.9,2.6,6.4c0,2.6-0.9,4.7-2.6,6.4c-1.7,1.7-3.9,2.6-6.5,2.6H39.7z M39.7,11.8h5.6c1.3,0,2.4-0.5,3.3-1.4c0.9-0.9,1.3-2,1.3-3.3c0-1.4-0.4-2.5-1.3-3.4C47.7,2.8,46.6,2.4,45.3,2.4h-5.6V11.8z" />
                  <path d="M56.3,21.4c-1.7-1.7-2.6-3.9-2.6-6.4c0-2.6,0.9-4.7,2.6-6.4c1.7-1.7,3.9-2.6,6.5-2.6c2.6,0,4.8,0.9,6.5,2.6c1.7,1.7,2.6,3.9,2.6,6.4c0,2.6-0.9,4.7-2.6,6.4c-1.7,1.7-3.9,2.6-6.5,2.6C60.2,24,58,23.1,56.3,21.4z M67.4,18.5c1.1-1.1,1.6-2.4,1.6-3.9c0-1.6-0.5-2.9-1.6-4c-1.1-1.1-2.4-1.6-3.9-1.6c-1.6,0-2.9,0.5-4,1.6c-1.1,1.1-1.6,2.4-1.6,4c0,1.6,0.5,2.9,1.6,3.9c1.1,1.1,2.4,1.6,4,1.6C65,20.1,66.3,19.6,67.4,18.5z" />
                  <path d="M84.9,6v19.1h-4.7V6h-6.4V1.3h17.5V6H84.9z" />
                </svg>
                <svg
                  className="h-8 opacity-60"
                  viewBox="0 0 120 30"
                  fill="currentColor"
                >
                  <path d="M35.6,18.5l5.7-9.3h3.1L37,20.8v4.4h-2.8v-4.4l-7.4-11.6h3.1L35.6,18.5z" />
                  <path d="M45.9,15.2c0-1.3,0.2-2.5,0.7-3.6c0.5-1.1,1.1-2,2-2.8c0.8-0.8,1.8-1.4,2.9-1.8c1.1-0.4,2.3-0.6,3.6-0.6c1.3,0,2.5,0.2,3.6,0.6c1.1,0.4,2.1,1,2.9,1.8c0.8,0.8,1.5,1.7,2,2.8c0.5,1.1,0.7,2.3,0.7,3.6c0,1.3-0.2,2.5-0.7,3.6c-0.5,1.1-1.1,2-2,2.8c-0.8,0.8-1.8,1.4-2.9,1.8c-1.1,0.4-2.3,0.6-3.6,0.6c-1.3,0-2.5-0.2-3.6-0.6c-1.1-0.4-2.1-1-2.9-1.8c-0.8-0.8-1.5-1.7-2-2.8C46.2,17.7,45.9,16.5,45.9,15.2z M48.7,15.2c0,0.9,0.2,1.8,0.5,2.6c0.3,0.8,0.8,1.5,1.3,2.1c0.6,0.6,1.3,1,2.1,1.4c0.8,0.3,1.7,0.5,2.7,0.5c1,0,1.9-0.2,2.7-0.5c0.8-0.3,1.5-0.8,2.1-1.4c0.6-0.6,1-1.3,1.3-2.1c0.3-0.8,0.5-1.7,0.5-2.6c0-0.9-0.2-1.8-0.5-2.6c-0.3-0.8-0.8-1.5-1.3-2.1c-0.6-0.6-1.3-1-2.1-1.4c-0.8-0.3-1.7-0.5-2.7-0.5c-1,0-1.9,0.2-2.7-0.5c-0.8-0.3-1.5-0.8-2.1-1.4c-0.6-0.6-1,1.3-1.3,2.1C48.9,13.4,48.7,14.3,48.7,15.2z" />
                  <path d="M71.5,15.6v9.5h-2.8V6.8h2.8v8.3l8.7-8.3h3.8l-8.9,8.4l9.3,10h-3.9L71.5,15.6z" />
                </svg>
                <svg
                  className="h-8 opacity-60"
                  viewBox="0 0 120 30"
                  fill="currentColor"
                >
                  <path d="M38.3,18.5c0-1.3,0.2-2.5,0.7-3.6c0.5-1.1,1.1-2,2-2.8c0.8-0.8,1.8-1.4,2.9-1.8c1.1-0.4,2.3-0.6,3.6-0.6c1.3,0,2.5,0.2,3.6,0.6c1.1,0.4,2.1,1,2.9,1.8c0.8,0.8,1.5,1.7,2,2.8c0.5,1.1,0.7,2.3,0.7,3.6c0,1.3-0.2,2.5-0.7,3.6c-0.5,1.1-1.1,2-2,2.8c-0.8,0.8-1.8,1.4-2.9,1.8c-1.1,0.4-2.3,0.6-3.6,0.6c-1.3,0-2.5-0.2-3.6-0.6c-1.1-0.4-2.1-1-2.9-1.8c-0.8-0.8-1.5-1.7-2-2.8C38.6,21,38.3,19.8,38.3,18.5z M41.1,18.5c0,0.9,0.2,1.8,0.5,2.6c0.3,0.8,0.8,1.5,1.3,2.1c0.6,0.6,1.3,1,2.1,1.4c0.8,0.3,1.7,0.5,2.7,0.5c1,0,1.9-0.2,2.7-0.5c0.8-0.3,1.5-0.8,2.1-1.4c0.6-0.6,1-1.3,1.3-2.1c0.3-0.8,0.5-1.7,0.5-2.6c0-0.9-0.2-1.8-0.5-2.6c-0.3-0.8-0.8-1.5-1.3-2.1c-0.6-0.6-1.3-1-2.1-1.4c-0.8-0.3-1.7-0.5-2.7-0.5c-1,0-1.9,0.2-2.7-0.5c-0.8-0.3-1.5-0.8-2.1,1.4c-0.6,0.6-1,1.3-1.3,2.1C41.3,16.7,41.1,17.6,41.1,18.5z" />
                  <path d="M61.6,10.1h2.8v15h-2.8V10.1z M60.9,4.5c0-0.5,0.2-0.9,0.5-1.2c0.3-0.3,0.7-0.5,1.2-0.5c0.5,0,0.9,0.2,1.2,0.5c0.3,0.3,0.5,0.7,0.5,1.2c0,0.5-0.2,0.9-0.5,1.2c-0.3,0.3-0.7,0.5-1.2,0.5c-0.5,0-0.9-0.2-1.2-0.5C61.1,5.4,60.9,5,60.9,4.5z" />
                  <path d="M77.1,9.7c1.4,0,2.6,0.2,3.7,0.6c1,0.4,1.9,1,2.6,1.7c0.7,0.7,1.2,1.6,1.5,2.6c0.3,1,0.5,2.1,0.5,3.3v7.1h-2.7v-1.6c-0.7,0.7-1.5,1.3-2.6,1.6c-1,0.4-2.2,0.6-3.4,0.6c-1.2,0-2.3-0.1-3.3-0.4c-1-0.3-1.8-0.7-2.5-1.3c-0.7-0.5-1.2-1.2-1.6-2c-0.4-0.8-0.6-1.7-0.6-2.6c0-1,0.2-1.8,0.5-2.6c0.4-0.8,0.9-1.4,1.5-1.9c0.7-0.5,1.5-0.9,2.4-1.2c0.9-0.3,1.9-0.4,3-0.4h6v-0.3c0-1.4-0.5-2.5-1.5-3.3c-1-0.8-2.3-1.2-4.1-1.2c-1.2,0-2.3,0.2-3.4,0.6c-1.1,0.4-2,1-2.7,1.7l-1.4-2c1-0.9,2.2-1.7,3.5-2.2C73.9,10,75.4,9.7,77.1,9.7z M76.9,22.8c1,0,1.9-0.1,2.7-0.4c0.8-0.3,1.4-0.7,2-1.2c0.5-0.5,0.9-1.1,1.2-1.8c0.3-0.7,0.4-1.4,0.4-2.2v-0.3h-5.8c-1.6,0-2.8,0.3-3.7,0.9c-0.9,0.6-1.3,1.4-1.3,2.4c0,0.5,0.1,1,0.3,1.4c0.2,0.4,0.5,0.8,0.9,1.1c0.4,0.3,0.9,0.5,1.4,0.7C75.7,22.7,76.3,22.8,76.9,22.8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="lg:col-span-6 relative animate-fade-in-delay-200">
            {/* Resume preview */}
            <div className="relative bg-white shadow-xl rounded-2xl overflow-hidden border border-border transform transition-transform duration-500 hover:scale-[1.02] hover:shadow-2xl">
              <svg viewBox="0 0 800 1120" className="w-full h-auto">
                <rect x="0" y="0" width="800" height="1120" fill="#f8fafc" />
                <rect x="0" y="0" width="230" height="1120" fill="#1e3a8a" />

                {/* Header section */}
                <rect
                  x="260"
                  y="50"
                  width="500"
                  height="60"
                  fill="#1e40af"
                  fillOpacity="0.1"
                  rx="4"
                />
                <rect x="260" y="130" width="500" height="2" fill="#e2e8f0" />

                {/* Left sidebar content */}
                <circle cx="115" cy="120" r="70" fill="#e2e8f0" />
                <rect
                  x="35"
                  y="220"
                  width="160"
                  height="14"
                  fill="#e2e8f0"
                  rx="2"
                />
                <rect
                  x="35"
                  y="244"
                  width="100"
                  height="10"
                  fill="#bfdbfe"
                  rx="2"
                />
                <rect
                  x="35"
                  y="264"
                  width="160"
                  height="10"
                  fill="#bfdbfe"
                  rx="2"
                />
                <rect
                  x="35"
                  y="284"
                  width="130"
                  height="10"
                  fill="#bfdbfe"
                  rx="2"
                />

                <rect
                  x="35"
                  y="334"
                  width="160"
                  height="14"
                  fill="#e2e8f0"
                  rx="2"
                />
                <rect
                  x="35"
                  y="358"
                  width="160"
                  height="80"
                  fill="#bfdbfe"
                  fillOpacity="0.3"
                  rx="2"
                />

                <rect
                  x="35"
                  y="468"
                  width="160"
                  height="14"
                  fill="#e2e8f0"
                  rx="2"
                />
                <rect
                  x="35"
                  y="492"
                  width="70"
                  height="10"
                  fill="#bfdbfe"
                  rx="2"
                />
                <rect
                  x="35"
                  y="512"
                  width="90"
                  height="10"
                  fill="#bfdbfe"
                  rx="2"
                />
                <rect
                  x="35"
                  y="532"
                  width="100"
                  height="10"
                  fill="#bfdbfe"
                  rx="2"
                />
                <rect
                  x="35"
                  y="552"
                  width="80"
                  height="10"
                  fill="#bfdbfe"
                  rx="2"
                />

                <rect
                  x="35"
                  y="602"
                  width="160"
                  height="14"
                  fill="#e2e8f0"
                  rx="2"
                />
                <rect
                  x="35"
                  y="626"
                  width="70"
                  height="10"
                  fill="#bfdbfe"
                  rx="2"
                />
                <rect
                  x="35"
                  y="646"
                  width="90"
                  height="10"
                  fill="#bfdbfe"
                  rx="2"
                />
                <rect
                  x="35"
                  y="666"
                  width="100"
                  height="10"
                  fill="#bfdbfe"
                  rx="2"
                />

                {/* Main content sections */}
                <rect
                  x="260"
                  y="180"
                  width="500"
                  height="30"
                  fill="#1e3a8a"
                  fillOpacity="0.1"
                  rx="4"
                />
                <rect
                  x="260"
                  y="220"
                  width="500"
                  height="12"
                  fill="#94a3b8"
                  rx="2"
                />
                <rect
                  x="260"
                  y="242"
                  width="460"
                  height="12"
                  fill="#94a3b8"
                  rx="2"
                />
                <rect
                  x="260"
                  y="264"
                  width="480"
                  height="12"
                  fill="#94a3b8"
                  rx="2"
                />

                <rect
                  x="260"
                  y="310"
                  width="200"
                  height="20"
                  fill="#1e3a8a"
                  fillOpacity="0.1"
                  rx="4"
                />
                <rect
                  x="260"
                  y="340"
                  width="150"
                  height="12"
                  fill="#1e40af"
                  fillOpacity="0.2"
                  rx="2"
                />
                <rect x="260" y="360" width="500" height="2" fill="#e2e8f0" />
                <rect
                  x="260"
                  y="372"
                  width="500"
                  height="12"
                  fill="#94a3b8"
                  rx="2"
                />
                <rect
                  x="260"
                  y="394"
                  width="470"
                  height="12"
                  fill="#94a3b8"
                  rx="2"
                />
                <rect
                  x="260"
                  y="416"
                  width="460"
                  height="12"
                  fill="#94a3b8"
                  rx="2"
                />

                <rect
                  x="260"
                  y="450"
                  width="150"
                  height="12"
                  fill="#1e40af"
                  fillOpacity="0.2"
                  rx="2"
                />
                <rect x="260" y="470" width="500" height="2" fill="#e2e8f0" />
                <rect
                  x="260"
                  y="482"
                  width="500"
                  height="12"
                  fill="#94a3b8"
                  rx="2"
                />
                <rect
                  x="260"
                  y="504"
                  width="460"
                  height="12"
                  fill="#94a3b8"
                  rx="2"
                />
                <rect
                  x="260"
                  y="526"
                  width="480"
                  height="12"
                  fill="#94a3b8"
                  rx="2"
                />

                <rect
                  x="260"
                  y="570"
                  width="200"
                  height="20"
                  fill="#1e3a8a"
                  fillOpacity="0.1"
                  rx="4"
                />
                <rect
                  x="260"
                  y="600"
                  width="100"
                  height="20"
                  fill="#e2e8f0"
                  rx="4"
                />
                <rect
                  x="370"
                  y="600"
                  width="100"
                  height="20"
                  fill="#e2e8f0"
                  rx="4"
                />
                <rect
                  x="480"
                  y="600"
                  width="100"
                  height="20"
                  fill="#e2e8f0"
                  rx="4"
                />
                <rect
                  x="590"
                  y="600"
                  width="100"
                  height="20"
                  fill="#e2e8f0"
                  rx="4"
                />

                <rect
                  x="260"
                  y="640"
                  width="200"
                  height="20"
                  fill="#1e3a8a"
                  fillOpacity="0.1"
                  rx="4"
                />
                <rect x="260" y="670" width="500" height="2" fill="#e2e8f0" />
                <rect
                  x="260"
                  y="682"
                  width="500"
                  height="12"
                  fill="#94a3b8"
                  rx="2"
                />
                <rect
                  x="260"
                  y="704"
                  width="480"
                  height="12"
                  fill="#94a3b8"
                  rx="2"
                />
                <rect
                  x="260"
                  y="726"
                  width="460"
                  height="12"
                  fill="#94a3b8"
                  rx="2"
                />
              </svg>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                <p className="font-medium">Modern Professional Template</p>
                <p className="text-sm text-gray-200">
                  Perfect for creative professionals
                </p>
              </div>
            </div>

            {/* Floating UI elements */}
            <div className="absolute -top-6 -right-6 bg-purple-100 rounded-full p-4 shadow-lg hidden md:block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-indigo-100 rounded-xl p-3 shadow-lg rotate-6 hidden md:block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
