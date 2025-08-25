"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, ArrowLeft, HeartPulse, Stethoscope, Award, Globe, Shield, Clock, Target, TrendingUp, CheckCircle, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function AboutPage() {
	const router = useRouter()
	
	const stats = [
		{ number: "50,000+", label: "Patients Served", icon: Users },
		{ number: "500+", label: "Healthcare Providers", icon: Stethoscope },
		{ number: "99.9%", label: "Uptime", icon: Shield },
		{ number: "24/7", label: "Support Available", icon: Clock }
	]

	const values = [
		{
			icon: HeartPulse,
			title: "Patient-Centered Care",
			description: "Every decision we make prioritizes patient outcomes, comfort, and experience. We believe healthcare should be as personal as it is professional."
		},
		{
			icon: Shield,
			title: "Security & Privacy",
			description: "HIPAA compliance and enterprise-grade security are non-negotiable. Your health information is protected with the highest standards."
		},
		{
			icon: Target,
			title: "Innovation & Excellence",
			description: "We continuously evolve our platform using cutting-edge technology to deliver the best possible healthcare experience."
		},
		{
			icon: Users,
			title: "Collaborative Care",
			description: "We believe in the power of teamwork between patients, providers, and technology to achieve optimal health outcomes."
		}
	]

	const milestones = [
		{ year: "2020", title: "Company Founded", description: "Alturos Health was established with a vision to revolutionize healthcare delivery" },
		{ year: "2021", title: "First 1000 Patients", description: "Reached our first major milestone serving patients across multiple states" },
		{ year: "2022", title: "HIPAA Certification", description: "Achieved full HIPAA compliance and security certifications" },
		{ year: "2023", title: "National Expansion", description: "Expanded services to cover 25+ states with 500+ providers" },
		{ year: "2024", title: "AI Integration", description: "Launched AI-powered symptom assessment and appointment optimization" }
	]

	const team = [
		{ name: "Dr. Sarah Chen", role: "Chief Medical Officer", specialty: "Internal Medicine", experience: "15+ years" },
		{ name: "Michael Rodriguez", role: "Chief Technology Officer", specialty: "Healthcare Technology", experience: "20+ years" },
		{ name: "Dr. James Thompson", role: "Head of Clinical Operations", specialty: "Emergency Medicine", experience: "12+ years" },
		{ name: "Lisa Park", role: "VP of Patient Experience", specialty: "Healthcare Administration", experience: "18+ years" }
	]

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#F4F3EC] via-[#D2CDB9] to-[#92A378]">
			{/* Header */}
			<header className="bg-white/90 backdrop-blur-sm border-b border-border sticky top-0 z-50">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
								<Users className="w-6 h-6 text-primary-foreground" />
							</div>
							<div>
								<h1 className="text-2xl font-bold text-primary font-[family-name:var(--font-heading)]">About Alturos Health</h1>
								<p className="text-xs text-muted-foreground">Our mission, values, and journey</p>
							</div>
						</div>
						<Button variant="outline" size="sm" onClick={() => router.push('/')}> 
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Home
						</Button>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="py-20 px-4">
				<div className="container mx-auto text-center">
					<h2 className="text-5xl md:text-6xl font-bold text-primary mb-8 font-[family-name:var(--font-heading)]">
						Revolutionizing Healthcare
					</h2>
					<p className="text-xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
						We're building the future of healthcare delivery, where technology meets compassion, 
						accessibility meets excellence, and every patient receives the care they deserve.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button size="lg" className="text-lg px-8 py-6" onClick={() => router.push('/')}>
							<HeartPulse className="w-5 h-5 mr-2" />
							Book Your First Visit
						</Button>
						<Button variant="outline" size="lg" className="text-lg px-8 py-6">
							<Users className="w-5 h-5 mr-2" />
							Join Our Team
						</Button>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-16 px-4 bg-white/50 backdrop-blur-sm">
				<div className="container mx-auto">
					<div className="grid md:grid-cols-4 gap-8">
						{stats.map((stat, index) => (
							<Card key={index} className="border-0 shadow-xl bg-white/80 backdrop-blur-sm text-center">
								<CardContent className="p-8">
									<div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
										<stat.icon className="w-8 h-8 text-primary" />
									</div>
									<div className="text-3xl font-bold text-primary mb-2 font-[family-name:var(--font-heading)]">
										{stat.number}
									</div>
									<div className="text-muted-foreground font-medium">
										{stat.label}
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Mission & Vision */}
			<section className="py-20 px-4">
				<div className="container mx-auto max-w-6xl">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						<div>
							<h3 className="text-4xl font-bold text-primary mb-8 font-[family-name:var(--font-heading)]">
								Our Mission & Vision
							</h3>
							<div className="space-y-6">
								<div>
									<h4 className="text-2xl font-semibold mb-4 flex items-center gap-3">
										<Target className="w-6 h-6 text-primary" />
										Mission
									</h4>
									<p className="text-muted-foreground leading-relaxed text-lg">
										To democratize access to high-quality healthcare by leveraging technology to connect patients 
										with exceptional providers, regardless of geographic or economic barriers.
									</p>
								</div>
								<div>
									<h4 className="text-2xl font-semibold mb-4 flex items-center gap-3">
										<Globe className="w-6 h-6 text-primary" />
										Vision
									</h4>
									<p className="text-muted-foreground leading-relaxed text-lg">
										A world where every individual has seamless access to personalized, compassionate healthcare 
										that adapts to their lifestyle and needs.
									</p>
								</div>
							</div>
						</div>
						<div className="relative">
							<div className="w-full h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
								<div className="text-center">
									<HeartPulse className="w-24 h-24 text-primary mx-auto mb-4" />
									<p className="text-primary font-semibold text-lg">Healthcare Innovation</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Values Section */}
			<section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
				<div className="container mx-auto">
					<div className="text-center mb-16">
						<h3 className="text-4xl font-bold text-primary mb-6 font-[family-name:var(--font-heading)]">
							Our Core Values
						</h3>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
							These principles guide every decision we make and every interaction we have
						</p>
					</div>
					<div className="grid md:grid-cols-2 gap-8">
						{values.map((value, index) => (
							<Card key={index} className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
								<CardContent className="p-8">
									<div className="flex items-start space-x-4">
										<div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
											<value.icon className="w-8 h-8 text-primary" />
										</div>
										<div>
											<h4 className="text-xl font-semibold mb-3 font-[family-name:var(--font-heading)]">
												{value.title}
											</h4>
											<p className="text-muted-foreground leading-relaxed">
												{value.description}
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Journey Timeline */}
			<section className="py-20 px-4">
				<div className="container mx-auto max-w-4xl">
					<div className="text-center mb-16">
						<h3 className="text-4xl font-bold text-primary mb-6 font-[family-name:var(--font-heading)]">
							Our Journey
						</h3>
						<p className="text-xl text-muted-foreground">
							From startup to healthcare leader - our story of growth and innovation
						</p>
					</div>
					<div className="space-y-8">
						{milestones.map((milestone, index) => (
							<Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
								<CardContent className="p-6">
									<div className="flex items-center space-x-6">
										<div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
											<span className="text-2xl font-bold text-primary">{milestone.year}</span>
										</div>
										<div>
											<h4 className="text-xl font-semibold mb-2 font-[family-name:var(--font-heading)]">
												{milestone.title}
											</h4>
											<p className="text-muted-foreground">
												{milestone.description}
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Leadership Team */}
			<section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
				<div className="container mx-auto">
					<div className="text-center mb-16">
						<h3 className="text-4xl font-bold text-primary mb-6 font-[family-name:var(--font-heading)]">
							Leadership Team
						</h3>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
							Meet the experienced professionals driving our mission forward
						</p>
					</div>
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{team.map((member, index) => (
							<Card key={index} className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
								<CardContent className="p-6 text-center">
									<div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
										<Users className="w-12 h-12 text-primary" />
									</div>
									<h4 className="font-semibold text-lg mb-1 font-[family-name:var(--font-heading)]">
										{member.name}
									</h4>
									<p className="text-primary font-medium mb-2">{member.role}</p>
									<p className="text-sm text-muted-foreground mb-1">{member.specialty}</p>
									<p className="text-xs text-muted-foreground">{member.experience}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Why Choose Us */}
			<section className="py-20 px-4">
				<div className="container mx-auto max-w-6xl">
					<div className="text-center mb-16">
						<h3 className="text-4xl font-bold text-primary mb-6 font-[family-name:var(--font-heading)]">
							Why Choose Alturos Health?
						</h3>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
							Discover what makes us different and why thousands of patients trust us with their care
						</p>
					</div>
					<div className="grid md:grid-cols-2 gap-8">
						<div className="space-y-6">
							<div className="flex items-start space-x-4">
								<CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
								<div>
									<h4 className="font-semibold text-lg mb-2">Proven Track Record</h4>
									<p className="text-muted-foreground">Over 50,000 successful patient interactions and growing</p>
								</div>
							</div>
							<div className="flex items-start space-x-4">
								<CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
								<div>
									<h4 className="font-semibold text-lg mb-2">Technology First</h4>
									<p className="text-muted-foreground">AI-powered platform with 99.9% uptime and seamless experience</p>
								</div>
							</div>
							<div className="flex items-start space-x-4">
								<CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
								<div>
									<h4 className="font-semibold text-lg mb-2">Expert Providers</h4>
									<p className="text-muted-foreground">Network of 500+ board-certified healthcare professionals</p>
								</div>
							</div>
						</div>
						<div className="space-y-6">
							<div className="flex items-start space-x-4">
								<CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
								<div>
									<h4 className="font-semibold text-lg mb-2">24/7 Availability</h4>
									<p className="text-muted-foreground">Round-the-clock support and emergency care coordination</p>
								</div>
							</div>
							<div className="flex items-start space-x-4">
								<CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
								<div>
									<h4 className="font-semibold text-lg mb-2">HIPAA Compliant</h4>
									<p className="text-muted-foreground">Enterprise-grade security protecting your health information</p>
								</div>
							</div>
							<div className="flex items-start space-x-4">
								<CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
								<div>
									<h4 className="font-semibold text-lg mb-2">Cost Effective</h4>
									<p className="text-muted-foreground">Transparent pricing with insurance integration and flexible payment options</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 px-4">
				<div className="container mx-auto text-center">
					<Card className="border-0 shadow-xl bg-primary text-primary-foreground max-w-4xl mx-auto">
						<CardContent className="py-16">
							<h3 className="text-4xl font-bold mb-6 font-[family-name:var(--font-heading)]">
								Join the Future of Healthcare
							</h3>
							<p className="text-xl mb-8 opacity-90">
								Experience the difference that technology-driven, patient-centered care can make in your health journey.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button variant="secondary" size="lg" className="text-lg px-8 py-6" onClick={() => router.push('/')}>
									<HeartPulse className="w-5 h-5 mr-2" />
									Get Started Today
								</Button>
								<Button
									variant="outline"
									size="lg"
									className="text-lg px-8 py-6 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
									onClick={() => router.push('/contact')}
								>
									<Users className="w-5 h-5 mr-2" />
									Contact Our Team
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</section>
		</div>
	)
}
