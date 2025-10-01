"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function TermsPage() {
	const router = useRouter()
	const { isAuthenticated } = useAuth()
	return (
		<div className="min-h-screen bg-gradient-to-br from-[#F4F3EC] via-[#D2CDB9] to-[#92A378]">
			<header className="bg-white/90 backdrop-blur-sm border-b border-border sticky top-0 z-50">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
								<FileText className="w-6 h-6 text-primary-foreground" />
							</div>
							<div>
								<h1 className="text-2xl font-bold text-primary font-[family-name:var(--font-heading)]">Terms of Service</h1>
								<p className="text-xs text-muted-foreground">Please read these terms carefully</p>
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
							<CardTitle className="text-3xl font-[family-name:var(--font-heading)]">Acceptance of Terms</CardTitle>
						</CardHeader>
						<CardContent className="leading-relaxed text-muted-foreground space-y-4">
							<p>By accessing or using Alturos Health services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, you may not use the services.</p>
						</CardContent>
					</Card>

					<Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="font-[family-name:var(--font-heading)]">Use of Services</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3 text-muted-foreground">
							<ul className="list-disc pl-6 space-y-2">
								<li>You must provide accurate information and maintain account security.</li>
								<li>You will use services only for lawful, personal, and non-commercial purposes.</li>
								<li>We may modify, suspend, or discontinue services at any time.</li>
							</ul>
						</CardContent>
					</Card>

					<Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="font-[family-name:var(--font-heading)]">Medical Disclaimer</CardTitle>
						</CardHeader>
						<CardContent className="text-muted-foreground space-y-3">
							<p>Our services support communication with licensed healthcare providers. We do not replace emergency medical care. For emergencies, call 911 immediately.</p>
						</CardContent>
					</Card>

					<Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="font-[family-name:var(--font-heading)]">Limitation of Liability</CardTitle>
						</CardHeader>
						<CardContent className="text-muted-foreground space-y-3">
							<p>To the fullest extent permitted by law, Alturos Health is not liable for any indirect, incidental, or consequential damages arising from your use of the services.</p>
						</CardContent>
					</Card>

					<Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="font-[family-name:var(--font-heading)]">Changes</CardTitle>
						</CardHeader>
						<CardContent className="text-muted-foreground">
							<p>We may update these Terms from time to time. Continued use constitutes acceptance of the updated Terms.</p>
						</CardContent>
					</Card>
				</div>
			</section>
		</div>
	)
}
