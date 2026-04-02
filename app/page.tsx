"use client";

import Image from "next/image";
import React, { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [brandName, setBrandName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false)

  const formRef = React.useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, brandName }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Successfully added to waitlist:", data);
        setTimeout(() => {
          setSuccess(true);
          setIsSubmitting(false);
        }, 1000);
      } else {
        console.error("Error:", data.error);
        setIsSubmitting(false);
        alert("Failed to join waitlist. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
      alert("Failed to join waitlist. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-cyan-50 via-blue-50 to-white">
      {/* Header */}
      <div className="sticky top-4 z-30 px-8 lg:px-16">
        {/* Centered header content */}
        <header className="w-fit mx-auto px-8 py-4 bg-white/80 backdrop-blur-2xl rounded-full shadow-xl border border-gray-200">
          <div className="flex items-center justify-center">
            <img
              src="/Pokecut_1775139303164.png"
              alt="ahid logo"
              width={70}
              height={70}
            />
          </div>
        </header>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-8 lg:px-16 pt-12 pb-20 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <div className="flex flex-col gap-8 max-w-xl">
            {/* Heading */}
            <div className="space-y-6">
              <div className="inline-block">
                <span className="bg-lime-100 text-sm text-gray-700 px-4 py-2 rounded-full">
                  Discover brands you can trust ✨
                </span>
              </div>
              <h1 className="text-5xl lg:text-5xl font-bold text-teal-900 leading-tight">
                Discover and connect with trusted local brands
              </h1>
              <p className="text-gray-600 text-base leading-relaxed max-w-md">
                Ahid is the bridge that connects users to the brands they love and trust. Built with the vision of fostering trust and accessibility, Ahid redefines how brands and users interact within a community.
              </p>
              <p className="text-gray-600 text-base leading-relaxed max-w-md">
                We empower brands to present their best, offering tools to analyze user engagement and stand out in their localities. Ahid’s user-focused approach ensures a stress-free experience for discovering verified brands
              </p>
            </div>

            {/* Email Form */}
            {!success ? (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 max-w-lg"
                ref={formRef}
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-6 py-4 rounded-full border-2 border-gray-200 bg-white/60 backdrop-blur-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-teal-400 text-sm"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Brand name (optional)"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="flex-1 px-6 py-4 rounded-full border-2 border-gray-200 bg-white/60 backdrop-blur-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-teal-400 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className={`px-8 py-4 bg-lime-400 hover:bg-lime-500 text-teal-900 rounded-full font-semibold transition-colors text-sm whitespace-nowrap shadow-md cursor-pointer ${isSubmitting ? 'opacity-60' : 'opacity-100'}`}
                  disabled={isSubmitting ? true : false}
                >
                  {!isSubmitting ? 'Join Waitlist ✨' : 'Loading...'}
                </button>
              </form>
            ) : (
              <div className="bg-teal-50 shadow-sm border-1 border-teal-50 rounded-2xl p-6 max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-lime-400 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-teal-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-teal-900 mb-2">
                      Welcome to the party! 🥳
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      You're now on the waitlist! We'll notify you at <span className="font-semibold text-teal-900">{email}</span> when we launch. {brandName && <span>Looking forward to connecting you with <span className="font-semibold text-teal-900">{brandName}</span>!</span>} Get ready to discover amazing local brands!
                    </p>
                  </div>
                </div>
              </div>
            )
            }

            {/* Social Links */}
            <div className="mt-8 space-y-4">
              <p className="text-gray-500 text-sm">Follow our socials</p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition-colors"
                  aria-label="Instagram"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="4"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <circle cx="18" cy="6" r="1" fill="white" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition-colors"
                  aria-label="Facebook"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="white"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition-colors"
                  aria-label="YouTube"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="white"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Content - Phone Mockups */}
          <div className="relative hidden lg:flex items-center justify-center h-[600px] group">
            {/* Main Phone */}
            <div className="absolute right-24 top-1/2 -translate-y-1/2 z-20">
              <div className="w-[280px] h-fit bg-white rounded-[40px] shadow-2xl py-4 px-1 border-8 border-black transition ease-linear duration-100 group-hover:-translate-y-3">
                <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-[32px] overflow-hidden">
                  <Image src="/Home (4).png" width={1480} height={720} alt="home" className="object-cover" />
                </div>
              </div>
            </div>

            {/* Secondary Phones */}
            <div className="absolute rounded-[35px] left-12 top-8 z-10 rotate-[-10deg] transition-all ease-linear duration-100 group-hover:rotate-[-20deg] group-hover:-translate-y-3 group-hover:shadow-2xl">
              <div className="w-[240px] h-fit bg-white rounded-[35px] shadow-xl border-6 border-black">
                <Image src="/Post Review.png" width={1480} height={720} alt="home" className="object-cover rounded-[30px]" />
              </div>
            </div>

            <div className="absolute right-0 translate-x-8 bottom-12 z-10 rotate-[10deg] transition-all ease-linear duration-100 group-hover:rotate-[20deg] group-hover:-translate-y-3 group-hover:shadow-2xl rounded-[32px]">
              <div className="w-[220px] h-fit bg-white rounded-[32px] shadow-xl py-3 px-1 border-6 border-black">
                <Image src="/Brand Profile.png" width={1480} height={720} alt="home" className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
