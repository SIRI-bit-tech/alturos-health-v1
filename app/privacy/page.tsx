"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function PrivacyPolicyPage() {
	const router = useRouter()
	const { isAuthenticated } = useAuth()

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#F4F3EC] via-[#D2CDB9] to-[#92A378]">
			<header className="bg-white/90 backdrop-blur-sm border-b border-border sticky top-0 z-50">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
								<Shield className="w-6 h-6 text-primary-foreground" />
							</div>
							<div>
								<h1 className="text-2xl font-bold text-primary font-[family-name:var(--font-heading)]">Privacy Policy</h1>
								<p className="text-xs text-muted-foreground">Your privacy is important to us</p>
							</div>
						</div>
						<Button variant="outline" size="sm" onClick={() => router.push(isAuthenticated ? '/dashboard' : '/')}> 
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Home
						</Button>
					</div>
				</div>
			</header>

			<section className="py-16 px-4">
				<div className="container mx-auto max-w-4xl space-y-8">
					<Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="text-3xl font-[family-name:var(--font-heading)]">Overview</CardTitle>
						</CardHeader>
						<CardContent className="leading-relaxed text-muted-foreground space-y-4">
							<p>Alturos Health ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services and website.</p>
							<p>By using our services, you agree to the collection and use of information in accordance with this policy.</p>
						</CardContent>
					</Card>

					<Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="font-[family-name:var(--font-heading)]">Information We Collect</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3 text-muted-foreground">
							<ul className="list-disc pl-6 space-y-2">
								<li>Personal identification information (name, email, phone)</li>
								<li>Health information you choose to share for care delivery</li>
								<li>Appointment details and communications</li>
								<li>Device and usage data (browser, IP, pages viewed)</li>
							</ul>
						</CardContent>
					</Card>

					<Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="font-[family-name:var(--font-heading)]">How We Use Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3 text-muted-foreground">
							<ul className="list-disc pl-6 space-y-2">
								<li>Provide and improve medical and telehealth services</li>
								<li>Schedule appointments and coordinate care</li>
								<li>Communicate updates, notifications, and support</li>
								<li>Maintain security, prevent fraud, and comply with laws</li>
							</ul>
						</CardContent>
					</Card>

					<Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="font-[family-name:var(--font-heading)]">HIPAA & Security</CardTitle>
						</CardHeader>
						<CardContent className="text-muted-foreground space-y-3">
							<p>We maintain administrative, technical, and physical safeguards designed to protect your information as required by HIPAA and applicable regulations. Access to Protected Health Information (PHI) is limited to authorized personnel involved in your care.</p>
						</CardContent>
					</Card>

					<Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="font-[family-name:var(--font-heading)]">Your Rights</CardTitle>
						</CardHeader>
						<CardContent className="text-muted-foreground space-y-2">
							<ul className="list-disc pl-6 space-y-2">
								<li>Access and obtain a copy of your records</li>
								<li>Request corrections to inaccurate information</li>
								<li>Limit or revoke certain permissions where applicable</li>
								<li>File a complaint without fear of retaliation</li>
							</ul>
						</CardContent>
					</Card>

					<Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="font-[family-name:var(--font-heading)]">Contact</CardTitle>
						</CardHeader>
						<CardContent className="text-muted-foreground">
							<p>For privacy questions or requests, contact us at <a className="text-primary underline" href="mailto:privacy@alturoshealth.com">privacy@alturoshealth.com</a>.</p>
						</CardContent>
					</Card>
				</div>
			</section>
		</div>
	)
}
