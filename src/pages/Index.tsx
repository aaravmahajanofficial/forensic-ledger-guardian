import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LoginForm from "@/components/auth/LoginForm";
import { motion } from "framer-motion";
import {
  Shield,
  FileCheck,
  Lock,
  Database,
  Server,
  CheckCircle,
  ArrowRight,
  Users,
  Scale,
  FileSearch,
  ClipboardCheck,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Forensic Ledger Guardian</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" onClick={() => scrollToSection('features')} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</a>
              <a href="#how-it-works" onClick={() => scrollToSection('how-it-works')} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">How It Works</a>
              <a href="#roles" onClick={() => scrollToSection('roles')} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Roles</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <a href="#login">Log In</a>
              </Button>
              <Button asChild>
                <a href="#login">Get Started <ArrowRight className="ml-2 h-4 w-4" /></a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/5 via-background to-background">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <Sparkles className="absolute top-1/4 left-1/4 w-64 h-64 text-primary/5 animate-pulse" />
              <Sparkles className="absolute bottom-1/4 right-1/4 w-64 h-64 text-secondary/5 animate-pulse" />
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <Badge variant="secondary" className="mb-4">Built on Blockchain for Unmatched Security</Badge>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">The Future of Forensic Evidence Management</h1>
              <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">Ensure the integrity of digital evidence from collection to courtroom with our secure, transparent, and immutable ledger system.</p>
              <div className="mt-8 flex justify-center gap-4">
                <Button size="lg" asChild>
                  <a href="#login">Request a Demo <ChevronRight className="ml-2 h-5 w-5" /></a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#features">Learn More</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Core Features</h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">Everything you need for a secure and transparent chain of custody.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard icon={Lock} title="Immutable Ledger" description="Every action is recorded on a tamper-proof blockchain, creating an unbreakable chain of custody." />
              <FeatureCard icon={FileCheck} title="Verifiable Integrity" description="Cryptographic hashing ensures that evidence remains unaltered, with verification possible at any stage." />
              <FeatureCard icon={Shield} title="Role-Based Access" description="Granular permissions control who can view, manage, or verify evidence, enhancing security." />
              <FeatureCard icon={Database} title="Decentralized Storage" description="Evidence metadata is stored on-chain, while files are secured in a decentralized network (IPFS)." />
              <FeatureCard icon={Server} title="Comprehensive Auditing" description="Generate detailed audit trails for legal proceedings, proving compliance and integrity." />
              <FeatureCard icon={ClipboardCheck} title="Automated Workflows" description="Streamline evidence submission, tracking, and reporting for maximum efficiency." />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-primary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">A Simple, Secure Process</h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">Follow our straightforward process for evidence management.</p>
            </div>
            <div className="relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2"></div>
              <div className="grid md:grid-cols-3 gap-12 relative">
                <HowItWorksStep number="1" title="Submit Evidence" description="Officers upload evidence files and metadata through a secure portal." />
                <HowItWorksStep number="2" title="Record on Blockchain" description="A unique hash is generated and stored on the blockchain, creating an immutable record." />
                <HowItWorksStep number="3" title="Verify & Access" description="Authorized personnel can access and verify the evidence integrity against the blockchain record." />
              </div>
            </div>
          </div>
        </section>

        {/* Roles Section */}
        <section id="roles" className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Built for Every Role in the Justice System</h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">Tailored dashboards and features for all key personnel.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <RoleCard icon={Users} title="Police Officers" description="Securely submit and manage evidence from the field." />
              <RoleCard icon={FileSearch} title="Forensic Experts" description="Analyze evidence with confidence in its integrity." />
              <RoleCard icon={Scale} title="Lawyers & Judiciary" description="Access a transparent and verifiable chain of custody for court proceedings." />
              <RoleCard icon={Shield} title="System Administrators" description="Oversee the platform, manage users, and ensure compliance." />
            </div>
          </div>
        </section>

        {/* Login/CTA Section */}
        <section id="login" className="py-20 bg-gradient-to-br from-primary/5 via-background to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Take Control of Your Evidence</h2>
                <p className="mt-4 text-muted-foreground">Log in to access your dashboard or contact us to get started with the most secure evidence management platform available.</p>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start"><CheckCircle className="h-6 w-6 text-success mr-3 mt-1 flex-shrink-0" /><span>**Immutable Chain of Custody:** Full transparency and accountability.</span></li>
                  <li className="flex items-start"><CheckCircle className="h-6 w-6 text-success mr-3 mt-1 flex-shrink-0" /><span>**Court-Ready Audit Trails:** Simplify legal preparations and reporting.</span></li>
                  <li className="flex items-start"><CheckCircle className="h-6 w-6 text-success mr-3 mt-1 flex-shrink-0" /><span>**Enhanced Security:** Protect sensitive data with cutting-edge technology.</span></li>
                </ul>
              </div>
              <Card className="bg-card shadow-2xl shadow-primary/10">
                <CardHeader>
                  <CardTitle>Secure Portal Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <LoginForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Forensic Ledger Guardian. All Rights Reserved.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
  <Card className="text-center bg-card hover:border-primary transition-colors">
    <CardHeader>
      <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <CardTitle className="mt-4">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const HowItWorksStep = ({ number, title, description }: { number: string, title: string, description: string }) => (
  <div className="text-center relative md:p-6">
    <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary text-primary-foreground rounded-full text-2xl font-bold border-4 border-background shadow-lg">{number}</div>
    <h3 className="mt-6 text-xl font-semibold">{title}</h3>
    <p className="mt-2 text-muted-foreground">{description}</p>
  </div>
);

const RoleCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
  <Card className="text-center bg-card hover:border-primary transition-colors">
    <CardHeader>
      <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <CardTitle className="mt-4">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default Index;
