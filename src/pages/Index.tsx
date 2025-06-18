import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LoginForm from "@/components/auth/LoginForm";
import {
  Shield,
  FileCheck,
  Lock,
  Database,
  Server,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Users,
  Scale,
  FileSearch,
  ClipboardCheck,
  Sparkles,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

const Index = () => {
  // Scroll to section if hash in URL
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, []);

  // Function to handle scrolling to sections
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-forensic-800 to-forensic-900 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-forensic-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-forensic-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/2 w-48 h-48 bg-forensic-evidence/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-forensic-accent to-forensic-evidence rounded-md overflow-hidden">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">
              ForensicChain
            </span>
          </div>
          <nav className="hidden md:flex space-x-8 items-center">
            <button
              onClick={() => scrollToSection("features")}
              className="text-forensic-300 hover:text-white transition-colors flex items-center gap-1"
            >
              <Sparkles className="h-4 w-4" />
              <span>Features</span>
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-forensic-300 hover:text-white transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("security")}
              className="text-forensic-300 hover:text-white transition-colors"
            >
              Security
            </button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-forensic-accent text-forensic-accent hover:bg-forensic-accent/10"
            >
              <Link to="/dashboard">Access System</Link>
            </Button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" className="text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-12 md:py-16">
          {/* Hero Content */}
          <div className="space-y-8 flex flex-col justify-center">
            <div className="space-y-6">
              <div className="bg-forensic-accent/20 text-forensic-accent inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
                <Lock className="w-4 h-4 mr-1" />
                <span>Blockchain-Powered Security</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
                Digital Evidence
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-forensic-accent to-forensic-evidence block">
                  Management System
                </span>
              </h1>

              <p className="text-lg text-forensic-300 max-w-lg leading-relaxed">
                Secure, transparent, and tamper-proof digital evidence
                management for law enforcement and legal professionals powered
                by blockchain technology.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                asChild
                size="lg"
                className="bg-forensic-accent hover:bg-forensic-accent/90 group"
              >
                <Link to="/dashboard">
                  <span>Access System</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent text-white border-forensic-400 hover:bg-forensic-800"
                onClick={() => scrollToSection("features")}
              >
                Learn More
              </Button>
            </div>

            <div className="pt-6 border-t border-forensic-700 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center space-x-2 p-2 rounded-md bg-forensic-accent/5 backdrop-blur-sm">
                <CheckCircle className="h-5 w-5 text-forensic-accent flex-shrink-0" />
                <span className="text-forensic-300 text-sm">
                  Tamper-proof Records
                </span>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-md bg-forensic-accent/5 backdrop-blur-sm">
                <CheckCircle className="h-5 w-5 text-forensic-accent flex-shrink-0" />
                <span className="text-forensic-300 text-sm">
                  Immutable Chain-of-Custody
                </span>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-md bg-forensic-accent/5 backdrop-blur-sm">
                <CheckCircle className="h-5 w-5 text-forensic-accent flex-shrink-0" />
                <span className="text-forensic-300 text-sm">
                  Court-Admissible Evidence
                </span>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className="flex justify-center items-center">
            <div className="w-full max-w-md p-1 bg-gradient-to-r from-forensic-accent to-forensic-evidence rounded-lg">
              <div className="bg-forensic-900 p-6 md:p-8 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Access the Platform
                </h2>
                <LoginForm />
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 scroll-mt-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-forensic-300 max-w-2xl mx-auto">
              Our blockchain-powered platform streamlines the entire digital
              evidence lifecycle from collection to courtroom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Process Step 1 */}
            <div className="relative">
              <div className="bg-forensic-800/60 backdrop-blur-sm p-6 rounded-lg border border-forensic-700 h-full">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-forensic-accent to-forensic-evidence rounded-lg flex items-center justify-center font-bold text-white">
                  1
                </div>
                <h3 className="text-xl font-bold text-white mb-4 mt-2">
                  Evidence Collection
                </h3>
                <p className="text-forensic-300">
                  Digital evidence is securely collected and uploaded to the
                  platform with cryptographic hashing.
                </p>
              </div>

              {/* Fixed arrow positioning for desktop */}
              <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                <ChevronRight className="w-8 h-8 text-forensic-accent" />
              </div>
            </div>

            {/* Process Step 2 */}
            <div className="relative">
              <div className="bg-forensic-800/60 backdrop-blur-sm p-6 rounded-lg border border-forensic-700 h-full">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-forensic-accent to-forensic-evidence rounded-lg flex items-center justify-center font-bold text-white">
                  2
                </div>
                <h3 className="text-xl font-bold text-white mb-4 mt-2">
                  Blockchain Registration
                </h3>
                <p className="text-forensic-300">
                  Evidence metadata and hash are recorded on the blockchain,
                  creating an immutable timestamp.
                </p>
              </div>

              {/* Fixed arrow positioning for desktop */}
              <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                <ChevronRight className="w-8 h-8 text-forensic-accent" />
              </div>
            </div>

            {/* Process Step 3 */}
            <div className="relative">
              <div className="bg-forensic-800/60 backdrop-blur-sm p-6 rounded-lg border border-forensic-700 h-full">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-forensic-accent to-forensic-evidence rounded-lg flex items-center justify-center font-bold text-white">
                  3
                </div>
                <h3 className="text-xl font-bold text-white mb-4 mt-2">
                  Forensic Analysis
                </h3>
                <p className="text-forensic-300">
                  Authorized forensic experts analyze evidence with every action
                  transparently recorded.
                </p>
              </div>

              {/* Fixed arrow positioning for desktop */}
              <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                <ChevronRight className="w-8 h-8 text-forensic-accent" />
              </div>
            </div>

            {/* Process Step 4 */}
            <div className="relative">
              <div className="bg-forensic-800/60 backdrop-blur-sm p-6 rounded-lg border border-forensic-700 h-full">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-forensic-accent to-forensic-evidence rounded-lg flex items-center justify-center font-bold text-white">
                  4
                </div>
                <h3 className="text-xl font-bold text-white mb-4 mt-2">
                  Court Presentation
                </h3>
                <p className="text-forensic-300">
                  Complete chain-of-custody reports are generated for court,
                  verifiable by all parties.
                </p>
              </div>
            </div>

            {/* Mobile step connectors */}
            <div className="lg:hidden flex justify-center col-span-1 md:col-span-2">
              <div className="w-0.5 h-8 bg-forensic-700"></div>
            </div>
            <div className="lg:hidden flex justify-center col-span-1 md:hidden">
              <div className="w-0.5 h-8 bg-forensic-700"></div>
            </div>
            <div className="lg:hidden flex justify-center col-span-1 md:col-span-2">
              <div className="w-0.5 h-8 bg-forensic-700"></div>
            </div>
          </div>

          <div className="flex justify-center mt-12">
            <Button
              asChild
              variant="outline"
              className="border-forensic-accent text-forensic-accent hover:bg-forensic-accent/10"
            >
              <Link to="/help">
                <span>Learn more about the process</span>
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 scroll-mt-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Key Features</h2>
            <p className="text-forensic-300 max-w-2xl mx-auto">
              Our blockchain-based system revolutionizes how digital evidence is
              managed throughout the investigative process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-forensic-800/50 p-8 rounded-lg border border-forensic-700 hover:border-forensic-accent transition-colors group">
              <div className="p-3 bg-forensic-accent/10 inline-block rounded-lg mb-4 group-hover:bg-forensic-accent/20 transition-colors">
                <Shield className="h-6 w-6 text-forensic-accent" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Immutable Evidence Records
              </h3>
              <p className="text-forensic-300">
                Once evidence is registered, it cannot be deleted or modified,
                ensuring complete integrity and authenticity.
              </p>
            </div>

            <div className="bg-forensic-800/50 p-8 rounded-lg border border-forensic-700 hover:border-forensic-accent transition-colors group">
              <div className="p-3 bg-forensic-accent/10 inline-block rounded-lg mb-4 group-hover:bg-forensic-accent/20 transition-colors">
                <Lock className="h-6 w-6 text-forensic-accent" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Secure Chain of Custody
              </h3>
              <p className="text-forensic-300">
                Every interaction with evidence is recorded on the blockchain,
                creating a transparent and verifiable custody trail.
              </p>
            </div>

            <div className="bg-forensic-800/50 p-8 rounded-lg border border-forensic-700 hover:border-forensic-accent transition-colors group">
              <div className="p-3 bg-forensic-accent/10 inline-block rounded-lg mb-4 group-hover:bg-forensic-accent/20 transition-colors">
                <Database className="h-6 w-6 text-forensic-accent" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Decentralized Storage
              </h3>
              <p className="text-forensic-300">
                Evidence is stored on IPFS, providing resilient and distributed
                storage that prevents single points of failure.
              </p>
            </div>

            <div className="bg-forensic-800/50 p-8 rounded-lg border border-forensic-700 hover:border-forensic-accent transition-colors group">
              <div className="p-3 bg-forensic-accent/10 inline-block rounded-lg mb-4 group-hover:bg-forensic-accent/20 transition-colors">
                <FileCheck className="h-6 w-6 text-forensic-accent" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Cryptographic Verification
              </h3>
              <p className="text-forensic-300">
                SHA-256 hash verification ensures evidence integrity and allows
                for easy detection of any tampering attempts.
              </p>
            </div>

            <div className="bg-forensic-800/50 p-8 rounded-lg border border-forensic-700 hover:border-forensic-accent transition-colors group">
              <div className="p-3 bg-forensic-accent/10 inline-block rounded-lg mb-4 group-hover:bg-forensic-accent/20 transition-colors">
                <Server className="h-6 w-6 text-forensic-accent" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Role-Based Access
              </h3>
              <p className="text-forensic-300">
                Granular permissions ensure that only authorized personnel can
                access, modify, or manage specific cases and evidence.
              </p>
            </div>

            <div className="bg-forensic-800/50 p-8 rounded-lg border border-forensic-700 hover:border-forensic-accent transition-colors group">
              <div className="p-3 bg-forensic-accent/10 inline-block rounded-lg mb-4 group-hover:bg-forensic-accent/20 transition-colors">
                <ClipboardCheck className="h-6 w-6 text-forensic-accent" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Court-Ready Reports
              </h3>
              <p className="text-forensic-300">
                Generate comprehensive verification reports suitable for court
                submission with complete custody trail.
              </p>
            </div>
          </div>
        </section>

        {/* Role-Based Access Section */}
        <section id="security" className="py-20 scroll-mt-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Role-Based Access
            </h2>
            <p className="text-forensic-300 max-w-2xl mx-auto">
              Our platform serves the entire judicial ecosystem with specialized
              interfaces for each role.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-forensic-800/50 to-forensic-800/70 backdrop-blur-sm p-8 rounded-lg border border-forensic-700">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-forensic-accent/10 inline-block rounded-full mr-4">
                  <Shield className="h-6 w-6 text-forensic-accent" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Law Enforcement
                </h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-forensic-accent mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-forensic-300">
                    FIR registration and management
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-forensic-accent mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-forensic-300">
                    Evidence collection and upload
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-forensic-accent mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-forensic-300">
                    Case management and tracking
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-forensic-800/50 to-forensic-800/70 backdrop-blur-sm p-8 rounded-lg border border-forensic-700">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-forensic-accent/10 inline-block rounded-full mr-4">
                  <FileSearch className="h-6 w-6 text-forensic-accent" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Forensic Experts
                </h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-forensic-accent mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-forensic-300">
                    Evidence analysis and verification
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-forensic-accent mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-forensic-300">
                    Technical report generation
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-forensic-accent mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-forensic-300">
                    Chain of custody confirmation
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-forensic-800/50 to-forensic-800/70 backdrop-blur-sm p-8 rounded-lg border border-forensic-700">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-forensic-accent/10 inline-block rounded-full mr-4">
                  <Scale className="h-6 w-6 text-forensic-accent" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Legal Professionals
                </h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-forensic-accent mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-forensic-300">
                    Legal documentation management
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-forensic-accent mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-forensic-300">
                    Court preparation and evidence review
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-forensic-accent mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-forensic-300">
                    Client management and case tracking
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-forensic-800/50 to-forensic-800/70 backdrop-blur-sm p-8 rounded-lg border border-forensic-700">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-forensic-accent/10 inline-block rounded-full mr-4">
                  <Users className="h-6 w-6 text-forensic-accent" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Court Administration
                </h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-forensic-accent mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-forensic-300">
                    User and role management
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-forensic-accent mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-forensic-300">
                    System configuration and security
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-forensic-accent mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-forensic-300">
                    Audit logs and system reports
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button
              asChild
              size="lg"
              className="bg-forensic-accent hover:bg-forensic-accent/90"
            >
              <Link to="/dashboard">
                <span>Get Started Today</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 my-8">
          <div className="bg-gradient-to-r from-forensic-accent/20 to-forensic-evidence/20 rounded-2xl p-8 md:p-12">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to transform your evidence management?
              </h2>
              <p className="text-forensic-300 mb-8">
                Join the growing network of law enforcement agencies, forensic
                labs, and legal professionals using ForensicChain.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-forensic-900 hover:bg-forensic-100"
                >
                  <Link to="/dashboard">
                    <span>Access Platform</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-transparent text-white border-white hover:bg-white/10"
                >
                  <Link to="/help">
                    <span>Learn More</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-forensic-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-forensic-accent to-forensic-evidence rounded-md overflow-hidden">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-lg text-white">
                  ForensicChain
                </span>
              </div>
              <p className="text-forensic-400 text-sm">
                Blockchain-based digital evidence management for law enforcement
                and legal professionals.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/dashboard"
                    className="text-forensic-400 hover:text-forensic-accent text-sm"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/help"
                    className="text-forensic-400 hover:text-forensic-accent text-sm"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/help/faq"
                    className="text-forensic-400 hover:text-forensic-accent text-sm"
                  >
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="text-forensic-400 text-sm">
                  support@forensicchain.com
                </li>
                <li className="text-forensic-400 text-sm">+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-forensic-800 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-forensic-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} ForensicChain. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <Link
                to="#"
                className="text-forensic-400 hover:text-forensic-accent"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link
                to="#"
                className="text-forensic-400 hover:text-forensic-accent"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link
                to="#"
                className="text-forensic-400 hover:text-forensic-accent"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link
                to="#"
                className="text-forensic-400 hover:text-forensic-accent"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
