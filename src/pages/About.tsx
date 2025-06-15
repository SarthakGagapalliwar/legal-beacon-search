
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, Search, Upload, Users, BookOpen, Shield } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Search,
      title: "Advanced Search",
      description: "Search through thousands of cases using keywords, act names, sections, and advanced filters."
    },
    {
      icon: Upload,
      title: "Easy Upload",
      description: "Contribute to the database by uploading new cases with our intuitive document processing system."
    },
    {
      icon: Scale,
      title: "Comprehensive Database",
      description: "Access landmark cases, recent judgments, and legal precedents from all major courts."
    },
    {
      icon: Users,
      title: "Professional Community",
      description: "Join thousands of legal professionals who rely on our platform for their research needs."
    },
    {
      icon: BookOpen,
      title: "Detailed Case Information",
      description: "Get complete case details including citations, court information, and comprehensive summaries."
    },
    {
      icon: Shield,
      title: "Verified Content",
      description: "All cases are verified and properly categorized to ensure accuracy and reliability."
    }
  ];

  const stats = [
    { label: "Total Cases", value: "10,000+" },
    { label: "Acts Covered", value: "500+" },
    { label: "Active Users", value: "5,000+" },
    { label: "Daily Searches", value: "15,000+" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="legal-text-gradient">About LegalSearch</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              LegalSearch is a comprehensive case law database designed to empower legal professionals 
              with instant access to verified legal precedents, landmark cases, and recent judgments.
            </p>
          </div>

          {/* Mission Statement */}
          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">Our Mission</CardTitle>
              <CardDescription className="text-lg">
                To democratize access to legal knowledge and make legal research efficient, 
                accurate, and accessible to all legal professionals.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center bg-white/80 backdrop-blur border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-legal-600 mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Section */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Platform Features</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover the powerful tools and features that make legal research faster and more efficient
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="bg-white/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-legal-100 rounded-lg">
                        <feature.icon className="w-6 h-6 text-legal-600" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Technology Stack */}
          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center mb-4">Built with Modern Technology</CardTitle>
              <CardDescription className="text-center">
                Our platform leverages cutting-edge technology to ensure fast, reliable, and secure access to legal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-center gap-3">
                <Badge variant="outline" className="bg-blue-50 border-blue-200">React</Badge>
                <Badge variant="outline" className="bg-blue-50 border-blue-200">TypeScript</Badge>
                <Badge variant="outline" className="bg-blue-50 border-blue-200">Tailwind CSS</Badge>
                <Badge variant="outline" className="bg-blue-50 border-blue-200">Advanced Search</Badge>
                <Badge variant="outline" className="bg-blue-50 border-blue-200">OCR Processing</Badge>
                <Badge variant="outline" className="bg-blue-50 border-blue-200">Document Analysis</Badge>
                <Badge variant="outline" className="bg-blue-50 border-blue-200">Cloud Storage</Badge>
                <Badge variant="outline" className="bg-blue-50 border-blue-200">Real-time Updates</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Contact/Support Section */}
          <Card className="bg-gradient-to-r from-legal-600 to-legal-700 text-white border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-4">Need Help or Have Questions?</CardTitle>
              <CardDescription className="text-legal-100">
                Our team is here to support your legal research needs. Contact us for assistance or to learn more about our platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <h4 className="font-semibold mb-2">Email Support</h4>
                  <p className="text-legal-200">support@legalsearch.com</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Phone Support</h4>
                  <p className="text-legal-200">+91 (800) 123-4567</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Documentation</h4>
                  <p className="text-legal-200">help.legalsearch.com</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default About;
